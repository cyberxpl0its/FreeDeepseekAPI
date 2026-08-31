# 一键接入 Agent

```bash
npm run setup:agents
npm run setup:agents -- --all --model deepseek-v4-flash
npm run setup:agents -- --target claude-code --model deepseek-v4-pro
```

脚本写入各工具真正读取的配置，并备份到 `~/.freedeepseek-api/backups/`。

| 目标 | 写入 |
|---|---|
| Claude Code | `~/.claude/settings.json` |
| Codex | `~/.codex/config.toml` + `freedeepseek` profile |
| Hermes | `~/.hermes/config.yaml` |
| OpenClaw | `~/.openclaw/openclaw.json` |
| Cursor | 片段 + 启动脚本；API Key 仍在 GUI |

模板：[`integrations/`](../../integrations/)。详情：[English](../agents.md)。
