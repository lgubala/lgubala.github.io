/**
 * Enhanced API Service
 * Handles all API calls to the backend with improved logging and error handling
 */
class ApiService {
constructor() {
this.baseUrl = 'https://quiz-api-9imb.onrender.com';
this.token = localStorage.getItem('token');
console.log('API Service initialized', this.token ? 'Token exists' : 'No token found');
}

/**
 * Set authentication token
 * @param {string} token - JWT token
 */
setToken(token) {
console.log('Setting auth token');
this.token = token;
localStorage.setItem('token', token);
}

/**
 * Clear authentication token
 */
clearToken() {
console.log('Clearing auth token');
this.token = null;
localStorage.removeItem('token');
}

/**
 * Get headers for API requests
 * @param {boolean} includeContentType - Whether to include Content-Type header
 * @returns {Object} - Headers object
 */
getHeaders(includeContentType = true) {
const headers = {};

if (includeContentType) {
    headers['Content-Type'] = 'application/json';
}

if (this.token) {
    headers['Authorization'] = `Bearer ${this.token}`;
}

return headers;
}

/**
 * Make a GET request
 * @param {string} endpoint - API endpoint
 * @returns {Promise} - Response data
 */
async get(endpoint) {
console.log(`API GET request to: ${endpoint}`);
try {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders()
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error(`API GET error (${response.status}):`, errorData);
        throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`API GET response from ${endpoint}:`, data);
    return data;
} catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
}
}

/**
 * Make a POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request data
 * @returns {Promise} - Response data
 */
async post(endpoint, data) {
console.log(`API POST request to: ${endpoint}`, data);
try {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error(`API POST error (${response.status}):`, errorData);
        throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log(`API POST response from ${endpoint}:`, responseData);
    return responseData;
} catch (error) {
    console.error(`Error posting to ${endpoint}:`, error);
    throw error;
}
}

/**
 * Make a PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request data
 * @returns {Promise} - Response data
 */
async put(endpoint, data) {
console.log(`API PUT request to: ${endpoint}`, data);
try {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error(`API PUT error (${response.status}):`, errorData);
        throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log(`API PUT response from ${endpoint}:`, responseData);
    return responseData;
} catch (error) {
    console.error(`Error updating ${endpoint}:`, error);
    throw error;
}
}

/**
 * Make a DELETE request
 * @param {string} endpoint - API endpoint
 * @returns {Promise} - Response data
 */
async delete(endpoint) {
console.log(`API DELETE request to: ${endpoint}`);
try {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders()
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error(`API DELETE error (${response.status}):`, errorData);
        throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log(`API DELETE response from ${endpoint}:`, responseData);
    return responseData;
} catch (error) {
    console.error(`Error deleting ${endpoint}:`, error);
    throw error;
}
}

/**
 * Upload a file
 * @param {string} endpoint - API endpoint
 * @param {FormData} formData - Form data with file
 * @returns {Promise} - Response data
 */
async uploadFile(endpoint, formData) {
console.log(`API UPLOAD to: ${endpoint}`);
try {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
            'Authorization': this.token ? `Bearer ${this.token}` : ''
        },
        body: formData
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error(`API UPLOAD error (${response.status}):`, errorData);
        throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log(`API UPLOAD response from ${endpoint}:`, responseData);
    return responseData;
} catch (error) {
    console.error(`Error uploading to ${endpoint}:`, error);
    throw error;
}
}

// User Authentication API

/**
 * Login user
 * @param {Object} credentials - User credentials
 * @returns {Promise} - User data and token
 */
async login(credentials) {
console.log('Attempting login with:', { email: credentials.email, password: '******' });
const data = await this.post('/auth/login', credentials);
console.log('Login response:', data);
if (data.token) {
    console.log('Login successful, setting token');
    this.setToken(data.token);
} else {
    console.warn('Login response did not contain token!');
}
return data;
}

/**
 * Register user
 * @param {Object} userData - User registration data
 * @returns {Promise} - User data and token
 */
