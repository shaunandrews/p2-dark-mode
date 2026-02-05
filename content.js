/**
 * P2 Dark Mode — Content Script
 * 
 * Detects if the current page is a P2 site and enables dark mode styles.
 * Uses a scrim overlay to prevent white flash during load.
 */

(function() {
  'use strict';

  // ============================================
  // SUBDOMAIN CHECK — Only run on P2 subdomains, not wordpress.com itself
  // ============================================
  
  const hostname = window.location.hostname;
  
  // Bail if we're on wordpress.com itself (not a subdomain)
  if (hostname === 'wordpress.com' || hostname === 'www.wordpress.com') {
    return;
  }
  
  // Also bail if not a wordpress.com subdomain at all
  if (!hostname.endsWith('.wordpress.com')) {
    return;
  }

  // ============================================
  // SCRIM OVERLAY — Inject immediately at document_start
  // ============================================
  
  const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Create scrim immediately — before anything else renders
  const scrim = document.createElement('div');
  scrim.id = 'p2-dark-mode-scrim';
  scrim.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999999;
    background-color: ${isDark ? '#1a1a1a' : '#ffffff'};
    transition: opacity 150ms ease-out;
    pointer-events: none;
  `;
  
  // Append to documentElement (html) — exists at document_start, body doesn't
  document.documentElement.appendChild(scrim);

  /**
   * Fade out and remove the scrim
   */
  function removeScrim() {
    const scrim = document.getElementById('p2-dark-mode-scrim');
    if (!scrim) return;
    
    scrim.style.opacity = '0';
    
    // Remove from DOM after transition completes
    setTimeout(function() {
      if (scrim.parentNode) {
        scrim.parentNode.removeChild(scrim);
      }
    }, 160); // Slightly longer than transition to ensure completion
  }

  /**
   * Check if the current page is a P2 site
   */
  function isP2Site() {
    const body = document.body;
    if (!body) return false;

    const bodyClasses = body.className;
    
    // P2 flavor theme markers
    if (bodyClasses.includes('flavor-flavor-flavor') || 
        bodyClasses.includes('flavor-flavor')) {
      return true;
    }

    // Check for P2-specific elements
    const p2Markers = [
      '.p2-header',
      '#p2-site-header',
      '.p2020-site-header',
      '.o2-app',
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
    if (enable) {
      document.documentElement.classList.add('p2-dark-mode-enabled');
      document.body.classList.add('p2-dark-mode-enabled');
      console.log('P2 Dark Mode: Enabled');
    } else {
      document.documentElement.classList.remove('p2-dark-mode-enabled');
      document.body.classList.remove('p2-dark-mode-enabled');
      console.log('P2 Dark Mode: Disabled (system in light mode)');
    }
  }

  /**
   * Nuclear option: force EVERYTHING to dark bg
   */
  function forceFixBackgrounds() {
    if (!prefersDarkMode()) return;
    
    const darkBg = '#1a1a1a';
    
    // Find ALL elements with white-ish backgrounds and fix them
    document.querySelectorAll('*').forEach(function(el) {
      const bg = getComputedStyle(el).backgroundColor;
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
    
    console.log('P2 Dark Mode: Force-fixed backgrounds');
  }

  /**
   * Initialize P2 Dark Mode
   */
  function init() {
    // If not a P2 site, remove scrim and bail
    if (!isP2Site()) {
      console.log('P2 Dark Mode: Not a P2 site, skipping');
      removeScrim();
      return;
    }

    console.log('P2 Dark Mode: P2 detected');
    
    // Apply dark mode based on system preference
    applyDarkMode(prefersDarkMode());

    // Listen for system dark mode changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        applyDarkMode(e.matches);
        if (e.matches) {
          forceFixBackgrounds();
        }
      });
    }

    // Give styles a moment to apply, then remove scrim
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        // Double rAF ensures styles are painted
        removeScrim();
      });
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Delayed check for SPAs and force-fix stubborn backgrounds
  setTimeout(function() {
    if (document.body && !document.body.classList.contains('p2-dark-mode-enabled') && isP2Site()) {
      console.log('P2 Dark Mode: Delayed P2 detection, applying styles');
      applyDarkMode(prefersDarkMode());
    }
    
    if (document.body && document.body.classList.contains('p2-dark-mode-enabled')) {
      forceFixBackgrounds();
    }
  }, 1000);
})();
