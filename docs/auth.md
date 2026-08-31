# Auth

`deepseek-auth.json` is a live Web session. Mode `600`. Do not commit it.

| Command | What |
|---|---|
| `npm run auth` | Menu: login / import / status |
| `npm run deepseek:auth` | Chrome capture of token + cookies |
| `npm run auth:import` | Import `deepseek-auth.json` or browser cookie export |
| `npm run doctor` | Validate files; omit `--offline` to hit PoW |

Chrome extension: `chrome-extension/` on an open `chat.deepseek.com` tab.

Fields: `token`, `cookie`, `wasmUrl`. Optional: `hif_dliq`, `hif_leim`. See [`auth.example.json`](../auth.example.json).

Pool: `DEEPSEEK_AUTH_DIR` (all `*.json`) or comma-separated `DEEPSEEK_AUTH_PATH`.
