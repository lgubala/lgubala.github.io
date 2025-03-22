/**
 * Bundle Page Manager
 * Handles quiz bundle viewing, materials, and discussions
 */
class BundlePageManager {
    constructor() {
        console.log('Bundle Page Manager initializing...');
        this.api = window.api;
        this.auth = window.auth;
        
        // Bundle data
        this.bundle = null;
        this.materials = [];
        this.comments = [];
        
        // Current tab
        this.currentTab = 'quizzes';
        
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
        this.bundleHeader = document.getElementById('bundle-header');
        this.tabsContainer = document.getElementById('tabs-container');
        
        // Header elements
        this.bundleTitle = document.getElementById('bundle-title');
        this.bundleDescription = document.getElementById('bundle-description');
        this.bundleCategory = document.getElementById('bundle-category');
        this.bundleDifficulty = document.getElementById('bundle-difficulty');
        this.bundleCreator = document.getElementById('bundle-creator');
        this.bundleDate = document.getElementById('bundle-date');
        this.bundleViews = document.getElementById('bundle-views');
        this.bundleRating = document.getElementById('bundle-rating');
        this.startBundleBtn = document.getElementById('start-bundle-btn');
        
        // Tab buttons
        this.quizzesTab = document.getElementById('quizzes-tab');
        this.materialsTab = document.getElementById('materials-tab');
        this.discussionsTab = document.getElementById('discussions-tab');
        
        // Tab content containers
        this.quizzesTabContent = document.getElementById('quizzes-tab-content');
        this.materialsTabContent = document.getElementById('materials-tab-content');
        this.discussionsTabContent = document.getElementById('discussions-tab-content');
        
        // Quizzes container
        this.bundleQuizzesContainer = document.getElementById('bundle-quizzes-container');
        
        // Learning materials elements
        this.learningMaterialsList = document.getElementById('learning-materials-list');
        this.addMaterialBtn = document.getElementById('add-material-btn');
        
        // Add material modal
        this.addMaterialModal = document.getElementById('add-material-modal');
        this.materialTypeSelect = document.getElementById('material-type');
        this.textContentContainer = document.getElementById('text-content-container');
        this.linkContentContainer = document.getElementById('link-content-container');
        this.fileContentContainer = document.getElementById('file-content-container');
        this.submitMaterialBtn = document.getElementById('submit-material-btn');
        this.cancelMaterialBtn = document.getElementById('cancel-material-btn');
        
        // Comments elements
        this.commentForm = document.getElementById('comment-form');
        this.commentText = document.getElementById('comment-text');
        this.submitCommentBtn = document.getElementById('submit-comment-btn');
        this.commentsList = document.getElementById('comments-list');
        this.guestCommentMessage = document.getElementById('guest-comment-message');
    }
    
