# Модели

Сверка: [документация DeepSeek API](https://api-docs.deepseek.com/), [цены](https://api-docs.deepseek.com/quick_start/pricing), [GA V4-Pro](https://api-docs.deepseek.com/news/news260813/) (2026-08-31).

Прокси ходит в **DeepSeek Web**, не в платный `api.deepseek.com`.

| UI | `model_type` | ID | Чекпоинт |
|---|---|---|---|
| Instant | `default` | `deepseek-v4-flash` | DeepSeek-V4-Flash-0731 |
| Expert | `expert` | `deepseek-v4-pro` | DeepSeek-V4-Pro-0813 |

Суффиксы: `-thinking`, `-search`, `-thinking-search`. Старые имена (`deepseek-chat`, `deepseek-r1`, `deepseek-expert`, vision) удалены — неизвестный ID даёт `400`.

Список: `GET /v1/models`.
