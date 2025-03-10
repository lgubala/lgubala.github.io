/**
 * Storage module for handling local persistence of quiz data
 */

const Storage = (function() {
    // Storage keys
    const KEYS = {
        QUIZ_HISTORY: 'pentestpro_quiz_history',
        MISSED_QUESTIONS: 'pentestpro_missed_questions',
        USER_SETTINGS: 'pentestpro_settings',
        STATS: 'pentestpro_stats',
        STREAK: 'pentestpro_streak',
        LAST_QUIZ_DATE: 'pentestpro_last_quiz_date',
        SAVED_QUIZZES: 'pentestpro_saved_quizzes',
        TEMP_QUIZZES: 'pentestpro_temp_quizzes',
        TEMP_QUIZ: 'pentestpro_temp_quiz'  // Legacy key for single temp quiz
    };
    
    /**
     * Get an item from localStorage, with optional default value if not found
     * @param {string} key - The storage key
     * @param {*} defaultValue - Default value to return if key doesn't exist
     * @returns {*} The stored value or default value
     */
    function get(key, defaultValue = null) {
        const data = localStorage.getItem(key);
        if (data === null) return defaultValue;
        
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error(`Error parsing data for key ${key}:`, e);
            return defaultValue;
        }
    }
    
    /**
     * Save an item to localStorage
     * @param {string} key - The storage key
     * @param {*} value - The value to store (will be JSON stringified)
     * @returns {boolean} True if successful, false otherwise
     */
    function save(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error(`Error saving data for key ${key}:`, e);
            return false;
        }
    }
    
    /**
     * Save quiz result to history
     * @param {Object} quizResult - The quiz result object
     */
    function saveQuizResult(quizResult) {
        const history = get(KEYS.QUIZ_HISTORY, []);
        
        // Add timestamp to the quiz result
        quizResult.timestamp = Date.now();
        
        // Add this quiz to history
        history.push(quizResult);
        save(KEYS.QUIZ_HISTORY, history);
        
        // Update streaks
        updateStreak();
        
        // Update statistics
        updateStatistics(quizResult);
    }
    
    /**
     * Save a missed question to the missed questions store
     * @param {Object} question - The question object
     * @param {number} userAnswer - The user's incorrect answer
     */
    function saveMissedQuestion(question, userAnswer) {
        const missedQuestions = get(KEYS.MISSED_QUESTIONS, []);
        
        // Check if this exact question is already in the missed questions
        const existingIndex = missedQuestions.findIndex(q => 
            q.question === question.question && 
            q.chapter === question.chapter
        );
        
        const missedQuestion = {
            ...question,
            userAnswer,
            timestamp: Date.now(),
            count: 1
        };
        
        if (existingIndex >= 0) {
            // Update existing entry
            missedQuestion.count = (missedQuestions[existingIndex].count || 0) + 1;
            missedQuestions[existingIndex] = missedQuestion;
        } else {
            // Add new entry
            missedQuestions.push(missedQuestion);
        }
        
        save(KEYS.MISSED_QUESTIONS, missedQuestions);
    }
    
    /**
     * Update the user's streak information
     */
    function updateStreak() {
        const lastQuizDate = get(KEYS.LAST_QUIZ_DATE, null);
        const currentDate = new Date().toDateString();
        let streak = get(KEYS.STREAK, 0);
        
        if (!lastQuizDate) {
            // First quiz ever
            streak = 1;
        } else {
            const lastDate = new Date(lastQuizDate);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastDate.toDateString() === yesterday.toDateString()) {
                // Last quiz was yesterday, increment streak
                streak++;
            } else if (lastDate.toDateString() === currentDate) {
                // Already took a quiz today, don't change streak
            } else {
                // Streak broken
                streak = 1;
            }
        }
        
        save(KEYS.STREAK, streak);
        save(KEYS.LAST_QUIZ_DATE, currentDate);
    }
    
    /**
     * Update global statistics based on quiz result
     * @param {Object} quizResult - The quiz result object
     */
    function updateStatistics(quizResult) {
        const stats = get(KEYS.STATS, {
            totalQuizzes: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            chapterPerformance: {}
        });
        
        // Update global stats
        stats.totalQuizzes++;
        stats.totalQuestions += quizResult.questions.length;
        stats.correctAnswers += quizResult.correctCount;
        
        // Update chapter performance
        quizResult.questions.forEach((question, index) => {
            const chapter = question.chapter;
            const isCorrect = quizResult.userAnswers[index] === question.correctAnswer;
            
            if (!stats.chapterPerformance[chapter]) {
                stats.chapterPerformance[chapter] = {
                    total: 0,
                    correct: 0
                };
            }
            
            stats.chapterPerformance[chapter].total++;
            
            if (isCorrect) {
                stats.chapterPerformance[chapter].correct++;
            }
        });
        
        save(KEYS.STATS, stats);
    }
    
    /**
     * Get user's global statistics
     * @returns {Object} The user's statistics
     */
    function getStatistics() {
        return get(KEYS.STATS, {
            totalQuizzes: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            chapterPerformance: {}
        });
    }
    
    /**
     * Get the user's current streak
     * @returns {number} Current streak
     */
    function getStreak() {
        return get(KEYS.STREAK, 0);
    }
    
    /**
     * Get all missed questions
     * @param {string} chapter - Optional chapter filter
     * @param {string} timeFilter - Optional time filter ('week', 'month', 'three_months')
     * @returns {Array} Array of missed questions
     */
    function getMissedQuestions(chapter = null, timeFilter = null) {
        let missedQuestions = get(KEYS.MISSED_QUESTIONS, []);
        
        // Apply chapter filter if specified
        if (chapter && chapter !== 'all') {
            missedQuestions = missedQuestions.filter(q => q.chapter === chapter);
        }
        
        // Apply time filter if specified
        if (timeFilter && timeFilter !== 'all') {
            const now = Date.now();
            let timeLimit;
            
            switch (timeFilter) {
                case 'week':
                    timeLimit = now - (7 * 24 * 60 * 60 * 1000); // 7 days
                    break;
                case 'month':
                    timeLimit = now - (30 * 24 * 60 * 60 * 1000); // 30 days
                    break;
                case 'three_months':
                    timeLimit = now - (90 * 24 * 60 * 60 * 1000); // 90 days
                    break;
            }
            
            missedQuestions = missedQuestions.filter(q => q.timestamp >= timeLimit);
        }
        
        // Sort by most recent
        return missedQuestions.sort((a, b) => b.timestamp - a.timestamp);
    }
    
    /**
     * Get questions based on user's weak areas
     * @param {number} count - Number of questions to return
     * @param {Array} chapterIds - Array of chapter IDs to consider
     * @returns {Array} Array of questions from weak areas
     */
    function getWeaknessQuestions(count, chapterIds) {
        const stats = getStatistics();
        const allQuestions = [];
        
        // Get all questions from selected chapters
        chapterIds.forEach(chapterId => {
            if (quizDataByChapter[chapterId]) {
                allQuestions.push(...quizDataByChapter[chapterId]);
            }
        });
        
        // Sort chapters by performance (worst first)
        const chapterPerformance = stats.chapterPerformance;
        const chapterScores = {};
        
        // Calculate score for each chapter
        Object.keys(chapterPerformance).forEach(chapter => {
            const data = chapterPerformance[chapter];
            chapterScores[chapter] = data.total > 0 
                ? (data.correct / data.total) * 100 
                : 100; // Default to 100% if no data
        });
        
        // If we also have missed questions, factor those in
        const missedQuestions = get(KEYS.MISSED_QUESTIONS, []);
        const missedQuestionIds = new Set();
        
        missedQuestions.forEach(q => {
            // Create a unique ID for each question based on its content
            const questionId = `${q.chapter}:${q.question}`;
            missedQuestionIds.add(questionId);
        });
        
        // Score and sort questions
        const scoredQuestions = allQuestions.map(question => {
            let score = chapterScores[question.chapter] || 100;
            
            // If this is a previously missed question, give it a lower score (higher priority)
            const questionId = `${question.chapter}:${question.question}`;
            if (missedQuestionIds.has(questionId)) {
                score -= 30; // Make missed questions more likely to be selected
            }
            
            return { question, score };
        });
        
        // Sort by score (ascending - lower scores first)
        scoredQuestions.sort((a, b) => a.score - b.score);
        
        // Return the requested number of questions
        return scoredQuestions.slice(0, count).map(sq => sq.question);
    }
    
    /**
     * Get quiz history
     * @returns {Array} Array of past quiz results
     */
    function getQuizHistory() {
        return get(KEYS.QUIZ_HISTORY, []);
    }
    
    /**
     * Clear all stored data
     */
    function clearAllData() {
        Object.values(KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }

    /**
     * Get saved quizzes
     * @returns {Array} Array of saved quizzes
     */
    function getSavedQuizzes() {
        return get(KEYS.SAVED_QUIZZES, []);
    }

    /**
     * Save a quiz to localStorage
     * @param {Object} quizData - Quiz data object containing id, title, and questions
     * @returns {boolean} Success status
     */
    function saveQuiz(quizData) {
        console.log(`Storage.saveQuiz: Saving quiz "${quizData.title}" with ID "${quizData.id}"`);
        
        if (!quizData.id || !quizData.title || !Array.isArray(quizData.questions)) {
            console.error("Invalid quiz data", quizData);
            return false;
        }
        
        try {
            // Get existing saved quizzes
            const savedQuizzes = getSavedQuizzes();
            
            // Add timestamp if not present
            if (!quizData.createdAt) {
                quizData.createdAt = new Date().toISOString();
            }
            
            // Add description if not present
            if (!quizData.description) {
                quizData.description = `${quizData.questions.length} questions about ${quizData.title}`;
            }
            
            // Check if this quiz already exists
            const existingIndex = savedQuizzes.findIndex(quiz => quiz.id === quizData.id);
            
            if (existingIndex >= 0) {
                // Update existing quiz
                quizData.updatedAt = new Date().toISOString();
                savedQuizzes[existingIndex] = quizData;
            } else {
                // Add new quiz
                savedQuizzes.push(quizData);
            }
            
            // Save back to localStorage
            return save(KEYS.SAVED_QUIZZES, savedQuizzes);
        } catch (e) {
            console.error("Error saving quiz:", e);
            return false;
        }
    }

    /**
     * Delete a saved quiz
     * @param {string} quizId - ID of the quiz to delete
     * @returns {boolean} Success status
     */
    function deleteSavedQuiz(quizId) {
        try {
            const savedQuizzes = getSavedQuizzes();
            const newSavedQuizzes = savedQuizzes.filter(quiz => quiz.id !== quizId);
            
            if (newSavedQuizzes.length === savedQuizzes.length) {
                // Quiz not found
                return false;
            }
            
            return save(KEYS.SAVED_QUIZZES, newSavedQuizzes);
        } catch (e) {
            console.error("Error deleting quiz:", e);
            return false;
        }
    }

    /**
     * Save a temporary quiz
     * @param {Object} quizData - Quiz data object
     * @returns {boolean} Success status
     */
    function saveTempQuiz(quizData) {
        console.log(`Storage.saveTempQuiz: Saving temporary quiz "${quizData.title}"`);
        
        try {
            // Get existing temp quizzes
            let tempQuizzes = get(KEYS.TEMP_QUIZZES, []);
            
            // Check if this quiz already exists
            const existingIndex = tempQuizzes.findIndex(quiz => quiz.id === quizData.id);
            
            if (existingIndex >= 0) {
                // Update existing quiz
                tempQuizzes[existingIndex] = quizData;
            } else {
                // Add new quiz
                tempQuizzes.push(quizData);
            }
            
            // Save the array back to localStorage
            const tempQuizzesSaved = save(KEYS.TEMP_QUIZZES, tempQuizzes);
            
            // Also save as single quiz for backward compatibility
            const singleTempQuizSaved = save(KEYS.TEMP_QUIZ, quizData);
            
            return tempQuizzesSaved && singleTempQuizSaved;
        } catch (e) {
            console.error("Error saving temp quiz:", e);
            return false;
        }
    }

    /**
     * Get temporary quizzes
     * @returns {Array} Array of temporary quizzes
     */
    function getTempQuizzes() {
        let tempQuizzes = get(KEYS.TEMP_QUIZZES, []);
        
        // If no multi-quiz format, check for single temp quiz
        if (tempQuizzes.length === 0) {
            const singleTempQuiz = get(KEYS.TEMP_QUIZ, null);
            if (singleTempQuiz && singleTempQuiz.id && Array.isArray(singleTempQuiz.questions)) {
                tempQuizzes = [singleTempQuiz];
            }
        }
        
        return tempQuizzes;
    }
    
    // Public API
    return {
        saveQuizResult,
        saveMissedQuestion,
        getStatistics,
        getStreak,
        getMissedQuestions,
        getWeaknessQuestions,
        getQuizHistory,
        clearAllData,
        
        // New quiz management methods
        getSavedQuizzes,
        saveQuiz,
        deleteSavedQuiz,
        saveTempQuiz,
        getTempQuizzes,
        
        // Expose the general storage methods for direct use
        get,
        save
    };
})();