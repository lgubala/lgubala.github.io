/**
 * Edit Quiz Page Manager
 * Handles quiz editing functionality including loading quiz data, 
 * updating quiz details, and managing questions.
 */
class EditQuizManager {
    constructor() {
        console.log('Edit Quiz Manager initializing...');
        this.api = window.api;
        
        // Initialize state
        this.quizId = null;
        this.quizData = null;
        this.questions = [];
        this.categories = [];
        this.subcategories = [];
        this.currentQuestionIndex = -1;
        this.isNewQuestion = true;
        this.hasUnsavedChanges = false;
        this.originalQuizData = null;
        this.originalQuestions = [];
        
        // Initialize DOM references
        this.initDomReferences();
        
        // Initialize the page
        this.init();
    }
    
    /**
     * Initialize DOM references
     */
    initDomReferences() {
        // Main containers
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.editQuizForm = document.getElementById('edit-quiz-form');
        this.errorMessage = document.getElementById('error-message');
        this.errorText = document.getElementById('error-text');
        
        // Quiz form elements
        this.quizTitle = document.getElementById('quiz-title');
        this.quizDescription = document.getElementById('quiz-description');
        this.quizCategory = document.getElementById('quiz-category');
        this.quizSubcategory = document.getElementById('quiz-subcategory');
        this.quizDifficulty = document.getElementById('quiz-difficulty');
        this.quizTimeLimit = document.getElementById('quiz-time-limit');
        this.quizIsPublic = document.getElementById('quiz-is-public');
        
        // Questions elements
        this.questionsContainer = document.getElementById('questions-container');
        this.noQuestionsMessage = document.getElementById('no-questions-message');
        this.addQuestionBtn = document.getElementById('add-question-btn');
        this.saveQuizBtn = document.getElementById('save-quiz-btn');
        
        // Question modal elements
        this.questionModal = document.getElementById('question-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.questionText = document.getElementById('question-text');
        this.questionType = document.getElementById('question-type');
        this.questionPoints = document.getElementById('question-points');
        this.questionExplanation = document.getElementById('question-explanation');
        
        // Multiple choice elements
        this.multipleChoiceContainer = document.getElementById('multiple-choice-container');
        this.answersContainer = document.getElementById('answers-container');
        this.addAnswerBtn = document.getElementById('add-answer-btn');
        
        // True/False elements
        this.trueFalseContainer = document.getElementById('true-false-container');
        this.trueOption = document.getElementById('true-option');
        this.falseOption = document.getElementById('false-option');
        
        // Short answer elements
        this.shortAnswerContainer = document.getElementById('short-answer-container');
        this.correctAnswer = document.getElementById('correct-answer');
        this.alternativeAnswers = document.getElementById('alternative-answers');
        
        // Modal buttons
        this.saveQuestionBtn = document.getElementById('save-question-btn');
        this.cancelQuestionBtn = document.getElementById('cancel-question-btn');
        
        // Delete question modal
        this.deleteQuestionModal = document.getElementById('delete-question-modal');
        this.confirmDeleteQuestionBtn = document.getElementById('confirm-delete-question-btn');
        this.cancelDeleteQuestionBtn = document.getElementById('cancel-delete-question-btn');

        //references 
        this.referencesContainer = document.getElementById('references-container');
        this.addReferenceBtn = document.getElementById('add-reference-btn');
    }
    
    /**
     * Initialize the page
     */
    async init() {
        try {

            this.disableBeforeUnloadCheck = false;

            // Get quiz ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            this.quizId = urlParams.get('id');
            
            if (!this.quizId) {
                this.showError('No quiz ID provided. Please go back to My Quizzes and select a quiz to edit.');
                return;
            }
            
            // Check if user is authenticated
            if (window.auth && window.auth.waitForAuthReady) {
                await window.auth.waitForAuthReady();
            } else {
                console.warn('Auth ready function not available, proceeding without waiting');
            }
            
            // Load categories
            await this.loadCategories();
            
            // Load quiz data
            await this.loadQuizData();
            
            // Load quiz questions
            await this.loadQuizQuestions();

            this.saveOriginalState();
            
            // Set up event listeners
            this.setupEventListeners();
            
            console.log('Edit Quiz page initialization complete');
        } catch (error) {
            console.error('Error initializing edit quiz page:', error);
            this.showError('An error occurred while loading the quiz. Please try again later.');
        }
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Quiz category change
        if (this.quizCategory) {
            this.quizCategory.addEventListener('change', () => {
                this.loadSubcategories(this.quizCategory.value);
                this.markUnsavedChanges();
            });
        }

        // Quiz form input changes
        if (this.quizTitle) {
            this.quizTitle.addEventListener('input', () => this.markUnsavedChanges());
        }
        if (this.quizDescription) {
            this.quizDescription.addEventListener('input', () => this.markUnsavedChanges());
        }
        if (this.quizSubcategory) {
            this.quizSubcategory.addEventListener('change', () => this.markUnsavedChanges());
        }
        if (this.quizDifficulty) {
            this.quizDifficulty.addEventListener('change', () => this.markUnsavedChanges());
        }
        if (this.quizTimeLimit) {
            this.quizTimeLimit.addEventListener('input', () => this.markUnsavedChanges());
        }
        if (this.quizIsPublic) {
            this.quizIsPublic.addEventListener('change', () => this.markUnsavedChanges());
        }
                
        // Add question button
        if (this.addQuestionBtn) {
            this.addQuestionBtn.addEventListener('click', () => {
                this.openAddQuestionModal();
            });
        }

        // Add reference button
        if (this.addReferenceBtn) {
            this.addReferenceBtn.addEventListener('click', () => {
                this.addReferenceOption();
            });
        }
        
        // Question type change
        if (this.questionType) {
            this.questionType.addEventListener('change', () => {
                this.toggleQuestionTypeFields();
            });
        }
        
        // Add answer option button
        if (this.addAnswerBtn) {
            this.addAnswerBtn.addEventListener('click', () => {
                this.addAnswerOption();
            });
        }
        
        // Save question button
        if (this.saveQuestionBtn) {
            this.saveQuestionBtn.addEventListener('click', () => {
                this.saveQuestion();
            });
        }
        
        // Cancel question button
        if (this.cancelQuestionBtn) {
            this.cancelQuestionBtn.addEventListener('click', () => {
                this.closeQuestionModal();
            });
        }
        
        // Save quiz button
        if (this.saveQuizBtn) {
            this.saveQuizBtn.addEventListener('click', () => {
                this.saveQuiz();
            });
        }
        
        // Delete question confirmation
        if (this.confirmDeleteQuestionBtn) {
            this.confirmDeleteQuestionBtn.addEventListener('click', () => {
                this.deleteQuestion();
            });
        }
        
        // Cancel delete question
        if (this.cancelDeleteQuestionBtn) {
            this.cancelDeleteQuestionBtn.addEventListener('click', () => {
                this.closeDeleteQuestionModal();
            });
        }

        // Set up navigation event listeners for handling unsaved changes
        this.setupNavigationListeners();
    }
    
    /**
     * Load categories from API
     */
    async loadCategories() {
        try {
            console.log('Fetching categories');
            const response = await this.api.getCategories();
            this.categories = response || [];
            
            // Populate categories dropdown
            if (this.quizCategory) {
                this.quizCategory.innerHTML = '<option value="">Select a category</option>';
                
                if (this.categories && this.categories.length > 0) {
                    this.categories.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category.category_id;
                        option.textContent = category.name;
                        this.quizCategory.appendChild(option);
                    });
                    console.log(`Loaded ${this.categories.length} categories`);
                } else {
                    console.warn('No categories returned from API');
                }
            } else {
                console.warn('Category select element not found');
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            if (window.toast) {
                window.toast.error('Failed to load categories');
            }
        }
    }
    
