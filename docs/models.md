# Models

Checked against [DeepSeek API docs](https://api-docs.deepseek.com/), [pricing](https://api-docs.deepseek.com/quick_start/pricing), and [V4-Pro GA](https://api-docs.deepseek.com/news/news260813/) (2026-08-31).

This proxy talks to **DeepSeek Web** (`chat.deepseek.com`), not the paid `api.deepseek.com` key.

| Web UI | Web `model_type` | Proxy / official ID | Checkpoint |
|---|---|---|---|
| Instant | `default` | `deepseek-v4-flash` | DeepSeek-V4-Flash-0731 |
| Expert | `expert` | `deepseek-v4-pro` | DeepSeek-V4-Pro-0813 |

Thinking and search are Web flags. They are encoded as suffixes:

| ID | thinking | search |
|---|---|---|
| `deepseek-v4-flash` | no | no |
| `deepseek-v4-flash-thinking` | yes | no |
| `deepseek-v4-flash-search` | no | yes |
| `deepseek-v4-flash-thinking-search` | yes | yes |
| `deepseek-v4-pro` | no | no |
| `deepseek-v4-pro-thinking` | yes | no |

Legacy names (`deepseek-chat`, `deepseek-reasoner`, `deepseek-r1`, `deepseek-instant`, `deepseek-expert`, vision) are **not** registered. Unknown IDs return `400 invalid_model`.

Claude Code still sends `claude-sonnet-*` / `claude-opus-*` unless its env is rewritten. The proxy maps those onto Flash / Pro-thinking so one-click setup works even if a leftover Claude ID slips through.

List: `GET /v1/models`. Full map: `GET /v1/model-capabilities`.
