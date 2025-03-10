/**
 * Simple chapter management for PentestPro
 * Handles both hardcoded and user-uploaded chapters
 */

// Define the built-in chapters
const availableChapters = [
    {
        id: 'footprintingScanning',
        title: 'Footprinting & Scanning',
        description: 'Network mapping, port scanning, host discovery techniques',
        enabled: true
    },
    {
        id: 'informationGathering',
        title: 'Information Gathering',
        description: 'Passive and active reconnaissance, DNS enumeration, Whois lookup',
        enabled: true
    }
];

// Global object to hold question data
let quizDataByChapter = {};

// Chapter manager
const ChapterManager = {
    // Initialize
    init: function() {
        // Load hardcoded chapter questions from global variables
        this.loadHardcodedChapters();
        
        // Load user-created quizzes
        this.loadUserQuizzes();
        
        // Handle newly uploaded quizzes
        this.detectNewQuizzes();
        
        // Render chapter options (for the new UI style)
        this.renderChapterOptions();
        
        // Initialize saved quiz manager
        this.initSavedQuizManager();
        
        // Fix the start button
        this.fixStartButton();
        
        return availableChapters;
    },
    
    // Load hardcoded chapter questions
    loadHardcodedChapters: function() {
        console.log("Loading hardcoded chapters...");
        
        // Simple direct assignments - modify these lines to match your actual variable names
        if (typeof footprintingScanningQuestions !== 'undefined') {
            quizDataByChapter['footprintingScanning'] = footprintingScanningQuestions;
            console.log(`Loaded ${footprintingScanningQuestions.length} footprinting questions`);
        }
        
        if (typeof informationGatheringQuestions !== 'undefined') {
            quizDataByChapter['informationGathering'] = informationGatheringQuestions;
            console.log(`Loaded ${informationGatheringQuestions.length} information gathering questions`);
        }
        
        // DEBUG: Check loaded chapters
        console.log("LOADED HARDCODED CHAPTERS:");
        for (const chapterId in quizDataByChapter) {
            console.log(`- ${chapterId}: ${quizDataByChapter[chapterId].length} questions`);
        }
    },
    
    // Load user quizzes from localStorage (saved quizzes)
    loadUserQuizzes: function() {
        console.log("Loading saved quizzes from localStorage...");
        
        // Use Storage module if available
        let savedQuizzes = [];
        if (typeof Storage !== 'undefined' && Storage.getSavedQuizzes) {
            savedQuizzes = Storage.getSavedQuizzes();
            console.log(`Loaded ${savedQuizzes.length} saved quizzes using Storage module`);
        } else {
            // Fallback to direct localStorage access
            try {
                const savedQuizzesJson = localStorage.getItem('pentestpro_saved_quizzes');
                if (savedQuizzesJson) {
                    savedQuizzes = JSON.parse(savedQuizzesJson);
                    if (!Array.isArray(savedQuizzes)) {
                        console.warn("Invalid saved quizzes format, initializing as empty array");
                        savedQuizzes = [];
                    }
                }
            } catch (e) {
                console.error("Error loading saved quizzes:", e);
                savedQuizzes = [];
            }
        }
        
        if (savedQuizzes.length === 0) {
            console.log("No saved quizzes found in localStorage");
        } else {
            console.log(`Found ${savedQuizzes.length} saved quizzes`);
        }
        
        // Add each saved quiz
        savedQuizzes.forEach(quiz => {
            // Skip if the ID isn't valid
            if (!quiz.id) {
                console.warn("Skipping quiz with missing ID:", quiz.title);
                return;
            }
            
            // Add to global data
            quizDataByChapter[quiz.id] = quiz.questions;
            
            // Check if this quiz is already in our chapters list
            const existingIndex = availableChapters.findIndex(ch => ch.id === quiz.id);
            if (existingIndex >= 0) {
                // Update existing chapter
                availableChapters[existingIndex].title = quiz.title;
                availableChapters[existingIndex].description = quiz.description || "User quiz";
                availableChapters[existingIndex].isSaved = true;
                availableChapters[existingIndex].questionCount = quiz.questions.length;
            } else {
                // Add as new chapter
                availableChapters.push({
                    id: quiz.id,
                    title: quiz.title,
                    description: quiz.description || "User quiz",
                    enabled: true,
                    isSaved: true,
                    questionCount: quiz.questions.length
                });
            }
            
            console.log(`Added saved quiz: ${quiz.title} with ${quiz.questions.length} questions`);
        });
        
        // Also load temporary quizzes
        this.loadTempQuizzes();
    },

    

    // NEW FUNCTION: Load temporary quizzes from localStorage
    loadTempQuizzes: function() {
        console.log("Loading temporary quizzes...");
        
        // Use Storage module if available
        let tempQuizzes = [];
        if (typeof Storage !== 'undefined' && Storage.getTempQuizzes) {
            tempQuizzes = Storage.getTempQuizzes();
            console.log(`Loaded ${tempQuizzes.length} temp quizzes using Storage module`);
        } else {
            // Fallback to direct localStorage access
            try {
                const tempQuizzesJson = localStorage.getItem('pentestpro_temp_quizzes');
                if (tempQuizzesJson) {
                    tempQuizzes = JSON.parse(tempQuizzesJson);
                    if (!Array.isArray(tempQuizzes)) {
                        console.warn("Invalid temp quizzes format, initializing as empty array");
                        tempQuizzes = [];
                    }
                }
                
                // If no multi-quiz format, check for single temp quiz
                if (tempQuizzes.length === 0) {
                    const singleTempQuizJson = localStorage.getItem('pentestpro_temp_quiz');
                    if (singleTempQuizJson) {
                        try {
                            const tempQuiz = JSON.parse(singleTempQuizJson);
                            if (tempQuiz && tempQuiz.id && tempQuiz.title && Array.isArray(tempQuiz.questions)) {
                                tempQuizzes.push(tempQuiz);
                            }
                        } catch (e) {
                            console.error("Error parsing single temp quiz:", e);
                        }
                    }
                }
            } catch (e) {
                console.error("Error loading temp quizzes:", e);
                tempQuizzes = [];
            }
        }
        
        if (tempQuizzes.length === 0) {
            console.log("No temporary quizzes found");
            return;
        }
        
        console.log(`Found ${tempQuizzes.length} temporary quizzes`);
        
        // Add each temp quiz
        tempQuizzes.forEach(quiz => {
            // Skip if ID is invalid
            if (!quiz.id) {
                console.warn("Skipping temp quiz with missing ID");
                return;
            }
            
            // Add to global data
            quizDataByChapter[quiz.id] = quiz.questions;
            
            // Set in window for compatibility
            if (tempQuizzes.length === 1) {
                window.latestUploadedQuiz = quiz;
            }
            
            // Check if already in available chapters
            const existingIndex = availableChapters.findIndex(ch => ch.id === quiz.id);
            if (existingIndex >= 0) {
                // Update existing chapter
                availableChapters[existingIndex].title = quiz.title;
                availableChapters[existingIndex].description = `${quiz.questions.length} questions`;
                availableChapters[existingIndex].isTemporary = true;
                availableChapters[existingIndex].questionCount = quiz.questions.length;
                
                console.log(`Updated existing temporary quiz: ${quiz.title}`);
            } else {
                // Add as new chapter
                availableChapters.push({
                    id: quiz.id,
                    title: quiz.title,
                    description: `${quiz.questions.length} questions`,
                    enabled: true,
                    isTemporary: true,
                    questionCount: quiz.questions.length
                });
                
                console.log(`Added temporary quiz: ${quiz.title} with ${quiz.questions.length} questions`);
            }
        });
    },
    // Detect newly added quizzes from the PowerPoint uploader
    detectNewQuizzes: function() {
        console.log("Checking for newly added quizzes...");
        
        // If the chapter-generator.js adds the quiz directly to the window object
        if (window.newQuizData && window.newQuizData.questions) {
            const quiz = window.newQuizData;
            
            console.log("Found newQuizData:", quiz.title);
            
            if (quiz.id && quiz.title && Array.isArray(quiz.questions)) {
                // Add to global data
                quizDataByChapter[quiz.id] = quiz.questions;
                
                // Add to chapters list if not already there
                const existingIndex = availableChapters.findIndex(ch => ch.id === quiz.id);
                if (existingIndex >= 0) {
                    // Update existing chapter
                    availableChapters[existingIndex].title = quiz.title;
                    availableChapters[existingIndex].description = quiz.description || `${quiz.questions.length} questions`;
                    availableChapters[existingIndex].enabled = true;
                    availableChapters[existingIndex].isTemporary = true;
                    availableChapters[existingIndex].questionCount = quiz.questions.length;
                    console.log(`Updated existing quiz in availableChapters: ${quiz.title}`);
                } else {
                    // Add as new chapter
                    availableChapters.push({
                        id: quiz.id,
                        title: quiz.title,
                        description: quiz.description || `${quiz.questions.length} questions`,
                        enabled: true,
                        isTemporary: true,
                        questionCount: quiz.questions.length
                    });
                    console.log(`Added new quiz to availableChapters: ${quiz.title}`);
                }
            }
        }
        
        // Check for latest uploaded quiz from quizbridge.js
        if (window.latestUploadedQuiz) {
            const quiz = window.latestUploadedQuiz;
            console.log("Found latestUploadedQuiz:", quiz.title);
            
            if (quiz.id && quiz.title && Array.isArray(quiz.questions)) {
                // Add to global data if not already there
                quizDataByChapter[quiz.id] = quiz.questions;
                
                // Add to chapters list if not already there
                const existingIndex = availableChapters.findIndex(ch => ch.id === quiz.id);
                if (existingIndex >= 0) {
                    // Update existing chapter
                    availableChapters[existingIndex].title = quiz.title;
                    availableChapters[existingIndex].description = `${quiz.questions.length} questions`;
                    availableChapters[existingIndex].enabled = true;
                    availableChapters[existingIndex].isTemporary = true;
                    availableChapters[existingIndex].questionCount = quiz.questions.length;
                    console.log(`Updated existing quiz in availableChapters: ${quiz.title}`);
                } else {
                    // Add as new chapter
                    availableChapters.push({
                        id: quiz.id,
                        title: quiz.title,
                        description: `${quiz.questions.length} questions`,
                        enabled: true,
                        isTemporary: true,
                        questionCount: quiz.questions.length
                    });
                    console.log(`Added latestUploadedQuiz to availableChapters: ${quiz.title}`);
                }
            }
        }
        
        // If chapter-generator.js adds the quiz directly to quizDataByChapter
        for (const chapterId in quizDataByChapter) {
            // Skip if this chapter is already in our chapters list
            if (availableChapters.some(ch => ch.id === chapterId)) {
                continue;
            }
            
            const questions = quizDataByChapter[chapterId];
            if (Array.isArray(questions) && questions.length > 0) {
                // Try to determine a title
                let title = chapterId
                    .replace(/([A-Z])/g, ' $1') // Add spaces before capital letters
                    .trim();
                
                if (questions[0].chapter) {
                    title = questions[0].chapter;
                }
                
                // Add to chapters list
                availableChapters.push({
                    id: chapterId,
                    title: title,
                    description: `${questions.length} questions`,
                    enabled: true,
                    isTemporary: true,
                    questionCount: questions.length
                });
                
                console.log(`Detected added quiz: ${title} with ${questions.length} questions`);
            }
        }
        
        // Special handling for your specific PowerPoint upload case
        // If you have a specific ID for the temporary quiz, check for it here
        const theOutOfAfricaTheoryId = 'the-out-of-africa-theory';
        if (quizDataByChapter[theOutOfAfricaTheoryId] && 
            !availableChapters.some(ch => ch.id === theOutOfAfricaTheoryId)) {
            
            const questions = quizDataByChapter[theOutOfAfricaTheoryId];
            availableChapters.push({
                id: theOutOfAfricaTheoryId,
                title: 'The Out of Africa Theory',
                description: `${questions.length} questions about human evolution`,
                enabled: true,
                isTemporary: true,
                questionCount: questions.length
            });
            
            console.log(`Added The Out of Africa Theory quiz with ${questions.length} questions`);
        }
        
        // Log all available chapters to debug
        console.log("AVAILABLE CHAPTERS NOW:", availableChapters.map(ch => ch.title));
    },
    
    // Render chapter options - for the new UI style
    renderChapterOptions: function() {
        const container = document.getElementById('chapterOptionsContainer');
        if (!container) {
            console.log("Chapter options container not found - using existing UI");
            return;
        }
        
        // IMPORTANT: Always update the UI regardless of existing content
        console.log("Rendering chapter options with new UI...");
        
        // Clear existing options
        container.innerHTML = '';
        
        // Get enabled chapters
        const enabledChapters = availableChapters.filter(chapter => chapter.enabled);
        console.log(`Rendering ${enabledChapters.length} enabled chapters`);
        
        // Split into predefined and custom
        const predefinedChapters = enabledChapters.filter(chapter => !chapter.isSaved && !chapter.isTemporary);
        const savedChapters = enabledChapters.filter(chapter => chapter.isSaved);
        const tempChapters = enabledChapters.filter(chapter => chapter.isTemporary && !chapter.isSaved);
        
        console.log(`Rendering ${predefinedChapters.length} predefined, ${savedChapters.length} saved, ${tempChapters.length} temporary`);
        
        // Add section headings if we have multiple types
        const showHeaders = (
            (predefinedChapters.length > 0 && (savedChapters.length > 0 || tempChapters.length > 0)) ||
            (savedChapters.length > 0 && tempChapters.length > 0)
        );
        
        // Render predefined chapters
        if (predefinedChapters.length > 0) {
            if (showHeaders) {
                const heading = document.createElement('div');
                heading.className = 'chapter-section-heading';
                heading.innerHTML = '<h4>Built-in Quizzes</h4>';
                container.appendChild(heading);
            }
            
            this.renderChaptersToContainer(predefinedChapters, container);
        }
        
        // Render saved chapters
        if (savedChapters.length > 0) {
            if (showHeaders) {
                const heading = document.createElement('div');
                heading.className = 'chapter-section-heading';
                heading.innerHTML = '<h4>Your Saved Quizzes</h4>';
                container.appendChild(heading);
            }
            
            this.renderChaptersToContainer(savedChapters, container);
        }
        
        // Render temporary chapters
        if (tempChapters.length > 0) {
            if (showHeaders) {
                const heading = document.createElement('div');
                heading.className = 'chapter-section-heading';
                heading.innerHTML = '<h4>New Uploaded Quizzes</h4>';
                container.appendChild(heading);
            }
            
            this.renderChaptersToContainer(tempChapters, container);
        }
        
        // Fallback for old UI style if the new UI didn't render anything
        if (container.innerHTML === '') {
            console.log("Using old UI style as fallback");
            this.renderOldStyleChapterOptions(container);
        }
    },
    
    // Helper method to render chapters to container
    renderChaptersToContainer: function(chapters, container) {
        chapters.forEach(chapter => {
            // Create chapter option element
            const chapterOption = document.createElement('div');
            chapterOption.className = 'chapter-option';
            chapterOption.dataset.chapterId = chapter.id;
            
            // Add appropriate styling
            if (chapter.isPredefined) chapterOption.classList.add('predefined-chapter');
            if (chapter.isSaved) chapterOption.classList.add('saved-chapter');
            if (chapter.isTemporary && !chapter.isSaved) chapterOption.classList.add('temporary-chapter');
            
            // Add badges based on chapter type
            let badge = '';
            if (chapter.isPredefined) badge = '<span class="badge predefined">Built-in</span>';
            if (chapter.isSaved) badge = '<span class="badge saved">Saved</span>';
            if (chapter.isTemporary && !chapter.isSaved) badge = '<span class="badge temporary">New</span>';
            
            // Add content with appropriate badges
            chapterOption.innerHTML = `
                <div class="chapter-option-header">
                    <input type="checkbox" id="chapter_${chapter.id}" class="chapter-checkbox" data-chapter-id="${chapter.id}" checked>
                    <label for="chapter_${chapter.id}" class="chapter-label">
                        ${chapter.title}
                        ${badge}
                    </label>
                </div>
                <p class="chapter-description">
                    ${chapter.description}
                    ${chapter.questionCount ? `<span class="question-count">(${chapter.questionCount} questions)</span>` : ''}
                </p>
            `;
            
            container.appendChild(chapterOption);
            
            // Add selected class to match the checked state
            chapterOption.classList.add('selected');
        });
        
        // Add event listeners for checkboxes
        container.querySelectorAll('.chapter-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const chapterOption = this.closest('.chapter-option');
                
                if (this.checked) {
                    chapterOption.classList.add('selected');
                } else {
                    chapterOption.classList.remove('selected');
                }
                
                // Update start button
                const anySelected = document.querySelectorAll('.chapter-checkbox:checked').length > 0;
                const startBtn = document.getElementById('startQuizBtn');
                if (startBtn) {
                    startBtn.disabled = !anySelected;
                }
            });
        });
    },
    
    // Fallback renderer for the old UI style
    renderOldStyleChapterOptions: function(container) {
        availableChapters.forEach(chapter => {
            if (!chapter.enabled) return;
            
            const div = document.createElement('div');
            div.className = 'chapter-checkbox-container';
            
            div.innerHTML = `
                <input type="checkbox" id="${chapter.id}Checkbox" 
                       class="chapter-checkbox" data-chapter-id="${chapter.id}" checked>
                <label for="${chapter.id}Checkbox">
                    ${chapter.title}
                    ${chapter.questionCount ? `(${chapter.questionCount} questions)` : ''}
                </label>
            `;
            
            container.appendChild(div);
        });
        
        console.log(`Rendered ${availableChapters.length} chapters using old UI style`);
    },
    
    // Initialize saved quiz manager
    initSavedQuizManager: function() {
        console.log("Initializing saved quiz manager...");
        
        // Render the saved quiz list
        this.renderSavedQuizList();
        
        // Add event listener for the manage saved quizzes button
        const manageSavedBtn = document.getElementById('manageSavedBtn');
        if (manageSavedBtn) {
            manageSavedBtn.addEventListener('click', function() {
                console.log("Manage saved quizzes button clicked");
                // Find the saved quizzes section
                const savedQuizzesSection = document.getElementById('savedQuizzesSection');
                
                if (savedQuizzesSection) {
                    // Hide welcome screen
                    document.getElementById('welcomeScreen').classList.add('hidden');
                    // Show saved quizzes section
                    savedQuizzesSection.classList.remove('hidden');
                } else {
                    console.error("Saved quizzes section not found!");
                    alert("The saved quizzes management feature is not available.");
                }
            });
        } else {
            console.warn("Manage saved quizzes button not found");
        }
        
        // Add event listener for the back button
        const backFromSavedBtn = document.getElementById('backFromSavedBtn');
        if (backFromSavedBtn) {
            backFromSavedBtn.addEventListener('click', function() {
                console.log("Back from saved quizzes button clicked");
                document.getElementById('savedQuizzesSection').classList.add('hidden');
                document.getElementById('welcomeScreen').classList.remove('hidden');
            });
        }
        
        // Add event listener for the clear all button
        const clearAllSavedBtn = document.getElementById('clearAllSavedBtn');
        if (clearAllSavedBtn) {
            clearAllSavedBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete ALL saved quizzes? This cannot be undone.')) {
                    localStorage.removeItem('pentestpro_saved_quizzes');
                    alert('All saved quizzes have been deleted.');
                    location.reload();
                }
            });
        }
    },
    
    // Render saved quiz list
    renderSavedQuizList: function() {
        const savedQuizList = document.getElementById('savedQuizList');
        if (!savedQuizList) {
            console.warn("Saved quiz list container not found");
            return;
        }
        
        console.log("Rendering saved quiz list...");
        
        // Get saved quizzes from Storage module if available
        let savedQuizzes = [];
        if (typeof Storage !== 'undefined' && Storage.getSavedQuizzes) {
            savedQuizzes = Storage.getSavedQuizzes();
            console.log(`Loaded ${savedQuizzes.length} saved quizzes for display using Storage module`);
        } else {
            // Fallback to direct localStorage access
            try {
                const savedQuizzesJson = localStorage.getItem('pentestpro_saved_quizzes');
                if (savedQuizzesJson) {
                    savedQuizzes = JSON.parse(savedQuizzesJson);
                    if (!Array.isArray(savedQuizzes)) {
                        console.warn("Invalid saved quizzes format, using empty array");
                        savedQuizzes = [];
                    }
                }
            } catch (e) {
                console.error("Error loading saved quizzes for display:", e);
            }
        }
        
        console.log(`Found ${savedQuizzes.length} saved quizzes to display`);
        
        if (savedQuizzes.length === 0) {
            savedQuizList.innerHTML = `
                <div class="no-quizzes-message">
                    <i class="fas fa-info-circle"></i>
                    <p>You haven't created any quizzes yet. Use the Quiz Creator to make a quiz from a PowerPoint file.</p>
                </div>
            `;
            return;
        }
        
        savedQuizList.innerHTML = '';
        savedQuizzes.forEach((quiz, index) => {
            // Skip invalid quiz data
            if (!quiz || !quiz.title) {
                console.warn("Skipping invalid quiz at index", index);
                return;
            }
            
            const quizElement = document.createElement('div');
            quizElement.className = 'saved-quiz-item';
            quizElement.innerHTML = `
                <div class="quiz-info">
                    <h3>${quiz.title}</h3>
                    <p>${quiz.description || 'Custom quiz'}</p>
                    <p class="quiz-meta">
                        <span>${quiz.questions ? quiz.questions.length : 0} questions</span>
                        <span>Created: ${new Date(quiz.createdAt || new Date()).toLocaleDateString()}</span>
                    </p>
                </div>
                <div class="quiz-actions">
                    <button class="button small delete-quiz" data-quiz-id="${quiz.id}" data-index="${index}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            savedQuizList.appendChild(quizElement);
        });
        
        // Add event listeners for delete buttons
        savedQuizList.querySelectorAll('.delete-quiz').forEach(button => {
            button.addEventListener('click', function() {
                const quizId = this.getAttribute('data-quiz-id');
                const index = parseInt(this.getAttribute('data-index'));
                const title = savedQuizzes[index]?.title || 'this quiz';
                
                if (confirm(`Are you sure you want to delete the quiz "${title}"?`)) {
                    let deleted = false;
                    
                    // Try to delete using Storage module first
                    if (typeof Storage !== 'undefined' && Storage.deleteSavedQuiz) {
                        deleted = Storage.deleteSavedQuiz(quizId);
                    } 
                    
                    // Fall back to manual deletion if needed
                    if (!deleted) {
                        try {
                            savedQuizzes.splice(index, 1);
                            localStorage.setItem('pentestpro_saved_quizzes', JSON.stringify(savedQuizzes));
                            deleted = true;
                        } catch (e) {
                            console.error("Error deleting quiz:", e);
                        }
                    }
                    
                    if (deleted) {
                        alert('Quiz deleted successfully.');
                        ChapterManager.renderSavedQuizList();
                    } else {
                        alert('Failed to delete quiz. Please try again.');
                    }
                }
            });
        });
    },
    
    // Fix the start button to make sure chapter selection works
    fixStartButton: function() {
        const startBtn = document.getElementById('startQuizBtn');
        if (!startBtn) return;
        
        // Replace the click handler
        startBtn.removeEventListener('click', startBtn.onclick);
        startBtn.onclick = null;
        
        startBtn.addEventListener('click', function(e) {
            // Prevent default action
            e.preventDefault();
            
            // IMPROVED: More robust chapter selection
            const selectedChapters = [];
            
            // First, try using the new UI style checkboxes
            document.querySelectorAll('.chapter-checkbox').forEach(checkbox => {
                if (checkbox.checked) {
                    // Get chapter ID from data-attribute or from ID
                    let chapterId = checkbox.getAttribute('data-chapter-id');
                    
                    if (!chapterId && checkbox.id) {
                        if (checkbox.id.includes('Checkbox')) {
                            chapterId = checkbox.id.replace('Checkbox', '');
                        } else if (checkbox.id.includes('chapter_')) {
                            chapterId = checkbox.id.replace('chapter_', '');
                        }
                    }
                    
                    if (chapterId && !selectedChapters.includes(chapterId)) {
                        selectedChapters.push(chapterId);
                    }
                }
            });
            
            // Debug selected chapters
            console.log("SELECTED CHAPTERS:", selectedChapters);
            
            // Check if any chapters are selected
            if (selectedChapters.length === 0) {
                alert('Please select at least one chapter');
                return;
            }
            
            // Check if we have questions for these chapters
            let selectedQuestions = [];
            let missingChapters = [];
            
            selectedChapters.forEach(chapterId => {
                // Debug log to confirm questions are in quizDataByChapter
                console.log(`Checking for questions for chapter ${chapterId}: ${quizDataByChapter[chapterId] ? 'Found' : 'Not found'}`);
                
                if (quizDataByChapter[chapterId]) {
                    // Add each question with chapter info
                    const chapterQuestions = quizDataByChapter[chapterId].map(q => ({
                        ...q,
                        chapterId: chapterId,
                        chapterTitle: availableChapters.find(c => c.id === chapterId)?.title || chapterId
                    }));
                    
                    selectedQuestions = selectedQuestions.concat(chapterQuestions);
                } else {
                    // No questions found for this chapter
                    const chapterTitle = availableChapters.find(c => c.id === chapterId)?.title || chapterId;
                    missingChapters.push(chapterTitle);
                }
            });
            
            // Debug selected questions
            console.log("SELECTED QUESTIONS:", selectedQuestions.length);
            
            // Check if we found any questions
            if (selectedQuestions.length === 0) {
                if (missingChapters.length > 0) {
                    alert(`No questions available for: ${missingChapters.join(', ')}`);
                } else {
                    alert('No questions available for the selected chapters');
                }
                return;
            }
            
            // Call the startQuiz function with the selected questions
            console.log(`Starting quiz with ${selectedQuestions.length} questions`);
            
            // Set up the global currentQuiz object expected by the quiz code
            window.currentQuiz = {
                questions: selectedQuestions,
                mode: document.querySelector('.mode-option.selected')?.getAttribute('data-mode') || 'standard',
                timeLimit: parseInt(document.getElementById('timeLimit')?.value || '0')
            };
            
            // Load question count
            const questionCountSetting = document.getElementById('questionCount')?.value || 'all';
            if (questionCountSetting !== 'all') {
                const maxQuestions = parseInt(questionCountSetting);
                if (window.currentQuiz.questions.length > maxQuestions) {
                    // Shuffle and limit questions
                    window.currentQuiz.questions = shuffleArray(window.currentQuiz.questions).slice(0, maxQuestions);
                }
            } else {
                // Just shuffle all questions
                window.currentQuiz.questions = shuffleArray(window.currentQuiz.questions);
            }
            
            // Ensure questions aren't empty
            if (window.currentQuiz.questions.length === 0) {
                alert('No questions available. Please select different chapters or check that your quiz has questions.');
                return;
            }
            
            // Switch to the quiz screen
            switchToScreen('quizContainer');
            
            // Initialize the quiz UI
            if (typeof initQuiz === 'function') {
                initQuiz();
            } else {
                console.error("initQuiz function not found!");
                alert("Quiz system not available. Please reload the page.");
            }
        });
    },
    
    // Get selected chapter IDs
    getSelectedChapterIds: function() {
        const selectedIds = [];
        
        // Check both old and new styles
        const checkboxes = document.querySelectorAll('.chapter-checkbox:checked');
        
        checkboxes.forEach(checkbox => {
            // Try data-chapter-id first
            let chapterId = checkbox.getAttribute('data-chapter-id');
            
            // If not found, try parsing from ID
            if (!chapterId) {
                if (checkbox.id.includes('Checkbox')) {
                    chapterId = checkbox.id.replace('Checkbox', '');
                } else if (checkbox.id.includes('chapter_')) {
                    chapterId = checkbox.id.replace('chapter_', '');
                }
            }
            
            if (chapterId && !selectedIds.includes(chapterId)) {
                selectedIds.push(chapterId);
            }
        });
        
        return selectedIds;
    },
    
    // Get questions for selected chapters
    getQuestionsForSelectedChapters: function() {
        const selectedIds = this.getSelectedChapterIds();
        const allQuestions = [];
        
        selectedIds.forEach(id => {
            if (quizDataByChapter[id] && Array.isArray(quizDataByChapter[id])) {
                // Add chapter info to questions
                const questionsWithInfo = quizDataByChapter[id].map(q => ({
                    ...q,
                    chapterId: id,
                    chapterTitle: availableChapters.find(c => c.id === id)?.title || id
                }));
                
                allQuestions.push(...questionsWithInfo);
            }
        });
        
        return allQuestions;
    },
    
    // Force refresh of chapter options
    refreshChapterOptions: function() {
        // Reload chapters from localStorage
        this.loadUserQuizzes();
        
        // Check for new quizzes
        this.detectNewQuizzes();
        
        // Re-render the chapter options
        this.renderChapterOptions();
        
        // Log current chapters
        console.log("AVAILABLE CHAPTERS AFTER REFRESH:", availableChapters.map(ch => `${ch.title} (${ch.id})`));
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        ChapterManager.init();
    }, 100);
});

// Helper function to shuffle array
function shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

// Helper function to switch screens
function switchToScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show the requested screen
    document.getElementById(screenId).classList.remove('hidden');
}