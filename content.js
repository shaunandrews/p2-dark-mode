/**
 * P2 Dark Mode — Content Script
 * 
 * Detects if the current page is a P2 site and enables dark mode styles.
 * The CSS is injected via manifest, but this script handles P2 detection
 * and can add a body class for more targeted styling.
 */

(function() {
  'use strict';

  // IMMEDIATELY inject critical CSS to prevent white flash
  // This runs before DOM is ready (document_start)
  // Check both media query AND if we're on a wordpress.com domain (likely P2)
  var isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var isWordPressDomain = window.location.hostname.endsWith('wordpress.com');
  
  // If on wordpress.com, inject critical dark CSS immediately
  // (We'll remove it later if it's not actually a P2 site or not in dark mode)
  if (isWordPressDomain) {
    var style = document.createElement('style');
    style.id = 'p2-dark-mode-critical';
    style.textContent = 'html, body { background-color: #1a1a1a !important; color: #c9c9c9 !important; } * { background-color: inherit; }';
    (document.head || document.documentElement).appendChild(style);
  }

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
   * Check if system prefers dark mode
   */
  function prefersDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Apply or remove dark mode class
   */
  function applyDarkMode(enable) {
    // Remove critical CSS now that full styles are loading
    var criticalStyle = document.getElementById('p2-dark-mode-critical');
    
    if (enable) {
      document.documentElement.classList.add('p2-dark-mode-enabled');
      document.body.classList.add('p2-dark-mode-enabled');
      console.log('P2 Dark Mode: Dark mode enabled');
    } else {
      document.documentElement.classList.remove('p2-dark-mode-enabled');
      document.body.classList.remove('p2-dark-mode-enabled');
      // Remove critical CSS if dark mode not enabled
      if (criticalStyle) {
        criticalStyle.remove();
      }
      console.log('P2 Dark Mode: Dark mode disabled (system in light mode)');
    }
  }

  /**
   * Initialize P2 Dark Mode.
   * Adds a class to the body so CSS can target P2 pages specifically.
   * Only applies when system is in dark mode.
   */
  function init() {
    if (!isP2Site()) {
      console.log('P2 Dark Mode: Not a P2 site, skipping');
      // Remove critical CSS since this isn't a P2 site
      var criticalStyle = document.getElementById('p2-dark-mode-critical');
      if (criticalStyle) {
        criticalStyle.remove();
      }
      return;
    }

    console.log('P2 Dark Mode: P2 detected');
    
    // For P2 sites, always enable dark mode (user installed extension for this)
    // Don't rely on media query since it may not work in all browsers
    applyDarkMode(true);

    // Listen for system dark mode changes (for future if user switches)
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        applyDarkMode(e.matches);
      });
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
      applyDarkMode(prefersDarkMode());
    }
    
    // Force fix any stubborn white backgrounds
    if (document.body.classList.contains('p2-dark-mode-enabled')) {
      forceFixBackgrounds();
    }
  }, 1000);

  /**
   * Nuclear option: force EVERYTHING to dark bg
   */
  function forceFixBackgrounds() {
    const darkBg = '#1a1a1a';
    
    // Find ALL elements with white-ish backgrounds and fix them
    document.querySelectorAll('*').forEach(function(el) {
      const bg = getComputedStyle(el).backgroundColor;
      // Match white, near-white, and light grays
      if (bg === 'rgb(255, 255, 255)' || 
          bg === 'white' || 
          bg === 'rgb(243, 243, 243)' ||
          bg === 'rgb(240, 240, 240)' ||
          bg === 'rgb(248, 248, 248)' ||
          bg === 'rgb(250, 250, 250)') {
        el.style.setProperty('background-color', darkBg, 'important');
      }
    });
    
    // Specifically target GitHub embeds with inline styles
    document.querySelectorAll('[class*="wp-block-p2-embed-github"]').forEach(function(el) {
      el.style.setProperty('background-color', darkBg, 'important');
      el.style.setProperty('background', darkBg, 'important');
    });
    
    // Target has-background class
    document.querySelectorAll('.has-background').forEach(function(el) {
      el.style.setProperty('background-color', darkBg, 'important');
    });
    
    // Target editor components
    document.querySelectorAll('[class*="editor-"], [class*="interface-"], [class*="block-editor-"]').forEach(function(el) {
      const bg = getComputedStyle(el).backgroundColor;
      if (bg === 'rgb(255, 255, 255)' || bg === 'white') {
        el.style.setProperty('background-color', darkBg, 'important');
      }
    });
    
    console.log('P2 Dark Mode: Force-fixed all backgrounds');
  }
})();
