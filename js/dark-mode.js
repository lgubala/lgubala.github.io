/**
 * Enhanced Dark Mode Manager
 * Improved dark mode functionality with smooth transitions
 */

class EnhancedDarkModeManager {
    constructor() {
        console.log('Enhanced Dark Mode Manager initializing...');
        this.darkModeKey = 'quizgen-dark-mode';
        this.darkModeClass = 'dark';
        this.transitionClass = 'dark-mode-transition';
        
        // Add transition class to body
        document.body.classList.add(this.transitionClass);
        
        // Initialize DOM references
        this.initDomReferences();
        
        // Initialize dark mode based on saved preference or system preference
        this.init();
    }
    
    /**
     * Initialize DOM references
     */
    initDomReferences() {
        console.log('Initializing dark mode DOM references');
        
        // Find dark mode toggle buttons on the page
        this.darkModeToggles = document.querySelectorAll('.dark-mode-toggle, [id="dark-mode-toggle"]');
        this.darkModeIcons = document.querySelectorAll('.dark-mode-icon, [id="dark-mode-icon"]');
        
        console.log(`Found ${this.darkModeToggles.length} dark mode toggle buttons`);
    }
    
    /**
     * Initialize dark mode
     */
    init() {
        console.log('Initializing dark mode');
        
        // Check localStorage for saved preference
        const darkModeEnabled = this.loadDarkModePreference();
        
        // Apply initial dark mode state
        if (darkModeEnabled) {
            this.enableDarkMode(false); // Don't save again since we're loading
        } else {
            this.disableDarkMode(false); // Don't save again since we're loading
        }
        
        // Set up event listeners
        this.attachEventListeners();
        
        console.log('Dark mode initialized with state:', darkModeEnabled ? 'dark' : 'light');
        
        // Listen for system preference changes
        this.setupSystemPreferenceListener();
    }
    
    /**
     * Load dark mode preference from localStorage
     * @returns {boolean} - Whether dark mode should be enabled
     */
    loadDarkModePreference() {
        const savedPreference = localStorage.getItem(this.darkModeKey);
        
        // If we have a saved preference, use it
        if (savedPreference !== null) {
            return savedPreference === 'true';
        }
        
        // Otherwise, check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true;
        }
        
        // Default to light mode
        return false;
    }
    
    /**
     * Save dark mode preference to localStorage
     * @param {boolean} isDarkMode - Whether dark mode is enabled
     */
    saveDarkModePreference(isDarkMode) {
        localStorage.setItem(this.darkModeKey, isDarkMode.toString());
        console.log(`Dark mode preference saved: ${isDarkMode}`);
    }
    
    /**
     * Attach event listeners to toggle buttons
     */
    attachEventListeners() {
        // Attach event listener to all dark mode toggle buttons
        this.darkModeToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                this.toggleDarkMode();
            });
            
            // Add appropriate ARIA labels
            toggle.setAttribute('aria-label', 'Toggle dark mode');
            toggle.setAttribute('aria-pressed', this.isDarkModeEnabled().toString());
        });
        
        // Update UI initially
        this.updateToggleUI(this.isDarkModeEnabled());
    }
    
    /**
     * Set up listener for system preference changes
     */
    setupSystemPreferenceListener() {
        if (window.matchMedia) {
            const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Use newer event listener pattern if supported
            try {
                darkModeMediaQuery.addEventListener('change', (e) => {
                    this.handleSystemPreferenceChange(e);
                });
            } catch (error) {
                // Fallback for older browsers
                darkModeMediaQuery.addListener((e) => {
                    this.handleSystemPreferenceChange(e);
                });
            }
        }
    }
    
    /**
     * Handle system preference change
     * @param {MediaQueryListEvent} event - Media query change event
     */
    handleSystemPreferenceChange(event) {
        // Only apply system preference if user hasn't saved a preference
        if (localStorage.getItem(this.darkModeKey) === null) {
            if (event.matches) {
                this.enableDarkMode();
            } else {
                this.disableDarkMode();
            }
        }
    }
    
    /**
     * Toggle dark mode
     */
    toggleDarkMode() {
        console.log('Toggling dark mode');
        if (document.documentElement.classList.contains(this.darkModeClass)) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }
    
    /**
     * Enable dark mode
     * @param {boolean} save - Whether to save preference to localStorage
     */
    enableDarkMode(save = true) {
        console.log('Enabling dark mode');
        document.documentElement.classList.add(this.darkModeClass);
        
        // Update toggle buttons UI
        this.updateToggleUI(true);
        
        // Update ARIA state
        this.darkModeToggles.forEach(toggle => {
            toggle.setAttribute('aria-pressed', 'true');
        });
        
        // Save preference if requested
        if (save) {
            this.saveDarkModePreference(true);
        }
        
        // Dispatch event for other components to react
        document.dispatchEvent(new CustomEvent('darkmode', { detail: { enabled: true } }));
    }
    
    /**
     * Disable dark mode
     * @param {boolean} save - Whether to save preference to localStorage
     */
    disableDarkMode(save = true) {
        console.log('Disabling dark mode');
        document.documentElement.classList.remove(this.darkModeClass);
        
        // Update toggle buttons UI
        this.updateToggleUI(false);
        
        // Update ARIA state
        this.darkModeToggles.forEach(toggle => {
            toggle.setAttribute('aria-pressed', 'false');
        });
        
        // Save preference if requested
        if (save) {
            this.saveDarkModePreference(false);
        }
        
        // Dispatch event for other components to react
        document.dispatchEvent(new CustomEvent('darkmode', { detail: { enabled: false } }));
    }
    
    /**
     * Update the toggle buttons UI
     * @param {boolean} isDarkMode - Whether dark mode is enabled
     */
    updateToggleUI(isDarkMode) {
        this.darkModeIcons.forEach(icon => {
            if (isDarkMode) {
                // Change to sun icon for switching to light mode
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                // Change to moon icon for switching to dark mode
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
        
        this.darkModeToggles.forEach(toggle => {
            if (isDarkMode) {
                toggle.setAttribute('title', 'Switch to Light Mode');
            } else {
                toggle.setAttribute('title', 'Switch to Dark Mode');
            }
        });
    }
    
    /**
     * Check if dark mode is currently enabled
     * @returns {boolean} - Whether dark mode is currently enabled
     */
    isDarkModeEnabled() {
        return document.documentElement.classList.contains(this.darkModeClass);
    }
}

// Initialize enhanced dark mode manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Enhanced Dark Mode Manager');
    window.darkMode = new EnhancedDarkModeManager();
    console.log('Enhanced Dark Mode Manager initialized and attached to window.darkMode');
});