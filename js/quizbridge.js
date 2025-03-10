/**
 * Simple bridge script to directly connect the PowerPoint uploader with the quiz system
 * Save this as quizbridge.js and include it in your HTML after chapter-generator.js
 */

// Create a global variable to store the latest uploaded quiz
window.latestUploadedQuiz = null;

// Try to restore from temp storage on page load
document.addEventListener('DOMContentLoaded', function() {
    try {
        const tempQuiz = localStorage.getItem('pentestpro_temp_quiz');
        if (tempQuiz) {
            window.latestUploadedQuiz = JSON.parse(tempQuiz);
            console.log("Restored temp quiz from localStorage:", window.latestUploadedQuiz.title);
        }
    } catch (error) {
        console.error("Error restoring temp quiz:", error);
    }
});

// Override the generateFilesBtn click handler in chapter-generator.js
document.addEventListener('DOMContentLoaded', function() {
    // Wait for other scripts to load
    setTimeout(() => {
        const generateFilesBtn = document.getElementById('generateFilesBtn');
        
        if (generateFilesBtn) {
            // Store the original click handler
            const originalHandler = generateFilesBtn.onclick;
            
            // Replace with our handler that ensures quiz availability
            generateFilesBtn.onclick = function(e) {
                // Let the original handler run first
                if (originalHandler) originalHandler.call(this, e);
                
                // Get quiz data
                const chapterId = document.getElementById('chapterId').value;
                const chapterTitle = document.getElementById('chapterTitle').value;
                const aiResponseText = document.getElementById('aiResponse').value;
                
                // Try to process the content
                try {
                    // Parse questions from AI response
                    let questions = null;
                    
                    // Extract array part if needed
                    if (aiResponseText.trim().startsWith('[')) {
                        questions = JSON.parse(aiResponseText);
                    } else {
                        const arrayMatch = aiResponseText.match(/\[\s*\{[\s\S]*\}\s*\]/);
                        if (arrayMatch) {
                            questions = JSON.parse(arrayMatch[0]);
                        }
                    }
                    
                    if (!questions || !Array.isArray(questions)) {
                        console.error("Invalid questions format");
                        return;
                    }
                    
                    // Store the quiz data
                    window.latestUploadedQuiz = {
                        id: chapterId,
                        title: chapterTitle,
                        questions: questions,
                        createdAt: new Date().toISOString()
                    };
                    
                    console.log("Set latestUploadedQuiz:", window.latestUploadedQuiz.title);
                    
                    // Directly add to quizDataByChapter
                    if (typeof quizDataByChapter !== 'undefined') {
                        quizDataByChapter[chapterId] = questions;
                        console.log(`Added ${questions.length} questions to quizDataByChapter[${chapterId}]`);
                    } else {
                        console.warn("quizDataByChapter is not defined, creating it");
                        window.quizDataByChapter = {
                            [chapterId]: questions
                        };
                    }
                    
                    // Add to availableChapters if it exists
                    if (typeof availableChapters !== 'undefined' && Array.isArray(availableChapters)) {
                        // Check if already exists
                        const existingIndex = availableChapters.findIndex(ch => ch.id === chapterId);
                        
                        if (existingIndex >= 0) {
                            console.log(`Updating existing chapter in availableChapters: ${chapterTitle}`);
                            availableChapters[existingIndex] = {
                                ...availableChapters[existingIndex],
                                title: chapterTitle,
                                description: `${questions.length} questions`,
                                enabled: true,
                                isTemporary: true,
                                questionCount: questions.length
                            };
                        } else {
                            console.log(`Adding new chapter to availableChapters: ${chapterTitle}`);
                            availableChapters.push({
                                id: chapterId,
                                title: chapterTitle,
                                description: `${questions.length} questions`,
                                enabled: true,
                                isTemporary: true,
                                questionCount: questions.length
                            });
                        }
                    } else {
                        console.warn("availableChapters is not defined or not an array");
                    }
                    
                    // Force refresh of chapter options if ChapterManager is available
                    if (typeof ChapterManager !== 'undefined' && typeof ChapterManager.refreshChapterOptions === 'function') {
                        console.log("Refreshing chapter options via ChapterManager...");
                        ChapterManager.refreshChapterOptions();
                    }
                    
                    // Create custom save button that actually works
                    const saveBtn = document.createElement('button');
                    saveBtn.className = 'button primary';
                    saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Quiz';
                    saveBtn.onclick = function() {
                        // Save to localStorage
                        let savedQuizzes = JSON.parse(localStorage.getItem('pentestpro_saved_quizzes') || '[]');
                        
                        // Check if it already exists
                        const existingIndex = savedQuizzes.findIndex(quiz => quiz.id === chapterId);
                        
                        if (existingIndex >= 0) {
                            // Update existing
                            savedQuizzes[existingIndex] = {
                                ...savedQuizzes[existingIndex],
                                title: chapterTitle,
                                description: `${questions.length} questions`,
                                questions: questions,
                                updatedAt: new Date().toISOString()
                            };
                        } else {
                            // Add new
                            savedQuizzes.push({
                                id: chapterId,
                                title: chapterTitle,
                                description: `${questions.length} questions`,
                                questions: questions,
                                createdAt: new Date().toISOString()
                            });
                        }
                        
                        localStorage.setItem('pentestpro_saved_quizzes', JSON.stringify(savedQuizzes));
                        alert(`Quiz "${chapterTitle}" has been saved!`);
                        
                        // Remove temp quiz
                        localStorage.removeItem('pentestpro_temp_quiz');
                        
                        location.reload();
                    };
                    
                    // Create a real "Start Quiz" button
                    const startQuizBtn = document.createElement('button');
                    startQuizBtn.className = 'button primary';
                    startQuizBtn.innerHTML = '<i class="fas fa-play"></i> Start Quiz Now';
                    startQuizBtn.onclick = function() {
                        // Create a currentQuiz object with the questions
                        window.currentQuiz = {
                            questions: questions,
                            mode: 'standard',
                            timeLimit: 0
                        };
                        
                        // Switch to quiz screen
                        document.querySelectorAll('section').forEach(section => {
                            section.classList.add('hidden');
                        });
                        
                        document.getElementById('quizContainer').classList.remove('hidden');
                        
                        // Initialize the quiz
                        if (typeof initQuiz === 'function') {
                            initQuiz();
                        } else {
                            alert("Quiz system not available. Please save the quiz and reload the page.");
                        }
                    };
                    
                    // Create a "Select this Quiz" button to go to chapter selection screen
                    const selectQuizBtn = document.createElement('button');
                    selectQuizBtn.className = 'button secondary';
                    selectQuizBtn.innerHTML = '<i class="fas fa-list-check"></i> Select in Quiz Menu';
                    selectQuizBtn.onclick = function() {
                        // Hide current screen
                        document.querySelector('.chapter-creator').classList.add('hidden');
                        
                        // Show chapter selection
                        document.getElementById('welcomeScreen').classList.add('hidden');
                        document.getElementById('chapterSelection').classList.remove('hidden');
                        
                        // Force refresh chapter options
                        if (typeof ChapterManager !== 'undefined' && 
                            typeof ChapterManager.refreshChapterOptions === 'function') {
                            ChapterManager.refreshChapterOptions();
                        }
                    };
                    
                    // Add buttons to result area
                    const resultArea = document.getElementById('resultArea');
                    if (resultArea) {
                        resultArea.innerHTML = `
                            <h4>Quiz Created Successfully!</h4>
                            <p>Quiz "${chapterTitle}" with ${questions.length} questions is ready.</p>
                            <div style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;">
                                <div id="customButtonContainer"></div>
                            </div>
                        `;
                        
                        const buttonContainer = document.getElementById('customButtonContainer');
                        if (buttonContainer) {
                            buttonContainer.appendChild(startQuizBtn);
                            buttonContainer.appendChild(selectQuizBtn);
                            buttonContainer.appendChild(saveBtn);
                        }
                    }
                    
                } catch (error) {
                    console.error("Error processing quiz:", error);
                    alert("Error processing quiz: " + error.message);
                }
            };
        }
    }, 500);
});

