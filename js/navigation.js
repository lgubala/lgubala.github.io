/**
 * Navigation Module
 * Handles navigation and user dropdown functionality
 */
class NavigationManager {
    constructor() {
        console.log('Navigation Manager initializing...');
        this.api = window.api;
        this.auth = window.auth;
        
        // Initialize DOM element references
        this.initDomReferences();
        
        // Set up event listeners
        this.attachEventListeners();
        
        // Update active navigation item
        this.updateActiveNavItem();
        
        console.log('Navigation Manager initialized');
    }
    
    /**
     * Initialize DOM element references
     */
    initDomReferences() {
        console.log('Initializing navigation DOM references');
        
        // User dropdown elements
        this.userDropdown = document.getElementById('userDropdown');
        this.usernameDisplay = document.getElementById('username-display');
        this.userMenuButton = document.getElementById('user-menu-button');
        this.userMenuDropdown = document.getElementById('user-menu-dropdown');
        this.logoutBtn = document.getElementById('logout-btn');
        
        // Navigation items
        this.navItems = document.querySelectorAll('nav a');
        
        console.log('Navigation DOM references initialized', {
            'User Dropdown': !!this.userDropdown,
            'Username Display': !!this.usernameDisplay,
            'User Menu Button': !!this.userMenuButton,
            'User Menu Dropdown': !!this.userMenuDropdown,
            'Logout Button': !!this.logoutBtn,
            'Nav Items Count': this.navItems?.length || 0
        });
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        console.log('Attaching navigation event listeners');
        
        // User menu toggle
        if (this.userMenuButton && this.userMenuDropdown) {
            console.log('Adding user menu button click handler');
            this.userMenuButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('User menu button clicked');
                this.toggleUserMenu();
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.userMenuDropdown &&
                    !this.userMenuButton.contains(e.target) && 
                    !this.userMenuDropdown.contains(e.target)) {
                    this.userMenuDropdown.classList.add('hidden');
                }
            });
        } else {
            console.warn('User menu button or dropdown not found', {
                'button': !!this.userMenuButton,
                'dropdown': !!this.userMenuDropdown
            });
        }
        
        // Logout button
        if (this.logoutBtn) {
            console.log('Adding logout button click handler');
            this.logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Logout button clicked');
                
                if (this.auth) {
                    this.auth.logout();
                } else if (this.api) {
                    this.api.clearToken();
                    window.location.href = '/';
                } else {
                    console.error('Neither auth nor API service available for logout');
                    // Fallback
                    localStorage.removeItem('token');
                    window.location.href = '/';
                }
            });
        }
    }
    
    /**
     * Toggle user dropdown menu
     */
    toggleUserMenu() {
        console.log('Navigation toggleUserMenu called');
        
        if (this.userMenuDropdown) {
            const isCurrentlyHidden = this.userMenuDropdown.classList.contains('hidden');
            console.log('  Current dropdown state:', isCurrentlyHidden ? 'hidden' : 'visible');
            
            // Toggle visibility
            if (isCurrentlyHidden) {
                console.log('  Showing dropdown');
                this.userMenuDropdown.classList.remove('hidden');
                console.log('  Dropdown should now be visible');
            } else {
                console.log('  Hiding dropdown');
                this.userMenuDropdown.classList.add('hidden');
                console.log('  Dropdown should now be hidden');
            }
            
            // Check if it worked
            console.log('  Final dropdown state:', 
                this.userMenuDropdown.classList.contains('hidden') ? 'hidden' : 'visible');
        } else {
            console.error('User menu dropdown element not found');
        }
    }
    
    /**
     * Update active navigation item based on current URL
     */
    updateActiveNavItem() {
        if (!this.navItems || this.navItems.length === 0) {
            console.log('No navigation items found to update');
            return;
        }
        
        const currentPath = window.location.pathname;
        console.log(`Updating active nav item for path: ${currentPath}`);
        
        let activeItemFound = false;
        
        this.navItems.forEach(item => {
            const href = item.getAttribute('href');
            
            // Skip items without href
            if (!href) return;
            
            // Remove all active classes first
            item.classList.remove(
                'border-indigo-500', 
                'text-gray-900', 
                'border-transparent', 
                'text-gray-500', 
                'hover:border-gray-300', 
                'hover:text-gray-700'
            );
            
            // Check if this item matches current path
            const isActive = currentPath.endsWith(href) || 
                            (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('/')));
            
            if (isActive) {
                console.log(`Active nav item found: ${href}`);
                item.classList.add('border-indigo-500', 'text-gray-900');
                activeItemFound = true;
            } else {
                item.classList.add(
                    'border-transparent', 
                    'text-gray-500', 
                    'hover:border-gray-300', 
                    'hover:text-gray-700'
                );
            }
        });
        
        console.log(`Active navigation item ${activeItemFound ? 'found and updated' : 'not found'}`);
    }
    
    /**
     * Update username display in the navigation
     */
    updateUsernameDisplay(username) {
        console.log(`Updating username display to: ${username}`);
        if (this.usernameDisplay && username) {
            this.usernameDisplay.textContent = username;
        } else if (this.usernameDisplay) {
            // Get username from auth service if available
            if (this.auth && this.auth.getUser()) {
                const user = this.auth.getUser();
                this.usernameDisplay.textContent = user.username;
            } else {
                this.usernameDisplay.textContent = 'User';
            }
        }
    }
}

// Initialize navigation manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Navigation Manager');
    
    // Create and attach to window
    window.navigation = new NavigationManager();
    
    // Ensure proper initialization order
    // If auth service is already loaded, update username display
    if (window.auth && window.auth.getUser()) {
        const user = window.auth.getUser();
        if (user && window.navigation) {
            window.navigation.updateUsernameDisplay(user.username);
        }
    }
});