/**
 * Quiz Overview Page Manager
 * Handles quiz overview functionality with tabs for overview, materials, discussions, and ratings
 */
class QuizOverviewManager {
    constructor() {
        console.log('Quiz Overview Manager initializing...');
        this.api = window.api;
        this.auth = window.auth;
        
        // Quiz data
        this.quiz = null;
        this.materials = [];
        this.comments = [];
        this.ratings = [];
        this.statistics = null;
        this.relatedQuizzes = [];
        
        // User selections
        this.selectedRating = 0;
        
        // Current tab
        this.currentTab = 'overview';
        
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
        this.quizHeader = document.getElementById('quiz-header');
        this.tabsContainer = document.getElementById('tabs-container');
        
        // Header elements
        this.quizTitle = document.getElementById('quiz-title');
        this.quizDescription = document.getElementById('quiz-description');
        this.quizCategory = document.getElementById('quiz-category');
        this.quizDifficulty = document.getElementById('quiz-difficulty');
        this.quizCreator = document.getElementById('quiz-creator');
        this.quizDate = document.getElementById('quiz-date');
        this.quizViews = document.getElementById('quiz-views');
        this.quizQuestionCount = document.getElementById('quiz-question-count');
        this.quizTimeLimit = document.getElementById('quiz-time-limit');
        this.quizRating = document.getElementById('quiz-rating');
        this.startQuizBtn = document.getElementById('start-quiz-btn');
        
        // Tab buttons
        this.overviewTab = document.getElementById('overview-tab');
        this.materialsTab = document.getElementById('materials-tab');
        this.discussionsTab = document.getElementById('discussions-tab');
        this.ratingsTab = document.getElementById('ratings-tab');
        
        // Tab content containers
        this.overviewTabContent = document.getElementById('overview-tab-content');
        this.materialsTabContent = document.getElementById('materials-tab-content');
        this.discussionsTabContent = document.getElementById('discussions-tab-content');
        this.ratingsTabContent = document.getElementById('ratings-tab-content');
        
        // Overview tab elements
        this.quizFullDescription = document.getElementById('quiz-full-description');
        this.averageScore = document.getElementById('average-score');
        this.completionCount = document.getElementById('completion-count');
        this.passRate = document.getElementById('pass-rate');
        this.avgTime = document.getElementById('avg-time');
        this.relatedQuizzesContainer = document.getElementById('related-quizzes');
        
        // Option form elements
        this.questionCountSelect = document.getElementById('question-count');
        this.timerDefault = document.getElementById('timer-default');
        this.timerNone = document.getElementById('timer-none');
        this.timerCustom = document.getElementById('timer-custom');
        this.customTimerInput = document.getElementById('custom-timer-input');
        this.customMinutes = document.getElementById('custom-minutes');
        this.startWithOptionsBtn = document.getElementById('start-with-options-btn');
        
        // Learning materials elements
        this.learningMaterialsList = document.getElementById('learning-materials-list');
        this.addMaterialBtn = document.getElementById('add-material-btn');
        this.noMaterialsMessage = document.getElementById('no-materials-message');
        
        // Discussions elements
        this.commentForm = document.getElementById('comment-form');
        this.commentText = document.getElementById('comment-text');
        this.commentFormContainer = document.getElementById('comment-form-container');
        this.submitCommentBtn = document.getElementById('submit-comment-btn');
        this.commentsList = document.getElementById('comments-list');
        this.guestCommentMessage = document.getElementById('guest-comment-message');
        this.noCommentsMessage = document.getElementById('no-comments-message');
        
        // Ratings elements
        this.averageRatingValue = document.getElementById('average-rating-value');
        this.totalRatings = document.getElementById('total-ratings');
        this.showRatingFormBtn = document.getElementById('show-rating-form-btn');
        this.ratingFormContainer = document.getElementById('rating-form-container');
        this.ratingForm = document.getElementById('rating-form');
        this.stars = document.querySelectorAll('.star');
        this.ratingComment = document.getElementById('rating-comment');
        this.submitRatingBtn = document.getElementById('submit-rating-btn');
        this.cancelRatingBtn = document.getElementById('cancel-rating-btn');
        this.reviewsList = document.getElementById('reviews-list');
        this.noReviewsMessage = document.getElementById('no-reviews-message');
        
        // Rating distribution elements
        this.fiveStarBar = document.getElementById('five-star-bar');
        this.fourStarBar = document.getElementById('four-star-bar');
        this.threeStarBar = document.getElementById('three-star-bar');
        this.twoStarBar = document.getElementById('two-star-bar');
        this.oneStarBar = document.getElementById('one-star-bar');
        this.fiveStarCount = document.getElementById('five-star-count');
        this.fourStarCount = document.getElementById('four-star-count');
        this.threeStarCount = document.getElementById('three-star-count');
        this.twoStarCount = document.getElementById('two-star-count');
        this.oneStarCount = document.getElementById('one-star-count');
        
        // Add material modal
        this.addMaterialModal = document.getElementById('add-material-modal');
        this.materialTypeSelect = document.getElementById('material-type');
        this.textContentContainer = document.getElementById('text-content-container');
        this.linkContentContainer = document.getElementById('link-content-container');
        this.fileContentContainer = document.getElementById('file-content-container');
        this.submitMaterialBtn = document.getElementById('submit-material-btn');
        this.cancelMaterialBtn = document.getElementById('cancel-material-btn');
    }
    
