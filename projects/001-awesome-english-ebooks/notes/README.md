# 核验记录与来源

[返回项目研究](../README.md) · [来源与处理详解](./source-processing.md) · [EPUB 样本核验](./epub-inspection.json)

## 核验范围

- 日期：2026-09-05。
- 环境：Windows、PowerShell、GitHub 网页与公开 REST API。
- 固定版本：`56973cddd86ed77aaa2d489ba4d20bd8ad54914b`。
- 方法：阅读根 README、完整文件树、近期提交、具体期次说明、音频 JSON、Wiki、CSS 和忽略规则。
- 首轮核验仓库静态资料；后续补充四本 EPUB 的结构审计与研究网页。以下保留仓库观察，样本方法见来源与处理详解。

## 观察记录

| 检查项 | 结果 | 可支持的结论 |
| --- | --- | --- |
| 完整文件树 | 977 个条目，`truncated: false` | 本轮枚举未被 API 截断 |
| 文件扩展名 | EPUB 211、MOBI 177、PDF 180、Markdown 188、JSON 15、CSS 1、TTF 3，另有 .gitignore 1 | 主要交付物是电子书及导航资料，数量不等于独立期数 |
| 根目录 | 四个主要刊物目录 | 当前覆盖范围与简介提及的全部刊物并不完全一致 |
| 当前 commit | 消息为 `the new yorker 2026.09.07`；提交于 2026-09-04 21:45:45 UTC，即北京时间 2026-09-05 05:45:45 | 期号日期与提交时间需要分开记录 |
| 经济学人 2026-09-05 期 | README 与 EPUB、MOBI、PDF 文件均在树中 | 该期有三种格式的文件入口 |
| 大西洋月刊 2026-09-02 期 | EPUB、PDF 与 README | 多格式能力不意味着每期都包含 MOBI |
| 连线 2026-09-02 期 | EPUB 与 README | 不能宣称所有期次均有 PDF |
| 音频 JSON 样例 | 文章标题与外部 MP3 URL，无句子时间戳 | 可作为音频关联入口，不能直接承担句子同步 |
| 音频 Wiki | 经济学人目录指向 2024 年音频页 | 历史音频入口不证明最新期次有对应音频 |
| 生产脚本 | 当前树无 Python、Shell、recipe 或 GitHub Actions 工作流文件 | 无法依靠当前公开内容复现完整生产链 |
| 许可 | 树中未见 LICENSE；核验时仓库元数据 `license: null` | 本轮没有确认相应复用授权 |

扩展名计数只统计 `type: blob` 的条目，目录也包含在 977 个总条目中。这不是历史上所有版本的累计统计。

## 复核方法

可在 PowerShell 中只读取公开元数据，避免为检查目录下载整库电子书：

```powershell
$researchCommit = '56973cddd86ed77aaa2d489ba4d20bd8ad54914b'
$researchApi = 'https://api.github.com/repos/hehonghui/awesome-english-ebooks'
$researchTree = Invoke-RestMethod "$researchApi/git/trees/${researchCommit}?recursive=1"
$researchTree | Select-Object sha, truncated
$researchTree.tree.Count
$researchTree.tree |
    Where-Object type -eq 'blob' |
    Group-Object { [IO.Path]::GetExtension($_.path) } |
    Select-Object Name, Count
```

固定 commit 保证目录统计可复核；仓库元数据、默认分支和 Wiki 会继续变化，未来复核时应另记日期。API 限流或上游不可访问时，应记录失败，不能把失败视为资源不存在。

## 事实、推测与建议的分界

- **事实：** GitHub 托管电子书；README 指向 Raw 文件；样例音频 JSON 使用 `article`、`url`；CSS 控制图片；忽略规则包含生产脚本扩展名。
- **新增事实：** Atlantic、WIRED 样本含 Calibre 元数据；完整自动化方式和内容获取渠道仍未知，详见 EPUB 样本核验。
- **建议：** 文章结构化、精读助手、检索和学习闭环均为我们提出的扩展方向，未实现、未部署。

## 未验证事项

- 已对四本 EPUB 读取包结构、spine 与链接；未逐本评估整个资源库的排版、正文完整性与设备兼容性。
- 未逐条播放音频或检查所有下载链接。
- 未复现采集、转换、更新调度或外部阅读器功能。
- 未将外刊内容作为模型训练集，未确认相应授权。
- 未开展用户学习效果实验。

## 证据入口

固定版本的 README、完整文件树、具体期次、音频 JSON、CSS 和忽略规则均在[项目研究](../README.md)对应结论旁链接。其他核验入口如下：

- [研究 commit](https://github.com/hehonghui/awesome-english-ebooks/commit/56973cddd86ed77aaa2d489ba4d20bd8ad54914b)：版本、提交消息与时间。
- [2024 年音频 Wiki](https://github.com/hehonghui/awesome-english-ebooks/wiki/te-audios-2024)：历史音频入口，按 2026-09-05 页面状态核验。
- [仓库元数据](https://api.github.com/repos/hehonghui/awesome-english-ebooks)：核验时未识别许可证；此接口不固定到 commit。
- [Calibre 官方文档](https://manual.calibre-ebook.com/news.html)：recipe 能力解释，不作为上游实际生产流程的证明。
