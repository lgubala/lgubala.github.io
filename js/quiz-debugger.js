/**
 * Quiz Debugger - Add this file to your HTML to fix chapter selection issues
 * Place this script tag AFTER all other script tags in your HTML
 */

(function() {
    console.log("=== QUIZ DEBUGGER LOADED ===");
    
    // Log global state
    console.log("QUIZ DATA:", {
        availableChapters: typeof availableChapters !== 'undefined' ? 
            availableChapters.map(ch => `${ch.title} (${ch.id})`) : 'Not defined',
        quizDataByChapter: typeof quizDataByChapter !== 'undefined' ? 
            Object.keys(quizDataByChapter) : 'Not defined',
        latestUploadedQuiz: window.latestUploadedQuiz ? 
            window.latestUploadedQuiz.title : 'None',
        newQuizData: window.newQuizData ? 
            window.newQuizData.title : 'None'
    });
    
    // Fix start button
    setTimeout(() => {
        const fixStartButton = function() {
            const startBtn = document.getElementById('startQuizBtn');
            if (!startBtn) {
                console.log("Start quiz button not found!");
                return;
            }
            
            console.log("Fixing start quiz button...");
            
            // Remove any existing event listeners
            const newBtn = startBtn.cloneNode(true);
            startBtn.parentNode.replaceChild(newBtn, startBtn);
            
            // Add our own event listener
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log("START QUIZ BUTTON CLICKED");
                
                // Manually get the selected chapters
                const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
                console.log(`Found ${checkedBoxes.length} checked boxes`);
                
                const selectedChapters = [];
                
                checkedBoxes.forEach(checkbox => {
                    console.log("Checked box:", checkbox.id, checkbox.getAttribute('data-chapter-id'));
                    
                    // Try various ways to get the chapter ID
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
                });
                
                console.log("SELECTED CHAPTERS:", selectedChapters);
                
                if (selectedChapters.length === 0) {
                    // Force select the Out of Africa quiz
                    const outOfAfricaId = 'the-out-of-africa-theory';
                    if (quizDataByChapter[outOfAfricaId]) {
                        selectedChapters.push(outOfAfricaId);
                        console.log("Forced selection of Out of Africa quiz");
                    } else {
                        alert('Please select at least one chapter');
                        return;
                    }
                }
                
                // Get questions for the selected chapters
                let selectedQuestions = [];
                
                selectedChapters.forEach(chapterId => {
                    console.log(`Looking for questions for chapter ${chapterId}`);
                    
                    if (quizDataByChapter[chapterId]) {
                        const chapterQuestions = quizDataByChapter[chapterId].map(q => ({
                            ...q,
                            chapterId: chapterId,
                            chapterTitle: availableChapters.find(c => c.id === chapterId)?.title || chapterId
                        }));
                        
                        selectedQuestions = selectedQuestions.concat(chapterQuestions);
                        console.log(`Added ${chapterQuestions.length} questions for ${chapterId}`);
                    } else {
                        console.warn(`No questions found for chapter ${chapterId}`);
                    }
                });
                
                if (selectedQuestions.length === 0) {
                    alert('No questions available for the selected chapters');
                    return;
                }
                
                // Set up the global currentQuiz object
                window.currentQuiz = {
                    questions: selectedQuestions,
                    mode: document.querySelector('.mode-option.selected')?.getAttribute('data-mode') || 'standard',
                    timeLimit: parseInt(document.getElementById('timeLimit')?.value || '0')
                };
                
                console.log(`Created currentQuiz with ${selectedQuestions.length} questions`);
                
                // Apply question limit if needed
                const questionCountSetting = document.getElementById('questionCount')?.value || 'all';
                if (questionCountSetting !== 'all') {
                    const maxQuestions = parseInt(questionCountSetting);
                    if (window.currentQuiz.questions.length > maxQuestions) {
                        // Shuffle and limit questions
                        window.currentQuiz.questions = shuffleArray(window.currentQuiz.questions).slice(0, maxQuestions);
                        console.log(`Limited to ${maxQuestions} questions`);
                    }
                } else {
                    // Just shuffle all questions
                    window.currentQuiz.questions = shuffleArray(window.currentQuiz.questions);
                }
                
                // Hide chapter selection and show quiz container
                document.querySelectorAll('section').forEach(section => {
                    section.classList.add('hidden');
                });
                
                document.getElementById('quizContainer').classList.remove('hidden');
                
                // Try to initialize the quiz
                console.log("Attempting to initialize quiz UI...");
                
                // Look for the initQuiz function
                if (typeof window.initQuiz === 'function') {
                    console.log("Found initQuiz function, calling it...");
                    window.initQuiz();
                } else {
                    console.error("initQuiz function not found in window scope!");
                    
                    // Try to find it in other places
                    if (typeof initQuiz === 'function') {
                        console.log("Found initQuiz in local scope, calling it...");
                        initQuiz();
                    } else {
                        console.error("Could not find initQuiz function anywhere!");
                        
                        // Create a simple fallback quiz UI
                        createFallbackQuizUI();
                    }
                }
            });
            
            console.log("Start quiz button fixed!");
        };
        
        // Create a simple fallback quiz UI if initQuiz is not available
        function createFallbackQuizUI() {
            console.log("Creating fallback quiz UI...");
            
            const quizContainer = document.getElementById('quizContainer');
            if (!quizContainer) {
                alert("Quiz container not found!");
                return;
            }
            
            const questionContainer = quizContainer.querySelector('.question-container');
            if (!questionContainer) {
                alert("Question container not found!");
                return;
            }
            
            // Display the first question
            const currentIndex = 0;
            const totalQuestions = window.currentQuiz.questions.length;
            
            // Update progress
            document.getElementById('currentQuestion').textContent = '1';
            document.getElementById('totalQuestions').textContent = totalQuestions;
            document.getElementById('progressBar').style.width = `${(1 / totalQuestions) * 100}%`;
            
            // Display chapter name
            const currentChapter = document.getElementById('currentChapter');
            if (currentChapter) {
                currentChapter.textContent = window.currentQuiz.questions[0].chapterTitle || 'Quiz';
            }
            
            // Display question
            const questionText = document.getElementById('questionText');
            if (questionText) {
                questionText.textContent = window.currentQuiz.questions[0].question;
            }
            
            // Display options
            const optionsContainer = document.getElementById('optionsContainer');
            if (optionsContainer) {
                optionsContainer.innerHTML = '';
                
                window.currentQuiz.questions[0].options.forEach((option, index) => {
                    const optionElement = document.createElement('div');
                    optionElement.className = 'option';
                    optionElement.textContent = option;
                    optionElement.dataset.index = index;
                    
                    optionElement.addEventListener('click', function() {
                        // Mark this option as selected
                        optionsContainer.querySelectorAll('.option').forEach(opt => {
                            opt.classList.remove('selected');
                        });
                        
                        this.classList.add('selected');
                        
                        // Show next button
                        const nextBtn = document.getElementById('nextBtn');
                        if (nextBtn) {
                            nextBtn.classList.remove('hidden');
                        }
                    });
                    
                    optionsContainer.appendChild(optionElement);
                });
            }
            
            // Fix next button
            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn) {
                nextBtn.classList.add('hidden');
                
                nextBtn.addEventListener('click', function() {
                    alert("This is a fallback quiz UI. Please check console for errors about missing initQuiz function.");
                });
            }
            
            alert("Using fallback quiz UI! Check console for errors.");
        }
        
        // Utility function to shuffle array
        function shuffleArray(array) {
            const result = [...array];
            for (let i = result.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [result[i], result[j]] = [result[j], result[i]];
            }
            return result;
        }
        
        // Fix the start button
        fixStartButton();
        
        // Check and log chapter options
        const chapterOptions = document.getElementById('chapterOptionsContainer');
        if (chapterOptions) {
            console.log("CHAPTER OPTIONS CONTAINER:", {
                checkboxCount: chapterOptions.querySelectorAll('input[type="checkbox"]').length,
                checkboxes: Array.from(chapterOptions.querySelectorAll('input[type="checkbox"]'))
                    .map(cb => ({
                        id: cb.id,
                        dataChapterId: cb.getAttribute('data-chapter-id'),
                        checked: cb.checked
                    }))
            });
        }
    }, 1000);
})();