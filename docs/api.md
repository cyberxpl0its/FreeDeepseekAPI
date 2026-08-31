# HTTP API

Default: `http://127.0.0.1:9655`

| Method | Path |
|---|---|
| GET | `/health` |
| GET | `/readyz` |
| GET | `/v1/models` |
| GET | `/v1/model-capabilities` |
| GET | `/v1/sessions` |
| POST | `/v1/chat/completions` |
| POST | `/v1/messages` (Anthropic Messages) |
| POST | `/v1/responses` (OpenAI Responses) |
| POST | `/reset-session?agent=<id\|all>` |

Set `PROXY_API_KEY` and send `Authorization: Bearer <key>`. Sessions stick to `x-agent-session` / `user`. Env: `HOST`, `PORT`, `DEEPSEEK_AUTH_PATH`, `NON_INTERACTIVE`, `REQUIRE_PROXY_API_KEY`. Docker: [`Containerfile`](../Containerfile).