    /**
     * Initialize the page
     */
    async init() {
        console.log('Bundle page initializing...');
        
        // Get bundle ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const bundleId = urlParams.get('id');
        
        if (!bundleId) {
            this.showError('Bundle ID is missing. Redirecting to home page.');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }
        
        // Attach event listeners
        this.attachEventListeners();
        
        try {
            // Load bundle data
            await this.loadBundle(bundleId);
            
            // Load initial tab content
            await this.loadQuizzes();
            
            // Show main content
            this.showContent();
        } catch (error) {
            console.error('Error initializing bundle page:', error);
            this.showError('Failed to load bundle. Please try again later.');
        }
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Tab buttons
        if (this.quizzesTab) {
            this.quizzesTab.addEventListener('click', () => this.switchTab('quizzes'));
        }
        
        if (this.materialsTab) {
            this.materialsTab.addEventListener('click', () => this.switchTab('materials'));
        }
        
        if (this.discussionsTab) {
            this.discussionsTab.addEventListener('click', () => this.switchTab('discussions'));
        }
        
        // Start bundle button
        if (this.startBundleBtn) {
            this.startBundleBtn.addEventListener('click', () => {
                // Redirect to the first quiz in the bundle
                if (this.bundle && this.bundle.quizzes && this.bundle.quizzes.length > 0) {
                    const firstQuiz = this.bundle.quizzes[0];
                    window.location.href = `quiz.html?id=${firstQuiz.quiz_id}`;
                }
            });
        }
        
        // Add material button
        if (this.addMaterialBtn) {
            this.addMaterialBtn.addEventListener('click', () => {
                this.showAddMaterialModal();
            });
        }
        
        // Material type select
        if (this.materialTypeSelect) {
            this.materialTypeSelect.addEventListener('change', () => {
                this.updateMaterialTypeUI();
            });
        }
        
        // Add material modal buttons
        if (this.submitMaterialBtn) {
            this.submitMaterialBtn.addEventListener('click', () => {
                this.submitMaterial();
            });
        }
        
        if (this.cancelMaterialBtn) {
            this.cancelMaterialBtn.addEventListener('click', () => {
                this.hideAddMaterialModal();
            });
        }
        
        // Comment form
        if (this.commentForm) {
            this.commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitComment();
            });
        }
    }
    
    /**
     * Load bundle data
     * @param {string} bundleId - Bundle ID
     */
    async loadBundle(bundleId) {
        console.log(`Loading bundle: ${bundleId}`);
        
        try {
            this.bundle = await this.api.getBundle(bundleId);
            console.log('Bundle data loaded:', this.bundle);
            
            // Update header
            this.updateBundleHeader();
            
            // Check if user is logged in and show/hide appropriate elements
            this.updateAuthUI();
            
            return this.bundle;
        } catch (error) {
            console.error('Error loading bundle:', error);
            throw new Error('Failed to load bundle data');
        }
    }
    
    /**
     * Update bundle header with data
     */
    updateBundleHeader() {
        if (!this.bundle) return;
        
        // Set title and description
        if (this.bundleTitle) this.bundleTitle.textContent = this.bundle.title;
        if (this.bundleDescription) this.bundleDescription.textContent = this.bundle.description || 'No description available';
        
        // Set category
        if (this.bundleCategory) {
            const category = this.bundle.category_name || 'Uncategorized';
            const subcategory = this.bundle.subcategory_name ? ` > ${this.bundle.subcategory_name}` : '';
            this.bundleCategory.innerHTML = `
                <i class="fas fa-folder mr-1"></i>
                <span>${category}${subcategory}</span>
            `;
        }
        
        // Set difficulty
        if (this.bundleDifficulty) {
            let difficultyLabel, difficultyClass;
            switch (this.bundle.difficulty_level) {
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
            
            this.bundleDifficulty.className = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyClass}`;
            this.bundleDifficulty.innerHTML = `
                <i class="fas fa-signal mr-1"></i>
                <span>${difficultyLabel}</span>
            `;
        }
        
        // Set creator
        if (this.bundleCreator) {
            this.bundleCreator.textContent = this.bundle.creator_username || 'Anonymous';
        }
        
        // Set date
        if (this.bundleDate) {
            const date = new Date(this.bundle.created_at);
            this.bundleDate.textContent = date.toLocaleDateString();
        }
        
        // Set views
        if (this.bundleViews) {
            this.bundleViews.textContent = `${this.bundle.view_count || 0} views`;
        }
        
        // Set rating
        if (this.bundleRating) {
            const rating = parseFloat(this.bundle.average_rating) || 0;
            const formattedRating = rating.toFixed(1);
            const ratingsCount = this.bundle.ratings_count || 0;
            
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
            
            this.bundleRating.innerHTML = `
                <div class="flex text-yellow-400">
                    ${starsHtml}
                </div>
                <span class="ml-1 text-gray-600">${formattedRating} (${ratingsCount} ratings)</span>
            `;
        }
    }
    
    /**
     * Update UI elements based on authentication status
     */
    updateAuthUI() {
        const isLoggedIn = this.auth && this.auth.isAuthenticated();
        
        // Manage visibility of user-only and guest-only elements
        document.querySelectorAll('.user-only').forEach(el => {
            el.classList.toggle('hidden', !isLoggedIn);
        });
        
        document.querySelectorAll('.guest-only').forEach(el => {
            el.classList.toggle('hidden', isLoggedIn);
        });
        
        // Specific to comments section
        if (this.commentForm && this.guestCommentMessage) {
            this.commentForm.classList.toggle('hidden', !isLoggedIn);
            this.guestCommentMessage.classList.toggle('hidden', isLoggedIn);
        }
    }
    
    /**
     * Show main content (hide loading indicator)
     */
    showContent() {
        if (this.loadingIndicator) this.loadingIndicator.classList.add('hidden');
        if (this.bundleHeader) this.bundleHeader.classList.remove('hidden');
        if (this.tabsContainer) this.tabsContainer.classList.remove('hidden');
    }
    
    /**
     * Switch tab
     * @param {string} tab - Tab name
     */
    async switchTab(tab) {
        console.log(`Switching to tab: ${tab}`);
        this.currentTab = tab;
        
        // Update tab buttons
        [
            { element: this.quizzesTab, tab: 'quizzes' },
            { element: this.materialsTab, tab: 'materials' },
            { element: this.discussionsTab, tab: 'discussions' }
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
            { element: this.quizzesTabContent, tab: 'quizzes' },
            { element: this.materialsTabContent, tab: 'materials' },
            { element: this.discussionsTabContent, tab: 'discussions' }
        ].forEach(item => {
            if (item.element) {
                if (item.tab === tab) {
                    item.element.classList.remove('hidden');
                } else {
                    item.element.classList.add('hidden');
                }
            }
        });
        
        // Load tab content if needed
        if (tab === 'quizzes') {
            // Quizzes are already loaded with bundle data
        } else if (tab === 'materials') {
            await this.loadMaterials();
        } else if (tab === 'discussions') {
            await this.loadComments();
        }
    }
    
    /**
     * Load quizzes for the bundle
     */
    async loadQuizzes() {
        console.log('Loading quizzes for bundle');
        
        // Clear container
        if (this.bundleQuizzesContainer) {
            this.bundleQuizzesContainer.innerHTML = '';
        }
        
        // If no quizzes or container not found
        if (!this.bundle?.quizzes || !this.bundleQuizzesContainer) {
            this.showEmptyState('quizzes', 'No quizzes found in this bundle');
            return;
        }
        
        // Sort quizzes by sequence order
        const quizzes = [...this.bundle.quizzes].sort((a, b) => a.sequence_order - b.sequence_order);
        
        quizzes.forEach((quiz, index) => {
            const card = document.createElement('div');
            card.className = 'bg-white shadow overflow-hidden sm:rounded-lg mb-4';
            
            // Determine difficulty class and label
            let difficultyClass, difficultyLabel;
            switch (quiz.difficulty_level) {
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
            
            card.innerHTML = `
                <div class="px-4 py-5 sm:px-6 flex justify-between items-start">
                    <div>
                        <div class="flex items-center">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyClass} mr-2">
                                ${difficultyLabel}
                            </span>
                            <span class="text-sm text-gray-500">Step ${index + 1} of ${quizzes.length}</span>
                        </div>
                        <h3 class="mt-2 text-lg font-medium text-gray-900">${quiz.title}</h3>
                        <p class="mt-1 text-sm text-gray-500">${quiz.description || 'No description available'}</p>
                        <div class="mt-3 flex items-center text-sm text-gray-500">
                            <span class="mr-3"><i class="fas fa-question-circle mr-1"></i> ${quiz.questions_count || 0} questions</span>
                        </div>
                    </div>
                    <a href="quiz.html?id=${quiz.quiz_id}" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <i class="fas fa-play mr-2"></i> Start
                    </a>
                </div>
            `;
            
            this.bundleQuizzesContainer.appendChild(card);
        });
    }
    
    /**
     * Show empty state message for a section
     * @param {string} section - Section name (quizzes, materials, comments)
     * @param {string} message - Message to display
     */
    showEmptyState(section, message) {
        let container;
        
        switch (section) {
            case 'quizzes':
                container = this.bundleQuizzesContainer;
                break;
            case 'materials':
                container = this.learningMaterialsList;
                break;
            case 'comments':
                container = this.commentsList;
                break;
            default:
                return;
        }
        
        if (container) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <div class="inline-block p-4 rounded-full bg-gray-100 text-gray-400 mb-4">
                        <i class="fas fa-folder-open text-xl"></i>
                    </div>
                    <p class="text-gray-500">${message}</p>
                </div>
            `;
        }
    }
    
    /**
     * Load learning materials for the bundle
     */
    async loadMaterials() {
        console.log('Loading learning materials for bundle');
        
        try {
            // Clear container
            if (this.learningMaterialsList) {
                this.learningMaterialsList.innerHTML = '<li class="px-4 py-4 flex items-center"><div class="animate-spin h-5 w-5 text-indigo-600 mr-3"></div> Loading materials...</li>';
            }
            
            // Fetch materials
            this.materials = await this.api.getBundleMaterials(this.bundle.bundle_id);
            console.log('Learning materials loaded:', this.materials);
            
            // If no materials or container not found
            if (!this.materials || !this.materials.length || !this.learningMaterialsList) {
                this.showEmptyState('materials', 'No learning materials available for this bundle');
                return;
            }
            
            // Render materials
            this.renderMaterials();
        } catch (error) {
            console.error('Error loading learning materials:', error);
            this.showEmptyState('materials', 'Failed to load learning materials');
        }
    }
    
    /**
     * Render learning materials
     */
    renderMaterials() {
        if (!this.learningMaterialsList) return;
        
        this.learningMaterialsList.innerHTML = '';
        
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
     * Load comments for the bundle
     */
    async loadComments() {
        console.log('Loading comments for bundle');
        
        try {
            // Clear container
            if (this.commentsList) {
                this.commentsList.innerHTML = '<li class="p-4 flex items-center"><div class="animate-spin h-5 w-5 text-indigo-600 mr-3"></div> Loading comments...</li>';
            }
            
            // Fetch comments
            this.comments = await this.api.getBundleComments(this.bundle.bundle_id);
            console.log('Comments loaded:', this.comments);
            
            // If no comments or container not found
            if (!this.comments || !this.comments.length || !this.commentsList) {
                this.showEmptyState('comments', 'No comments yet. Be the first to start a discussion!');
                return;
            }
            
            // Render comments
            this.renderComments();
        } catch (error) {
            console.error('Error loading comments:', error);
            this.showEmptyState('comments', 'Failed to load comments');
        }
    }
    
    /**
     * Render comments
     */
    renderComments() {
        if (!this.commentsList) return;
        
        this.commentsList.innerHTML = '';
        
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
        
        // Add event listeners to the buttons
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
            alert('Please sign in to reply to comments');
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
            const replies = await this.api.getCommentReplies(commentId, 'bundle');
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
            alert('Please enter a comment');
            return;
        }
        
        // Disable submit button
        this.submitCommentBtn.disabled = true;
        this.submitCommentBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Posting...';
        
        try {
            // Submit comment
            const response = await this.api.addBundleComment(this.bundle.bundle_id, {
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
            alert('Failed to post comment. Please try again.');
            
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
            alert('Please enter a reply');
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
            const response = await this.api.addBundleComment(this.bundle.bundle_id, {
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
            alert('Failed to post reply. Please try again.');
            
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
        if (!confirm('Are you sure you want to delete this comment?')) {
            return;
        }
        
        try {
            await this.api.deleteComment(commentId, 'bundle');
            console.log(`Comment ${commentId} deleted`);
            
            // If it's a top-level comment, remove it from the list
            const commentIndex = this.comments.findIndex(c => c.comment_id === parseInt(commentId));
            if (commentIndex !== -1) {
                this.comments.splice(commentIndex, 1);
                this.renderComments();
            } else {
                // It might be a reply, reload the parent's replies
                const repliesContainer = document.querySelector(`.replies-container[data-parent-id="${commentId}"]`).closest('.replies-container');
                if (repliesContainer) {
                    const parentId = repliesContainer.getAttribute('data-parent-id');
                    this.loadReplies(parentId);
                }
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment. Please try again.');
        }
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
            alert('Please enter a title');
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
                    alert('Please enter content');
                    return;
                }
                
                // Submit text material
                response = await this.api.addBundleMaterial(this.bundle.bundle_id, {
                    title,
                    description,
                    content_type: 'text',
                    content
                });
            } else if (materialType === 'link') {
                const content = document.getElementById('link-content')?.value;
                if (!content) {
                    alert('Please enter a URL');
                    return;
                }
                
                // Add https:// if not present
                let url = content;
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                }
                
                // Submit link material
                response = await this.api.addBundleMaterial(this.bundle.bundle_id, {
                    title,
                    description,
                    content_type: 'link',
                    content: url
                });
            } else if (materialType === 'file') {
                const fileInput = document.getElementById('file-content');
                if (!fileInput || !fileInput.files || !fileInput.files[0]) {
                    alert('Please select a file');
                    return;
                }
                
                // Create FormData
                const formData = new FormData();
                formData.append('file', fileInput.files[0]);
                formData.append('title', title);
                formData.append('description', description || '');
                formData.append('content_type', 'file');
                
                // Submit file material
                response = await this.api.uploadMaterial(this.bundle.bundle_id, formData, 'bundle');
            }
            
            console.log('Material added:', response);
            
            // Hide modal
            this.hideAddMaterialModal();
            
            // Reload materials
            await this.loadMaterials();
            
            // Show success message
            alert('Learning material added successfully');
        } catch (error) {
            console.error('Error adding material:', error);
            alert('Failed to add material. Please try again.');
        } finally {
            // Reset button
            if (this.submitMaterialBtn) {
                this.submitMaterialBtn.disabled = false;
                this.submitMaterialBtn.innerHTML = 'Add Material';
            }
        }
    }
    
    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        console.error('Bundle error:', message);
        alert(message);
    }
}

// Initialize Bundle Page Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Bundle Page Manager');
    window.bundlePage = new BundlePageManager();
});