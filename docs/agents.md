# One-click agent setup

`npm run setup:agents` writes the files each tool actually reads, with a backup.

```bash
npm run setup:agents
# or non-interactive:
npm run setup:agents -- --all --model deepseek-v4-flash
npm run setup:agents -- --target claude-code --model deepseek-v4-pro
npm run setup:agents -- --dry-run --target hermes,openclaw
```

Requires the proxy already listening (`npm start`). Default origin: `http://127.0.0.1:9655`. Override with `--base-url` / `PROXY_BASE_URL`. If `PROXY_API_KEY` is set, it is copied into the agent configs.

| Target | File written | How the model is selected |
|---|---|---|
| Claude Code | `~/.claude/settings.json` (`env` block) or project `.claude/settings.local.json` | `ANTHROPIC_MODEL` + gateway discovery of `GET /v1/models` |
| Codex | `~/.codex/config.toml` + `freedeepseek.config.toml` + catalog JSON | `model` + `[model_providers.freedeepseek]` `wire_api = "responses"` |
| Hermes | `~/.hermes/config.yaml` `model:` mapping | `provider: custom`, `base_url: …/v1` |
| OpenClaw | `~/.openclaw/openclaw.json` | `models.providers.freedeepseek` + `agents.defaults.model.primary = freedeepseek/<id>` |
| Cursor | `integrations/cursor/settings.json`, launcher, optional `.cursor/settings.json` | Override OpenAI Base URL in Settings → Models (GUI still owns the API key) |

Copy-paste templates live in [`integrations/`](../integrations/). Restore: `node scripts/setup-agents.js --restore ~/.freedeepseek-api/backups/<stamp>`.

Sources: [Claude Code gateway](https://code.claude.com/docs/en/llm-gateway-connect), [Codex config](https://developers.openai.com/codex/config-reference) / [DeepSeek Codex](https://api-docs.deepseek.com/quick_start/agent_integrations/codex), [Hermes custom provider](https://hermes-agent.nousresearch.com/docs/integrations/providers), [OpenClaw custom providers](https://docs.openclaw.ai/gateway/config-tools), [DeepSeek Claude Code](https://api-docs.deepseek.com/quick_start/agent_integrations/claude_code).
