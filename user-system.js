// User System for Bitcoin Dad Ledger Community Access

class UserSystem {
    constructor() {
        this.currentUser = null;
        this.subscriptionTiers = {
            'free': {
                name: 'Free Member',
                features: ['View Demo', 'Basic Education']
            },
            'premium': {
                name: 'Bitcoin Dad Premium',
                features: ['Personal Portfolio Tracking', 'Achievement System', 'Advanced Analytics', 'Community Access']
            }
        };
        this.init();
    }

    init() {
        this.loadUserFromStorage();
        this.setupUserInterface();
    }

    loadUserFromStorage() {
        const userData = localStorage.getItem('bitcoin_dad_user');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
            } catch (e) {
                console.error('Error loading user data:', e);
                this.currentUser = null;
            }
        }
    }

    saveUserToStorage() {
        if (this.currentUser) {
            localStorage.setItem('bitcoin_dad_user', JSON.stringify(this.currentUser));
        }
    }

    setupUserInterface() {
        this.createUserStatusBar();
        this.createLoginModal();
        this.updateUIBasedOnAccess();
    }

    createUserStatusBar() {
        const userStatusHTML = `
            <div class="user-status-bar" id="user-status-bar">
                <div class="user-info">
                    <span class="user-status-text" id="user-status-text">
                        ${this.currentUser ? 
                            `Welcome, ${this.currentUser.name} (${this.subscriptionTiers[this.currentUser.tier].name})` : 
                            'Bitcoin Dad Ledger - Community Demo'
                        }
                    </span>
                </div>
                <div class="user-actions">
                    ${this.currentUser ? 
                        `<button class="user-btn" id="logout-btn">Logout</button>` :
                        `<button class="user-btn primary" id="login-btn">Login / Join Community</button>`
                    }
                </div>
            </div>
        `;

        // Insert after header
        const header = document.querySelector('.header');
        if (header) {
            header.insertAdjacentHTML('afterend', userStatusHTML);
        }

        // Setup event listeners
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showLoginModal());
        }
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    createLoginModal() {
        const loginModalHTML = `
            <div class="modal" id="login-modal">
                <div class="modal-content login-modal-content">
                    <div class="modal-header">
                        <h3>Join the Bitcoin Dad Community</h3>
                        <button class="modal-close" id="close-login-modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="login-tabs">
                            <button class="login-tab active" data-tab="demo">Try Demo</button>
                            <button class="login-tab" data-tab="premium">Premium Access</button>
                        </div>
                        
                        <div class="login-tab-content active" id="demo-tab">
                            <div class="demo-info">
                                <h4>Demo Mode</h4>
                                <p>Explore the Bitcoin Dad Ledger with sample data to see how it works.</p>
                                <ul class="features-list">
                                    <li><i class="fas fa-check"></i> View sample portfolio</li>
                                    <li><i class="fas fa-check"></i> Explore all features</li>
                                    <li><i class="fas fa-times"></i> No personal data saving</li>
                                    <li><i class="fas fa-times"></i> No community access</li>
                                </ul>
                                <button class="auth-btn demo" id="demo-access-btn">Continue with Demo</button>
                            </div>
                        </div>
                        
                        <div class="login-tab-content" id="premium-tab">
                            <div class="premium-info">
                                <h4>Bitcoin Dad Premium - $29/month</h4>
                                <p>Full access to track your personal Bitcoin journey and join our community.</p>
                                <ul class="features-list">
                                    <li><i class="fas fa-check"></i> Personal portfolio tracking</li>
                                    <li><i class="fas fa-check"></i> Achievement system</li>
                                    <li><i class="fas fa-check"></i> Advanced analytics</li>
                                    <li><i class="fas fa-check"></i> Community access</li>
                                    <li><i class="fas fa-check"></i> Priority support</li>
                                </ul>
                                <div class="login-form">
                                    <input type="text" id="user-name" placeholder="Your Name" required>
                                    <input type="email" id="user-email" placeholder="Email Address" required>
                                    <button class="auth-btn premium" id="premium-access-btn">
                                        Join Premium Community
                                    </button>
                                </div>
                                <p class="payment-note">
                                    <small>This is a demo. In production, this would integrate with Stripe for payment processing.</small>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', loginModalHTML);
        this.setupLoginModalEvents();
    }

    setupLoginModalEvents() {
        const modal = document.getElementById('login-modal');
        const closeBtn = document.getElementById('close-login-modal');
        const loginTabs = document.querySelectorAll('.login-tab');
        const demoBtn = document.getElementById('demo-access-btn');
        const premiumBtn = document.getElementById('premium-access-btn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeLoginModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeLoginModal();
            });
        }

        // Tab switching
        loginTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchLoginTab(tabName);
            });
        });

        // Demo access
        if (demoBtn) {
            demoBtn.addEventListener('click', () => this.grantDemoAccess());
        }

        // Premium access
        if (premiumBtn) {
            premiumBtn.addEventListener('click', () => this.processPremiumSignup());
        }
    }

    switchLoginTab(tabName) {
        // Update active tab
        document.querySelectorAll('.login-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.login-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    grantDemoAccess() {
        this.currentUser = {
            name: 'Demo User',
            email: 'demo@bitcoindad.com',
            tier: 'free',
            isDemo: true,
            joinDate: new Date().toISOString()
        };
        
        this.saveUserToStorage();
        this.closeLoginModal();
        this.updateUIBasedOnAccess();
        this.showWelcomeMessage();
    }

    processPremiumSignup() {
        const name = document.getElementById('user-name').value.trim();
        const email = document.getElementById('user-email').value.trim();

        if (!name || !email) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        // In production, this would integrate with Stripe
        // For demo purposes, we'll simulate a successful signup
        this.currentUser = {
            name: name,
            email: email,
            tier: 'premium',
            isDemo: false,
            joinDate: new Date().toISOString(),
            subscriptionId: 'demo_' + Date.now()
        };

        this.saveUserToStorage();
        this.closeLoginModal();
        this.updateUIBasedOnAccess();
        this.showWelcomeMessage();
    }

    showLoginModal() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeLoginModal() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('bitcoin_dad_user');
        this.updateUIBasedOnAccess();
        this.showToast('Logged out successfully');
        
        // Reload page to reset to demo state
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    updateUIBasedOnAccess() {
        // Update user status bar
        const statusText = document.getElementById('user-status-text');
        const userActions = document.querySelector('.user-actions');

        if (statusText && userActions) {
            if (this.currentUser) {
                statusText.textContent = `Welcome, ${this.currentUser.name} (${this.subscriptionTiers[this.currentUser.tier].name})`;
                userActions.innerHTML = `<button class="user-btn" id="logout-btn">Logout</button>`;
                
                // Re-attach logout event
                const logoutBtn = document.getElementById('logout-btn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', () => this.logout());
                }
            } else {
                statusText.textContent = 'Bitcoin Dad Ledger - Community Demo';
                userActions.innerHTML = `<button class="user-btn primary" id="login-btn">Login / Join Community</button>`;
                
                // Re-attach login event
                const loginBtn = document.getElementById('login-btn');
                if (loginBtn) {
                    loginBtn.addEventListener('click', () => this.showLoginModal());
                }
            }
        }

        // Update sidebar based on access level
        this.updateSidebarForUser();
    }

    updateSidebarForUser() {
        const sidebarHeader = document.querySelector('.sidebar-header');
        if (!sidebarHeader) return;

        if (!this.currentUser || this.currentUser.tier === 'free') {
            // Demo mode - add demo indicator
            const existingDemo = sidebarHeader.querySelector('.demo-indicator');
            if (!existingDemo) {
                const demoIndicator = document.createElement('div');
                demoIndicator.className = 'demo-indicator';
                demoIndicator.innerHTML = `
                    <i class="fas fa-eye"></i> Demo Mode
                    <p>Join premium to track your own portfolio</p>
                `;
                sidebarHeader.appendChild(demoIndicator);
            }
        } else {
            // Premium mode - remove demo indicator
            const demoIndicator = sidebarHeader.querySelector('.demo-indicator');
            if (demoIndicator) {
                demoIndicator.remove();
            }
        }
    }

    showWelcomeMessage() {
        const message = this.currentUser.tier === 'premium' 
            ? `Welcome to Bitcoin Dad Premium, ${this.currentUser.name}! You now have full access to track your personal portfolio.`
            : `Welcome to the Bitcoin Dad Ledger demo! Explore all features with sample data.`;
            
        this.showToast(message);
    }

    showToast(message, type = 'success') {
        // Use the existing toast system from animations.js
        if (window.animationController) {
            window.animationController.showToast(message, type);
        }
    }

    hasFeatureAccess(feature) {
        if (!this.currentUser) return false;
        return this.subscriptionTiers[this.currentUser.tier].features.includes(feature);
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Create global instance
window.userSystem = new UserSystem();