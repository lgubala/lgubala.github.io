/**
 * Login Page Manager
 * Handles login form submission and Google Sign-In integration
 */
class LoginPageManager {
    constructor() {
        console.log('Login Page Manager initializing...');
        this.api = window.api;
        this.auth = window.auth;
        
        // Initialize DOM references
        this.initDomReferences();
        
        // Initialize the login page
        this.init();
    }
    
    /**
     * Initialize DOM references
     */
    initDomReferences() {
        this.loginForm = document.getElementById('login-form');
        this.signInBtn = document.getElementById('sign-in-btn');
        this.googleLoginBtn = document.getElementById('googleLoginBtn');
        this.loginAlert = document.getElementById('login-alert');
        this.loginAlertMessage = document.getElementById('login-alert-message');
    }
    
    /**
     * Initialize login page
     */
    init() {
        console.log('Login page initializing...');
        
        // Check for redirect parameter
        const redirectParam = new URLSearchParams(window.location.search).get('redirect');
        if (redirectParam) {
            console.log(`Login page loaded with redirect parameter: ${redirectParam}`);
        }
        
        // Check if user is already logged in
        if (this.auth && this.auth.isAuthenticated()) {
            console.log('User is already authenticated, redirecting');
            const redirectUrl = redirectParam || '/';
            window.location.href = redirectUrl;
            return;
        }
        
        // Attach event listeners
        this.attachEventListeners();
        
        // Initialize Google Sign-In if available
        this.initGoogleSignIn();
        
        console.log('Login page initialized');
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Login form submission
        if (this.loginForm) {
            console.log('Adding login form submit handler');
            this.loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLoginSubmit();
            });
        } else {
            console.error('Login form not found!');
        }
    }
    
    /**
     * Show alert message
     * @param {string} message - Alert message
     * @param {boolean} isError - Whether it's an error
     */
    showAlert(message, isError = false) {
        if (!this.loginAlert || !this.loginAlertMessage) return;
        
        this.loginAlert.classList.remove('hidden', 'bg-red-100', 'bg-green-100');
        this.loginAlertMessage.classList.remove('text-red-800', 'text-green-800');
        
        if (isError) {
            this.loginAlert.classList.add('bg-red-100');
            this.loginAlertMessage.classList.add('text-red-800');
        } else {
            this.loginAlert.classList.add('bg-green-100');
            this.loginAlertMessage.classList.add('text-green-800');
        }
        
        this.loginAlertMessage.textContent = message;
        this.loginAlert.classList.remove('hidden');
    }
    
    /**
     * Hide alert
     */
    hideAlert() {
        if (this.loginAlert) {
            this.loginAlert.classList.add('hidden');
        }
    }
    
    /**
     * Handle login form submission
     */
    async handleLoginSubmit() {
        this.hideAlert();
        
        console.log('Login form submitted');
        const emailElement = document.getElementById('email');
        const passwordElement = document.getElementById('password');
        
        if (!emailElement || !passwordElement) {
            console.error('Email or password missing');
            this.showAlert('Please enter both email and password', true);
            return;
        }
        
        const email = emailElement.value;
        const password = passwordElement.value;
        
        if (!email || !password) {
            console.error('Email or password missing');
            this.showAlert('Please enter both email and password', true);
            return;
        }
        
        // Show loading state
        if (this.signInBtn) {
            this.signInBtn.textContent = 'Signing in...';
            this.signInBtn.disabled = true;
        }
        
        try {
            console.log(`Attempting login for ${email}`);
            const credentials = { email, password };
            
            // Call API directly
            const userData = await this.api.login(credentials);
            console.log('Login API response:', userData);
            
            if (!userData.token) {
                throw new Error('Login failed: No token received');
            }
            
            this.showAlert('Login successful! Redirecting...', false);
            
            // Handle redirect
            setTimeout(() => {
                const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
                if (redirectUrl) {
                    console.log(`Redirecting to: ${redirectUrl}`);
                    window.location.href = redirectUrl;
                } else {
                    console.log('Redirecting to home page');
                    window.location.href = '/';
                }
            }, 1000);
            
        } catch (error) {
            console.error('Login error:', error);
            this.showAlert('Login failed: ' + (error.message || 'Please check your credentials'), true);
            
            // Reset button
            if (this.signInBtn) {
                this.signInBtn.textContent = 'Sign in';
                this.signInBtn.disabled = false;
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

// Initialize Login Page Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Login Page Manager');
    window.loginPage = new LoginPageManager();
});