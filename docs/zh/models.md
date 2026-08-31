# 模型

对照：[DeepSeek API 文档](https://api-docs.deepseek.com/zh-cn/)、[定价](https://api-docs.deepseek.com/zh-cn/quick_start/pricing)、[V4-Pro GA](https://api-docs.deepseek.com/news/news260813/)（2026-08-31）。

本代理走 **DeepSeek Web**，不是付费 `api.deepseek.com`。

| 界面 | `model_type` | ID | 权重 |
|---|---|---|---|
| Instant | `default` | `deepseek-v4-flash` | DeepSeek-V4-Flash-0731 |
| Expert | `expert` | `deepseek-v4-pro` | DeepSeek-V4-Pro-0813 |

后缀：`-thinking`、`-search`、`-thinking-search`。旧名（`deepseek-chat`、`deepseek-r1`、`deepseek-expert`、vision）已删除，未知 ID 返回 `400`。

列表：`GET /v1/models`。
