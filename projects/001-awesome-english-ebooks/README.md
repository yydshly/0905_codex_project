# 001 · 英语外刊资源库能力研究

> awesome-english-ebooks 将英语外刊按刊物和期次整理为可下载的电子书。主要价值在来源目录与文件交付；当前公开内容不足以复现完整的采集和转换流程。

[在线研究网页](https://yydshly.github.io/0905_codex_project/projects/001-awesome-english-ebooks/) · [返回总索引](../../README.md#项目索引) · [上游项目](https://github.com/hehonghui/awesome-english-ebooks) · [核验记录与来源](./notes/README.md) · [网页构建与部署](./web/README.md) · [来源与处理详解](./notes/source-processing.md)

## 研究概览

| 项目 | 内容 |
| --- | --- |
| 研究目标 | 梳理现有能力、底层机制、使用场景、扩展方向及对本研究仓库的意义 |
| 研究日期 | 2026-09-05 |
| 上游版本 | [56973cddd86ed77aaa2d489ba4d20bd8ad54914b](https://github.com/hehonghui/awesome-english-ebooks/commit/56973cddd86ed77aaa2d489ba4d20bd8ad54914b) |
| 公开组成 | Git 目录、Markdown、EPUB / MOBI / PDF、音频 JSON、CSS 和字体 |
| 研究环境 | Windows、PowerShell、GitHub 网页及 REST API；本仓库管理使用 Node.js 22+ |
| 上游许可证 | 本次未发现 LICENSE，GitHub 元数据的 license 为 null；未确认资源的再分发或训练授权 |
| 本轮状态 | 研究网页与完整架构已发布到 GitHub Pages，四本 EPUB 已做结构审计；完整内容处理与学习系统为后续建议 |

索引资料维护在 [project.json](./project.json)。下文区分已核实事实、实现推测和本仓库建议，不把推荐阅读器的功能记为上游能力。

## 来源与完整架构导读

本项目重点是外刊来源与获取后的处理逻辑。建议先看[来源目录与七步处理](./notes/source-processing.md)，再结合下图理解整个系统。

[![英语外刊完整架构：来源、上游生产边界、公开资源、获取、处理及阅读学习；绿色为事实、橙色为未知、蓝色为建议](./assets/architecture.svg)](./assets/architecture.svg)

这是一张研究架构示意图，不是上游系统截图；点击可查看原尺寸。网页支持来源筛选和处理步骤切换，构建方法见 [web/README.md](./web/README.md)。

## 已有能力与边界

| 能力 | 已核实的表现 | 边界 |
| --- | --- | --- |
| 外刊归集 | 当前主要目录为经济学人、纽约客、大西洋月刊、连线 | 简介提到卫报，但本次文件树未见对应目录 |
| 按期归档 | 按刊物、日期组织，部分往期另设年份目录 | 尚非统一的文章级目录或检索数据库 |
| 多格式交付 | 当前版本有 211 个 EPUB、177 个 MOBI、180 个 PDF | 这是文件数，不是不同期次总数；各期格式并非全部齐全 |
| 持续更新 | 已有经济学人 2026-09-05 期、纽约客 2026-09-07 期 | 期号日期不等于上传日期；更新安排不构成持续可用保证 |
| 音频入口 | 部分历史期次提供文章标题与 MP3 地址的 JSON；Wiki 提供历史音频链接 | 未逐条验证音频可播放，不能推断每期都有音频 |
| 阅读器衔接 | README 提供下载入口和阅读器推荐 | 查词、翻译、AI 语法分析等介绍属于外部 App，仓库未提供对应实现 |

依据为固定版本的[完整文件树][tree]和[首页 README][upstream-readme]。当前未见全文搜索、学习进度、生词复习、AI 问答、应用后端或完整构建流程。

## 底层机制

### 可验证的交付流程

```mermaid
flowchart LR
    A[已整理的电子书文件] --> B[按刊物和日期存入 Git]
    B --> C[README 分类与下载链接]
    C --> D[GitHub 文件交付]
    D --> E[用户导入外部阅读器]
    F[历史音频 JSON / Wiki] --> G[外部音频地址]
```

此图是根据仓库结构绘制的流程示意，不是上游应用截图。目录提供分类，Markdown 提供导航，Git 记录版本，GitHub 托管文件。[具体期次 README][issue]中的下载链接指向 GitHub Raw 文件。

[音频 JSON 样例][audio]使用 `article` 和 `url` 关联文章标题与外部 MP3。样例没有句子时间戳，不能直接支持逐句同步或跟读对齐。

### 未公开的生产流程

[calibre_img.css][css]仅控制图片尺寸与边距；[.gitignore][ignore]排除了 `*.recipe`、`*.py`、`*.sh` 等文件，当前完整文件树也没有这些生产脚本。

后续抽查确认 Atlantic 与 WIRED 样本含 Calibre 打包元数据，详见[样本记录](./notes/epub-inspection.json)。具体外部脚本、采集来源、转换顺序、认证方式和定时任务仍未公开。Calibre 官方确实提供[获取新闻并生成电子书的 recipe 机制](https://manual.calibre-ebook.com/news.html)，这是可参考的实现路线，不是上游已公开的生产实现。

## 使用场景

| 场景 | 可利用的内容 | 需要另外补充 |
| --- | --- | --- |
| 个人离线阅读 | 按期下载电子书，导入支持该格式的阅读器 | 阅读器及个人书库管理 |
| 英语精读与阅读训练 | 选取文章，积累表达、长句和论证方法 | 难度选择、查词、解释、笔记 |
| 听力与复述 | 对有可用音频的文章进行听读练习 | 链接验证、播放器、音文对齐 |
| 专题阅读研究 | 比较同一主题在不同时期的文章 | 文章拆分、检索、日期和来源定位 |
| 文档处理实验 | 研究电子书目录、段落和阅读界面 | 授权明确的测试样本、解析程序和验证 |

仓库提供材料入口，选文、理解、练习和复习仍需要额外工具。本轮额外验证了四本 EPUB 的包结构和 spine 引用；完整排版、文章拆分质量及阅读器兼容性仍未验证。

## 可扩展方向

下列能力均为后续建议，当前尚未实现。

| 方向 | 可新增能力 | 关键难点 | 建议顺序 |
| --- | --- | --- | --- |
| 文章结构化 | 提取目录，保留刊物、期次、标题和段落定位 | 适应不同格式与目录结构 | 优先 |
| 精读界面 | 段落阅读、选句解释、上下文释义、生词收藏 | 解释准确并能回到原句 | 优先 |
| 全文与专题检索 | 按关键词、主题和日期查找文章 | 索引质量、去重和来源保留 | 后续 |
| 学习闭环 | 理解题、复述练习、间隔复习 | 评估学习效果，避免只增加操作负担 | 后续 |
| 音文同步 | 逐句播放、高亮和跟读 | 获得可靠的时间对齐信息 | 后续 |
| 专题知识库 | 跨期比较、带引用的问答 | 时间过滤、检索质量与引用准确 | 后续 |
| 内容维护 | 新期检测、格式检查、缺失项标记 | 上游目录变化和外部链接可用性 | 按需 |

建议数据层级为“刊物 → 期次 → 文章 → 段落 → 句子”，将解释、笔记、生词和音频位置关联到相应层级，使阅读、检索与学习共用内容结构。

## 对本研究仓库的意义

1. **内容组织案例。** 明确的收录范围、按期更新和多格式交付减少了寻找与使用材料的步骤，可以借鉴其导航和交付方式。
2. **阅读产品实验入口。** 可优先验证“用户导入 EPUB 的英语精读助手”：导入文件、提取目录、段落阅读、选句解释、生词收藏和原文定位。该实验不依赖上游未公开的采集程序。
3. **通用能力积累。** 解析、来源定位、检索、解释与笔记能力可以迁移到技术文档、论文和行业报告。
4. **研究投入边界。** 本项目适合研究资源组织与阅读体验；若目标是采集或电子书转换源码复现，应寻找公开了完整流程的其他项目。

后续原型可用“目录是否完整、阅读顺序是否正确、解释是否对应选句、笔记能否回到原文”作为验收点。公开演示优先使用授权明确的样本；用户导入内容的处理与展示范围需要按实际来源确定。

## 本地阅读与验证

本子项目包含研究文档、无第三方前端依赖的静态网页，以及仅用 Python 标准库的 EPUB 结构审计工具。网页构建与本地预览命令见 [web/README.md](./web/README.md)；样本复核方法见[来源与处理详解](./notes/source-processing.md)。

在总仓库根目录运行：

```sh
node scripts/projects.mjs sync
node scripts/projects.mjs check
```

实际核验方法、观察结果及未验证事项见[研究笔记](./notes/README.md)。上游电子书仅在被 Git 忽略的本地临时目录用于结构审计；公开产物仅含研究内容、架构图和元数据。截图与部署验证结果在网页说明中记录。

## 来源与许可

上游为 [hehonghui/awesome-english-ebooks](https://github.com/hehonghui/awesome-english-ebooks)，本轮源码路径均固定到研究 commit；Wiki 和外部工具文档按核验日期记录。本文是研究整理，不代表上游维护者对生产流程的说明。

本轮未发现上游许可证或明确的内容再分发、训练授权。公开可访问本身不足以作为相应授权依据。后续如引入代码或素材，应单独核实来源与许可，并保留必要信息。

[tree]: https://api.github.com/repos/hehonghui/awesome-english-ebooks/git/trees/56973cddd86ed77aaa2d489ba4d20bd8ad54914b?recursive=1
[upstream-readme]: https://github.com/hehonghui/awesome-english-ebooks/blob/56973cddd86ed77aaa2d489ba4d20bd8ad54914b/README.md
[issue]: https://github.com/hehonghui/awesome-english-ebooks/blob/56973cddd86ed77aaa2d489ba4d20bd8ad54914b/01_economist/te_2026.09.05/README.md
[audio]: https://github.com/hehonghui/awesome-english-ebooks/blob/56973cddd86ed77aaa2d489ba4d20bd8ad54914b/01_economist/2025/te_2025.01.04/TheEconomist.2025.01.04_audios.json
[css]: https://github.com/hehonghui/awesome-english-ebooks/blob/56973cddd86ed77aaa2d489ba4d20bd8ad54914b/calibre_img.css
[ignore]: https://github.com/hehonghui/awesome-english-ebooks/blob/56973cddd86ed77aaa2d489ba4d20bd8ad54914b/.gitignore
