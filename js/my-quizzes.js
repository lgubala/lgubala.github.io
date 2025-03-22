/**
 * My Quizzes Page Manager
 * Handles user's quizzes management with tabs for created, attempted, and saved quizzes
 */
class MyQuizzesManager {
    constructor() {
        console.log('My Quizzes Manager initializing...');
        this.api = window.api;
        
        
        // Global variables
        this.currentTab = 'created';
        this.currentPage = 1;
        this.totalPages = 1;
        this.pageSize = 9; // Number of quizzes per page
        this.quizzes = [];
        this.quizToDelete = null;
        
        // Initialize DOM references
        this.initDomReferences();
        
       
        // Initialize the page
        this.init();
    }
    
    /**
     * Initialize DOM references
     */
    initDomReferences() {
        // UI Elements - Tabs
        this.createdTab = document.getElementById('created-tab');
        this.attemptedTab = document.getElementById('attempted-tab');
        this.savedTab = document.getElementById('saved-tab');
        
        // UI Elements - Content
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.noQuizzesMessage = document.getElementById('no-quizzes-message');
        this.noQuizzesTitle = document.getElementById('no-quizzes-title');
        this.noQuizzesMessageText = document.getElementById('no-quizzes-message-text');
        this.quizzesContainer = document.getElementById('quizzes-container');
        
        // UI Elements - Pagination
        this.pagination = document.getElementById('pagination');
        this.prevPageBtn = document.getElementById('prev-page-btn');
        this.nextPageBtn = document.getElementById('next-page-btn');
        this.pageIndicator = document.getElementById('page-indicator');
        
        // UI Elements - Delete Modal
        this.deleteModal = document.getElementById('deleteModal');
        this.confirmDeleteBtn = document.getElementById('confirm-delete-btn');
        this.cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    }
    
    /**
     * Initialize the page
     */
    async init() {
        // Set up tab click handlers
        if (this.createdTab) {
            this.createdTab.addEventListener('click', () => {
                this.switchTab('created');
            });
        }
        
        if (this.attemptedTab) {
            this.attemptedTab.addEventListener('click', () => {
                this.switchTab('attempted');
            });
        }
        
        if (this.savedTab) {
            this.savedTab.addEventListener('click', () => {
                this.switchTab('saved');
            });
        }
        
        // Set up pagination click handlers
        if (this.prevPageBtn) {
            this.prevPageBtn.addEventListener('click', () => {
                this.goToPreviousPage();
            });
        }
        
        if (this.nextPageBtn) {
            this.nextPageBtn.addEventListener('click', () => {
                this.goToNextPage();
            });
        }
        
        // Set up delete modal handlers
        if (this.confirmDeleteBtn) {
            this.confirmDeleteBtn.addEventListener('click', () => {
                this.confirmDeleteQuiz();
            });
        }
        
        if (this.cancelDeleteBtn) {
            this.cancelDeleteBtn.addEventListener('click', () => {
                this.hideDeleteModal();
            });
        }
        
        if (window.auth && window.auth.waitForAuthReady) {
            await window.auth.waitForAuthReady();
        } else {
            console.warn('Auth ready function not available, proceeding without waiting');
        }

        // Check URL params for specific tab
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        
        if (tabParam && ['created', 'attempted', 'saved'].includes(tabParam)) {
            console.log(`URL parameter tab=${tabParam} detected, switching to that tab`);
            this.switchTab(tabParam);
        } else {
            // Initial load with default tab
            await this.loadQuizzes();
        }
        
        console.log('My Quizzes page initialization complete');
    }
    