async register(userData) {
console.log('Attempting registration for:', { username: userData.username, email: userData.email });
const data = await this.post('/auth/register', userData);
console.log('Registration response:', data);
if (data.token) {
    console.log('Registration successful, setting token');
    this.setToken(data.token);
} else {
    console.warn('Registration response did not contain token!');
}
return data;
}

/**
 * Google authentication
 * @param {string} credential - Google credential token
 * @returns {Promise} - User data and token
 */
async googleAuth(credential) {
console.log('Attempting Google auth');
const data = await this.post('/auth/google', { credential });
console.log('Google auth response:', data);
if (data.token) {
    console.log('Google auth successful, setting token');
    this.setToken(data.token);
} else {
    console.warn('Google auth response did not contain token!');
}
return data;
}

/**
 * Get user profile
 * @returns {Promise} - User profile data
 */
async getUserProfile() {
console.log('Fetching user profile');
return this.get('/users/profile');
}

/**
 * Update user profile
 * @param {Object} profileData - User profile update data
 * @returns {Promise} - Updated user profile data
 */
async updateUserProfile(profileData) {
console.log('Updating user profile');
return this.put('/users/profile', profileData);
}

/**
 * Change user password
 * @param {Object} passwordData - Password change data
 * @returns {Promise} - Success message
 */
async changePassword(passwordData) {
console.log('Changing password');
return this.put('/users/password', passwordData);
}

// Categories API

/**
 * Get all categories
 * @returns {Promise} - Categories data
 */
async getCategories() {
console.log('Fetching categories');
return this.get('/categories');
}

/**
 * Get subcategories for a category
 * @param {number} categoryId - Category ID
 * @returns {Promise} - Subcategories data
 */
async getSubcategories(categoryId) {
console.log(`Fetching subcategories for category: ${categoryId}`);
return this.get(`/categories/${categoryId}/subcategories`);
}

// Quizzes API

/**
 * Get featured quizzes
 * @param {number} limit - Number of quizzes to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise} - Quizzes data
 */
async getFeaturedQuizzes(limit = 6, offset = 0) {
console.log(`Fetching featured quizzes (limit: ${limit}, offset: ${offset})`);
return this.get(`/quizzes?limit=${limit}&offset=${offset}`);
}

/**
 * Get quiz by ID
 * @param {number} quizId - Quiz ID
 * @returns {Promise} - Quiz data
 */
async getQuiz(quizId) {
console.log(`Fetching quiz: ${quizId}`);
return this.get(`/quizzes/${quizId}`);
}

/**
 * Get quiz questions
 * @param {number} quizId - Quiz ID
 * @param {boolean} newSet - Whether to get a new set of questions
 * @returns {Promise} - Quiz questions
 */
async getQuizQuestions(quizId, newSet = false) {
console.log(`Fetching quiz questions for quiz: ${quizId}${newSet ? ' (new set)' : ''}`);
return this.get(`/quizzes/${quizId}/questions${newSet ? '?new=true' : ''}`);
}

/**
 * Create a new quiz
 * @param {Object} quizData - Quiz data
 * @returns {Promise} - Created quiz data
 */
async createQuiz(quizData) {
console.log('Creating new quiz');
return this.post('/quizzes', quizData);
}

/**
 * Update a quiz
 * @param {number} quizId - Quiz ID
 * @param {Object} quizData - Quiz update data
 * @returns {Promise} - Updated quiz data
 */
async updateQuiz(quizId, quizData) {
console.log(`Updating quiz: ${quizId}`);
return this.put(`/quizzes/${quizId}`, quizData);
}

/**
 * Delete a quiz
 * @param {number} quizId - Quiz ID
 * @returns {Promise} - Success message
 */
async deleteQuiz(quizId) {
console.log(`Deleting quiz: ${quizId}`);
return this.delete(`/quizzes/${quizId}`);
}

/**
 * Upload file and create quiz
 * @param {FormData} formData - Form data with file and quiz details
 * @returns {Promise} - Created quiz data
 */
async uploadFileAndCreateQuiz(formData) {
console.log('Uploading file and creating quiz');
return this.uploadFile('/quizzes/upload', formData);
}

