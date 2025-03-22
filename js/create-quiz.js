/**
 * Create Quiz Form Manager
 * Handles quiz creation form with file upload and validation
 */
class CreateQuizManager {
    constructor() {
        console.log('Create Quiz Manager initializing...');
        this.api = window.api;
        
        // Initialize DOM references
        this.initDomReferences();
   
        // Initialize the page
        this.init();
    }
    
    /**
     * Initialize DOM references
     */
    initDomReferences() {
        // Form elements
        this.createQuizForm = document.getElementById('create-quiz-form');
        this.categorySelect = document.getElementById('categorySelect');
        this.subcategorySelect = document.getElementById('subcategorySelect');
        this.fileUpload = document.getElementById('file-upload');
        this.fileUploadSection = document.getElementById('file-upload-section');
        this.textPasteSection = document.getElementById('text-paste-section');
        this.uploadToggleBtn = document.getElementById('upload-toggle-btn');
        this.pasteToggleBtn = document.getElementById('paste-toggle-btn');
        this.selectedFileName = document.getElementById('selected-file-name');
        this.generateQuizBtn = document.getElementById('generateQuizBtn');
        
        // Modal elements
        this.processingModal = document.getElementById('processingModal');
        this.successModal = document.getElementById('successModal');
        this.errorModal = document.getElementById('errorModal');
        this.errorMessage = document.getElementById('error-message');
        this.viewQuizBtn = document.getElementById('viewQuizBtn');
        this.closeErrorBtn = document.getElementById('closeErrorBtn');
    }
    
