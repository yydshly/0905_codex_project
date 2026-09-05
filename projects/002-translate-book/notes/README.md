# 架构核验记录

[返回项目介绍](../README.md)

## 版本与方法

- 日期：2026-09-05。
- 上游：[deusyu/translate-book](https://github.com/deusyu/translate-book)。
- 固定版本：`5d07e733fa9318ff9c718085191c0c2243f51383`；GitHub API 返回提交日期 `2026-08-06T09:14:00Z`，本次复核仍为 main HEAD。
- 方法：阅读 README、SKILL.md、核心 Python 文件、文件树与 CI 配置，并与 001 项目的定位对照。
- 本地环境：Windows、PowerShell、Node.js 22.15.0；图稿使用 Python 3.10、Pillow 11.3.0 与 Microsoft YaHei。
- 范围：文档与源码架构核验，未安装或执行上游 Skill，未运行上游测试、真实翻译或格式转换，不给出质量、兼容性、吞吐或成本结论。

## 结论与源码对应

以下路径相对于[固定版本文件树](https://github.com/deusyu/translate-book/tree/5d07e733fa9318ff9c718085191c0c2243f51383)，项目 README 提供直接链接。

| 核验结论 | 源码位置 | 解释边界 |
| --- | --- | --- |
| Skill 编排 | `SKILL.md` | 上游设计，并非本轮已经执行 |
| Calibre → HTMLZ → Markdown | `convert.py`：`convert_to_htmlz`、`convert_html_to_markdown` | 不保持原书页面坐标 |
| 结构与长度切分 | `parse_structural_blocks`、`merge_blocks_to_chunks` | 默认 6,000 字符；超过目标两倍的单个结构进入强制拆分 |
| 源文件身份校验 | `source_fingerprint`、`check_source_cache` | 校验源文件字节，不验证语义 |
| 清单与合并校验 | `manifest.py`：`create_manifest`、`validate_for_merge` | 有清单时验证源文哈希和输出；无清单有旧版合并兼容路径 |
| 初始术语与按块注入 | `SKILL.md` Step 3.5、`glossary.py` | 初始抽样可能遗漏术语；高频词注入扩大依赖范围 |
| 相邻上下文 | `chunk_context.py` | 前后片段只读，不代表完整章节上下文 |
| 反馈与术语合并 | `meta.py`、`merge_meta.py` | 主代理判断冲突；异常 meta 可警告并跳过 |
| 增量规划 | `run_state.py`：`plan`、`record_chunks` | 比较源文和选中术语；译文哈希改变可补记状态，不自动认定损坏 |
| 图片结构检查 | `merge_and_build.py`：`_validate_chunk_images` | 检查引用计数和新增损坏属性，不检查图片内部翻译或视觉布局 |
| 导出与清理 | `merge_and_build.py`、`calibre_html_publish.py`、`SKILL.md` Step 7 | 默认成功后清理块文件；持续修订应省略 `--cleanup` |
| 工程检查与许可 | `.github/workflows/ci.yml`、`LICENSE` | 配置为编译检查和 Python 单元测试；本轮未运行；MIT 许可 |

## 两个容易被架构图掩盖的细节

1. **反馈不自动保证全书收敛。** 先规划待翻译块，再按批次翻译和更新术语。后续信息可改善后面的批次；已有块的修订要由后续规划触发，不能画成无限循环直到全部正确。
2. **文件完整与翻译完整不同。** 缺失、空白、源文变化和图片引用异常可机器检查；正常大小的文件仍可能漏译某句话。因此图中使用“文件与结构校验”，不把哈希解释为语义质量保证。

## 本仓库交付核验

- 使用根目录 `node scripts/projects.mjs new` 新建 002 号项目。
- 根 README 索引和封面由 `node scripts/projects.mjs sync` 根据 `project.json` 生成。
- 图稿同时提供 PNG 与 SVG，PNG 用于 GitHub README；本地查看图片，检查中文、箭头和文本是否完整。
- 检查项目索引、相对文件链接、图片尺寸与 SVG XML 结构，执行 `git diff --check`。
- 本项目无 `web/publish.json`，demo 留空。总仓库既有 Pages 工作流会在 main 推送后重建已有页面，但不会纳入本项目，也未新增 Web 应用或演示地址。

## 后续研究的进入条件

只有在需要实际翻译或双语精读时继续：用结构清楚且授权明确的小样本测量段落覆盖、数字与术语一致性、图片保留、局部重译范围及耗时消耗。本轮不复制上游全套实现，不把未验证的学习功能记作已有能力。
