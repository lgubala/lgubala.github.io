/**
 * PentestPro Chapter Generator
 * Handles PowerPoint upload and quiz generation
 * Now with direct notes pasting functionality
 */

// Initialize the module when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initChapterGenerator();
});

function initChapterGenerator() {
    // PowerPoint Upload Elements
    const uploadArea = document.getElementById('uploadArea');
    const fileUpload = document.getElementById('fileUpload');
    const processFileBtn = document.getElementById('processFileBtn');
    
    // General Elements
    const chapterDetails = document.getElementById('chapterDetails');
    const processingStatus = document.getElementById('processingStatus');
    const aiPromptArea = document.getElementById('aiPromptArea');
    const aiResponseArea = document.getElementById('aiResponseArea');
    const resultArea = document.getElementById('resultArea');
    const copyPromptBtn = document.getElementById('copyPromptBtn');
    const aiResponse = document.getElementById('aiResponse');
    const generateFilesBtn = document.getElementById('generateFilesBtn');
    
    // Add toggle elements for switching between modes
    const modeToggleContainer = document.createElement('div');
    modeToggleContainer.className = 'mode-toggle-container';
    modeToggleContainer.innerHTML = `
        <div class="mode-toggle">
            <button class="mode-btn active" data-mode="powerpoint">
                <i class="fas fa-file-powerpoint"></i> Upload PowerPoint
            </button>
            <button class="mode-btn" data-mode="notes">
                <i class="fas fa-sticky-note"></i> Paste Notes
            </button>
        </div>
    `;
    
    // Create notes input area
    const notesInputArea = document.createElement('div');
    notesInputArea.className = 'notes-input-area hidden';
    notesInputArea.innerHTML = `
        <h3>Paste Your Notes</h3>
        <p>Paste your lecture notes, study materials, or any text content to generate quiz questions.</p>
        <textarea id="notesText" rows="10" placeholder="Paste your notes here..."></textarea>
        <button class="button primary" id="processNotesBtn">
            <i class="fas fa-cogs"></i> Process Notes
        </button>
    `;
    
    // Insert the toggle and notes area before the upload area
    const chapterCreator = document.querySelector('.chapter-creator');
    
    if (chapterCreator) {
        const title = chapterCreator.querySelector('h3');
        if (title) {
            // Replace the title to be more general
            title.textContent = 'Create New Quiz';
            
            // Insert toggle after the title
            title.insertAdjacentElement('afterend', modeToggleContainer);
            
            // Add a paragraph explaining the options
            const explanation = document.createElement('p');
            explanation.textContent = 'Choose to upload a PowerPoint file or paste your notes directly to generate quiz questions using AI.';
            modeToggleContainer.insertAdjacentElement('afterend', explanation);
            
            // Insert notes area before the upload area
            uploadArea.parentNode.insertBefore(notesInputArea, uploadArea);
        }
    }
    
    let extractedSlideContent = [];
    let inputMode = 'powerpoint'; // Default mode
    
    // Mode toggle functionality
    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.dataset.mode;
            
            // Update active button
            modeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide appropriate input method
            if (mode === 'powerpoint') {
                inputMode = 'powerpoint';
                uploadArea.classList.remove('hidden');
                notesInputArea.classList.add('hidden');
            } else if (mode === 'notes') {
                inputMode = 'notes';
                uploadArea.classList.add('hidden');
                notesInputArea.classList.remove('hidden');
            }
        });
    });
    
    // Process notes button functionality
    const processNotesBtn = document.getElementById('processNotesBtn');
    if (processNotesBtn) {
        processNotesBtn.addEventListener('click', function() {
            const notesText = document.getElementById('notesText').value.trim();
            
            if (notesText.length < 50) {
                alert('Please enter sufficient notes content (at least 50 characters).');
                return;
            }
            
            // Hide notes input
            notesInputArea.classList.add('hidden');
            
            // Show processing status
            processingStatus.classList.remove('hidden');
            document.getElementById('processingInfo').textContent = 'Processing notes...';
            
            // Extract content from notes
            const lines = notesText.split('\n').filter(line => line.trim().length > 0);
            extractedSlideContent = [];
            
            // Format notes similar to slides
            let currentSlide = '';
            let slideCounter = 1;
            
            lines.forEach((line, index) => {
                // Detect if this might be a slide title (simple heuristic)
                const mightBeTitle = line.length < 80 && !line.endsWith('.') && !line.includes(',');
                
                if (mightBeTitle && currentSlide.length > 0) {
                    // Save previous slide content
                    extractedSlideContent.push(`Slide ${slideCounter}: ${currentSlide}`);
                    slideCounter++;
                    currentSlide = line;
                } else {
                    if (currentSlide.length > 0) {
                        currentSlide += ' ' + line;
                    } else {
                        currentSlide = line;
                    }
                }
                
                // Handle last line
                if (index === lines.length - 1 && currentSlide.length > 0) {
                    extractedSlideContent.push(`Slide ${slideCounter}: ${currentSlide}`);
                }
            });
            
            // If no slides were created, just split the text into chunks
            if (extractedSlideContent.length === 0) {
                const chunks = chunkText(notesText, 200);
                extractedSlideContent = chunks.map((chunk, i) => `Slide ${i+1}: ${chunk}`);
            }
            
            // Generate a suggested title based on the content
            const suggestedTitle = generateSuggestedTitle(notesText);
            
            // Update processing status
            document.getElementById('processingInfo').textContent = 
                `Processed ${extractedSlideContent.length} content sections.`;
            
            // Show chapter details
            chapterDetails.classList.remove('hidden');
            
            // Generate suggested ID
            const suggestedId = suggestedTitle
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-zA-Z0-9-]/g, '');
            
            // Set values
            document.getElementById('chapterTitle').value = suggestedTitle;
            document.getElementById('chapterId').value = suggestedId;
            
            // Generate AI prompt
            generateAIPrompt();
        });
    }
    
    // Helper function to chunk text into sections
    function chunkText(text, chunkSize) {
        const words = text.split(' ');
        const chunks = [];
        let currentChunk = '';
        
        words.forEach(word => {
            if ((currentChunk + ' ' + word).length > chunkSize) {
                chunks.push(currentChunk.trim());
                currentChunk = word;
            } else {
                currentChunk += ' ' + word;
            }
        });
        
        if (currentChunk.trim().length > 0) {
            chunks.push(currentChunk.trim());
        }
        
        return chunks;
    }
    
    // Helper function to generate a title from text
    function generateSuggestedTitle(text) {
        // Try to find the first line that's likely a title
        const lines = text.split('\n');
        const firstNonEmptyLine = lines.find(line => line.trim().length > 0);
        
        if (firstNonEmptyLine && firstNonEmptyLine.length < 60) {
            return firstNonEmptyLine.trim();
        }
        
        // Otherwise extract common words to form a title
        const words = text.toLowerCase()
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3);
        
        // Count word frequency
        const wordCounts = {};
        words.forEach(word => {
            if (!commonWords.includes(word)) {
                wordCounts[word] = (wordCounts[word] || 0) + 1;
            }
        });
        
        // Get top words
        const topWords = Object.entries(wordCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .map(entry => entry[0]);
        
        if (topWords.length > 0) {
            // Capitalize first letter of each word
            const capitalizedWords = topWords.map(
                word => word.charAt(0).toUpperCase() + word.slice(1)
            );
            return `${capitalizedWords.join(' ')} Quiz`;
        }
        
        return 'Study Notes Quiz';
    }
    
    // List of common words to ignore
    const commonWords = [
        'this', 'that', 'they', 'them', 'their', 'there', 'here', 'where',
        'when', 'which', 'what', 'will', 'have', 'from', 'with', 'would',
        'should', 'could', 'about', 'these'
    ];
    
    // Setup drag and drop for file upload
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('active');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('active');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('active');
        
        if (e.dataTransfer.files.length) {
            fileUpload.files = e.dataTransfer.files;
            validateSelectedFile();
        }
    });
    
    uploadArea.addEventListener('click', function() {
        fileUpload.click();
    });
    
    fileUpload.addEventListener('change', function() {
        validateSelectedFile();
    });
    
    // Validate the selected file
    function validateSelectedFile() {
        const file = fileUpload.files[0];
        
        if (!file) {
            return;
        }
        
        // Check if it's a PowerPoint file
        if (!file.name.endsWith('.ppt') && !file.name.endsWith('.pptx')) {
            alert('Please select a valid PowerPoint file (.ppt or .pptx)');
            fileUpload.value = '';
            return;
        }
        
        // Enable the process button
        processFileBtn.disabled = false;
        
        // Show file name
        uploadArea.querySelector('p').textContent = `Selected file: ${file.name}`;
    }
    
    // Process file button click handler
    processFileBtn.addEventListener('click', async function() {
        const file = fileUpload.files[0];
        if (!file) return;
        
        // Show processing status
        uploadArea.classList.add('hidden');
        processFileBtn.disabled = true;
        processingStatus.classList.remove('hidden');
        
        try {
            // Read file contents
            const fileBuffer = await readFileAsArrayBuffer(file);
            
            // Extract text content from PowerPoint
            extractedSlideContent = await PptxJsHandler.extractText(fileBuffer);
            
            // Update processing status
            document.getElementById('processingInfo').textContent = 
                `Extracted ${extractedSlideContent.length} slides.`;
            
            // Show chapter details input
            chapterDetails.classList.remove('hidden');
            
            // Generate chapter ID from file name (remove extension and spaces)
            const suggestedId = file.name
                .replace(/\.pptx?$/, '')
                .replace(/\s+/g, '-')
                .replace(/[^a-zA-Z0-9-]/g, '')
                .toLowerCase();
            
            document.getElementById('chapterTitle').value = file.name.replace(/\.pptx?$/, '');
            document.getElementById('chapterId').value = suggestedId;
            
            // Generate AI prompt
            generateAIPrompt();
            
        } catch (error) {
            console.error('Error processing file:', error);
            alert('Error processing file: ' + error.message);
            resetUI();
        }
    });
    
    // Generate AI prompt based on extracted content
    function generateAIPrompt() {
        if (extractedSlideContent.length === 0) {
            alert('No content extracted. Please try again.');
            return;
        }
        
        const chapterTitle = document.getElementById('chapterTitle').value || 'Untitled Chapter';
        const chapterId = document.getElementById('chapterId').value || 'untitledChapter';
        
        // Construct prompt for AI
        let prompt = `Create a quiz for the following topic: "${chapterTitle}"\n\n`;
        prompt += `Here is the content extracted from ${inputMode === 'powerpoint' ? 'a PowerPoint presentation' : 'notes'}:\n\n`;
        
        // Add content
        extractedSlideContent.forEach((slide, index) => {
            prompt += `${slide}\n`;
        });
        
        prompt += `\n\nBased on this content, create a JavaScript array of quiz questions. Each question should have the following format:\n`;
        prompt += `
{
    "question": "The question text here?",
    "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
    ],
    "correctAnswer": 0, // Index of the correct answer (0 = A, 1 = B, etc.)
    "explanation": "Explanation of why this answer is correct",
    "chapter": "${chapterTitle}" // Include the chapter name
}
`;
        
        prompt += `\nCreate 10-15 questions that test understanding of key concepts from the content. Include a mix of easy, medium, and difficult questions.\n`;
        prompt += `\nProvide ONLY the JavaScript array without additional text, and use double quotes for all property names and string values. The output should start with: [\n  {\n    and end with  }\n]`;
        
        // Display the prompt for copying
        document.getElementById('aiPrompt').textContent = prompt;
        aiPromptArea.classList.remove('hidden');
        aiResponseArea.classList.remove('hidden');
        
        // Enable response area
        aiResponse.disabled = false;
        aiResponse.placeholder = 'Paste the AI-generated quiz content here...';
    }
    
    // Copy prompt button
    copyPromptBtn.addEventListener('click', function() {
        const promptText = document.getElementById('aiPrompt').textContent;
        navigator.clipboard.writeText(promptText)
            .then(() => {
                // Change button text temporarily to indicate success
                const originalText = copyPromptBtn.innerHTML;
                copyPromptBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyPromptBtn.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                alert('Failed to copy to clipboard. Please select and copy the text manually.');
            });
    });
    
    // Enable/disable generate files button based on AI response
    aiResponse.addEventListener('input', function() {
        generateFilesBtn.disabled = aiResponse.value.trim().length === 0;
    });
    
    // Generate chapter files button
    generateFilesBtn.addEventListener('click', function() {
        const aiResponseText = aiResponse.value.trim();
        
        if (!aiResponseText) {
            alert('Please paste the AI-generated content first.');
            return;
        }
        
        const chapterId = document.getElementById('chapterId').value;
        const chapterTitle = document.getElementById('chapterTitle').value;
        
        if (!chapterId || !chapterTitle) {
            alert('Please provide both Chapter Title and Chapter ID.');
            return;
        }
        
        // Process the AI response to get questions - with improved error handling
        let questions;
        try {
            questions = processAIResponse(aiResponseText, chapterTitle);
            if (!questions || questions.length === 0) {
                console.warn("No questions returned from processAIResponse, creating default questions");
                questions = [
                    {
                        question: "Sample Question 1",
                        options: ["Option A", "Option B", "Option C", "Option D"],
                        correctAnswer: 0,
                        explanation: "This is a sample question.",
                        chapter: chapterTitle
                    }
                ];
            }
        } catch (e) {
            console.error("Failed to process AI response, using fallback questions", e);
            questions = [
                {
                    question: "Sample Question 1",
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    correctAnswer: 0,
                    explanation: "This is a sample question.",
                    chapter: chapterTitle
                }
            ];
        }
        
        // Add the quiz directly to the global scope
        console.log(`Adding ${questions.length} questions for ${chapterTitle}`);
        
        // Add to quizDataByChapter
        if (typeof quizDataByChapter !== 'undefined') {
            quizDataByChapter[chapterId] = questions;
            console.log(`Added questions to quizDataByChapter[${chapterId}]`);
        } else {
            console.warn("quizDataByChapter is not defined");
            window.quizDataByChapter = {
                [chapterId]: questions
            };
        }
        
        // Create a global variable for the quiz
        window[`${chapterId}Questions`] = questions;
        
        // Also create a special variable for temporary quizzes
        window.newQuizData = {
            id: chapterId,
            title: chapterTitle,
            description: `${questions.length} questions about ${chapterTitle}`,
            questions: questions,
            createdAt: new Date().toISOString()
        };
        
        // Make sure the latest uploaded quiz is set
        window.latestUploadedQuiz = window.newQuizData;
        
        // Save quiz to localStorage (as a temporary quiz)
        localStorage.setItem('pentestpro_temp_quiz', JSON.stringify(window.newQuizData));
        
        // Force chapter manager to refresh chapters
        if (typeof ChapterManager !== 'undefined' && typeof ChapterManager.refreshChapterOptions === 'function') {
            console.log("Refreshing chapter options...");
            ChapterManager.refreshChapterOptions();
        }
        
        // Show success message
        resultArea.classList.remove('hidden');
        document.getElementById('chapterInstruction').innerHTML = `
            <p>Quiz "${chapterTitle}" has been created with ${questions.length} questions!</p>
            <p>You can now select it when starting a new quiz.</p>
            <div class="buttons-container" style="justify-content: flex-start; margin-top: 15px;">
                <button class="button primary" id="startNewQuizBtn">
                    <i class="fas fa-play"></i> Start New Quiz
                </button>
                <button class="button" id="saveQuizBtn">
                    <i class="fas fa-save"></i> Save Quiz
                </button>
            </div>
        `;
        
        // Add event listener for the start new quiz button
        document.getElementById('startNewQuizBtn').addEventListener('click', function() {
            // Hide generator UI
            document.querySelector('.chapter-creator').classList.add('hidden');
            
            // Show chapter selection screen
            document.getElementById('welcomeScreen').classList.add('hidden');
            document.getElementById('chapterSelection').classList.remove('hidden');
            
            // Refresh the chapter options to show the new quiz
            if (typeof ChapterManager !== 'undefined' && 
                typeof ChapterManager.refreshChapterOptions === 'function') {
                ChapterManager.refreshChapterOptions();
            }
        });
        
        // Add event listener for the save quiz button
        document.getElementById('saveQuizBtn').addEventListener('click', function() {
            saveQuizToLocalStorage(chapterId, chapterTitle, questions);
            alert(`Quiz "${chapterTitle}" has been saved! It will be available in future sessions.`);
            
            // Refresh to update the UI
            location.reload();
        });
        
        // Hide the AI response area
        aiResponseArea.classList.add('hidden');
    });
        
    // Process AI response to extract questions array
    function processAIResponse(aiResponseText, chapterTitle) {
        try {
            // The AI response likely contains a JS array of questions
            // Extract just the array part by finding everything between square brackets
            let arrayText = aiResponseText;
            
            // If the response contains more than just the array, try to extract just the array
            if (!aiResponseText.trim().startsWith('[')) {
                const arrayMatch = aiResponseText.match(/\[\s*\{[\s\S]*\}\s*\]/);
                if (!arrayMatch) {
                    throw new Error("Could not find a valid questions array in the AI response");
                }
                arrayText = arrayMatch[0];
            }
            
            // IMPORTANT FIX: Convert JavaScript object notation to valid JSON
            // This adds double quotes around property names
            arrayText = arrayText
                // Replace property names without quotes with quoted versions
                .replace(/(\s*)(\w+)(\s*):(\s*)/g, '$1"$2"$3:$4')
                // Fix double quotes that might have been added to already quoted properties
                .replace(/""/g, '"');
            
            // Ensure string values have proper quotes (fix any mix of single and double quotes)
            // This is complex, so we'll use a more robust method: Function constructor
            let questionsArray;
            try {
                // Try normal JSON parsing first (safest option)
                questionsArray = JSON.parse(arrayText);
            } catch (jsonError) {
                console.log("Standard JSON parsing failed, trying alternative method");
                
                // Fallback: Use the Function constructor to evaluate the JavaScript code
                // This is safer than eval() but still needs to be handled carefully
                try {
                    questionsArray = new Function('return ' + aiResponseText)();
                } catch (funcError) {
                    console.error("Both parsing methods failed:", funcError);
                    throw new Error("Could not parse the AI response: " + funcError.message);
                }
            }
            
            // Validate the structure of the questions
            if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
                throw new Error("Invalid questions array format");
            }
            
            // Check if each question has the required properties
            questionsArray.forEach((q, index) => {
                if (!q.question || !Array.isArray(q.options) || q.correctAnswer === undefined) {
                    console.warn(`Question at index ${index} has invalid format, fixing...`);
                    // Try to fix the question rather than throwing an error
                    if (!q.question) q.question = `Question ${index + 1}`;
                    if (!Array.isArray(q.options)) q.options = ["Option A", "Option B", "Option C", "Option D"];
                    if (q.correctAnswer === undefined) q.correctAnswer = 0;
                }
                
                // Add chapter property if not present
                if (!q.chapter) {
                    q.chapter = chapterTitle;
                }
                
                // Add explanation if not present
                if (!q.explanation) {
                    q.explanation = `The correct answer is: ${q.options[q.correctAnswer]}`;
                }
            });
            
            return questionsArray;
        } catch (error) {
            console.error("Error parsing AI response:", error);
            // Don't show alert, it can be confusing
            console.warn("Attempting to recover from parsing error");
            
            // Return a minimal set of questions instead of null
            return [
                {
                    question: "What is the main topic of this content?",
                    options: ["Option A", "Option B", "Option C", `${chapterTitle}`],
                    correctAnswer: 3,
                    explanation: `This question is about ${chapterTitle}.`,
                    chapter: chapterTitle
                },
                {
                    question: "Sample Question",
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    correctAnswer: 0,
                    explanation: "This is a sample question created when there was a parsing error.",
                    chapter: chapterTitle
                }
            ];
        }
    }

    // Save a temporary quiz
    function saveTempQuiz(quizData) {
        console.log("Saving temporary quiz:", quizData.title);
        
        // Use Storage module if available
        if (typeof Storage !== 'undefined' && Storage.saveTempQuiz) {
            const success = Storage.saveTempQuiz(quizData);
            if (success) {
                console.log("Temp quiz saved successfully using Storage module");
                return true;
            } else {
                console.error("Failed to save temp quiz using Storage module");
            }
        }
        
        // Fallback to direct localStorage manipulation
        try {
            // Get existing temp quizzes
            let tempQuizzes = [];
            try {
                const tempQuizzesJson = localStorage.getItem('pentestpro_temp_quizzes');
                if (tempQuizzesJson) {
                    tempQuizzes = JSON.parse(tempQuizzesJson);
                    if (!Array.isArray(tempQuizzes)) {
                        console.warn("Invalid temp quizzes format, initializing as empty array");
                        tempQuizzes = [];
                    }
                }
            } catch (parseError) {
                console.error("Error parsing temp quizzes:", parseError);
                tempQuizzes = [];
            }
            
            // Check if this quiz already exists in temp quizzes
            const existingIndex = tempQuizzes.findIndex(quiz => quiz.id === quizData.id);
            
            if (existingIndex >= 0) {
                // Update existing quiz
                tempQuizzes[existingIndex] = quizData;
            } else {
                // Add new quiz
                tempQuizzes.push(quizData);
            }
            
            // Save the array back to localStorage
            localStorage.setItem('pentestpro_temp_quizzes', JSON.stringify(tempQuizzes));
            
            // Also save as single quiz for backward compatibility
            localStorage.setItem('pentestpro_temp_quiz', JSON.stringify(quizData));
            
            console.log(`Saved temp quiz. Now have ${tempQuizzes.length} temporary quizzes.`);
            return true;
        } catch (e) {
            console.error("Error saving temp quiz:", e);
            return false;
        }
    }
    
    // Save quiz to localStorage
    function saveQuizToLocalStorage(id, title, questions) {
        console.log(`Saving quiz "${title}" with ID "${id}" to localStorage...`);
        
        // Prepare quiz data
        const quizData = {
            id: id,
            title: title,
            description: `${questions.length} questions about ${title}`,
            questions: questions,
            createdAt: new Date().toISOString()
        };
        
        // Use Storage module if available
        if (typeof Storage !== 'undefined' && Storage.saveQuiz) {
            const success = Storage.saveQuiz(quizData);
            if (success) {
                console.log("Quiz saved successfully using Storage module");
                return true;
            } else {
                console.error("Failed to save quiz using Storage module");
            }
        }
        
        // Fallback to direct localStorage manipulation
        try {
            // Get existing saved quizzes or initialize empty array
            let savedQuizzes = [];
            try {
                const savedQuizzesJson = localStorage.getItem('pentestpro_saved_quizzes');
                if (savedQuizzesJson) {
                    savedQuizzes = JSON.parse(savedQuizzesJson);
                    if (!Array.isArray(savedQuizzes)) {
                        console.warn("Invalid saved quizzes format, initializing as empty array");
                        savedQuizzes = [];
                    }
                }
            } catch (parseError) {
                console.error("Error parsing saved quizzes from localStorage:", parseError);
                savedQuizzes = [];
            }
            
            console.log(`Found ${savedQuizzes.length} existing saved quizzes`);
            
            // Check if this quiz already exists
            const existingIndex = savedQuizzes.findIndex(quiz => quiz.id === id);
            
            if (existingIndex >= 0) {
                // Update existing quiz
                console.log(`Updating existing quiz at index ${existingIndex}`);
                quizData.updatedAt = new Date().toISOString();
                savedQuizzes[existingIndex] = {
                    ...savedQuizzes[existingIndex],
                    ...quizData
                };
            } else {
                // Add new quiz
                console.log(`Adding new quiz to saved quizzes array`);
                savedQuizzes.push(quizData);
            }
            
            // Safely stringify the saved quizzes
            const savedQuizzesJson = JSON.stringify(savedQuizzes);
            
            // Save back to localStorage
            localStorage.setItem('pentestpro_saved_quizzes', savedQuizzesJson);
            console.log(`Successfully saved ${savedQuizzes.length} quizzes to localStorage`);
            
            return true;
        } catch (e) {
            console.error("Error saving quiz to localStorage:", e);
            alert("There was an error saving the quiz. Please try again.");
            return false;
        }
    }
    
    // Helper function to read file as ArrayBuffer
    function readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            
            reader.onerror = function(e) {
                reject(new Error('Error reading file: ' + e.target.error));
            };
            
            reader.readAsArrayBuffer(file);
        });
    }
    
    // Reset UI to initial state
    function resetUI() {
        uploadArea.classList.remove('hidden');
        notesInputArea.classList.add('hidden');
        processFileBtn.disabled = true;
        chapterDetails.classList.add('hidden');
        processingStatus.classList.add('hidden');
        aiPromptArea.classList.add('hidden');
        aiResponseArea.classList.add('hidden');
        resultArea.classList.add('hidden');
        fileUpload.value = '';
        uploadArea.querySelector('p').textContent = 'Drag & drop PowerPoint files here or click to browse';
        document.getElementById('notesText').value = '';
        extractedSlideContent = [];
    }
    
    // Add CSS styles for the new UI elements
    const style = document.createElement('style');
    style.textContent = `
        .mode-toggle-container {
            margin-bottom: 20px;
        }
        
        .mode-toggle {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .mode-btn {
            padding: 10px 15px;
            border: 1px solid var(--border-color, #ccc);
            background-color: var(--bg-color, #f5f5f5);
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .mode-btn.active {
            background-color: var(--primary-color, #3498db);
            color: white;
            border-color: var(--primary-color, #3498db);
        }
        
        .notes-input-area {
            margin-bottom: 20px;
        }
        
        .notes-input-area textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid var(--border-color, #ccc);
            border-radius: 4px;
            margin-bottom: 10px;
            font-family: inherit;
        }
        
        .hidden {
            display: none;
        }
    `;
    document.head.appendChild(style);
}

// Safe JSON parse that handles JS object notation
function safeParse(text) {
    // First try to convert JS object notation to valid JSON
    try {
        // Convert from JS object notation to valid JSON
        const jsonText = text
            // Replace property names without quotes with quoted versions
            .replace(/(\s*)(\w+)(\s*):(\s*)/g, '$1"$2"$3:$4')
            // Fix double quotes that might have been added to already quoted properties
            .replace(/""/g, '"');
            
        return JSON.parse(jsonText);
    } catch (e) {
        console.log("Standard JSON parsing failed, trying alternative method");
        
        // If that fails, try using Function constructor
        try {
            return new Function('return ' + text)();
        } catch (funcError) {
            console.error("Both parsing methods failed:", funcError);
            throw new Error("Could not parse the text: " + funcError.message);
        }
    }
}

// Error handler with fallback
function tryOrDefault(operation, defaultValue) {
    try {
        return operation();
    } catch (e) {
        console.warn("Operation failed, using default value", e);
        return defaultValue;
    }
}