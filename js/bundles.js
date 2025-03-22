/**
 * Bundles Page Manager
 * Handles quiz bundle browsing functionality including search, filters, and pagination
 */
class BundlesPageManager {
    constructor() {
        console.log('Bundles Page Manager initializing...');
        this.api = window.api;
        
        // State variables
        this.currentPage = 1;
        this.totalPages = 1;
        this.pageSize = 9; // Number of bundles per page
        this.bundles = [];
        this.categories = [];
        this.currentFilters = {
            category: '',
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
        this.bundlesContainer = document.getElementById('bundles-container');
        this.pagination = document.getElementById('pagination');
        this.createBundleCta = document.getElementById('create-bundle-cta');
        
        // Filters and search
        this.categoryFilter = document.getElementById('category-filter');
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
        console.log('Bundles page initializing...');
        
        // Set up event listeners
        this.attachEventListeners();
        
        // Load categories
        await this.loadCategories();
        
        // Load initial bundles
        await this.loadBundles();
        
        console.log('Bundles page initialized');
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
    }
    
    /**
     * Load categories for filter
     */
    async loadCategories() {
        try {
            console.log('Loading categories');
            
            // Check if category filter exists
            if (!this.categoryFilter) {
                console.warn('Category filter element not found');
                return;
            }
            
            // Use the API to get categories
            this.categories = await this.api.getCategories();
            console.log(`Loaded ${this.categories.length} categories`);
            
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
     * Load bundles based on current filters and pagination
     */
    async loadBundles() {
        // Show loading indicator
        this.showLoading();
        
        try {
            console.log('Loading bundles with filters:', this.currentFilters);
            
            const offset = (this.currentPage - 1) * this.pageSize;
            let url = `/bundles?limit=${this.pageSize}&offset=${offset}`;
            
            // Add filters to URL
            if (this.currentFilters.category) {
                url += `&category=${this.currentFilters.category}`;
            }
            
            if (this.currentFilters.difficulty) {
                url += `&difficulty=${this.currentFilters.difficulty}`;
            }
            
            if (this.currentFilters.query) {
                url += `&q=${encodeURIComponent(this.currentFilters.query)}`;
            }
            
            if (this.currentFilters.sort) {
                url += `&sort=${this.currentFilters.sort}`;
            }
            
            // Make API request
            const response = await this.api.get(url);
            console.log(`Loaded ${response.bundles?.length || 0} bundles`);
            
            this.bundles = response.bundles || [];
            this.totalPages = Math.ceil((response.pagination?.total || 0) / this.pageSize);
            
            // Hide loading indicator
            this.hideElement(this.loadingIndicator);
            
            if (this.bundles.length === 0) {
                // Show no results message
                this.showElement(this.noResultsMessage);
                this.hideElement(this.bundlesContainer);
                this.hideElement(this.pagination);
            } else {
                // Render bundles
                this.renderBundles();
                
                // Show pagination if needed
                if (this.totalPages > 1) {
                    this.updatePagination();
                    this.showElement(this.pagination);
                } else {
                    this.hideElement(this.pagination);
                }
            }
        } catch (error) {
            console.error('Error loading bundles:', error);
            
            // Hide loading indicator
            this.hideElement(this.loadingIndicator);
            
            // Show error message
            if (this.noResultsMessage) {
                const errorTitle = this.noResultsMessage.querySelector('h3');
                const errorMessage = this.noResultsMessage.querySelector('p');
                
                if (errorTitle) errorTitle.textContent = 'Error loading bundles';
                if (errorMessage) errorMessage.textContent = 'An error occurred while loading bundles. Please try again later.';
                
                this.showElement(this.noResultsMessage);
                this.hideElement(this.bundlesContainer);
                this.hideElement(this.pagination);
            }
        }
    }
    
    /**
     * Render bundles in the container
     */
    renderBundles() {
        if (!this.bundlesContainer) return;
        
        this.bundlesContainer.innerHTML = '';
        this.showElement(this.bundlesContainer);
        
        this.bundles.forEach(bundle => {
            const categoryName = bundle.category_name || 'Uncategorized';
            const subcategoryName = bundle.subcategory_name ? ` > ${bundle.subcategory_name}` : '';
            const quizCount = bundle.quizzes_count || 0;
            const rating = parseFloat(bundle.average_rating) || 0;
            const formattedRating = rating.toFixed(1);
            
            // Determine difficulty badge class and label
            let difficultyClass, difficultyLabel;
            switch (bundle.difficulty_level) {
                case 1:
                    difficultyClass = 'bg-green-100 text-green-800';
                    difficultyLabel = 'Easy';
                    break;
                case 3:
                    difficultyClass = 'bg-red-100 text-red-800';
                    difficultyLabel = 'Hard';
                    break;
                default:
                    difficultyClass = 'bg-yellow-100 text-yellow-800';
                    difficultyLabel = 'Medium';
            }
            
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
            
            const bundleCard = document.createElement('div');
            bundleCard.className = 'bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-300 bundle-card';
            
            bundleCard.innerHTML = `
                <div class="p-6">
                    <div class="flex justify-between">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            ${categoryName}${subcategoryName}
                        </span>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyClass}">
                            ${difficultyLabel}
                        </span>
                    </div>
                    <h3 class="mt-3 text-lg font-medium text-gray-900">${bundle.title}</h3>
                    <p class="mt-2 text-sm text-gray-500 line-clamp-2">
                        ${bundle.description || 'No description available.'}
                    </p>
                    <div class="mt-4 flex items-center text-sm">
                        <div class="flex-shrink-0">
                            <span class="font-medium text-gray-600">
                                <i class="fas fa-layer-group mr-1"></i> ${quizCount} ${quizCount === 1 ? 'quiz' : 'quizzes'}
                            </span>
                        </div>
                        <span class="mx-2 text-gray-500">•</span>
                        <div class="flex items-center text-yellow-400">
                            ${starsHtml}
                            <span class="ml-1 text-gray-600">(${formattedRating})</span>
                        </div>
                    </div>
                    <div class="mt-4 flex justify-between items-center">
                        <span class="text-sm text-gray-500">By ${bundle.creator_username || 'Anonymous'}</span>
                        <a href="bundle.html?id=${bundle.bundle_id}" class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                            View Bundle
                        </a>
                    </div>
                </div>
            `;
            
            this.bundlesContainer.appendChild(bundleCard);
        });
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
     * Show loading state
     */
    showLoading() {
        this.showElement(this.loadingIndicator);
        this.hideElement(this.noResultsMessage);
        this.hideElement(this.bundlesContainer);
        this.hideElement(this.pagination);
    }
    
    /**
     * Handle search button click
     */
    handleSearch() {
        if (!this.searchInput) return;
        
        this.currentFilters.query = this.searchInput.value.trim();
        this.currentPage = 1;
        this.loadBundles();
    }
    
    /**
     * Apply filters from form inputs
     */
    applyFilters() {
        if (this.categoryFilter) {
            this.currentFilters.category = this.categoryFilter.value;
        }
        
        if (this.difficultyFilter) {
            this.currentFilters.difficulty = this.difficultyFilter.value;
        }
        
        if (this.sortBy) {
            this.currentFilters.sort = this.sortBy.value;
        }
        
        this.currentPage = 1;
        this.loadBundles();
    }
    
    /**
     * Clear all filters and reset to default
     */
    clearFilters() {
        if (this.categoryFilter) this.categoryFilter.value = '';
        if (this.difficultyFilter) this.difficultyFilter.value = '';
        if (this.sortBy) this.sortBy.value = 'recent';
        if (this.searchInput) this.searchInput.value = '';
        
        this.currentFilters = {
            category: '',
            difficulty: '',
            query: '',
            sort: 'recent'
        };
        
        this.currentPage = 1;
        this.loadBundles();
    }
    
    /**
     * Go to previous page
     */
    goToPreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadBundles();
        }
    }
    
    /**
     * Go to next page
     */
    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.loadBundles();
        }
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

// Initialize Bundles Page Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Bundles Page Manager');
    window.bundlesPage = new BundlesPageManager();
});