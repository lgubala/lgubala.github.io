/**
 * Authentication Module
 * Handles user authentication and session management with improved error handling and logging
 */
class AuthService {
    constructor() {
        console.log('Auth Service initializing...');
        this.api = window.api;
        this.currentUser = null;
        
        this.authReadyPromise = new Promise(resolve => {
            this.resolveAuthReady = resolve;
        });
        // Initialize DOM element references safely
        this.initDomReferences();
        
        // Initialize auth state
        this.init();
    }
    
    /**
     * Safely initialize DOM element references
     */
    initDomReferences() {
        console.log('Initializing DOM references for auth elements');
        // Forms
        this.loginForm = document.getElementById('login-form');
        this.registerForm = document.getElementById('register-form');
        
        // Buttons
        this.loginBtn = document.getElementById('loginBtn');
        this.signInBtn = document.getElementById('sign-in-btn');
        this.registerBtn = document.getElementById('register-btn');
        this.closeLoginBtn = document.getElementById('closeLoginBtn');
        this.logoutBtn = document.getElementById('logout-btn');
        
        // UI elements
        this.loginModal = document.getElementById('loginModal');
        this.userDropdown = document.getElementById('userDropdown');
        this.usernameDisplay = document.getElementById('username-display');
        this.userMenuButton = document.getElementById('user-menu-button');
        this.userMenuDropdown = document.getElementById('user-menu-dropdown');
        
        console.log('DOM references initialized', {
            'Login Form': !!this.loginForm,
            'Register Form': !!this.registerForm,
            'Login Button': !!this.loginBtn,
            'Logout Button': !!this.logoutBtn
        });
    }
    
    /**
     * Initialize authentication
     */
    async init() {
        console.log('Auth Service init');
        this.attachEventListeners();
        await this.checkAuthStatus();
    }
    