    /**
     * Load quizzes based on current tab and page
     */
    async loadQuizzes() {
        this.showLoading();
        
        try {
            let response;
            console.log(`Loading ${this.currentTab} quizzes, page ${this.currentPage}`);
            
            switch (this.currentTab) {
                case 'created':
                    response = await this.api.getUserCreatedQuizzes(this.currentPage, this.pageSize);
                    break;
                case 'attempted':
                    response = await this.api.getUserAttemptedQuizzes(this.currentPage, this.pageSize);
                    break;
                case 'saved':
                    response = await this.api.getUserSavedQuizzes(this.currentPage, this.pageSize);
                    break;
            }
            
            console.log(`Loaded ${this.currentTab} quizzes:`, response);
            
            this.quizzes = response.quizzes || [];
            this.totalPages = Math.ceil((response.pagination?.total || 0) / this.pageSize);
            
            if (this.quizzes.length === 0) {
                // Show no quizzes message
                let title, message;
                
                switch (this.currentTab) {
                    case 'created':
                        title = 'No quizzes created';
                        message = 'You haven\'t created any quizzes yet.';
                        break;
                    case 'attempted':
                        title = 'No quizzes attempted';
                        message = 'You haven\'t attempted any quizzes yet.';
                        break;
                    case 'saved':
                        title = 'No quizzes saved';
                        message = 'You haven\'t saved any quizzes for later.';
                        break;
                }
                
                this.showNoQuizzes(title, message);
            } else {
                // Render quizzes
                this.renderQuizzes();
                this.showQuizzes();
            }
        } catch (error) {
            console.error(`Error loading ${this.currentTab} quizzes:`, error);
            
            // Show error message
            this.showNoQuizzes(
                'Error loading quizzes',
                'An error occurred while loading your quizzes. Please try again later.'
            );
        }
    }
    