    /**
     * Load subcategories for a specific category
     * @param {string|number} categoryId - Category ID
     */
    async loadSubcategories(categoryId) {
        if (!categoryId) {
            // Clear subcategories dropdown
            if (this.quizSubcategory) {
                this.quizSubcategory.innerHTML = '<option value="">Select a subcategory</option>';
                this.quizSubcategory.disabled = true;
            }
            return;
        }
        
        try {
            const response = await this.api.getSubcategories(categoryId);
            // The API returns the subcategories directly, not nested in a 'subcategories' property
            this.subcategories = response || [];
            
            // Populate subcategories dropdown
            if (this.quizSubcategory) {
                this.quizSubcategory.innerHTML = '<option value="">Select a subcategory</option>';
                this.quizSubcategory.disabled = false;
                
                this.subcategories.forEach(subcategory => {
                    const option = document.createElement('option');
                    option.value = subcategory.subcategory_id;
                    option.textContent = subcategory.name;
                    this.quizSubcategory.appendChild(option);
                });
            }
            
            console.log(`Loaded ${this.subcategories.length} subcategories for category ${categoryId}`);
        } catch (error) {
            console.error(`Error loading subcategories for category ${categoryId}:`, error);
            // Clear subcategories dropdown on error
            if (this.quizSubcategory) {
                this.quizSubcategory.innerHTML = '<option value="">Error loading subcategories</option>';
                this.quizSubcategory.disabled = true;
            }
        }
    }
    
    /**
     * Load quiz data from API
     */
    async loadQuizData() {
        try {
            console.log(`Loading quiz data for quiz ID: ${this.quizId}`);
            const quiz = await this.api.getQuiz(this.quizId);
            this.quizData = quiz;
            
            // Populate form fields
            this.populateQuizForm();
            
            // Load subcategories for the selected category
            if (quiz.category_id) {
                // First set the category
                if (this.quizCategory) {
                    this.quizCategory.value = quiz.category_id;
                }
                
                // Then load subcategories
                await this.loadSubcategories(quiz.category_id);
                
                // Now we can set the subcategory value since subcategories are loaded
                if (quiz.subcategory_id && this.quizSubcategory) {
                    this.quizSubcategory.value = quiz.subcategory_id;
                }
            }
            
            // Show edit form
            this.hideLoading();
            this.showEditForm();
            
            console.log('Quiz data loaded successfully');
        } catch (error) {
            console.error('Error loading quiz data:', error);
            this.hideLoading();
            this.showError('Failed to load quiz data. Please try again later.');
            throw error;
        }
    }
    
    /**
     * Load quiz questions from API
     */
    async loadQuizQuestions() {
        try {
            console.log(`Loading questions for quiz ID: ${this.quizId}`);
            const questions = await this.api.getQuizQuestions(this.quizId);
            this.questions = questions || [];
            
            // Render questions
            this.renderQuestions();
            
            console.log(`Loaded ${this.questions.length} questions`);
        } catch (error) {
            console.error('Error loading quiz questions:', error);
            this.showError('Failed to load quiz questions. You can still edit quiz details.');
        }
    }
    
    /**
     * Populate quiz form with data
     */
    populateQuizForm() {
        if (!this.quizData) return;
        
        if (this.quizTitle) {
            this.quizTitle.value = this.quizData.title || '';
        }
        
        if (this.quizDescription) {
            this.quizDescription.value = this.quizData.description || '';
        }
        
        if (this.quizCategory && this.quizData.category_id) {
            this.quizCategory.value = this.quizData.category_id;
        }
        
        if (this.quizDifficulty) {
            this.quizDifficulty.value = this.quizData.difficulty_level || '2';
        }
        
        if (this.quizTimeLimit) {
            this.quizTimeLimit.value = this.quizData.time_limit || '0';
        }
        
        if (this.quizIsPublic) {
            this.quizIsPublic.checked = this.quizData.is_public || false;
        }
        
        console.log('Quiz form populated with data');
    }
    

    


