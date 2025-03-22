/**
 * Register Page Manager
 * Handles registration form submission and validation
 */
class RegisterPageManager {
    constructor() {
        console.log('Register Page Manager initializing...');
        this.api = window.api;
        this.auth = window.auth;
        
        // Initialize DOM references
        this.initDomReferences();
        
        // Initialize the register page
        this.init();
    }
    
    /**
     * Initialize DOM references
     */
    initDomReferences() {
        this.registerForm = document.getElementById('register-form');
        this.registerBtn = document.getElementById('register-btn');
        this.googleLoginBtn = document.getElementById('googleLoginBtn');
        this.registerAlert = document.getElementById('register-alert');
        this.registerAlertMessage = document.getElementById('register-alert-message');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirm-password');
    }
    
    /**
     * Initialize register page
     */
    init() {
        console.log('Register page initializing...');
        
        // Check if user is already logged in
        if (this.auth && this.auth.isAuthenticated()) {
            console.log('User is already authenticated, redirecting');
            const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/';
            window.location.href = redirectUrl;
            return;
        }
        
        // Attach event listeners
        this.attachEventListeners();
        
        // Initialize Google Sign-In if available
        this.initGoogleSignIn();
        
        console.log('Register page initialized');
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Register form submission
        if (this.registerForm) {
            console.log('Adding register form submit handler');
            this.registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleRegisterSubmit();
            });
        } else {
            console.error('Register form not found!');
        }
        
        // Add real-time password matching validation
        if (this.passwordInput && this.confirmPasswordInput) {
            this.confirmPasswordInput.addEventListener('input', () => {
                if (this.confirmPasswordInput.value && this.passwordInput.value !== this.confirmPasswordInput.value) {
                    this.confirmPasswordInput.setCustomValidity('Passwords do not match');
                } else {
                    this.confirmPasswordInput.setCustomValidity('');
                }
            });
            
            this.passwordInput.addEventListener('input', () => {
                if (this.confirmPasswordInput.value && this.passwordInput.value !== this.confirmPasswordInput.value) {
                    this.confirmPasswordInput.setCustomValidity('Passwords do not match');
                } else {
                    this.confirmPasswordInput.setCustomValidity('');
                }
            });
        }
    }
    
    /**
     * Show alert message
     * @param {string} message - Alert message
     * @param {boolean} isError - Whether it's an error
     */
    showAlert(message, isError = false) {
        if (!this.registerAlert || !this.registerAlertMessage) return;
        
        this.registerAlert.classList.remove('hidden', 'bg-red-100', 'bg-green-100');
        this.registerAlertMessage.classList.remove('text-red-800', 'text-green-800');
        
        if (isError) {
            this.registerAlert.classList.add('bg-red-100');
            this.registerAlertMessage.classList.add('text-red-800');
        } else {
            this.registerAlert.classList.add('bg-green-100');
            this.registerAlertMessage.classList.add('text-green-800');
        }
        
        this.registerAlertMessage.textContent = message;
        this.registerAlert.classList.remove('hidden');
    }
    
    /**
     * Hide alert
     */
    hideAlert() {
        if (this.registerAlert) {
            this.registerAlert.classList.add('hidden');
        }
    }
    
    /**
     * Validate password
     * @param {string} password - Password to validate
     * @returns {string|null} - Error message or null if valid
     */
    validatePassword(password) {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        return null; // No error
    }
    
    /**
     * Handle registration form submission
     */
    async handleRegisterSubmit() {
        this.hideAlert();
        
        console.log('Register form submitted');
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
            console.error('One or more fields are empty');
            this.showAlert('Please fill in all fields', true);
            return;
        }
        
        // Password validation
        const passwordError = this.validatePassword(password);
        if (passwordError) {
            console.error('Password validation failed:', passwordError);
            this.showAlert(passwordError, true);
            return;
        }
        
        // Password confirmation
        if (password !== confirmPassword) {
            console.error('Passwords do not match');
            this.showAlert('Passwords do not match', true);
            return;
        }
        
        // Show loading state
        if (this.registerBtn) {
            this.registerBtn.textContent = 'Creating account...';
            this.registerBtn.disabled = true;
        }
        
        try {
            console.log(`Attempting registration for ${email}`);
            const userData = { username, email, password };
            
            // Call API directly
            const response = await this.api.register(userData);
            console.log('Registration API response:', response);
            
            if (!response.token) {
                throw new Error('Registration failed: No token received');
            }
            
            this.showAlert('Account created successfully! Redirecting...', false);
            
            // Redirect after successful registration
            setTimeout(() => {
                const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
                if (redirectUrl) {
                    console.log(`Redirecting to: ${redirectUrl}`);
                    window.location.href = redirectUrl;
                } else {
                    console.log('Redirecting to home page');
                    window.location.href = '/';
                }
            }, 1500);
            
        } catch (error) {
            console.error('Registration error:', error);
            this.showAlert('Registration failed: ' + (error.message || 'Please try again with different information'), true);
            
            // Reset button
            if (this.registerBtn) {
                this.registerBtn.textContent = 'Create Account';
                this.registerBtn.disabled = false;
            }
        }
    }
    
    /**
     * Initialize Google Sign-In functionality
     */
    initGoogleSignIn() {
        console.log('Initializing Google Sign-In');
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.initialize({
                client_id: '123456789012-example.apps.googleusercontent.com', // Replace with your Google Client ID
                callback: this.handleGoogleCredentialResponse.bind(this)
            });
            
            const googleSignInButton = document.getElementById('googleSignInButton');
            if (googleSignInButton) {
                google.accounts.id.renderButton(
                    googleSignInButton,
                    { theme: 'outline', size: 'large', width: '100%' }
                );
            }
            
            // For the regular Google button
            if (this.googleLoginBtn) {
                this.googleLoginBtn.addEventListener('click', () => {
                    console.log('Google login button clicked');
                    google.accounts.id.prompt();
                });
            }
        } else {
            console.error('Google accounts API not loaded');
            
            // Hide Google sign-in elements if API isn't available
            const googleElements = document.querySelectorAll('#googleSignInButton, #googleLoginBtn');
            googleElements.forEach(el => el.classList.add('hidden'));
            
            const divider = document.querySelector('.relative');
            if (divider) divider.classList.add('hidden');
        }
    }
    
    /**
     * Handle Google Sign-In credential response
     * @param {Object} response - Google credential response
     */
    handleGoogleCredentialResponse(response) {
        console.log('Google sign-in callback received');
        if (response && response.credential) {
            // Send the token to your backend for verification
            const credential = response.credential;
            
            if (this.auth) {
                console.log('Handling Google login through auth service');
                this.auth.handleGoogleLogin(credential);
            } else {
                console.error('Auth service not available for Google login');
                this.showAlert('Error: Authentication service not initialized', true);
            }
        } else {
            console.error('Invalid Google sign-in response', response);
            this.showAlert('Google sign-in failed', true);
        }
    }
}

// Initialize Register Page Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Register Page Manager');
    window.registerPage = new RegisterPageManager();
});