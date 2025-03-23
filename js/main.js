/**
 * Main App
 * Handles initialization and main functionality with improved logging and error handling
 */
class App {
    constructor() {
        console.log('App initializing...');
        this.api = window.api;
        this.auth = window.auth;
        
        // Safely initialize DOM element references
        this.initDomReferences();
        
        // Initialize the app
        this.init();
    }
    
    /**
     * Safely initialize DOM element references
     */
    initDomReferences() {
        console.log('Initializing App DOM references');
        
        // Home page elements
        this.categoriesContainer = document.getElementById('categories-container');
        this.createQuizBtn = document.getElementById('createQuizBtn');
        
        // Modal elements
        this.createQuizModal = document.getElementById('createQuizModal');
        this.cancelQuizBtn = document.getElementById('cancelQuizBtn');
        this.generateQuizBtn = document.getElementById('generateQuizBtn');
        
        console.log('App DOM references initialized', {
            'Categories Container': !!this.categoriesContainer,
            'Featured Quizzes Container': !!this.featuredQuizzesContainer,
            'Create Quiz Button': !!this.createQuizBtn
        });
    }
    
    /**
     * Initialize the application
     */
    async init() {
        console.log('App init');
        this.attachEventListeners();
        

        // Only load home page data if we're on the home page
        if (this.categoriesContainer) {
            console.log('Loading home page data');
            await this.loadHomePageData();
        } else {
            console.log('Not on home page, skipping home data load');
        }
        
        // Check if we need to handle specific page initializations
        this.handlePageSpecificInit();
    }
    
    /**
     * Handle page-specific initializations based on URL
     */
    handlePageSpecificInit() {
        const path = window.location.pathname;
        console.log(`Current page path: ${path}`);
        
        if (path.includes('my-quizzes.html')) {
            console.log('On my-quizzes page, checking authentication');
            this.checkAuthForProtectedPage();
        } else if (path.includes('create-quiz.html')) {
            console.log('On create-quiz page, checking authentication');
            this.checkAuthForProtectedPage();
        }
    }
    
    /**
     * Check authentication for protected pages
     */
    checkAuthForProtectedPage() {
        console.log('Checking auth for protected page');
        if (this.auth && !this.auth.isAuthenticated()) {
            console.log('User not authenticated, redirecting to login');
            const currentUrl = encodeURIComponent(window.location.href);
            window.location.href = `/login.html?redirect=${currentUrl}`;
        } else {
            console.log('User is authenticated, can access protected page');
        }
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        console.log('Attaching App event listeners');
        
        // Home page create quiz button
        if (this.createQuizBtn) {
            console.log('Adding create quiz button handler');
            this.createQuizBtn.addEventListener('click', () => {
                console.log('Create quiz button clicked');
                this.handleCreateQuiz();
            });
        }
        
        // Create quiz modal cancel button
        if (this.cancelQuizBtn) {
            console.log('Adding cancel quiz button handler');
            this.cancelQuizBtn.addEventListener('click', () => {
                console.log('Cancel quiz button clicked');
                this.hideCreateQuizModal();
            });
        }
        
        // Create quiz modal generate button
        if (this.generateQuizBtn) {
            console.log('Adding generate quiz button handler');
            this.generateQuizBtn.addEventListener('click', () => {
                console.log('Generate quiz button clicked');
                // This would normally submit the form, but we'll just close the modal for now
                this.hideCreateQuizModal();
                window.location.href = '/create-quiz.html';
            });
        }
    }
    
    /**
     * Show create quiz modal
     */
    showCreateQuizModal() {
        console.log('Showing create quiz modal');
        if (this.createQuizModal) {
            this.createQuizModal.classList.remove('hidden');
        } else {
            console.error('Create quiz modal not found');
        }
    }
    
    /**
     * Hide create quiz modal
     */
    hideCreateQuizModal() {
        console.log('Hiding create quiz modal');
        if (this.createQuizModal) {
            this.createQuizModal.classList.add('hidden');
        }
    }
    

