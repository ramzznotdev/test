// Authentication specific functionality
class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindAuthEvents();
        this.checkRememberMe();
    }

    bindAuthEvents() {
        // Password visibility toggle
        const togglePasswordBtns = document.querySelectorAll('.toggle-password');
        togglePasswordBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const input = btn.previousElementSibling;
                if (input.type === 'password') {
                    input.type = 'text';
                    btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
                } else {
                    input.type = 'password';
                    btn.innerHTML = '<i class="fas fa-eye"></i>';
                }
            });
        });

        // Form validation
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });

        // Input validation on blur
        const inputs = document.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });

        // Special validation for registration form
        if (form.id === 'registerForm') {
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirmPassword');
            
            if (password.value !== confirmPassword.value) {
                this.showInputError(confirmPassword, 'Password dan konfirmasi password tidak sama');
                isValid = false;
            }
        }

        return isValid;
    }

    validateInput(input) {
        const value = input.value.trim();
        
        // Clear previous errors
        this.clearInputError(input);
        
        // Check if empty
        if (!value) {
            this.showInputError(input, 'Field ini harus diisi');
            return false;
        }
        
        // Email validation
        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showInputError(input, 'Format email tidak valid');
                return false;
            }
        }
        
        // Password validation
        if (input.type === 'password' && input.id === 'password') {
            if (value.length < 8) {
                this.showInputError(input, 'Password minimal 8 karakter');
                return false;
            }
        }
        
        return true;
    }

    showInputError(input, message) {
        // Add error class
        input.classList.add('error');
        
        // Create or get error message element
        let errorElement = input.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            input.parentNode.insertBefore(errorElement, input.nextSibling);
        }
        
        // Set error message
        errorElement.textContent = message;
        
        // Add styles if not already added
        if (!document.getElementById('form-error-styles')) {
            const styles = document.createElement('style');
            styles.id = 'form-error-styles';
            styles.textContent = `
                .error {
                    border-color: var(--error-color) !important;
                }
                
                .error-message {
                    color: var(--error-color);
                    font-size: 0.8rem;
                    margin-top: 0.25rem;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    clearInputError(input) {
        input.classList.remove('error');
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }
    }

    checkRememberMe() {
        const rememberMe = localStorage.getItem('rememberMe');
        if (rememberMe === 'true' && window.location.pathname.includes('login.html')) {
            const savedEmail = localStorage.getItem('savedEmail');
            if (savedEmail) {
                const emailInput = document.getElementById('email');
                if (emailInput) {
                    emailInput.value = savedEmail;
                    document.getElementById('rememberMe').checked = true;
                }
            }
        }
    }

    saveRememberMe(email, remember) {
        if (remember) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('savedEmail', email);
        } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('savedEmail');
        }
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});