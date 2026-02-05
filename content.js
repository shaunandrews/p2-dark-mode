/**
 * P2 Dark Mode — Content Script
 * 
 * Detects if the current page is a P2 site and enables dark mode styles.
 * Uses a scrim overlay to prevent white flash during load.
 */

(function() {
  'use strict';

  const hostname = window.location.hostname;
  
  // Must be a wordpress.com subdomain
  if (!hostname.endsWith('.wordpress.com') || 
      hostname === 'wordpress.com' || 
      hostname === 'www.wordpress.com' ||
      hostname === 'my.wordpress.com') {
    return;
  }
  
  // Default sites (fallback if storage hasn't been set)
  const DEFAULT_SITES = [
    'designomattic.wordpress.com',
    'aip2.wordpress.com',
    'growthp2.wordpress.com',
    'learningp2.wordpress.com',
    'dotcomdesignp2.wordpress.com',
  ];
  
  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  
  function injectCSS() {
    if (document.getElementById('p2-dark-mode-css')) return;
    const link = document.createElement('link');
    link.id = 'p2-dark-mode-css';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL('styles/dark.css');
    (document.head || document.documentElement).appendChild(link);
  }
  
  function injectScrim() {
    if (document.getElementById('p2-dark-mode-scrim')) return;
    const isDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const scrim = document.createElement('div');
    scrim.id = 'p2-dark-mode-scrim';
    scrim.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      z-index: 999999;
      background-color: ${isDark ? '#1a1a1a' : '#ffffff'};
      transition: opacity 150ms ease-out;
      pointer-events: none;
    `;
    document.documentElement.appendChild(scrim);
  }
  
  function removeScrim() {
    const scrim = document.getElementById('p2-dark-mode-scrim');
    if (!scrim) return;
    scrim.style.opacity = '0';
    setTimeout(() => scrim.remove(), 160);
  }
  
  function removeDarkMode() {
    document.getElementById('p2-dark-mode-scrim')?.remove();
    document.getElementById('p2-dark-mode-css')?.remove();
    document.documentElement.classList.remove('p2-dark-mode-enabled');
    document.body?.classList.remove('p2-dark-mode-enabled');
  }
  
  function isP2Site() {
    const body = document.body;
    if (!body) return false;
    
    const bodyClasses = body.className;
    if (bodyClasses.includes('flavor-flavor-flavor') || 
        bodyClasses.includes('flavor-flavor')) {
      return true;
    }
    
    const p2Markers = ['.p2-header', '#p2-site-header', '.p2020-site-header', 
                       '.o2-app', '.o2-posts', '#o2-wrapper'];
    return p2Markers.some(sel => document.querySelector(sel));
  }
  
  function prefersDarkMode() {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  }
  
  function applyDarkMode(enable) {
    if (enable) {
      document.documentElement.classList.add('p2-dark-mode-enabled');
      document.body?.classList.add('p2-dark-mode-enabled');
    } else {
      document.documentElement.classList.remove('p2-dark-mode-enabled');
      document.body?.classList.remove('p2-dark-mode-enabled');
    }
  }
  
  function forceFixBackgrounds() {
    if (!prefersDarkMode()) return;
    const darkBg = '#1a1a1a';
    document.querySelectorAll('*').forEach(el => {
      const bg = getComputedStyle(el).backgroundColor;
      if (['rgb(255, 255, 255)', 'white', 'rgb(243, 243, 243)', 
           'rgb(240, 240, 240)', 'rgb(248, 248, 248)', 'rgb(250, 250, 250)'].includes(bg)) {
        el.style.setProperty('background-color', darkBg, 'important');
      }
    });
  }
  
  // ============================================
  // MAIN INITIALIZATION
  // ============================================
  
  function initP2Detection() {
    function init() {
      if (!isP2Site()) {
        console.log('P2 Dark Mode: Not a P2 site, skipping');
        removeScrim();
        return;
      }
      
      console.log('P2 Dark Mode: P2 detected');
      applyDarkMode(prefersDarkMode());
      
      window.matchMedia?.('(prefers-color-scheme: dark)')
        .addEventListener('change', e => {
          applyDarkMode(e.matches);
          if (e.matches) forceFixBackgrounds();
        });
      
      requestAnimationFrame(() => requestAnimationFrame(() => removeScrim()));
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
    
    // Delayed check for SPAs
    setTimeout(() => {
      if (document.body && !document.body.classList.contains('p2-dark-mode-enabled') && isP2Site()) {
        applyDarkMode(prefersDarkMode());
      }
      if (document.body?.classList.contains('p2-dark-mode-enabled')) {
        forceFixBackgrounds();
      }
    }, 1000);
  }
  
  // ============================================
  // ALLOWLIST CHECK & START
  // ============================================
  
  const isDefaultSite = DEFAULT_SITES.includes(hostname);
  
  function showEnablePrompt() {
    // Only show if hostname looks like a P2 (ends with p2.wordpress.com)
    if (!hostname.match(/p2\.wordpress\.com$/)) return;
    
    // Wait for body
    function inject() {
      if (document.getElementById('p2-dark-mode-prompt')) return;
      
      const prompt = document.createElement('div');
      prompt.id = 'p2-dark-mode-prompt';
      prompt.innerHTML = `
        <style>
          #p2-dark-mode-prompt {
            position: fixed;
            top: 100px;
            right: 20px;
            background: #1a1a1a;
            color: #e6e6e6;
            padding: 12px 16px;
            border-radius: 10px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 2147483647;
            display: flex;
            align-items: center;
            gap: 12px;
            white-space: nowrap;
          }
          #p2-dark-mode-prompt button {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            white-space: nowrap;
          }
          #p2-dark-mode-prompt .enable-btn {
            background: #0675c4;
            color: white;
          }
          #p2-dark-mode-prompt .enable-btn:hover {
            background: #0563a1;
          }
          #p2-dark-mode-prompt .dismiss-btn {
            background: transparent;
            color: #999;
          }
          #p2-dark-mode-prompt .dismiss-btn:hover {
            color: #ccc;
          }
        </style>
        <span>Enable dark mode on this P2?</span>
        <button class="enable-btn">Enable</button>
        <button class="dismiss-btn">✕</button>
      `;
      document.body.appendChild(prompt);
      
      prompt.querySelector('.enable-btn').addEventListener('click', async () => {
        const result = await chrome.storage.sync.get(['allowlist']);
        const allowlist = result.allowlist || DEFAULT_SITES;
        if (!allowlist.includes(hostname)) {
          allowlist.push(hostname);
          await chrome.storage.sync.set({ allowlist });
        }
        prompt.remove();
        location.reload();
      });
      
      prompt.querySelector('.dismiss-btn').addEventListener('click', async () => {
        // Add to deny list so we don't ask again
        const result = await chrome.storage.sync.get(['denylist']);
        const denylist = result.denylist || [];
        if (!denylist.includes(hostname)) {
          denylist.push(hostname);
          await chrome.storage.sync.set({ denylist });
        }
        prompt.remove();
      });
    }
    
    if (document.body) {
      inject();
    } else {
      document.addEventListener('DOMContentLoaded', inject);
    }
  }
  
  if (isDefaultSite) {
    // Default site: inject immediately, verify with storage
    injectCSS();
    injectScrim();
    initP2Detection();
    
    // Check if user removed this default site
    chrome.storage.sync.get(['allowlist'], (result) => {
      if (result.allowlist && !result.allowlist.includes(hostname)) {
        removeDarkMode();
      }
    });
  } else {
    // Non-default site: check storage first
    chrome.storage.sync.get(['allowlist', 'denylist'], (result) => {
      const allowlist = result.allowlist || DEFAULT_SITES;
      const denylist = result.denylist || [];
      
      if (allowlist.includes(hostname)) {
        injectCSS();
        injectScrim();
        initP2Detection();
      } else if (!denylist.includes(hostname)) {
        // Not in allowlist or denylist - show prompt if it looks like a P2
        showEnablePrompt();
      }
    });
  }
})();
