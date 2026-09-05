# 008 · 白板拆书视频工作流研究

> 用 79 秒真实有声视频理解制作流程，再看七类扩展场景与能力边界。

## 先看效果，再理解这个库

[![小动作开始：79 秒白板视频真实画面，点击查看视频文件](./assets/video-preview.jpg)](./production/small-steps/web-video.mp4)

**输入想法：目标太大时容易拖延，可以先从小动作开始。** 七张白板插画配合渐进揭幕、轻推近、MiniMax 中文旁白和 36 条字幕，实际导出约 79 秒、1080×1920、30fps 的有声视频。[查看／下载 MP4](./production/small-steps/web-video.mp4)。GitHub README 用真实帧作引导，点击进入视频文件；网页提供可播放版本。

这个库贡献的是叙事与白板视觉规范、字幕生成脚本及具体装配经验；图片模型、MiniMax、HyperFrames 是外部能力。本次保留原脚本，补充服务适配、字幕断句与倒回播放的显示修复。纯旁白版本未验证背景音乐与侧链混音。

[返回总索引](../../README.md) · [上游仓库](https://github.com/nutllwhy/whiteboard-book-video-skill) · [七类扩展场景](./notes/use-cases.md) · [制作过程与复现命令](./production/small-steps/README.md) · [Web 说明](./web/README.md)

## 可以扩展到哪些场景

| 场景 | 具体选题 | 白板组织方式 |
| --- | --- | --- |
| 开源项目导读 | 这个库解决什么问题 | 使用前后、能力关系、使用步骤 |
| 研究成果分享 | 这次研究发现了什么 | 问题、发现、意义、结论 |
| 知识科普 | 缓存为什么能加速 | 请求路线与命中对比 |
| 产品使用教程 | 第一次使用怎样开始 | 三步流程、注意事项、完成标志 |
| 团队培训 | 故障发生先做什么 | 判断分支、角色分工、处理顺序 |
| 读书与个人表达 | 目标太大怎样开始 | 情境、观点、例子、行动 |
| 系列课程 | 每集讲一个概念 | 固定角色、配色、开场与收尾 |

上述是基于现有实现的适配判断，目前实测完成的是“小动作开始”案例。换主题大多可沿用流程；精确点击教学需加入录屏，人物动作需其他动画工具，系列批量生产需增加模板、素材缓存、局部重做和任务管理。详细输入、补充工作与边界见[扩展场景说明](./notes/use-cases.md)。

对研究总仓库，建议为每个子项目增加约一分钟的视频导读：先理解问题与价值，再阅读源码证据。可以制作项目介绍片、机制解释片、场景演示片；尚未打通其他项目的自动视频生产。

## 原理与实际复现

原库固定版本 [`aac0295461f381c4a6052b28802221cfec7b28b9`](https://github.com/nutllwhy/whiteboard-book-video-skill/tree/aac0295461f381c4a6052b28802221cfec7b28b9)，研究更新 2026-09-06。

1. 按原库脚本骨架编写口播、分镜和生图要求。
2. 外部图像工具按白板三色、火柴人、留白和参考图延展规范生成七张图片。
3. MiniMax 生成配音及词级时间戳；本次替换原 seed-audio 与独立 ASR。
4. 整理真实时间 cues，直接执行原版 make_subtitles.py；装配层修复倒回时间轴时的字幕隐藏问题。
5. HyperFrames 0.8.27 按原库独立镜头、55% 揭幕与轻推近规范本地渲染。
6. 验证音视频编码、时长、字幕文本覆盖、重叠和抽帧。原始输出与报告保留在制作目录。

**边界**：“手绘”是完整图片被遮罩逐渐揭示，不是逐笔绘画或人物运动。字幕脚本不做语音识别、原文纠错或逐字跟读；词级时间戳来自 MiniMax，未另用 ASR 复核。

本次检查通过：H.264＋AAC，79.033 秒；与旁白时长差约 0.016 秒；36 条字幕去标点后覆盖口播原文且不重叠；HyperFrames 静态与运行时零错误，布局 9 个采样点零问题。两条轨道密度警告保留；检查不是内容效果的自动评分。

## 本地查看与构建

静态网页不调用模型，不需要 API Key。已生成的 Web 视频随仓库提供，构建不会重新生成配音。

```sh
node projects/008-whiteboard-book-video-skill/web/build.mjs
node projects/008-whiteboard-book-video-skill/web/check.mjs
node scripts/build-site.mjs
node scripts/check-site.mjs
python -m http.server 4318 --bind 127.0.0.1 --directory _site
```

入口：`http://127.0.0.1:4318/projects/008-whiteboard-book-video-skill/#library-proof`。重新制作需要独立的 Python、FFmpeg、HyperFrames 与 MiniMax 本地配置，见[制作说明](./production/small-steps/README.md)。本地密钥和中间渲染文件不提交。

## 参考与许可

- 固定上游文件和 MIT 许可保留于 [vendor](./vendor/whiteboard-book-video-skill/SOURCE.md)。
- HyperFrames 参考文档的版本与许可见 [来源说明](./production/small-steps/references/SOURCE.md)。GSAP 保留原许可头。
- 图片为本次 imagegen 生成，视频为本地实际渲染；不是上游示例成片。[提示词记录](./production/small-steps/PROMPTS.md)。
- 早期三个 30 秒网页播放器是内容示意，与本次真实有声 MP4 分别标注；[先前研究笔记](./notes/README.md)保留为阶段记录。
