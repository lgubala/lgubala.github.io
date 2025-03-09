/**
 * Statistics module for handling and displaying performance data
 */

const Statistics = (function() {
    /**
     * Initialize statistics on the welcome screen
     */
    function initializeStats() {
        updateOverviewStats();
        updateChapterPerformance();
    }
    
    /**
     * Update the overview statistics on the welcome screen
     */
    function updateOverviewStats() {
        const stats = Storage.getStatistics();
        const streak = Storage.getStreak();
        
        // Update UI elements with stats data
        const quizzesCompletedElement = document.getElementById('quizzesCompleted');
        const overallScoreElement = document.getElementById('overallScore');
        const currentStreakElement = document.getElementById('currentStreak');
        
        if (quizzesCompletedElement) {
            quizzesCompletedElement.textContent = stats.totalQuizzes;
        }
        
        if (overallScoreElement) {
            const overallScore = stats.totalQuestions > 0 
                ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) 
                : 0;
            overallScoreElement.textContent = `${overallScore}%`;
        }
        
        if (currentStreakElement) {
            currentStreakElement.textContent = streak === 1 
                ? `${streak} day` 
                : `${streak} days`;
        }
    }
    
    /**
     * Update the chapter performance bars on the welcome screen
     */
    function updateChapterPerformance() {
        const stats = Storage.getStatistics();
        const chapterBarsElement = document.getElementById('chapterBars');
        
        if (!chapterBarsElement) return;
        
        // Clear existing bars
        chapterBarsElement.innerHTML = '';
        
        // Get all available chapters from the global availableChapters array
        if (!Array.isArray(availableChapters)) {
            console.error("availableChapters is not defined or not an array!");
            return;
        }
        
        // Add bars for each chapter
        availableChapters.forEach(chapter => {
            if (!chapter.enabled) return;
            
            const chapterId = chapter.id;
            const chapterTitle = chapter.title;
            
            // Get chapter performance data
            const chapterData = stats.chapterPerformance[chapterTitle] || { total: 0, correct: 0 };
            const score = chapterData.total > 0 
                ? Math.round((chapterData.correct / chapterData.total) * 100) 
                : 0;
            
            // Create chapter bar element
            const chapterBar = document.createElement('div');
            chapterBar.className = 'chapter-bar';
            
            // Add chapter info
            const chapterInfo = document.createElement('div');
            chapterInfo.className = 'chapter-info';
            
            const chapterName = document.createElement('div');
            chapterName.className = 'chapter-name';
            chapterName.textContent = chapterTitle;
            
            const chapterScore = document.createElement('div');
            chapterScore.className = 'chapter-score';
            chapterScore.textContent = chapterData.total > 0 
                ? `${score}% (${chapterData.correct}/${chapterData.total})` 
                : 'No data';
            
            chapterInfo.appendChild(chapterName);
            chapterInfo.appendChild(chapterScore);
            chapterBar.appendChild(chapterInfo);
            
            // Add progress bar
            const progressBar = document.createElement('div');
            progressBar.className = 'chapter-progress';
            
            const progressFill = document.createElement('div');
            progressFill.className = 'chapter-progress-fill';
            progressFill.style.width = `${score}%`;
            progressFill.style.backgroundColor = getScoreColor(score);
            
            progressBar.appendChild(progressFill);
            chapterBar.appendChild(progressBar);
            
            // Add to container
            chapterBarsElement.appendChild(chapterBar);
        });
    }
    
    /**
     * Get an appropriate color for a score value
     * @param {number} score - The score value (0-100)
     * @returns {string} CSS color value
     */
    function getScoreColor(score) {
        if (score < 60) return '#ef4444'; // Red
        if (score < 80) return '#f59e0b'; // Orange
        return '#10b981'; // Green
    }
    
    /**
     * Analyze quiz results to identify weakness areas
     * @param {Object} quizResult - The quiz result object
     * @returns {Array} Array of weakness tags
     */
    function analyzeWeaknesses(quizResult) {
        const weaknesses = [];
        const chapterMistakes = {};
        
        // Count mistakes by chapter
        quizResult.questions.forEach((question, index) => {
            const isCorrect = quizResult.userAnswers[index] === question.correctAnswer;
            
            if (!isCorrect) {
                if (!chapterMistakes[question.chapter]) {
                    chapterMistakes[question.chapter] = 0;
                }
                chapterMistakes[question.chapter]++;
            }
        });
        
        // Calculate chapter weakness percentages
        const chapterWeaknesses = [];
        for (const chapter in chapterMistakes) {
            const chapterQuestions = quizResult.questions.filter(q => q.chapter === chapter).length;
            const mistakePercentage = (chapterMistakes[chapter] / chapterQuestions) * 100;
            
            if (mistakePercentage >= 50) {
                chapterWeaknesses.push({
                    chapter,
                    percentage: mistakePercentage
                });
            }
        }
        
        // Sort by percentage (highest first)
        chapterWeaknesses.sort((a, b) => b.percentage - a.percentage);
        
        // Add chapter weaknesses to the list
        chapterWeaknesses.forEach(weakness => {
            weaknesses.push({
                type: 'chapter',
                name: weakness.chapter,
                text: `${weakness.chapter}: ${Math.round(weakness.percentage)}% mistakes`
            });
        });
        
        return weaknesses;
    }
    
    /**
     * Update the weakness analysis in the results screen
     * @param {Array} weaknesses - Array of weakness objects
     */
    function updateWeaknessAnalysis(weaknesses) {
        const weaknessTagsElement = document.getElementById('weaknessTags');
        
        if (!weaknessTagsElement) return;
        
        // Clear existing tags
        weaknessTagsElement.innerHTML = '';
        
        if (weaknesses.length === 0) {
            // No significant weaknesses found
            const noWeakness = document.createElement('div');
            noWeakness.style.textAlign = 'center';
            noWeakness.style.padding = '10px';
            noWeakness.innerHTML = '<i class="fas fa-check-circle" style="color: var(--correct-color); margin-right: 10px;"></i> No significant weaknesses identified. Great job!';
            weaknessTagsElement.appendChild(noWeakness);
            return;
        }
        
        // Add weakness tags
        weaknesses.forEach(weakness => {
            const tag = document.createElement('div');
            tag.className = 'weakness-tag';
            tag.textContent = weakness.text;
            weaknessTagsElement.appendChild(tag);
        });
    }
    
    /**
     * Update the results screen with statistics
     * @param {Object} quizResult - The quiz result object
     */
    function updateResultsScreen(quizResult) {
        const correctCount = quizResult.correctCount;
        const totalQuestions = quizResult.questions.length;
        const accuracy = Math.round((correctCount / totalQuestions) * 100);
        const timeSpent = quizResult.timeSpent || 0;
        
        // Update statistics elements
        document.getElementById('correctCount').textContent = correctCount;
        document.getElementById('incorrectCount').textContent = totalQuestions - correctCount;
        document.getElementById('accuracyValue').textContent = `${accuracy}%`;
        
        // Format time spent
        const minutes = Math.floor(timeSpent / 60);
        const seconds = timeSpent % 60;
        document.getElementById('timeSpent').textContent = minutes > 0 
            ? `${minutes}m ${seconds}s` 
            : `${seconds}s`;
        
        // Analyze weaknesses
        const weaknesses = analyzeWeaknesses(quizResult);
        updateWeaknessAnalysis(weaknesses);
    }
    
    /**
     * Populate the review mistakes screen
     */
    function populateReviewMistakesScreen() {
        const missedQuestions = Storage.getMissedQuestions();
        const missedQuestionsElement = document.getElementById('missedQuestions');
        const chapterFilterElement = document.getElementById('chapterFilter');
        
        if (!missedQuestionsElement || !chapterFilterElement) return;
        
        // Clear existing content
        missedQuestionsElement.innerHTML = '';
        
        // Populate chapter filter
        populateChapterFilter(chapterFilterElement, missedQuestions);
        
        if (missedQuestions.length === 0) {
            // No missed questions
            const noMistakesMessage = document.createElement('div');
            noMistakesMessage.className = 'no-mistakes-message';
            noMistakesMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>Great job! You haven't missed any questions yet.</p>
            `;
            missedQuestionsElement.appendChild(noMistakesMessage);
            return;
        }
        
        // Add missed questions
        missedQuestions.forEach(question => {
            const item = document.createElement('div');
            item.className = 'missed-question-item';
            item.dataset.id = `${question.chapter}:${question.question}`;
            
            // Format date
            const date = new Date(question.timestamp);
            const formattedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
            
            item.innerHTML = `
                <div class="missed-info">
                    <div class="missed-question-text">${question.question}</div>
                    <div class="missed-meta">
                        <span>${question.chapter}</span>
                        <span>Missed ${question.count} times</span>
                        <span>Last: ${formattedDate}</span>
                    </div>
                </div>
                <div class="missed-actions">
                    <button type="button" class="practice-btn" title="Practice this question">
                        <i class="fas fa-redo"></i>
                    </button>
                    <button type="button" class="view-btn" title="View details">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            `;
            
            // Add click handlers
            const practiceBtn = item.querySelector('.practice-btn');
            const viewBtn = item.querySelector('.view-btn');
            
            if (practiceBtn) {
                practiceBtn.addEventListener('click', () => {
                    // Logic to practice this specific question
                    console.log('Practice question:', question);
                });
            }
            
            if (viewBtn) {
                viewBtn.addEventListener('click', () => {
                    // Logic to view question details
                    console.log('View question details:', question);
                });
            }
            
            missedQuestionsElement.appendChild(item);
        });
    }
    
    /**
     * Populate the chapter filter in the review mistakes screen
     * @param {HTMLElement} filterElement - The filter select element
     * @param {Array} missedQuestions - Array of missed questions
     */
    function populateChapterFilter(filterElement, missedQuestions) {
        // Clear existing options except "All Chapters"
        while (filterElement.options.length > 1) {
            filterElement.remove(1);
        }
        
        // Get unique chapters from missed questions
        const chapters = [...new Set(missedQuestions.map(q => q.chapter))];
        
        // Add chapter options
        chapters.forEach(chapter => {
            const option = document.createElement('option');
            option.value = chapter;
            option.textContent = chapter;
            filterElement.appendChild(option);
        });
    }
    
    // Public API
    return {
        initializeStats,
        updateOverviewStats,
        updateChapterPerformance,
        updateResultsScreen,
        populateReviewMistakesScreen,
        analyzeWeaknesses
    };
})();