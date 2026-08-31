// DeepSeek Auth Exporter — Background Service Worker
// Reads cookies from Chrome, forwards content-script localStorage data.

const STORAGE_KEY = 'deepseek_auth';

// Read all needed cookies from chat.deepseek.com
async function readCookies() {
  const needed = ['token', 'ds_session_id', 'smidV2'];
  const results = {};
  for (const name of needed) {
    const cookie = await new Promise((resolve) =>
      chrome.cookies.get({ url: 'https://chat.deepseek.com', name }, resolve)
    );
    results[name] = cookie ? cookie.value : '';
  }

  // Build cookie header string
  const parts = [];
  if (results.ds_session_id) parts.push(`ds_session_id=${results.ds_session_id}`);
  if (results.smidV2) parts.push(`smidV2=${results.smidV2}`);
  results.cookie = parts.join('; ');

  return results;
}

// Read localStorage values via content script injection
async function readLocalStorage(tabId) {
  const keys = ['hif_dliq', 'hif_leim'];
  try {
    const results = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(
        tabId,
        { action: 'readLocalStorage', keys },
        (response) => {
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError.message);
          else resolve(response.data || {});
        }
      );
    });
    return results;
  } catch (e) {
    return {};
  }
}

// Find an open DeepSeek tab
function findDeepSeekTab() {
  return new Promise((resolve) => {
    chrome.tabs.query(
      { url: 'https://chat.deepseek.com/*' },
      (tabs) => resolve(tabs.length > 0 ? tabs[0] : null)
    );
  });
}

async function collectAndStore(tabId) {
  const cookies = await readCookies();
  let ls = {};
  if (tabId) ls = await readLocalStorage(tabId);

  const merged = {
    token: cookies.token || '',
    ds_session_id: cookies.ds_session_id || '',
    smidV2: cookies.smidV2 || '',
    cookie: cookies.cookie || '',
    hif_dliq: ls.hif_dliq || '',
    hif_leim: ls.hif_leim || '',
    _lastUpdated: new Date().toISOString(),
  };

  await new Promise((resolve) =>
    chrome.storage.local.set({ [STORAGE_KEY]: merged }, resolve)
  );
  return merged;
}

// Message handler — popup requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'collect') {
    findDeepSeekTab().then(async (tab) => {
      if (!tab) {
        sendResponse({ success: false, error: 'No DeepSeek tab open' });
        return;
      }
      const auth = await collectAndStore(tab.id);
      sendResponse({ success: true, auth });
    });
    return true; // keep channel open for async
  }

  if (request.action === 'export') {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      sendResponse({ success: true, auth: result[STORAGE_KEY] || {} });
    });
    return true;
  }
});