    /**
     * Initialize the page
     */
    async init() {
        // Load categories
        await this.loadCategories();
        
        // Set up event listeners
        this.attachEventListeners();
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Category change to load subcategories
        if (this.categorySelect) {
            this.categorySelect.addEventListener('change', async () => {
                await this.loadSubcategories();
            });
        }
        
        // File upload handling
        if (this.fileUpload) {
            this.fileUpload.addEventListener('change', (event) => {
                this.handleFileUpload(event);
            });
        }
        
        // Toggle between file upload and text paste
        if (this.uploadToggleBtn && this.pasteToggleBtn) {
            this.uploadToggleBtn.addEventListener('click', () => {
                this.switchToFileUploadMode();
            });
            
            this.pasteToggleBtn.addEventListener('click', () => {
                this.switchToTextPasteMode();
            });
        }
        
        // Form submission
        if (this.createQuizForm) {
            this.createQuizForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleFormSubmit();
            });
        }
        
        // Error modal close button
        if (this.closeErrorBtn) {
            this.closeErrorBtn.addEventListener('click', () => {
                this.hideModal(this.errorModal);
            });
        }
    }
    
    /**
     * Load categories for select element
     */
    async loadCategories() {
        try {
            console.log('Loading categories');
            if (!this.categorySelect) {
                console.error('Category select element not found');
                return;
            }
            
            const categories = await this.api.getCategories();
            console.log(`Loaded ${categories.length} categories`);
            
            // Clear existing options except for the default
            while (this.categorySelect.options.length > 1) {
                this.categorySelect.remove(1);
            }
            
            // Add categories
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.category_id;
                option.textContent = category.name;
                this.categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading categories:', error);
            this.showError('Failed to load categories. Please refresh the page.');
        }
    }
    
    /**
     * Load subcategories based on selected category
     */
    async loadSubcategories() {
        const categoryId = this.categorySelect.value;
        console.log(`Category changed to: ${categoryId}`);
        
        if (!categoryId) {
            console.log('No category selected, skipping subcategory load');
            return;
        }
        
        try {
            console.log(`Loading subcategories for category ${categoryId}`);
            const subcategories = await this.api.getSubcategories(categoryId);
            console.log(`Loaded ${subcategories.length} subcategories`);
            
            if (!this.subcategorySelect) {
                console.error('Subcategory select element not found');
                return;
            }
            
            // Clear existing options
            this.subcategorySelect.innerHTML = '<option value="" disabled selected>Select a subcategory</option>';
            
            // Add subcategories
            subcategories.forEach(subcategory => {
                const option = document.createElement('option');
                option.value = subcategory.subcategory_id;
                option.textContent = subcategory.name;
                this.subcategorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading subcategories:', error);
            this.showError('Failed to load subcategories');
        }
    }
    
    /**
     * Handle file upload
     * @param {Event} event - Change event from file input
     */
    handleFileUpload(event) {
        console.log('File selection changed');
        
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            console.log(`File selected: ${file.name} (${file.type}, ${(file.size / 1024).toFixed(2)} KB)`);
            
            // Check file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                this.showError('File size exceeds 10MB limit. Please choose a smaller file.');
                this.fileUpload.value = ''; // Clear the file input
                if (this.selectedFileName) {
                    this.selectedFileName.classList.add('hidden');
                }
                return;
            }
            
            // Check file type
            const allowedTypes = [
                'application/pdf', 
                'application/msword', 
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'text/plain'
            ];
            
            if (!allowedTypes.includes(file.type)) {
                console.warn(`File type not explicitly supported: ${file.type}`);
                // Still allow it, but warn the user
                if (confirm('This file type may not be fully supported. Continue anyway?')) {
                    // User wants to proceed
                    console.log('User chose to proceed with potentially unsupported file type');
                } else {
                    // User canceled
                    console.log('User canceled file selection due to unsupported type');
                    this.fileUpload.value = ''; // Clear the file input
                    if (this.selectedFileName) {
                        this.selectedFileName.classList.add('hidden');
                    }
                    return;
                }
            }
            
            // Update UI with file name
            if (this.selectedFileName) {
                this.selectedFileName.textContent = `Selected file: ${file.name}`;
                this.selectedFileName.classList.remove('hidden');
            }
        } else {
            console.log('No file selected');
            if (this.selectedFileName) {
                this.selectedFileName.classList.add('hidden');
            }
        }
    }
    
    /**
     * Switch to file upload mode
     */
    switchToFileUploadMode() {
        console.log('Switched to file upload mode');
        if (this.fileUploadSection) {
            this.fileUploadSection.classList.remove('hidden');
        }
        
        if (this.textPasteSection) {
            this.textPasteSection.classList.add('hidden');
        }
        
        if (this.uploadToggleBtn) {
            this.uploadToggleBtn.classList.remove('bg-gray-200', 'text-gray-700');
            this.uploadToggleBtn.classList.add('bg-indigo-600', 'text-white');
        }
        
        if (this.pasteToggleBtn) {
            this.pasteToggleBtn.classList.remove('bg-indigo-600', 'text-white');
            this.pasteToggleBtn.classList.add('bg-gray-200', 'text-gray-700');
        }
    }
    
    /**
     * Switch to text paste mode
     */
    switchToTextPasteMode() {
        console.log('Switched to text paste mode');
        if (this.fileUploadSection) {
            this.fileUploadSection.classList.add('hidden');
        }
        
        if (this.textPasteSection) {
            this.textPasteSection.classList.remove('hidden');
        }
        
        if (this.pasteToggleBtn) {
            this.pasteToggleBtn.classList.remove('bg-gray-200', 'text-gray-700');
            this.pasteToggleBtn.classList.add('bg-indigo-600', 'text-white');
        }
        
        if (this.uploadToggleBtn) {
            this.uploadToggleBtn.classList.remove('bg-indigo-600', 'text-white');
            this.uploadToggleBtn.classList.add('bg-gray-200', 'text-gray-700');
        }
    }
    
    /**
     * Validate form inputs
     * @returns {boolean} - Whether the form is valid
     */
    validateForm() {
        console.log('Validating form');
        
        // Required fields
        const quizTitle = document.getElementById('quizTitle').value;
        const categoryId = this.categorySelect ? this.categorySelect.value : null;
        
        // Check if title is provided
        if (!quizTitle.trim()) {
            this.showError('Please enter a quiz title');
            return false;
        }
        
        // Check if category is selected
        if (!categoryId) {
            this.showError('Please select a category');
            return false;
        }
        
        // Check content input method
        const isUsingFileUpload = !this.fileUploadSection.classList.contains('hidden');
        
        if (isUsingFileUpload) {
            // Check if file is selected
            if (!this.fileUpload || this.fileUpload.files.length === 0) {
                this.showError('Please select a file to upload');
                return false;
            }
        } else {
            // Check if text is pasted
            const pastedText = document.getElementById('pasted-text').value;
            if (!pastedText.trim()) {
                this.showError('Please paste some text content');
                return false;
            }
            
            // Check minimum text length
            if (pastedText.trim().length < 100) {
                this.showError('Please provide more content (minimum 100 characters)');
                return false;
            }
        }
        
        // Quiz configuration validation
        const numQuestions = parseInt(document.getElementById('numQuestions').value);
        if (isNaN(numQuestions) || numQuestions < 1) {
            this.showError('Please specify a valid number of questions');
            return false;
        }
        
        console.log('Form validation passed');
        return true;
    }
    
    /**
     * Handle form submission
     */
    async handleFormSubmit() {
        // Validate form
        if (!this.validateForm()) {
            return;
        }
        
        // Show processing modal
        this.showModal(this.processingModal);
        
        // Create FormData
        const formData = new FormData();
        
        // Add quiz details
        formData.append('title', document.getElementById('quizTitle').value);
        formData.append('description', document.getElementById('quizDescription').value);
        formData.append('category_id', this.categorySelect.value);
        
        // Handle subcategory (existing or new)
        const newSubcategory = document.getElementById('newSubcategory').value;
        
        if (newSubcategory.trim()) {
            console.log(`Using new subcategory: "${newSubcategory}"`);
            formData.append('new_subcategory', newSubcategory);
        } else if (this.subcategorySelect.value) {
            console.log(`Using existing subcategory ID: ${this.subcategorySelect.value}`);
            formData.append('subcategory_id', this.subcategorySelect.value);
        }
        
        // Add quiz configuration
        formData.append('num_questions', document.getElementById('numQuestions').value);
        formData.append('time_limit', document.getElementById('timeLimit').value * 60); // Convert to seconds
        formData.append('difficulty_level', document.getElementById('difficultyLevel').value);
        formData.append('is_public', document.getElementById('visibilitySelect').value);
        formData.append('quiz_language', document.getElementById('quizLanguage').value);
        
        console.log('Quiz configuration:', {
            title: document.getElementById('quizTitle').value,
            category: this.categorySelect.value,
            numQuestions: document.getElementById('numQuestions').value,
            timeLimit: document.getElementById('timeLimit').value * 60,
            difficultyLevel: document.getElementById('difficultyLevel').value,
            isPublic: document.getElementById('visibilitySelect').value
        });
        
        // Add either file or text content
        const isUsingFileUpload = !this.fileUploadSection.classList.contains('hidden');
        
        try {
            if (isUsingFileUpload) {
                console.log('Adding file to form data');
                formData.append('file', this.fileUpload.files[0]);
            } else {
                // Create a text file from the pasted text
                const pastedText = document.getElementById('pasted-text').value;
                console.log(`Creating text file from pasted content (${pastedText.length} characters)`);
                const textBlob = new Blob([pastedText], { type: 'text/plain' });
                formData.append('file', textBlob, 'pasted-content.txt');
                formData.append('is_pasted_content', 'true');
            }
            
            // Upload file/text and create quiz
            console.log('Submitting quiz creation request');
            const response = await this.api.uploadFileAndCreateQuiz(formData);
            console.log('Quiz creation response:', response);
            
            // Hide processing modal
            this.hideModal(this.processingModal);
            
            // Show success modal
            this.showModal(this.successModal);
            
            // Set up view quiz button
            if (this.viewQuizBtn) {
                this.viewQuizBtn.addEventListener('click', () => {
                    console.log(`Redirecting to quiz page for quiz ID: ${response.quiz_id}`);
                    window.location.href = `/quiz.html?id=${response.quiz_id}`;
                });
            }
        } catch (error) {
            console.error('Error creating quiz:', error);
            
            // Hide processing modal
            this.hideModal(this.processingModal);
            
            // Show error modal with message
            this.showError(error.message || 'An error occurred while processing your request. Please try again.');
        }
    }
    
    /**
     * Show modal
     * @param {HTMLElement} modal - Modal element to show
     */
    showModal(modal) {
        if (modal) {
            modal.classList.remove('hidden');
            console.log(`Modal shown: ${modal.id}`);
        }
    }
    
    /**
     * Hide modal
     * @param {HTMLElement} modal - Modal element to hide
     */
    hideModal(modal) {
        if (modal) {
            modal.classList.add('hidden');
            console.log(`Modal hidden: ${modal.id}`);
        }
    }
    
    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        console.error('Quiz creation error:', message);
        if (this.errorMessage && this.errorModal) {
            this.errorMessage.textContent = message;
            this.showModal(this.errorModal);
        } else {
            alert(message);
        }
    }
}

// Initialize Create Quiz Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Create Quiz Manager');
    window.createQuiz = new CreateQuizManager();
});