    /**
     * Load home page data
     */
    async loadHomePageData() {
        console.log('Loading home page data...');
        try {
            // Only proceed if we're on the home page and have categories container
            if (!this.categoriesContainer) {
                console.log('Not on home page or no categories container, skipping data load');
                return;
            }
            
            // Load categories directly - no need for parallel promises anymore
            console.log('Loading categories...');
            try {
                const categories = await this.api.getCategories();
                console.log(`Rendering ${categories.length} categories`);
                this.renderCategories(categories);
            } catch (err) {
                console.error('Failed to load categories:', err);
                this.showError('Failed to load categories');
            }
            
            console.log('Home page data loaded successfully');
        } catch (error) {
            console.error('Error loading home page data:', error);
            this.showError('Failed to load content. Please try again later.');
        }
    }
    
    /**
     * Render categories
     * @param {Array} categories - Categories data
     */
    renderCategories(categories) {
        console.log(`Rendering ${categories.length} categories`);
        if (!this.categoriesContainer) {
            console.error('Categories container not found');
            return;
        }
        
        if (!categories || categories.length === 0) {
            console.log('No categories to render');
            this.categoriesContainer.innerHTML = `
                <div class="text-center py-6">
                    <p class="text-gray-500">No categories found.</p>
                </div>
            `;
            return;
        }
        
        // Get up to 6 categories to display
        const displayCategories = categories.slice(0, 6);
        console.log(`Displaying ${displayCategories.length} categories`);
        
        let html = '<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">';
        
        displayCategories.forEach(category => {
            // Default icon if none provided
            const iconClass = category.icon_name || 'fas fa-folder';
            
            html += `
                <div class="pt-6">
                    <div class="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                        <div class="-mt-6">
                            <div>
                                <span class="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                                    <i class="${iconClass} text-white text-2xl"></i>
                                </span>
                            </div>
                            <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">${category.name}</h3>
                            <p class="mt-5 text-base text-gray-500">
                                ${category.description || `Explore ${category.name} quizzes`}
                            </p>
                            <div class="mt-5">
                                <a href="/browse.html?category=${category.category_id}" class="text-base font-medium text-indigo-600 hover:text-indigo-500">
                                    Explore ${category.name} quizzes →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        this.categoriesContainer.innerHTML = html;
        console.log('Categories rendered successfully');
    }
    
    
    /**
     * Handle create quiz button click
     */
    handleCreateQuiz() {
        console.log('Handling create quiz button click');
        // Check if user is authenticated
        if (window.auth && !window.auth.isAuthenticated()) {
            console.log('User not authenticated, showing login prompt');
            // Store redirect URL
            const redirectUrl = '/create-quiz.html';
            
            // Show login modal or redirect to login page
            if (window.auth.showLoginModal) {
                console.log('Showing login modal');
                window.auth.showLoginModal();
            } else {
                // Fallback - redirect to login page
                console.log(`Redirecting to login page with redirect=${redirectUrl}`);
                window.location.href = `/login.html?redirect=${encodeURIComponent(redirectUrl)}`;
            }
            return;
        }
        
        // If modal exists, show it
        if (this.createQuizModal) {
            console.log('Showing create quiz modal');
            this.showCreateQuizModal();
        } else {
            // Otherwise, redirect to create quiz page
            console.log('Redirecting to create quiz page');
            window.location.href = '/create-quiz.html';
        }
    }
    
    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        console.error('App error:', message);
        
        // Check if there's an error modal on the page
        const errorModal = document.getElementById('errorModal');
        const errorMessage = document.getElementById('error-message');
        
        if (errorModal && errorMessage) {
            errorMessage.textContent = message;
            errorModal.classList.remove('hidden');
            
            // Add close handler if not already added
            const closeBtn = document.getElementById('closeErrorBtn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    errorModal.classList.add('hidden');
                });
            }
        } else {
            // Fallback to alert
            alert(message);
        }
    }
}

// Ensure API and Auth services are loaded before initializing the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking for API and Auth services before initializing App');
    
    // Check if API service is available
    if (!window.api) {
        console.error('API service not found! Make sure api.js is loaded before main.js');
        alert('Error: API service not initialized. Please refresh the page.');
        return;
    }
    
    // Check if Auth service is available
    if (!window.auth) {
        console.warn('Auth service not found! Some features may not work correctly.');
    }
    
    // Initialize app
    console.log('Initializing App...');
    window.app = new App();
    console.log('App initialized and attached to window.app');
});