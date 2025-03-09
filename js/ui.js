/**
 * UI module for handling UI interactions and theme
 */

const UI = (function() {
    /**
     * Initialize UI event handlers
     */
    function init() {
        // Set up dark mode toggle
        initDarkModeToggle();
        
        // Set up quiz mode selector
        initModeSelector();
        
        // Set up review screen filters
        initReviewFilters();
        
        // Set up confidence rating
        initConfidenceRating();
        
        // Initialize statistics display
        Statistics.initializeStats();
        
        // Check if dark mode is already enabled
        applyThemePreference();
    }
    
    /**
     * Initialize dark mode toggle
     */
    function initDarkModeToggle() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', toggleDarkMode);
            
            // Update icon based on current mode
            updateDarkModeIcon();
        }
    }
    
    /**
     * Toggle dark mode
     */
    function toggleDarkMode() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        updateDarkModeIcon();
    }
    
    /**
     * Update dark mode icon based on current state
     */
    function updateDarkModeIcon() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        if (darkModeToggle) {
            darkModeToggle.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
    
    /**
     * Apply theme preference based on local storage or system preference
     */
    function applyThemePreference() {
        const savedPreference = localStorage.getItem('darkMode');
        
        if (savedPreference === 'true') {
            document.body.classList.add('dark-mode');
        } else if (savedPreference === 'false') {
            document.body.classList.remove('dark-mode');
        } else {
            // If no saved preference, check system preference
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDarkMode) {
                document.body.classList.add('dark-mode');
            }
        }
        
        updateDarkModeIcon();
    }
    
    /**
     * Initialize quiz mode selector
     */
    function initModeSelector() {
        const modeOptions = document.querySelectorAll('.mode-option');
        
        modeOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove selected class from all options
                modeOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                this.classList.add('selected');
                
                // Enable/disable confidence rating based on mode
                toggleConfidenceRating(this.dataset.mode === 'adaptive');
            });
        });
    }
    
    /**
     * Enable or disable confidence rating
     * @param {boolean} enable - Whether to enable confidence rating
     */
    function toggleConfidenceRating(enable) {
        const confidenceCheckbox = document.getElementById('enableConfidence');
        
        if (confidenceCheckbox) {
            confidenceCheckbox.checked = enable;
        }
    }
    
    /**
     * Initialize confidence rating system
     */
    function initConfidenceRating() {
        const confidenceOptions = document.querySelectorAll('.confidence-option');
        
        confidenceOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove selected class from all options
                confidenceOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                this.classList.add('selected');
                
                // Store confidence value
                const confidenceValue = parseInt(this.dataset.confidence, 10);
                
                // After selecting confidence, proceed to the question
                document.getElementById('confidenceRating').classList.add('hidden');
                document.querySelector('.question-container').classList.remove('hidden');
            });
        });
    }
    
    /**
     * Initialize review screen filters
     */
    function initReviewFilters() {
        const chapterFilter = document.getElementById('chapterFilter');
        const dateFilter = document.getElementById('dateFilter');
        
        const updateFilters = () => {
            const chapter = chapterFilter.value;
            const timeFilter = dateFilter.value;
            
            // Apply filters
            const missedQuestions = Storage.getMissedQuestions(chapter, timeFilter);
            updateMissedQuestionsList(missedQuestions);
        };
        
        if (chapterFilter) {
            chapterFilter.addEventListener('change', updateFilters);
        }
        
        if (dateFilter) {
            dateFilter.addEventListener('change', updateFilters);
        }
    }
    
    /**
     * Update the missed questions list based on filters
     * @param {Array} missedQuestions - Filtered missed questions
     */
    function updateMissedQuestionsList(missedQuestions) {
        const missedQuestionsElement = document.getElementById('missedQuestions');
        
        if (!missedQuestionsElement) return;
        
        // Clear existing content
        missedQuestionsElement.innerHTML = '';
        
        if (missedQuestions.length === 0) {
            // No missed questions matching filters
            const noMistakesMessage = document.createElement('div');
            noMistakesMessage.className = 'no-mistakes-message';
            noMistakesMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>No questions found matching these filters.</p>
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
     * Show a specific screen and hide others
     * @param {string} screenId - ID of the screen to show
     */
    function showScreen(screenId) {
        const screens = [
            'welcomeScreen',
            'chapterSelection',
            'quizContainer',
            'resultsContainer',
            'reviewMistakesScreen'
        ];
        
        screens.forEach(screen => {
            const element = document.getElementById(screen);
            if (element) {
                if (screen === screenId) {
                    element.classList.remove('hidden');
                } else {
                    element.classList.add('hidden');
                }
            }
        });
    }
    
    // Public API
    return {
        init,
        showScreen
    };
})();

// Initialize UI when DOM is loaded
document.addEventListener('DOMContentLoaded', UI.init);