/**
 * Quiz Page Manager
 * Handles quiz taking functionality with question navigation, timer, and results
 */
class QuizPageManager {
    constructor() {
        console.log('Quiz Page Manager initializing...');
        this.api = window.api;
        this.auth = window.auth;
        
        // Quiz state variables
        this.quiz = null;
        this.allQuestions = [];
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.timeLimit = 0;
        this.timer = null;
        this.timeRemaining = 0;
        this.quizStarted = false;
        this.selectedRating = 0;
        this.isNavigating = false; // Flag to prevent navigation race conditions
        
        // Initialize DOM references
        this.initDomReferences();
        
        // Initialize the quiz page
        this.init();
    }
    
    /**
     * Initialize DOM references
     */
    initDomReferences() {
        // Quiz header elements
        this.quizTitle = document.getElementById('quiz-title');
        this.quizDescription = document.getElementById('quiz-description');
        this.quizCategory = document.getElementById('quiz-category');
        this.quizQuestionsCount = document.getElementById('quiz-questions-count');
        this.quizTimeLimit = document.getElementById('quiz-time-limit');
        
        // Timer elements
        this.timeRemainingContainer = document.getElementById('time-remaining-container');
        this.timeRemainingDisplay = document.getElementById('time-remaining');
        this.timeProgress = document.getElementById('time-progress');
        
        // View containers
        this.preQuizView = document.getElementById('pre-quiz-view');
        this.quizContainer = document.getElementById('quiz-container');
        this.resultsContainer = document.getElementById('results-container');
        
        // Pre-quiz options
        this.questionCountSelect = document.getElementById('question-count');
        this.timerDefault = document.getElementById('timer-default');
        this.timerNone = document.getElementById('timer-none');
        this.timerCustom = document.getElementById('timer-custom');
        this.customTimerInput = document.getElementById('custom-timer-input');
        this.customMinutes = document.getElementById('custom-minutes');
        this.startQuizBtn = document.getElementById('start-quiz-btn');
        
        // Question elements
        this.currentQuestionNum = document.getElementById('current-question-num');
        this.totalQuestions = document.getElementById('total-questions');
        this.questionPoints = document.getElementById('question-points');
        this.questionText = document.getElementById('question-text');
        this.answerContainer = document.getElementById('answer-container');
        this.progressBar = document.getElementById('progress-bar');
        
        // Navigation buttons
        this.prevQuestionBtn = document.getElementById('prev-question-btn');
        this.nextQuestionBtn = document.getElementById('next-question-btn');
        this.finishQuizBtn = document.getElementById('finish-quiz-btn');
        
        // Results elements
        this.scorePercentage = document.getElementById('score-percentage');
        this.scoreCircle = document.getElementById('score-circle');
        this.correctAnswers = document.getElementById('correct-answers');
        this.incorrectAnswers = document.getElementById('incorrect-answers');
        this.finalScore = document.getElementById('final-score');
        this.reviewContainer = document.getElementById('review-container');
        
        // Results buttons
        this.retakeQuizBtn = document.getElementById('retake-quiz-btn');
        this.newQuestionsBtn = document.getElementById('new-questions-btn');
        this.rateQuizBtn = document.getElementById('rate-quiz-btn');
        
        // Rating modal
        this.ratingModal = document.getElementById('ratingModal');
        this.stars = document.querySelectorAll('.star');
        this.ratingComment = document.getElementById('rating-comment');
        this.submitRatingBtn = document.getElementById('submit-rating-btn');
        this.cancelRatingBtn = document.getElementById('cancel-rating-btn');
        
        // Login modal
        this.loginModal = document.getElementById('loginModal');
        this.loginBtn = document.getElementById('loginBtn');
        this.closeLoginBtn = document.getElementById('closeLoginBtn');
        this.loginForm = document.getElementById('login-form');
        this.signInBtn = document.getElementById('sign-in-btn');
    }
    
