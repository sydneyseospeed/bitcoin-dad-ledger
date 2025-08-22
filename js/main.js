// Bitcoin Dad Ledger - Main Application Logic

// Prevent redeclaration
if (typeof BitcoinDadLedger !== 'undefined') {
    console.warn('BitcoinDadLedger already defined, skipping redeclaration');
} else {

class BitcoinDadLedger {
    constructor() {
        this.currentBTCPrice = 0;
        this.chart = null;
        this.sortDirection = {};
        this.currentTimeframe = 'ALL';
        this.filteredTransactions = [];
        this.portfolioData = {};
        this.init();
    }

    async init() {
        try {
            // Initialize animation controller
            if (window.animationController) {
                window.animationController.init();
            }

            // Show loading state
            this.showLoadingState();

            await this.loadBTCPrice();
            this.updateMetrics();
            this.calculatePortfolioData();
            
            // Wait for DOM to be fully loaded before rendering UI elements
            this.waitForDOMAndRender();
            
            // Update price every 30 seconds
            setInterval(() => {
                this.loadBTCPrice();
            }, 30000);
            
        } catch (error) {
            console.error('Error during initialization:', error);
            this.hideLoadingState();
        }
    }

    waitForDOMAndRender() {
        console.log('Starting DOM check and render...');
        
        // Force initialization after a short delay, regardless of element status
        setTimeout(() => {
            console.log('Force initializing application...');
            this.hideLoadingState(); // Hide loading first
            
            // Initialize each component with error handling
            try {
                console.log('Rendering transaction table...');
                this.renderTransactionTable();
            } catch (e) { 
                console.error('Error rendering table:', e); 
            }
            
            try {
                console.log('Creating main chart...');
                this.createChart();
            } catch (e) { 
                console.error('Error creating chart:', e); 
            }
            
            try {
                console.log('Setting up timeframe buttons...');
                this.setupTimeframeButtons();
            } catch (e) { 
                console.error('Error setting up buttons:', e); 
            }
            
            try {
                console.log('Initializing insights...');
                this.initializeInsights();
            } catch (e) { 
                console.error('Error initializing insights:', e); 
            }
            
            try {
                console.log('Initializing achievements...');
                this.initializeAchievements();
            } catch (e) { 
                console.error('Error initializing achievements:', e); 
            }
            
            try {
                console.log('Updating sidebar stats...');
                this.updateSidebarStats();
            } catch (e) { 
                console.error('Error updating sidebar:', e); 
            }
            
            console.log('Initialization complete!');
        }, 1000);
    }

    initializeWithFallback() {
        console.log('Initializing with fallback...');
        try {
            this.renderTransactionTable();
        } catch (e) { console.error('Error rendering table:', e); }
        
        try {
            this.createChart();
        } catch (e) { console.error('Error creating chart:', e); }
        
        try {
            this.setupTimeframeButtons();
        } catch (e) { console.error('Error setting up buttons:', e); }
        
        try {
            this.initializeInsights();
        } catch (e) { console.error('Error initializing insights:', e); }
        
        try {
            this.initializeAchievements();
        } catch (e) { console.error('Error initializing achievements:', e); }
        
        try {
            this.updateSidebarStats();
        } catch (e) { console.error('Error updating sidebar:', e); }
        
        this.hideLoadingState();
    }

    showLoadingState() {
        const elements = document.querySelectorAll('.metric-value, .chart-container, .transactions-table');
        elements.forEach(el => {
            if (window.animationController) {
                window.animationController.addLoadingState(el);
            }
        });
    }

    hideLoadingState() {
        // Hide loading overlay immediately
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
            loadingOverlay.classList.add('hidden');
        }
        
        // Remove any skeleton loaders
        setTimeout(() => {
            const loadingElements = document.querySelectorAll('.skeleton');
            loadingElements.forEach(el => el.remove());
        }, 500);
    }

    // Fetch live BTC price from CoinGecko API
    async loadBTCPrice() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=aud&include_24hr_change=true');
            const data = await response.json();
            
            this.currentBTCPrice = data.bitcoin.aud;
            const change24h = data.bitcoin.aud_24h_change;
            
            this.updatePriceDisplay(this.currentBTCPrice, change24h);
            this.updatePortfolioValue();
        } catch (error) {
            console.error('Error fetching BTC price:', error);
            document.getElementById('btc-price').textContent = 'Error loading price';
        }
    }

    updatePriceDisplay(price, change24h) {
        const priceElement = document.getElementById('btc-price');
        const changeElement = document.getElementById('price-change');
        
        priceElement.textContent = new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
        
        const changeFormatted = change24h.toFixed(2);
        const changeSign = change24h >= 0 ? '+' : '';
        changeElement.textContent = `${changeSign}${changeFormatted}% (24h)`;
        changeElement.className = `price-change ${change24h >= 0 ? 'positive' : 'negative'}`;
    }

    updateMetrics() {
        const metrics = calculateMetrics(window.dcaTransactions);
        
        // Update metric displays with animation
        this.animateMetricUpdate('total-invested', formatCurrency(metrics.totalInvested));
        this.animateMetricUpdate('total-btc', formatBTC(parseFloat(metrics.totalBTC)));
        this.animateMetricUpdate('avg-cost', formatCurrency(metrics.avgCostBasis));
        
        // Store metrics for portfolio value calculation
        this.metrics = metrics;
    }

    animateMetricUpdate(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.transform = 'scale(1.05)';
            element.textContent = newValue;
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        } else {
            console.warn(`Element ${elementId} not found for metric update`);
        }
    }

    calculatePortfolioData() {
        const transactions = window.dcaTransactions;
        const totalBtc = transactions.reduce((sum, tx) => sum + tx.btcReceived, 0);
        const totalInvested = transactions.reduce((sum, tx) => sum + tx.amount, 0);
        const currentValue = totalBtc * this.currentBTCPrice;
        const unrealizedPnl = ((currentValue - totalInvested) / totalInvested) * 100;

        this.portfolioData = {
            totalBtc,
            totalInvested,
            currentValue,
            unrealizedPnl,
            totalTransactions: transactions.length,
            longestStreak: 0, // Will be calculated in insights
            maxDrawdown: 0 // Will be calculated based on price history
        };
    }

    updatePortfolioValue() {
        if (this.currentBTCPrice && this.metrics) {
            const currentValue = parseFloat(this.metrics.totalBTC) * this.currentBTCPrice;
            const invested = parseFloat(this.metrics.totalInvested);
            const unrealizedPnL = ((currentValue - invested) / invested) * 100;
            
            document.getElementById('current-value').textContent = formatCurrency(currentValue);
            
            const pnlElement = document.getElementById('unrealized-pnl');
            const pnlFormatted = unrealizedPnL.toFixed(2);
            const pnlSign = unrealizedPnL >= 0 ? '+' : '';
            pnlElement.textContent = `${pnlSign}${pnlFormatted}%`;
            pnlElement.className = `metric-value ${unrealizedPnL >= 0 ? 'positive' : 'negative'}`;
            
            // Update portfolio data for achievements
            this.portfolioData.currentValue = currentValue;
            this.portfolioData.unrealizedPnl = unrealizedPnL;
            
            // Check for new achievements
            if (window.achievementSystem) {
                const newAchievements = window.achievementSystem.checkAchievements(this.portfolioData);
                if (newAchievements.length > 0) {
                    window.achievementSystem.showNewAchievements(newAchievements);
                }
                window.achievementSystem.renderAchievements();
            }
        }
    }

    renderTransactionTable() {
        let tbody = document.getElementById('transactions-body');
        if (!tbody) {
            console.log('transactions-body element not found, looking for alternatives...');
            // Try to find the table and create tbody if needed
            const table = document.getElementById('transactions-table');
            if (table) {
                tbody = table.querySelector('tbody');
                if (!tbody) {
                    tbody = document.createElement('tbody');
                    tbody.id = 'transactions-body';
                    table.appendChild(tbody);
                    console.log('Created transactions-body element');
                }
            } else {
                console.error('transactions-table not found either');
                return;
            }
        }
        
        tbody.innerHTML = '';

        if (!window.dcaTransactions) {
            console.error('dcaTransactions not loaded');
            return;
        }

        window.dcaTransactions.forEach(tx => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(tx.date)}</td>
                <td><span class="source-badge">${tx.source}</span></td>
                <td>${formatCurrency(tx.amount)}</td>
                <td>${formatBTC(tx.btcReceived)}</td>
                <td>${formatCurrency(tx.rate)}</td>
                <td><span class="status-badge status-${tx.status.toLowerCase()}">${tx.status}</span></td>
            `;
            tbody.appendChild(row);
        });
    }

    createChart() {
        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.error('Chart.js not loaded, retrying in 500ms');
            setTimeout(() => this.createChart(), 500);
            return;
        }

        let canvas = document.getElementById('dcaChart');
        if (!canvas) {
            console.log('Chart canvas not found, looking for chart container...');
            // Try to find the chart container and create canvas if needed
            const container = document.querySelector('.chart-container');
            if (container) {
                canvas = document.createElement('canvas');
                canvas.id = 'dcaChart';
                canvas.style.height = '500px';
                canvas.style.width = '100%';
                container.appendChild(canvas);
                console.log('Created dcaChart canvas element');
            } else {
                console.error('Chart container not found either');
                return;
            }
        }

        // Set explicit canvas dimensions
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth || 800;
        canvas.height = 500;
        canvas.style.width = '100%';
        canvas.style.height = '500px';

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Chart context not available');
            return;
        }

        if (!window.dcaTransactions || window.dcaTransactions.length === 0) {
            console.error('No transaction data available for chart');
            return;
        }

        // Filter transactions based on current timeframe
        this.filteredTransactions = this.filterTransactionsByTimeframe(window.dcaTransactions, this.currentTimeframe);
        
        // Prepare data for chart
        const sortedTransactions = this.filteredTransactions
            .sort((a, b) => new Date(a.date) - new Date(b.date));
            
        if (sortedTransactions.length === 0) {
            console.warn('No transactions for selected timeframe');
            return;
        }

        const chartLabels = sortedTransactions.map(tx => {
            const date = new Date(tx.date);
            return date.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
        });

        const priceData = sortedTransactions.map(tx => tx.rate || (tx.amount / tx.btcReceived));

        // Destroy existing chart
        if (this.chart) {
            this.chart.destroy();
        }

        console.log('Creating chart with', sortedTransactions.length, 'transactions');

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartLabels,
                datasets: [
                    {
                        label: 'BTC Price (AUD)',
                        data: priceData,
                        borderColor: '#06b6d4',
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.3,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 3,
                        pointRadius: 8,
                        pointHoverRadius: 12,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#cbd5e1',
                            font: {
                                size: 14,
                                family: 'Montserrat',
                                weight: 600
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 41, 59, 0.95)',
                        titleColor: '#ffffff',
                        bodyColor: '#cbd5e1',
                        borderColor: '#06b6d4',
                        borderWidth: 1,
                        titleFont: {
                            family: 'Montserrat',
                            weight: 600
                        },
                        bodyFont: {
                            family: 'Montserrat'
                        },
                        callbacks: {
                            title: function(context) {
                                const tx = sortedTransactions[context[0].dataIndex];
                                return new Date(tx.date).toLocaleDateString('en-AU', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                });
                            },
                            label: function(context) {
                                const tx = sortedTransactions[context.dataIndex];
                                return [
                                    `Price: ${formatCurrency(context.parsed.y)}`,
                                    `Invested: ${formatCurrency(tx.amount)}`,
                                    `BTC Received: ${formatBTC(tx.btcReceived)}`,
                                    `Source: ${tx.source}`
                                ];
                            }
                        }
                    },
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'x'
                        },
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true
                            },
                            mode: 'x',
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(203, 213, 225, 0.1)'
                        },
                        ticks: {
                            color: '#cbd5e1',
                            font: {
                                size: 12,
                                family: 'Montserrat'
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(203, 213, 225, 0.1)'
                        },
                        ticks: {
                            color: '#cbd5e1',
                            font: {
                                size: 12,
                                family: 'Montserrat'
                            },
                            callback: function(value) {
                                return formatCurrency(value);
                            }
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

    filterTransactionsByTimeframe(transactions, timeframe) {
        if (timeframe === 'ALL') return transactions;

        const now = new Date();
        const cutoffDate = new Date();

        switch (timeframe) {
            case '1M':
                cutoffDate.setMonth(now.getMonth() - 1);
                break;
            case '3M':
                cutoffDate.setMonth(now.getMonth() - 3);
                break;
            case '6M':
                cutoffDate.setMonth(now.getMonth() - 6);
                break;
            case '1Y':
                cutoffDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                return transactions;
        }

        return transactions.filter(tx => new Date(tx.date) >= cutoffDate);
    }

    setupTimeframeButtons() {
        const buttons = document.querySelectorAll('.timeframe-btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Remove active class from all buttons
                buttons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Update timeframe and recreate chart
                this.currentTimeframe = e.target.dataset.period;
                this.createChart();
            });
        });

        // Setup reset zoom button
        const resetZoomBtn = document.getElementById('reset-zoom');
        if (resetZoomBtn) {
            resetZoomBtn.addEventListener('click', () => {
                if (this.chart) {
                    this.chart.resetZoom();
                }
            });
        }
    }

    sortTable(column) {
        const currentDirection = this.sortDirection[column] || 'asc';
        const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
        this.sortDirection[column] = newDirection;

        window.dcaTransactions.sort((a, b) => {
            let valueA, valueB;
            
            switch (column) {
                case 'date':
                    valueA = new Date(a.date);
                    valueB = new Date(b.date);
                    break;
                case 'amount':
                    valueA = a.amount;
                    valueB = b.amount;
                    break;
                case 'btc':
                    valueA = a.btcReceived;
                    valueB = b.btcReceived;
                    break;
                default:
                    return 0;
            }

            if (newDirection === 'asc') {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });

        this.renderTransactionTable();
        
        // Update button states
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        if (event && event.target) {
            event.target.classList.add('active');
        }
    }

    initializeInsights() {
        if (window.portfolioInsights && window.dcaTransactions) {
            console.log('Initializing insights with', window.dcaTransactions.length, 'transactions');
            const insights = window.portfolioInsights.init(window.dcaTransactions);
            // Update portfolio data with calculated insights
            this.portfolioData.longestStreak = insights.consistencyStreak.longest;
            
            // Update sidebar stats immediately
            this.updateSidebarStats();
            
            // Ensure pattern chart is created
            setTimeout(() => {
                if (window.portfolioInsights && insights.monthlyPattern) {
                    console.log('Creating pattern chart with', insights.monthlyPattern.length, 'months of data');
                    window.portfolioInsights.createPatternChart(insights.monthlyPattern);
                }
            }, 1000);
        }
    }

    initializeAchievements() {
        if (window.achievementSystem) {
            window.achievementSystem.init();
            const newAchievements = window.achievementSystem.checkAchievements(this.portfolioData);
            window.achievementSystem.renderAchievements();
            
            if (newAchievements.length > 0) {
                setTimeout(() => {
                    window.achievementSystem.showNewAchievements(newAchievements);
                }, 2000);
            }
        }
    }

    updateSidebarStats() {
        if (window.portfolioInsights && window.dcaTransactions && window.dcaTransactions.length > 0) {
            console.log('Updating sidebar stats with', window.dcaTransactions.length, 'transactions');
            
            const insights = window.portfolioInsights.calculateInsights(window.dcaTransactions);
            
            // Update insights in sidebar
            const avgTimeEl = document.getElementById('avg-time-between');
            const consistencyEl = document.getElementById('consistency-score');
            const largestEl = document.getElementById('largest-purchase');
            const largestDateEl = document.getElementById('largest-purchase-date');
            const smallestEl = document.getElementById('smallest-purchase');
            const smallestDateEl = document.getElementById('smallest-purchase-date');
            const priceRangeEl = document.getElementById('price-range');
            const medianPriceEl = document.getElementById('median-price');
            const currentStreakEl = document.getElementById('current-streak');
            const longestStreakEl = document.getElementById('longest-streak');
            
            if (avgTimeEl) avgTimeEl.textContent = `${insights.avgTimeBetween.days} days`;
            if (consistencyEl) consistencyEl.textContent = `${insights.avgTimeBetween.consistency}% consistent`;
            
            if (largestEl) largestEl.textContent = `$${this.formatNumber(insights.largestPurchase.amount)} AUD`;
            if (largestDateEl) largestDateEl.textContent = insights.largestPurchase.date;
            
            if (smallestEl) smallestEl.textContent = `$${this.formatNumber(insights.smallestPurchase.amount)} AUD`;
            if (smallestDateEl) smallestDateEl.textContent = insights.smallestPurchase.date;
            
            if (priceRangeEl) priceRangeEl.textContent = insights.priceDistribution.range;
            if (medianPriceEl) medianPriceEl.textContent = `Median: $${this.formatNumber(insights.priceDistribution.median)}`;
            
            if (currentStreakEl) currentStreakEl.textContent = `${insights.consistencyStreak.current} weeks`;
            if (longestStreakEl) longestStreakEl.textContent = `Longest: ${insights.consistencyStreak.longest} weeks`;
            
            console.log('Insights calculated:', insights);
        }
    }

    formatNumber(number) {
        return Math.round(number).toLocaleString();
    }
}

// Global sort function for HTML onclick
function sortTable(column) {
    if (window.ledgerApp) {
        window.ledgerApp.sortTable(column);
    }
}

// Initialize the application when DOM is loaded
function initializeLedger() {
    try {
        console.log('Initializing Bitcoin Dad Ledger...');
        console.log('Document ready state:', document.readyState);
        
        window.ledgerApp = new BitcoinDadLedger();
    } catch (error) {
        console.error('Error initializing Bitcoin Dad Ledger:', error);
        // Hide loading screen even if there's an error
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
            loadingOverlay.classList.add('hidden');
        }
    }
}

// Multiple initialization triggers
document.addEventListener('DOMContentLoaded', initializeLedger);

// Fallback if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // Loading hasn't finished yet
    document.addEventListener('DOMContentLoaded', initializeLedger);
} else {
    // DOM is already loaded
    initializeLedger();
}

} // End of BitcoinDadLedger class check

// Add some CSS for active sort button
if (!document.getElementById('sort-button-styles')) {
    const sortButtonStyle = document.createElement('style');
    sortButtonStyle.id = 'sort-button-styles';
    sortButtonStyle.textContent = `
        .sort-btn.active {
            background: var(--secondary-blue) !important;
            color: white !important;
            border-color: var(--secondary-blue) !important;
        }
    `;
    document.head.appendChild(sortButtonStyle);
}