/**
 * Enhanced quiz logic with statistics tracking, adaptive learning, and more
 */

// Quiz state
let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let userConfidenceRatings = [];
let quizStartTime = 0;
let quizTimeSpent = 0;
let timeLimitPerQuestion = 0;
let questionTimer = null;

// DOM References
const startBtn = document.getElementById('startBtn');
const reviewBtn = document.getElementById('reviewBtn');
const backToWelcomeBtn = document.getElementById('backToWelcomeBtn');
const startQuizBtn = document.getElementById('startQuizBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const newQuizBtn = document.getElementById('newQuizBtn');
const focusWeaknessBtn = document.getElementById('focusWeaknessBtn');
const backToHomeBtn = document.getElementById('backToHomeBtn');
const practiceSelectedBtn = document.getElementById('practiceSelectedBtn');
const newRandomBtn = document.getElementById('newRandomBtn');

/**
 * Initialize the quiz system
 */
function init() {
    setupEventListeners();
}

/**
 * Set up all event listeners for the quiz interface
 */
function setupEventListeners() {
    // Welcome screen buttons
    if (startBtn) {
        startBtn.addEventListener('click', () => UI.showScreen('chapterSelection'));
    }
    
    if (reviewBtn) {
        reviewBtn.addEventListener('click', () => {
            Statistics.populateReviewMistakesScreen();
            UI.showScreen('reviewMistakesScreen');
        });
    }
    
    // Chapter selection screen buttons
    if (backToWelcomeBtn) {
        backToWelcomeBtn.addEventListener('click', () => UI.showScreen('welcomeScreen'));
    }
    
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', startQuiz);
    }
    
    // Quiz screen buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', nextQuestion);
    }
    
    // Results screen buttons
    if (restartBtn) {
        restartBtn.addEventListener('click', restartQuiz);
    }
    
    if (newQuizBtn) {
        newQuizBtn.addEventListener('click', () => {
            Statistics.initializeStats(); // Refresh stats before returning to welcome screen
            UI.showScreen('welcomeScreen');
        });
    }
    
    if (focusWeaknessBtn) {
        focusWeaknessBtn.addEventListener('click', startWeaknessQuiz);
    }
    
    // Review mistakes screen buttons
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', () => UI.showScreen('welcomeScreen'));
    }
    
    if (practiceSelectedBtn) {
        practiceSelectedBtn.addEventListener('click', practiceSelectedQuestions);
    }

    if (newRandomBtn) {
        newRandomBtn.addEventListener('click', function() {
            // Go back to chapter selection to start a completely new quiz
            UI.showScreen('chapterSelection');
        });
    }
}

/**
 * Initialize chapter selection UI
 */
