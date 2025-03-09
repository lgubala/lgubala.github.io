/**
 * Chapter Generator Module for processing PowerPoint files
 */
const ChapterGenerator = (function() {
    // Dependencies
    let pptxjs; // Will initialize PPTX.js on load
    
    /**
     * Initialize the chapter generator
     */
    function init() {
        // Initialize PPTX.js if available - FIX: use the object directly, don't use it as a constructor
        try {
            pptxjs = window.PptxJsHandler;
            if (!pptxjs) {
                console.error("PPTX.js library not loaded: Object not found");
            }
        } catch (e) {
            console.error("PPTX.js library not loaded:", e);
        }
        
        setupEventListeners();
        
        // Hide processing status initially
        const processingStatus = document.getElementById('processingStatus');
        if (processingStatus) {
            processingStatus.classList.add('hidden');
        }
    }
    
    /**
     * Set up event listeners for file upload and processing
     */
    function setupEventListeners() {
        const uploadArea = document.getElementById('uploadArea');
        const fileUpload = document.getElementById('fileUpload');
        const processFileBtn = document.getElementById('processFileBtn');
        const copyPromptBtn = document.getElementById('copyPromptBtn');
        const aiResponse = document.getElementById('aiResponse');
        const generateFilesBtn = document.getElementById('generateFilesBtn');
        
        // Upload area click handler
        if (uploadArea) {
            uploadArea.addEventListener('click', () => {
                fileUpload.click();
            });
            
            // Drag and drop handlers
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('drag-over');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('drag-over');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('drag-over');
                
                if (e.dataTransfer.files.length) {
                    fileUpload.files = e.dataTransfer.files;
                    handleFileSelection();
                }
            });
        }
        
        // File input change handler
        if (fileUpload) {
            fileUpload.addEventListener('change', handleFileSelection);
        }
        
        // Process button click handler
        if (processFileBtn) {
            processFileBtn.addEventListener('click', processFile);
        }
        
        // Copy prompt button handler
        if (copyPromptBtn) {
            copyPromptBtn.addEventListener('click', () => {
                const aiPrompt = document.getElementById('aiPrompt');
                navigator.clipboard.writeText(aiPrompt.textContent)
                    .then(() => {
                        copyPromptBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                        setTimeout(() => {
                            copyPromptBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy:', err);
                    });
            });
        }
        
        // AI response textarea handler
        if (aiResponse) {
            aiResponse.addEventListener('input', () => {
                generateFilesBtn.disabled = !aiResponse.value.trim();
            });
        }
        
        // Generate files button handler
        if (generateFilesBtn) {
            generateFilesBtn.addEventListener('click', generateChapterFiles);
        }
    }
    
    /**
     * Handle file selection from input
     */
    function handleFileSelection() {
        const fileUpload = document.getElementById('fileUpload');
        const processFileBtn = document.getElementById('processFileBtn');
        const chapterTitle = document.getElementById('chapterTitle');
        const chapterId = document.getElementById('chapterId');
        const chapterDetails = document.getElementById('chapterDetails');
        
        if (fileUpload.files.length) {
            const file = fileUpload.files[0];
            
            // Check if file is PowerPoint
            if (file.name.endsWith('.pptx') || file.name.endsWith('.ppt')) {
                // Enable process button
                processFileBtn.disabled = false;
                
                // Show chapter details
                chapterDetails.classList.remove('hidden');
                
                // Generate suggested chapter title and ID from filename
                const baseName = file.name.split('.')[0];
                chapterTitle.value = baseName
                    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
                    .trim();
                
                chapterId.value = baseName
                    .replace(/[^a-zA-Z0-9]/g, '') // Remove non-alphanumeric
                    .replace(/([A-Z])/g, c => c.toLowerCase()) // Convert to lowercase
                    .trim();
            } else {
                alert('Please select a PowerPoint file (.ppt or .pptx)');
                fileUpload.value = '';
                processFileBtn.disabled = true;
            }
        }
    }
    
    /**
     * Process the uploaded PowerPoint file
     */
    async function processFile() {
        const fileUpload = document.getElementById('fileUpload');
        const processingStatus = document.getElementById('processingStatus');
        const processingInfo = document.getElementById('processingInfo');
        const aiPromptArea = document.getElementById('aiPromptArea');
        const aiResponseArea = document.getElementById('aiResponseArea');
        const aiPrompt = document.getElementById('aiPrompt');
        
        if (!fileUpload.files.length) return;
        
        const file = fileUpload.files[0];
        
        // Show processing status
        processingStatus.classList.remove('hidden');
        aiPromptArea.classList.add('hidden');
        aiResponseArea.classList.add('hidden');
        
        try {
            processingInfo.textContent = 'Extracting text from slides...';
            
            // ALTERNATIVE APPROACH: If PowerPoint extraction fails,
            // we'll use a fallback approach to generate questions directly
            // from the filename
            try {
                // Extract text from PowerPoint
                const slideTexts = await extractTextFromPowerPoint(file);
                
                processingInfo.textContent = 'Generating AI prompt...';
                
                // Combine slide texts
                const combinedText = slideTexts.join('\n\n');
                
                // Generate AI prompt with extracted content
                const prompt = generateAIPrompt(combinedText);
                
                // Display AI prompt
                aiPrompt.textContent = prompt;
            } catch (extractionError) {
                console.error('Error extracting PowerPoint text:', extractionError);
                processingInfo.textContent = 'Using filename as fallback...';
                
                // Fallback to generating prompt from filename
                const fallbackContent = generateFallbackContent(file.name);
                
                // Generate AI prompt with filename
                const prompt = generateAIPrompt(fallbackContent);
                
                // Display AI prompt with warning
                aiPrompt.textContent = "NOTE: Could not extract PowerPoint content. Using the filename as a basis for question generation instead.\n\n" + prompt;
            }
            
            // Show prompt and response areas
            aiPromptArea.classList.remove('hidden');
            aiResponseArea.classList.remove('hidden');
            
            // Hide processing status
            processingStatus.classList.add('hidden');
        } catch (error) {
            console.error('Error processing file:', error);
            processingInfo.textContent = `Error: ${error.message}`;
            
            // Ensure processing status is hidden after a delay
            setTimeout(() => {
                processingStatus.classList.add('hidden');
            }, 3000);
        }
    }
    
    /**
     * Generate fallback content from filename
     * @param {string} filename - The PowerPoint filename
     * @returns {string} Fallback content
     */
    function generateFallbackContent(filename) {
        // Remove extension and replace underscores and hyphens with spaces
        const baseFilename = filename.split('.')[0]
            .replace(/[_-]/g, ' ')
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .trim();
        
        return `Topics related to ${baseFilename}:\n` +
               `- Understanding ${baseFilename}\n` +
               `- Key concepts in ${baseFilename}\n` +
               `- Important aspects of ${baseFilename}\n` +
               `- Best practices for ${baseFilename}\n`;
    }
    
    /**
     * Extract text from PowerPoint file
     * @param {File} file - The PowerPoint file
     * @returns {Promise<string[]>} Array of text from each slide
     */
    async function extractTextFromPowerPoint(file) {
        return new Promise((resolve, reject) => {
            // Make sure the PptxJsHandler is available
            if (!window.PptxJsHandler) {
                console.error('PptxJsHandler not found in window object. Looking for alternative extraction methods...');
                
                // Try a simple text extraction from the filename as fallback
                const fallbackTexts = [`Content generated from filename: ${file.name}`];
                resolve(fallbackTexts);
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    // Check if the file is a valid ZIP (all PPTX files are ZIP files)
                    const arrayBuffer = e.target.result;
                    const byteArray = new Uint8Array(arrayBuffer.slice(0, 4));
                    
                    // ZIP files start with PK\x03\x04 (hex: 50 4B 03 04)
                    if (byteArray[0] !== 0x50 || byteArray[1] !== 0x4B || 
                        byteArray[2] !== 0x03 || byteArray[3] !== 0x04) {
                        console.warn('File does not appear to be a valid ZIP archive. Using fallback extraction.');
                        const fallbackTexts = [`Content generated from filename: ${file.name}`];
                        resolve(fallbackTexts);
                        return;
                    }
                    
                    // Check if extractText function exists and is callable
                    if (typeof window.PptxJsHandler.extractText !== 'function') {
                        console.error('PptxJsHandler.extractText is not a function');
                        const fallbackTexts = [`Content generated from filename: ${file.name}`];
                        resolve(fallbackTexts);
                        return;
                    }
                    
                    window.PptxJsHandler.extractText(arrayBuffer)
                        .then(slideTexts => {
                            if (!slideTexts || slideTexts.length === 0) {
                                console.warn('No slide content could be extracted. Using fallback.');
                                const fallbackTexts = [`Content generated from filename: ${file.name}`];
                                resolve(fallbackTexts);
                                return;
                            }
                            resolve(slideTexts);
                        })
                        .catch(error => {
                            console.error('Error in extractText:', error);
                            const fallbackTexts = [`Content generated from filename: ${file.name}`];
                            resolve(fallbackTexts);
                        });
                } catch (error) {
                    console.error('Exception in extraction process:', error);
                    const fallbackTexts = [`Content generated from filename: ${file.name}`];
                    resolve(fallbackTexts);
                }
            };
            
            reader.onerror = function() {
                console.error('Error reading file');
                const fallbackTexts = [`Content generated from filename: ${file.name}`];
                resolve(fallbackTexts);
            };
            
            reader.readAsArrayBuffer(file);
        });
    }
    
    /**
     * Generate AI prompt from extracted text
     * @param {string} text - The extracted text
     * @returns {string} AI prompt
     */
    function generateAIPrompt(text) {
        const chapterTitle = document.getElementById('chapterTitle').value;
        
        return `Generate 20 multiple-choice questions for a quiz on "${chapterTitle}" based on this content:

${text}

For each question, provide:
1. The question text
2. Four possible answers (with exactly one correct)
3. The index of the correct answer (0-3)
4. A brief explanation of why the answer is correct

Format the response as a JavaScript array of objects following this exact structure:
[
  {
    "question": "Question text here?",
    "options": [
      "Option 1",
      "Option 2", 
      "Option 3",
      "Option 4"
    ],
    "correctAnswer": 0,
    "chapter": "${chapterTitle}",
    "explanation": "Explanation for why this answer is correct."
  },
  ...
]

Important:
- Make sure the correctAnswer is the index (0-3) of the correct option
- Include exactly 4 options for each question
- Make sure the questions test understanding of key concepts
- Vary the difficulty level of questions
- Make sure the questions are clear and unambiguous
- The response should be valid JSON that can be parsed with JSON.parse()`;
    }
    
    /**
     * Generate chapter files from AI response
     */
    function generateChapterFiles() {
        const aiResponse = document.getElementById('aiResponse');
        const resultArea = document.getElementById('resultArea');
        const questionFileDownload = document.getElementById('questionFileDownload');
        const chapterInstruction = document.getElementById('chapterInstruction');
        const chapterId = document.getElementById('chapterId').value;
        const chapterTitle = document.getElementById('chapterTitle').value;
        
        let questions;
        
        try {
            // Parse AI response as JSON
            const responseText = aiResponse.value.trim();
            
            // Try to extract JSON if it's wrapped in markdown code blocks
            const jsonMatch = responseText.match(/```(?:json)?\s*(\[[\s\S]*\])\s*```/);
            const jsonText = jsonMatch ? jsonMatch[1] : responseText;
            
            // Try different parsing approaches
            try {
                questions = JSON.parse(jsonText);
            } catch (parseError) {
                // Try removing any leading/trailing text that might be causing issues
                const altJsonMatch = jsonText.match(/\[\s*\{[\s\S]*\}\s*\]/);
                if (altJsonMatch) {
                    questions = JSON.parse(altJsonMatch[0]);
                } else {
                    throw parseError;
                }
            }
            
            // Validate questions
            if (!Array.isArray(questions) || questions.length === 0) {
                throw new Error('Response does not contain a valid array of questions');
            }
            
            // Additional validation for each question
            questions.forEach((q, index) => {
                if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || 
                    typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
                    throw new Error(`Question at index ${index} is invalid. Make sure it has a question, 4 options, and a valid correctAnswer.`);
                }
                
                // Ensure chapter is set correctly
                q.chapter = chapterTitle;
            });
            
            // Generate question file content
            const questionsFileContent = generateQuestionsFile(chapterId, questions);
            
            // Create downloadable files
            const questionsBlob = new Blob([questionsFileContent], { type: 'text/javascript' });
            const questionsUrl = URL.createObjectURL(questionsBlob);
            
            // Show download links
            questionFileDownload.innerHTML = `
                <a href="${questionsUrl}" download="${chapterId}.js">
                    <i class="fas fa-download"></i> Download ${chapterId}.js
                </a>
            `;
            
            // Show chapter instructions
            chapterInstruction.innerHTML = `
To add this chapter to your quiz:

1. Save the downloaded file to your js/questions/ folder
2. Add the following entry to the availableChapters array in js/chapters.js:

{
    id: '${chapterId}',
    title: '${chapterTitle}',
    description: 'Generated from PowerPoint',
    enabled: true
}

3. Add this script tag to your index.html (before quiz-enhanced.js):

<script src="js/questions/${chapterId}.js"></script>
`;
            
            // Show result area
            resultArea.classList.remove('hidden');
        } catch (error) {
            console.error('Error generating files:', error);
            alert(`Error: ${error.message}. Please check that the AI response is valid JSON.`);
        }
    }
    
    /**
     * Generate questions file content
     * @param {string} chapterId - The chapter ID
     * @param {Array} questions - The questions array
     * @returns {string} File content
     */
    function generateQuestionsFile(chapterId, questions) {
        return `/**
 * Questions for the ${document.getElementById('chapterTitle').value} chapter
 * Generated automatically from PowerPoint
 */
quizDataByChapter.${chapterId} = ${JSON.stringify(questions, null, 2)};`;
    }
    
    // Public API
    return {
        init
    };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', ChapterGenerator.init);