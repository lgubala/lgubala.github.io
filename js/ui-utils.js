/**
 * UI Utilities
 * Common UI helper functions for the QuizGen app
 */
const UIUtils = {
    /**
     * Show an element by removing the 'hidden' class
     * @param {HTMLElement} element - Element to show
     */
    showElement: function(element) {
        if (element) {
            element.classList.remove('hidden');
        }
    },
    
    /**
     * Hide an element by adding the 'hidden' class
     * @param {HTMLElement} element - Element to hide
     */
    hideElement: function(element) {
        if (element) {
            element.classList.add('hidden');
        }
    },
    
    /**
     * Toggle element visibility
     * @param {HTMLElement} element - Element to toggle
     * @returns {boolean} New visibility state (true = visible)
     */
    toggleElement: function(element) {
        if (!element) return false;
        
        const isCurrentlyHidden = element.classList.contains('hidden');
        
        if (isCurrentlyHidden) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
        
        return isCurrentlyHidden; // Now it's visible if it was hidden
    },
    
    /**
     * Show a modal dialog
     * @param {HTMLElement} modal - Modal element to show
     */
    showModal: function(modal) {
        if (modal) {
            modal.classList.remove('hidden');
            console.log(`Modal shown: ${modal.id || 'unknown'}`);
        }
    },
    
    /**
     * Hide a modal dialog
     * @param {HTMLElement} modal - Modal element to hide
     */
    hideModal: function(modal) {
        if (modal) {
            modal.classList.add('hidden');
            console.log(`Modal hidden: ${modal.id || 'unknown'}`);
        }
    },
    
    /**
     * Format time as MM:SS
     * @param {number} seconds - Time in seconds
     * @returns {string} Formatted time string
     */
    formatTime: function(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
    
    /**
     * Format date as a readable string
     * @param {string} dateString - Date string to format
     * @param {boolean} includeTime - Whether to include time
     * @returns {string} Formatted date string
     */
    formatDate: function(dateString, includeTime = false) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        
        if (isNaN(date.getTime())) {
            return dateString; // Return the original if not a valid date
        }
        
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        };
        
        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }
        
        return date.toLocaleDateString(undefined, options);
    },
    
    /**
     * Create star rating HTML
     * @param {number} rating - Rating value (0-5)
     * @param {boolean} interactive - Whether the stars should be interactive
     * @param {Function} onRatingChange - Callback when rating changes (for interactive mode)
     * @returns {HTMLElement} Star rating element
     */
    createStarRating: function(rating, interactive = false, onRatingChange = null) {
        const container = document.createElement('div');
        container.className = 'flex text-yellow-400 items-center';
        
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        // Create stars
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            if (interactive) {
                star.className = 'cursor-pointer hover:scale-110 transition-transform';
                star.dataset.value = i;
                star.addEventListener('click', () => {
                    if (typeof onRatingChange === 'function') {
                        onRatingChange(i);
                    }
                    this.updateStarRating(container, i);
                });
                
                star.addEventListener('mouseover', () => {
                    this.updateStarRating(container, i, true);
                });
                
                star.addEventListener('mouseout', () => {
                    this.updateStarRating(container, rating);
                });
            }
            
            const icon = document.createElement('i');
            if (i <= fullStars) {
                icon.className = 'fas fa-star';
            } else if (i === fullStars + 1 && hasHalfStar) {
                icon.className = 'fas fa-star-half-alt';
            } else {
                icon.className = 'far fa-star';
            }
            
            star.appendChild(icon);
            container.appendChild(star);
        }
        
        if (interactive) {
            // Add a reset icon
            const resetStar = document.createElement('span');
            resetStar.className = 'cursor-pointer ml-2 text-gray-400 hover:text-gray-600';
            resetStar.innerHTML = '<i class="fas fa-times"></i>';
            resetStar.addEventListener('click', () => {
                if (typeof onRatingChange === 'function') {
                    onRatingChange(0);
                }
                this.updateStarRating(container, 0);
            });
            container.appendChild(resetStar);
        }
        
        return container;
    },

    /**
     * Update star rating display
     * @param {HTMLElement} container - Star container
     * @param {number} rating - New rating
     * @param {boolean} hover - Whether this is a hover state
     */
    updateStarRating: function(container, rating, hover = false) {
        const stars = container.querySelectorAll('span:not(:last-child)');
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        stars.forEach((star, index) => {
            const i = index + 1;
            const icon = star.querySelector('i');
            
            if (i <= fullStars) {
                icon.className = 'fas fa-star';
            } else if (i === fullStars + 1 && hasHalfStar) {
                icon.className = 'fas fa-star-half-alt';
            } else {
                icon.className = 'far fa-star';
            }
            
            if (hover) {
                if (i <= rating) {
                    star.classList.add('text-yellow-500');
                } else {
                    star.classList.remove('text-yellow-500');
                }
            } else {
                star.classList.remove('text-yellow-500');
            }
        });
    },

    /**
     * Format file size in human-readable format
     * @param {number} bytes - File size in bytes
     * @returns {string} - Formatted file size
     */
    formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} - Whether copy was successful
     */
    copyToClipboard: async function(text) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback method
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.left = '-999999px';
                textarea.style.top = '-999999px';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                const success = document.execCommand('copy');
                textarea.remove();
                return success;
            }
        } catch (error) {
            console.error('Failed to copy text:', error);
            return false;
        }
    },

    /**
     * Check if an element is in the viewport
     * @param {HTMLElement} element - Element to check
     * @param {number} offset - Offset from viewport edge
     * @returns {boolean} - Whether the element is in the viewport
     */
    isInViewport: function(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        
        return (
            rect.top >= 0 - offset &&
            rect.left >= 0 - offset &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
        );
    },

    /**
     * Create a loading spinner element
     * @param {string} size - Size class (sm, md, lg)
     * @param {string} color - Color class
     * @returns {HTMLElement} - Spinner element
     */
    createSpinner: function(size = 'md', color = 'indigo') {
        const sizes = {
            sm: 'h-4 w-4',
            md: 'h-8 w-8',
            lg: 'h-12 w-12'
        };
        
        const spinner = document.createElement('div');
        spinner.className = `animate-spin ${sizes[size] || sizes.md} text-${color}-600`;
        spinner.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        `;
        
        return spinner;
    },
    
    /**
     * Show a toast notification
     * @param {string} message - Message to show
     * @param {string} type - Notification type ('success', 'error', 'info', 'warning')
     * @param {number} duration - Duration in milliseconds
     */
    showToast: function(message, type = 'info', duration = 3000) {
        // Check if a toast container exists, or create one
        let toastContainer = document.getElementById('toast-container');
        
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'fixed bottom-4 right-4 z-50 flex flex-col space-y-2';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'p-3 rounded-lg shadow-lg transform transition-all duration-300 max-w-xs';
        
        // Add color based on type
        switch (type) {
            case 'success':
                toast.classList.add('bg-green-600', 'text-white');
                break;
            case 'error':
                toast.classList.add('bg-red-600', 'text-white');
                break;
            case 'warning':
                toast.classList.add('bg-yellow-600', 'text-white');
                break;
            case 'info':
            default:
                toast.classList.add('bg-indigo-600', 'text-white');
                break;
        }
        
        // Add content
        toast.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : 
                        type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' : 
                        type === 'warning' ? '<i class="fas fa-exclamation-triangle"></i>' :
                        '<i class="fas fa-info-circle"></i>'}
                    </div>
                    <div class="ml-2">
                        <p class="text-sm font-medium">${message}</p>
                    </div>
                </div>
                <button class="ml-4 text-white opacity-70 hover:opacity-100 focus:outline-none">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add to container
        toastContainer.appendChild(toast);
        
        // Add close button functionality
        const closeBtn = toast.querySelector('button');
        closeBtn.addEventListener('click', () => {
            toast.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => {
                toast.remove();
            }, 300);
        });
        
        // Auto-hide after duration
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.add('opacity-0', 'translate-y-2');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            }
        }, duration);
    },
    /**
     * Show a confirmation dialog
     * @param {string} message - Message to show
     * @param {Function} onConfirm - Function to call when confirmed
     * @param {Function} onCancel - Function to call when cancelled
     * @param {Object} options - Additional options
     */
    showConfirm: function(message, onConfirm, onCancel = null, options = {}) {
        const title = options.title || 'Confirm';
        const confirmText = options.confirmText || 'Confirm';
        const cancelText = options.cancelText || 'Cancel';
        const confirmClass = options.dangerous ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700';
        
        const modalHtml = `
            <div class="fixed z-50 inset-0 overflow-y-auto" id="confirm-dialog">
                <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                    <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                    <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div class="sm:flex sm:items-start">
                                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${options.dangerous ? 'bg-red-100' : 'bg-indigo-100'} sm:mx-0 sm:h-10 sm:w-10">
                                    <i class="${options.dangerous ? 'fas fa-exclamation-triangle text-red-600' : 'fas fa-question text-indigo-600'}"></i>
                                </div>
                                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 class="text-lg leading-6 font-medium text-gray-900">${title}</h3>
                                    <div class="mt-2">
                                        <p class="text-sm text-gray-500">${message}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="button" id="confirm-btn" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${confirmClass} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm">
                                ${confirmText}
                            </button>
                            <button type="button" id="cancel-btn" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                ${cancelText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to the document
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
        
        // Get references to buttons
        const confirmBtn = document.getElementById('confirm-btn');
        const cancelBtn = document.getElementById('cancel-btn');
        
        // Handle confirm button click
        confirmBtn.addEventListener('click', () => {
            modalContainer.remove();
            if (typeof onConfirm === 'function') {
                onConfirm();
            }
        });
        
        // Handle cancel button click
        cancelBtn.addEventListener('click', () => {
            modalContainer.remove();
            if (typeof onCancel === 'function') {
                onCancel();
            }
        });
        
        // Focus the cancel button by default for safety
        setTimeout(() => {
            cancelBtn.focus();
        }, 0);
    },

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} Whether the email is valid
     */
    isValidEmail: function(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    
    /**
     * Truncate text to a certain length with ellipsis
     * @param {string} text - Text to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string} Truncated text
     */
    truncateText: function(text, maxLength = 100) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }
};

// Make UI Utils available globally
window.UIUtils = UIUtils;