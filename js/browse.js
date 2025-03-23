/**
 * Browse Page Manager
 * Handles quiz browsing functionality including search, filters, and pagination
 */
class BrowsePageManager {
    constructor() {
        console.log('Browse Page Manager initializing...');
        this.api = window.api;
        
        // State variables
        this.currentPage = 1;
        this.totalPages = 1;
        this.pageSize = 9; // Number of quizzes per page
        this.quizzes = [];
        this.categories = [];
        this.subcategories = [];
        this.currentFilters = {
            category: '',
            subcategory: '',
            difficulty: '',
            query: '',
            sort: 'recent'
        };
        
        // Initialize DOM references
        this.initDomReferences();
        
        // Initialize the page
        this.init();
    }
    
    /**
     * Initialize DOM references
     */
    initDomReferences() {
        // Sections
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.noResultsMessage = document.getElementById('no-results-message');
        this.quizzesContainer = document.getElementById('quizzes-container');
        this.pagination = document.getElementById('pagination');
        this.selectedCategorySection = document.getElementById('selected-category-section');
        
        // Category section elements
        this.selectedCategoryName = document.getElementById('selected-category-name');
        this.selectedCategoryDescription = document.getElementById('selected-category-description');
        this.selectedCategoryCount = document.getElementById('selected-category-count');
        this.categoryIcon = document.getElementById('category-icon');
        
        // Filters and search
        this.categoryFilter = document.getElementById('category-filter');
        this.subcategoryFilter = document.getElementById('subcategory-filter'); // Add this line
        this.difficultyFilter = document.getElementById('difficulty-filter');
        this.sortBy = document.getElementById('sort-by');
        this.searchInput = document.getElementById('search-input');
        this.searchBtn = document.getElementById('search-btn');
        this.applyFiltersBtn = document.getElementById('apply-filters-btn');
        this.clearFiltersBtn = document.getElementById('clear-filters-btn');
        
        // Pagination controls
        this.prevPageBtn = document.getElementById('prev-page-btn');
        this.nextPageBtn = document.getElementById('next-page-btn');
        this.pageIndicator = document.getElementById('page-indicator');
    }
    
