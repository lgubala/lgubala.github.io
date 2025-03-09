/**
 * Main quiz logic and event handlers
 */

// DOM elements
const welcomeScreen = document.getElementById('welcomeScreen');
const chapterSelection = document.getElementById('chapterSelection');
const quizContainer = document.getElementById('quizContainer');
const resultsContainer = document.getElementById('resultsContainer');
const startBtn = document.getElementById('startBtn');
const backToWelcomeBtn = document.getElementById('backToWelcomeBtn');
const startQuizBtn = document.getElementById('startQuizBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const newQuizBtn = document.getElementById('newQuizBtn');
const currentQuestionElement = document.getElementById('currentQuestion');
const totalQuestionsElement = document.getElementById('totalQuestions');
const progressBar = document.getElementById('progressBar');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const resultSummary = document.getElementById('resultSummary');
const resultDetails = document.getElementById('resultDetails');
const chapterOptionsContainer = document.getElementById('chapterOptionsContainer');

// Quiz state
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let chapterCheckboxes = {};

/**
 * Debug function to help identify issues
 */
function debugQuizState() {
    console.log("Current questions array:", currentQuestions);
    console.log("Current question index:", currentQuestionIndex);
    console.log("Available chapters:", availableChapters);
    console.log("Quiz data by chapter:", quizDataByChapter);
    
    if (currentQuestions.length > 0) {
        console.log("First question in array:", currentQuestions[0]);
    } else {
        console.log("Questions array is empty!");
    }
}

/**
 * Initialize the chapter selection interface
 */
function initChapterSelectionUI() {
    // Make sure quizDataByChapter is initialized
    if (typeof quizDataByChapter !== 'object') {
        console.error("quizDataByChapter is not properly initialized!");
        quizDataByChapter = {};
    }
    
    // Check if availableChapters is defined
    if (!Array.isArray(availableChapters)) {
        console.error("availableChapters is not properly defined!");
        return;
    }
    
    chapterOptionsContainer.innerHTML = '';
    
    // Create a checkbox for each available chapter
    availableChapters.forEach(chapter => {
        if (!chapter.enabled) return; // Skip disabled chapters
        
        // Verify if the chapter data actually exists
        if (!quizDataByChapter[chapter.id] || !Array.isArray(quizDataByChapter[chapter.id]) || quizDataByChapter[chapter.id].length === 0) {
            console.warn(`Chapter ${chapter.id} has no questions or is improperly defined!`);
            // Still create the checkbox, but might want to disable it or add a warning
        }
        
        const checkboxDiv = document.createElement('div');
        checkboxDiv.classList.add('chapter-checkbox');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${chapter.id}Chapter`;
        checkbox.checked = true; // Default to checked
        chapterCheckboxes[chapter.id] = checkbox;
        
        const label = document.createElement('label');
        label.htmlFor = `${chapter.id}Chapter`;
        label.textContent = chapter.title;
        
        checkboxDiv.appendChild(checkbox);
        checkboxDiv.appendChild(label);
        chapterOptionsContainer.appendChild(checkboxDiv);
    });
}

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Initialize quiz with selected chapters and questions
 */
function initQuiz() {
    // Get selected chapters
    let selectedQuestions = [];
    
    // Check if any chapter is selected by iterating through checkboxes
    let anyChapterSelected = false;
    
    // Sanity check
    if (!Array.isArray(availableChapters)) {
        console.error("availableChapters is not properly defined!");
        alert("An error occurred. Please refresh the page and try again.");
        return;
    }
    
    availableChapters.forEach(chapter => {
        if (chapter.enabled && chapterCheckboxes[chapter.id] && chapterCheckboxes[chapter.id].checked) {
            // Verify that this chapter's questions exist
            if (quizDataByChapter[chapter.id] && Array.isArray(quizDataByChapter[chapter.id])) {
                selectedQuestions = selectedQuestions.concat(quizDataByChapter[chapter.id]);
                anyChapterSelected = true;
            } else {
                console.warn(`Tried to select chapter ${chapter.id} but its questions are not properly defined!`);
            }
        }
    });
    
    // Debug logging
    console.log("Selected questions:", selectedQuestions);
    
    // Check if at least one chapter is selected
    if (!anyChapterSelected || selectedQuestions.length === 0) {
        alert("Please select at least one chapter with available questions");
        return;
    }
    
    // Get number of questions
    const questionCount = parseInt(document.getElementById('questionCount').value);
    
    // If requested number of questions is more than available questions
    const actualQuestionCount = Math.min(questionCount, selectedQuestions.length);
    
    // Select random questions from the selected chapters
    currentQuestions = shuffleArray([...selectedQuestions]).slice(0, actualQuestionCount);
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = Array(currentQuestions.length).fill(null);
    
    // Update UI
    totalQuestionsElement.textContent = currentQuestions.length;
    loadQuestion();
    
    // Show quiz container
    chapterSelection.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    resultsContainer.classList.add('hidden');
}

/**
 * Load current question
 */
function loadQuestion() {
    // Sanity check
    if (!Array.isArray(currentQuestions) || currentQuestions.length === 0) {
        console.error("No questions available to load!");
        debugQuizState();
        alert("An error occurred loading the questions. Please try again.");
        return;
    }
    
    // Check if index is valid
    if (currentQuestionIndex < 0 || currentQuestionIndex >= currentQuestions.length) {
        console.error(`Invalid question index: ${currentQuestionIndex}. Max index: ${currentQuestions.length - 1}`);
        debugQuizState();
        alert("An error occurred loading the current question. Please try again.");
        return;
    }
    
    const question = currentQuestions[currentQuestionIndex];
    
    // Make sure question is properly defined
    if (!question || typeof question !== 'object') {
        console.error("Current question is undefined or not an object:", question);
        debugQuizState();
        alert("An error occurred loading the current question. Please try again.");
        return;
    }
    
    // Update progress
    currentQuestionElement.textContent = currentQuestionIndex + 1;
    progressBar.style.width = `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`;
    
    // Load question text
    questionText.textContent = `${currentQuestionIndex + 1}. [${question.chapter}] ${question.question}`;
    
    // Load options
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
 */
function selectOption(e) {
    const selectedIndex = parseInt(e.target.dataset.index);
    
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
        loadQuestion();
    } else {
        showResults();
    }
}

/**
 * Show quiz results
 */
function showResults() {
    // Calculate score
    score = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === currentQuestions[index].correctAnswer) {
            score++;
        }
    });
    
    // Update result summary
    resultSummary.textContent = `You scored ${score} out of ${currentQuestions.length} (${Math.round((score / currentQuestions.length) * 100)}%)`;
    
    // Generate result details
    resultDetails.innerHTML = '';
    currentQuestions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        
        const reviewQuestion = document.createElement('div');
        reviewQuestion.classList.add('review-question');
        
        // Question text with chapter
        const questionTextElement = document.createElement('div');
        questionTextElement.classList.add('review-question-text');
        questionTextElement.textContent = `${index + 1}. [${question.chapter}] ${question.question}`;
        reviewQuestion.appendChild(questionTextElement);
        
        // Options
        const reviewOptions = document.createElement('div');
        reviewOptions.classList.add('review-options');
        
        question.options.forEach((option, optionIndex) => {
            const reviewOption = document.createElement('div');
            reviewOption.classList.add('review-option');
            
            // Mark user selection and correct answer
            if (optionIndex === userAnswer) {
                reviewOption.classList.add('selected');
                if (!isCorrect) {
                    reviewOption.innerHTML = `❌ ${option}`;
                } else {
                    reviewOption.innerHTML = `✓ ${option}`;
                }
            } else if (optionIndex === question.correctAnswer) {
                reviewOption.classList.add('correct');
                reviewOption.innerHTML = `✓ ${option}`;
            } else {
                reviewOption.textContent = option;
            }
            
            reviewOptions.appendChild(reviewOption);
        });
        
        reviewQuestion.appendChild(reviewOptions);
        
        // Explanation
        const explanation = document.createElement('div');
        explanation.classList.add('explanation');
        explanation.textContent = question.explanation;
        reviewQuestion.appendChild(explanation);
        
        resultDetails.appendChild(reviewQuestion);
    });
    
    // Show results container
    quizContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
}

/**
 * Handle restart button click
 */
function restartQuiz() {
    // Restart with the same questions but shuffle them
    currentQuestions = shuffleArray([...currentQuestions]);
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = Array(currentQuestions.length).fill(null);
    
    // Update UI
    loadQuestion();
    
    // Show quiz container
    resultsContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
}

/**
 * Event listeners
 */
function setupEventListeners() {
    startBtn.addEventListener('click', function() {
        welcomeScreen.classList.add('hidden');
        chapterSelection.classList.remove('hidden');
    });
    
    backToWelcomeBtn.addEventListener('click', function() {
        chapterSelection.classList.add('hidden');
        welcomeScreen.classList.remove('hidden');
    });
    
    startQuizBtn.addEventListener('click', initQuiz);
    nextBtn.addEventListener('click', nextQuestion);
    
    restartBtn.addEventListener('click', restartQuiz);
    
    newQuizBtn.addEventListener('click', function() {
        resultsContainer.classList.add('hidden');
        chapterSelection.classList.remove('hidden');
    });
}

/**
 * Initialize the quiz system
 */
function init() {
    // Add some simple error handling for global variables
    if (typeof quizDataByChapter !== 'object') {
        console.error("quizDataByChapter is not defined! Check that chapters.js and question files are loaded correctly.");
        quizDataByChapter = {};
    }
    
    if (!Array.isArray(availableChapters)) {
        console.error("availableChapters is not defined! Check that chapters.js is loaded correctly.");
        return;
    }
    
    initChapterSelectionUI();
    setupEventListeners();
}

// Start the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);