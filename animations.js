// Animations and Interactive Features for Bitcoin Dad Ledger

// Prevent redeclaration
if (typeof AnimationController !== 'undefined') {
    console.warn('AnimationController already defined, skipping redeclaration');
} else {

class AnimationController {
    constructor() {
        this.observers = [];
        this.isInitialized = false;
        this.currentTheme = localStorage.getItem('theme') || 'dark';
    }

    init() {
        if (this.isInitialized) return;
        
        this.setupIntersectionObserver();
        this.setupSmoothScrolling();
        this.setupFloatingActionButtons();
        this.setupThemeToggle();
        this.setupShareModal();
        this.setupPWAInstallPrompt();
        this.setupLoadingAnimation();
        this.setupTouchGestures();
        this.setupSoundToggle();
        this.setupTestimonials();
        this.applyTheme(this.currentTheme);
        
        this.isInitialized = true;
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.animateCards(entry.target);
                }
            });
        }, observerOptions);

        // Observe all sections and cards
        const elementsToObserve = document.querySelectorAll(
            '.metric-card, .insight-card, .achievement-badge, .chart-section, .transactions'
        );
        
        elementsToObserve.forEach(el => {
            observer.observe(el);
            el.classList.add('animate-on-scroll');
        });

        this.observers.push(observer);
    }

    animateCards(container) {
        const cards = container.querySelectorAll('.metric-card, .insight-card, .achievement-badge');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    setupSmoothScrolling() {
        // Navigation smooth scrolling
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = 100;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Update active navigation
                    this.updateActiveNavigation(targetId);
                }
            });
        });

        // Update active navigation on scroll
        window.addEventListener('scroll', this.throttle(() => {
            this.updateActiveNavigationOnScroll();
            this.updateScrollToTopButton();
        }, 100));
    }

    updateActiveNavigation(activeId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }

    updateActiveNavigationOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
                currentSection = section.id;
            }
        });

        if (currentSection) {
            this.updateActiveNavigation(currentSection);
        }
    }

    setupFloatingActionButtons() {
        // Scroll to top button
        const scrollTopBtn = document.getElementById('scroll-top');
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Share button
        const shareBtn = document.getElementById('open-share-modal');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.openShareModal();
            });
        }
    }

    updateScrollToTopButton() {
        const scrollTopBtn = document.getElementById('scroll-top');
        if (scrollTopBtn) {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.body.className = document.body.className.replace(/\b(dark|light)-theme\b/g, '');
        document.body.classList.add(`${theme}-theme`);
        
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }

        // Update chart colors if charts exist
        this.updateChartTheme(theme);
    }

    updateChartTheme(theme) {
        // This will be called when charts need theme updates
        if (window.dcaChart || window.portfolioInsights?.patternChart) {
            // Charts will be updated when data is refreshed
        }
    }

    setupShareModal() {
        const modal = document.getElementById('share-modal');
        const openBtn = document.getElementById('open-share-modal');
        const closeBtn = document.getElementById('close-share-modal');

        if (openBtn && modal) {
            openBtn.addEventListener('click', () => this.openShareModal());
        }

        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => this.closeShareModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeShareModal();
                }
            });
        }

        // Share buttons
        this.setupShareButtons();
    }

    setupShareButtons() {
        const twitterBtn = document.getElementById('share-twitter');
        const facebookBtn = document.getElementById('share-facebook');
        const copyBtn = document.getElementById('copy-link');

        if (twitterBtn) {
            twitterBtn.addEventListener('click', () => this.shareToTwitter());
        }

        if (facebookBtn) {
            facebookBtn.addEventListener('click', () => this.shareToFacebook());
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyLink());
        }
    }

    openShareModal() {
        const modal = document.getElementById('share-modal');
        if (modal) {
            // Update share card with current data
            this.updateShareCard();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeShareModal() {
        const modal = document.getElementById('share-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    updateShareCard() {
        // Get current portfolio data
        const totalBtcEl = document.getElementById('total-btc');
        const totalInvestedEl = document.getElementById('total-invested');
        const pnlEl = document.getElementById('unrealized-pnl');

        const shareBtcEl = document.getElementById('share-total-btc');
        const shareInvestedEl = document.getElementById('share-total-invested');
        const sharePnlEl = document.getElementById('share-pnl');

        if (shareBtcEl && totalBtcEl) {
            shareBtcEl.textContent = totalBtcEl.textContent;
        }
        if (shareInvestedEl && totalInvestedEl) {
            shareInvestedEl.textContent = totalInvestedEl.textContent;
        }
        if (sharePnlEl && pnlEl) {
            sharePnlEl.textContent = pnlEl.textContent;
        }
    }

    shareToTwitter() {
        const text = "Just checked my Bitcoin DCA progress on the Bitcoin Dad Ledger! 📊 Stacking sats consistently, building generational wealth. 🚀 #BitcoinDad #DCA #Bitcoin";
        const url = window.location.href;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    }

    shareToFacebook() {
        const url = window.location.href;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    }

    async copyLink() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            this.showToast('Link copied to clipboard!');
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = window.location.href;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('Link copied to clipboard!');
        }
    }

    setupPWAInstallPrompt() {
        let deferredPrompt;
        const installPrompt = document.getElementById('pwa-install-prompt');
        const installBtn = document.getElementById('pwa-install-btn');
        const dismissBtn = document.getElementById('pwa-dismiss-btn');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install prompt if not previously dismissed
            if (!localStorage.getItem('pwa-dismissed')) {
                setTimeout(() => {
                    installPrompt?.classList.add('show');
                }, 3000);
            }
        });

        if (installBtn) {
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const result = await deferredPrompt.userChoice;
                    
                    if (result.outcome === 'accepted') {
                        this.showToast('App installed successfully!');
                    }
                    
                    deferredPrompt = null;
                    installPrompt?.classList.remove('show');
                }
            });
        }

        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                installPrompt?.classList.remove('show');
                localStorage.setItem('pwa-dismissed', 'true');
            });
        }

        // Check if already installed
        window.addEventListener('appinstalled', () => {
            this.showToast('Bitcoin Dad Ledger installed!');
            installPrompt?.classList.remove('show');
        });
    }

    setupLoadingAnimation() {
        const loadingOverlay = document.getElementById('loading-overlay');
        
        // Hide loading overlay after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (loadingOverlay) {
                    loadingOverlay.classList.add('hidden');
                }
            }, 500);
        });

        // Fallback to hide loading after DOMContentLoaded
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                if (loadingOverlay && !loadingOverlay.classList.contains('hidden')) {
                    loadingOverlay.classList.add('hidden');
                }
            }, 2000);
        });

        // Emergency fallback - force hide after 3 seconds
        setTimeout(() => {
            if (loadingOverlay && !loadingOverlay.classList.contains('hidden')) {
                loadingOverlay.classList.add('hidden');
            }
        }, 3000);
    }

    setupTouchGestures() {
        let touchStartX = 0;
        let touchEndX = 0;

        const chartContainer = document.querySelector('.chart-container');
        if (chartContainer) {
            chartContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            chartContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleChartSwipe();
            }, { passive: true });
        }
    }

    handleChartSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            const timeframeButtons = document.querySelectorAll('.timeframe-btn');
            const activeIndex = Array.from(timeframeButtons).findIndex(btn => btn.classList.contains('active'));
            
            let newIndex;
            if (diff > 0 && activeIndex < timeframeButtons.length - 1) {
                // Swipe left - next timeframe
                newIndex = activeIndex + 1;
            } else if (diff < 0 && activeIndex > 0) {
                // Swipe right - previous timeframe
                newIndex = activeIndex - 1;
            }

            if (newIndex !== undefined) {
                timeframeButtons[newIndex].click();
            }
        }
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        const bgColor = type === 'success' ? 'var(--accent-green)' : 'var(--error-color)';
        
        toast.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            z-index: 3000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            font-family: 'Montserrat', sans-serif;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    addLoadingState(element) {
        element.classList.add('loading');
        element.innerHTML = '<div class="skeleton skeleton-chart"></div>';
    }

    removeLoadingState(element, originalContent) {
        element.classList.remove('loading');
        element.innerHTML = originalContent;
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    setupSoundToggle() {
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle && window.achievementSystem) {
            soundToggle.addEventListener('click', () => {
                const soundEnabled = window.achievementSystem.toggleSound();
                const icon = soundToggle.querySelector('i');
                
                if (soundEnabled) {
                    icon.className = 'fas fa-volume-up';
                    soundToggle.classList.remove('muted');
                    this.showToast('Sound effects enabled');
                } else {
                    icon.className = 'fas fa-volume-mute';
                    soundToggle.classList.add('muted');
                    this.showToast('Sound effects disabled');
                }
            });

            // Set initial state
            if (window.achievementSystem.soundEnabled === false) {
                soundToggle.querySelector('i').className = 'fas fa-volume-mute';
                soundToggle.classList.add('muted');
            }
        }

        // Add subtle click sounds to interactive elements
        this.addChillClickSounds();
    }

    addChillClickSounds() {
        // Add gentle click sounds to buttons and interactive elements
        const interactiveElements = document.querySelectorAll('button, .metric-card, .achievement-badge, .nav-link, .timeframe-btn');
        
        interactiveElements.forEach(element => {
            element.addEventListener('click', (e) => {
                if (window.achievementSystem && window.achievementSystem.soundEnabled) {
                    this.playChillClickSound();
                }
            });
        });
    }

    playChillClickSound() {
        try {
            if (!window.achievementSystem || !window.achievementSystem.audioContext) return;

            const audioCtx = window.achievementSystem.audioContext;
            
            // Create a subtle, warm click sound
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();

            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            // Warm, subtle tone
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.1);

            // Warm filter
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, audioCtx.currentTime);

            // Very soft volume for subtle effect
            gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.15);
        } catch (e) {
            // Silently fail if audio not supported
        }
    }

    setupTestimonials() {
        const loadMoreBtn = document.getElementById('load-more-testimonials');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreTestimonials();
            });
        }
    }

    loadMoreTestimonials() {
        const additionalTestimonials = [
            {
                initials: 'AM',
                text: 'This ledger helped me explain Bitcoin to my teenage son. Now he wants to start his own DCA journey!',
                author: 'Alex M., Father of 2'
            },
            {
                initials: 'JP',
                text: 'Love the transparency and accountability. My wife is now fully on board with our Bitcoin strategy.',
                author: 'James P., Bitcoin Dad'
            },
            {
                initials: 'KL',
                text: 'The achievements keep me motivated. Just hit 0.1 BTC and feeling proud of the consistency.',
                author: 'Kevin L., Community Member'
            },
            {
                initials: 'BH',
                text: 'Best financial decision I\'ve made. The stress-free approach fits perfectly with dad life.',
                author: 'Ben H., Father of 1'
            }
        ];

        const testimonialsGrid = document.querySelector('.testimonials-grid');
        const loadMoreBtn = document.getElementById('load-more-testimonials');

        additionalTestimonials.forEach((testimonial, index) => {
            setTimeout(() => {
                const testimonialEl = document.createElement('div');
                testimonialEl.className = 'testimonial';
                testimonialEl.style.opacity = '0';
                testimonialEl.style.transform = 'translateY(20px)';
                
                testimonialEl.innerHTML = `
                    <div class="testimonial-avatar">${testimonial.initials}</div>
                    <div class="testimonial-content">
                        <div class="testimonial-text">"${testimonial.text}"</div>
                        <div class="testimonial-author">- ${testimonial.author}</div>
                    </div>
                `;
                
                testimonialsGrid.appendChild(testimonialEl);
                
                // Animate in
                setTimeout(() => {
                    testimonialEl.style.transition = 'all 0.5s ease';
                    testimonialEl.style.opacity = '1';
                    testimonialEl.style.transform = 'translateY(0)';
                }, 100);
                
            }, index * 200);
        });

        // Hide the load more button
        loadMoreBtn.style.opacity = '0';
        setTimeout(() => {
            loadMoreBtn.style.display = 'none';
        }, 300);

        this.showToast('Loaded more testimonials!');
    }

    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        this.isInitialized = false;
    }
}