    /**
     * Initialize the page
     */
    async init() {
        console.log('Browse page initializing...');
        
        // Set up event listeners
        this.attachEventListeners();
        
        // Check URL parameters for category filter
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        
        if (categoryParam) {
            console.log(`URL parameter category=${categoryParam} detected, setting filter`);
            this.currentFilters.category = categoryParam;
            
            // Wait for categories to load first
            await this.loadCategories();
            
            // Set the select element to match
            if (this.categoryFilter) {
                this.categoryFilter.value = categoryParam;
                // Load subcategories for this category
                await this.handleCategoryChange();
            }
        } else {
            // Normal initialization - load categories first
            await this.loadCategories();
        }
        
        // Load initial quizzes
        await this.loadQuizzes();
        
        console.log('Browse page initialized');
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => this.handleSearch());
        }
        
        if (this.searchInput) {
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });
        }
        
        if (this.applyFiltersBtn) {
            this.applyFiltersBtn.addEventListener('click', () => this.applyFilters());
        }
        
        if (this.clearFiltersBtn) {
            this.clearFiltersBtn.addEventListener('click', () => this.clearFilters());
        }
        
        if (this.prevPageBtn) {
            this.prevPageBtn.addEventListener('click', () => this.goToPreviousPage());
        }
        
        if (this.nextPageBtn) {
            this.nextPageBtn.addEventListener('click', () => this.goToNextPage());
        }
        
        // Add event listener for category filter change
        if (this.categoryFilter) {
            this.categoryFilter.addEventListener('change', () => this.handleCategoryChange());
        }
    }
    
    /**
     * Load categories for filter
     */
    async loadCategories() {
        try {
            console.log('Loading categories');
            this.categories = await this.api.getCategories();
            console.log(`Loaded ${this.categories.length} categories`);
            
            if (!this.categoryFilter) {
                console.warn('Category filter element not found');
                return;
            }
            
            // Clear existing options except for the default
            while (this.categoryFilter.options.length > 1) {
                this.categoryFilter.remove(1);
            }
            
            // Add categories to select element
            this.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.category_id;
                option.textContent = category.name;
                this.categoryFilter.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }


    /**
     * Handle category selection change
     */
    async handleCategoryChange() {
        const categoryId = this.categoryFilter.value;
        
        // Reset subcategory filter value
        if (this.subcategoryFilter) {
            this.currentFilters.subcategory = '';
        }
        
        // Manage subcategory dropdown state
        if (this.subcategoryFilter) {
            if (!categoryId) {
                // If no category is selected, disable subcategory dropdown
                this.subcategoryFilter.disabled = true;
                this.subcategoryFilter.classList.add('cursor-not-allowed', 'opacity-60');
                
                // Reset options
                this.subcategoryFilter.innerHTML = '<option value="">Select Category First</option>';
                this.subcategories = [];
            } else {
                // Show loading state
                this.subcategoryFilter.disabled = true;
                this.subcategoryFilter.innerHTML = '<option value="">Loading subcategories...</option>';
                
                try {
                    // Fetch subcategories for selected category
                    this.subcategories = await this.api.getSubcategories(categoryId);
                    console.log(`Loaded ${this.subcategories.length} subcategories for category ${categoryId}`);
                    
                    // Reset dropdown
                    this.subcategoryFilter.innerHTML = '<option value="">All Subcategories</option>';
                    
                    // Add subcategories to dropdown
                    this.subcategories.forEach(subcategory => {
                        const option = document.createElement('option');
                        option.value = subcategory.subcategory_id;
                        option.textContent = subcategory.name;
                        this.subcategoryFilter.appendChild(option);
                    });
                    
                    // Enable dropdown
                    this.subcategoryFilter.disabled = false;
                    this.subcategoryFilter.classList.remove('cursor-not-allowed', 'opacity-60');
                } catch (error) {
                    console.error('Error loading subcategories:', error);
                    this.subcategoryFilter.innerHTML = '<option value="">Failed to load subcategories</option>';
                }
            }
        }
    }
    
    /**
     * Load quizzes based on current filters and pagination
     */
    async loadQuizzes() {
        // Show loading indicator
        this.showLoading();
        
        try {
            console.log('Loading quizzes with filters:', this.currentFilters);
            
            let response;
            const offset = (this.currentPage - 1) * this.pageSize;
            
            if (this.currentFilters.category) {
                // Get quizzes by category with optional subcategory filter
                const endpoint = '/quizzes/category/' + this.currentFilters.category;
                const params = new URLSearchParams({
                    limit: this.pageSize,
                    offset: offset
                });
                
                // Add subcategory filter if present
                if (this.currentFilters.subcategory) {
                    params.append('subcategory', this.currentFilters.subcategory);
                }
                
                // Add difficulty filter if present
                if (this.currentFilters.difficulty) {
                    params.append('difficulty', this.currentFilters.difficulty);
                }
                
                // Add sort parameter if present
                if (this.currentFilters.sort) {
                    params.append('sort', this.currentFilters.sort);
                }
                
                response = await this.api.get(`${endpoint}?${params}`);
                
                // Show category info
                this.updateCategoryInfo(response);
            } else if (this.currentFilters.query) {
                // Search quizzes
                this.hideElement(this.selectedCategorySection);
                response = await this.api.searchQuizzes(
                    this.currentFilters.query,
                    this.currentFilters.category || null,
                    this.pageSize,
                    offset,
                    this.currentFilters.subcategory || null
                );
            } else {
                // Get all quizzes with filters
                this.hideElement(this.selectedCategorySection);
                let endpoint = '/quizzes';
                let params = new URLSearchParams({
                    limit: this.pageSize,
                    offset: offset
                });
                
                if (this.currentFilters.difficulty) {
                    params.append('difficulty', this.currentFilters.difficulty);
                }
                
                if (this.currentFilters.sort) {
                    params.append('sort', this.currentFilters.sort);
                }

                if (this.currentFilters.subcategory) {
                    params.append('subcategory', this.currentFilters.subcategory);
                }
                
                response = await this.api.get(`${endpoint}?${params}`);
            }
            
            console.log(`Loaded ${response.quizzes?.length || 0} quizzes`);
            this.quizzes = response.quizzes || [];
            this.totalPages = Math.ceil((response.pagination?.total || 0) / this.pageSize);
            
            // Hide loading indicator
            this.hideElement(this.loadingIndicator);
            
            if (this.quizzes.length === 0) {
                // Show no results message
                this.showElement(this.noResultsMessage);
            } else {
                // Render quizzes
                this.renderQuizzes();
                
                // Show pagination if needed
                if (this.totalPages > 1) {
                    this.updatePagination();
                    this.showElement(this.pagination);
                } else {
                    this.hideElement(this.pagination);
                }
            }
        } catch (error) {
            console.error('Error loading quizzes:', error);
            
            // Hide loading indicator
            this.hideElement(this.loadingIndicator);
            
            // Show error message
            if (this.noResultsMessage) {
                const errorTitle = this.noResultsMessage.querySelector('h3');
                const errorMessage = this.noResultsMessage.querySelector('p');
                
                if (errorTitle) errorTitle.textContent = 'Error loading quizzes';
                if (errorMessage) errorMessage.textContent = 'An error occurred while loading quizzes. Please try again later.';
                
                this.showElement(this.noResultsMessage);
            }
        }
    }
    
    /**
     * Update category info section when filtering by category
     */
    updateCategoryInfo(response) {
        if (!this.selectedCategorySection) return;
        
        const category = this.categories.find(c => c.category_id == this.currentFilters.category);
        
        if (category) {
            if (this.selectedCategoryName) {
                this.selectedCategoryName.textContent = category.name;
            }
            
            if (this.selectedCategoryDescription) {
                this.selectedCategoryDescription.textContent = category.description || 'Explore quizzes in this category';
            }
            
            if (this.selectedCategoryCount) {
                this.selectedCategoryCount.textContent = `${response.pagination?.total || 0} quizzes found`;
            }
            
            // Update icon
            if (this.categoryIcon) {
                let iconClass = 'fa-folder';
                switch(category.name.toLowerCase()) {
                    case 'information technology': iconClass = 'fa-laptop-code'; break;
                    case 'biology': iconClass = 'fa-dna'; break;
                    case 'history': iconClass = 'fa-landmark'; break;
                    case 'mathematics': iconClass = 'fa-square-root-alt'; break;
                    case 'physics': iconClass = 'fa-atom'; break;
                    case 'chemistry': iconClass = 'fa-flask'; break;
                    case 'literature': iconClass = 'fa-book'; break;
                }
                this.categoryIcon.innerHTML = `<i class="fas ${iconClass} text-xl"></i>`;
            }
            
            this.showElement(this.selectedCategorySection);
        }
    }
    
    /**
     * Render quizzes in the container
     */
    renderQuizzes() {
        if (!this.quizzesContainer) return;
        
        this.quizzesContainer.innerHTML = '';
        
        this.quizzes.forEach(quiz => {
            const categoryName = quiz.category_name || 'Uncategorized';
            const subcategoryName = quiz.subcategory_name ? ` > ${quiz.subcategory_name}` : '';
            const lastUpdated = new Date(quiz.updated_at || quiz.created_at).toLocaleDateString();
            const rating = parseFloat(quiz.average_rating) || 0;
            const difficultyLabel = ['Easy', 'Medium', 'Hard'][quiz.difficulty_level - 1] || 'Medium';
            
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
            const description = quiz.description || 'No description available.';
            const truncatedDescription = description.length > 120 ? 
                description.substring(0, 120) + '...' : 
                description;
            
            const quizCard = document.createElement('div');
            quizCard.className = 'bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-300 quiz-card cursor-pointer';
            quizCard.setAttribute('data-quiz-id', quiz.quiz_id);
            quizCard.innerHTML = `
                <div class="p-6">
                    <div class="flex justify-between">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            ${categoryName}${subcategoryName}
                        </span>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            ${difficultyLabel}
                        </span>
                    </div>
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
                                <span class="ml-1 text-gray-500">(${rating.toFixed(1)})</span>
                            </div>
                            <div>
                                <a href="quiz.html?id=${quiz.quiz_id}" class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 start-quiz-btn">
                                    Start
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="mt-3 text-xs text-gray-500">
                        <span>Updated ${lastUpdated}</span>
                        <span class="ml-2">by ${quiz.creator_username || 'Anonymous'}</span>
                    </div>
                </div>
            `;
            
            // Add click event listener to the entire card
            quizCard.addEventListener('click', (e) => {
                // Prevent click event if user clicked on the Start button
                if (e.target.closest('.start-quiz-btn')) {
                    return;
                }
                
                // Navigate to quiz overview page
                window.location.href = `quiz-overview.html?id=${quiz.quiz_id}`;
            });
            
            this.quizzesContainer.appendChild(quizCard);
        });
        
        // Show quizzes container
        this.showElement(this.quizzesContainer);
    }
    
    /**
     * Update pagination UI
     */
    updatePagination() {
        if (this.pageIndicator) {
            this.pageIndicator.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
        }
        
        if (this.prevPageBtn) {
            this.prevPageBtn.disabled = this.currentPage === 1;
        }
        
        if (this.nextPageBtn) {
            this.nextPageBtn.disabled = this.currentPage === this.totalPages;
        }
    }
    
    /**
     * Handle search button click
     */
    handleSearch() {
        if (!this.searchInput) return;
        
        this.currentFilters.query = this.searchInput.value.trim();
        this.currentPage = 1;
        this.loadQuizzes();
    }
    
    /**
     * Apply filters from form inputs
     */
    applyFilters() {
        if (this.categoryFilter) {
            this.currentFilters.category = this.categoryFilter.value;
        }
        
        if (this.subcategoryFilter) {
            this.currentFilters.subcategory = this.subcategoryFilter.value;
        }
        
        if (this.difficultyFilter) {
            this.currentFilters.difficulty = this.difficultyFilter.value;
        }
        
        if (this.sortBy) {
            this.currentFilters.sort = this.sortBy.value;
        }
        
        this.currentPage = 1;
        this.loadQuizzes();
    }
    
    /**
     * Clear all filters and reset to default
     */
    clearFilters() {
        if (this.categoryFilter) this.categoryFilter.value = '';
        if (this.subcategoryFilter) {
            this.subcategoryFilter.value = '';
            this.subcategoryFilter.disabled = true;
            this.subcategoryFilter.classList.add('cursor-not-allowed', 'opacity-60');
            this.subcategoryFilter.innerHTML = '<option value="">Select Category First</option>';
        }
        if (this.difficultyFilter) this.difficultyFilter.value = '';
        if (this.sortBy) this.sortBy.value = 'recent';
        if (this.searchInput) this.searchInput.value = '';
        
        this.currentFilters = {
            category: '',
            subcategory: '',
            difficulty: '',
            query: '',
            sort: 'recent'
        };
        
        this.currentPage = 1;
        this.hideElement(this.selectedCategorySection);
        
        this.loadQuizzes();
    }
    
    /**
     * Go to previous page
     */
    goToPreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadQuizzes();
        }
    }
    
    /**
     * Go to next page
     */
    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.loadQuizzes();
        }
    }
    
    /**
     * Show loading state
     */
    showLoading() {
        this.showElement(this.loadingIndicator);
        this.hideElement(this.noResultsMessage);
        this.hideElement(this.quizzesContainer);
        this.hideElement(this.pagination);
    }
    
    /**
     * Show an element
     * @param {HTMLElement} element - The element to show
     */
    showElement(element) {
        if (element) {
            element.classList.remove('hidden');
        }
    }
    
    /**
     * Hide an element
     * @param {HTMLElement} element - The element to hide
     */
    hideElement(element) {
        if (element) {
            element.classList.add('hidden');
        }
    }
}

// Initialize Browse Page Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Browse Page Manager');
    window.browsePage = new BrowsePageManager();
});