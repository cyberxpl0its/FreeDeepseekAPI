<div align="center">

<img src="docs/assets/header.svg" alt="FreeDeepseekAPI" width="960" />

[English](README.md) · [Русский](README.ru.md) · **简体中文**

<br/>

<img src="https://readme-typing-svg.demolab.com?font=IBM+Plex+Sans&weight=600&size=20&duration=2800&pause=900&color=3EE0C8&center=true&vCenter=true&width=720&lines=DeepSeek+Web+%E6%9C%AC%E5%9C%B0+OpenAI+%E5%85%BC%E5%AE%B9%E4%BB%A3%E7%90%86;V4-Flash+Instant+%C2%B7+V4-Pro+Expert;%E4%B8%80%E9%94%AE%E6%8E%A5%E5%85%A5+Claude+Code+%C2%B7+Codex+%C2%B7+Hermes+%C2%B7+OpenClaw+%C2%B7+Cursor" alt="tagline" />

<p>
  <a href="https://github.com/dekrezz/FreeDeepseekAPI/stargazers"><img src="https://img.shields.io/github/stars/dekrezz/FreeDeepseekAPI?style=for-the-badge&logo=github&color=3ee0c8&label=stars" alt="GitHub stars" /></a>
  <a href="https://github.com/dekrezz/FreeDeepseekAPI/network/members"><img src="https://img.shields.io/github/forks/dekrezz/FreeDeepseekAPI?style=for-the-badge&logo=github&color=7c6bff" alt="forks" /></a>
  <img src="https://img.shields.io/badge/node-%3E%3D18-3ee0c8?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="node" />
  <img src="https://img.shields.io/badge/models-V4--Flash%20%7C%20V4--Pro-7c6bff?style=for-the-badge" alt="models" />
</p>

<p>
  <a href="docs/zh/README.md">文档</a> ·
  <a href="docs/zh/models.md">模型</a> ·
  <a href="docs/zh/agents.md">Agent</a> ·
  <a href="docs/auth.md">鉴权</a> ·
  <a href="https://t.me/forgetmeai">Telegram</a>
</p>

</div>

面向 [chat.deepseek.com](https://chat.deepseek.com) 的本地 OpenAI / Anthropic / Responses 代理。使用 Web 登录，不需要付费 API Key。

## 开始

```bash
npm run auth
npm start
```

```bash
curl http://127.0.0.1:9655/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"deepseek-v4-flash","messages":[{"role":"user","content":"ping"}]}'
```

## 模型

仅 **V4-Flash**（Instant）与 **V4-Pro**（Expert）。[完整表 →](docs/zh/models.md)

| ID | Web |
|---|---|
| [`deepseek-v4-flash`](docs/zh/models.md) | Instant |
| [`deepseek-v4-pro`](docs/zh/models.md) | Expert |
| `…-thinking` / `…-search` | 同一模型，附加开关 |

## 一键接入 Agent

[原理 →](docs/zh/agents.md)

```bash
npm run setup:agents
```

<table>
<tr>
<td align="center"><a href="docs/zh/agents.md"><b>Claude Code</b></a></td>
<td align="center"><a href="docs/zh/agents.md"><b>Codex</b></a></td>
<td align="center"><a href="docs/zh/agents.md"><b>Hermes</b></a></td>
<td align="center"><a href="docs/zh/agents.md"><b>OpenClaw</b></a></td>
<td align="center"><a href="docs/zh/agents.md"><b>Cursor</b></a></td>
</tr>
</table>

模板：[`integrations/`](integrations/)。

## 文档

| 指南 | |
|---|---|
| [模型](docs/zh/models.md) | Instant / Expert |
| [Agent](docs/zh/agents.md) | 一键配置 |
| [鉴权](docs/auth.md) | `deepseek-auth.json` |
| [HTTP API](docs/api.md) | 接口 |

## Star 趋势

<a href="https://star-history.com/#dekrezz/FreeDeepseekAPI&Date">
  <img alt="Star history" src="https://api.star-history.com/svg?repos=dekrezz/FreeDeepseekAPI&type=Date&theme=dark" />
</a>