/**
 * Rate a quiz
 * @param {number} quizId - Quiz ID
 * @param {number} rating - Rating (1-5)
 * @param {string} comment - Rating comment (optional)
 * @returns {Promise} - Success message
 */
async rateQuiz(quizId, rating, comment = '') {
console.log(`Rating quiz ${quizId} with ${rating} stars`);
return this.post(`/quizzes/${quizId}/rate`, { rating, comment });
}

/**
 * Get ratings for a quiz
 * @param {string|number} quizId - Quiz ID
 * @returns {Promise<Array>} - Array of ratings
 */
async getQuizRatings(quizId) {
try {
    const response = await this.get(`/quizzes/${quizId}/ratings`);
    return response.ratings || [];
} catch (error) {
    console.error('Error fetching quiz ratings:', error);
    // If API fails, return any ratings we might have cached
    if (this.cache.quizzes && this.cache.quizzes[quizId] && this.cache.quizzes[quizId].ratings) {
        return this.cache.quizzes[quizId].ratings;
    }
    return [];
}
}

/**
 * Save a quiz (bookmark)
 * @param {number} quizId - Quiz ID
 * @returns {Promise} - Success message
 */
async saveQuiz(quizId) {
console.log(`Saving quiz: ${quizId}`);
return this.post(`/quizzes/${quizId}/save`, {});
}

/**
 * Unsave a quiz (remove bookmark)
 * @param {number} quizId - Quiz ID
 * @returns {Promise} - Success message
 */
async unsaveQuiz(quizId) {
console.log(`Unsaving quiz: ${quizId}`);
return this.delete(`/quizzes/${quizId}/save`);
}

/**
 * Search quizzes
 * @param {string} query - Search query
 * @param {number} categoryId - Category ID filter (optional)
 * @param {number} limit - Number of quizzes to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise} - Matching quizzes
 */
async searchQuizzes(query, categoryId = null, limit = 10, offset = 0) {
console.log(`Searching quizzes: "${query}" (category: ${categoryId || 'any'})`);
let endpoint = `/quizzes/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`;
if (categoryId) {
    endpoint += `&category=${categoryId}`;
}
return this.get(endpoint);
}

/**
 * Get quizzes by category
 * @param {number} categoryId - Category ID
 * @param {number} limit - Number of quizzes to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise} - Quizzes in category
 */
async getQuizzesByCategory(categoryId, limit = 10, offset = 0) {
console.log(`Fetching quizzes in category: ${categoryId}`);
return this.get(`/categories/${categoryId}/quizzes?limit=${limit}&offset=${offset}`);
}

// Quiz Attempts API

/**
 * Submit a quiz attempt
 * @param {Object} attemptData - Quiz attempt data
 * @returns {Promise} - Submitted attempt data
 */
async submitQuizAttempt(attemptData) {
console.log('Submitting quiz attempt');
return this.post('/quiz-attempts', attemptData);
}

/**
 * Get quiz attempt by ID
 * @param {number} attemptId - Attempt ID
 * @returns {Promise} - Attempt data
 */
async getQuizAttempt(attemptId) {
console.log(`Fetching quiz attempt: ${attemptId}`);
return this.get(`/quiz-attempts/${attemptId}`);
}

/**
 * Get user's quiz attempts
 * @param {number} limit - Number of attempts to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise} - User's quiz attempts
 */
async getUserQuizAttempts(limit = 10, offset = 0) {
console.log(`Fetching user quiz attempts (limit: ${limit}, offset: ${offset})`);
return this.get(`/users/quiz-attempts?limit=${limit}&offset=${offset}`);
}

// User Quizzes API

/**
 * Get quizzes created by the user
 * @param {number} page - Page number
 * @param {number} pageSize - Number of quizzes per page
 * @returns {Promise} - User's created quizzes
 */
async getUserCreatedQuizzes(page = 1, pageSize = 9) {
console.log(`Fetching quizzes created by user (page: ${page})`);
const offset = (page - 1) * pageSize;
return this.get(`/users/quizzes?limit=${pageSize}&offset=${offset}`);
}

