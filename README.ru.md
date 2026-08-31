<div align="center">

<img src="docs/assets/header.gif" alt="FreeDeepseekAPI" width="960" />

[English](README.md) · **Русский** · [简体中文](README.zh.md)

<br/>

<img src="https://readme-typing-svg.demolab.com?font=IBM+Plex+Sans&weight=600&size=20&duration=2800&pause=900&color=3EE0C8&center=true&vCenter=true&width=720&lines=%D0%9B%D0%BE%D0%BA%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9+API+%D0%BD%D0%B0%D0%B4+DeepSeek+Web;V4-Flash+Instant+%C2%B7+V4-Pro+Expert;%D0%9E%D0%B4%D0%BD%D0%BE+%D0%BD%D0%B0%D0%B6%D0%B0%D1%82%D0%B8%D0%B5%3A+Claude+Code+%C2%B7+Codex+%C2%B7+Hermes+%C2%B7+OpenClaw+%C2%B7+Cursor" alt="tagline" />

<p>
  <a href="https://github.com/dekrezz/FreeDeepseekAPI/stargazers"><img src="https://img.shields.io/github/stars/dekrezz/FreeDeepseekAPI?style=for-the-badge&logo=github&color=3ee0c8&label=stars" alt="GitHub stars" /></a>
  <a href="https://github.com/dekrezz/FreeDeepseekAPI/network/members"><img src="https://img.shields.io/github/forks/dekrezz/FreeDeepseekAPI?style=for-the-badge&logo=github&color=7c6bff" alt="forks" /></a>
  <img src="https://img.shields.io/badge/node-%3E%3D18-3ee0c8?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="node" />
  <img src="https://img.shields.io/badge/models-V4--Flash%20%7C%20V4--Pro-7c6bff?style=for-the-badge" alt="models" />
</p>

<p>
  <a href="docs/ru/README.md">Документация</a> ·
  <a href="docs/ru/models.md">Модели</a> ·
  <a href="docs/ru/agents.md">Агенты</a> ·
  <a href="docs/auth.md">Авторизация</a> ·
  <a href="https://t.me/forgetmeai">Telegram</a>
</p>

</div>

Локальный прокси OpenAI / Anthropic / Responses над [chat.deepseek.com](https://chat.deepseek.com). Нужен Web-логин, не платный API-ключ.

## Старт

```bash
npm run auth
npm start
```

```bash
curl http://127.0.0.1:9655/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"deepseek-v4-flash","messages":[{"role":"user","content":"ping"}]}'
```

## Модели

Только **V4-Flash** (Instant) и **V4-Pro** (Expert). [Таблица →](docs/ru/models.md)

| ID | Web |
|---|---|
| [`deepseek-v4-flash`](docs/ru/models.md) | Instant |
| [`deepseek-v4-pro`](docs/ru/models.md) | Expert |
| `…-thinking` / `…-search` | те же модели, другие флаги |

## Агенты одним нажатием

[Как устроено →](docs/ru/agents.md)

```bash
npm run setup:agents
```

<table>
<tr>
<td align="center"><a href="docs/ru/agents.md"><b>Claude Code</b></a></td>
<td align="center"><a href="docs/ru/agents.md"><b>Codex</b></a></td>
<td align="center"><a href="docs/ru/agents.md"><b>Hermes</b></a></td>
<td align="center"><a href="docs/ru/agents.md"><b>OpenClaw</b></a></td>
<td align="center"><a href="docs/ru/agents.md"><b>Cursor</b></a></td>
</tr>
</table>

Шаблоны: [`integrations/`](integrations/).

## Документация

| Гайд | |
|---|---|
| [Модели](docs/ru/models.md) | Instant / Expert |
| [Агенты](docs/ru/agents.md) | one-click |
| [Авторизация](docs/auth.md) | `deepseek-auth.json` |
| [HTTP API](docs/api.md) | эндпоинты |

## Звёзды

<p>
  <a href="https://github.com/dekrezz/FreeDeepseekAPI/stargazers"><img src="https://img.shields.io/github/stars/dekrezz/FreeDeepseekAPI?style=for-the-badge&logo=github&color=3ee0c8&label=stars" alt="GitHub stars" /></a>
</p>

<a href="https://github.com/dekrezz/FreeDeepseekAPI/stargazers">
  <img src="docs/assets/stars.png" alt="История звёзд" width="800" />
</a>