// Add CSS animations
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .animate-on-scroll.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    .nav-link.active {
        background: rgba(59, 130, 246, 0.3);
        color: var(--text-primary);
    }

    .achievement-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        backdrop-filter: blur(5px);
        animation: fadeIn 0.3s ease;
    }

    .achievement-modal-content {
        background: var(--card-bg);
        border-radius: var(--border-radius);
        padding: 3rem;
        text-align: center;
        max-width: 400px;
        width: 90%;
        border: 1px solid var(--border-color);
    }

    .achievement-celebration {
        animation: slideUp 0.5s ease;
    }

    .achievement-icon-large {
        width: 100px;
        height: 100px;
        background: linear-gradient(135deg, var(--accent-teal), var(--accent-green));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
        font-size: 3rem;
        color: white;
        animation: pulse 1s infinite;
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }

    .achievement-celebration h2 {
        color: var(--accent-green);
        margin-bottom: 1rem;
        font-size: 1.8rem;
    }

    .achievement-celebration h3 {
        color: var(--text-primary);
        margin-bottom: 0.5rem;
        font-size: 1.4rem;
    }

    .achievement-celebration p {
        color: var(--text-secondary);
        margin-bottom: 2rem;
    }

    .close-achievement-modal {
        background: linear-gradient(135deg, var(--accent-teal), var(--accent-green));
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: transform 0.2s ease;
    }

    .close-achievement-modal:hover {
        transform: translateY(-2px);
    }
`;
document.head.appendChild(animationStyle);

// Create global instance
window.animationController = new AnimationController();

} // End of AnimationController class check