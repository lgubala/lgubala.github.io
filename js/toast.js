/**
 * Toast Notification System
 * Provides non-intrusive toast notifications that automatically disappear
 */
class ToastNotification {
    constructor() {
        this.initializeToastContainer();
        
        // Default settings
        this.settings = {
            duration: 3000,      // Duration in ms
            position: 'top-right',
            maxToasts: 3
        };
        
        // Store active toasts
        this.activeToasts = [];
    }
    
    /**
     * Initialize toast container if it doesn't exist
     */
    initializeToastContainer() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed z-50 p-4 max-w-md';
            container.setAttribute('aria-live', 'polite');
            
            // Position the container
            container.classList.add('top-4', 'right-4');
            
            document.body.appendChild(container);
            
            // Add styles if not already added
            if (!document.getElementById('toast-styles')) {
                const styles = document.createElement('style');
                styles.id = 'toast-styles';
                styles.textContent = `
                    #toast-container {
                        pointer-events: none;
                    }
                    .toast {
                        pointer-events: auto;
                        transform: translateY(-20px);
                        opacity: 0;
                        transition: transform 0.3s ease, opacity 0.3s ease;
                    }
                    .toast.show {
                        transform: translateY(0);
                        opacity: 1;
                    }
                    .toast.hide {
                        transform: translateY(-20px);
                        opacity: 0;
                    }
                    @media (prefers-reduced-motion: reduce) {
                        .toast {
                            transition: none;
                        }
                    }
                `;
                document.head.appendChild(styles);
            }
        }
    }
    
    /**
     * Add classes to element, handling space separated classes properly
     * @param {Element} element - The DOM element
     * @param {string} classNames - Space separated class names
     */
    addClasses(element, classNames) {
        if (!element || !classNames) return;
        const classes = classNames.split(' ');
        classes.forEach(cls => {
            if (cls.trim()) {
                element.classList.add(cls.trim());
            }
        });
    }
    
    /**
     * Show a toast notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type ('success', 'error', 'info', 'warning')
     * @param {Object} options - Custom options
     */
    show(message, type = 'info', options = {}) {
        // Merge options with defaults
        const settings = { ...this.settings, ...options };
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast max-w-md w-full rounded-md shadow-lg mb-3 overflow-hidden flex items-start p-4 border-l-4';
        
        // Add type-specific styles
        let icon, bgColor, borderColor, textColor;
        
        switch (type) {
            case 'success':
                icon = '<i class="fas fa-check-circle mr-3 text-green-500 text-xl mt-0.5"></i>';
                bgColor = 'bg-green-50 dark:bg-green-900 dark:bg-opacity-20';
                borderColor = 'border-green-500';
                textColor = 'text-green-800 dark:text-green-200';
                break;
            case 'error':
                icon = '<i class="fas fa-times-circle mr-3 text-red-500 text-xl mt-0.5"></i>';
                bgColor = 'bg-red-50 dark:bg-red-900 dark:bg-opacity-20';
                borderColor = 'border-red-500';
                textColor = 'text-red-800 dark:text-red-200';
                break;
            case 'warning':
                icon = '<i class="fas fa-exclamation-triangle mr-3 text-yellow-500 text-xl mt-0.5"></i>';
                bgColor = 'bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20';
                borderColor = 'border-yellow-500';
                textColor = 'text-yellow-800 dark:text-yellow-200';
                break;
            case 'info':
            default:
                icon = '<i class="fas fa-info-circle mr-3 text-indigo-500 text-xl mt-0.5"></i>';
                bgColor = 'bg-indigo-50 dark:bg-indigo-900 dark:bg-opacity-20';
                borderColor = 'border-indigo-500';
                textColor = 'text-indigo-800 dark:text-indigo-200';
                break;
        }
        
        // Add classes correctly - handles space-separated class names
        this.addClasses(toast, bgColor);
        this.addClasses(toast, borderColor);
        
        // Set toast content
        toast.innerHTML = `
            <div class="flex items-start">
                ${icon}
                <div class="flex-1">
                    <p class="${textColor} text-sm font-medium">${message}</p>
                </div>
                <button type="button" class="ml-4 text-gray-400 hover:text-gray-500 focus:outline-none" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Handle close button click
        const closeBtn = toast.querySelector('button');
        closeBtn.addEventListener('click', () => {
            this.removeToast(toast);
        });
        
        // Add to container
        const container = document.getElementById('toast-container');
        container.appendChild(toast);
        
        // Add to active toasts
        this.activeToasts.push(toast);
        
        // Remove excess toasts
        while (this.activeToasts.length > settings.maxToasts) {
            this.removeToast(this.activeToasts[0]);
        }
        
        // Show toast with animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Set auto-dismiss timer
        if (settings.duration > 0) {
            setTimeout(() => {
                if (toast.parentNode) {
                    this.removeToast(toast);
                }
            }, settings.duration);
        }
        
        return toast;
    }
    
    /**
     * Remove a toast with animation
     * @param {HTMLElement} toast - Toast element
     */
    removeToast(toast) {
        // Add hide class for animation
        toast.classList.remove('show');
        toast.classList.add('hide');
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
                
                // Remove from active toasts
                const index = this.activeToasts.indexOf(toast);
                if (index > -1) {
                    this.activeToasts.splice(index, 1);
                }
            }
        }, 300);
    }
    
    /**
     * Show a success toast
     * @param {string} message - Notification message
     * @param {Object} options - Custom options
     */
    success(message, options = {}) {
        return this.show(message, 'success', options);
    }
    
    /**
     * Show an error toast
     * @param {string} message - Notification message
     * @param {Object} options - Custom options
     */
    error(message, options = {}) {
        return this.show(message, 'error', options);
    }
    
    /**
     * Show a warning toast
     * @param {string} message - Notification message
     * @param {Object} options - Custom options
     */
    warning(message, options = {}) {
        return this.show(message, 'warning', options);
    }
    
    /**
     * Show an info toast
     * @param {string} message - Notification message
     * @param {Object} options - Custom options
     */
    info(message, options = {}) {
        return this.show(message, 'info', options);
    }
}

// Create global toast instance
window.toast = new ToastNotification();
console.log('Toast Notification System initialized and attached to window.toast');