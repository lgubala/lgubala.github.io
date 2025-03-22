/**
 * Authentication State Handler
 * Manages UI updates based on authentication state across all pages
 */
class AuthStateHandler {
    constructor() {
        console.log('Auth State Handler initializing...');
        this.api = window.api;
        
        // Check if the user is logged in
        this.checkAuthState();
        
        // Set up logout functionality
        this.setupLogout();
        
        console.log('Auth State Handler initialized');
    }
    
    /**
     * Check if the user is logged in and update UI accordingly
     * @returns {boolean} Authentication state
     */
    checkAuthState() {
        const token = localStorage.getItem('token');
        const isLoggedIn = !!token;
        
        console.log('Auth state check:', isLoggedIn ? 'User is logged in' : 'User is not logged in');
        
        if (isLoggedIn) {
            this.updateUIForLoggedInUser();
        } else {
            this.updateUIForGuest();
        }
        
        // Protect restricted pages
        this.protectRestrictedPages();
        
        return isLoggedIn;
    }
    
    /**
     * Update UI for logged-in users
     */
    updateUIForLoggedInUser() {
        console.log('Updating UI for logged-in user');
        
        // Show user-only elements
        document.querySelectorAll('.user-only').forEach(el => {
            el.classList.remove('hidden');
        });
        
        // Hide guest-only elements
        document.querySelectorAll('.guest-only').forEach(el => {
            el.classList.add('hidden');
        });
        
        // Update user info if available
        this.getUserInfo();
    }
    
    /**
     * Update UI for guests (not logged in)
     */
    updateUIForGuest() {
        console.log('Updating UI for guest user');
        
        // Hide user-only elements
        document.querySelectorAll('.user-only').forEach(el => {
            el.classList.add('hidden');
        });
        
        // Show guest-only elements
        document.querySelectorAll('.guest-only').forEach(el => {
            el.classList.remove('hidden');
        });
    }
    
    /**
     * Get user info to display username, etc.
     */
    getUserInfo() {
        const token = localStorage.getItem('token');
        
        if (!token) return;
        
        // Try to get user info from API
        if (this.api) {
            this.api.getUserProfile()
                .then(user => {
                    console.log('User profile loaded:', user);
                    this.updateUserDisplay(user);
                })
                .catch(error => {
                    console.error('Failed to load user profile:', error);
                    // If we can't get the user info, try to extract basics from the token
                    this.tryExtractUserFromToken(token);
                });
        } else {
            // If API is not available, try to extract basics from the token
            this.tryExtractUserFromToken(token);
        }
    }
    
    /**
     * Extract basic user info from JWT token
     * @param {string} token - JWT token
     */
    tryExtractUserFromToken(token) {
        try {
            // JWT tokens are base64-encoded JSON with format: header.payload.signature
            const parts = token.split('.');
            if (parts.length !== 3) throw new Error('Invalid token format');
            
            // The payload is the second part, decode it from base64
            const payload = JSON.parse(atob(parts[1]));
            
            // Extract user info from payload
            const username = payload.username || payload.name || payload.email || 'User';
            console.log('Extracted username from token:', username);
            
            // Use this basic info to update the UI
            this.updateUserDisplay({ username });
        } catch (error) {
            console.error('Failed to extract user info from token:', error);
            // Use a generic username as fallback
            this.updateUserDisplay({ username: 'User' });
        }
    }
    
    /**
     * Update the UI with user information
     * @param {Object} user - User data
     */
    updateUserDisplay(user) {
        const usernameDisplay = document.getElementById('username-display');
        const userInitials = document.getElementById('user-initials');
        
        if (usernameDisplay && user.username) {
            usernameDisplay.textContent = user.username;
        }
        
        if (userInitials && user.username) {
            // Get first letter of first and last name
            const nameParts = user.username.split(' ');
            if (nameParts.length > 1) {
                userInitials.textContent = (nameParts[0][0] + nameParts[nameParts.length-1][0]).toUpperCase();
            } else {
                userInitials.textContent = user.username[0].toUpperCase();
            }
        }
    }
    
    /**
     * Set up the logout functionality
     */
    setupLogout() {
        const logoutBtn = document.getElementById('logout-btn');
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Logout button clicked');
                
                // Clear token
                localStorage.removeItem('token');
                
                // Clear API service token if available
                if (this.api) {
                    this.api.clearToken();
                }
                
                // Reload the page to update UI
                window.location.reload();
            });
        }
    }
    
    /**
     * Protect restricted pages
     */
    protectRestrictedPages() {
        const restrictedPages = [
            'my-quizzes.html',
            'create-quiz.html',
            'profile.html',
            'edit-quiz.html'
        ];
        
        const currentPage = window.location.pathname.split('/').pop();
        
        if (restrictedPages.includes(currentPage) && !localStorage.getItem('token')) {
            console.log('Restricted page accessed without login, redirecting to login page');
            window.location.href = `login.html?redirect=${encodeURIComponent(window.location.href)}`;
        }
    }
}

// Initialize Auth State Handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Auth State Handler');
    window.authState = new AuthStateHandler();
});