    /**
     * Render quizzes in the container
     */
    renderQuizzes() {
        if (!this.quizzesContainer) {
            console.error('Quizzes container not found');
            return;
        }
        
        console.log(`Rendering ${this.quizzes.length} quizzes`);
        this.quizzesContainer.innerHTML = '';
        
        this.quizzes.forEach(quiz => {
            const lastUpdated = new Date(quiz.updated_at || quiz.created_at).toLocaleDateString();
            const visibilityIcon = quiz.is_public ? 'fa-globe' : 'fa-lock';
            const visibilityText = quiz.is_public ? 'Public' : 'Private';
            let statusBadge = '';
            
            if (this.currentTab === 'attempted') {
                const scorePercentage = quiz.percentage || 0;
                let scoreClass = 'bg-yellow-100 text-yellow-800';
                
                if (scorePercentage >= 80) {
                    scoreClass = 'bg-green-100 text-green-800';
                } else if (scorePercentage < 50) {
                    scoreClass = 'bg-red-100 text-red-800';
                }
                
                statusBadge = `
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${scoreClass}">
                        ${Math.round(scorePercentage)}%
                    </span>
                `;
            }
            
            const difficultyLabel = ['Easy', 'Medium', 'Hard'][quiz.difficulty_level - 1] || 'Medium';
            
            let actionsHtml = '';
            if (this.currentTab === 'created') {
                actionsHtml = `
                    <div class="mt-3 flex space-x-2">
                        <a href="quiz.html?id=${quiz.quiz_id}" class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700">
                            <i class="fas fa-play mr-1"></i> Take
                        </a>
                        <a href="edit-quiz.html?id=${quiz.quiz_id}" class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700">
                            <i class="fas fa-edit mr-1"></i> Edit
                        </a>
                        <button class="delete-quiz-btn inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700" data-quiz-id="${quiz.quiz_id}">
                            <i class="fas fa-trash-alt mr-1"></i> Delete
                        </button>
                    </div>
                `;
            } else if (this.currentTab === 'attempted') {
                actionsHtml = `
                    <div class="mt-3 flex space-x-2">
                        <a href="quiz.html?id=${quiz.quiz_id}" class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                            <i class="fas fa-play mr-1"></i> Take Again
                        </a>
                        <a href="attempt.html?id=${quiz.attempt_id}" class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200">
                            <i class="fas fa-chart-bar mr-1"></i> Results
                        </a>
                    </div>
                `;
            } else if (this.currentTab === 'saved') {
                actionsHtml = `
                    <div class="mt-3 flex space-x-2">
                        <a href="quiz.html?id=${quiz.quiz_id}" class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                            <i class="fas fa-play mr-1"></i> Take
                        </a>
                        <button class="unsave-quiz-btn inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200" data-quiz-id="${quiz.quiz_id}">
                            <i class="fas fa-bookmark mr-1"></i> Unsave
                        </button>
                    </div>
                `;
            }
            
            const quizCard = document.createElement('div');
            quizCard.className = 'bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md';
            quizCard.innerHTML = `
                <div class="p-6">
                    <div class="flex justify-between items-start">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            ${quiz.category_name || 'Uncategorized'}
                        </span>
                        <div class="flex space-x-1">
                            ${statusBadge}
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <i class="fas ${visibilityIcon} mr-1"></i> ${visibilityText}
                            </span>
                        </div>
                    </div>
                    <h3 class="mt-3 text-lg font-medium text-gray-900">${quiz.title}</h3>
                    <p class="mt-2 text-sm text-gray-500 line-clamp-2">
                        ${quiz.description || 'No description available.'}
                    </p>
                    <div class="mt-4 flex items-center text-xs text-gray-500">
                        <div class="flex-shrink-0">
                            <span class="font-medium">${quiz.questions_count || 0} questions</span>
                        </div>
                        <span class="mx-1">•</span>
                        <div>
                            <span>${difficultyLabel}</span>
                        </div>
                        <span class="mx-1">•</span>
                        <div>
                            <span>Updated ${lastUpdated}</span>
                        </div>
                    </div>
                    ${actionsHtml}
                </div>
            `;
            
            this.quizzesContainer.appendChild(quizCard);
        });
        
        // Add event listeners for delete buttons
        const deleteButtons = document.querySelectorAll('.delete-quiz-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const quizId = button.dataset.quizId;
                console.log(`Delete button clicked for quiz ID: ${quizId}`);
                this.showDeleteModal(quizId);
            });
        });
        
        // Add event listeners for unsave buttons
        const unsaveButtons = document.querySelectorAll('.unsave-quiz-btn');
        unsaveButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const quizId = button.dataset.quizId;
                console.log(`Unsave button clicked for quiz ID: ${quizId}`);
                
                try {
                    // Disable button
                    button.disabled = true;
                    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Unsaving...';
                    
                    await this.api.unsaveQuiz(quizId);
                    console.log(`Quiz ${quizId} unsaved successfully`);
                    
                    // Reload quizzes after unsaving
                    await this.loadQuizzes();
                } catch (error) {
                    console.error('Error unsaving quiz:', error);
                    this.showError('Failed to unsave quiz. Please try again.');
                    
                    // Reset button
                    button.disabled = false;
                    button.innerHTML = '<i class="fas fa-bookmark mr-1"></i> Unsave';
                }
            });
        });
    }
    
    /**
     * Show loading state
     */
    showLoading() {
        this.hideElement(this.noQuizzesMessage);
        this.hideElement(this.quizzesContainer);
        this.hideElement(this.pagination);
        this.showElement(this.loadingIndicator);
        console.log('Showing loading indicator');
    }
    
    /**
     * Show no quizzes message
     * @param {string} title - Message title
     * @param {string} message - Message content
     */
    showNoQuizzes(title, message) {
        if (this.noQuizzesTitle) this.noQuizzesTitle.textContent = title;
        if (this.noQuizzesMessageText) this.noQuizzesMessageText.textContent = message;
        
        this.hideElement(this.loadingIndicator);
        this.hideElement(this.quizzesContainer);
        this.hideElement(this.pagination);
        this.showElement(this.noQuizzesMessage);
        console.log(`Showing no quizzes message: ${title}`);
    }
    
    /**
     * Show quizzes content
     */
    showQuizzes() {
        this.hideElement(this.loadingIndicator);
        this.hideElement(this.noQuizzesMessage);
        this.showElement(this.quizzesContainer);
        console.log(`Showing ${this.quizzes.length} quizzes`);
        
        // Show pagination if needed
        if (this.totalPages > 1) {
            this.updatePagination();
            this.showElement(this.pagination);
        } else {
            this.hideElement(this.pagination);
        }
    }
    
    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        console.error('My Quizzes error:', message);
        alert(message);
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
        
        console.log(`Pagination updated: Page ${this.currentPage} of ${this.totalPages}`);
    }
    
    /**
     * Switch to a different tab
     * @param {string} tab - Tab name ('created', 'attempted', or 'saved')
     */
    switchTab(tab) {
        // Update current tab
        this.currentTab = tab;
        this.currentPage = 1;
        console.log(`Switched to tab: ${tab}`);
        
        // Update tab styling
        [
            { id: 'created-tab', tab: 'created' },
            { id: 'attempted-tab', tab: 'attempted' },
            { id: 'saved-tab', tab: 'saved' }
        ].forEach(item => {
            const element = document.getElementById(item.id);
            if (!element) return;
            
            if (item.tab === tab) {
                element.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
                element.classList.add('border-indigo-500', 'text-indigo-600');
            } else {
                element.classList.remove('border-indigo-500', 'text-indigo-600');
                element.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
            }
        });
        
        // Load quizzes for the selected tab
        this.loadQuizzes();
    }
    
    /**
     * Go to the previous page
     */
    goToPreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            console.log(`Going to previous page: ${this.currentPage}`);
            this.loadQuizzes();
        }
    }
    
    /**
     * Go to the next page
     */
    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            console.log(`Going to next page: ${this.currentPage}`);
            this.loadQuizzes();
        }
    }
    
    /**
     * Show delete confirmation modal
     * @param {string} quizId - ID of quiz to delete
     */
    showDeleteModal(quizId) {
        this.quizToDelete = quizId;
        console.log(`Showing delete modal for quiz ID: ${quizId}`);
        
        if (this.deleteModal) {
            this.deleteModal.classList.remove('hidden');
        } else {
            // Fallback if modal not found
            if (confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
                this.confirmDeleteQuiz();
            }
        }
    }
    
    /**
     * Hide delete confirmation modal
     */
    hideDeleteModal() {
        console.log('Hiding delete modal');
        this.quizToDelete = null;
        
        if (this.deleteModal) {
            this.deleteModal.classList.add('hidden');
        }
    }
    
    /**
     * Confirm and execute quiz deletion
     */
    async confirmDeleteQuiz() {
        if (!this.quizToDelete) {
            console.error('No quiz ID set for deletion');
            return;
        }
        
        console.log(`Confirming deletion of quiz ID: ${this.quizToDelete}`);
        
        try {
            // Disable delete button
            if (this.confirmDeleteBtn) {
                this.confirmDeleteBtn.disabled = true;
                this.confirmDeleteBtn.textContent = 'Deleting...';
            }
            
            await this.api.deleteQuiz(this.quizToDelete);
            console.log(`Quiz ${this.quizToDelete} deleted successfully`);
            
            // Reset button state before hiding the modal
            if (this.confirmDeleteBtn) {
                this.confirmDeleteBtn.disabled = false;
                this.confirmDeleteBtn.textContent = 'Delete';
            }
            
            this.hideDeleteModal();
            
            // Reload quizzes after deletion
            await this.loadQuizzes();
        } catch (error) {
            console.error('Error deleting quiz:', error);
            this.showError('Failed to delete quiz. Please try again.');
            
            // Reset button
            if (this.confirmDeleteBtn) {
                this.confirmDeleteBtn.disabled = false;
                this.confirmDeleteBtn.textContent = 'Delete';
            }
            
            this.hideDeleteModal();
        }
    }
    
    /**
     * Show an element
     * @param {HTMLElement} element - Element to show
     */
    showElement(element) {
        if (element) {
            element.classList.remove('hidden');
        }
    }
    
    /**
     * Hide an element
     * @param {HTMLElement} element - Element to hide
     */
    hideElement(element) {
        if (element) {
            element.classList.add('hidden');
        }
    }
}

// Initialize My Quizzes Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing My Quizzes Manager');
    window.myQuizzes = new MyQuizzesManager();
});