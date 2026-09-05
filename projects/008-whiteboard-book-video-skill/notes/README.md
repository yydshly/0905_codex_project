> 更新：本页包含早期源码研究记录。当前已完成 79 秒有声复现，见[项目入口](../README.md)、[制作记录](../production/small-steps/README.md)与[七类扩展场景](./use-cases.md)。

# 研究笔记

## 2026-09-06：从抽象原理转向具体用途

用户反馈原网页仍难理解，因此在技术章节前增加三个端到端内容样例：原创读书笔记 → 行动建议短片、002 研究摘要 → 翻译架构导读、原创问题反馈说明 → 新人培训。

每组包含原始文本、观众与目标、6 句改写口播、对应图形、编排理由和可下载 Markdown。网页提供 30 秒播放、逐镜选择与进度拖动。画面为代码绘制的内容草图，没有调用上游生图、配音、音乐或视频导出，不能当成上游成片质量验证。

区别于第一版泛化流程动画，新案例会实际显示“今晚两页”“术语记录”“预期结果”等材料中的概念，并把每句口播和具体画面关联起来。后续若验证成片，应从这些脚本中选一组接入模型服务并按真实配音重新定时。

本次验证：三个案例分别切换并选择第三镜，标题、口播和 00:10 时间对应；前后切镜、滑块终点、30 秒结束与重新播放状态正常。390px 手机选择口播后能滚动到画面，无横向溢出。下载改为构建期静态 Markdown，三份文件 HTTP 均为 200，避免依赖浏览器 Blob 下载行为。独立校验通过 14 项本地资源／锚点，全站校验通过 180 项。桌面与手机截图已更新，新增案例对照截图。仍未验证上游真实成片。

研究日期：2026-09-05。固定版本：`aac0295461f381c4a6052b28802221cfec7b28b9`，上游提交时间 2026-09-04 11:44:10 UTC。

## 源码依据

| 文件 | 支持的结论 |
| --- | --- |
| [README](https://github.com/nutllwhy/whiteboard-book-video-skill/blob/aac0295461f381c4a6052b28802221cfec7b28b9/README.md) | 目标视频、环境依赖、本地渲染与外部生成费用边界 |
| [SKILL.md](https://github.com/nutllwhy/whiteboard-book-video-skill/blob/aac0295461f381c4a6052b28802221cfec7b28b9/SKILL.md) | 工作流阶段、确认点、两种模式与默认参数 |
| [script-writing.md](https://github.com/nutllwhy/whiteboard-book-video-skill/blob/aac0295461f381c4a6052b28802221cfec7b28b9/references/script-writing.md) | 叙事结构、分镜表与配音长度驱动的时间安排 |
| [image-prompt.md](https://github.com/nutllwhy/whiteboard-book-video-skill/blob/aac0295461f381c4a6052b28802221cfec7b28b9/references/image-prompt.md) | 风格、参考图延展、留白、底部字幕空间与外部工具依赖 |
| [audio-voice.md](https://github.com/nutllwhy/whiteboard-book-video-skill/blob/aac0295461f381c4a6052b28802221cfec7b28b9/references/audio-voice.md) | TTS、真实音频长度核验、faster-whisper 词级 ASR |
| [audio-music.md](https://github.com/nutllwhy/whiteboard-book-video-skill/blob/aac0295461f381c4a6052b28802221cfec7b28b9/references/audio-music.md) | 长音乐、裁剪、淡入淡出、侧链压缩与响度检查 |
| [render-and-assemble.md](https://github.com/nutllwhy/whiteboard-book-video-skill/blob/aac0295461f381c4a6052b28802221cfec7b28b9/references/render-and-assemble.md) | CSS 遮罩、GSAP、HyperFrames 0.8.27、抽帧验收 |
| [make_subtitles.py](https://github.com/nutllwhy/whiteboard-book-video-skill/blob/aac0295461f381c4a6052b28802221cfec7b28b9/scripts/make_subtitles.py) | 接收 cues 并输出 HTML/JS；预设高亮，非逐字跟读 |
| [LICENSE](https://github.com/nutllwhy/whiteboard-book-video-skill/blob/aac0295461f381c4a6052b28802221cfec7b28b9/LICENSE) | MIT，Copyright (c) 2026 栗噔噔 |

通过 GitHub API 核验固定版本的 10 个文件：README、SKILL、5 份 references、1 个 Python 脚本、LICENSE 与 .gitignore。该版本未包含成片、完整渲染工程模板、TTS 适配器或电子书解析器。本轮只研究它，没有安装或执行该 Skill。

## 需要谨慎解释的细节

- 60—90 秒是目标。6—8 张 × 6—9 秒的区间并不能保证达到该目标，最终必须按真实配音安排。
- “词级字幕”依赖外部 ASR 与 cues 整理；Python 实现只输出字幕条动画。它的 demo 保留标点，注释写 56px；渲染文档则要求无标点和约 42px，说明规范尚未全部固化进代码。
- README 提醒同 section 多图可能重叠，渲染参考又提供多图合并示例。应在复现时验证初始显隐，而不能假定示例天然安全。
- 文档中的 seed-audio、doubao-creative-design、HyperFrames 配套 Skill 是外部依赖；`sips` 需要 Windows 替代命令。
- 上游自述有两本书生产经验，但本轮没有取得或验收成片；不能以此报告实测质量和成本。

## 网页验证

环境：Windows、Node.js v22.15.0、Python 3.10.11、本地 HTTP 与 Codex 内置浏览器。

- 独立构建、JavaScript 语法与 check.mjs 通过；后者检查 11 个本地资源／锚点，固定版本静态链接和发布文件白名单。
- 桌面默认 1280px 视口：首屏与流程区截图检查；六个阶段逐一点击，标题和依据对应更新。
- 播放／暂停状态正常；慢版显示 7 个分镜，高密版显示 18 个，口播参数及示意计数同步，切换重置播放。
- 依赖详情可展开；浏览器未报告 JavaScript 错误或警告。
- 390px 与 320px 手机布局均无横向溢出，检查首屏、白板内容和高密分镜；修正手机白板高度及最窄视口标题断行。
- 全站首次构建被正在完善的 005 项目缺少 SOURCES.md 阻断；该文件随后可用，重新构建成功，汇总 7 个网页。未修改 005 或其他子项目实现。
- 网页没有模型调用、音轨、视频导出功能；交互仅解释上游原理。未进行线上部署验证，demo 留空。

项目编号由官方 new 命令分配为 008；仓库中已有其他未提交工作，本任务只新增本项目并通过 sync 更新首页生成区域。