// Make sure the quiz is available for selection
document.addEventListener('DOMContentLoaded', function() {
    // Wait for ChapterManager to initialize
    setTimeout(() => {
        // Refresh chapter options if ChapterManager is available
        if (typeof ChapterManager !== 'undefined' && 
            typeof ChapterManager.refreshChapterOptions === 'function') {
            console.log("Initial refresh of chapter options...");
            ChapterManager.refreshChapterOptions();
        }
        
        // Ensure newly uploaded quiz is included in selection
        const startBtn = document.getElementById('startQuizBtn');
        
        if (startBtn) {
            const originalHandler = startBtn.onclick;
            
            startBtn.onclick = function(e) {
                // If we have an uploaded quiz, make sure it's available
                if (window.latestUploadedQuiz) {
                    const quiz = window.latestUploadedQuiz;
                    
                    // Add to quizDataByChapter if not already there
                    if (typeof quizDataByChapter !== 'undefined' && !quizDataByChapter[quiz.id]) {
                        quizDataByChapter[quiz.id] = quiz.questions;
                        console.log(`Added latestUploadedQuiz questions to quizDataByChapter[${quiz.id}]`);
                    }
                }
                
                // Call original handler
                if (originalHandler) originalHandler.call(this, e);
            };
        }
    }, 1000);
});