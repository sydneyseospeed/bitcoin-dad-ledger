// Portfolio Insights for Bitcoin Dad Ledger

// Prevent redeclaration
if (typeof PortfolioInsights !== 'undefined') {
    console.warn('PortfolioInsights already defined, skipping redeclaration');
} else {

class PortfolioInsights {
    constructor() {
        this.patternChart = null;
    }

    calculateInsights(transactions) {
        const insights = {
            avgTimeBetween: this.calculateAverageTimeBetween(transactions),
            largestPurchase: this.findExtremePurchase(transactions, 'max'),
            smallestPurchase: this.findExtremePurchase(transactions, 'min'),
            priceDistribution: this.calculatePriceDistribution(transactions),
            consistencyStreak: this.calculateConsistencyStreak(transactions),
            investmentPattern: this.analyzeInvestmentPattern(transactions),
            monthlyPattern: this.calculateMonthlyPattern(transactions)
        };

        return insights;
    }

    calculateAverageTimeBetween(transactions) {
        if (transactions.length < 2) return { days: 0, consistency: 0 };

        const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
        const timeDiffs = [];

        for (let i = 1; i < sortedTransactions.length; i++) {
            const prev = new Date(sortedTransactions[i - 1].date);
            const current = new Date(sortedTransactions[i].date);
            const diffInDays = (current - prev) / (1000 * 60 * 60 * 24);
            timeDiffs.push(diffInDays);
        }

        const avgDays = timeDiffs.reduce((sum, diff) => sum + diff, 0) / timeDiffs.length;
        
        // Calculate consistency score based on standard deviation
        const mean = avgDays;
        const variance = timeDiffs.reduce((sum, diff) => sum + Math.pow(diff - mean, 2), 0) / timeDiffs.length;
        const stdDev = Math.sqrt(variance);
        const consistency = Math.max(0, 100 - (stdDev / mean * 100));

        return {
            days: Math.round(avgDays),
            consistency: Math.round(consistency)
        };
    }

    findExtremePurchase(transactions, type) {
        if (transactions.length === 0) {
            return { amount: 0, date: '--', btc: 0 };
        }

        const extreme = transactions.reduce((extreme, transaction) => {
            if (type === 'max') {
                return transaction.amount > extreme.amount ? transaction : extreme;
            } else {
                return transaction.amount < extreme.amount ? transaction : extreme;
            }
        });

        return {
            amount: extreme.amount,
            date: this.formatDate(extreme.date),
            btc: extreme.btcReceived
        };
    }

    calculatePriceDistribution(transactions) {
        if (transactions.length === 0) {
            return { min: 0, max: 0, median: 0, range: '0 - 0' };
        }

        const prices = transactions.map(tx => tx.rate || (tx.amount / tx.btcReceived)).filter(price => price > 0);
        prices.sort((a, b) => a - b);

        const min = prices[0];
        const max = prices[prices.length - 1];
        const median = prices[Math.floor(prices.length / 2)];

        return {
            min,
            max,
            median,
            // Dynamically format min and max using global formatCurrency if available
            range: (typeof window !== 'undefined' && window.formatCurrency)
                ? `${window.formatCurrency(min)} - ${window.formatCurrency(max)}`
                : `$${this.formatNumber(min)} - $${this.formatNumber(max)}`
        };
    }

    calculateConsistencyStreak(transactions) {
        if (transactions.length === 0) {
            return { current: 0, longest: 0 };
        }

        const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
        const weeklyBuckets = new Map();

        // Group transactions by week
        sortedTransactions.forEach(tx => {
            const date = new Date(tx.date);
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay()); // Start of week
            const weekKey = weekStart.toISOString().split('T')[0];
            
            if (!weeklyBuckets.has(weekKey)) {
                weeklyBuckets.set(weekKey, []);
            }
            weeklyBuckets.get(weekKey).push(tx);
        });

        const weeks = Array.from(weeklyBuckets.keys()).sort();
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        // Calculate streaks
        for (let i = 0; i < weeks.length; i++) {
            if (i === 0) {
                tempStreak = 1;
            } else {
                const prevWeek = new Date(weeks[i - 1]);
                const currentWeek = new Date(weeks[i]);
                const weeksDiff = (currentWeek - prevWeek) / (1000 * 60 * 60 * 24 * 7);

                if (weeksDiff <= 1.5) { // Allow for some flexibility
                    tempStreak++;
                } else {
                    longestStreak = Math.max(longestStreak, tempStreak);
                    tempStreak = 1;
                }
            }
        }

        longestStreak = Math.max(longestStreak, tempStreak);

        // Calculate current streak from the end
        const now = new Date();
        const lastWeek = weeks.length > 0 ? new Date(weeks[weeks.length - 1]) : new Date(0);
        const weeksSinceLastPurchase = (now - lastWeek) / (1000 * 60 * 60 * 24 * 7);

        if (weeksSinceLastPurchase <= 1.5) {
            currentStreak = tempStreak;
        } else {
            currentStreak = 0;
        }

        return {
            current: currentStreak,
            longest: longestStreak
        };
    }

    analyzeInvestmentPattern(transactions) {
        const insights = this.calculateAverageTimeBetween(transactions);
        const avgDays = insights.days;
        const consistency = insights.consistency;

        let frequency = 'Irregular';
        if (avgDays <= 8) frequency = 'Weekly';
        else if (avgDays <= 15) frequency = 'Bi-weekly';
        else if (avgDays <= 35) frequency = 'Monthly';

        return {
            frequency,
            consistency: `${consistency}% consistent`
        };
    }

    calculateMonthlyPattern(transactions) {
        const monthlyData = {};
        
        transactions.forEach(tx => {
            const date = new Date(tx.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {
                    month: monthKey,
                    totalAmount: 0,
                    totalBtc: 0,
                    transactionCount: 0,
                    avgPrice: 0
                };
            }
            
            monthlyData[monthKey].totalAmount += tx.amount;
            monthlyData[monthKey].totalBtc += tx.btcReceived;
            monthlyData[monthKey].transactionCount += 1;
        });

        // Calculate average prices
        Object.values(monthlyData).forEach(data => {
            data.avgPrice = data.totalBtc > 0 ? data.totalAmount / data.totalBtc : 0;
        });

        return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
    }

    updateInsightsDisplay(insights) {
        // Average time between purchases
        const avgTimeEl = document.getElementById('avg-time-between');
        const consistencyEl = document.getElementById('consistency-score');
        if (avgTimeEl) avgTimeEl.textContent = `${insights.avgTimeBetween.days} days`;
        if (consistencyEl) consistencyEl.textContent = `Consistency Score: ${insights.avgTimeBetween.consistency}%`;

        // Largest purchase
        const largestPurchaseEl = document.getElementById('largest-purchase');
        const largestDateEl = document.getElementById('largest-purchase-date');
        if (largestPurchaseEl) largestPurchaseEl.textContent = `$${this.formatNumber(insights.largestPurchase.amount)} AUD`;
        if (largestDateEl) largestDateEl.textContent = insights.largestPurchase.date;

        // Smallest purchase
        const smallestPurchaseEl = document.getElementById('smallest-purchase');
        const smallestDateEl = document.getElementById('smallest-purchase-date');
        if (smallestPurchaseEl) smallestPurchaseEl.textContent = `$${this.formatNumber(insights.smallestPurchase.amount)} AUD`;
        if (smallestDateEl) smallestDateEl.textContent = insights.smallestPurchase.date;

        // Price distribution
        const priceRangeEl = document.getElementById('price-range');
        const medianPriceEl = document.getElementById('median-price');
        if (priceRangeEl) priceRangeEl.textContent = insights.priceDistribution.range;
        if (medianPriceEl) medianPriceEl.textContent = `Median: $${this.formatNumber(insights.priceDistribution.median)}`;

        // Consistency streak
        const currentStreakEl = document.getElementById('current-streak');
        const longestStreakEl = document.getElementById('longest-streak');
        if (currentStreakEl) currentStreakEl.textContent = `${insights.consistencyStreak.current} weeks`;
        if (longestStreakEl) longestStreakEl.textContent = `Longest: ${insights.consistencyStreak.longest} weeks`;

        // Investment pattern
        const frequencyEl = document.getElementById('investment-frequency');
        const patternConsistencyEl = document.getElementById('pattern-consistency');
        if (frequencyEl) frequencyEl.textContent = insights.investmentPattern.frequency;
        if (patternConsistencyEl) patternConsistencyEl.textContent = insights.investmentPattern.consistency;
    }

    createPatternChart(monthlyData) {
        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.error('Chart.js not loaded for pattern chart, retrying in 500ms');
            setTimeout(() => this.createPatternChart(monthlyData), 500);
            return;
        }

        const canvas = document.getElementById('patternChart');
        if (!canvas) {
            console.error('Pattern chart canvas not found');
            return;
        }

        // Set explicit canvas dimensions
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth || 800;
        canvas.height = 350;
        canvas.style.width = '100%';
        canvas.style.height = '350px';

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Pattern chart context not available');
            return;
        }

        // Destroy existing chart
        if (this.patternChart) {
            this.patternChart.destroy();
        }

        const labels = monthlyData.map(data => {
            const [year, month] = data.month.split('-');
            const date = new Date(year, month - 1);
            return date.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' });
        });

        this.patternChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Monthly Investment (AUD)',
                        data: monthlyData.map(data => data.totalAmount),
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 2,
                        borderRadius: 6,
                        borderSkipped: false,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Transaction Count',
                        data: monthlyData.map(data => data.transactionCount),
                        backgroundColor: 'rgba(6, 182, 212, 0.7)',
                        borderColor: 'rgba(6, 182, 212, 1)',
                        borderWidth: 2,
                        borderRadius: 6,
                        borderSkipped: false,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#cbd5e1',
                            font: {
                                family: 'Montserrat',
                                weight: 600
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#cbd5e1',
                        borderColor: '#334155',
                        borderWidth: 1,
                        titleFont: {
                            family: 'Montserrat',
                            weight: 600
                        },
                        bodyFont: {
                            family: 'Montserrat'
                        },
                        callbacks: {
                            afterLabel: function(context) {
                                const dataIndex = context.dataIndex;
                                const monthData = monthlyData[dataIndex];
                                if (context.datasetIndex === 0) {
                                    return `BTC: ₿${monthData.totalBtc.toFixed(8)}`;
                                }
                                return `Avg Price: $${Math.round(monthData.avgPrice).toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#cbd5e1',
                            font: {
                                family: 'Montserrat'
                            }
                        },
                        grid: {
                            color: 'rgba(51, 65, 85, 0.3)'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: {
                            color: '#cbd5e1',
                            font: {
                                family: 'Montserrat'
                            },
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(51, 65, 85, 0.3)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        ticks: {
                            color: '#cbd5e1',
                            font: {
                                family: 'Montserrat'
                            }
                        },
                        grid: {
                            drawOnChartArea: false,
                            color: 'rgba(51, 65, 85, 0.3)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-AU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    formatNumber(number) {
        return Math.round(number).toLocaleString();
    }

    init(transactions) {
        const insights = this.calculateInsights(transactions);
        this.updateInsightsDisplay(insights);
        this.createPatternChart(insights.monthlyPattern);
        return insights;
    }
}

// Create global instance
window.portfolioInsights = new PortfolioInsights();

} // End of PortfolioInsights class check