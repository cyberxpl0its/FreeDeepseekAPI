// Collects a DeepSeek Web session. Token is in page storage; cookies are the session.

const STORAGE_KEY = 'deepseek_auth';
const DEFAULT_WASM = 'https://fe-static.deepseek.com/chat/static/sha3_wasm_bg.7b9ca65ddd.wasm';
const TOKEN_KEYS = ['userToken', 'token', 'auth_token', 'access_token', 'accessToken'];

function parseMaybeJson(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function normalizeToken(raw) {
  if (!raw) return '';
  const parsed = parseMaybeJson(raw);
  if (parsed && typeof parsed === 'object') {
    return String(
      parsed.value || parsed.token || parsed.access_token || parsed.accessToken || ''
    ).trim().replace(/^Bearer\s+/i, '');
  }
  return String(raw).trim().replace(/^Bearer\s+/i, '');
}

function tokenFromStores(stores) {
  for (const store of stores) {
    for (const key of TOKEN_KEYS) {
      const token = normalizeToken(store[key]);
      if (token) return token;
    }
  }
  for (const store of stores) {
    for (const [key, value] of Object.entries(store || {})) {
      if (!/token/i.test(key)) continue;
      const token = normalizeToken(value);
      if (token) return token;
    }
  }
  return '';
}

function fieldFromStores(stores, names) {
  for (const store of stores) {
    for (const name of names) {
      const value = String(store[name] || '').trim();
      if (value) return value;
    }
  }
  return '';
}

async function readCookies() {
  const groups = await Promise.all([
    new Promise((resolve) => chrome.cookies.getAll({ domain: 'deepseek.com' }, resolve)),
    new Promise((resolve) => chrome.cookies.getAll({ url: 'https://chat.deepseek.com' }, resolve)),
  ]);
  const byName = new Map();
  for (const cookie of groups.flat().filter(Boolean)) {
    if (!cookie.name || cookie.value == null) continue;
    if (!/(^|\.)deepseek\.com$/i.test(String(cookie.domain || '').replace(/^\./, ''))) continue;
    byName.set(cookie.name, cookie.value);
  }
  const parts = [...byName.entries()].map(([name, value]) => `${name}=${value}`);
  return {
    token: byName.get('token') || '',
    cookie: parts.join('; '),
    ds_session_id: byName.get('ds_session_id') || '',
    smidV2: byName.get('smidV2') || '',
  };
}

function collectPageStoresFn() {
  const dump = (store) => {
    const out = {};
    try {
      for (let i = 0; i < store.length; i++) {
        const key = store.key(i);
        if (key) out[key] = store.getItem(key) || '';
      }
    } catch {
      // ignore
    }
    return out;
  };
  let wasmUrl = '';
  try {
    wasmUrl = performance
      .getEntriesByType('resource')
      .map((r) => r.name)
      .find((n) => /sha3.*\.wasm/i.test(n)) || '';
  } catch {
    wasmUrl = '';
  }
  return {
    href: location.href,
    localStorage: dump(window.localStorage),
    sessionStorage: dump(window.sessionStorage),
    wasmUrl,
  };
}

async function readPageStores(tabId) {
  try {
    const injected = await chrome.scripting.executeScript({
      target: { tabId },
      func: collectPageStoresFn,
    });
    const value = injected?.[0]?.result;
    if (value) return value;
  } catch {
    // Fall through to the content-script path (page already had the extension injected).
  }
  return await new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, { action: 'readPageStores' }, (response) => {
      if (chrome.runtime.lastError) resolve({});
      else resolve(response?.data || {});
    });
  });
}

function findDeepSeekTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ url: 'https://chat.deepseek.com/*' }, (tabs) => {
      const active = tabs.find((t) => t.active) || tabs[0];
      resolve(active || null);
    });
  });
}

async function collectAndStore(tabId) {
  const cookies = await readCookies();
  const page = tabId ? await readPageStores(tabId) : {};
  const stores = [page.localStorage || {}, page.sessionStorage || {}];
  const token = tokenFromStores(stores) || normalizeToken(cookies.token);
  const auth = {
    token,
    hif_dliq: fieldFromStores(stores, ['hif_dliq', 'x-hif-dliq']),
    hif_leim: fieldFromStores(stores, ['hif_leim', 'x-hif-leim']),
    cookie: cookies.cookie,
    wasmUrl: page.wasmUrl || DEFAULT_WASM,
    ds_session_id: cookies.ds_session_id,
    smidV2: cookies.smidV2,
    _lastUpdated: new Date().toISOString(),
  };
  await chrome.storage.local.set({ [STORAGE_KEY]: auth });
  return auth;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'collect') {
    findDeepSeekTab().then(async (tab) => {
      if (!tab) {
        sendResponse({ success: false, error: 'Open chat.deepseek.com and sign in first.' });
        return;
      }
      try {
        const auth = await collectAndStore(tab.id);
        sendResponse({ success: true, auth });
      } catch (e) {
        sendResponse({ success: false, error: e.message || String(e) });
      }
    });
    return true;
  }

  if (request.action === 'export') {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      sendResponse({ success: true, auth: result[STORAGE_KEY] || {} });
    });
    return true;
  }
});
