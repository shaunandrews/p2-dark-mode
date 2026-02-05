/**
 * P2 Dark Mode — Content Script
 * 
 * Detects if the current page is a P2 site and enables dark mode styles.
 * Uses a scrim overlay to prevent white flash during load.
 */

(function() {
  'use strict';

  // ============================================
  // HOSTNAME CHECKS — Only run on P2 subdomains
  // ============================================
  
  const hostname = window.location.hostname;
  
  // Bail if we're on wordpress.com itself (not a subdomain)
  if (hostname === 'wordpress.com' || hostname === 'www.wordpress.com') {
    return;
  }
  
  // Bail if not a wordpress.com subdomain at all
  if (!hostname.endsWith('.wordpress.com')) {
    return;
  }
  
  // Blocklist of known non-P2 wordpress.com subdomains
  const nonP2Subdomains = [
    'my.wordpress.com',           // WP.com dashboard/app
    'public-api.wordpress.com',   // API
    'developer.wordpress.com',    // Developer docs
    'learn.wordpress.com',        // Learning portal
    'developer.wordpress.com',    // Dev resources
    'make.wordpress.com',         // Make WordPress (uses different theme)
    'central.wordcamp.org',       // WordCamp
    'profiles.wordpress.org',     // Profiles
    'login.wordpress.org',        // Login
    'subscribe.wordpress.com',    // Subscriptions
    'widgets.wp.com',             // Widgets
    'stats.wp.com',               // Stats
    'pixel.wp.com',               // Tracking
    'i0.wp.com', 'i1.wp.com', 'i2.wp.com', 'i3.wp.com', // Image CDN
    's0.wp.com', 's1.wp.com', 's2.wp.com',              // Static assets
  ];
  
  if (nonP2Subdomains.includes(hostname)) {
    return;
  }
  
  // No scrim — we'll apply styles only after confirming it's a P2
  // This prevents any visual impact on non-P2 sites

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
   * Inject the dark mode CSS stylesheet
   */
  function injectStylesheet() {
    if (document.getElementById('p2-dark-mode-css')) return; // Already injected
    
    const link = document.createElement('link');
    link.id = 'p2-dark-mode-css';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL('styles/dark.css');
    document.head.appendChild(link);
    console.log('P2 Dark Mode: Stylesheet injected');
  }

  /**
   * Initialize P2 Dark Mode
   */
  function init() {
    // If not a P2 site, bail
    if (!isP2Site()) {
      console.log('P2 Dark Mode: Not a P2 site, skipping');
      return;
    }

    console.log('P2 Dark Mode: P2 detected');
    
    // Inject CSS only for P2 sites
    injectStylesheet();
    
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
