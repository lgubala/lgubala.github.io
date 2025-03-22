/**
 * Mobile Navigation Script
 * Handles the mobile menu toggle functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get references to mobile menu elements
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');
    
    // Check if elements exist
    if (mobileMenuButton && mobileMenu) {
        console.log('Mobile menu elements found, setting up event listeners');
        
        // Set initial state
        let isMenuOpen = false;
        
        // Toggle menu function
        function toggleMobileMenu() {
            isMenuOpen = !isMenuOpen;
            
            // Toggle menu visibility
            if (isMenuOpen) {
                mobileMenu.classList.remove('hidden');
                if (hamburgerIcon && closeIcon) {
                    hamburgerIcon.classList.add('hidden');
                    closeIcon.classList.remove('hidden');
                }
            } else {
                mobileMenu.classList.add('hidden');
                if (hamburgerIcon && closeIcon) {
                    hamburgerIcon.classList.remove('hidden');
                    closeIcon.classList.add('hidden');
                }
            }
            
            // Update ARIA attributes
            mobileMenuButton.setAttribute('aria-expanded', isMenuOpen.toString());
        }
        
        // Add click event listener to mobile menu button
        mobileMenuButton.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMobileMenu();
        });
        
        // Update active link in mobile menu
        const currentPath = window.location.pathname;
        const mobileNavLinks = mobileMenu.querySelectorAll('a');
        
        mobileNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Skip items without href
            if (!href) return;
            
            // Remove all active classes first
            link.classList.remove(
                'bg-indigo-50',
                'border-indigo-500',
                'text-indigo-700',
                'border-transparent',
                'text-gray-500'
            );
            
            // Check if this item matches current path
            const isActive = currentPath.endsWith(href) || 
                            (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('/')));
            
            if (isActive) {
                console.log(`Active mobile nav item found: ${href}`);
                link.classList.add('bg-indigo-50', 'border-indigo-500', 'text-indigo-700');
            } else {
                link.classList.add(
                    'border-transparent', 
                    'text-gray-500'
                );
            }
        });
        
        // Close menu when clicking a link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (isMenuOpen) {
                    toggleMobileMenu();
                }
            });
        });
        
        // Close menu when window is resized to desktop size
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 640 && isMenuOpen) { // 640px is Tailwind's 'sm' breakpoint
                toggleMobileMenu();
            }
        });
    } else {
        console.warn('Mobile menu elements not found. Check your HTML structure.');
    }
});