    /**
     * Render questions in the questions container
     */
    renderQuestions() {
        if (!this.questionsContainer) return;
        
        // Clear container
        this.questionsContainer.innerHTML = '';
        
        if (this.questions.length === 0) {
            // Show no questions message
            if (this.noQuestionsMessage) {
                this.questionsContainer.appendChild(this.noQuestionsMessage);
            }
            return;
        }
        
        // Hide no questions message if it exists
        if (this.noQuestionsMessage && this.noQuestionsMessage.parentNode) {
            this.noQuestionsMessage.parentNode.removeChild(this.noQuestionsMessage);
        }
        
        // Render each question
        this.questions.forEach((question, index) => {
            const questionElement = this.createQuestionElement(question, index);
            this.questionsContainer.appendChild(questionElement);
        });
        
        console.log(`Rendered ${this.questions.length} questions`);
    }
    

    /**
     * Create a question element with enhanced references display
     * @param {Object} question - Question data
     * @param {number} index - Question index
     * @returns {HTMLElement} - Question element
     */
    createQuestionElement(question, index) {
        const questionElement = document.createElement('div');
        questionElement.className = 'p-6 hover:bg-gray-50';
        
        // Format question type for display
        const questionTypeLabels = {
            'multiple_choice': 'Multiple Choice',
            'true_false': 'True/False',
            'short_answer': 'Short Answer'
        };
        
        const typeLabel = questionTypeLabels[question.question_type] || question.question_type;
        
        // Create summary of answers based on question type
        let answersSummary = '';
        
        if (question.question_type === 'multiple_choice' && question.answers) {
            const correctAnswer = question.answers.find(a => a.is_correct);
            const correctText = correctAnswer ? correctAnswer.answer_text : 'No correct answer set';
            answersSummary = `<span class="font-medium">Correct answer:</span> ${correctText}`;
        } else if (question.question_type === 'true_false') {
            answersSummary = `<span class="font-medium">Correct answer:</span> ${question.correct_answer ? 'True' : 'False'}`;
        } else if (question.question_type === 'short_answer') {
            answersSummary = `<span class="font-medium">Correct answer:</span> ${question.correct_answer || 'Not set'}`;
        }

        // Create enhanced references section
        let referencesSummary = '';
        if (question.references && question.references.length > 0) {
            const refCount = question.references.length;
            
            // Group references by type for better display
            const citations = question.references.filter(ref => ref.is_citation);
            const links = question.references.filter(ref => !ref.is_citation);
            
            referencesSummary = `
                <div class="mt-1 text-sm">
                    <p class="text-gray-500 font-medium">References (${refCount}):</p>
                    <div class="pl-2 mt-1">`;
            
            // Display citations
            if (citations.length > 0) {
                referencesSummary += `<div class="mb-1">
                    <p class="text-gray-600 italic text-xs mb-1">Citations:</p>
                    <ul class="list-disc pl-4 text-gray-500">`;
                
                citations.forEach(citation => {
                    referencesSummary += `
                        <li class="mb-1">"${citation.citation_text}"
                            ${citation.source_page ? `<span class="text-xs">(Page ${citation.source_page})</span>` : ''}
                        </li>`;
                });
                referencesSummary += `</ul></div>`;
            }
            
            // Display links with clickable href tags
            if (links.length > 0) {
                referencesSummary += `<div>
                    <p class="text-gray-600 italic text-xs mb-1">External Sources:</p>
                    <ul class="list-disc pl-4 text-gray-500">`;
                
                links.forEach(link => {
                    referencesSummary += `
                        <li class="mb-1">
                            <a href="${link.url}" target="_blank" class="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center">
                                <i class="fas fa-external-link-alt mr-1 text-xs"></i>
                                <span>${link.title || 'Reference link'}</span>
                            </a>
                        </li>`;
                });
                referencesSummary += `</ul></div>`;
            }
            
            referencesSummary += `</div></div>`;
        }
        
        questionElement.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <div class="flex items-center">
                        <h3 class="text-lg font-medium text-gray-900">Question ${index + 1}</h3>
                        <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            ${typeLabel}
                        </span>
                        <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            ${question.points || 1} ${question.points === 1 ? 'point' : 'points'}
                        </span>
                    </div>
                    <p class="mt-2 text-gray-700">${question.question_text}</p>
                    <p class="mt-2 text-sm text-gray-500">${answersSummary}</p>
                    ${question.explanation ? `<p class="mt-1 text-sm text-gray-500"><span class="font-medium">Explanation:</span> ${question.explanation}</p>` : ''}
                    ${referencesSummary}
                </div>
                <div class="ml-4 flex-shrink-0 flex">
                    <button type="button" class="mr-2 inline-flex items-center p-1 border border-transparent rounded-full text-indigo-600 hover:bg-indigo-100 focus:outline-none" data-edit-question="${index}">
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                    <button type="button" class="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none" data-delete-question="${index}">
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners for edit and delete buttons
        const editButton = questionElement.querySelector(`[data-edit-question="${index}"]`);
        if (editButton) {
            editButton.addEventListener('click', () => {
                this.openEditQuestionModal(index);
            });
        }
        
        const deleteButton = questionElement.querySelector(`[data-delete-question="${index}"]`);
        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                this.openDeleteQuestionModal(index);
            });
        }
        
        return questionElement;
    }
    
    /**
     * Open add question modal
     */
    openAddQuestionModal() {
        this.isNewQuestion = true;
        this.currentQuestionIndex = -1;
        this.modalTitle.textContent = 'Add New Question';
        
        // Reset form fields
        this.questionText.value = '';
        this.questionType.value = 'multiple_choice';
        this.questionPoints.value = '1';
        this.questionExplanation.value = '';
        
        // Set up default answers for multiple choice
        this.resetAnswersContainer();
        this.addAnswerOption(); // Add first answer option
        this.addAnswerOption(); // Add second answer option
        
        // Reset true/false options
        this.trueOption.checked = false;
        this.falseOption.checked = false;
        
        // Reset short answer fields
        this.correctAnswer.value = '';
        this.alternativeAnswers.value = '';
        
        // Show appropriate question type fields
        this.toggleQuestionTypeFields();
        
        // Show modal
        this.questionModal.classList.remove('hidden');
    }
    
    /**
     * Open edit question modal
     * @param {number} index - Question index
     */
    openEditQuestionModal(index) {
        if (index < 0 || index >= this.questions.length) return;
        
        this.isNewQuestion = false;
        this.currentQuestionIndex = index;
        this.modalTitle.textContent = `Edit Question ${index + 1}`;
        
        const question = this.questions[index];
        
        // Set form fields
        this.questionText.value = question.question_text || '';
        this.questionType.value = question.question_type || 'multiple_choice';
        this.questionPoints.value = question.points || '1';
        this.questionExplanation.value = question.explanation || '';
        
        // Set up answers based on question type
        if (question.question_type === 'multiple_choice' && question.answers) {
            this.resetAnswersContainer();
            
            if (question.answers.length === 0) {
                // Add default empty answers if none exist
                this.addAnswerOption();
                this.addAnswerOption();
            } else {
                // Add existing answers
                question.answers.forEach(answer => {
                    this.addAnswerOption(answer.answer_text, answer.is_correct);
                });
            }
        } else if (question.question_type === 'true_false') {
            this.resetTrueFalseOptions();
            
            // Set true/false option
            if (question.correct_answer === true) {
                this.trueOption.checked = true;
            } else {
                this.falseOption.checked = true;
            }
        } else if (question.question_type === 'short_answer') {
            // Set short answer fields
            this.correctAnswer.value = question.correct_answer || '';
            this.alternativeAnswers.value = question.alternative_answers || '';
        }
        
        // Set up references with enhanced display for multiple references
        this.resetReferencesContainer();
        if (question.references && question.references.length > 0) {
            // Add references in order - citations first, then links
            const citations = question.references.filter(ref => ref.is_citation);
            const links = question.references.filter(ref => !ref.is_citation);
            
            // Add all citations first
            citations.forEach(ref => this.addReferenceOption(ref));
            
            // Then add all links
            links.forEach(ref => this.addReferenceOption(ref));
            
            // If no references were added, add a default reference
            if (this.referencesContainer.children.length === 0) {
                this.addReferenceOption();
            }
        } else {
            // Add two empty references by default (one citation and one link)
            this.addReferenceOption({is_citation: true, citation_text: ''});
            this.addReferenceOption({is_citation: false, url: '', title: ''});
        }
        
        // Show appropriate question type fields
        this.toggleQuestionTypeFields();
        
        // Show modal
        this.questionModal.classList.remove('hidden');
    }
    

    /**
     * Add new methods to handle references
     */
    resetReferencesContainer() {
        if (this.referencesContainer) {
            this.referencesContainer.innerHTML = '';
        }
    }

    /**
     * Add a reference option to the form with improved link handling
     * @param {Object} reference - Reference data (optional)
     */
    addReferenceOption(reference = null) {
        if (!this.referencesContainer) return;
        
        const isLink = reference ? !reference.is_citation : true;
        const referenceIndex = this.referencesContainer.children.length;
        const referenceId = `reference-${referenceIndex}`;
        
        const referenceDiv = document.createElement('div');
        referenceDiv.className = 'border rounded-md p-3 mb-3';
        referenceDiv.innerHTML = `
            <div class="flex justify-between mb-2">
                <div class="flex items-center">
                    <span class="text-sm font-medium">Reference #${referenceIndex + 1}</span>
                    <span class="ml-1 text-xs text-gray-500">(${referenceIndex === 0 ? 'Primary' : 'Secondary'})</span>
                </div>
                <button type="button" class="remove-reference-btn text-red-600 hover:text-red-800">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="mb-2">
                <div class="flex items-center space-x-4">
                    <div class="flex items-center">
                        <input type="radio" name="reference-type-${referenceIndex}" id="link-type-${referenceIndex}" 
                            class="reference-type h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            data-index="${referenceIndex}" ${isLink ? 'checked' : ''}>
                        <label for="link-type-${referenceIndex}" class="ml-2 block text-sm text-gray-700">External Link</label>
                    </div>
                    <div class="flex items-center">
                        <input type="radio" name="reference-type-${referenceIndex}" id="citation-type-${referenceIndex}" 
                            class="reference-type h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            data-index="${referenceIndex}" ${!isLink ? 'checked' : ''}>
                        <label for="citation-type-${referenceIndex}" class="ml-2 block text-sm text-gray-700">Text Citation</label>
                    </div>
                </div>
            </div>
            
            <!-- Link fields -->
            <div class="link-fields-${referenceIndex} ${isLink ? '' : 'hidden'}">
                <div class="mb-2">
                    <label for="link-url-${referenceIndex}" class="block text-sm font-medium text-gray-700">URL</label>
                    <input type="url" id="link-url-${referenceIndex}" 
                        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value="${isLink && reference && reference.url ? reference.url : ''}">
                    <p class="text-xs text-gray-500 mt-1">Enter a valid URL (e.g., https://example.com)</p>
                </div>
                <div class="mb-2">
                    <label for="link-title-${referenceIndex}" class="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" id="link-title-${referenceIndex}" 
                        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value="${isLink && reference && reference.title ? reference.title : ''}">
                </div>
            </div>
            
            <!-- Citation fields -->
            <div class="citation-fields-${referenceIndex} ${!isLink ? '' : 'hidden'}">
                <div class="mb-2">
                    <label for="citation-text-${referenceIndex}" class="block text-sm font-medium text-gray-700">Citation Text</label>
                    <textarea id="citation-text-${referenceIndex}" rows="2"
                            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">${!isLink && reference && reference.citation_text ? reference.citation_text : ''}</textarea>
                </div>
                <div class="mb-2">
                    <label for="source-page-${referenceIndex}" class="block text-sm font-medium text-gray-700">Source Page (optional)</label>
                    <input type="number" id="source-page-${referenceIndex}" 
                        class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value="${!isLink && reference && reference.source_page ? reference.source_page : ''}">
                </div>
            </div>
        `;
        
        // Add reference type change handler
        const typeRadios = referenceDiv.querySelectorAll('.reference-type');
        typeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const index = radio.dataset.index;
                const isLink = radio.id.startsWith('link-type');
                
                const linkFields = referenceDiv.querySelector(`.link-fields-${index}`);
                const citationFields = referenceDiv.querySelector(`.citation-fields-${index}`);
                
                if (isLink) {
                    linkFields.classList.remove('hidden');
                    citationFields.classList.add('hidden');
                } else {
                    linkFields.classList.add('hidden');
                    citationFields.classList.remove('hidden');
                }
            });
        });
        
        // Add remove button handler
        const removeBtn = referenceDiv.querySelector('.remove-reference-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                // Only remove if there's more than one reference
                if (this.referencesContainer.children.length > 1) {
                    referenceDiv.remove();
                    // Renumber the remaining references
                    this.renumberReferences();
                } else {
                    window.toast ? window.toast.warning('At least one reference must be provided.') :
                                alert('At least one reference must be provided.');
                }
            });
        }
        
        this.referencesContainer.appendChild(referenceDiv);
    }

    /**
     * Collect references from the form with improved validation
     * @returns {Array} - Array of reference objects
     */
    collectReferences() {
        const references = [];
        
        if (!this.referencesContainer) return references;
        
        for (let i = 0; i < this.referencesContainer.children.length; i++) {
            const referenceDiv = this.referencesContainer.children[i];
            
            // Determine if this is a link or citation
            const isCitation = referenceDiv.querySelector(`#citation-type-${i}`).checked;
            
            if (isCitation) {
                const citationText = referenceDiv.querySelector(`#citation-text-${i}`).value.trim();
                if (citationText) {
                    const sourcePage = referenceDiv.querySelector(`#source-page-${i}`).value;
                    references.push({
                        is_citation: true,
                        citation_text: citationText,
                        source_page: sourcePage ? parseInt(sourcePage) : null
                    });
                }
            } else {
                const url = referenceDiv.querySelector(`#link-url-${i}`).value.trim();
                if (url) {
                    // Add https:// if not present
                    let validUrl = url;
                    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
                        validUrl = 'https://' + validUrl;
                    }
                    
                    const title = referenceDiv.querySelector(`#link-title-${i}`).value.trim();
                    references.push({
                        is_citation: false,
                        url: validUrl,
                        title: title || 'Reference Link'
                    });
                }
            }
        }
        
        // Ensure at least one reference exists
        if (references.length === 0) {
            // Add a default citation
            references.push({
                is_citation: true,
                citation_text: "Information derived from the provided content.",
                source_page: null
            });
        }
        
        return references;
    }
    
    /**
     * Renumber the references after removal
     */
    renumberReferences() {
        const references = this.referencesContainer.children;
        for (let i = 0; i < references.length; i++) {
            const headerSpan = references[i].querySelector('.text-sm.font-medium');
            if (headerSpan) {
                headerSpan.textContent = `Reference #${i + 1}`;
            }
        }
    }

    /**
     * Close question modal
     */
    closeQuestionModal() {
        this.questionModal.classList.add('hidden');
    }
    
    /**
     * Toggle question type fields based on selected type
     */
    toggleQuestionTypeFields() {
        const questionType = this.questionType.value;
        
        // Hide all containers first
        this.multipleChoiceContainer.classList.add('hidden');
        this.trueFalseContainer.classList.add('hidden');
        this.shortAnswerContainer.classList.add('hidden');
        
        // Show container based on selected type
        if (questionType === 'multiple_choice') {
            this.multipleChoiceContainer.classList.remove('hidden');
        } else if (questionType === 'true_false') {
            this.trueFalseContainer.classList.remove('hidden');
        } else if (questionType === 'short_answer') {
            this.shortAnswerContainer.classList.remove('hidden');
        }
    }
    
    /**
     * Reset answers container
     */
    resetAnswersContainer() {
        if (this.answersContainer) {
            this.answersContainer.innerHTML = '';
        }
    }
    
    /**
     * Reset true/false options
     */
    resetTrueFalseOptions() {
        if (this.trueOption) this.trueOption.checked = false;
        if (this.falseOption) this.falseOption.checked = false;
    }
    
    /**
     * Add answer option to multiple choice question
     * @param {string} answerText - Answer text (optional)
     * @param {boolean} isCorrect - Whether the answer is correct (optional)
     */
    addAnswerOption(answerText = '', isCorrect = false) {
        if (!this.answersContainer) return;
        
        const answerIndex = this.answersContainer.children.length;
        const answerOptionId = `answer-option-${answerIndex}`;
        
        const answerOption = document.createElement('div');
        answerOption.className = 'flex items-center mb-2';
        answerOption.innerHTML = `
            <div class="flex-shrink-0 mr-2">
                <input type="radio" id="correct-answer-${answerIndex}" name="correct-answer" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" ${isCorrect ? 'checked' : ''}>
            </div>
            <div class="flex-grow">
                <input type="text" id="${answerOptionId}" class="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" value="${answerText}" placeholder="Answer text">
            </div>
            <div class="flex-shrink-0 ml-2">
                <button type="button" class="remove-answer-btn inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none" data-answer-index="${answerIndex}">
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        `;
        
        // Add remove button event listener
        const removeBtn = answerOption.querySelector('.remove-answer-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                // Only remove if there are more than 2 answers
                if (this.answersContainer.children.length > 2) {
                    answerOption.remove();
                } else {
                    alert('Multiple choice questions must have at least 2 answer options.');
                }
            });
        }
        
        this.answersContainer.appendChild(answerOption);
    }


    /**
     * Set up event listeners for navigation away from the page
     */
    setupNavigationListeners() {
        // Add navigation warning for back button
        const backToMyQuizzesBtn = document.querySelector('a[href="my-quizzes.html"]');
        if (backToMyQuizzesBtn) {
            backToMyQuizzesBtn.addEventListener('click', (e) => {
                if (this.hasUnsavedChanges || this.checkUnsavedChanges()) {
                    e.preventDefault();
                    this.showUnsavedChangesWarning(() => {
                        // Temporarily disable the beforeunload check
                        this.disableBeforeUnloadCheck = true;
                        window.location.href = 'my-quizzes.html';
                    });
                }
            });
        }
        
        // Handle all link clicks to check for unsaved changes
        document.addEventListener('click', (e) => {
            // Check if the clicked element is a link or has a link parent
            const link = e.target.closest('a');
            if (link && 
                link.getAttribute('href') && 
                !link.getAttribute('href').startsWith('#') && 
                !link.getAttribute('href').startsWith('javascript:') && 
                link.hostname === window.location.hostname && // Only internal links
                link !== backToMyQuizzesBtn) { // Don't duplicate for the back button we already handled
                
                if (this.hasUnsavedChanges || this.checkUnsavedChanges()) {
                    e.preventDefault();
                    this.showUnsavedChangesWarning(() => {
                        // Temporarily disable the beforeunload check
                        this.disableBeforeUnloadCheck = true;
                        window.location.href = link.href;
                    });
                }
            }
        });
        
        // For browser navigation buttons and tab closing
        window.addEventListener('beforeunload', (e) => {
            // Skip check if we've approved navigation through our custom UI
            if (this.disableBeforeUnloadCheck) {
                return;
            }
            
            if (this.hasUnsavedChanges || this.checkUnsavedChanges()) {
                // We use our custom dialog for most navigation, but for refresh and tab closing,
                // we have to use the browser's built-in dialog
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        });
        
        // Intercept browser back/forward navigation when possible
        window.addEventListener('popstate', (e) => {
            // This gets triggered when the user uses browser back/forward buttons
            if (this.hasUnsavedChanges || this.checkUnsavedChanges()) {
                // Since popstate has already happened, we can't prevent it directly
                // We'll push a new state to effectively "undo" the navigation
                history.pushState(null, document.title, window.location.href);
                
                // Then show our custom warning
                this.showUnsavedChangesWarning(() => {
                    // Temporarily disable the beforeunload check
                    this.disableBeforeUnloadCheck = true;
                    // If user confirms leaving, we'll go back again
                    history.back();
                });
            }
        });
        
        // Push an initial state when loading the page
        history.pushState(null, document.title, window.location.href);
    }

    /**
     * Show unsaved changes warning with custom UI
     * @param {Function} onContinue - Function to call if user wants to continue
     */
    showUnsavedChangesWarning(onContinue) {
        // Ensure we use our custom UI confirmation dialog
        if (window.UIUtils && window.UIUtils.showConfirm) {
            window.UIUtils.showConfirm(
                'You have unsaved changes. Are you sure you want to leave without saving?',
                onContinue,
                null,
                {
                    title: 'Unsaved Changes',
                    confirmText: 'Leave Without Saving',
                    cancelText: 'Stay on Page',
                    dangerous: true
                }
            );
        } else {
            // If UIUtils isn't available for some reason, create a simple custom dialog
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = `
                <div class="fixed z-50 inset-0 overflow-y-auto">
                    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div class="sm:flex sm:items-start">
                                    <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <i class="fas fa-exclamation-triangle text-red-600"></i>
                                    </div>
                                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 class="text-lg leading-6 font-medium text-gray-900">Unsaved Changes</h3>
                                        <div class="mt-2">
                                            <p class="text-sm text-gray-500">You have unsaved changes. Are you sure you want to leave without saving?</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button type="button" id="leave-btn" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                                    Leave Without Saving
                                </button>
                                <button type="button" id="stay-btn" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                    Stay on Page
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modalContainer);
            
            const leaveBtn = modalContainer.querySelector('#leave-btn');
            const stayBtn = modalContainer.querySelector('#stay-btn');
            
            leaveBtn.addEventListener('click', () => {
                modalContainer.remove();
                if (typeof onContinue === 'function') {
                    onContinue();
                }
            });
            
            stayBtn.addEventListener('click', () => {
                modalContainer.remove();
            });
        }
    }
    
    /**
     * Save question
     */
    async saveQuestion() {
        try {
            // Validate required fields
            if (!this.questionText.value.trim()) {
                if (window.toast) {
                    window.toast.error('Please enter a question text.');
                } else {
                    alert('Please enter a question text.');
                }
                return;
            }
            
            // Other validation logic...
            
            // Create question object
            const questionData = {
                quiz_id: this.quizId,
                question_text: this.questionText.value.trim(),
                question_type: this.questionType.value,
                points: parseInt(this.questionPoints.value) || 1,
                explanation: this.questionExplanation.value.trim() || null
            };
            
            // Add answers based on question type
            // ...existing code...
            
            // Collect references
            const references = this.collectReferences();
            
            // Ensure at least one reference exists
            if (references.length === 0) {
                // Add a default citation
                references.push({
                    is_citation: true,
                    citation_text: "Information derived from the provided content.",
                    source_page: null
                });
            }
            
            // Add references to question data
            questionData.references = references;
            
            // Show saving indicator on the save button
            this.saveQuestionBtn.disabled = true;
            this.saveQuestionBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Saving...';
            
            try {
                if (this.isNewQuestion) {
                    // For new questions, we don't save to backend yet
                    // Just add it to our local array with a temporary ID
                    const tempQuestionId = `temp-${Date.now()}`;
                    const createdQuestion = {
                        ...questionData,
                        question_id: tempQuestionId,
                        isNew: true  // Mark as new for later saving
                    };
                    
                    this.questions.push(createdQuestion);
                    
                    if (window.toast) {
                        window.toast.success('Question added successfully');
                    }
                } else {
                    // Update existing question in local array
                    // Keep the question_id from the original question
                    const originalQuestionId = this.questions[this.currentQuestionIndex].question_id;
                    const isNewlyCreated = this.questions[this.currentQuestionIndex].isNew;
                    
                    this.questions[this.currentQuestionIndex] = {
                        ...questionData,
                        question_id: originalQuestionId,
                        isNew: isNewlyCreated,
                        isModified: !isNewlyCreated // Mark as modified if it wasn't a new question
                    };
                    
                    if (window.toast) {
                        window.toast.success('Question updated successfully');
                    }
                }
                
                // Mark quiz as having unsaved changes
                this.markUnsavedChanges();
                
                // Re-render questions
                this.renderQuestions();
                
                // Close modal
                this.closeQuestionModal();
                
                console.log(`Question ${this.isNewQuestion ? 'added' : 'updated'} in local state`);
            } catch (error) {
                console.error(`Error with question:`, error);
                if (window.toast) {
                    window.toast.error(`Failed to process question. Please try again.`);
                } else {
                    alert(`Failed to process question. Please try again.`);
                }
            } finally {
                // Reset save button
                this.saveQuestionBtn.disabled = false;
                this.saveQuestionBtn.innerHTML = 'Save Question';
            }
        } catch (error) {
            console.error('Error saving question:', error);
            if (window.toast) {
                window.toast.error('An error occurred while saving the question. Please try again.');
            } else {
                alert('An error occurred while saving the question. Please try again.');
            }
        }
    }
    
    /**
     * Open delete question modal
     * @param {number} index - Question index
     */
    openDeleteQuestionModal(index) {
        if (index < 0 || index >= this.questions.length) return;
        
        this.currentQuestionIndex = index;
        this.deleteQuestionModal.classList.remove('hidden');
    }
    
    /**
     * Close delete question modal
     */
    closeDeleteQuestionModal() {
        this.deleteQuestionModal.classList.add('hidden');
    }
    
    /**
     * Delete question
     */
    async deleteQuestion() {
        if (this.currentQuestionIndex < 0 || this.currentQuestionIndex >= this.questions.length) {
            this.closeDeleteQuestionModal();
            return;
        }
        
        // Disable delete button
        this.confirmDeleteQuestionBtn.disabled = true;
        this.confirmDeleteQuestionBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Deleting...';
        
        try {
            const questionToDelete = this.questions[this.currentQuestionIndex];
            
            // Check if this is a new question that hasn't been saved to the server
            if (questionToDelete.isNew) {
                // Simply remove from local array
                console.log(`Removing new question from local array`);
            } else {
                // Mark for deletion when quiz is saved
                this.questions[this.currentQuestionIndex].isDeleted = true;
                console.log(`Marking question for deletion: ${questionToDelete.question_id}`);
            }
            
            // Remove question from local array
            this.questions.splice(this.currentQuestionIndex, 1);
            
            // Mark quiz as having unsaved changes
            this.markUnsavedChanges();
            
            // Re-render questions
            this.renderQuestions();
            
            // Show success message
            if (window.toast) {
                window.toast.success('Question marked for deletion');
            }
            
            console.log(`Question at index ${this.currentQuestionIndex} marked for deletion`);
        } catch (error) {
            console.error('Error marking question for deletion:', error);
            if (window.toast) {
                window.toast.error('Failed to delete question. Please try again.');
            } else {
                alert('Failed to delete question. Please try again.');
            }
        } finally {
            // Reset delete button
            this.confirmDeleteQuestionBtn.disabled = false;
            this.confirmDeleteQuestionBtn.innerHTML = 'Delete';
            
            // Close modal
            this.closeDeleteQuestionModal();
        }
    }
    
    /**
     * Save quiz data and questions
     */
    async saveQuiz() {
        try {
            // Validate required fields
            if (!this.quizTitle.value.trim()) {
                if (window.toast) {
                    window.toast.error('Please enter a quiz title.');
                } else {
                    alert('Please enter a quiz title.');
                }
                return;
            }
            
            // Display saving indicator
            this.saveQuizBtn.disabled = true;
            this.saveQuizBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Saving...';
            
            // Create quiz data object
            const quizData = {
                title: this.quizTitle.value.trim(),
                description: this.quizDescription.value.trim() || null,
                category_id: this.quizCategory.value || null,
                subcategory_id: this.quizSubcategory.value || null,
                is_public: this.quizIsPublic.checked,
                difficulty_level: parseInt(this.quizDifficulty.value) || 2,
                time_limit: parseInt(this.quizTimeLimit.value) || null
            };
            
            // Save quiz details
            console.log(`Saving quiz details for quiz ID: ${this.quizId}`);
            await this.api.updateQuiz(this.quizId, quizData);
            
            // Now we need to sync all questions with the backend
            
            // 1. Handle new questions
            const newQuestions = this.questions.filter(q => q.isNew);
            for (const question of newQuestions) {
                // Remove the temporary properties
                const questionToSave = { ...question };
                delete questionToSave.isNew;
                delete questionToSave.question_id; // Let the server assign a real ID
                
                // Call API to create new question
                const response = await this.api.createQuestion(questionToSave);
                console.log(`Created new question with ID: ${response.question_id}`);
            }
            
            // 2. Handle modified questions
            const modifiedQuestions = this.questions.filter(q => q.isModified && !q.isNew);
            for (const question of modifiedQuestions) {
                // Remove the special properties
                const questionToSave = { ...question };
                delete questionToSave.isModified;
                
                // Call API to update existing question
                await this.api.updateQuestion(question.question_id, questionToSave);
                console.log(`Updated question with ID: ${question.question_id}`);
            }
            
            // 3. Handle deleted questions (these are not in the this.questions array anymore,
            // but we stored them separately)
            const deletedQuestions = this.originalQuestions.filter(originalQ => 
                !this.questions.some(currentQ => currentQ.question_id === originalQ.question_id)
            );
            
            for (const question of deletedQuestions) {
                // Skip questions that were added then deleted in the same session
                if (!question.question_id.toString().startsWith('temp-')) {
                    // Call API to delete question
                    await this.api.deleteQuestion(question.question_id);
                    console.log(`Deleted question with ID: ${question.question_id}`);
                }
            }
            
            // Reset unsaved changes state
            this.resetUnsavedChanges();
            
            // Success message using toast
            if (window.toast) {
                window.toast.success('Quiz saved successfully!');
            } else {
                alert('Quiz saved successfully!');
            }
            
            // Disable beforeunload check for the redirect
            this.disableBeforeUnloadCheck = true;
            
            // Redirect to my quizzes page
            // Small delay to allow toast to be seen
            setTimeout(() => {
                window.location.href = 'my-quizzes.html';
            }, 1500);
        } catch (error) {
            console.error('Error saving quiz:', error);
            this.showError('An error occurred while saving the quiz. Please try again.');
            
            // Reset save button
            this.saveQuizBtn.disabled = false;
            this.saveQuizBtn.innerHTML = '<i class="fas fa-save mr-2"></i> Save Changes';
        }
    }
    
    /**
     * Show loading indicator
     */
    showLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.classList.remove('hidden');
        }
        
        if (this.errorMessage) {
            this.errorMessage.classList.add('hidden');
        }
        
        if (this.editQuizForm) {
            this.editQuizForm.classList.add('hidden');
        }
    }
    
    /**
     * Hide loading indicator
     */
    hideLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.classList.add('hidden');
        }
    }
    
    /**
     * Mark changes as unsaved
     */
    markUnsavedChanges() {
        this.hasUnsavedChanges = true;
        // Update UI to show unsaved changes
        if (this.saveQuizBtn) {
            this.saveQuizBtn.classList.add('bg-yellow-600', 'hover:bg-yellow-700');
            this.saveQuizBtn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
            this.saveQuizBtn.innerHTML = '<i class="fas fa-exclamation-circle mr-2"></i> Save Changes*';
        }
    }
    
    /**
     * Reset unsaved changes state
     */
    resetUnsavedChanges() {
        this.hasUnsavedChanges = false;
        // Update UI to show no unsaved changes
        if (this.saveQuizBtn) {
            this.saveQuizBtn.classList.remove('bg-yellow-600', 'hover:bg-yellow-700');
            this.saveQuizBtn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
            this.saveQuizBtn.innerHTML = '<i class="fas fa-save mr-2"></i> Save Changes';
        }
        
        // Save current state as original
        this.saveOriginalState();
    }
    
    /**
     * Save the original state of the quiz for comparison
     */
    saveOriginalState() {
        // Make copies to avoid references
        this.originalQuizData = JSON.parse(JSON.stringify(this.quizData));
        this.originalQuestions = JSON.parse(JSON.stringify(this.questions));
    }    

    /**
     * Check if there are unsaved changes
     * @returns {boolean} - Whether there are unsaved changes
     */
    checkUnsavedChanges() {
        // First check basic quiz data
        if (this.quizTitle && this.originalQuizData && this.quizTitle.value !== this.originalQuizData.title) {
            return true;
        }
        if (this.quizDescription && this.originalQuizData && this.quizDescription.value !== this.originalQuizData.description) {
            return true;
        }
        if (this.quizCategory && this.originalQuizData && this.quizCategory.value !== this.originalQuizData.category_id.toString()) {
            return true;
        }
        if (this.quizSubcategory && this.originalQuizData && 
            this.quizSubcategory.value !== (this.originalQuizData.subcategory_id ? this.originalQuizData.subcategory_id.toString() : '')) {
            return true;
        }
        if (this.quizDifficulty && this.originalQuizData && this.quizDifficulty.value !== this.originalQuizData.difficulty_level.toString()) {
            return true;
        }
        if (this.quizTimeLimit && this.originalQuizData && 
            parseInt(this.quizTimeLimit.value || 0) !== (this.originalQuizData.time_limit || 0)) {
            return true;
        }
        if (this.quizIsPublic && this.originalQuizData && this.quizIsPublic.checked !== this.originalQuizData.is_public) {
            return true;
        }
        
        // Check if questions array length has changed
        if (this.questions.length !== this.originalQuestions.length) {
            return true;
        }
        
        // Check each question for changes
        for (let i = 0; i < this.questions.length; i++) {
            if (JSON.stringify(this.questions[i]) !== JSON.stringify(this.originalQuestions[i])) {
                return true;
            }
        }
        
        return false;
    }
    
    


    /**
     * Show edit form
     */
    showEditForm() {
        if (this.editQuizForm) {
            this.editQuizForm.classList.remove('hidden');
        }
    }
    
    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        this.hideLoading();
        
        if (this.errorMessage && this.errorText) {
            this.errorText.textContent = message;
            this.errorMessage.classList.remove('hidden');
        }
        
        // Use toast notification system
        if (window.toast) {
            window.toast.error(message);
        } else {
            // Fallback to alert if toast system is not available
            alert(message);
        }
    }
}

// Initialize the Edit Quiz Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Edit Quiz Manager');
    window.editQuiz = new EditQuizManager();
});