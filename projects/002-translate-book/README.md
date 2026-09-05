# 002 · 长内容并行翻译架构研究

> translate-book 将长内容按结构与长度分块，交给多个 AI 子代理翻译，再通过共享术语、状态记录和校验合并成书。翻译能力来自大模型；项目的主要价值是组织长任务的工程流程。

[返回总索引](../../README.md#项目索引) · [上游仓库](https://github.com/deusyu/translate-book) · [源码依据与核验记录](./notes/README.md)

## 先看架构：谁负责理解，谁负责流程

[![translate-book 架构示意：脚本转换分块、主代理规划、子代理并行翻译、术语反馈与状态记录、校验合并导出；底部标明能力边界和下游建议](./assets/architecture.png)](./assets/architecture.png)

本图根据固定版本源码绘制，**不是运行截图或翻译效果证明**。蓝色表示脚本与转换工具，绿色表示 AI 语义任务，橙色表示共享记录，虚线区域表示我们的扩展建议。点击图片查看原尺寸；另提供[可缩放 SVG](./assets/architecture.svg)和[图稿重建方法](./assets/README.md)。

按图从上到下阅读：**转换分块 → 规划与翻译 → 反馈和记录 → 校验交付**。术语反馈影响后续批次；已有译文是否重译，由后续规划判断，不代表同一次运行会自动修订到全书术语完全一致。

## 研究定位与结论

| 项目 | 内容 |
| --- | --- |
| 研究目标 | 理解架构、能力边界及可复用的任务组织方法 |
| 研究日期 | 2026-09-05 |
| 上游版本 | [5d07e733fa9318ff9c718085191c0c2243f51383](https://github.com/deusyu/translate-book/commit/5d07e733fa9318ff9c718085191c0c2243f51383)，提交日期 2026-08-06（UTC） |
| 项目形态 | 面向 Codex、Claude Code、OpenClaw 的 Agent Skill，配合 Python 脚本 |
| 主要依赖 | 支持相应编排能力的 AI 运行环境、Python、Calibre、Pandoc；实际可用并发由运行环境决定 |
| 上游许可证 | MIT；本项目未复制上游实现，仅整理源码依据并绘制架构图 |
| 本轮范围 | 已完成文档与源码架构梳理；未安装 Skill、未执行整本书翻译、未测评速度成本及译文质量 |
| 交付方式 | GitHub 文档与图片；本项目不创建或部署 Web 演示，demo 留空 |

**本轮到架构理解即可。** 对当前目标，继续逐函数复现或批量翻译的收益有限。后续有实际的长文翻译或英语精读需求时，再用小样本验证解析、对齐、质量与消耗。

## 01 · 转换与分块：把文件变成可分配的任务

输入 PDF、DOCX 或 EPUB，由 Calibre 转为 HTMLZ（包含 HTML 与资源的压缩包），解包后经 Pandoc 转为 Markdown，再形成 `chunk0001.md` 等源文块。

- 默认目标约 **6,000 字符**，不是 token，也不是每块固定长度。
- 程序识别标题、段落、列表、表格、代码块等结构，优先沿结构边界切分；特别大的结构可能强制拆开。
- 这是结构与长度驱动的切分，不代表先由 AI 理解全书再按语义模块划分。
- `source_fingerprint.json` 关联原文件字节；`manifest.json` 记录块顺序、文件名和源文哈希，防止混用已变化的原文。

依据：[convert.py][convert]、[manifest.py][manifest]。

## 02 · 并行翻译：AI 负责语义，主代理负责协调

| 分工 | 实际工作 |
| --- | --- |
| Python 与转换工具 | 转格式、切块、统计词频、计算哈希、校验文件、合并导出 |
| 主 AI 代理 | 根据 Skill 执行流程，建立初始术语表，分配任务，判断术语与别名冲突 |
| 翻译子代理 | 每个处理一个源文块，生成译文及实体、别名、冲突等观察记录 |

上游默认每批并发 8 个子代理，每块使用独立上下文。它没有自带新训练的翻译模型，也不是仅运行 Python 就能自动获得完整译文的独立服务。

每个子代理收到：**当前源文块、相关与全书高频术语、前后块各约 300 字符的只读片段**。邻近片段辅助指代判断，不应重复翻译到输出中。并行可以减少等待，但不保证八倍加速，也不自动减少总模型消耗。

依据：[SKILL.md][skill]、[glossary.py][glossary]、[chunk_context.py][context]。

## 03 · 共享术语与状态：让长任务可恢复、可修订

| 文件 | 职责 | 写入方式 |
| --- | --- | --- |
| `glossary.json` | 人名、地名、专业词汇、别名等统一约定 | 主代理通过脚本统一更新 |
| `output_chunkNNNN.meta.json` | 当前块发现的实体、证据和冲突 | 子代理分别写自己的文件 |
| `run_state.json` | 每块源文、译文及使用术语的哈希等记录 | 主代理通过脚本统一更新 |

初始术语来自首尾和中间若干块的抽样。每批完成后，先记录该批使用的状态，再合并观察、处理冲突并更新术语表，使后续批次获得更完整的信息。共享文件集中写入，避免多个翻译者同时修改约定。

后续运行时，规划器比较源文、输出和术语状态，只安排需要处理的块。例如修正人名后，可识别相关块进行重译。由于全书高频术语也会注入多个块，重译范围可能大于直接出现该词的块。

**这不是全面的版本依赖管理。** 当前重译规划主要跟踪源文和术语；不能假定切换模型、翻译风格或目标语言后也会正确使所有缓存失效。改动这些条件应明确规划新的运行目录和产物。

依据：[run_state.py][state]、[meta.py][meta]、[merge_meta.py][merge-meta]。

## 04 · 校验与交付：检查流程完整，不证明译文准确

合并前检查源文与输出是否对应、源文哈希是否变化、输出是否为空或不可读，以及图片引用是否丢失或新增损坏。通过后合并为 Markdown，生成带目录的 HTML，并由 Calibre 输出 DOCX、EPUB、PDF。

| 容易误解的表述 | 准确边界 |
| --- | --- |
| “支持 PDF” | 有 PDF 转换入口；未见专门 OCR 流程，扫描件及复杂分栏需另行验证 |
| “保留格式” | 尽量保留内容结构与图片引用；经 Markdown 重建排版，不保证原书版式复刻 |
| “翻译图片” | 保留图片与引用，不代表识别并翻译图片内部文字 |
| “完整性校验” | 检查文件、源文与图片结构；不能证明没有漏译、误译或语气偏差 |
| “术语一致” | 约束与反馈缓解漂移；仍受模型遵循程度和有限上下文影响 |
| “断点续跑” | 依赖过程文件。Skill 默认成功构建后清理源文块和译文块；持续修订应明确保留中间文件 |

依据：[manifest.py][manifest]、[merge_and_build.py][build]、[工作流定义][skill]。本轮未执行翻译，不能将代码中的校验措施写成已经通过真实书籍质量验收。

## 对我们的意义：补上内容处理环节

与 [001 · 英语外刊资源库能力研究](../001-awesome-english-ebooks/README.md) 相比，该项目提供获取材料之后的处理流程：

**外刊／电子书来源 → 文档解析 → 分块翻译 → 双语精读 → 笔记与复习**

来源研究已有独立记录；中间的翻译流程是本次上游提供的架构；双语对齐、精读和学习是我们的后续建议，当前未在本项目实现。

值得带走的设计有三项：

1. **AI 与确定性脚本分工。** 模型处理翻译与语义冲突，程序处理文件、状态和规则检查。
2. **独立任务配合共享约定。** 每块独立处理，以术语表和少量邻近文本缓解上下文割裂。
3. **过程留存与局部重做。** 记录输入和约定，让长任务可续跑、可追踪、可修订。

适用方向是外文书阅读译稿、技术手册和长报告整理。正式出版需要额外审校；英语学习还需要原文定位与对照，不能只交付一本纯译文。

## 后续扩展：有实际需求时再验证

| 顺序 | 建议 | 验收重点 |
| --- | --- | --- |
| 优先 | 稳定段落 ID 与双语对齐 | 译文、纠错和笔记能回到原文 |
| 优先 | 语义质量抽查与规则检查 | 漏段、数字单位变化、术语偏离、未翻译残留 |
| 随后 | 完整运行配置与消耗记录 | 模型／语言／提示词变化可追踪，耗时与调用消耗可评估 |
| 按需 | 章节摘要、OCR、阅读学习界面 | 在真实失败样本或产品需求出现后补充 |

如要继续，先选授权明确的一篇文章或短篇 EPUB，验证“导入 → 翻译 → 双语对照 → 修改术语后局部重译”。本轮不增加这些实现。

## 本地维护与来源

本项目没有 Web 应用，也不需要安装上游翻译依赖。图片可用 [tools/draw_architecture.py](./tools/draw_architecture.py) 重建；维护文档或图片后，在总仓库运行：

```sh
node scripts/projects.mjs sync
node scripts/projects.mjs check
```

源码链接固定到研究 commit，核验范围见[研究笔记](./notes/README.md)。上游采用 [MIT 许可证][license]；文档与示意图为自行整理，未复制上游书籍、海报或实现。软件许可不代表输入书籍的使用授权。

[convert]: https://github.com/deusyu/translate-book/blob/5d07e733fa9318ff9c718085191c0c2243f51383/scripts/convert.py
[manifest]: https://github.com/deusyu/translate-book/blob/5d07e733fa9318ff9c718085191c0c2243f51383/scripts/manifest.py
[skill]: https://github.com/deusyu/translate-book/blob/5d07e733fa9318ff9c718085191c0c2243f51383/SKILL.md
[glossary]: https://github.com/deusyu/translate-book/blob/5d07e733fa9318ff9c718085191c0c2243f51383/scripts/glossary.py
[context]: https://github.com/deusyu/translate-book/blob/5d07e733fa9318ff9c718085191c0c2243f51383/scripts/chunk_context.py
[state]: https://github.com/deusyu/translate-book/blob/5d07e733fa9318ff9c718085191c0c2243f51383/scripts/run_state.py
[meta]: https://github.com/deusyu/translate-book/blob/5d07e733fa9318ff9c718085191c0c2243f51383/scripts/meta.py
[merge-meta]: https://github.com/deusyu/translate-book/blob/5d07e733fa9318ff9c718085191c0c2243f51383/scripts/merge_meta.py
[build]: https://github.com/deusyu/translate-book/blob/5d07e733fa9318ff9c718085191c0c2243f51383/scripts/merge_and_build.py
[license]: https://github.com/deusyu/translate-book/blob/5d07e733fa9318ff9c718085191c0c2243f51383/LICENSE