/**
 * Get quizzes attempted by the user
 * @param {number} page - Page number
 * @param {number} pageSize - Number of quizzes per page
 * @returns {Promise} - User's attempted quizzes
 */
async getUserAttemptedQuizzes(page = 1, pageSize = 9) {
console.log(`Fetching quizzes attempted by user (page: ${page})`);
const offset = (page - 1) * pageSize;
return this.get(`/users/attempted-quizzes?limit=${pageSize}&offset=${offset}`);
}

/**
 * Get quizzes saved by the user
 * @param {number} page - Page number
 * @param {number} pageSize - Number of quizzes per page
 * @returns {Promise} - User's saved quizzes
 */
async getUserSavedQuizzes(page = 1, pageSize = 9) {
console.log(`Fetching quizzes saved by user (page: ${page})`);
const offset = (page - 1) * pageSize;
return this.get(`/users/saved-quizzes?limit=${pageSize}&offset=${offset}`);
}

// Statistics API

/**
 * Get user statistics
 * @returns {Promise} - User statistics data
 */
async getUserStatistics() {
console.log('Fetching user statistics');
return this.get('/stats/user');
}

/**
 * Get quiz statistics
 * @param {number} quizId - Quiz ID
 * @returns {Promise} - Quiz statistics data
 */
async getQuizStatistics(quizId) {
console.log(`Fetching statistics for quiz: ${quizId}`);
return this.get(`/stats/quiz/${quizId}`);
}


// Quiz Bundle Methods
/**
 * Get featured bundles
 * @param {number} limit - Number of bundles to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise} - Bundles data
 */
async getBundles(limit = 6, offset = 0) {
console.log(`Fetching bundles (limit: ${limit}, offset: ${offset})`);
return this.get(`/bundles?limit=${limit}&offset=${offset}`);
}

/**
 * Get bundle by ID
 * @param {number} bundleId - Bundle ID
 * @returns {Promise} - Bundle data
 */
async getBundle(bundleId) {
console.log(`Fetching bundle: ${bundleId}`);
return this.get(`/bundles/${bundleId}`);
}

/**
 * Create a new bundle
 * @param {Object} bundleData - Bundle data
 * @returns {Promise} - Created bundle data
 */
async createBundle(bundleData) {
console.log('Creating new bundle');
return this.post('/bundles', bundleData);
}

/**
 * Update a bundle
 * @param {number} bundleId - Bundle ID
 * @param {Object} bundleData - Bundle update data
 * @returns {Promise} - Updated bundle data
 */
async updateBundle(bundleId, bundleData) {
console.log(`Updating bundle: ${bundleId}`);
return this.put(`/bundles/${bundleId}`, bundleData);
}

/**
 * Delete a bundle
 * @param {number} bundleId - Bundle ID
 * @returns {Promise} - Success message
 */
async deleteBundle(bundleId) {
console.log(`Deleting bundle: ${bundleId}`);
return this.delete(`/bundles/${bundleId}`);
}

// Comments Methods
/**
 * Get comments for a quiz
 * @param {number} quizId - Quiz ID
 * @returns {Promise} - Comments data
 */
async getQuizComments(quizId) {
console.log(`Fetching comments for quiz: ${quizId}`);
return this.get(`/comments/quiz/${quizId}/comments`);
}

/**
 * Add a comment to a quiz
 * @param {number} quizId - Quiz ID
 * @param {Object} commentData - Comment data (comment_text, parent_comment_id)
 * @returns {Promise} - Created comment data
 */
async addQuizComment(quizId, commentData) {
console.log(`Adding comment to quiz: ${quizId}`);
return this.post(`/comments/quiz/${quizId}/comments`, commentData);
}

/**
 * Get comments for a bundle
 * @param {number} bundleId - Bundle ID
 * @returns {Promise} - Comments data
 */
async getBundleComments(bundleId) {
console.log(`Fetching comments for bundle: ${bundleId}`);
return this.get(`/comments/bundle/${bundleId}/comments`);
}

/**
 * Add a comment to a bundle
 * @param {number} bundleId - Bundle ID
 * @param {Object} commentData - Comment data (comment_text, parent_comment_id)
 * @returns {Promise} - Created comment data
 */