function initChapterSelectionUI() {
    const chapterOptionsContainer = document.getElementById('chapterOptionsContainer');
    
    if (!chapterOptionsContainer) return;
    
    chapterOptionsContainer.innerHTML = '';
    
    // Create checkboxes for each chapter
    availableChapters.forEach(chapter => {
        if (!chapter.enabled) return;
        
        const checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'chapter-checkbox';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${chapter.id}Checkbox`;
        checkbox.dataset.chapterId = chapter.id;
        checkbox.checked = true;
        
        const label = document.createElement('label');
        label.htmlFor = `${chapter.id}Checkbox`;
        label.textContent = chapter.title;
        
        checkboxDiv.appendChild(checkbox);
        checkboxDiv.appendChild(label);
        chapterOptionsContainer.appendChild(checkboxDiv);
    });
}

/**
 * Get selected quiz mode
 * @returns {string} The selected quiz mode ('standard', 'adaptive', or 'review')
 */
function getSelectedQuizMode() {
    const selectedMode = document.querySelector('.mode-option.selected');
    return selectedMode ? selectedMode.dataset.mode : 'standard';
}

/**
 * Get selected chapters
 * @returns {Array} Array of selected chapter IDs
 */
function getSelectedChapters() {
    const selectedChapters = [];
    const chapterCheckboxes = document.querySelectorAll('.chapter-checkbox input[type="checkbox"]');
    
    chapterCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedChapters.push(checkbox.dataset.chapterId);
        }
    });
    
    return selectedChapters;
}

/**
 * Start a new quiz
 */
function startQuiz() {
    // Get quiz settings
    const quizMode = getSelectedQuizMode();
    const selectedChapters = getSelectedChapters();
    const questionCount = document.getElementById('questionCount').value;
    timeLimitPerQuestion = parseInt(document.getElementById('timeLimit').value, 10) || 0;
    
    
    // Check if at least one chapter is selected
    if (selectedChapters.length === 0) {
        alert('Please select at least one chapter');
        return;
    }
    
    // Initialize quiz based on mode
    let questions = [];
    
    switch (quizMode) {
        case 'adaptive':
            // Get questions focusing on weak areas
            questions = Storage.getWeaknessQuestions(
                questionCount === 'all' ? 100 : parseInt(questionCount, 10),
                selectedChapters
            );
            break;
            
        case 'review':
            // Get questions the user has previously missed
            const missedQuestions = Storage.getMissedQuestions();
            questions = missedQuestions
                .filter(q => {
                    // Check if the chapter is in the selected chapters
                    const chapterId = availableChapters.find(c => c.title === q.chapter)?.id;
                    return chapterId && selectedChapters.includes(chapterId);
                })
                .map(q => {
                    // Remove the added properties from missed questions
                    const { userAnswer, timestamp, count, ...question } = q;
                    return question;
                });
            break;
            
        case 'standard':
        default:
            // Get questions from selected chapters
            const allQuestions = [];
            selectedChapters.forEach(chapterId => {
                if (quizDataByChapter[chapterId]) {
                    allQuestions.push(...quizDataByChapter[chapterId]);
                }
            });
            
            // Shuffle questions and take the requested number
            questions = shuffleArray([...allQuestions]);
            if (questionCount !== 'all') {
                const count = Math.min(parseInt(questionCount, 10), questions.length);
                questions = questions.slice(0, count);
            }
            break;
    }
    
    // Check if we have questions
    if (questions.length === 0) {
        alert('No questions available for the selected chapters in this mode');
        return;
    }
    
    // Initialize quiz state
    currentQuestions = questions;
    currentQuestionIndex = 0;
    userAnswers = Array(questions.length).fill(null);
    userConfidenceRatings = Array(questions.length).fill(0);
    quizStartTime = Date.now();
    quizTimeSpent = 0;
    
    // Update UI
    document.getElementById('totalQuestions').textContent = questions.length;
    document.getElementById('currentChapter').textContent = questions[0].chapter;    

    
    document.querySelector('.question-container').classList.remove('hidden');

    // Setup timer if enabled
    setupQuestionTimer();
    
    // Load first question
    loadQuestion();
    
    // Show quiz container
    UI.showScreen('quizContainer');
}

/**
 * Fisher-Yates shuffle algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Set up the question timer
 */
function setupQuestionTimer() {
    // Clear any existing timer
    clearInterval(questionTimer);
    
    // If time limit is set, start the timer
    if (timeLimitPerQuestion > 0) {
        const timerDisplay = document.getElementById('timerDisplay');
        const timeRemaining = document.getElementById('timeRemaining');
        
        if (timerDisplay && timeRemaining) {
            timerDisplay.classList.remove('hidden');
            timeRemaining.textContent = timeLimitPerQuestion;
            
            let secondsLeft = timeLimitPerQuestion;
            
            questionTimer = setInterval(() => {
                secondsLeft--;
                timeRemaining.textContent = secondsLeft;
                
                if (secondsLeft <= 10) {
                    timerDisplay.style.color = 'var(--incorrect-color)';
                }
                
                if (secondsLeft <= 0) {
                    clearInterval(questionTimer);
                    // Time's up - move to next question
                    nextQuestion();
                }
            }, 1000);
        }
    } else {
        // Hide timer display
        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay) {
            timerDisplay.classList.add('hidden');
        }
    }
}

/**
 * Load the current question
 */
function loadQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    
    // Update UI elements
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('progressBar').style.width = `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`;
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('currentChapter').textContent = question.chapter;
    
    // Reset confidence options
    document.querySelectorAll('.confidence-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Reset timer
    setupQuestionTimer();
    
    // Load options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        optionElement.dataset.index = index;
        
        // Check if this option was previously selected
        if (userAnswers[currentQuestionIndex] === index) {
            optionElement.classList.add('selected');
        }
        
        optionElement.addEventListener('click', selectOption);
        optionsContainer.appendChild(optionElement);
    });
    
    // Hide next button if no option is selected
    if (userAnswers[currentQuestionIndex] === null) {
        nextBtn.classList.add('hidden');
    } else {
        nextBtn.classList.remove('hidden');
    }
}

/**
 * Handle option selection
 * @param {Event} e - Click event
 */
function selectOption(e) {
    const selectedIndex = parseInt(e.target.dataset.index, 10);
    
    // Remove selected class from all options
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    e.target.classList.add('selected');
    
    // Save user's answer
    userAnswers[currentQuestionIndex] = selectedIndex;
    
    // Show next button
    nextBtn.classList.remove('hidden');
}

/**
 * Handle next button click
 */
function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentQuestions.length) {
        // Move to next question
        loadQuestion();        
       
    } else {
        // Quiz completed - show results
        showResults();
    }
}

/**
 * Show quiz results
 */
function showResults() {
    // Calculate results
    clearInterval(questionTimer);
    quizTimeSpent = Math.floor((Date.now() - quizStartTime) / 1000);
    
    let correctCount = 0;
    const quizResult = {
        questions: currentQuestions,
        userAnswers: userAnswers,
        userConfidenceRatings: userConfidenceRatings,
        timestamp: Date.now(),
        timeSpent: quizTimeSpent
    };
    
    userAnswers.forEach((answer, index) => {
        if (answer === currentQuestions[index].correctAnswer) {
            correctCount++;
        } else {
            // Save missed question
            Storage.saveMissedQuestion(currentQuestions[index], answer);
        }
    });
    
    quizResult.correctCount = correctCount;
    
    // Update result summary
    const scorePercentage = Math.round((correctCount / currentQuestions.length) * 100);
    document.getElementById('resultSummary').textContent = 
        `You scored ${correctCount} out of ${currentQuestions.length} (${scorePercentage}%)`;
    
    // Update result details
    const resultDetails = document.getElementById('resultDetails');
    resultDetails.innerHTML = '';
    
    currentQuestions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        
        const reviewQuestion = document.createElement('div');
        reviewQuestion.className = 'review-question';
        
        // Question text
        const questionTextElement = document.createElement('div');
        questionTextElement.className = 'review-question-text';
        questionTextElement.textContent = `${index + 1}. [${question.chapter}] ${question.question}`;
        reviewQuestion.appendChild(questionTextElement);
        
        // Options
        const reviewOptions = document.createElement('div');
        reviewOptions.className = 'review-options';
        
        question.options.forEach((option, optionIndex) => {
            const reviewOption = document.createElement('div');
            reviewOption.className = 'review-option';
            
            // Mark user selection and correct answer
            if (optionIndex === userAnswer) {
                // This is what the user selected
                if (isCorrect) {
                    // User selected the correct answer
                    reviewOption.classList.add('correct');
                    reviewOption.innerHTML = `✓ ${option}`;
                } else {
                    // User selected the wrong answer
                    reviewOption.classList.add('selected');
                    reviewOption.innerHTML = `❌ ${option}`;
                }
            } else if (optionIndex === question.correctAnswer) {
                // This is the correct answer (but not what the user selected)
                reviewOption.classList.add('correct');
                reviewOption.innerHTML = `✓ ${option}`;
            } else {
                // This is just a regular option
                reviewOption.textContent = option;
            }
            
            reviewOptions.appendChild(reviewOption);
        });
        
        reviewQuestion.appendChild(reviewOptions);
        
        // Explanation
        const explanation = document.createElement('div');
        explanation.className = 'explanation';
        explanation.textContent = question.explanation;
        reviewQuestion.appendChild(explanation);
        
        resultDetails.appendChild(reviewQuestion);
    });
    
    // Save quiz result
    Storage.saveQuizResult(quizResult);
    
    // Update statistics on results screen
    Statistics.updateResultsScreen(quizResult);
    
    // Show results container
    UI.showScreen('resultsContainer');
}

/**
 * Restart the quiz with the same questions but shuffled
 */
function restartQuiz() {
    // Shuffle the current questions
    currentQuestions = shuffleArray([...currentQuestions]);
    currentQuestionIndex = 0;
    userAnswers = Array(currentQuestions.length).fill(null);
    userConfidenceRatings = Array(currentQuestions.length).fill(0);
    quizStartTime = Date.now();
    
    // Update UI
    loadQuestion();
    
    // Show quiz container
    UI.showScreen('quizContainer');
}

/**
 * Start a quiz focusing on the user's weak areas
 */
function startWeaknessQuiz() {
    // Show chapter selection screen first
    UI.showScreen('chapterSelection');
    
    // After the screen is visible, set quiz mode to adaptive
    setTimeout(() => {
        const modeOptions = document.querySelectorAll('.mode-option');
        if (modeOptions && modeOptions.length > 0) {
            modeOptions.forEach(option => {
                option.classList.remove('selected');
                if (option.dataset.mode === 'adaptive') {
                    option.classList.add('selected');
                }
            });
        } else {
            console.error("Mode options not found in the DOM");
        }
        
        // Check if enableConfidence element exists before trying to check it
        const enableConfidenceElement = document.getElementById('enableConfidence');
        if (enableConfidenceElement) {
            enableConfidenceElement.checked = true;
        }
    }, 100); // Small delay to ensure DOM elements are available
}

/**
 * Practice selected questions from the review mistakes screen
 */
function practiceSelectedQuestions() {
    // This function would be implemented to start a quiz with selected questions
    alert('This feature is not yet implemented');
}

// Initialize the quiz system
document.addEventListener('DOMContentLoaded', function() {
    init();
    initChapterSelectionUI();
});