    /**
     * Initialize the quiz page
     */
    async init() {
        console.log('Quiz page initializing...');
        
        // Set up event listeners
        this.attachEventListeners();
        
        // Get quiz ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const quizId = urlParams.get('id');
        
        if (!quizId) {
            this.handleError(new Error('Quiz ID is missing'), 'Quiz ID is missing. Redirecting to home page.');
            window.location.href = 'index.html';
            return;
        }
        
        try {
            // Show loading state
            if (this.quizTitle) this.quizTitle.textContent = 'Loading Quiz...';
            if (this.quizDescription) this.quizDescription.textContent = 'Please wait while we load the quiz details.';
            
            // Load quiz details
            this.quiz = await this.api.getQuiz(quizId);
            console.log('Quiz loaded:', this.quiz);
            
            if (!this.quiz) {
                throw new Error('Failed to load quiz details');
            }
            
                        
            // Load all questions (but don't show them yet)
            console.log('Loading quiz questions...');
            this.allQuestions = await this.api.getQuizQuestions(quizId);
            console.log(`Loaded ${this.allQuestions.length} questions`);
            
            
            this.updateQuizInfo();
            if (!this.allQuestions || this.allQuestions.length === 0) {
                throw new Error('No questions available for this quiz');
            }
            
            // Check if we have start options from URL parameters
            const count = urlParams.get('count');
            const timer = urlParams.get('timer');
            const minutes = urlParams.get('minutes');
            
            if (count || timer) {
                console.log('Starting quiz with URL parameters:', { count, timer, minutes });
                // Set up options
                if (count && this.questionCountSelect) {
                    this.questionCountSelect.value = count;
                }
                
                if (timer) {
                    if (timer === 'none' && this.timerNone) {
                        this.timerNone.checked = true;
                    } else if (timer === 'custom' && this.timerCustom && minutes) {
                        this.timerCustom.checked = true;
                        if (this.customMinutes) {
                            this.customMinutes.value = minutes;
                        }
                        if (this.customTimerInput) {
                            this.customTimerInput.classList.remove('hidden');
                        }
                    }
                }
                
                // Start quiz immediately
                setTimeout(() => this.startQuiz(), 100);
                return;
            }
            
            // Show start button if no URL parameters
            if (this.preQuizView) {
                this.preQuizView.classList.remove('hidden');
            }
            
        } catch (error) {
            this.handleError(error, 'Failed to load quiz. Please try again later.');
            window.location.href = 'index.html';
        }
    }    
    /**
     * Update quiz information in the header and set up question count dropdown
     */
    updateQuizInfo() {
        if (this.quizTitle) this.quizTitle.textContent = this.quiz.title || 'Untitled Quiz';
        if (this.quizDescription) this.quizDescription.textContent = this.quiz.description || 'No description available.';
        
        if (this.quizCategory) {
            this.quizCategory.textContent = `${this.quiz.category_name || 'Uncategorized'}${this.quiz.subcategory_name ? ' > ' + this.quiz.subcategory_name : ''}`;
        }
        
        if (this.quizQuestionsCount) {
            this.quizQuestionsCount.textContent = this.quiz.questions_count || '-';
        }
        
        // Time limit
        this.timeLimit = this.quiz.time_limit || 0;
        if (this.timeLimit > 0 && this.quizTimeLimit) {
            const minutes = Math.floor(this.timeLimit / 60);
            const seconds = this.timeLimit % 60;
            this.quizTimeLimit.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Dynamically populate the question count dropdown based on available questions
        if (this.questionCountSelect && this.allQuestions && this.allQuestions.length > 0) {
            // Clear existing options except "All Questions"
            while (this.questionCountSelect.options.length > 1) {
                this.questionCountSelect.remove(1);
            }
            
            // Add options based on available questions
            const totalQuestions = this.allQuestions.length;
            const optionValues = [5, 10, 15, 20, 25];
            
            // Filter options that don't exceed total questions
            const validOptions = optionValues.filter(val => val <= totalQuestions);
            
            // Add valid options
            validOptions.forEach(val => {
                const option = document.createElement('option');
                option.value = val;
                option.textContent = `${val} Questions`;
                this.questionCountSelect.appendChild(option);
            });
            
            // Select 10 questions by default or the closest available option
            const preferredOption = 10;
            if (validOptions.includes(preferredOption)) {
                this.questionCountSelect.value = preferredOption;
            } else if (validOptions.length > 0) {
                // Find the closest option below 10
                const closestOption = validOptions.reduce((prev, curr) => 
                    (Math.abs(curr - preferredOption) < Math.abs(prev - preferredOption) && curr <= preferredOption) 
                        ? curr : prev, validOptions[0]);
                this.questionCountSelect.value = closestOption;
            } else {
                // If no valid numeric options, select "All Questions"
                this.questionCountSelect.value = "all";
            }
        }
    }    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Pre-quiz buttons
        if (this.startQuizBtn) {
            this.startQuizBtn.addEventListener('click', () => this.startQuiz());
        }
        
        // Navigation buttons
        if (this.prevQuestionBtn) {
            this.prevQuestionBtn.addEventListener('click', () => this.showPreviousQuestion());
        }
        
        if (this.nextQuestionBtn) {
            this.nextQuestionBtn.addEventListener('click', () => this.showNextQuestion());
        }
        
        if (this.finishQuizBtn) {
            this.finishQuizBtn.addEventListener('click', () => this.finishQuiz());
        }
        
        // Results buttons
        if (this.retakeQuizBtn) {
            this.retakeQuizBtn.addEventListener('click', () => this.retakeQuiz());
        }
        
        if (this.newQuestionsBtn) {
            this.newQuestionsBtn.addEventListener('click', () => this.loadNewQuestions());
        }
        
        if (this.rateQuizBtn) {
            this.rateQuizBtn.addEventListener('click', () => this.showRatingModal());
        }
        
        // Rating modal
        if (this.submitRatingBtn) {
            this.submitRatingBtn.addEventListener('click', () => this.submitRating());
        }
        
        if (this.cancelRatingBtn) {
            this.cancelRatingBtn.addEventListener('click', () => this.hideRatingModal());
        }
        
        // Set up rating stars
        if (this.stars) {
            this.stars.forEach(star => {
                star.addEventListener('click', () => {
                    const rating = parseInt(star.dataset.rating);
                    this.selectedRating = rating;
                    
                    // Update star colors
                    this.stars.forEach(s => {
                        const starRating = parseInt(s.dataset.rating);
                        if (starRating <= rating) {
                            s.classList.remove('text-gray-300');
                            s.classList.add('text-yellow-400');
                        } else {
                            s.classList.remove('text-yellow-400');
                            s.classList.add('text-gray-300');
                        }
                    });
                    
                    // Enable submit button
                    if (this.submitRatingBtn) {
                        this.submitRatingBtn.disabled = false;
                    }
                });
            });
        }
        
        // Login modal
        if (this.loginBtn) {
            this.loginBtn.addEventListener('click', () => this.showLoginModal());
        }
        
        if (this.closeLoginBtn) {
            this.closeLoginBtn.addEventListener('click', () => this.hideLoginModal());
        }
        
        // Login form
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    }
    
