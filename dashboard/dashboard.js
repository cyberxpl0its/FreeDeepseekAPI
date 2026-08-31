const panes = {
  accounts: document.getElementById('pane-accounts'),
  usage: document.getElementById('pane-usage'),
  requests: document.getElementById('pane-requests'),
};
const banner = document.getElementById('banner');
const fileAdd = document.getElementById('fileAdd');
const fileReplace = document.getElementById('fileReplace');

function showBanner(text, kind = '') {
  banner.hidden = !text;
  banner.textContent = text || '';
  banner.className = `callout ${kind}`.trim();
}

function money(n) {
  return `$${Number(n || 0).toFixed(4)}`;
}

function tokens(n) {
  return Number(n || 0).toLocaleString();
}

function when(ts) {
  if (!ts) return '—';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'short', timeStyle: 'medium' }).format(new Date(ts));
}

function pill(text, kind) {
  const span = document.createElement('span');
  span.className = `pill ${kind || ''}`.trim();
  span.textContent = text;
  return span;
}

function isEditing() {
  const el = document.activeElement;
  return el && (el.classList.contains('name-input') || el === fileAdd || el === fileReplace);
}

function accountLabel(state, id) {
  const account = (state.accounts || []).find((a) => a.id === id);
  return account?.name || id || '—';
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
  return data;
}

async function patchAccount(id, body) {
  return api('/v1/admin/accounts', {
    method: 'PATCH',
    body: JSON.stringify({ id, ...body }),
  });
}

function renderAccounts(state) {
  const root = document.getElementById('accountList');
  root.replaceChildren();
  if (!state.accounts.length) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'No accounts. Export deepseek-auth.json from the Chrome extension, then Add account.';
    root.append(empty);
    return;
  }
  for (const account of state.accounts) {
    const row = document.createElement('div');
    row.className = `row${account.enabled ? '' : ' is-paused'}`;

    const left = document.createElement('div');
    const name = document.createElement('input');
    name.className = 'name-input';
    name.type = 'text';
    name.maxLength = 80;
    name.value = account.name || account.id;
    name.setAttribute('aria-label', `Name for ${account.id}`);
    name.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') name.blur();
      if (e.key === 'Escape') {
        name.value = account.name || account.id;
        name.blur();
      }
    });
    name.addEventListener('blur', async () => {
      const next = name.value.trim();
      const current = account.name || account.id;
      if (next === current) return;
      try {
        await patchAccount(account.id, { name: next });
        await refresh();
      } catch (e) {
        name.value = current;
        showBanner(e.message, 'error');
      }
    });
    const meta = document.createElement('p');
    meta.className = 'row-meta';
    meta.textContent = `${account.id} · ${account.file || 'in-memory'} · ${tokens(account.prompt_tokens + account.completion_tokens)} tok · ${money(account.usd)}`;
    left.append(name, meta);

    const pills = document.createElement('div');
    pills.className = 'pills';
    if (!account.enabled) pills.append(pill('Paused', 'cool'));
    else pills.append(pill(account.ready ? 'Ready' : 'Incomplete', account.ready ? 'ready' : 'cool'));
    if (account.busy) pills.append(pill(`Busy ${account.busy_agent || ''}`.trim(), 'busy'));
    if (account.cooldown) pills.append(pill(`Cooldown ${account.cooldown_remaining_sec}s`, 'cool'));

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'switch';
    toggle.setAttribute('role', 'switch');
    toggle.setAttribute('aria-checked', account.enabled ? 'true' : 'false');
    toggle.setAttribute('aria-label', account.enabled ? 'Pause account' : 'Enable account');
    toggle.addEventListener('click', async () => {
      try {
        await patchAccount(account.id, { enabled: !account.enabled });
        await refresh();
      } catch (e) { showBanner(e.message, 'error'); }
    });

    const actions = document.createElement('div');
    actions.className = 'row-actions';

    const replace = document.createElement('button');
    replace.type = 'button';
    replace.className = 'btn btn-small';
    replace.textContent = 'Replace JSON';
    replace.addEventListener('click', () => {
      fileReplace.dataset.accountId = account.id;
      fileReplace.click();
    });
    actions.append(replace);

    if (account.cooldown) {
      const clear = document.createElement('button');
      clear.type = 'button';
      clear.className = 'btn btn-small';
      clear.textContent = 'Clear cooldown';
      clear.addEventListener('click', async () => {
        try {
          await api(`/v1/admin/accounts/cooldown-clear?id=${encodeURIComponent(account.id)}`, { method: 'POST' });
          await refresh();
        } catch (e) { showBanner(e.message, 'error'); }
      });
      actions.append(clear);
    }

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'btn btn-small btn-danger';
    del.textContent = 'Remove';
    del.addEventListener('click', async () => {
      if (!window.confirm(`Remove ${account.name || account.id}? This deletes the local auth file.`)) return;
      try {
        await api(`/v1/admin/accounts?id=${encodeURIComponent(account.id)}`, { method: 'DELETE' });
        await refresh();
      } catch (e) { showBanner(e.message, 'error'); }
    });
    actions.append(del);

    row.append(left, pills, toggle, actions);
    root.append(row);
  }
}

