// Achievement System for Bitcoin Dad Ledger

// Prevent redeclaration
if (typeof AchievementSystem !== 'undefined') {
    console.warn('AchievementSystem already defined, skipping redeclaration');
} else {

class AchievementSystem {
    constructor() {
        this.achievements = this.defineAchievements();
        this.soundEnabled = true;
        this.audioContext = null;
    }

    defineAchievements() {
        return [
            {
                id: 'first_purchase',
                title: 'First Steps',
                description: 'Made your first Bitcoin purchase',
                icon: 'fa-baby',
                condition: (data) => data.totalTransactions >= 1,
                category: 'milestone'
            },
            {
                id: 'week_consistent',
                title: 'Consistent Stacker',
                description: 'Purchased Bitcoin for 4 weeks straight',
                icon: 'fa-calendar-check',
                condition: (data) => data.longestStreak >= 4,
                category: 'consistency'
            },
            {
                id: 'month_consistent',
                title: 'Monthly Discipline',
                description: 'Maintained DCA for a full month',
                icon: 'fa-medal',
                condition: (data) => data.longestStreak >= 4,
                category: 'consistency'
            },
            {
                id: 'satoshi_million',
                title: 'Satoshi Millionaire',
                description: 'Accumulated 1,000,000 satoshis',
                icon: 'fa-coins',
                condition: (data) => data.totalBtc >= 0.01,
                category: 'accumulation'
            },
            {
                id: 'tenth_bitcoin',
                title: 'Tenth Bitcoin',
                description: 'Reached 0.1 BTC milestone',
                icon: 'fa-trophy',
                condition: (data) => data.totalBtc >= 0.1,
                category: 'milestone'
            },
            {
                id: 'quarter_bitcoin',
                title: 'Quarter Bitcoin',
                description: 'Accumulated 0.25 BTC',
                icon: 'fa-star',
                condition: (data) => data.totalBtc >= 0.25,
                category: 'milestone'
            },
            {
                id: 'half_bitcoin',
                title: 'Half Bitcoin',
                description: 'Reached the 0.5 BTC milestone',
                icon: 'fa-shield-halved',
                condition: (data) => data.totalBtc >= 0.5,
                category: 'milestone'
            },
            {
                id: 'whole_bitcoin',
                title: 'Whole Coiner',
                description: 'Accumulated 1 full Bitcoin!',
                icon: 'fa-crown',
                condition: (data) => data.totalBtc >= 1.0,
                category: 'milestone'
            },
            {
                id: 'ten_purchases',
                title: 'Dedicated Stacker',
                description: 'Made 10 Bitcoin purchases',
                icon: 'fa-layer-group',
                condition: (data) => data.totalTransactions >= 10,
                category: 'frequency'
            },
            {
                id: 'fifty_purchases',
                title: 'DCA Master',
                description: 'Completed 50 DCA purchases',
                icon: 'fa-graduation-cap',
                condition: (data) => data.totalTransactions >= 50,
                category: 'frequency'
            },
            {
                id: 'thousand_invested',
                title: 'Serious Investor',
                description: 'Invested $1,000 AUD in Bitcoin',
                icon: 'fa-chart-line',
                condition: (data) => data.totalInvested >= 1000,
                category: 'investment'
            },
            {
                id: 'five_thousand_invested',
                title: 'Big Stacker',
                description: 'Invested $5,000 AUD in Bitcoin',
                icon: 'fa-rocket',
                condition: (data) => data.totalInvested >= 5000,
                category: 'investment'
            },
            {
                id: 'profitable',
                title: 'In The Green',
                description: 'Portfolio showing positive returns',
                icon: 'fa-arrow-trend-up',
                condition: (data) => data.unrealizedPnl > 0,
                category: 'performance'
            },
            {
                id: 'diamond_hands',
                title: 'Diamond Hands 💎🙌',
                description: 'Held through a -20% price drop',
                icon: 'fa-gem',
                condition: (data) => data.maxDrawdown >= 20,
                category: 'resilience'
            }
        ];
    }

    checkAchievements(portfolioData) {
        const unlockedAchievements = [];
        
        this.achievements.forEach(achievement => {
            const isUnlocked = achievement.condition(portfolioData);
            achievement.unlocked = isUnlocked;
            achievement.progress = this.calculateProgress(achievement, portfolioData);
            
            if (isUnlocked && !this.isAchievementSeen(achievement.id)) {
                unlockedAchievements.push(achievement);
                this.markAchievementAsSeen(achievement.id);
            }
        });

        return unlockedAchievements;
    }

    calculateProgress(achievement, data) {
        const id = achievement.id;
        
        switch (id) {
            case 'satoshi_million':
                return Math.min(100, (data.totalBtc / 0.01) * 100);
            case 'tenth_bitcoin':
                return Math.min(100, (data.totalBtc / 0.1) * 100);
            case 'quarter_bitcoin':
                return Math.min(100, (data.totalBtc / 0.25) * 100);
            case 'half_bitcoin':
                return Math.min(100, (data.totalBtc / 0.5) * 100);
            case 'whole_bitcoin':
                return Math.min(100, (data.totalBtc / 1.0) * 100);
            case 'ten_purchases':
                return Math.min(100, (data.totalTransactions / 10) * 100);
            case 'fifty_purchases':
                return Math.min(100, (data.totalTransactions / 50) * 100);
            case 'thousand_invested':
                return Math.min(100, (data.totalInvested / 1000) * 100);
            case 'five_thousand_invested':
                return Math.min(100, (data.totalInvested / 5000) * 100);
            case 'week_consistent':
            case 'month_consistent':
                return Math.min(100, (data.longestStreak / 4) * 100);
            default:
                return achievement.unlocked ? 100 : 0;
        }
    }

    renderAchievements() {
        const container = document.getElementById('achievements-grid');
        if (!container) return;

        container.innerHTML = '';

        this.achievements.forEach(achievement => {
            const achievementEl = this.createAchievementElement(achievement);
            container.appendChild(achievementEl);
        });
    }

    createAchievementElement(achievement) {
        const div = document.createElement('div');
        div.className = `achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}`;
        
        // For unlocked achievements, ensure progress is 100%
        const progressWidth = achievement.unlocked ? 100 : achievement.progress;
        
        div.innerHTML = `
            <div class="achievement-icon">
                <i class="fas ${achievement.icon}"></i>
            </div>
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-description">${achievement.description}</div>
            <div class="achievement-progress">
                <div class="achievement-progress-bar" style="width: ${progressWidth}%"></div>
            </div>
        `;

        // Add click event for celebration effect
        if (achievement.unlocked) {
            div.addEventListener('click', () => {
                this.celebrateAchievement(achievement, div);
            });
        }

        return div;
    }

    celebrateAchievement(achievement, element) {
        // Visual celebration effect
        element.style.transform = 'scale(1.1)';
        setTimeout(() => {
            element.style.transform = '';
        }, 200);

        // Sound effect
        if (this.soundEnabled) {
            this.playAchievementSound();
        }

        // Show toast notification
        this.showToast(`Achievement Unlocked: ${achievement.title}!`);
    }

    showNewAchievements(achievements) {
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                this.showAchievementModal(achievement);
                if (this.soundEnabled) {
                    this.playAchievementSound();
                }
            }, index * 1000);
        });
    }

    showAchievementModal(achievement) {
        const modal = document.createElement('div');
        modal.className = 'achievement-modal';
        modal.innerHTML = `
            <div class="achievement-modal-content">
                <div class="achievement-celebration">
                    <div class="achievement-icon-large">
                        <i class="fas ${achievement.icon}"></i>
                    </div>
                    <h2>Achievement Unlocked!</h2>
                    <h3>${achievement.title}</h3>
                    <p>${achievement.description}</p>
                    <button class="close-achievement-modal">Continue Stacking</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'flex';

        // Auto close after 5 seconds or on click
        const closeBtn = modal.querySelector('.close-achievement-modal');
        const closeModal = () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        };

        closeBtn.addEventListener('click', closeModal);
        setTimeout(closeModal, 5000);

        // Add celebration animation
        modal.addEventListener('animationend', () => {
            modal.querySelector('.achievement-celebration').style.animation = 'bounce 0.6s ease-in-out';
        });
    }

    playAchievementSound() {
        // Create a chilled house music style achievement sound
        if (!this.soundEnabled) return;
        
        try {
            // Only create audio context after user interaction
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            // Resume context if suspended
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            // Create a chilled house style chord progression
            this.playChillChord(0, [261.63, 329.63, 392.00]); // C Major
            this.playChillChord(0.4, [293.66, 369.99, 440.00]); // D Major
            this.playChillChord(0.8, [329.63, 415.30, 493.88]); // E Major
            
            // Add a subtle reverb-like delay effect
            setTimeout(() => {
                this.playChillChord(0.1, [261.63, 329.63, 392.00], 0.1); // Soft echo
            }, 200);
        } catch (e) {
            console.log('Audio not supported or needs user interaction');
        }
    }

    playChillChord(startTime, frequencies, volume = 0.15) {
        const currentTime = this.audioContext.currentTime + startTime;
        
        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();

            // Chain: oscillator -> filter -> gain -> destination
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // House music characteristics
            oscillator.type = 'sawtooth'; // Warmer sound for house music
            oscillator.frequency.setValueAtTime(freq, currentTime);
            
            // Low-pass filter for warmer, chilled sound
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, currentTime);
            filter.Q.setValueAtTime(1, currentTime);

            // Smooth attack and release for chilled vibe
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 1.2);

            oscillator.start(currentTime);
            oscillator.stop(currentTime + 1.2);
        });
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.textContent = message;
        
        toast.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: linear-gradient(135deg, var(--accent-green), var(--accent-teal));
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            z-index: 3000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;

        document.body.appendChild(toast);

        // Slide in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Slide out and remove
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    isAchievementSeen(id) {
        const seen = localStorage.getItem('achievements_seen') || '[]';
        return JSON.parse(seen).includes(id);
    }

    markAchievementAsSeen(id) {
        const seen = JSON.parse(localStorage.getItem('achievements_seen') || '[]');
        seen.push(id);
        localStorage.setItem('achievements_seen', JSON.stringify(seen));
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('achievement_sound', this.soundEnabled.toString());
        return this.soundEnabled;
    }

    init() {
        // Load sound preference
        const soundPref = localStorage.getItem('achievement_sound');
        if (soundPref !== null) {
            this.soundEnabled = soundPref === 'true';
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('achievement_sound', this.soundEnabled.toString());
        
        // Play a test sound when enabling
        if (this.soundEnabled) {
            setTimeout(() => this.playChillClickSound(), 100);
        }
        
        return this.soundEnabled;
    }

    playChillClickSound() {
        try {
            if (!this.soundEnabled) return;
            
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();

            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(500, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(250, this.audioContext.currentTime + 0.1);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);

            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);

            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.15);
        } catch (e) {
            console.log('Click sound not supported');
        }
    }
}

// Create global instance
window.achievementSystem = new AchievementSystem();

} // End of AchievementSystem class check