    /**
     * Start the quiz
     */
    startQuiz() {
        console.log('Starting quiz...');
        
        // Reset quiz state
        this.quizStarted = true;
        this.currentQuestionIndex = 0;
        
        // Reset UI elements
        if (this.answerContainer) {
            this.answerContainer.innerHTML = '';
        }
        
        // Get user selected question count
        if (this.questionCountSelect) {
            const selectedValue = this.questionCountSelect.value;
            
            if (selectedValue === 'all') {
                // Use all questions
                this.questions = [...this.allQuestions];
            } else {
                // Use selected number of questions
                const count = parseInt(selectedValue);
                // Randomly select questions if we have more than requested
                if (this.allQuestions.length > count) {
                    this.questions = this.getRandomQuestions(this.allQuestions, count);
                } else {
                    this.questions = [...this.allQuestions];
                }
            }
            
            console.log(`Using ${this.questions.length} questions for this quiz`);
        } else {
            // Default to all questions if no selector
            this.questions = [...this.allQuestions];
        }
        
        // Update total questions count
        if (this.totalQuestions) {
            this.totalQuestions.textContent = this.questions.length;
        }
        
        // Initialize user answers array with nulls
        this.userAnswers = new Array(this.questions.length).fill(null);
        
        // Get timer option
        if (this.timerNone && this.timerNone.checked) {
            // No timer
            this.timeLimit = 0;
            if (this.timeRemainingContainer) {
                this.timeRemainingContainer.classList.add('hidden');
            }
        } else if (this.timerCustom && this.timerCustom.checked && this.customMinutes) {
            // Custom timer
            const minutes = parseInt(this.customMinutes.value) || 5;
            this.timeLimit = minutes * 60;
            
            if (this.quizTimeLimit) {
                const formattedMinutes = Math.floor(this.timeLimit / 60);
                const seconds = this.timeLimit % 60;
                this.quizTimeLimit.textContent = `${formattedMinutes}:${seconds.toString().padStart(2, '0')}`;
            }
            
            if (this.timeRemainingContainer) {
                this.timeRemainingContainer.classList.remove('hidden');
            }
            
            this.timeRemaining = this.timeLimit;
            this.updateTimerDisplay();
        } else {
            // Default timer from quiz settings
            if (this.timeLimit > 0 && this.timeRemainingContainer) {
                this.timeRemainingContainer.classList.remove('hidden');
                this.timeRemaining = this.timeLimit;
                this.updateTimerDisplay();
            }
        }
        
        // Hide pre-quiz view
        if (this.preQuizView) {
            this.preQuizView.classList.add('hidden');
        }
        
        // Show quiz container
        if (this.quizContainer) {
            this.quizContainer.classList.remove('hidden');
        }
        
        // Start timer if needed
        if (this.timeLimit > 0) {
            this.startTimer();
        }
        
        // Show first question
        this.showQuestion(0);
    }
    
