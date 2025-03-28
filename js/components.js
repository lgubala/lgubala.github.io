// js/components.js
class Components {
    static async loadNavigation() {
        const navPlaceholder = document.getElementById('nav-placeholder');
        if (!navPlaceholder) return;
        
        try {
            const response = await fetch('/components/navigation.html');
            const html = await response.text();
            navPlaceholder.innerHTML = html;
            
            // Initialize navigation functionality
            this.initNavigation();
            
            // Update user-specific elements based on auth state
            this.updateAuthElements();
            
            // Highlight current page in navigation
            this.highlightCurrentPage();
        } catch (error) {
            console.error('Failed to load navigation:', error);
            navPlaceholder.innerHTML = '<div class="p-4 text-red-500">Failed to load navigation. Please refresh the page.</div>';
        }
    }
    
    static initNavigation() {
        // Mobile menu toggle
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const hamburgerIcon = document.getElementById('hamburger-icon');
        const closeIcon = document.getElementById('close-icon');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                // Toggle mobile menu visibility
                const isMenuHidden = mobileMenu.classList.contains('hidden');
                
                if (isMenuHidden) {
                    mobileMenu.classList.remove('hidden');
                    hamburgerIcon.classList.add('hidden');
                    closeIcon.classList.remove('hidden');
                } else {
                    mobileMenu.classList.add('hidden');
                    hamburgerIcon.classList.remove('hidden');
                    closeIcon.classList.add('hidden');
                }
            });
        }
        
        // User menu toggle
        const userMenuButton = document.getElementById('user-menu-button');
        const userMenuDropdown = document.getElementById('user-menu-dropdown');
        
        if (userMenuButton && userMenuDropdown) {
            userMenuButton.addEventListener('click', (e) => {
                e.preventDefault();
                userMenuDropdown.classList.toggle('hidden');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (userMenuDropdown && 
                    !userMenuButton.contains(e.target) && 
                    !userMenuDropdown.contains(e.target)) {
                    userMenuDropdown.classList.add('hidden');
                }
            });
        }
        
        // Login button - THIS HAS BEEN FIXED
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            console.log('Adding login button click handler in Components');
            // Remove any existing event listeners by cloning and replacing
            const newLoginBtn = loginBtn.cloneNode(true);
            loginBtn.parentNode.replaceChild(newLoginBtn, loginBtn);
            
            newLoginBtn.addEventListener('click', () => {
                console.log('Login button clicked in Components');
                // Show login modal if exists
                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    console.log('Showing login modal from Components');
                    loginModal.classList.remove('hidden');
                } else {
                    // Otherwise redirect to login page
                    console.log('Modal not found, redirecting to login page');
                    window.location.href = '/login.html';
                }
            });
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Call logout function if auth service exists
                if (window.auth && window.auth.logout) {
                    window.auth.logout();
                } else {
                    // Fallback logout
                    localStorage.removeItem('token');
                    window.location.href = '/';
                }
            });
        }
        
        // Dark mode toggle
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                if (window.darkMode && window.darkMode.toggleDarkMode) {
                    window.darkMode.toggleDarkMode();
                } else {
                    // Fallback dark mode toggle
                    document.documentElement.classList.toggle('dark');
                }
            });
        }
    }
    
    static updateAuthElements() {
        // Show/hide elements based on authentication status
        const userElements = document.querySelectorAll('.user-only');
        const guestElements = document.querySelectorAll('.guest-only');
        
        // Check if user is authenticated
        const isAuthenticated = this.isAuthenticated();
        
        userElements.forEach(el => {
            el.classList.toggle('hidden', !isAuthenticated);
        });
        
        guestElements.forEach(el => {
            el.classList.toggle('hidden', isAuthenticated);
        });
        
        // Update username if authenticated
        if (isAuthenticated) {
            const user = this.getCurrentUser();
            const usernameDisplay = document.getElementById('username-display');
            const userInitials = document.getElementById('user-initials');
            
            if (usernameDisplay && user && user.username) {
                usernameDisplay.textContent = user.username;
            }
            
            if (userInitials && user && user.username) {
                userInitials.textContent = user.username.charAt(0).toUpperCase();
            }
        }
    }
    
    static highlightCurrentPage() {
        // Get current page path
        const currentPath = window.location.pathname;
        const filename = currentPath.split('/').pop() || 'index.html';
        
        // Highlight desktop nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            
            // Remove all active classes
            link.classList.remove('border-indigo-500', 'text-gray-900');
            link.classList.remove('border-transparent', 'text-gray-500', 'hover:border-gray-300', 'hover:text-gray-700');
            
            // Add appropriate classes based on active state
            if (linkPage === filename) {
                link.classList.add('border-indigo-500', 'text-gray-900');
            } else {
                link.classList.add('border-transparent', 'text-gray-500', 'hover:border-gray-300', 'hover:text-gray-700');
            }
        });
        
        // Highlight mobile nav link
        const mobileNavLinks = document.querySelectorAll('.nav-link-mobile');
        mobileNavLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            
            // Remove all active classes
            link.classList.remove('bg-indigo-50', 'border-indigo-500', 'text-indigo-700');
            link.classList.remove('border-transparent', 'text-gray-500', 'hover:bg-gray-50', 'hover:border-gray-300', 'hover:text-gray-700');
            
            // Add appropriate classes based on active state
            if (linkPage === filename) {
                link.classList.add('bg-indigo-50', 'border-indigo-500', 'text-indigo-700');
            } else {
                link.classList.add('border-transparent', 'text-gray-500', 'hover:bg-gray-50', 'hover:border-gray-300', 'hover:text-gray-700');
            }
        });
    }
    
    static isAuthenticated() {
        // Check if auth service exists
        if (window.auth && window.auth.isAuthenticated) {
            return window.auth.isAuthenticated();
        }
        
        // Fallback authentication check
        return !!localStorage.getItem('token');
    }
    
    static getCurrentUser() {
        // Check if auth service exists
        if (window.auth && window.auth.getUser) {
            return window.auth.getUser();
        }
        
        // Fallback user info
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        try {
            // Try to parse username from token if it's in JWT format
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            return JSON.parse(jsonPayload);
        } catch (e) {
            return { username: 'User' };
        }
    }
    
    static async loadFooter() {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (!footerPlaceholder) return;
        
        try {
            const response = await fetch('/components/footer.html');
            const html = await response.text();
            footerPlaceholder.innerHTML = html;
        } catch (error) {
            console.error('Failed to load footer:', error);
        }
    }
    
    static async loadLoginModal() {
        const loginModalPlaceholder = document.getElementById('login-modal-placeholder');
        if (!loginModalPlaceholder) return;
        
        try {
            const response = await fetch('/components/login-modal.html');
            const html = await response.text();
            loginModalPlaceholder.innerHTML = html;
            
            // Initialize login modal functionality
            this.initLoginModal();
            
            // THIS IS NEW - Connect login modal to auth service
            if (window.auth) {
                window.auth.loginModal = document.getElementById('loginModal');
                console.log('Connected login modal to auth service');
            }
        } catch (error) {
            console.error('Failed to load login modal:', error);
        }
    }
    
    static initLoginModal() {
        const loginModal = document.getElementById('loginModal');
        const closeLoginBtn = document.getElementById('closeLoginBtn');
        const loginForm = document.getElementById('login-form');
        
        if (!loginModal) {
            console.error('Login modal not found in initLoginModal');
            return;
        }
        
        if (closeLoginBtn) {
            closeLoginBtn.addEventListener('click', () => {
                console.log('Close login button clicked');
                loginModal.classList.add('hidden');
            });
        }
        
        if (loginForm) {
            // Remove any existing event listeners by cloning and replacing
            const newLoginForm = loginForm.cloneNode(true);
            loginForm.parentNode.replaceChild(newLoginForm, loginForm);
            
            newLoginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                console.log('Login form submitted in Components');
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                if (!email || !password) {
                    alert('Please enter both email and password');
                    return;
                }
                
                const signInBtn = document.getElementById('sign-in-btn');
                if (signInBtn) {
                    signInBtn.textContent = 'Signing in...';
                    signInBtn.disabled = true;
                }
                
                try {
                    // Use the correct auth method - handleLogin instead of login
                    if (window.auth && window.auth.handleLogin) {
                        console.log('Using auth.handleLogin method');
                        await window.auth.handleLogin();
                    } else if (window.api) {
                        // Fallback to direct API call
                        console.log('Auth service not available, calling API directly');
                        const credentials = { email, password };
                        const userData = await window.api.login(credentials);
                        
                        if (userData.token) {
                            console.log('Login successful via API');
                            loginModal.classList.add('hidden');
                            
                            // Redirect after successful login
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        }
                    }
                } catch (error) {
                    console.error('Login failed:', error);
                    alert('Login failed. Please check your credentials and try again.');
                    
                    // Reset button
                    if (signInBtn) {
                        signInBtn.textContent = 'Sign in';
                        signInBtn.disabled = false;
                    }
                }
            });
        }
    }
}

// Initialize components on DOM load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing components');
    // Load components
    await Components.loadNavigation();
    await Components.loadFooter();
    await Components.loadLoginModal();
});