/**
 * P2 Dark Mode — Popup Script
 */

const DEFAULT_SITES = [
  'designomattic.wordpress.com',
  'aip2.wordpress.com',
  'growthp2.wordpress.com',
  'learningp2.wordpress.com',
  'dotcomdesignp2.wordpress.com',
];

let currentHostname = null;

// Get the allowlist from storage
async function getAllowlist() {
  const result = await chrome.storage.sync.get(['allowlist']);
  return result.allowlist || DEFAULT_SITES;
}

// Get the denylist from storage
async function getDenylist() {
  const result = await chrome.storage.sync.get(['denylist']);
  return result.denylist || [];
}

// Remove from denylist
async function removeFromDenylist(hostname) {
  const denylist = await getDenylist();
  const index = denylist.indexOf(hostname);
  if (index > -1) {
    denylist.splice(index, 1);
    await chrome.storage.sync.set({ denylist });
  }
}

// Save the allowlist to storage
async function saveAllowlist(sites) {
  await chrome.storage.sync.set({ allowlist: sites });
}

// Check if a hostname is a wordpress.com subdomain
function isWordPressSite(hostname) {
  return hostname.endsWith('.wordpress.com') && 
         hostname !== 'wordpress.com' && 
         hostname !== 'www.wordpress.com';
}

// Render the site list
async function renderSiteList() {
  const sites = await getAllowlist();
  const list = document.getElementById('siteList');
  
  if (sites.length === 0) {
    list.innerHTML = '<li class="empty-state">No sites enabled</li>';
    return;
  }
  
  list.innerHTML = sites
    .sort()
    .map(site => `
      <li>
        <span>${site}</span>
        <button class="remove-btn" data-site="${site}" title="Remove">×</button>
      </li>
    `)
    .join('');
  
  // Add click handlers for remove buttons
  list.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const site = e.target.dataset.site;
      await removeSite(site);
    });
  });
}

// Update the current site status
async function updateCurrentSite() {
  const hostnameEl = document.getElementById('hostname');
  const statusEl = document.getElementById('status');
  const addBtn = document.getElementById('addBtn');
  const removeBtn = document.getElementById('removeBtn');
  const notWp = document.getElementById('notWp');
  
  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) {
    hostnameEl.textContent = 'Unknown';
    return;
  }
  
  try {
    const url = new URL(tab.url);
    currentHostname = url.hostname;
    hostnameEl.textContent = currentHostname;
    
    if (!isWordPressSite(currentHostname)) {
      notWp.style.display = 'block';
      addBtn.style.display = 'none';
      removeBtn.style.display = 'none';
      statusEl.textContent = '';
      return;
    }
    
    notWp.style.display = 'none';
    const sites = await getAllowlist();
    const denylist = await getDenylist();
    const isEnabled = sites.includes(currentHostname);
    const isDenied = denylist.includes(currentHostname);
    
    if (isEnabled) {
      statusEl.textContent = '✓ Dark mode enabled';
      statusEl.className = 'current-site-status enabled';
      addBtn.style.display = 'none';
      removeBtn.style.display = 'block';
    } else {
      statusEl.innerHTML = isDenied 
        ? 'Dark mode not enabled<br><small style="color:#999">You dismissed the prompt for this site</small>'
        : 'Dark mode not enabled';
      statusEl.className = 'current-site-status';
      addBtn.style.display = 'block';
      removeBtn.style.display = 'none';
    }
  } catch (e) {
    hostnameEl.textContent = 'Unknown';
  }
}

// Add current site to allowlist
async function addCurrentSite() {
  if (!currentHostname || !isWordPressSite(currentHostname)) return;
  
  const sites = await getAllowlist();
  if (!sites.includes(currentHostname)) {
    sites.push(currentHostname);
    await saveAllowlist(sites);
  }
  
  // Also remove from denylist if it was there
  await removeFromDenylist(currentHostname);
  
  await renderSiteList();
  await updateCurrentSite();
  
  // Reload the current tab to apply changes
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    chrome.tabs.reload(tab.id);
  }
}

// Remove a site from allowlist
async function removeSite(hostname) {
  const sites = await getAllowlist();
  const index = sites.indexOf(hostname);
  if (index > -1) {
    sites.splice(index, 1);
    await saveAllowlist(sites);
  }
  
  await renderSiteList();
  await updateCurrentSite();
  
  // Reload if we removed the current site
  if (hostname === currentHostname) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.tabs.reload(tab.id);
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await renderSiteList();
  await updateCurrentSite();
  
  document.getElementById('addBtn').addEventListener('click', addCurrentSite);
  document.getElementById('removeBtn').addEventListener('click', () => {
    if (currentHostname) {
      removeSite(currentHostname);
    }
  });
});
