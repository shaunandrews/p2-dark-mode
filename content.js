/**
 * P2 Dark Mode — Content Script
 * 
 * Detects if the current page is a P2 site and enables dark mode styles.
 * The CSS is injected via manifest, but this script handles P2 detection
 * and can add a body class for more targeted styling.
 */

(function() {
  'use strict';

  /**
   * Check if the current page is a P2 site by looking for P2-specific markers.
   * 
   * P2 themes have distinctive elements:
   * - body.flavor-flavor-flavor class (P2 flavor theme marker)
   * - .p2-header element
   * - #p2-site-header or similar P2 nav elements
   * - .p2020-* class patterns (P2 2020 theme)
   * 
   * @returns {boolean} True if this appears to be a P2 site
   */
  function isP2Site() {
    // Check body classes for P2 flavor markers
    const body = document.body;
    if (!body) return false;

    const bodyClasses = body.className;
    
    // P2 flavor theme marker
    if (bodyClasses.includes('flavor-flavor-flavor')) {
      return true;
    }

    // P2 2020 theme markers
    if (bodyClasses.includes('flavor-flavor') || bodyClasses.includes('flavor-flavor-flavor')) {
      return true;
    }

    // Check for P2-specific elements
    const p2Markers = [
      '.p2-header',
      '#p2-site-header',
      '.p2020-site-header',
      '.p2-sidebar',
      '[class*="p2020-"]',
      '.o2-app',           // O2 is the P2 engine
      '.o2-posts',
      '#o2-wrapper'
    ];

    for (const selector of p2Markers) {
      if (document.querySelector(selector)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Initialize P2 Dark Mode.
   * Adds a class to the body so CSS can target P2 pages specifically.
   */
  function init() {
    if (isP2Site()) {
      console.log('P2 Dark Mode: P2 detected, applying styles');
      document.documentElement.classList.add('p2-dark-mode-enabled');
      document.body.classList.add('p2-dark-mode-enabled');
    } else {
      console.log('P2 Dark Mode: Not a P2 site, skipping');
    }
  }

  // Run detection when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already loaded (shouldn't happen with run_at: document_start, but be safe)
    init();
  }

  // Also re-check after a short delay for SPAs that load content dynamically
  setTimeout(function() {
    if (!document.body.classList.contains('p2-dark-mode-enabled') && isP2Site()) {
      console.log('P2 Dark Mode: P2 detected on delayed check, applying styles');
      document.documentElement.classList.add('p2-dark-mode-enabled');
      document.body.classList.add('p2-dark-mode-enabled');
    }
  }, 1000);
})();
