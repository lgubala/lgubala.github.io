/**
 * PentestPro Chapter Generator
 * Handles PowerPoint upload and quiz generation
 */

// Initialize the module when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initChapterGenerator();
});

function initChapterGenerator() {
    const uploadArea = document.getElementById('uploadArea');
    const fileUpload = document.getElementById('fileUpload');
    const processFileBtn = document.getElementById('processFileBtn');
    const chapterDetails = document.getElementById('chapterDetails');
    const processingStatus = document.getElementById('processingStatus');
    const aiPromptArea = document.getElementById('aiPromptArea');
    const aiResponseArea = document.getElementById('aiResponseArea');
    const resultArea = document.getElementById('resultArea');
    const copyPromptBtn = document.getElementById('copyPromptBtn');
    const aiResponse = document.getElementById('aiResponse');
    const generateFilesBtn = document.getElementById('generateFilesBtn');
    
    let extractedSlideContent = [];
    
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
            alert('No content extracted from the PowerPoint.');
            return;
        }
        
        const chapterTitle = document.getElementById('chapterTitle').value || 'Untitled Chapter';
        const chapterId = document.getElementById('chapterId').value || 'untitledChapter';
        
        // Construct prompt for AI
        let prompt = `Create a quiz for the following cybersecurity topic: "${chapterTitle}"\n\n`;
        prompt += `Here is the slide content extracted from a PowerPoint presentation:\n\n`;
        
        // Add slide content
        extractedSlideContent.forEach((slide, index) => {
            prompt += `${slide}\n`;
        });
        
        prompt += `\n\nBased on this content, create a JavaScript array of quiz questions. Each question should have the following format:\n`;
        prompt += `
{
    question: "The question text here?",
    options: [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
    ],
    correctAnswer: 0, // Index of the correct answer (0 = A, 1 = B, etc.)
    explanation: "Explanation of why this answer is correct",
    chapter: "${chapterTitle}" // Include the chapter name
}
`;
        
        prompt += `\nCreate 10-15 questions that test understanding of key concepts from the slides. Include a mix of easy, medium, and difficult questions.\n`;
        prompt += `\nProvide ONLY the JavaScript array without additional text. The output should start with: [\n  {\n    and end with  }\n]`;
        
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
        
        // Process the AI response to get questions
        const questions = processAIResponse(aiResponseText);
        if (!questions) return; // Stop if parsing failed
        
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
    function processAIResponse(aiResponseText) {
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
            
            // Parse the extracted array text into a proper JS object
            const questionsArray = JSON.parse(arrayText);
            
            // Validate the structure of the questions
            if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
                throw new Error("Invalid questions array format");
            }
            
            // Check if each question has the required properties
            questionsArray.forEach((q, index) => {
                if (!q.question || !Array.isArray(q.options) || q.correctAnswer === undefined) {
                    throw new Error(`Question at index ${index} has invalid format`);
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
            alert("There was an error parsing the AI response: " + error.message);
            return null;
        }
    }
    
    // Save quiz to localStorage
    function saveQuizToLocalStorage(id, title, questions) {
        // Get existing saved quizzes or initialize empty array
        let savedQuizzes = JSON.parse(localStorage.getItem('pentestpro_saved_quizzes') || '[]');
        
        // Check if this quiz already exists
        const existingIndex = savedQuizzes.findIndex(quiz => quiz.id === id);
        
        if (existingIndex >= 0) {
            // Update existing quiz
            savedQuizzes[existingIndex] = {
                ...savedQuizzes[existingIndex],
                title: title,
                description: `${questions.length} questions about ${title}`,
                questions: questions,
                updatedAt: new Date().toISOString()
            };
        } else {
            // Add new quiz
            savedQuizzes.push({
                id: id,
                title: title,
                description: `${questions.length} questions about ${title}`,
                questions: questions,
                createdAt: new Date().toISOString()
            });
        }
        
        // Save back to localStorage
        localStorage.setItem('pentestpro_saved_quizzes', JSON.stringify(savedQuizzes));
        
        // Remove the temporary quiz
        localStorage.removeItem('pentestpro_temp_quiz');
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
        processFileBtn.disabled = true;
        chapterDetails.classList.add('hidden');
        processingStatus.classList.add('hidden');
        aiPromptArea.classList.add('hidden');
        aiResponseArea.classList.add('hidden');
        resultArea.classList.add('hidden');
        fileUpload.value = '';
        uploadArea.querySelector('p').textContent = 'Drag & drop PowerPoint files here or click to browse';
        extractedSlideContent = [];
    }
}