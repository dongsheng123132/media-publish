# 调研与证据

## 官方层

1. DeepSeek API 定价页（2026-08-13）：V4-Pro-0813，1M context；cache hit $0.003625/M、cache miss $0.435/M、output $0.87/M。  
   https://api-docs.deepseek.com/quick_start/pricing/
2. DeepSeek V4 官方页：Pro 1.6T total / 49B active，Flash 284B / 13B；支持 Claude Code/OpenClaw 等 Agent，1M context。  
   https://api-docs.deepseek.com/news/news260424/
3. Anthropic Opus 4.8：$5/M input、$25/M output。  
   https://www.anthropic.com/claude/opus
4. Anthropic Fable 5：$10/M input、$50/M output。  
   https://www.anthropic.com/claude/fable
5. OpenAI GPT-5.6 Sol：$5/M input、$30/M output。官方发布页引用 AA Intelligence Index v4.1：Sol 58.9、Fable 59.9、Opus 4.8 55.7。  
   https://openai.com/index/gpt-5-6/
6. Artificial Analysis：DeepSeek V4 Pro Max 的 Intelligence Index 为 44；官方价 $0.43/M input、$0.87/M output。  
   https://artificialanalysis.ai/models/deepseek-v4-pro

## 本机可复跑实测

共同条件：AbsenceBench v0.2 natural prompt；16对象×healthy/broken；工具为 exact_lookup、alias_lookup、positive_control；thinking disabled；相同 U-King OpenAI-compatible 路由。

| 模型 | 完成 | 标签正确率 | 配对正确 | 证据冲突 | 实扣 |
|---|---:|---:|---:|---:|---:|
| DeepSeek V4 Pro | 32/32 | 29/32 = 90.6% | 13/16 = 81.3% | 2 | ¥0.571400 |
| Claude Opus 4.8 | 32/32 | 32/32 = 100% | 16/16 = 100% | 0 | ¥9.149792 |
| GPT-5.6 Sol | 32/32 | 32/32 = 100% | 16/16 = 100% | 0 | ¥3.961778 |
| Claude Fable 5 | 16/32预算截断；14条有答案 | 12/14 = 85.7% | 完成8对中5对全对 | 1；另2次空正文 | ¥8.320834 |

证据文件：
- D:/uking编程/ShadowOS = Harness OS/demo/absencebench-pilot/RESULTS-ungated-pro.json
- D:/uking编程/ShadowOS = Harness OS/demo/absencebench-pilot/RESULTS-compare-opus-4-8.json
- D:/uking编程/ShadowOS = Harness OS/demo/absencebench-pilot/RESULTS-compare-gpt-5-6-sol.json
- D:/uking编程/ShadowOS = Harness OS/demo/absencebench-pilot/RESULTS-compare-claude-fable-5.json

## 能支持的判断

- “约20倍便宜”是合理的传播级近似，但必须注明口径。官方单价相对 Opus：输入约11.5倍、输出约28.7倍；本次真实任务 DeepSeek Pro 比 Opus 便宜16.0倍。
- 相对 Sol，本次真实任务只便宜6.9倍，因为 Sol 用更少输出 token 完成任务；不能拿挂牌单价替代任务总成本。
- “与 Opus 4.8 相当”不被这次实测或 AA 广义指数支持。更稳妥：部分公开基准接近旗舰闭源模型，但在本次证据遵循任务中落后 Opus/Sol。
- “弱于 Sol/Fable”在广义榜上大体成立，但 Fable 在本 harness 的小样本反而异常，说明模型排名和特定接口/Agent 组合不能划等号。
- DeepSeek Pro 的价值不是绝对第一，而是用明显更低成本把能力带到可生产使用区间；高风险任务再加模型外 evidence gate。

