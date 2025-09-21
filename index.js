// Main application functionality
class RamzzApp {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.bindEvents();
        this.loadTheme();
    }

    checkAuthStatus() {
        // Check if user is logged in (from localStorage)
        const userData = localStorage.getItem('ramzzUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.isLoggedIn = true;
            
            // Redirect to dashboard if on auth pages
            if (window.location.pathname.includes('login.html') || 
                window.location.pathname.includes('daftar.html')) {
                window.location.href = 'dashboard.html';
            }
        } else {
            this.isLoggedIn = false;
            
            // Redirect to login if on protected pages
            if (window.location.pathname.includes('dashboard.html') || 
                window.location.pathname.includes('profil.html') ||
                window.location.pathname.includes('pengaturan.html')) {
                window.location.href = 'login.html';
            }
        }
    }

    bindEvents() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Sidebar toggle
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                document.getElementById('sidebar').classList.toggle('show');
            });
        }

        // Close sidebar
        const closeSidebar = document.getElementById('closeSidebar');
        if (closeSidebar) {
            closeSidebar.addEventListener('click', () => {
                document.getElementById('sidebar').classList.remove('show');
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Handle form submissions
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProfileUpdate();
            });
        }

        // Click outside sidebar to close (mobile)
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const menuToggle = document.getElementById('menuToggle');
            
            if (window.innerWidth <= 768 && 
                sidebar && 
                !sidebar.contains(e.target) && 
                menuToggle && 
                !menuToggle.contains(e.target) && 
                sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
            }
        });
    }

    toggleTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');
        
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        }
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        const themeToggle = document.getElementById('themeToggle');
        
        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.removeAttribute('data-theme');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Simple validation
        if (!email || !password) {
            this.showNotification('Email dan password harus diisi', 'error');
            return;
        }

        // Simulate login process
        this.showLoading(true);

        setTimeout(() => {
            // For demo purposes, create a user object
            const user = {
                id: 1,
                name: 'Demo User',
                email: email,
                joined: new Date().toISOString()
            };

            // Save to localStorage
            localStorage.setItem('ramzzUser', JSON.stringify(user));
            
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }

            this.currentUser = user;
            this.isLoggedIn = true;

            this.showNotification('Login berhasil!', 'success');
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
            
            this.showLoading(false);
        }, 1000);
    }

    handleRegister() {
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const termsAgree = document.getElementById('termsAgree').checked;

        // Validation
        if (!fullName || !email || !password || !confirmPassword) {
            this.showNotification('Semua field harus diisi', 'error');
            return;
        }

        if (password.length < 8) {
            this.showNotification('Password minimal 8 karakter', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('Password dan konfirmasi password tidak sama', 'error');
            return;
        }

        if (!termsAgree) {
            this.showNotification('Anda harus menyetujui syarat dan ketentuan', 'error');
            return;
        }

        this.showLoading(true);

        setTimeout(() => {
            // Create user object
            const user = {
                id: Date.now(),
                name: fullName,
                email: email,
                joined: new Date().toISOString()
            };

            // Save to localStorage
            localStorage.setItem('ramzzUser', JSON.stringify(user));
            this.currentUser = user;
            this.isLoggedIn = true;

            this.showNotification('Pendaftaran berhasil!', 'success');
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
            
            this.showLoading(false);
        }, 1500);
    }

    handleProfileUpdate() {
        const name = document.getElementById('profileName').value;
        const email = document.getElementById('profileEmail').value;
        const bio = document.getElementById('profileBio').value;

        if (!name || !email) {
            this.showNotification('Nama dan email harus diisi', 'error');
            return;
        }

        this.showLoading(true);

        setTimeout(() => {
            // Update user data
            this.currentUser.name = name;
            this.currentUser.email = email;
            this.currentUser.bio = bio;

            // Save to localStorage
            localStorage.setItem('ramzzUser', JSON.stringify(this.currentUser));

            this.showNotification('Profil berhasil diperbarui', 'success');
            this.showLoading(false);
        }, 1000);
    }

    logout() {
        localStorage.removeItem('ramzzUser');
        this.currentUser = null;
        this.isLoggedIn = false;
        
        // Redirect to login page
        window.location.href = 'login.html';
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add styles if not already added
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-width: 300px;
                    max-width: 500px;
                    z-index: 10000;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    animation: slideIn 0.3s ease;
                }
                
                .notification.success {
                    background: var(--success-color);
                }
                
                .notification.error {
                    background: var(--error-color);
                }
                
                .notification.info {
                    background: var(--info-color);
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 0.25rem;
                }
                
                .notification-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        // Add to page
        document.body.appendChild(notification);

        // Add close event
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    showLoading(show) {
        // Create or get loading overlay
        let loadingOverlay = document.getElementById('loadingOverlay');
        
        if (show) {
            if (!loadingOverlay) {
                loadingOverlay = document.createElement('div');
                loadingOverlay.id = 'loadingOverlay';
                loadingOverlay.className = 'loading-overlay';
                loadingOverlay.innerHTML = `
                    <div class="loading-spinner">
                        <i class="fas fa-robot fa-spin"></i>
                        <p>Memproses...</p>
                    </div>
                `;
                
                // Add styles if not already added
                if (!document.getElementById('loading-styles')) {
                    const styles = document.createElement('style');
                    styles.id = 'loading-styles';
                    styles.textContent = `
                        .loading-overlay {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0, 0, 0, 0.5);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 9999;
                        }
                        
                        .loading-spinner {
                            text-align: center;
                            color: white;
                        }
                        
                        .loading-spinner i {
                            font-size: 3rem;
                            color: var(--neon-color);
                            margin-bottom: 1rem;
                        }
                    `;
                    document.head.appendChild(styles);
                }
                
                document.body.appendChild(loadingOverlay);
            } else {
                loadingOverlay.style.display = 'flex';
            }
        } else if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ramzzApp = new RamzzApp();
});