/**
 * Image Accessibility Fixer
 * Automatically adds descriptive alt attributes to images that are missing them
 */

(function() {
    'use strict';

    // Only run after DOM is fully loaded
    if (document.readyState !== 'loading') {
        fixImageAltTexts();
    } else {
        document.addEventListener('DOMContentLoaded', fixImageAltTexts);
    }

    function fixImageAltTexts() {
        const images = document.querySelectorAll('img');
        
        images.forEach((img) => {
            // Skip if alt attribute already exists and is not empty
            if (img.hasAttribute('alt') && img.getAttribute('alt').trim() !== '') {
                return;
            }

            // Generate descriptive alt text based on context
            const altText = generateAltText(img);
            if (altText) {
                img.setAttribute('alt', altText);
            }
        });
    }

    function generateAltText(img) {
        const src = img.getAttribute('src') || '';
        const filename = src.split('/').pop().split('.')[0];
        
        // Get nearest heading or parent context
        let parent = img.parentElement;
        let contextText = '';
        
        while (parent && !contextText) {
            const heading = parent.querySelector('h1, h2, h3, h4, h5, h6');
            if (heading) {
                contextText = heading.textContent.trim();
                break;
            }
            parent = parent.parentElement;
        }

        // Generate descriptive alt text
        if (contextText) {
            return `Image for: ${contextText}`;
        }

        // Use filename with spaces
        if (filename && filename !== '') {
            const readableFilename = filename
                .replace(/[-_]/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
            return readableFilename;
        }

        return 'Content image';
    }
})();