    /**
     * Attach event listeners to auth-related elements
     */
    attachEventListeners() {
        console.log('Attaching auth event listeners');
        
        // Login form
        if (this.loginForm) {
            console.log('Adding login form submit handler');
            this.loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Login form submitted');
                this.handleLogin();
            });
        }
        
        // Register form
        if (this.registerForm) {
            console.log('Adding register form submit handler');
            this.registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Register form submitted');
                this.handleRegister();
            });
        }
        
        // Login button
        if (this.loginBtn) {
            console.log('Adding login button click handler');
            this.loginBtn.addEventListener('click', () => {
                console.log('Login button clicked');
                this.showLoginModal();
            });
        }
        
        // Close login modal
        if (this.closeLoginBtn) {
            console.log('Adding close login modal button handler');
            this.closeLoginBtn.addEventListener('click', () => {
                console.log('Close login modal button clicked');
                this.hideLoginModal();
            });
        }
        
        // Sign in button
        if (this.signInBtn) {
            console.log('Adding sign in button click handler');
            this.signInBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Sign in button clicked');
                this.handleLogin();
            });
        }
        
        // Register button
        if (this.registerBtn) {
            console.log('Adding register button click handler');
            this.registerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Register button clicked');
                this.handleRegister();
            });
        }
        
        // Logout button
        if (this.logoutBtn) {
            console.log('Adding logout button click handler');
            this.logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Logout button clicked');
                this.logout();
            });
        }
        
        // // User menu toggle
        // if (this.userMenuButton) {
        //     console.log('Adding user menu button click handler');
        //     this.userMenuButton.addEventListener('click', () => {
        //         console.log('User menu button clicked');
        //         this.toggleUserMenu();
        //     });
            
        //     // Close menu when clicking outside
        //     document.addEventListener('click', (e) => {
        //         if (this.userMenuDropdown && 
        //             !this.userMenuButton.contains(e.target) && 
        //             !this.userMenuDropdown.contains(e.target)) {
        //             this.userMenuDropdown.classList.add('hidden');
        //         }
        //     });
        // }
    }
    
    /**
     * Check if user is logged in
     */
    async checkAuthStatus() {
        console.log('Checking authentication status');
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.log('No token found, user is not logged in');
            this.updateUIForGuest();
            return;
        }
        
        try {
            console.log('Token found, verifying with API...');
            // Set token in API service
            this.api.setToken(token);
            
            // Get user profile
            const userData = await this.api.getUserProfile();
            console.log('User profile retrieved:', userData);
            this.currentUser = userData;
            
            this.updateUIForUser();
            console.log('UI updated for logged-in user');
            this.resolveAuthReady(true);
        } catch (error) {
            console.error('Auth check failed:', error);
            console.log('Logging out user due to verification failure');
            this.resolveAuthReady(false);
            this.logout();
        }
    }
    
    /**
     * Handle login form submission
     */
    async handleLogin() {
        console.log('Handling login...');
        try {
            const emailElement = document.getElementById('email');
            const passwordElement = document.getElementById('password');
            
            if (!emailElement || !passwordElement) {
                console.error('Email or password input not found in the DOM');
                alert('Login form is missing required fields');
                return;
            }
            
            const email = emailElement.value;
            const password = passwordElement.value;
            
            if (!email || !password) {
                console.error('Email or password is empty');
                alert('Please enter email and password');
                return;
            }
            
            const credentials = { email, password };
            console.log(`Attempting login for: ${email}`);
            
            // Show loading state
            if (this.signInBtn) {
                this.signInBtn.textContent = 'Signing in...';
                this.signInBtn.disabled = true;
            }
            
            // Login
            const userData = await this.api.login(credentials);
            console.log('Login successful, user data received:', userData);
            
            if (!userData.user) {
                console.error('Login response missing user object:', userData);
                throw new Error('Invalid login response from server');
            }
            
            this.currentUser = userData.user;
            
            // Hide modal and update UI
            this.hideLoginModal();
            this.updateUIForUser();
            console.log('UI updated for logged-in user');
            
            // Redirect if needed
            const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
            if (redirectUrl) {
                console.log(`Redirecting to: ${redirectUrl}`);
                window.location.href = redirectUrl;
            } else {
                // Refresh page to update UI
                console.log('Reloading page to apply full UI update');
                window.location.reload();
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials and try again.');
            
            // Reset button
            if (this.signInBtn) {
                this.signInBtn.textContent = 'Sign in';
                this.signInBtn.disabled = false;
            }
        }
    }
    
    /**
     * Handle registration form submission
     */
    async handleRegister() {
        console.log('Handling registration...');
        try {
            const usernameElement = document.getElementById('username');
            const emailElement = document.getElementById('email');
            const passwordElement = document.getElementById('password');
            const confirmPasswordElement = document.getElementById('confirm-password');
            
            if (!usernameElement || !emailElement || !passwordElement || !confirmPasswordElement) {
                console.error('One or more registration inputs not found in the DOM');
                alert('Registration form is missing required fields');
                return;
            }
            
            const username = usernameElement.value;
            const email = emailElement.value;
            const password = passwordElement.value;
            const confirmPassword = confirmPasswordElement.value;
            
            if (!username || !email || !password) {
                console.error('One or more required fields are empty');
                alert('Please fill in all required fields');
                return;
            }
            
            if (password !== confirmPassword) {
                console.error('Passwords do not match');
                alert('Passwords do not match');
                return;
            }
            
            console.log(`Attempting registration for: ${email}`);
            
            // Show loading state
            if (this.registerBtn) {
                this.registerBtn.textContent = 'Creating account...';
                this.registerBtn.disabled = true;
            }
            
            // Register
            const userData = await this.api.register({ username, email, password });
            console.log('Registration successful, user data received:', userData);
            
            if (!userData.user) {
                console.error('Registration response missing user object:', userData);
                throw new Error('Invalid registration response from server');
            }
            
            this.currentUser = userData.user;
            
            // Update UI
            this.updateUIForUser();
            console.log('UI updated for registered user');
            
            // Redirect to home page
            console.log('Redirecting to home page after registration');
            window.location.href = '/';
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed: ' + (error.message || 'Please try again.'));
            
            // Reset button
            if (this.registerBtn) {
                this.registerBtn.textContent = 'Create Account';
                this.registerBtn.disabled = false;
            }
        }
    }

    async waitForAuthReady() {
        return this.authReadyPromise;
    }
    
    /**
     * Handle Google login
     * @param {string} credential - Google JWT credential
     */
    async handleGoogleLogin(credential) {
        console.log('Handling Google login...');
        try {
            if (!credential) {
                console.error('No Google credential provided');
                throw new Error('Google login failed: No credential provided');
            }
            
            // Login with Google
            const userData = await this.api.googleAuth(credential);
            console.log('Google login successful, user data received:', userData);
            
            if (!userData.user) {
                console.error('Google login response missing user object:', userData);
                throw new Error('Invalid Google login response from server');
            }
            
            this.currentUser = userData.user;
            
            // Update UI
            this.updateUIForUser();
            console.log('UI updated for Google-authenticated user');
            
            // Redirect if needed
            const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
            if (redirectUrl) {
                console.log(`Redirecting to: ${redirectUrl}`);
                window.location.href = redirectUrl;
            } else {
                // Refresh page to update UI
                console.log('Redirecting to home page');
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Google login failed:', error);
            alert('Google login failed. Please try again.');
        }
    }
    
    /**
     * Logout user
     */
    logout() {
        console.log('Logging out user');
        this.api.clearToken();
        this.currentUser = null;
        this.updateUIForGuest();
        console.log('UI updated for guest user');
        
        // Redirect to home page
        console.log('Redirecting to home page after logout');
        window.location.href = '/';
    }
    
    /**
     * Update UI for logged in user
     */
    updateUIForUser() {
        console.log('Updating UI for logged-in user:', this.currentUser);
        if (!this.currentUser) {
            console.error('Trying to update UI for user, but currentUser is null');
            return;
        }
        
        try {
            // Update login button/user dropdown
            if (this.loginBtn) {
                console.log('Hiding login button');
                this.loginBtn.classList.add('hidden');
            }
            
            if (this.userDropdown) {
                console.log('Showing user dropdown');
                this.userDropdown.classList.remove('hidden');
                
                if (this.usernameDisplay) {
                    console.log('Updating username display');
                    this.usernameDisplay.textContent = this.currentUser.username;
                }
            }
            
            // Show user-only elements
            console.log('Showing user-only elements');
            document.querySelectorAll('.user-only').forEach(el => {
                el.classList.remove('hidden');
            });
            
            // Hide guest-only elements
            console.log('Hiding guest-only elements');
            document.querySelectorAll('.guest-only').forEach(el => {
                el.classList.add('hidden');
            });
            
            console.log('UI update for logged-in user complete');
        } catch (error) {
            console.error('Error updating UI for logged-in user:', error);
        }
    }
    
    /**
     * Update UI for guest user
     */
    updateUIForGuest() {
        console.log('Updating UI for guest user');
        try {
            // Update login button/user dropdown
            if (this.loginBtn) {
                console.log('Showing login button');
                this.loginBtn.classList.remove('hidden');
            }
            
            if (this.userDropdown) {
                console.log('Hiding user dropdown');
                this.userDropdown.classList.add('hidden');
            }
            
            // Hide user-only elements
            console.log('Hiding user-only elements');
            document.querySelectorAll('.user-only').forEach(el => {
                el.classList.add('hidden');
            });
            
            // Show guest-only elements
            console.log('Showing guest-only elements');
            document.querySelectorAll('.guest-only').forEach(el => {
                el.classList.remove('hidden');
            });
            
            console.log('UI update for guest user complete');
        } catch (error) {
            console.error('Error updating UI for guest user:', error);
        }
    }
    
    /**
     * Toggle user dropdown menu
     * @deprecated Use Navigation class instead
     */
    toggleUserMenu() {
        console.log('Auth toggleUserMenu called - deferring to navigation.js');
        // This function is now handled by navigation.js
        // Do nothing to avoid conflict
        return;
    }
    
    /**
     * Show login modal
     */
    showLoginModal() {
        console.log('Showing login modal');
        if (this.loginModal) {
            this.loginModal.classList.remove('hidden');
        } else {
            console.error('Login modal not found, redirecting to login page');
            window.location.href = '/login.html';
        }
    }
    
    /**
     * Hide login modal
     */
    hideLoginModal() {
        console.log('Hiding login modal');
        if (this.loginModal) {
            this.loginModal.classList.add('hidden');
        }
    }
    
    /**
     * Check if user is authenticated
     * @returns {boolean} - Authentication status
     */
    isAuthenticated() {
        const isAuth = !!this.currentUser;
        console.log(`Auth check: User is ${isAuth ? 'authenticated' : 'not authenticated'}`);
        return isAuth;
    }
    
    /**
     * Get user data from profile
     * @returns {Object|null} User data or null if not authenticated
     */
    getUser() {
        if (!this.currentUser && this.isAuthenticated()) {
            // Try to fetch user data if we have a token but no user data
            this.checkAuthStatus();
            return null; // Return null for now, data will be available after fetch
        }
        return this.currentUser;
    }

    /**
     * Show login modal or redirect to login page
     * @param {string} redirectUrl - URL to redirect after login (optional)
     */
    showLoginPrompt(redirectUrl = null) {
        const currentUrl = redirectUrl || window.location.href;
        
        // If we have a login modal, show it
        if (this.loginModal) {
            console.log('Showing login modal');
            this.loginModal.classList.remove('hidden');
            
            // Store redirect URL for use after login
            localStorage.setItem('auth_redirect', currentUrl);
        } else {
            // Otherwise redirect to login page
            console.log('Redirecting to login page');
            window.location.href = `/login.html?redirect=${encodeURIComponent(currentUrl)}`;
        }
    }

    /**
     * Check if a feature requires authentication
     * @param {Function} callback - Function to execute if authenticated
     * @param {string} redirectUrl - URL to redirect after login (optional)
     */
    requireAuth(callback, redirectUrl = null) {
        if (this.isAuthenticated()) {
            // User is logged in, execute callback
            callback();
        } else {
            // User is not logged in, show login prompt
            this.showLoginPrompt(redirectUrl);
        }
    }

    /**
     * Handle successful login
     * @param {Object} userData - User data from API
     */
    handleSuccessfulLogin(userData) {
        this.currentUser = userData.user;
        
        // Update UI for logged-in user
        this.updateUIForUser();
        
        // Check for redirect URL
        const redirectUrl = localStorage.getItem('auth_redirect');
        if (redirectUrl) {
            localStorage.removeItem('auth_redirect');
            window.location.href = redirectUrl;
        } else {
            // Default redirect to home page
            window.location.href = '/';
        }
    }

}

// Initialize auth service when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Auth Service');
    // Ensure the API service is initialized first
    if (!window.api) {
        console.error('API service not found! Make sure api.js is loaded before auth.js');
        window.api = {
            setToken: () => console.error('API mock: setToken called but API not properly initialized'),
            clearToken: () => console.error('API mock: clearToken called but API not properly initialized'),
            login: () => {
                console.error('API mock: login called but API not properly initialized');
                return Promise.reject(new Error('API not initialized'));
            },
            register: () => {
                console.error('API mock: register called but API not properly initialized');
                return Promise.reject(new Error('API not initialized'));
            },
            getUserProfile: () => {
                console.error('API mock: getUserProfile called but API not properly initialized');
                return Promise.reject(new Error('API not initialized'));
            }
        };
    }
    
    window.auth = new AuthService();
    console.log('Auth Service initialized and attached to window.auth');
});