    /**
     * Initialize the page
     */
    async init() {
        console.log('Quiz overview page initializing...');
        
        // Set up event listeners
        this.attachEventListeners();
        
        // Get quiz ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const quizId = urlParams.get('id');
        
        if (!quizId) {
            this.showError('Quiz ID is missing. Redirecting to home page.');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }
        
        try {
            // Load quiz data
            await this.loadQuiz(quizId);
            
            // Update UI
            this.updateQuizHeader();
            
            // Load initial tab content
            await this.loadTabContent(this.currentTab);
            
            // Show main content
            this.showContent();
        } catch (error) {
            console.error('Error initializing quiz overview page:', error);
            this.showError('Failed to load quiz. Please try again later.');
            
            setTimeout(() => {
                window.location.href = 'browse.html';
            }, 2000);
        }
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Tab buttons
        if (this.overviewTab) {
            this.overviewTab.addEventListener('click', () => this.switchTab('overview'));
        }
        
        if (this.materialsTab) {
            this.materialsTab.addEventListener('click', () => this.switchTab('materials'));
        }
        
        if (this.discussionsTab) {
            this.discussionsTab.addEventListener('click', () => this.switchTab('discussions'));
        }
        
        if (this.ratingsTab) {
            this.ratingsTab.addEventListener('click', () => this.switchTab('ratings'));
        }
        
        // Start quiz buttons
        if (this.startQuizBtn) {
            this.startQuizBtn.addEventListener('click', () => this.startQuiz());
        }
        
        if (this.startWithOptionsBtn) {
            this.startWithOptionsBtn.addEventListener('click', () => this.startQuizWithOptions());
        }
        
        // Custom timer input toggle
        if (this.timerCustom) {
            this.timerCustom.addEventListener('change', () => {
                if (this.timerCustom.checked && this.customTimerInput) {
                    this.customTimerInput.classList.remove('hidden');
                }
            });
        }
        
        if (this.timerDefault || this.timerNone) {
            const hideCustomTimerInput = () => {
                if (this.customTimerInput) {
                    this.customTimerInput.classList.add('hidden');
                }
            };
            
            this.timerDefault.addEventListener('change', hideCustomTimerInput);
            this.timerNone.addEventListener('change', hideCustomTimerInput);
        }
        
        // Add material button
        if (this.addMaterialBtn) {
            this.addMaterialBtn.addEventListener('click', () => this.showAddMaterialModal());
        }
        
        // Material type select
        if (this.materialTypeSelect) {
            this.materialTypeSelect.addEventListener('change', () => this.updateMaterialTypeUI());
        }
        
        // Add material modal buttons
        if (this.submitMaterialBtn) {
            this.submitMaterialBtn.addEventListener('click', () => this.submitMaterial());
        }
        
        if (this.cancelMaterialBtn) {
            this.cancelMaterialBtn.addEventListener('click', () => this.hideAddMaterialModal());
        }
        
        // Comment form
        if (this.commentForm) {
            this.commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitComment();
            });
        }
        
        // Rating form
        if (this.showRatingFormBtn) {
            this.showRatingFormBtn.addEventListener('click', () => this.showRatingForm());
        }
        
        if (this.cancelRatingBtn) {
            this.cancelRatingBtn.addEventListener('click', () => this.hideRatingForm());
        }
        
        if (this.ratingForm) {
            this.ratingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitRating();
            });
        }
        
        // Rating stars
        if (this.stars) {
            this.stars.forEach(star => {
                star.addEventListener('click', () => {
                    const rating = parseInt(star.dataset.rating);
                    this.selectRating(rating);
                });
                
                // Add hover effect
                star.addEventListener('mouseenter', () => {
                    const rating = parseInt(star.dataset.rating);
                    this.hoverRating(rating);
                });
            });
            
            // Remove hover effect when mouse leaves the container
            const starsContainer = this.stars[0]?.parentElement;
            if (starsContainer) {
                starsContainer.addEventListener('mouseleave', () => {
                    this.resetStarsHover();
                });
            }
        }

        // Set up drag and drop for file upload
        this.setupDragDropUpload();
    }
    
    /**
     * Load quiz data
     * @param {string} quizId - Quiz ID
     */
    async loadQuiz(quizId) {
        console.log(`Loading quiz: ${quizId}`);
        
        try {
            this.quiz = await this.api.getQuiz(quizId);
            console.log('Quiz data loaded:', this.quiz);
            
            if (!this.quiz) {
                throw new Error('Quiz not found');
            }
            
            return this.quiz;
        } catch (error) {
            console.error('Error loading quiz:', error);
            throw new Error('Failed to load quiz data');
        }
    }
    
    /**
     * Update quiz header with data
     */
    updateQuizHeader() {
        if (!this.quiz) return;
        
        // Set title and description
        if (this.quizTitle) this.quizTitle.textContent = this.quiz.title;
        if (this.quizDescription) this.quizDescription.textContent = this.quiz.description || 'No description available';
        
        // Set category
        if (this.quizCategory) {
            const category = this.quiz.category_name || 'Uncategorized';
            const subcategory = this.quiz.subcategory_name ? ` > ${this.quiz.subcategory_name}` : '';
            this.quizCategory.innerHTML = `
                <i class="fas fa-folder mr-1"></i>
                <span>${category}${subcategory}</span>
            `;
        }
        
        // Set difficulty
        if (this.quizDifficulty) {
            let difficultyLabel, difficultyClass;
            switch (this.quiz.difficulty_level) {
                case 1:
                    difficultyLabel = 'Easy';
                    difficultyClass = 'bg-green-100 text-green-800';
                    break;
                case 3:
                    difficultyLabel = 'Hard';
                    difficultyClass = 'bg-red-100 text-red-800';
                    break;
                case 2:
                default:
                    difficultyLabel = 'Medium';
                    difficultyClass = 'bg-yellow-100 text-yellow-800';
                    break;
            }
            
            this.quizDifficulty.className = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyClass}`;
            this.quizDifficulty.innerHTML = `
                <i class="fas fa-signal mr-1"></i>
                <span>${difficultyLabel}</span>
            `;
        }
        
        // Set creator
        if (this.quizCreator) {
            this.quizCreator.textContent = this.quiz.creator_username || 'Anonymous';
        }
        
        // Set date
        if (this.quizDate) {
            const date = new Date(this.quiz.created_at);
            this.quizDate.textContent = date.toLocaleDateString();
        }
        
        // Set views
        if (this.quizViews) {
            this.quizViews.textContent = `${this.quiz.view_count || 0} views`;
        }
        
        // Set question count
        if (this.quizQuestionCount) {
            this.quizQuestionCount.textContent = `${this.quiz.questions_count || 0} questions`;
        }
        
        // Set time limit
        if (this.quizTimeLimit) {
            if (this.quiz.time_limit) {
                const minutes = Math.floor(this.quiz.time_limit / 60);
                const seconds = this.quiz.time_limit % 60;
                this.quizTimeLimit.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            } else {
                this.quizTimeLimit.textContent = 'No time limit';
            }
        }
        
        // Set rating
        if (this.quizRating) {
            const rating = parseFloat(this.quiz.average_rating) || 0;
            const formattedRating = rating.toFixed(1);
            const ratingsCount = this.quiz.ratings_count || 0;
            
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
            
            this.quizRating.innerHTML = `
                <div class="flex text-yellow-400">
                    ${starsHtml}
                </div>
                <span class="ml-1 text-gray-600">${formattedRating} (${ratingsCount} ratings)</span>
            `;
        }
    }
    
    /**
     * Show main content (hide loading indicator)
     */
    showContent() {
        if (this.loadingIndicator) this.loadingIndicator.classList.add('hidden');
        if (this.quizHeader) this.quizHeader.classList.remove('hidden');
        if (this.tabsContainer) this.tabsContainer.classList.remove('hidden');
    }
    
    /**
     * Switch to a different tab
     * @param {string} tab - Tab name ('overview', 'materials', 'discussions', or 'ratings')
     */
    async switchTab(tab) {
        console.log(`Switching to tab: ${tab}`);
        this.currentTab = tab;
        
        // Update tab buttons
        [
            { element: this.overviewTab, tab: 'overview' },
            { element: this.materialsTab, tab: 'materials' },
            { element: this.discussionsTab, tab: 'discussions' },
            { element: this.ratingsTab, tab: 'ratings' }
        ].forEach(item => {
            if (item.element) {
                if (item.tab === tab) {
                    item.element.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
                    item.element.classList.add('border-indigo-500', 'text-indigo-600');
                } else {
                    item.element.classList.remove('border-indigo-500', 'text-indigo-600');
                    item.element.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
                }
            }
        });
        
        // Show/hide tab content
        [
            { element: this.overviewTabContent, tab: 'overview' },
            { element: this.materialsTabContent, tab: 'materials' },
            { element: this.discussionsTabContent, tab: 'discussions' },
            { element: this.ratingsTabContent, tab: 'ratings' }
        ].forEach(item => {
            if (item.element) {
                if (item.tab === tab) {
                    item.element.classList.remove('hidden');
                } else {
                    item.element.classList.add('hidden');
                }
            }
        });
        
        // Load tab content
        await this.loadTabContent(tab);
    }
    
    /**
     * Load content for the selected tab
     * @param {string} tab - Tab name
     */
    async loadTabContent(tab) {
        switch (tab) {
            case 'overview':
                await this.loadOverviewContent();
                break;
            case 'materials':
                await this.loadMaterials();
                break;
            case 'discussions':
                await this.loadComments();
                break;
            case 'ratings':
                await this.loadRatings();
                break;
        }
    }
    
    /**
     * Load content for the Overview tab
     */
    async loadOverviewContent() {
        console.log('Loading overview content');
        
        // Update full description
        if (this.quizFullDescription) {
            this.quizFullDescription.textContent = this.quiz.description || 'No description available for this quiz.';
        }
        
        try {
            // Load quiz statistics
            const statistics = await this.api.getQuizStatistics(this.quiz.quiz_id);
            this.statistics = statistics;
            console.log('Quiz statistics loaded:', statistics);
            
            // Update statistics display
            if (statistics) {
                if (this.averageScore) {
                    this.averageScore.textContent = `${Math.round(statistics.average_score || 0)}%`;
                }
                
                if (this.completionCount) {
                    this.completionCount.textContent = statistics.total_attempts || 0;
                }
                
                if (this.passRate) {
                    const passRate = statistics.total_attempts > 0 
                        ? Math.round((statistics.passed_attempts / statistics.total_attempts) * 100) 
                        : 0;
                    this.passRate.textContent = `${passRate}%`;
                }
                
                if (this.avgTime) {
                    const avgSeconds = statistics.average_time || 0;
                    const minutes = Math.floor(avgSeconds / 60);
                    const seconds = Math.round(avgSeconds % 60);
                    this.avgTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                }
            }
            
            // Load related quizzes
            const category = this.quiz.category_id;
            if (category) {
                const response = await this.api.getQuizzesByCategory(category, 3);
                this.relatedQuizzes = response.quizzes || [];
                console.log('Related quizzes loaded:', this.relatedQuizzes);
                
                // Filter out current quiz
                this.relatedQuizzes = this.relatedQuizzes.filter(quiz => quiz.quiz_id !== this.quiz.quiz_id);
                
                // Display up to 3 related quizzes
                this.renderRelatedQuizzes();
            }
        } catch (error) {
            console.error('Error loading overview content:', error);
            // Non-critical error, don't show error message to user
        }
    }
    
    /**
     * Render related quizzes
     */
    renderRelatedQuizzes() {
        if (!this.relatedQuizzesContainer) return;
        
        if (!this.relatedQuizzes || this.relatedQuizzes.length === 0) {
            this.relatedQuizzesContainer.innerHTML = '<p class="text-gray-500">No related quizzes found.</p>';
            return;
        }
        
        this.relatedQuizzesContainer.innerHTML = '';
        
        // Display up to 3 related quizzes
        const quizzesToShow = this.relatedQuizzes.slice(0, 3);
        
        quizzesToShow.forEach(quiz => {
            const quizElement = document.createElement('div');
            quizElement.className = 'bg-gray-50 p-3 rounded-md mb-2 hover:bg-gray-100';
            
            const difficultyLabel = ['Easy', 'Medium', 'Hard'][quiz.difficulty_level - 1] || 'Medium';
            
            quizElement.innerHTML = `
                <a href="quiz-overview.html?id=${quiz.quiz_id}" class="block">
                    <h4 class="text-sm font-medium text-gray-900">${quiz.title}</h4>
                    <div class="flex items-center mt-1 text-xs text-gray-500">
                        <span class="mr-2">${quiz.questions_count || 0} questions</span>
                        <span class="mr-2">•</span>
                        <span>${difficultyLabel}</span>
                        ${quiz.average_rating ? `
                            <span class="mr-2">•</span>
                            <div class="flex items-center">
                                <i class="fas fa-star text-yellow-400 mr-1"></i>
                                <span>${parseFloat(quiz.average_rating).toFixed(1)}</span>
                            </div>
                        ` : ''}
                    </div>
                </a>
            `;
            
            this.relatedQuizzesContainer.appendChild(quizElement);
        });
    }
    
    /**
     * Load learning materials
     */
    async loadMaterials() {
        console.log('Loading learning materials');
        
        try {
            // Show loading state
            if (this.learningMaterialsList) {
                this.learningMaterialsList.innerHTML = `
                    <li class="p-4 animate-pulse">
                        <div class="flex space-x-3">
                            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200"></div>
                            <div class="flex-1 space-y-1 py-1">
                                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                                <div class="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    </li>
                `;
            }
            
            // Fetch materials
            this.materials = await this.api.getQuizMaterials(this.quiz.quiz_id);
            console.log('Learning materials loaded:', this.materials);
            
            // Render materials
            this.renderMaterials();
            
            // Update auth-dependent UI
            this.updateAuthUI();
        } catch (error) {
            console.error('Error loading materials:', error);
            
            if (this.learningMaterialsList) {
                this.learningMaterialsList.innerHTML = `
                    <li class="p-4 text-center">
                        <p class="text-red-500">Failed to load learning materials. Please try refreshing the page.</p>
                    </li>
                `;
            }
        }
    }
    
    /**
     * Render learning materials
     */
    renderMaterials() {
        if (!this.learningMaterialsList) return;
        
        this.learningMaterialsList.innerHTML = '';
        
        if (!this.materials || this.materials.length === 0) {
            if (this.noMaterialsMessage) {
                this.noMaterialsMessage.classList.remove('hidden');
            }
            return;
        }
        
        if (this.noMaterialsMessage) {
            this.noMaterialsMessage.classList.add('hidden');
        }
        
        this.materials.forEach(material => {
            const item = document.createElement('li');
            item.className = 'px-4 py-4 hover:bg-gray-50';
            
            // Get appropriate icon for material type
            let typeIcon;
            switch (material.content_type) {
                case 'text':
                    typeIcon = 'fas fa-file-alt';
                    break;
                case 'link':
                    typeIcon = 'fas fa-link';
                    break;
                case 'file':
                    typeIcon = 'fas fa-file';
                    break;
                default:
                    typeIcon = 'fas fa-file';
            }
            
            item.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <i class="${typeIcon} text-indigo-600"></i>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-lg font-medium text-gray-900">${material.title}</h4>
                            <p class="text-sm text-gray-500">${material.description || ''}</p>
                            <p class="text-xs text-gray-400 mt-1">Added by ${material.creator_username || 'Anonymous'} on ${new Date(material.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div>
                        ${this.renderMaterialAction(material)}
                    </div>
                </div>
            `;
            
            this.learningMaterialsList.appendChild(item);
            
            // Add event listeners for view material buttons
            const viewBtn = item.querySelector('.view-material-btn');
            if (viewBtn) {
                viewBtn.addEventListener('click', () => {
                    this.viewTextMaterial(material);
                });
            }
        });
    }
    
    /**
     * Render material action button based on type
     * @param {Object} material - Material data
     * @returns {string} - HTML for action button
     */
    renderMaterialAction(material) {
        switch (material.content_type) {
            case 'text':
                return `
                    <button data-material-id="${material.material_id}" class="view-material-btn inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                        <i class="fas fa-eye mr-1"></i> View
                    </button>
                `;
            case 'link':
                return `
                    <a href="${material.content}" target="_blank" class="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                        <i class="fas fa-external-link-alt mr-1"></i> Open
                    </a>
                `;
            case 'file':
                return `
                    <a href="${material.content}" target="_blank" class="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                        <i class="fas fa-download mr-1"></i> Download
                    </a>
                `;
            default:
                return '';
        }
    }
    
    /**
     * View text material in a modal
     * @param {Object} material - Material data
     */
    viewTextMaterial(material) {
        // Create a modal to display the text content
        const modalHtml = `
            <div class="fixed z-10 inset-0 overflow-y-auto" id="text-material-modal">
                <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                    <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                    <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">${material.title}</h3>
                            <div class="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
                                <p class="whitespace-pre-wrap text-gray-800">${material.content}</p>
                            </div>
                        </div>
                        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="button" id="close-text-modal-btn" class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to the document
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
        
        // Add event listener to close button
        document.getElementById('close-text-modal-btn').addEventListener('click', () => {
            modalContainer.remove();
        });
    }
    
    /**
     * Show add material modal
     */
    showAddMaterialModal() {
        if (this.addMaterialModal) {
            this.addMaterialModal.classList.remove('hidden');
            
            // Reset form
            const form = document.getElementById('add-material-form');
            if (form) form.reset();
            
            // Set default material type UI
            this.updateMaterialTypeUI();
        }
    }
    
    /**
     * Hide add material modal
     */
    hideAddMaterialModal() {
        if (this.addMaterialModal) {
            this.addMaterialModal.classList.add('hidden');
            
            // Clean up any dropped files
            const fileDropArea = document.querySelector('#file-content-container .border-dashed');
            if (fileDropArea) {
                fileDropArea._droppedFile = null;
                
                // Reset file name display if there is one
                const fileNameDisplay = fileDropArea.querySelector('.text-xs.text-gray-500');
                if (fileNameDisplay) {
                    fileNameDisplay.textContent = 'PDF, DOC, PPTX, etc. up to 10MB';
                }
            }
            
            // Reset form
            const form = document.getElementById('add-material-form');
            if (form) form.reset();
        }
    }
    
    /**
     * Update material type UI based on selected type
     */
    updateMaterialTypeUI() {
        const selectedType = this.materialTypeSelect?.value || 'text';
        
        // Show/hide appropriate content container
        [
            { container: this.textContentContainer, type: 'text' },
            { container: this.linkContentContainer, type: 'link' },
            { container: this.fileContentContainer, type: 'file' }
        ].forEach(item => {
            if (item.container) {
                if (item.type === selectedType) {
                    item.container.classList.remove('hidden');
                } else {
                    item.container.classList.add('hidden');
                }
            }
        });
    }
    
    /**
     * Submit material
     */
    async submitMaterial() {
        // Get form values
        const title = document.getElementById('material-title')?.value;
        const description = document.getElementById('material-description')?.value;
        const materialType = this.materialTypeSelect?.value || 'text';
        
        // Validate
        if (!title) {
            window.toast.error('Please enter a title');
            return;
        }
        
        // Disable submit button
        if (this.submitMaterialBtn) {
            this.submitMaterialBtn.disabled = true;
            this.submitMaterialBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Adding...';
        }
        
        try {
            let response;
            
            // Get content based on type
            if (materialType === 'text') {
                const content = document.getElementById('text-content')?.value;
                if (!content) {
                    window.toast.error('Please enter content');
                    return;
                }
                
                // Submit text material
                response = await this.api.addQuizMaterial(this.quiz.quiz_id, {
                    title,
                    description,
                    content_type: 'text',
                    content
                });
            } else if (materialType === 'link') {
                const content = document.getElementById('link-content')?.value;
                if (!content) {
                    window.toast.error('Please enter a URL');
                    return;
                }
                
                // Add https:// if not present
                let url = content;
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                }
                
                // Submit link material
                response = await this.api.addQuizMaterial(this.quiz.quiz_id, {
                    title,
                    description,
                    content_type: 'link',
                    content: url
                });
            } else if (materialType === 'file') {
                const fileInput = document.getElementById('file-content');
                const fileDropArea = document.querySelector('#file-content-container .border-dashed');
                
                // Check if we have a file either from the input or dropped
                const hasInputFile = fileInput && fileInput.files && fileInput.files[0];
                const hasDroppedFile = fileDropArea && fileDropArea._droppedFile;
                
                if (!hasInputFile && !hasDroppedFile) {
                    window.toast.error('Please select a file');
                    return;
                }
                
                // Create FormData
                const formData = new FormData();
                
                // Add the file (either from input or dropped)
                if (hasInputFile) {
                    formData.append('file', fileInput.files[0]);
                    console.log('Using file from input:', fileInput.files[0].name);
                } else if (hasDroppedFile) {
                    formData.append('file', fileDropArea._droppedFile);
                    console.log('Using dropped file:', fileDropArea._droppedFile.name);
                }
                
                formData.append('title', title);
                formData.append('description', description || '');
                formData.append('content_type', 'file');
                
                // Submit file material
                response = await this.api.uploadMaterial(this.quiz.quiz_id, formData, 'quiz');
            }
            
            console.log('Material added:', response);
            
            // Hide modal
            this.hideAddMaterialModal();
            
            // Reload materials
            await this.loadMaterials();
            
            // Show success message
            window.toast.success('Learning material added successfully');
        } catch (error) {
            console.error('Error adding material:', error);
            window.toast.error('Failed to add material. Please try again.');
        } finally {
            // Reset button
            if (this.submitMaterialBtn) {
                this.submitMaterialBtn.disabled = false;
                this.submitMaterialBtn.innerHTML = 'Add Material';
            }
        }
    }
    
    /**
     * Load comments for the quiz
     */
    async loadComments() {
        console.log('Loading comments');
        
        try {
            // Show loading state
            if (this.commentsList) {
                this.commentsList.innerHTML = `
                    <li class="p-4 animate-pulse">
                        <div class="flex space-x-3">
                            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200"></div>
                            <div class="flex-1 space-y-1 py-1">
                                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                                <div class="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    </li>
                `;
            }
            
            // Fetch comments
            this.comments = await this.api.getQuizComments(this.quiz.quiz_id);
            console.log('Comments loaded:', this.comments);
            
            // Render comments
            this.renderComments();
            
            // Update auth-dependent UI
            this.updateAuthUI();
        } catch (error) {
            console.error('Error loading comments:', error);
            
            if (this.commentsList) {
                this.commentsList.innerHTML = `
                    <li class="p-4 text-center">
                        <p class="text-red-500">Failed to load comments. Please try refreshing the page.</p>
                    </li>
                `;
            }
        }
    }
    
    /**
     * Render comments
     */
    renderComments() {
        if (!this.commentsList) return;
        
        this.commentsList.innerHTML = '';
        
        if (!this.comments || this.comments.length === 0) {
            if (this.noCommentsMessage) {
                this.noCommentsMessage.classList.remove('hidden');
            }
            return;
        }
        
        if (this.noCommentsMessage) {
            this.noCommentsMessage.classList.add('hidden');
        }
        
        this.comments.forEach(comment => {
            const commentElement = this.createCommentElement(comment);
            this.commentsList.appendChild(commentElement);
        });
    }
    
    /**
     * Create comment element
     * @param {Object} comment - Comment data
     * @returns {HTMLElement} - Comment element
     */
    createCommentElement(comment) {
        const item = document.createElement('li');
        item.className = 'p-4 border-b border-gray-200';
        
        const createdDate = new Date(comment.created_at);
        const dateString = createdDate.toLocaleDateString() + ' at ' + createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Determine if this is the current user's comment
        const isCurrentUser = this.auth && this.auth.getUser && 
                            this.auth.getUser() && 
                            this.auth.getUser().user_id === comment.user_id;
        
        item.innerHTML = `
            <div class="flex space-x-3">
                <div class="flex-shrink-0">
                    <div class="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                        ${comment.username ? comment.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                        <p class="text-sm font-medium text-gray-900">
                            ${comment.username || 'Anonymous'}
                        </p>
                        <div class="text-xs text-gray-500">
                            ${dateString}
                        </div>
                    </div>
                    <div class="mt-1 text-sm text-gray-700">
                        <p>${comment.comment_text}</p>
                    </div>
                    <div class="mt-2 flex space-x-2 text-sm">
                        <button class="reply-btn text-gray-500 hover:text-gray-700" data-comment-id="${comment.comment_id}">
                            <i class="fas fa-reply mr-1"></i> Reply
                        </button>
                        ${isCurrentUser ? `
                            <button class="delete-comment-btn text-red-500 hover:text-red-700" data-comment-id="${comment.comment_id}">
                                <i class="fas fa-trash-alt mr-1"></i> Delete
                            </button>
                        ` : ''}
                        ${comment.replies_count > 0 ? `
                            <button class="view-replies-btn text-indigo-500 hover:text-indigo-700" data-comment-id="${comment.comment_id}">
                                <i class="fas fa-comments mr-1"></i> View ${comment.replies_count} ${comment.replies_count === 1 ? 'reply' : 'replies'}
                            </button>
                        ` : ''}
                    </div>
                    <div class="replies-container mt-3 pl-6 border-l-2 border-gray-200 hidden" data-parent-id="${comment.comment_id}"></div>
                    <div class="reply-form-container mt-3 pl-6 border-l-2 border-gray-200 hidden" data-parent-id="${comment.comment_id}">
                        <form class="reply-form space-y-2">
                            <textarea class="reply-text shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" rows="2" placeholder="Write a reply..."></textarea>
                            <div class="flex justify-end space-x-2">
                                <button type="button" class="cancel-reply-btn inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Cancel
                                </button>
                                <button type="submit" class="submit-reply-btn inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Reply
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners to buttons
        setTimeout(() => {
            // Reply button
            const replyBtn = item.querySelector('.reply-btn');
            if (replyBtn) {
                replyBtn.addEventListener('click', () => {
                    this.showReplyForm(comment.comment_id);
                });
            }
            
            // Delete button
            const deleteBtn = item.querySelector('.delete-comment-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    this.deleteComment(comment.comment_id);
                });
            }
            
            // View replies button
            const viewRepliesBtn = item.querySelector('.view-replies-btn');
            if (viewRepliesBtn) {
                viewRepliesBtn.addEventListener('click', () => {
                    this.loadReplies(comment.comment_id);
                });
            }
            
            // Reply form
            const replyForm = item.querySelector('.reply-form');
            if (replyForm) {
                replyForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const replyText = item.querySelector('.reply-text').value;
                    this.submitReply(comment.comment_id, replyText);
                });
            }
            
            // Cancel reply button
            const cancelReplyBtn = item.querySelector('.cancel-reply-btn');
            if (cancelReplyBtn) {
                cancelReplyBtn.addEventListener('click', () => {
                    this.hideReplyForm(comment.comment_id);
                });
            }
        }, 0);
        
        return item;
    }
    
    /**
     * Show reply form for a comment
     * @param {string} commentId - Comment ID
     */
    showReplyForm(commentId) {
        // Only logged in users can reply
        if (!this.auth || !this.auth.isAuthenticated()) {
            window.toast.warning('Please sign in to reply to comments');
            return;
        }
        
        const formContainer = document.querySelector(`.reply-form-container[data-parent-id="${commentId}"]`);
        if (formContainer) {
            formContainer.classList.remove('hidden');
        }
    }
    
    /**
     * Hide reply form for a comment
     * @param {string} commentId - Comment ID
     */
    hideReplyForm(commentId) {
        const formContainer = document.querySelector(`.reply-form-container[data-parent-id="${commentId}"]`);
        if (formContainer) {
            formContainer.classList.add('hidden');
            const textarea = formContainer.querySelector('textarea');
            if (textarea) {
                textarea.value = '';
            }
        }
    }
    
    /**
     * Load replies for a comment
     * @param {string} commentId - Comment ID
     */
    async loadReplies(commentId) {
        console.log(`Loading replies for comment: ${commentId}`);
        
        try {
            const repliesContainer = document.querySelector(`.replies-container[data-parent-id="${commentId}"]`);
            if (!repliesContainer) return;
            
            // Toggle visibility
            if (!repliesContainer.classList.contains('hidden')) {
                repliesContainer.classList.add('hidden');
                return;
            }
            
            // Show loading
            repliesContainer.classList.remove('hidden');
            repliesContainer.innerHTML = '<div class="p-2 flex items-center"><div class="animate-spin h-4 w-4 text-indigo-600 mr-2"></div> Loading replies...</div>';
            
            // Fetch replies
            const replies = await this.api.getCommentReplies(commentId, 'quiz');
            console.log(`Loaded ${replies.length} replies`);
            
            // Render replies
            repliesContainer.innerHTML = '';
            
            if (replies.length === 0) {
                repliesContainer.innerHTML = '<p class="text-sm text-gray-500 p-2">No replies yet</p>';
                return;
            }
            
            replies.forEach(reply => {
                const replyElement = document.createElement('div');
                replyElement.className = 'py-2';
                
                const createdDate = new Date(reply.created_at);
                const dateString = createdDate.toLocaleDateString() + ' at ' + createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                // Determine if this is the current user's reply
                const isCurrentUser = this.auth && this.auth.getUser && 
                                    this.auth.getUser() && 
                                    this.auth.getUser().user_id === reply.user_id;
                
                replyElement.innerHTML = `
                    <div class="flex space-x-3">
                        <div class="flex-shrink-0">
                            <div class="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-xs">
                                ${reply.username ? reply.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between">
                                <p class="text-sm font-medium text-gray-900">
                                    ${reply.username || 'Anonymous'}
                                </p>
                                <div class="text-xs text-gray-500">
                                    ${dateString}
                                </div>
                            </div>
                            <div class="mt-1 text-sm text-gray-700">
                                <p>${reply.comment_text}</p>
                            </div>
                            ${isCurrentUser ? `
                                <div class="mt-1">
                                    <button class="delete-reply-btn text-xs text-red-500 hover:text-red-700" data-reply-id="${reply.comment_id}">
                                        <i class="fas fa-trash-alt mr-1"></i> Delete
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
                
                // Add event listener to delete button
                setTimeout(() => {
                    const deleteBtn = replyElement.querySelector('.delete-reply-btn');
                    if (deleteBtn) {
                        deleteBtn.addEventListener('click', () => {
                            this.deleteComment(reply.comment_id);
                        });
                    }
                }, 0);
                
                repliesContainer.appendChild(replyElement);
            });
        } catch (error) {
            console.error('Error loading replies:', error);
            const repliesContainer = document.querySelector(`.replies-container[data-parent-id="${commentId}"]`);
            if (repliesContainer) {
                repliesContainer.innerHTML = '<p class="text-sm text-red-500 p-2">Failed to load replies</p>';
            }
        }
    }
    
    /**
     * Submit a comment
     */
    async submitComment() {
        if (!this.commentText || !this.submitCommentBtn) return;
        
        const commentText = this.commentText.value.trim();
        if (!commentText) {
            window.toast.error('Please enter a comment');
            return;
        }
        
        // Disable submit button
        this.submitCommentBtn.disabled = true;
        this.submitCommentBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Posting...';
        
        try {
            // Submit comment
            const response = await this.api.addQuizComment(this.quiz.quiz_id, {
                comment_text: commentText
            });
            
            console.log('Comment posted:', response);
            
            // Clear form
            this.commentText.value = '';
            
            // Add the new comment to the list
            this.comments.unshift(response);
            this.renderComments();
            
            // Reset button
            this.submitCommentBtn.disabled = false;
            this.submitCommentBtn.innerHTML = 'Post Comment';
        } catch (error) {
            console.error('Error posting comment:', error);
            window.toast.error('Failed to post comment. Please try again.');
            
            // Reset button
            this.submitCommentBtn.disabled = false;
            this.submitCommentBtn.innerHTML = 'Post Comment';
        }
    }
    
    /**
     * Submit a reply to a comment
     * @param {string} commentId - Parent comment ID
     * @param {string} replyText - Reply text
     */
    async submitReply(commentId, replyText) {
        if (!replyText.trim()) {
            window.toast.error('Please enter a reply');
            return;
        }
        
        const formContainer = document.querySelector(`.reply-form-container[data-parent-id="${commentId}"]`);
        const submitBtn = formContainer?.querySelector('.submit-reply-btn');
        
        // Disable submit button
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Posting...';
        }
        
        try {
            // Submit reply
            const response = await this.api.addQuizComment(this.quiz.quiz_id, {
                comment_text: replyText,
                parent_comment_id: commentId
            });
            
            console.log('Reply posted:', response);
            
            // Hide the reply form
            this.hideReplyForm(commentId);
            
            // Update the replies count in the parent comment
            const parentComment = this.comments.find(c => c.comment_id === parseInt(commentId));
            if (parentComment) {
                parentComment.replies_count = (parentComment.replies_count || 0) + 1;
            }
            
            // Reload the replies
            this.loadReplies(commentId);
            
            // Reset button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Reply';
            }
        } catch (error) {
            console.error('Error posting reply:', error);
            window.toast.error('Failed to post reply. Please try again.');
            
            // Reset button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Reply';
            }
        }
    }
    
    /**
     * Delete a comment or reply
     * @param {string} commentId - Comment ID
     */
    async deleteComment(commentId) {
        // Use a toast with confirm buttons instead of native confirm dialog
        const confirmToast = document.createElement('div');
        confirmToast.className = 'bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg border border-gray-200 dark:border-gray-700';
        confirmToast.innerHTML = `
            <p class="text-gray-800 dark:text-gray-200 mb-3">Are you sure you want to delete this comment?</p>
            <div class="flex space-x-2 justify-end">
                <button id="cancel-delete" class="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
                <button id="confirm-delete" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
            </div>
        `;
        
        // Create custom toast with longer duration
        const toast = window.toast.show('', 'info', { duration: 10000 });
        
        // Replace toast content with our confirm dialog
        const toastContent = toast.querySelector('.flex-1');
        toastContent.innerHTML = '';
        toastContent.appendChild(confirmToast);
        
        // Handle cancel button
        const cancelBtn = confirmToast.querySelector('#cancel-delete');
        cancelBtn.addEventListener('click', () => {
            window.toast.removeToast(toast);
        });
        
        // Handle confirm button
        const confirmBtn = confirmToast.querySelector('#confirm-delete');
        confirmBtn.addEventListener('click', async () => {
            window.toast.removeToast(toast);
            
            try {
                await this.api.deleteComment(commentId, 'quiz');
                console.log(`Comment ${commentId} deleted`);
                
                // If it's a top-level comment, remove it from the list
                const commentIndex = this.comments.findIndex(c => c.comment_id === parseInt(commentId));
                if (commentIndex !== -1) {
                    this.comments.splice(commentIndex, 1);
                    this.renderComments();
                    window.toast.success('Comment deleted successfully');
                } else {
                    // It might be a reply, reload the parent's replies
                    const repliesContainer = document.querySelector(`.replies-container[data-parent-id="${commentId}"]`).closest('.replies-container');
                    if (repliesContainer) {
                        const parentId = repliesContainer.getAttribute('data-parent-id');
                        this.loadReplies(parentId);
                        window.toast.success('Reply deleted successfully');
                    }
                }
            } catch (error) {
                console.error('Error deleting comment:', error);
                window.toast.error('Failed to delete comment. Please try again.');
            }
        });
    }
    
    /**
     * Load ratings and reviews for the quiz
     */
    async loadRatings() {
        console.log('Loading ratings');
        
        try {
            // Show loading indicator
            if (this.reviewsList) {
                this.reviewsList.innerHTML = `
                    <li class="p-4 animate-pulse">
                        <div class="flex space-x-3">
                            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200"></div>
                            <div class="flex-1 space-y-1 py-1">
                                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                                <div class="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    </li>
                `;
            }
            
            // Make an API call to fetch the latest ratings
            const freshRatings = await this.api.getQuizRatings(this.quiz.quiz_id);
            console.log('Fetched ratings from API:', freshRatings);
            
            // Update the ratings in the quiz object
            this.quiz.ratings = freshRatings;
            this.ratings = freshRatings;
            
            // Initialize ratings distribution
            const distribution = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0
            };
            
            // Calculate distribution
            freshRatings.forEach(rating => {
                const score = rating.rating;
                if (score >= 1 && score <= 5) {
                    distribution[score]++;
                }
            });
            
            // Calculate totals
            const totalRatings = freshRatings.length;
            const totalScore = freshRatings.reduce((sum, rating) => sum + rating.rating, 0);
            const averageRating = totalRatings > 0 ? totalScore / totalRatings : 0;
            
            // Update quiz's average rating based on freshly fetched data
            this.quiz.average_rating = averageRating;
            this.quiz.ratings_count = totalRatings;
            
            // Update UI
            this.updateRatingsSummary(averageRating, totalRatings, distribution);
            this.renderReviews(freshRatings);
            
            // Update the quiz header to reflect any rating changes
            this.updateQuizHeader();
            
            // Update auth-dependent UI
            this.updateAuthUI();
        } catch (error) {
            console.error('Error loading ratings:', error);
            
            if (this.reviewsList) {
                this.reviewsList.innerHTML = `
                    <li class="p-4 text-center">
                        <p class="text-red-500">Failed to load ratings. Please try refreshing the page.</p>
                    </li>
                `;
            }
        }
    }
    
    /**
     * Update ratings summary UI
     * @param {number} averageRating - Average rating
     * @param {number} totalRatings - Total number of ratings
     * @param {Object} distribution - Rating distribution
     */
    updateRatingsSummary(averageRating, totalRatings, distribution) {
        if (this.averageRatingValue) {
            this.averageRatingValue.textContent = averageRating.toFixed(1);
        }
        
        if (this.totalRatings) {
            this.totalRatings.textContent = `Based on ${totalRatings} rating${totalRatings !== 1 ? 's' : ''}`;
        }
        
        // Update star bars and counts
        const barElements = [
            { bar: this.fiveStarBar, count: this.fiveStarCount, rating: 5 },
            { bar: this.fourStarBar, count: this.fourStarCount, rating: 4 },
            { bar: this.threeStarBar, count: this.threeStarCount, rating: 3 },
            { bar: this.twoStarBar, count: this.twoStarCount, rating: 2 },
            { bar: this.oneStarBar, count: this.oneStarCount, rating: 1 }
        ];
        
        barElements.forEach(({ bar, count, rating }) => {
            const ratingCount = distribution[rating] || 0;
            const percentage = totalRatings > 0 ? (ratingCount / totalRatings) * 100 : 0;
            
            if (bar) {
                bar.style.width = `${percentage}%`;
            }
            
            if (count) {
                count.textContent = ratingCount.toString();
            }
        });
    }
    
    /**
     * Render reviews
     * @param {Array} ratings - Ratings data
     */
    renderReviews(ratings) {
        if (!this.reviewsList) return;
        
        this.reviewsList.innerHTML = '';
        
        // Filter ratings with comments
        const reviewRatings = ratings.filter(rating => rating.comment && rating.comment.trim());
        
        if (reviewRatings.length === 0) {
            if (this.noReviewsMessage) {
                this.noReviewsMessage.classList.remove('hidden');
            }
            return;
        }
        
        if (this.noReviewsMessage) {
            this.noReviewsMessage.classList.add('hidden');
        }
        
        reviewRatings.forEach(rating => {
            const listItem = document.createElement('li');
            listItem.className = 'p-6 border-b border-gray-200';
            
            const date = new Date(rating.created_at);
            const dateStr = date.toLocaleDateString();
            
            // Generate stars HTML
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= rating.rating) {
                    starsHtml += '<i class="fas fa-star"></i>';
                } else {
                    starsHtml += '<i class="far fa-star"></i>';
                }
            }
            
            listItem.innerHTML = `
                <div class="mb-3 flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium mr-3">
                            ${rating.username ? rating.username.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <div class="text-sm font-medium text-gray-900">${rating.username || 'Anonymous'}</div>
                            <div class="text-xs text-gray-500">Rated on ${dateStr}</div>
                        </div>
                    </div>
                    <div class="flex text-yellow-400">
                        ${starsHtml}
                    </div>
                </div>
                <p class="text-gray-700">${rating.comment}</p>
            `;
            
            this.reviewsList.appendChild(listItem);
        });
    }
    
    /**
     * Show rating form
     */
    showRatingForm() {
        if (this.ratingFormContainer) {
            this.ratingFormContainer.classList.remove('hidden');
        }
        
        if (this.showRatingFormBtn) {
            this.showRatingFormBtn.classList.add('hidden');
        }
    }
    
    /**
     * Hide rating form
     */
    hideRatingForm() {
        if (this.ratingFormContainer) {
            this.ratingFormContainer.classList.add('hidden');
        }
        
        if (this.showRatingFormBtn) {
            this.showRatingFormBtn.classList.remove('hidden');
        }
        
        // Reset form
        this.resetRatingForm();
    }
    
    /**
     * Set up drag and drop for file upload
     */
    setupDragDropUpload() {
        const fileDropArea = document.querySelector('#file-content-container .border-dashed');
        const fileInput = document.getElementById('file-content');
        
        if (!fileDropArea || !fileInput) return;
        
        // Add CSS style dynamically for drag-over effect
        if (!document.querySelector('style#drag-drop-styles')) {
            const style = document.createElement('style');
            style.id = 'drag-drop-styles';
            style.textContent = `
                .drag-over {
                    border-color: #6366f1 !important; /* indigo-500 */
                    background-color: rgba(99, 102, 241, 0.1) !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            fileDropArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            fileDropArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            fileDropArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight(e) {
            preventDefaults(e);
            fileDropArea.classList.add('drag-over');
        }
        
        function unhighlight(e) {
            preventDefaults(e);
            fileDropArea.classList.remove('drag-over');
        }
        
        // Handle dropped files
        fileDropArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            preventDefaults(e);
            
            const files = e.dataTransfer.files;
            
            if (files.length > 0) {
                // Store the dropped file for form submission
                fileDropArea._droppedFile = files[0];
                
                // Update file name display
                const fileNameDisplay = fileDropArea.querySelector('.text-xs.text-gray-500');
                if (fileNameDisplay) {
                    fileNameDisplay.textContent = `Selected: ${files[0].name}`;
                }
                
                console.log('File dropped successfully: ', files[0].name);
            }
        }
    }

    /**
     * Reset rating form
     */
    resetRatingForm() {
        this.selectedRating = 0;
        
        if (this.stars) {
            this.stars.forEach(star => {
                star.classList.remove('text-yellow-400');
                star.classList.add('text-gray-300');
            });
        }
        
        if (this.ratingComment) {
            this.ratingComment.value = '';
        }
        
        if (this.submitRatingBtn) {
            this.submitRatingBtn.disabled = true;
        }
    }
    
    /**
     * Select a rating
     * @param {number} rating - Rating value
     */
    selectRating(rating) {
        this.selectedRating = rating;
        
        if (this.stars) {
            this.stars.forEach(star => {
                const starRating = parseInt(star.dataset.rating);
                if (starRating <= rating) {
                    star.classList.remove('text-gray-300');
                    star.classList.add('text-yellow-400');
                } else {
                    star.classList.remove('text-yellow-400');
                    star.classList.add('text-gray-300');
                }
            });
        }
        
        if (this.submitRatingBtn) {
            this.submitRatingBtn.disabled = false;
        }
    }
    
    /**
     * Hover effect for rating stars
     * @param {number} rating - Rating value
     */
    hoverRating(rating) {
        if (this.stars) {
            this.stars.forEach(star => {
                const starRating = parseInt(star.dataset.rating);
                if (starRating <= rating) {
                    star.classList.add('text-yellow-500');
                } else {
                    star.classList.remove('text-yellow-500');
                }
            });
        }
    }
    
    /**
     * Reset hover effect for rating stars
     */
    resetStarsHover() {
        if (this.stars) {
            this.stars.forEach(star => {
                star.classList.remove('text-yellow-500');
            });
        }
    }
    
    /**
     * Submit rating
     */
    async submitRating() {
        if (this.selectedRating === 0) {
            window.toast.warning('Please select a rating by clicking on the stars');
            return;
        }
        
        // Get comment if any
        const comment = this.ratingComment ? this.ratingComment.value.trim() : '';
        
        // Disable submit button
        if (this.submitRatingBtn) {
            this.submitRatingBtn.disabled = true;
            this.submitRatingBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';
        }
        
        try {
            // Submit rating
            const response = await this.api.rateQuiz(this.quiz.quiz_id, this.selectedRating, comment);
            console.log('Rating submitted:', response);
            
            // Hide form
            this.hideRatingForm();
            
            // Reload ratings tab
            await this.loadRatings();
            
            // Show success message
            window.toast.success('Thank you for your rating!');
        } catch (error) {
            console.error('Error submitting rating:', error);
            window.toast.error('Failed to submit rating. Please try again.');
            
            // Reset button
            if (this.submitRatingBtn) {
                this.submitRatingBtn.disabled = false;
                this.submitRatingBtn.innerHTML = 'Submit Rating';
            }
        }
    }
    
    /**
     * Update UI elements based on authentication status
     */
    updateAuthUI() {
        const isLoggedIn = this.auth && this.auth.isAuthenticated();
        
        // Show/hide user-only and guest-only elements
        document.querySelectorAll('.user-only').forEach(el => {
            el.classList.toggle('hidden', !isLoggedIn);
        });
        
        document.querySelectorAll('.guest-only').forEach(el => {
            el.classList.toggle('hidden', isLoggedIn);
        });
        
        // Specific to comments section
        if (this.commentFormContainer && this.guestCommentMessage) {
            this.commentFormContainer.classList.toggle('hidden', !isLoggedIn);
            this.guestCommentMessage.classList.toggle('hidden', isLoggedIn);
        }
    }
    
    /**
     * Start the quiz with default options
     */
    startQuiz() {
        console.log('Starting quiz with default options');
        window.location.href = `quiz.html?id=${this.quiz.quiz_id}`;
    }
    
    /**
     * Start the quiz with selected options
     */
    startQuizWithOptions() {
        console.log('Starting quiz with custom options');
        
        // Get question count
        let questionCount = 'all';
        if (this.questionCountSelect) {
            questionCount = this.questionCountSelect.value;
        }
        
        // Get timer option
        let timerOption = 'default';
        let customMinutes = 0;
        
        if (this.timerNone && this.timerNone.checked) {
            timerOption = 'none';
        } else if (this.timerCustom && this.timerCustom.checked && this.customMinutes) {
            timerOption = 'custom';
            customMinutes = parseInt(this.customMinutes.value) || 5;
        }
        
        // Construct URL with parameters
        let url = `quiz.html?id=${this.quiz.quiz_id}`;
        
        if (questionCount !== 'all') {
            url += `&count=${questionCount}`;
        }
        
        if (timerOption !== 'default') {
            url += `&timer=${timerOption}`;
            if (timerOption === 'custom') {
                url += `&minutes=${customMinutes}`;
            }
        }
        
        // Navigate to quiz
        window.location.href = url;
    }
    
    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        console.error('Quiz Overview error:', message);
        window.toast.error(message);
    }
    
}

// Initialize Quiz Overview Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Quiz Overview Manager');
    window.quizOverview = new QuizOverviewManager();
});