function renderUsage(state) {
  const t = state.totals || {};
  document.getElementById('metricTokens').textContent = tokens((t.prompt_tokens || 0) + (t.completion_tokens || 0));
  document.getElementById('metricUsd').textContent = money(t.usd);
  document.getElementById('metricFlight').textContent = String(state.in_flight || 0);
  const root = document.getElementById('usageList');
  root.replaceChildren();
  const rows = state.usage || [];
  if (!rows.length) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'No completions recorded in this process yet.';
    root.append(empty);
    return;
  }
  for (const u of rows) {
    const row = document.createElement('div');
    row.className = 'row usage-row';
    const title = document.createElement('p');
    title.className = 'row-title';
    title.textContent = accountLabel(state, u.account);
    const meta = document.createElement('p');
    meta.className = 'row-meta';
    meta.textContent = `${u.requests} req · in ${tokens(u.prompt_tokens)} · out ${tokens(u.completion_tokens)}`;
    const right = document.createElement('p');
    right.className = 'row-title';
    right.textContent = money(u.usd);
    const left = document.createElement('div');
    left.append(title, meta);
    row.append(left, right);
    root.append(row);
  }
}

function renderRequests(state) {
  const root = document.getElementById('requestTable');
  const rows = state.requests || [];
  if (!rows.length) {
    root.innerHTML = '<p class="empty">No requests yet. Send traffic with a distinct x-agent-session per client.</p>';
    return;
  }
  const table = document.createElement('table');
  table.innerHTML = '<thead><tr><th>Time</th><th>IP</th><th>Account</th><th>Agent</th><th>Model</th><th>Status</th><th>Tokens</th><th>ms</th></tr></thead>';
  const tbody = document.createElement('tbody');
  for (const r of rows) {
    const tr = document.createElement('tr');
    const cells = [
      when(r.ts),
      r.ip || '—',
      accountLabel(state, r.account),
      r.agent || '—',
      r.model || '—',
      String(r.status || '—'),
      tokens((r.prompt_tokens || 0) + (r.completion_tokens || 0)),
      String(r.ms || 0),
    ];
    for (const value of cells) {
      const td = document.createElement('td');
      td.className = 'mono';
      td.textContent = value;
      tr.append(td);
    }
    tbody.append(tr);
  }
  table.append(tbody);
  root.replaceChildren(table);
}

async function refresh() {
  if (isEditing()) return;
  try {
    const state = await api('/v1/admin/state');
    showBanner('');
    renderAccounts(state);
    renderUsage(state);
    renderRequests(state);
  } catch (e) {
    showBanner(e.message, 'error');
  }
}

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => {
      const on = t === tab;
      t.classList.toggle('selected', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    const id = tab.dataset.pane;
    Object.entries(panes).forEach(([key, el]) => { el.hidden = key !== id; });
  });
});

document.getElementById('btnAdd').addEventListener('click', () => fileAdd.click());

fileAdd.addEventListener('change', async (ev) => {
  const file = ev.target.files?.[0];
  ev.target.value = '';
  if (!file) return;
  try {
    const auth = JSON.parse(await file.text());
    await api('/v1/admin/accounts', {
      method: 'POST',
      body: JSON.stringify({ name: file.name.replace(/\.json$/i, ''), auth }),
    });
    await refresh();
  } catch (e) {
    showBanner(e.message, 'error');
  }
});

fileReplace.addEventListener('change', async (ev) => {
  const file = ev.target.files?.[0];
  const id = fileReplace.dataset.accountId;
  ev.target.value = '';
  delete fileReplace.dataset.accountId;
  if (!file || !id) return;
  try {
    const auth = JSON.parse(await file.text());
    await patchAccount(id, { auth });
    await refresh();
  } catch (e) {
    showBanner(e.message, 'error');
  }
});

refresh();
window.setInterval(refresh, 2500);
