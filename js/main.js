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
        this.featuredQuizzesContainer = document.getElementById('featured-quizzes');
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
        
        // Load featured quizzes if on homepage
        if (document.getElementById('featured-quizzes-container')) {
                await this.loadFeaturedQuizzes();
        }

        // Only load home page data if we're on the home page
        if (this.categoriesContainer || this.featuredQuizzesContainer) {
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
     * Load featured quizzes on homepage
     */
    async loadFeaturedQuizzes() {
        const featuredQuizzesContainer = document.getElementById('featured-quizzes-container');
        if (!featuredQuizzesContainer) return; // Not on homepage
        
        try {
            const response = await window.api.getFeaturedQuizzes();
            const quizzes = response.quizzes || [];
            console.log(`Loaded ${quizzes.length} featured quizzes`);
            
            if (quizzes.length === 0) {
                featuredQuizzesContainer.innerHTML = '<p class="text-center col-span-3">No featured quizzes available.</p>';
                return;
            }
            
            let html = '';
            quizzes.forEach(quiz => {
                const categoryName = quiz.category_name || 'Uncategorized';
                const rating = parseFloat(quiz.average_rating) || 0;
                const formattedRating = rating.toFixed(1);
                
                // Generate star rating HTML
                let starsHtml = '';
                for (let i = 1; i <= 5; i++) {
                    if (i <= Math.floor(rating)) {
                        starsHtml += '<i class="fas fa-star text-yellow-400"></i>';
                    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
                        starsHtml += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
                    } else {
                        starsHtml += '<i class="far fa-star text-yellow-400"></i>';
                    }
                }
                
                // Truncate description to ensure uniform card height
                const description = quiz.description || 'Test your knowledge with this quiz.';
                const truncatedDescription = description.length > 120 ? 
                    description.substring(0, 120) + '...' : 
                    description;
                
                html += `
                    <div class="bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-300 quiz-card">
                        <div class="p-6">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                ${categoryName}
                            </span>
                            <h3 class="mt-3 text-lg font-medium text-gray-900">${quiz.title}</h3>
                            <p class="mt-2 text-sm text-gray-500 h-10 overflow-hidden">
                                ${truncatedDescription}
                            </p>
                            <div class="mt-4 flex items-center">
                                <div class="flex-shrink-0">
                                    <span class="text-sm font-medium text-gray-600">${quiz.questions_count || 0} questions</span>
                                </div>
                                <div class="ml-3 flex-1 flex justify-between items-center">
                                    <div class="text-sm flex items-center">
                                        ${starsHtml}
                                        <span class="ml-1 text-gray-500">(${formattedRating})</span>
                                    </div>
                                    <div>
                                        <a href="quiz.html?id=${quiz.quiz_id}" class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                                            Start
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            featuredQuizzesContainer.innerHTML = html;
        } catch (error) {
            console.error('Error loading featured quizzes:', error);
            featuredQuizzesContainer.innerHTML = '<p class="text-center col-span-3 text-red-500">Failed to load featured quizzes.</p>';
        }
    }

    /**
     * Load home page data
     */
    async loadHomePageData() {
        console.log('Loading home page data...');
        try {
            // Only proceed if we're on the home page
            if (!this.categoriesContainer && !this.featuredQuizzesContainer) {
                console.log('Not on home page, skipping data load');
                return;
            }
            
            // Load categories and featured quizzes in parallel
            const promises = [];
            let categories, featuredQuizzes;
            
            if (this.categoriesContainer) {
                console.log('Loading categories...');
                promises.push(
                    this.api.getCategories()
                        .then(data => { categories = data; })
                        .catch(err => {
                            console.error('Failed to load categories:', err);
                            this.showError('Failed to load categories');
                        })
                );
            }
            
            if (this.featuredQuizzesContainer) {
                console.log('Loading featured quizzes...');
                promises.push(
                    this.api.getFeaturedQuizzes()
                        .then(data => { featuredQuizzes = data; })
                        .catch(err => {
                            console.error('Failed to load featured quizzes:', err);
                            this.showError('Failed to load featured quizzes');
                        })
                );
            }
            
            await Promise.all(promises);
            
            // Render the data if available
            if (categories && this.categoriesContainer) {
                console.log(`Rendering ${categories.length} categories`);
                this.renderCategories(categories);
            }
            
            if (featuredQuizzes && this.featuredQuizzesContainer) {
                console.log(`Rendering ${featuredQuizzes.quizzes?.length || 0} featured quizzes`);
                this.renderFeaturedQuizzes(featuredQuizzes.quizzes || []);
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
     * Render featured quizzes
     * @param {Array} quizzes - Quizzes data
     */
    renderFeaturedQuizzes(quizzes) {
        console.log(`Rendering ${quizzes.length} featured quizzes`);
        if (!this.featuredQuizzesContainer) {
            console.error('Featured quizzes container not found');
            return;
        }
        
        if (!quizzes || quizzes.length === 0) {
            console.log('No featured quizzes to render');
            this.featuredQuizzesContainer.innerHTML = `
                <div class="text-center py-6">
                    <p class="text-gray-500">No quizzes found.</p>
                </div>
            `;
            return;
        }
        
        // Clear the container first
        this.featuredQuizzesContainer.innerHTML = '';
        
        quizzes.forEach(quiz => {
            const categoryName = quiz.category_name || 'Miscellaneous';
            const rating = parseFloat(quiz.average_rating) || 0;
            const formattedRating = rating.toFixed(1);
            
            // Generate star rating HTML
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= Math.floor(rating)) {
                    starsHtml += '<i class="fas fa-star"></i>';
                } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
                    starsHtml += '<i class="fas fa-star-half-alt"></i>';
                } else {
                    starsHtml += '<i class="far fa-star"></i>';
                }
            }
            
            // Create quiz card element
            const quizCard = document.createElement('div');
            quizCard.className = 'bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-300 quiz-card cursor-pointer';
            quizCard.setAttribute('data-quiz-id', quiz.quiz_id);
            quizCard.innerHTML = `
                <div class="p-6">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        ${categoryName}
                    </span>
                    <h3 class="mt-3 text-lg font-medium text-gray-900">${quiz.title}</h3>
                    <p class="mt-2 text-sm text-gray-500 line-clamp-3">
                        ${quiz.description || 'Test your knowledge with this quiz.'}
                    </p>
                    <div class="mt-4 flex items-center">
                        <div class="flex-shrink-0">
                            <span class="text-sm font-medium text-gray-600">${quiz.questions_count || '?'} questions</span>
                        </div>
                        <div class="ml-3 flex-1 flex justify-between">
                            <div class="text-sm">
                                <span class="text-yellow-400">${starsHtml}</span>
                                <span class="ml-1 text-gray-500">(${formattedRating})</span>
                            </div>
                            <div>
                                <a href="/quiz.html?id=${quiz.quiz_id}" class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 start-quiz-btn">
                                    Start
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Add click event listener to navigate to quiz overview
            quizCard.addEventListener('click', (e) => {
                // Prevent navigation if user clicked on Start button
                if (e.target.closest('.start-quiz-btn')) {
                    return;
                }
                
                // Navigate to quiz overview page
                window.location.href = `/quiz-overview.html?id=${quiz.quiz_id}`;
            });
            
            this.featuredQuizzesContainer.appendChild(quizCard);
        });
        
        console.log('Featured quizzes rendered successfully');
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