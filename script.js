// Auto Rendering Website JavaScript
class AutoRenderingWebsite {
    constructor() {
        this.isAutoUpdateActive = true;
        this.startTime = Date.now();
        this.pageViews = parseInt(localStorage.getItem('pageViews') || '0') + 1;
        this.isDarkTheme = localStorage.getItem('theme') !== 'light';
        this.chartData = [];
        this.messageQueue = [];
        
        this.init();
    }

    init() {
        this.updatePageViews();
        this.initializeTheme();
        this.startClock();
        this.startAutoUpdates();
        this.initializeChart();
        this.generateInitialContent();
        this.setupEventListeners();
        this.createFloatingParticles();
        this.showAutoUpdateIndicator();
        
        console.log('🚀 Auto Rendering Website initialized!');
    }

    // Theme Management
    initializeTheme() {
        if (!this.isDarkTheme) {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        if (this.isDarkTheme) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
        
        this.addMessage('Theme switched to ' + (this.isDarkTheme ? 'dark' : 'light') + ' mode');
    }

    // Clock functionality
    startClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('clock').textContent = timeString;
    }

    // Statistics Updates
    updatePageViews() {
        localStorage.setItem('pageViews', this.pageViews.toString());
        document.getElementById('pageViews').textContent = this.pageViews.toLocaleString();
    }

    updateTimeSpent() {
        const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(timeSpent / 60);
        const seconds = timeSpent % 60;
        const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
        document.getElementById('timeSpent').textContent = timeString;
    }

    updateRandomNumber() {
        const randomNum = Math.floor(Math.random() * 10000);
        const element = document.getElementById('randomNumber');
        element.style.transform = 'scale(1.2)';
        element.textContent = randomNum.toLocaleString();
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }

    // Color Palette Generation
    generateColorPalette() {
        const palette = document.getElementById('colorPalette');
        palette.innerHTML = '';
        
        for (let i = 0; i < 10; i++) {
            const color = this.generateRandomColor();
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.title = color;
            swatch.onclick = () => this.copyToClipboard(color);
            palette.appendChild(swatch);
        }
    }

    generateRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 50) + 50; // 50-100%
        const lightness = Math.floor(Math.random() * 40) + 30;  // 30-70%
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.addMessage(`Copied color ${text} to clipboard`);
        });
    }

    // Quote Generation
    async generateQuote() {
        const quotes = [
            "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
            "Innovation distinguishes between a leader and a follower. - Steve Jobs",
            "The only way to do great work is to love what you do. - Steve Jobs",
            "Life is what happens to you while you're busy making other plans. - John Lennon",
            "The future depends on what you do today. - Mahatma Gandhi",
            "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
            "The only impossible journey is the one you never begin. - Tony Robbins",
            "In the middle of difficulty lies opportunity. - Albert Einstein",
            "Believe you can and you're halfway there. - Theodore Roosevelt",
            "The best time to plant a tree was 20 years ago. The second best time is now. - Chinese Proverb"
        ];
        
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        const quoteElement = document.getElementById('quote');
        
        // Add loading effect
        quoteElement.classList.add('loading');
        
        setTimeout(() => {
            quoteElement.textContent = randomQuote;
            quoteElement.classList.remove('loading');
        }, 500);
    }

    // Chart Functionality
    initializeChart() {
        const canvas = document.getElementById('chart');
        this.ctx = canvas.getContext('2d');
        this.chartData = Array.from({length: 20}, () => Math.random() * 100);
        this.drawChart();
    }

    drawChart() {
        const canvas = document.getElementById('chart');
        const ctx = this.ctx;
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Set styles
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(102, 126, 234, 0.8)');
        gradient.addColorStop(1, 'rgba(102, 126, 234, 0.1)');
        
        ctx.fillStyle = gradient;
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 3;
        
        // Draw chart
        ctx.beginPath();
        const pointWidth = width / (this.chartData.length - 1);
        
        this.chartData.forEach((value, index) => {
            const x = index * pointWidth;
            const y = height - (value / 100) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        // Fill area under curve
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();
        
        // Draw line
        ctx.beginPath();
        this.chartData.forEach((value, index) => {
            const x = index * pointWidth;
            const y = height - (value / 100) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = '#667eea';
        this.chartData.forEach((value, index) => {
            const x = index * pointWidth;
            const y = height - (value / 100) * height;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    updateChart() {
        // Shift data and add new point
        this.chartData.shift();
        this.chartData.push(Math.random() * 100);
        this.drawChart();
    }

    // Message System
    addMessage(text) {
        const messageFeed = document.getElementById('messageFeed');
        const message = document.createElement('div');
        message.className = 'message';
        
        const time = new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
        
        message.innerHTML = `
            <span class="message-time">${time}</span>
            <div>${text}</div>
        `;
        
        messageFeed.appendChild(message);
        messageFeed.scrollTop = messageFeed.scrollHeight;
        
        // Limit messages to last 50
        while (messageFeed.children.length > 50) {
            messageFeed.removeChild(messageFeed.firstChild);
        }
    }

    // Floating Particles
    createFloatingParticles() {
        const container = document.getElementById('particles');
        
        setInterval(() => {
            if (container.children.length < 20) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                const size = Math.random() * 6 + 2;
                const left = Math.random() * 100;
                const animationDuration = Math.random() * 10 + 15;
                
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.left = left + '%';
                particle.style.animationDuration = animationDuration + 's';
                particle.style.opacity = Math.random() * 0.3 + 0.1;
                
                container.appendChild(particle);
                
                // Remove particle after animation
                setTimeout(() => {
                    if (container.contains(particle)) {
                        container.removeChild(particle);
                    }
                }, animationDuration * 1000);
            }
        }, 2000);
    }

    // Auto Update System
    startAutoUpdates() {
        // Update time spent every second
        setInterval(() => {
            if (this.isAutoUpdateActive) {
                this.updateTimeSpent();
            }
        }, 1000);

        // Update random number every 3 seconds
        setInterval(() => {
            if (this.isAutoUpdateActive) {
                this.updateRandomNumber();
            }
        }, 3000);

        // Update chart every 5 seconds
        setInterval(() => {
            if (this.isAutoUpdateActive) {
                this.updateChart();
            }
        }, 5000);

        // Generate new quote every 15 seconds
        setInterval(() => {
            if (this.isAutoUpdateActive) {
                this.generateQuote();
            }
        }, 15000);

        // Generate new color palette every 10 seconds
        setInterval(() => {
            if (this.isAutoUpdateActive) {
                this.generateColorPalette();
            }
        }, 10000);

        // Add random messages
        setInterval(() => {
            if (this.isAutoUpdateActive) {
                this.addRandomMessage();
            }
        }, 8000);
    }

    addRandomMessage() {
        const messages = [
            "System performing automatic updates...",
            "New data visualization generated",
            "Color palette refreshed",
            "Performance metrics updated",
            "Real-time synchronization complete",
            "Background processes optimized",
            "User interface elements refreshed",
            "Dynamic content regenerated",
            "Auto-rendering cycle completed"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.addMessage(randomMessage);
    }

    toggleAutoUpdate() {
        this.isAutoUpdateActive = !this.isAutoUpdateActive;
        const btn = document.getElementById('pauseBtn');
        btn.textContent = this.isAutoUpdateActive ? 'Pause Auto-Update' : 'Resume Auto-Update';
        
        this.updateAutoUpdateIndicator();
        this.addMessage(`Auto-update ${this.isAutoUpdateActive ? 'resumed' : 'paused'}`);
    }

    showAutoUpdateIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'auto-update-indicator';
        indicator.id = 'autoUpdateIndicator';
        indicator.textContent = 'Auto-Update Active';
        document.body.appendChild(indicator);
    }

    updateAutoUpdateIndicator() {
        const indicator = document.getElementById('autoUpdateIndicator');
        if (indicator) {
            indicator.textContent = this.isAutoUpdateActive ? 'Auto-Update Active' : 'Auto-Update Paused';
            indicator.classList.toggle('paused', !this.isAutoUpdateActive);
        }
    }

    // Initial Content Generation
    generateInitialContent() {
        this.generateColorPalette();
        this.generateQuote();
        this.addMessage('Welcome to the Auto Rendering Website!');
        this.addMessage('Content will update automatically every few seconds');
    }

    // Event Listeners
    setupEventListeners() {
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generateAllContent();
        });

        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.toggleAutoUpdate();
        });

        document.getElementById('themeBtn').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' && e.ctrlKey) {
                e.preventDefault();
                this.toggleAutoUpdate();
            }
            if (e.key === 't' && e.ctrlKey) {
                e.preventDefault();
                this.toggleTheme();
            }
            if (e.key === 'g' && e.ctrlKey) {
                e.preventDefault();
                this.generateAllContent();
            }
        });

        // Page visibility API to pause when tab is not active
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.wasAutoUpdateActive = this.isAutoUpdateActive;
                this.isAutoUpdateActive = false;
            } else {
                this.isAutoUpdateActive = this.wasAutoUpdateActive;
            }
        });
    }

    generateAllContent() {
        this.generateColorPalette();
        this.generateQuote();
        this.updateRandomNumber();
        this.updateChart();
        this.addMessage('All content regenerated manually');
        
        // Add visual feedback
        document.querySelectorAll('.card').forEach(card => {
            card.style.transform = 'scale(1.02)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 200);
        });
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.autoRenderingSite = new AutoRenderingWebsite();
});

// Add some fun console messages
console.log(`
🌟 Welcome to the Auto Rendering Website! 🌟

Keyboard Shortcuts:
• Ctrl + Space: Toggle auto-update
• Ctrl + T: Toggle theme
• Ctrl + G: Generate new content

Features:
• Real-time clock
• Dynamic statistics
• Auto-updating charts
• Random color palettes
• Inspirational quotes
• Floating particles
• Theme switching
• Message feed

Enjoy the show! 🎉
`);

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`⚡ Page loaded in ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
        }, 0);
    });
}