async addBundleComment(bundleId, commentData) {
console.log(`Adding comment to bundle: ${bundleId}`);
return this.post(`/comments/bundle/${bundleId}/comments`, commentData);
}

/**
 * Get replies for a comment
 * @param {number} commentId - Comment ID
 * @param {string} type - 'quiz' or 'bundle'
 * @returns {Promise} - Replies data
 */
async getCommentReplies(commentId, type = 'quiz') {
console.log(`Fetching replies for ${type} comment: ${commentId}`);
return this.get(`/comments/${type}/comments/${commentId}/replies`);
}

/**
 * Delete a comment
 * @param {number} commentId - Comment ID
 * @param {string} type - 'quiz' or 'bundle'
 * @returns {Promise} - Success message
 */
async deleteComment(commentId, type = 'quiz') {
console.log(`Deleting ${type} comment: ${commentId}`);
return this.delete(`/comments/${type}/comments/${commentId}`);
}

// Learning Materials Methods
/**
 * Get learning materials for a quiz
 * @param {number} quizId - Quiz ID
 * @returns {Promise} - Learning materials data
 */
async getQuizMaterials(quizId) {
console.log(`Fetching learning materials for quiz: ${quizId}`);
return this.get(`/comments/quiz/${quizId}/learning-materials`);
}

/**
 * Add learning material to a quiz
 * @param {number} quizId - Quiz ID
 * @param {Object} materialData - Material data
 * @returns {Promise} - Created material data
 */
async addQuizMaterial(quizId, materialData) {
console.log(`Adding learning material to quiz: ${quizId}`);
return this.post(`/comments/quiz/${quizId}/learning-materials`, materialData);
}

/**
 * Get learning materials for a bundle
 * @param {number} bundleId - Bundle ID
 * @returns {Promise} - Learning materials data
 */
async getBundleMaterials(bundleId) {
console.log(`Fetching learning materials for bundle: ${bundleId}`);
return this.get(`/comments/bundle/${bundleId}/learning-materials`);
}

/**
 * Add learning material to a bundle
 * @param {number} bundleId - Bundle ID
 * @param {Object} materialData - Material data
 * @returns {Promise} - Created material data
 */
async addBundleMaterial(bundleId, materialData) {
console.log(`Adding learning material to bundle: ${bundleId}`);
return this.post(`/comments/bundle/${bundleId}/learning-materials`, materialData);
}

/**
 * Upload file material to a quiz or bundle
 * @param {number} id - Quiz or Bundle ID
 * @param {FormData} formData - Form data with file
 * @param {string} type - 'quiz' or 'bundle'
 * @returns {Promise} - Created material data
 */
async uploadMaterial(id, formData, type = 'quiz') {
console.log(`Uploading material to ${type}: ${id}`);
return this.uploadFile(`/comments/${type}/${id}/learning-materials`, formData);
}

/**
 * Delete learning material
 * @param {number} materialId - Material ID
 * @returns {Promise} - Success message
 */
async deleteLearningMaterial(materialId) {
console.log(`Deleting learning material: ${materialId}`);
return this.delete(`/comments/learning-materials/${materialId}`);
}
// Questions Methods
/**
 * Create a new question
 * @param {Object} questionData - Question data
 * @returns {Promise} - Created question data
 */
async createQuestion(questionData) {
    console.log('Creating new question');
    return this.post('/questions', questionData);
}

/**
 * Update a question
 * @param {number} questionId - Question ID
 * @param {Object} questionData - Question update data
 * @returns {Promise} - Updated question data
 */
async updateQuestion(questionId, questionData) {
    console.log(`Updating question: ${questionId}`);
    return this.put(`/questions/${questionId}`, questionData);
}

/**
 * Delete a question
 * @param {number} questionId - Question ID
 * @returns {Promise} - Success message
 */
async deleteQuestion(questionId) {
    console.log(`Deleting question: ${questionId}`);
    return this.delete(`/questions/${questionId}`);
}

}

// Create global API instance
window.api = new ApiService();
console.log('API Service initialized and attached to window.api');