    /**
     * Get random questions from array
     * @param {Array} questionsArray - Array of questions
     * @param {number} count - Number of questions to select
     * @returns {Array} - Random selection of questions
     */
    getRandomQuestions(questionsArray, count) {
        // Shuffle array and return requested number of questions
        const shuffled = [...questionsArray].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    
    /**
     * Start the timer
     */
    startTimer() {
        // Clear existing timer if any
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        // Reset time remaining
        this.timeRemaining = this.timeLimit;
        this.updateTimerDisplay();
        
        // Start interval
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                clearInterval(this.timer);
                this.finishQuiz();
            }
        }, 1000);
    }
    
    /**
     * Update timer display
     */
    updateTimerDisplay() {
        if (!this.timeRemainingDisplay || !this.timeProgress) return;
        
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        this.timeRemainingDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Update progress bar
        const percentage = (this.timeRemaining / this.timeLimit) * 100;
        this.timeProgress.style.width = `${percentage}%`;
        
        // Change color based on time remaining
        if (percentage < 25) {
            this.timeProgress.classList.remove('bg-indigo-600', 'bg-yellow-500');
            this.timeProgress.classList.add('bg-red-600');
        } else if (percentage < 50) {
            this.timeProgress.classList.remove('bg-indigo-600', 'bg-red-600');
            this.timeProgress.classList.add('bg-yellow-500');
        } else {
            this.timeProgress.classList.remove('bg-yellow-500', 'bg-red-600');
            this.timeProgress.classList.add('bg-indigo-600');
        }
    }
    
    /**
     * Show a question
     * @param {number} index - Question index
     */
    showQuestion(index) {
        // Prevent navigation race conditions
        if (this.isNavigating) {
            console.log('Navigation in progress, ignoring request');
            return;
        }
        
        // Set navigation lock
        this.isNavigating = true;
        
        // Validate index
        if (index < 0 || index >= this.questions.length) {
            console.error(`Invalid question index: ${index}`);
            this.isNavigating = false;
            return;
        }
        
        try {
            console.log(`Showing question ${index + 1} of ${this.questions.length}`);
            this.currentQuestionIndex = index;
            const question = this.questions[index];
            
            if (!question) {
                console.error(`Question at index ${index} is undefined`);
                this.isNavigating = false;
                return;
            }
            
            // Update question text
            if (this.questionText) {
                this.questionText.textContent = question.question_text || 'Question text not available';
            }
            
            if (this.currentQuestionNum) {
                this.currentQuestionNum.textContent = index + 1;
            }
            
            if (this.questionPoints) {
                this.questionPoints.textContent = `${question.points || 1} point${question.points > 1 ? 's' : ''}`;
            }
            
            // Update progress bar
            if (this.progressBar) {
                const progressPercentage = ((index + 1) / this.questions.length) * 100;
                this.progressBar.style.width = `${progressPercentage}%`;
            }
            
            // Clear answer container before adding new answers
            if (this.answerContainer) {
                this.answerContainer.innerHTML = '';
                
                // Generate answer options based on question type
                if (question.question_type === 'multiple_choice') {
                    this.renderMultipleChoiceQuestion(question, index);
                } else if (question.question_type === 'true_false') {
                    this.renderTrueFalseQuestion(question, index);
                } else if (question.question_type === 'short_answer') {
                    this.renderShortAnswerQuestion(question, index);
                } else {
                    // Handle unknown question type
                    console.error(`Unknown question type: ${question.question_type}`);
                    this.answerContainer.innerHTML = '<p class="text-red-500">Error: Unknown question type.</p>';
                }
            }
            
            // Update navigation buttons
            this.updateNavigationButtons(index);
            
        } catch (error) {
            console.error('Error displaying question:', error);
            if (this.answerContainer) {
                this.answerContainer.innerHTML = '<p class="text-red-500">Error loading question content. Please try again.</p>';
            }
        } finally {
            // Release navigation lock
            this.isNavigating = false;
        }
    }
    
    /**
     * Render multiple choice question
     * @param {Object} question - Question data
     * @param {number} index - Question index
     */
    renderMultipleChoiceQuestion(question, index) {
        if (!question.answers || question.answers.length === 0) {
            console.error('No answers available for this multiple choice question:', question);
            this.answerContainer.innerHTML = '<p class="text-red-500">Error: No answer options available for this question.</p>';
            return;
        }
        
        // Create answer options for multiple choice
        question.answers.forEach((answer, answerIndex) => {
            const isSelected = this.userAnswers[index] === answerIndex;
            
            const answerDiv = document.createElement('div');
            answerDiv.className = `flex items-center p-4 border rounded-lg cursor-pointer ${isSelected ? 'bg-indigo-50 border-indigo-500' : 'border-gray-200 hover:bg-gray-50'}`;
            answerDiv.dataset.index = answerIndex;
            
            answerDiv.innerHTML = `
                <input type="radio" name="answer" id="answer-${answerIndex}" class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" ${isSelected ? 'checked' : ''}>
                <label for="answer-${answerIndex}" class="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
                    ${answer.answer_text || 'Answer text not available'}
                </label>
            `;
            
            answerDiv.addEventListener('click', () => {
                this.selectAnswer(index, answerIndex);
            });
            
            this.answerContainer.appendChild(answerDiv);
        });
    }
    
    /**
     * Render true/false question
     * @param {Object} question - Question data
     * @param {number} index - Question index
     */
    renderTrueFalseQuestion(question, index) {
        // Create answer options for true/false
        const trueDiv = document.createElement('div');
        trueDiv.className = `flex items-center p-4 border rounded-lg cursor-pointer ${this.userAnswers[index] === 0 ? 'bg-indigo-50 border-indigo-500' : 'border-gray-200 hover:bg-gray-50'}`;
        trueDiv.dataset.index = 0;
        
        trueDiv.innerHTML = `
            <input type="radio" name="answer" id="answer-true" class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" ${this.userAnswers[index] === 0 ? 'checked' : ''}>
            <label for="answer-true" class="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
                True
            </label>
        `;
        
        trueDiv.addEventListener('click', () => {
            this.selectAnswer(index, 0);
        });
        
        const falseDiv = document.createElement('div');
        falseDiv.className = `flex items-center p-4 border rounded-lg cursor-pointer ${this.userAnswers[index] === 1 ? 'bg-indigo-50 border-indigo-500' : 'border-gray-200 hover:bg-gray-50'}`;
        falseDiv.dataset.index = 1;
        
        falseDiv.innerHTML = `
            <input type="radio" name="answer" id="answer-false" class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" ${this.userAnswers[index] === 1 ? 'checked' : ''}>
            <label for="answer-false" class="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
                False
            </label>
        `;
        
        falseDiv.addEventListener('click', () => {
            this.selectAnswer(index, 1);
        });
        
        this.answerContainer.appendChild(trueDiv);
        this.answerContainer.appendChild(falseDiv);
    }
    
    /**
     * Render short answer question
     * @param {Object} question - Question data
     * @param {number} index - Question index
     */
    renderShortAnswerQuestion(question, index) {
        // Create input field for short answer
        const inputDiv = document.createElement('div');
        inputDiv.className = 'mt-2';
        
        inputDiv.innerHTML = `
            <input type="text" 
                   id="short-answer-input" 
                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                   placeholder="Type your answer here"
                   value="${this.userAnswers[index] || ''}">
        `;
        
        const inputElement = inputDiv.querySelector('input');
        inputElement.addEventListener('input', (e) => {
            this.userAnswers[index] = e.target.value;
        });
        
        this.answerContainer.appendChild(inputDiv);
    }
    
    /**
     * Update navigation buttons
     * @param {number} index - Current question index
     */
    updateNavigationButtons(index) {
        if (!this.prevQuestionBtn || !this.nextQuestionBtn || !this.finishQuizBtn) return;
        
        // Previous button should be disabled on first question
        this.prevQuestionBtn.disabled = index === 0;
        
        // Show finish button only on last question
        if (index === this.questions.length - 1) {
            this.nextQuestionBtn.classList.add('hidden');
            this.finishQuizBtn.classList.remove('hidden');
        } else {
            this.nextQuestionBtn.classList.remove('hidden');
            this.finishQuizBtn.classList.add('hidden');
        }
    }
    
    /**
     * Select an answer
     * @param {number} questionIndex - Question index
     * @param {number} answerIndex - Answer index
     */
    selectAnswer(questionIndex, answerIndex) {
        // Store user answer
        this.userAnswers[questionIndex] = answerIndex;
        
        // Update UI to show selected answer
        const answerOptions = document.querySelectorAll('#answer-container > div');
        answerOptions.forEach(option => {
            if (!option.dataset.index) return; // Skip elements without index
            
            const optionIndex = parseInt(option.dataset.index);
            if (optionIndex === answerIndex) {
                option.classList.add('bg-indigo-50', 'border-indigo-500');
                option.classList.remove('border-gray-200', 'hover:bg-gray-50');
                option.querySelector('input').checked = true;
            } else {
                option.classList.remove('bg-indigo-50', 'border-indigo-500');
                option.classList.add('border-gray-200', 'hover:bg-gray-50');
                option.querySelector('input').checked = false;
            }
        });
    }
    
    /**
     * Show previous question
     */
    showPreviousQuestion() {
        if (this.currentQuestionIndex > 0 && !this.isNavigating) {
            this.showQuestion(this.currentQuestionIndex - 1);
        }
    }
    
    /**
     * Show next question
     */
    showNextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1 && !this.isNavigating) {
            this.showQuestion(this.currentQuestionIndex + 1);
        }
    }
    
    /**
     * Finish the quiz and show results
     */
    finishQuiz() {
        console.log('Finishing quiz...');
        
        // Stop timer if running
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // Hide quiz container
        if (this.quizContainer) {
            this.quizContainer.classList.add('hidden');
        }
        
        // Calculate results
        let correctAnswers = 0;
        let totalPoints = 0;
        let earnedPoints = 0;
        
        const resultsData = this.questions.map((question, index) => {
            const userAnswerIndex = this.userAnswers[index];
            let isCorrect = false;
            let correctAnswerIndex = null;
            let correctAnswerText = "";
            let points = question.points || 1;
            totalPoints += points;
            
            if (question.question_type === 'multiple_choice') {
                correctAnswerIndex = question.answers ? question.answers.findIndex(a => a.is_correct) : -1;
                isCorrect = userAnswerIndex === correctAnswerIndex;
                if (correctAnswerIndex >= 0 && question.answers && question.answers[correctAnswerIndex]) {
                    correctAnswerText = question.answers[correctAnswerIndex].answer_text;
                }
            } else if (question.question_type === 'true_false') {
                correctAnswerIndex = question.correct_answer ? 0 : 1; // 0 for true, 1 for false
                isCorrect = userAnswerIndex === correctAnswerIndex;
                correctAnswerText = question.correct_answer ? 'True' : 'False';
            } else if (question.question_type === 'short_answer') {
                // For short answer, we'll need to check against the correct answer
                // If available, otherwise mark as incorrect
                if (question.correct_answer && userAnswerIndex) {
                    // Simple case-insensitive comparison
                    isCorrect = userAnswerIndex.toLowerCase().trim() === 
                            question.correct_answer.toLowerCase().trim();
                    correctAnswerText = question.correct_answer;
                }
            }
            
            if (isCorrect) {
                correctAnswers++;
                earnedPoints += points;
            }
            
            return {
                question: question.question_text,
                userAnswerIndex,
                correctAnswerIndex,
                correctAnswerText,
                isCorrect,
                points,
                answers: question.answers || [{ answer_text: 'True' }, { answer_text: 'False' }],
                explanation: question.explanation,
                questionType: question.question_type,
                references: question.references || [] // Add references to results
            };
        });
        
        // Update results UI
        if (this.correctAnswers) this.correctAnswers.textContent = correctAnswers;
        if (this.incorrectAnswers) this.incorrectAnswers.textContent = this.questions.length - correctAnswers;
        if (this.finalScore) this.finalScore.textContent = `${earnedPoints}/${totalPoints}`;
        
        const percentage = Math.round((correctAnswers / this.questions.length) * 100);
        if (this.scorePercentage) this.scorePercentage.textContent = `${percentage}%`;
        if (this.scoreCircle) this.scoreCircle.style.strokeDasharray = `${percentage}, 100`;
        
        // Generate review HTML
        this.generateReviewContent(resultsData);
        
        // Submit quiz results to the server
        this.submitQuizResults(earnedPoints, totalPoints, percentage, this.userAnswers);
        
        // Show results container
        if (this.resultsContainer) {
            this.resultsContainer.classList.remove('hidden');
        }
    }
    
    /**
     * Create review card for a question with enhanced references display
     * @param {Object} questionData - Question data including user's answer
     * @param {number} index - Question index
     * @returns {HTMLElement} - Review card element
     */
    createReviewCard(questionData, index) {
        const { question, userAnswer, isCorrect } = questionData;
        
        const card = document.createElement('div');
        card.className = `p-4 rounded-lg border-l-4 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`;
        
        // Determine the correct answer text based on question type
        let correctAnswerText = '';
        
        if (question.question_type === 'multiple_choice') {
            const correctAnswer = question.answers.find(a => a.is_correct);
            correctAnswerText = correctAnswer ? correctAnswer.answer_text : 'No correct answer provided';
        } else if (question.question_type === 'true_false') {
            correctAnswerText = question.correct_answer ? 'True' : 'False';
        } else if (question.question_type === 'short_answer') {
            correctAnswerText = question.correct_answer;
        }
        
        // Determine user answer text
        let userAnswerText = '';
        
        if (question.question_type === 'multiple_choice') {
            // For multiple choice, find the selected answer text
            if (userAnswer && userAnswer.selected_answer_id) {
                const selectedAnswer = question.answers.find(a => a.answer_id === userAnswer.selected_answer_id);
                userAnswerText = selectedAnswer ? selectedAnswer.answer_text : 'Unknown';
            } else {
                userAnswerText = 'Not answered';
            }
        } else if (question.question_type === 'true_false') {
            // For true/false, convert to text
            if (userAnswer && userAnswer.text_answer !== undefined) {
                userAnswerText = userAnswer.text_answer === 'true' ? 'True' : 'False';
            } else {
                userAnswerText = 'Not answered';
            }
        } else if (question.question_type === 'short_answer') {
            // For short answer, use the text answer
            userAnswerText = userAnswer && userAnswer.text_answer ? userAnswer.text_answer : 'Not answered';
        }
        
        // Create enhanced references section
        let referencesHTML = '';
        if (question.references && question.references.length > 0) {
            // Group references by type
            const citations = question.references.filter(ref => ref.is_citation);
            const links = question.references.filter(ref => !ref.is_citation);
            
            referencesHTML = `<div class="mt-3 border-t border-gray-200 pt-3">
                <h4 class="text-sm font-medium text-gray-700">References:</h4>
                <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">`;
            
            // Add citations in the first column
            if (citations.length > 0) {
                referencesHTML += `<div class="bg-white bg-opacity-50 p-3 rounded">
                    <h5 class="text-xs font-medium text-gray-600 mb-1">Citations:</h5>
                    <ul class="space-y-2 text-xs text-gray-600">`;
                
                citations.forEach(citation => {
                    referencesHTML += `<li class="border-l-2 border-gray-300 pl-2 italic">"${citation.citation_text}"
                        ${citation.source_page ? `<span class="text-gray-500">(Page ${citation.source_page})</span>` : ''}
                    </li>`;
                });
                
                referencesHTML += `</ul></div>`;
            }
            
            // Add external links in the second column
            if (links.length > 0) {
                referencesHTML += `<div class="bg-white bg-opacity-50 p-3 rounded">
                    <h5 class="text-xs font-medium text-gray-600 mb-1">External Sources:</h5>
                    <ul class="space-y-2 text-xs">`;
                
                links.forEach(link => {
                    referencesHTML += `<li>
                        <a href="${link.url}" target="_blank" class="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center">
                            <i class="fas fa-external-link-alt mr-1 text-xs"></i>
                            <span>${link.title || link.url}</span>
                        </a>
                    </li>`;
                });
                
                referencesHTML += `</ul></div>`;
            }
            
            referencesHTML += `</div></div>`;
        }
        
        card.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-md font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}">
                    Question ${index + 1}${isCorrect ? ' ✓' : ' ✗'}
                </h3>
                ${question.points ? `
                    <span class="text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}">
                        ${userAnswer ? userAnswer.points_earned : 0}/${question.points} points
                    </span>
                ` : ''}
            </div>
            
            <p class="text-gray-700 mb-2">${question.question_text}</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                <div class="bg-white bg-opacity-60 p-2 rounded">
                    <p class="text-xs text-gray-500">Your answer:</p>
                    <p class="font-medium text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}">${userAnswerText}</p>
                </div>
                
                <div class="bg-white bg-opacity-60 p-2 rounded">
                    <p class="text-xs text-gray-500">Correct answer:</p>
                    <p class="font-medium text-sm text-gray-700">${correctAnswerText}</p>
                </div>
            </div>
            
            ${question.explanation ? `
                <div class="bg-white bg-opacity-70 p-3 rounded">
                    <p class="text-xs text-gray-500 mb-1">Explanation:</p>
                    <p class="text-sm text-gray-700">${question.explanation}</p>
                </div>
            ` : ''}
            
            ${referencesHTML}
        `;
        
        return card;
    }



 
    /**
     * Generate review content for results
     * @param {Array} resultsData - Results data for each question
     */
    generateReviewContent(resultsData) {
        if (!this.reviewContainer) return;
        
        this.reviewContainer.innerHTML = '';
        
        resultsData.forEach((result, index) => {
            const reviewDiv = document.createElement('div');
            reviewDiv.className = 'p-4 border rounded-lg mb-4';
            
            let statusBadge = '';
            if (result.isCorrect) {
                statusBadge = '<span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Correct</span>';
            } else {
                statusBadge = '<span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Incorrect</span>';
            }
            
            let answersHtml = '';
            
            if (result.questionType === 'multiple_choice') {
                result.answers.forEach((answer, answerIndex) => {
                    if (!answer) return;
                    let className = 'border-gray-200';
                    
                    if (result.correctAnswerIndex === answerIndex) {
                        className = 'border-green-500 bg-green-50';
                    } else if (result.userAnswerIndex === answerIndex && !result.isCorrect) {
                        className = 'border-red-500 bg-red-50';
                    }
                    
                    answersHtml += `
                        <div class="flex items-center p-2 border rounded-lg my-1 ${className}">
                            <span class="text-sm font-medium text-gray-700">${answer.answer_text || 'Answer text not available'}</span>
                        </div>
                    `;
                });
            } else if (result.questionType === 'true_false') {
                ['True', 'False'].forEach((answer, answerIndex) => {
                    let className = 'border-gray-200';
                    
                    if (result.correctAnswerIndex === answerIndex) {
                        className = 'border-green-500 bg-green-50';
                    } else if (result.userAnswerIndex === answerIndex && !result.isCorrect) {
                        className = 'border-red-500 bg-red-50';
                    }
                    
                    answersHtml += `
                        <div class="flex items-center p-2 border rounded-lg my-1 ${className}">
                            <span class="text-sm font-medium text-gray-700">${answer}</span>
                        </div>
                    `;
                });
            } else if (result.questionType === 'short_answer') {
                answersHtml += `
                    <div class="p-2 border rounded-lg my-1">
                        <div class="mb-2">
                            <span class="text-sm font-medium text-gray-700">Your answer:</span>
                            <span class="ml-2 text-sm ${result.isCorrect ? 'text-green-600' : 'text-red-600'}">${result.userAnswerIndex || '(No answer provided)'}</span>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-gray-700">Correct answer:</span>
                            <span class="ml-2 text-sm text-green-600">${result.correctAnswerText || '(Not specified)'}</span>
                        </div>
                    </div>
                `;
            }
            
            let explanationHtml = '';
            if (result.explanation) {
                explanationHtml = `
                    <div class="mt-2 p-2 bg-gray-50 rounded">
                        <span class="text-sm font-medium text-gray-700">Explanation:</span>
                        <p class="text-sm text-gray-600">${result.explanation}</p>
                    </div>
                `;
            }
            
            // References section with properly formatted content
            let referencesHtml = '';
            if (result.references && result.references.length > 0) {
                // Group references by type for better display
                const citations = result.references.filter(ref => ref.is_citation);
                const links = result.references.filter(ref => !ref.is_citation);
                
                referencesHtml = `
                    <div class="mt-3 border-t border-gray-200 pt-2">
                        <p class="text-sm font-medium text-gray-700 mb-1">References:</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">`;
                
                // Add citations section
                if (citations.length > 0) {
                    referencesHtml += `
                        <div class="bg-gray-50 p-2 rounded">
                            <p class="text-xs text-gray-600 italic mb-1">Citations:</p>
                            <ul class="pl-4 list-disc">`;
                    
                    citations.forEach(citation => {
                        referencesHtml += `
                            <li class="text-xs text-gray-600 mb-1">"${citation.citation_text}"
                                ${citation.source_page ? `<span class="text-gray-500">(Page ${citation.source_page})</span>` : ''}
                            </li>`;
                    });
                    
                    referencesHtml += `</ul>
                        </div>`;
                }
                
                // Add external links section with clickable links
                if (links.length > 0) {
                    referencesHtml += `
                        <div class="bg-gray-50 p-2 rounded">
                            <p class="text-xs text-gray-600 italic mb-1">External Sources:</p>
                            <ul class="pl-4 list-disc">`;
                    
                    links.forEach(link => {
                        referencesHtml += `
                            <li class="text-xs mb-1">
                                <a href="${link.url}" target="_blank" class="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center">
                                    <i class="fas fa-external-link-alt mr-1"></i>
                                    <span>${link.title || 'Reference Link'}</span>
                                </a>
                            </li>`;
                    });
                    
                    referencesHtml += `</ul>
                        </div>`;
                }
                
                referencesHtml += `</div>
                    </div>`;
            }
            
            reviewDiv.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <span class="font-medium">Question ${index + 1}</span>
                    ${statusBadge}
                </div>
                <p class="text-gray-700 mb-2">${result.question}</p>
                ${answersHtml}
                ${explanationHtml}
                ${referencesHtml}
            `;
            
            this.reviewContainer.appendChild(reviewDiv);
        });
    }
    
    /**
     * Submit quiz results to server
     * @param {number} earnedPoints - Points earned
     * @param {number} totalPoints - Total possible points
     * @param {number} percentage - Percentage score
     * @param {Array} answers - User answers
     */
    async submitQuizResults(earnedPoints, totalPoints, percentage, answers) {
        if (!this.auth || !this.auth.isAuthenticated()) {
            // Don't submit results if user is not logged in
            console.log('User not logged in, skipping result submission');
            return;
        }
        
        try {
            console.log('Submitting quiz results...');
            const attemptData = {
                quiz_id: this.quiz.quiz_id,
                score: earnedPoints,
                max_score: totalPoints,
                percentage: percentage,
                completed: true,
                answers: answers.map((answerIndex, questionIndex) => {
                    const question = this.questions[questionIndex];
                    let isCorrect = false;
                    let answerId = null;
                    
                    if (answerIndex !== null) {
                        if (question.question_type === 'multiple_choice' && question.answers && question.answers[answerIndex]) {
                            answerId = question.answers[answerIndex].answer_id;
                            isCorrect = question.answers[answerIndex].is_correct;
                        } else if (question.question_type === 'true_false') {
                            answerId = answerIndex; // Using index as ID for true/false
                            isCorrect = (answerIndex === 0 && question.correct_answer) || 
                                      (answerIndex === 1 && !question.correct_answer);
                        }
                    }
                    
                    return {
                        question_id: question.question_id,
                        selected_answer_id: answerId,
                        is_correct: isCorrect
                    };
                })
            };
            
            await this.api.submitQuizAttempt(attemptData);
            console.log('Quiz results submitted successfully');
        } catch (error) {
            console.error('Error submitting quiz results:', error);
            // Continue showing results even if submission fails
        }
    }
    
    /**
     * Retake the quiz with the same settings
     */
    retakeQuiz() {
        console.log('Retaking quiz with same settings...');
        
        // Hide results container
        if (this.resultsContainer) {
            this.resultsContainer.classList.add('hidden');
        }
        
        // Keep the same number of questions, but shuffle them
        this.questions = [...this.questions].sort(() => 0.5 - Math.random());
        
        // Reset other quiz state
        this.quizStarted = true;
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.questions.length).fill(null);
        
        // Clear any existing timer
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // Reset UI state
        if (this.answerContainer) {
            this.answerContainer.innerHTML = '';
        }
        
        // Show quiz container instead of pre-quiz view
        if (this.quizContainer) {
            this.quizContainer.classList.remove('hidden');
        }
        
        // Restart timer if needed
        if (this.timeLimit > 0) {
            this.timeRemaining = this.timeLimit;
            this.updateTimerDisplay();
            this.startTimer();
        }
        
        // Show first question
        this.showQuestion(0);
    }
    
    /**
     * Load a new set of questions
     */
    async loadNewQuestions() {
        try {
            // Hide results container
            if (this.resultsContainer) {
                this.resultsContainer.classList.add('hidden');
            }
            
            // Show loading
            if (this.preQuizView) {
                this.preQuizView.classList.remove('hidden');
            }
            
            if (this.startQuizBtn) {
                this.startQuizBtn.textContent = 'Loading...';
                this.startQuizBtn.disabled = true;
            }
            
            // Reset state
            this.quizStarted = false;
            this.currentQuestionIndex = 0;
            
            // Load new questions
            console.log('Loading new set of questions...');
            this.allQuestions = await this.api.getQuizQuestions(this.quiz.quiz_id, true);
            
            if (!this.allQuestions || this.allQuestions.length === 0) {
                throw new Error('No questions available');
            }
            
            console.log(`Loaded ${this.allQuestions.length} new questions`);
            
            // Reset answers array
            this.userAnswers = [];
            
            // Enable start button
            if (this.startQuizBtn) {
                this.startQuizBtn.textContent = 'Start Quiz';
                this.startQuizBtn.disabled = false;
            }
        } catch (error) {
            this.handleError(error, 'Failed to load new questions. Please try again.');
            
            // Enable start button
            if (this.startQuizBtn) {
                this.startQuizBtn.textContent = 'Start Quiz';
                this.startQuizBtn.disabled = false;
            }
        }
    }
    
    /**
     * Show rating modal
     */
    showRatingModal() {
        if (this.ratingModal) {
            this.ratingModal.classList.remove('hidden');
        }
    }
    
    /**
     * Hide rating modal
     */
    hideRatingModal() {
        if (this.ratingModal) {
            this.ratingModal.classList.add('hidden');
        }
    }
    
    /**
     * Submit rating
     */
    async submitRating() {
        if (this.selectedRating === 0) {
            return;
        }
        
        if (!this.auth || !this.auth.isAuthenticated()) {
            alert('You need to be logged in to rate this quiz.');
            this.hideRatingModal();
            return;
        }
        
        const comment = this.ratingComment ? this.ratingComment.value : '';
        
        try {
            await this.api.rateQuiz(this.quiz.quiz_id, this.selectedRating, comment);
            alert('Thank you for your rating!');
            this.hideRatingModal();
        } catch (error) {
            this.handleError(error, 'Failed to submit rating. Please try again.');
        }
    }
    
    /**
     * Show login modal
     */
    showLoginModal() {
        if (this.loginModal) {
            this.loginModal.classList.remove('hidden');
        }
    }
    
    /**
     * Hide login modal
     */
    hideLoginModal() {
        if (this.loginModal) {
            this.loginModal.classList.add('hidden');
        }
    }
    
    /**
     * Handle login form submission
     */
    async handleLogin() {
        try {
            const emailElement = document.getElementById('email');
            const passwordElement = document.getElementById('password');
            
            if (!emailElement || !passwordElement) {
                alert('Login form is missing required fields');
                return;
            }
            
            const email = emailElement.value;
            const password = passwordElement.value;
            
            if (!email || !password) {
                alert('Please enter email and password');
                return;
            }
            
            const credentials = { email, password };
            console.log(`Attempting login for: ${email}`);
            
            // Show loading state
            if (this.signInBtn) {
                this.signInBtn.textContent = 'Signing in...';
                this.signInBtn.disabled = true;
            }
            
            // Login
            const userData = await this.api.login(credentials);
            console.log('Login successful');
            
            // Hide modal and update UI
            this.hideLoginModal();
            
            // Refresh page to update UI
            window.location.reload();
        } catch (error) {
            this.handleError(error, 'Login failed. Please check your credentials and try again.');
            
            // Reset button
            if (this.signInBtn) {
                this.signInBtn.textContent = 'Sign in';
                this.signInBtn.disabled = false;
            }
        }
    }
    
    /**
     * Handle error
     * @param {Error} error - Error object
     * @param {string} message - User-friendly error message
     */
    handleError(error, message) {
        console.error(error);
        alert(message || 'An error occurred. Please try again later.');
    }
}

// Initialize Quiz Page Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Quiz Page Manager');
    window.quizPage = new QuizPageManager();
});