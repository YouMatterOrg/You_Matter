/**
 * Accessibility Enhancements
 * - Manages active navigation states
 * - Handles dropdown aria-expanded attributes
 * - Ensures keyboard navigation works properly
 */

(function() {
    'use strict';

    // Initialize accessibility features when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAccessibility);
    } else {
        initAccessibility();
    }

    function initAccessibility() {
        // Set active navigation state based on current page
        setActiveNavigation();
        
        // Set up dropdown accessibility
        setupDropdownAccessibility();
        
        // Ensure form elements are accessible
        enhanceFormAccessibility();
        
        // Handle keyboard navigation
        setupKeyboardNavigation();
    }

    /**
     * Set the active navigation item based on current page URL
     */
    function setActiveNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('nav a[href], .nav-links a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Check if link matches current page
            if (href && isCurrentPage(href, currentPath)) {
                link.setAttribute('aria-current', 'page');
                link.classList.add('active');
                
                // Also mark parent menu item as active
                const parent = link.closest('li');
                if (parent) {
                    parent.classList.add('active');
                }
            } else {
                link.removeAttribute('aria-current');
                link.classList.remove('active');
            }
        });
    }

    /**
     * Check if a link href matches the current page path
     */
    function isCurrentPage(href, currentPath) {
        if (href === '/' && (currentPath === '/' || currentPath === '')) {
            return true;
        }
        
        const normalizedHref = href.replace(/^\.\/|\/index\.html$|\.html$/g, '');
        const normalizedPath = currentPath.replace(/^\/|index\.html$|\.html$/g, '');
        
        return normalizedHref === normalizedPath || 
               href === window.location.pathname ||
               href === window.location.pathname + 'index.html';
    }

    /**
     * Set up dropdown accessibility with aria-expanded attribute
     */
    function setupDropdownAccessibility() {
        const dropdownTriggers = document.querySelectorAll('.has-dropdown > a, .has-dropdown > button');
        
        dropdownTriggers.forEach(trigger => {
            const parent = trigger.closest('.has-dropdown');
            const dropdown = parent ? parent.querySelector('.dropdown') : null;
            
            if (dropdown) {
                // Ensure trigger has aria-expanded attribute
                if (!trigger.hasAttribute('aria-expanded')) {
                    trigger.setAttribute('aria-expanded', 'false');
                    trigger.setAttribute('aria-haspopup', 'true');
                }
                
                // Add click handler for dropdown toggle
                trigger.addEventListener('click', function(e) {
                    e.preventDefault();
                    const isOpen = parent.classList.contains('open');
                    toggleDropdown(parent, !isOpen);
                });
                
                // Handle keyboard navigation for dropdown
                trigger.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const isOpen = parent.classList.contains('open');
                        toggleDropdown(parent, !isOpen);
                    }
                    
                    // Arrow keys for navigation
                    if (e.key === 'ArrowDown' && parent.classList.contains('open')) {
                        e.preventDefault();
                        const firstItem = dropdown.querySelector('a');
                        if (firstItem) firstItem.focus();
                    }
                });
            }
        });
        
        // Handle escape key to close dropdowns
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                document.querySelectorAll('.has-dropdown.open').forEach(item => {
                    toggleDropdown(item, false);
                });
            }
        });
    }

    /**
     * Toggle dropdown visibility and update aria-expanded
     */
    function toggleDropdown(parent, isOpen) {
        const trigger = parent.querySelector('a, button');
        if (isOpen) {
            parent.classList.add('open');
            if (trigger) trigger.setAttribute('aria-expanded', 'true');
        } else {
            parent.classList.remove('open');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }
    }

    /**
     * Enhance form accessibility
     */
    function enhanceFormAccessibility() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Ensure all form fields have associated labels
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (!input.getAttribute('id')) {
                    input.setAttribute('id', 'field_' + Math.random().toString(36).substr(2, 9));
                }
                
                // Add aria-required for required fields
                if (input.hasAttribute('required')) {
                    input.setAttribute('aria-required', 'true');
                }
                
                // Add focus styling for keyboard users
                input.addEventListener('focus', function() {
                    this.classList.add('focused');
                });
                
                input.addEventListener('blur', function() {
                    this.classList.remove('focused');
                });
            });
        });
    }

    /**
     * Set up keyboard navigation for custom components
     */
    function setupKeyboardNavigation() {
        // Ensure all buttons and clickable elements are keyboard accessible
        const clickableElements = document.querySelectorAll('[role="button"], .button, .btn, [onclick]');
        
        clickableElements.forEach(element => {
            // Skip actual button elements
            if (element.tagName === 'BUTTON' || element.tagName === 'A') {
                return;
            }
            
            // Ensure they can be focused
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
            
            // Handle Enter and Space key presses
            element.addEventListener('keydown', function(e) {
                if ((e.key === 'Enter' || e.key === ' ') && element.hasAttribute('onclick')) {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }

    // Re-run active nav when page is displayed (for browser back button)
    window.addEventListener('pageshow', setActiveNavigation);

})();
