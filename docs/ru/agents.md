# Агенты одним нажатием

```bash
npm run setup:agents
npm run setup:agents -- --all --model deepseek-v4-flash
npm run setup:agents -- --target claude-code --model deepseek-v4-pro
```

Скрипт пишет файлы, которые реально читают инструменты, и кладёт бэкап в `~/.freedeepseek-api/backups/`.

| Цель | Куда пишет |
|---|---|
| Claude Code | `~/.claude/settings.json` |
| Codex | `~/.codex/config.toml` + профиль `freedeepseek` |
| Hermes | `~/.hermes/config.yaml` |
| OpenClaw | `~/.openclaw/openclaw.json` |
| Cursor | сниппет + launcher; ключ всё равно в GUI |

Шаблоны: [`integrations/`](../../integrations/). Подробности: [English](../agents.md).
