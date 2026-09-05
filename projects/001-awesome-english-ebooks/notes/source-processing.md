# 来源、获取与处理逻辑

[返回项目研究](../README.md) · [结构核验 JSON](./epub-inspection.json) · [完整架构图](../assets/architecture.svg)

## 研究重点

这个库的价值首先在于提供可持续查找的外刊来源和文件入口。获取后的关键工作是把整期文件转成可追溯、可检索、可用于学习的文章数据。不能只列下载格式，也不能把尚未公开的采集程序补写成事实。

本次固定上游 commit 为 `56973cddd86ed77aaa2d489ba4d20bd8ad54914b`，核验日期 2026-09-05。

## 来源目录

| 刊物 / 内容方向 | 出版方入口 | 固定版本文件数（EPUB / MOBI / PDF / 音频 JSON） | 仓库入口 |
| --- | --- | --- | --- |
| 经济学人 / 经济 · 商业 · 国际事务 | [The Economist](https://www.economist.com/) | 89 / 88 / 80 / 15 | [01_economist](https://github.com/hehonghui/awesome-english-ebooks/tree/56973cddd86ed77aaa2d489ba4d20bd8ad54914b/01_economist) |
| 纽约客 / 文化 · 报道 · 文学 | [The New Yorker](https://www.newyorker.com/) | 104 / 88 / 85 / 0 | [02_new_yorker](https://github.com/hehonghui/awesome-english-ebooks/tree/56973cddd86ed77aaa2d489ba4d20bd8ad54914b/02_new_yorker) |
| 大西洋月刊 / 社会 · 观点 · 长篇报道 | [The Atlantic](https://www.theatlantic.com/) | 9 / 1 / 9 / 0 | [04_atlantic](https://github.com/hehonghui/awesome-english-ebooks/tree/56973cddd86ed77aaa2d489ba4d20bd8ad54914b/04_atlantic) |
| 连线 / 科技 · 科学 · 数字文化 | [WIRED](https://www.wired.com/) | 9 / 0 / 6 / 0 | [05_wired](https://github.com/hehonghui/awesome-english-ebooks/tree/56973cddd86ed77aaa2d489ba4d20bd8ad54914b/05_wired) |

这些是当前固定版本文件数，不是独立期次总数。官网身份与样本内的出版方域名链接可互相参照，但未确认维护者实际通过何种账号、API、RSS 或网页获取内容。本次经济学人官网请求返回 402；这不影响对已下载样本结构的核验，也不能据此猜测上游获取方式。

### 来源数量的补充核验（2026-09-05）

“四个来源”仅指当前固定版本中有电子书文件的四个刊物目录，并非所有英文媒体，也不代表项目历史上只提到四种刊物。

| 分类 | 刊物 | 证据与边界 |
| --- | --- | --- |
| 当前有文件 | 经济学人、纽约客、大西洋月刊、连线 | 完整文件树和四本 EPUB 样本已核验 |
| 历史明确提及 | 卫报 The Guardian | [2024-07-19 README](https://github.com/hehonghui/awesome-english-ebooks/blob/3fa67a79b45d8f07eb419ab999ac12d20d3f4722/README.md) 列出 `09_guardian/`，写明每周两期；当前简介仍提到卫报，但当前树没有该目录 |
| 待核实线索 | Nature | 忽略规则有 `03_nature/`；[Nature 2025.11.29 提交](https://github.com/hehonghui/awesome-english-ebooks/commit/76408cc0e6b60667762d26871a9927250ea43a04) 实际仅新增经济学人和纽约客文件，不能作为 Nature 已收录的证据 |

本次还检查了当前唯一分支 master、可见提交历史中的相关消息、初始 README 和上述提交的实际文件变更。没有对所有历史版本逐个遍历文件树，因此不宣称这是全部历史来源清单。历史文档中的下载入口也未验证当前可用。

这套处理思路还可扩展到其他官网内容、授权 RSS 或用户导入文件，但每个来源都需要适配和验证，不能直接计入上游现有能力。

### 四类来源关系

| 关系 | 记录方式 | 不能混淆的概念 |
| --- | --- | --- |
| 内容发布者 | 刊物名称、官网域名 | 出版方官网不等于可用的全文采集接口 |
| 文件分发者 | GitHub 仓库、commit、文件路径、Raw URL、blob SHA | 分发仓库不等于原始版权方 |
| 文章原始地址 | 逐篇核验的 canonical URL、标题、文章 byline | 不能把第一个外链或包级 creator 当成原文和作者 |
| 音频 / 引用 / 推广链接 | URL 类型、关联文章、匹配置信度和状态 | 出现在 EPUB 中的域名不一定是采集来源 |

历史经济学人 JSON 的 `article` 与 `url` 将标题关联到 economist.com 的 MP3；[Wiki](https://github.com/hehonghui/awesome-english-ebooks/wiki/te-audios-2024)补充历史音频入口。当前文件树没有卫报目录。样本中也有零售、引用和推广链接，不能把它们合并成“内容来源列表”。

## 上游生产：已知与未知

已确认目录、电子书文件和 README 的 Raw 下载链接。Atlantic、WIRED 样本明确包含 Calibre 元数据；经济学人、纽约客样本的包级 creator 为 Kovid Goyal。这是包元数据观察，不是文章作者归属判断。

`.gitignore` 排除了 recipe、Python、Shell 文件，完整文件树没有生产脚本。采集渠道、认证、具体 recipe、调度和转换顺序仍未知。Calibre 官方的新闻获取及转换机制只能作为实现参考。

## 获取后的七步处理

下文是建议的下游处理设计。已实现的本地工具只覆盖 EPUB 结构审计，不具备完整采集、清洗、检索或学习功能。

### 1. 登记来源与版本

- 输入：GitHub 文件树 / 用户导入文件。
- 输出：source-manifest.json。

固定 commit，按刊物与期次枚举文件；分别保存发布者域名、仓库路径、原文候选 URL、blob SHA、获取时间和使用范围。

质量检查：检查 API truncated 字段；清单路径和版本能够回溯，未知原文 URL 保持 null。

失败处理：分页或目录遍历不完整时停止增量更新，记录缺失项。

样本启示：官网、文件分发地址、文章原文和普通外链是四种不同关系。

### 2. 按需获取与校验

- 输入：版本化文件清单。
- 输出：原始文件 + SHA-256 + 状态记录。

按需要选择期次和格式，优先 EPUB；使用固定 commit 的 Raw 地址获取，按 blob SHA 判断变化，以 SHA-256 记录实际字节。原件与派生产物分开保存。

质量检查：验证响应、文件签名和大小；散列用于身份与变化检测，不代表已证明内容真实性。

失败处理：下载至临时文件，成功后再入库；超时有限重试，失败保留状态，避免半文件进入处理。

样本启示：同一期多种格式是不同文件，不能只按文件名去重或合计成独立期数。

### 3. 识别格式与读取顺序

- 输入：EPUB / PDF / MOBI。
- 输出：有序文档节点 + 资源映射。

EPUB 从 META-INF/container.xml 定位 OPF，再读 manifest、spine 与 nav/NCX；PDF 需保留页码并判断是否需要 OCR；MOBI 可经转换处理，同时保留转换版本。

质量检查：所有 spine 引用能解析；路径、编码和图片引用有效；不按 ZIP 文件名排序冒充阅读顺序。

失败处理：不可解析的文件隔离，保留错误定位；OCR 和转换结果单独标注来源。

样本启示：四个样本的 OPF 有两种位置；spine 数量 102 / 32 / 22 / 61，不等于文章数。 WIRED 样本有 8 个文档未通过严格 XML 解析，需记录告警并设计容错。

### 4. 清洗并拆分文章

- 输入：有序 XHTML / 页面内容。
- 输出：文章、段落、图片与原文锚点。

结合目录、标题层级和正文边界识别文章；移除导航、重复页眉和推广块；正文引文与图注保留。识别文章 byline，区分原文候选地址、引用和推广外链。

质量检查：对照目录抽查首尾段落、标题、作者与阅读顺序；记录被移除区域以便复核。

失败处理：来源或作者不明确时标记待核验，不从首个外链或包级 creator 猜测。

样本启示：样本 creator 出现 Kovid Goyal 或 calibre；文章作者必须在文章层面另行提取。

### 5. 规范化与去重

- 输入：拆分文章与来源记录。
- 输出：publication → issue → article → block。

为文章与段落生成稳定标识；分开记录期号日期、文章发布日期、获取时间与处理版本。优先用核验后的 canonical URL 去重，再结合正文散列检测重复和修订。

质量检查：每条内容都能回到 commit、文件、内部路径与锚点；同一文章的不同版本不被误删。

失败处理：标题相似但来源不同的文章保留；字段冲突进入人工复核列表。

样本启示：最重要的派生产物是可回溯的文章数据，而不仅是转换后的另一种电子书。

### 6. 关联音频与建立索引

- 输入：文章数据 + 可用音频索引。
- 输出：全文索引 / 可选向量索引 / 音频关联。

按刊物、期次、标题候选匹配 audio JSON，并保存匹配置信度；全文索引先支持标题、日期与正文。向量分块保留 articleId、blockId 和来源。

质量检查：音频地址可用性与匹配关系分别检查；检索结果可定位原文；全文引用不脱离上下文。

失败处理：无音频时允许纯阅读；低置信度不强行绑定，失效索引可从结构化数据重建。

样本启示：历史 JSON 只有 article 与 url，句子同步还需要额外的音文对齐步骤。

### 7. 交付阅读与学习能力

- 输入：结构化内容与可回溯检索。
- 输出：阅读器 / 精读 / 专题问答 / 学习记录。

提供原文阅读、选句解释、笔记和生词；问答展示引用；学习记录与原文分开存储。内容修订时按稳定标识迁移或提示笔记定位变化。

质量检查：解释对应选句、引用跳转正确、学习记录可恢复；公开展示内容符合样本使用范围。

失败处理：模型不可用时保留基本阅读与检索；生成内容和原文明确区分。

样本启示：当前网页是研究导航与流程说明；完整学习系统属于后续扩展。

## 四本 EPUB 的实际结构核验

在本地临时目录按固定 commit 各下载一个样本，读取 ZIP、container.xml、OPF、spine 和超链接，并计算 SHA-256。电子书原件不进入 Git 或 Pages 产物；公开的 JSON 仅记录元数据、结构和域名计数。

| 样本 | OPF | spine / 已解析引用 | 出版方域名链接 | 严格 XML 告警 |
| --- | --- | --- | --- | --- |
| 经济学人 | `EPUB/content.opf` | 102 / 102 | 181 | 0 |
| 纽约客 | `EPUB/content.opf` | 32 / 32 | 21 | 0 |
| 大西洋月刊 | `content.opf` | 22 / 22 | 86 | 0 |
| 连线 | `content.opf` | 61 / 61 | 777 | 8 |

spine 包含目录、封面或其他辅助页，数量不等于文章数。超链接数量包含重复、导航和引用，不等于独立来源数。WIRED 的 8 个 XHTML 文档未通过严格 XML 解析；审计工具保留文件级告警，并以 Python HTMLParser 统计链接。这个容错仅用于链接审计，不代表正文拆分已验证。

### 复核命令

Python 3.10+，仅标准库，不需安装依赖。在本子项目目录执行：

```sh
python tools/inspect_epub.py /path/to/local-sample.epub --output /path/to/report.json
```

样本固定路径、字节数和完整 SHA-256 见 [epub-inspection.json](./epub-inspection.json)。工具从 container.xml 定位 OPF 并验证 spine 引用，不解压写出正文，也不执行电子书脚本。它不是 EPUB 标准完整验证器。

## 验收与后续顺序

优先实现来源清单、EPUB 文章拆分与原文定位，再加入全文搜索和精读。每一步用样本检查标题、作者、首尾段落、顺序、来源和笔记回跳。PDF / MOBI 转换、音频可用性、逐句对齐与实际学习效果均需另行验证。

## 参考

- [EPUB 3.3](https://www.w3.org/TR/epub-33/)：包结构、manifest、spine 与导航规范。
- [Calibre 新闻获取](https://manual.calibre-ebook.com/news.html)：recipe 的工具能力。
- [Calibre 转换说明](https://manual.calibre-ebook.com/conversion.html)：转换过程参考。
- [GitHub Trees API](https://docs.github.com/en/rest/git/trees)：版本化清单与 truncated 边界。
