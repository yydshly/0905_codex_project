# 完整制作实验：从小动作开始

输入想法：**目标太大时容易拖延，可以先从小动作开始。**

本实验的目标是验证 whiteboard-book-video-skill 的制作流程。上游固定版本与许可见 [vendor 来源](../../vendor/whiteboard-book-video-skill/SOURCE.md)。研究网页此前的 30 秒案例是代码示意；本目录开始实际素材生产与渲染，不能混为同一验证结果。

## 库实际提供什么

| 制作环节 | 上游贡献 | 外部执行者 / 本次适配 |
| --- | --- | --- |
| 拆解想法 | script-writing.md 规定叙事骨架、分镜表、逐字稿和提示词 | Agent 按规范产出 story.json；内容判断来自执行者 |
| 图像制作 | image-prompt.md 规定白板、火柴人、红蓝黑、字幕留白、参考图延展 | 内置 imagegen 生成 7 张真实插画；非库自带图像模型 |
| 配音 | audio-voice.md 规定音频核验与以配音定时长 | 用户指定 MiniMax；替换原 seed-audio 供应商 |
| 字幕 | scripts/make_subtitles.py 实际生成 HTML 与 GSAP 片段 | 直接运行固定版本原脚本；时间戳需外部语音工具提供 |
| 画面装配 | render-and-assemble.md 规定独立 section、遮罩、55% 切入与轻推近 | 编写适配工程，HyperFrames 0.8.27 本地渲染 |
| 音乐混音 | audio-music.md 提供 FFmpeg 侧链压缩方案 | 外部音频素材与 FFmpeg 执行 |
| 验收 | 规定 lint/check、草稿、真实抽帧、时长与响度检查 | 执行并留存记录，不以模型自述代替验收 |

## 当前阶段

**有声版**：`small-steps.mp4`，约 79 秒，七镜头、MiniMax 中文旁白、36 条原文字幕。时间轴由七段实际音频长度确定；字幕采用 MiniMax 返回的词级时间戳，检查与逐字稿去标点后完整一致。本次不加入背景音乐，原库的音乐生成与侧链混音环节仍未验证。

复现命令（从本目录运行）：

```powershell
python minimax_tts.py --config .env.minimax
python assemble.py
cd composition
# 在当前进程配置 HYPERFRAMES_BROWSER_PATH 为本机 Chrome 可执行文件路径
npx --yes hyperframes@0.8.27 check --snapshots --timeout 30000
npx --yes hyperframes@0.8.27 render --quality high --output ../small-steps.mp4 --low-memory-mode
cd ..
python verify.py
```

### 本次实际发现与适配

- 原字幕脚本退出时使用 `autoAlpha:0`，入场仅恢复 `opacity`。在检查器倒回时间轴时可出现字幕仍隐藏；装配层将入场属性替换为 `autoAlpha`。vendor 原脚本与 composition/subs.js 原输出不变，修复只作用于装配后的 HTML。
- 直接按标点分句会产生不足 0.44 秒的字幕，与原脚本 0.28 秒入场和 0.16 秒退出发生重叠。本次合并过短片段，保留真实词级起止时间，并将最长单行字幕字号调为上游允许的 38px。
- 配音与词级时间戳由 MiniMax 提供，替换原 seed-audio 与独立 ASR；不是库内置语音能力，也没有独立 ASR 复核。`cues.json`、`timing.json`、`verification.json` 保留实际处理证据。
- 最终检查：零错误、9 个布局采样点零问题，4/4 文字对比度检查通过；两条轨道密度警告保留。字级时间边界来自供应商，检查通过不等于人类听感或逐词时间戳绝对准确。

### 先前无声草稿记录

已完成 7 镜头内容规划和图片素材，创建 HyperFrames 0.8.27 工程。已实际执行原版 make_subtitles.py 生成 23 条字幕片段。`python assemble.py --draft` 可重建 56 秒无声草稿；字幕是摘要、时间为固定分配，不能作为词级语音对齐证据。MiniMax 配音等待本地配置文件路径；未取得配音前不能报告最终成片或真实字幕对齐成功。

HyperFrames 完整检查已通过：静态零错误，运行时零错误，布局 9 个采样点零问题，10/10 字幕对比度检查通过。保留两条轨道密度警告：为遵从原库独立镜头避免覆盖的规范，暂不拆分子合成。未配置自定义运动断言，不能把检查通过视为揭幕视觉已经完整验收。

自动安装 Chrome Headless Shell 下载失败；采用 HyperFrames 官方支持的 HYPERFRAMES_BROWSER_PATH 指向本机 Chrome 执行检查与渲染。GSAP 3.14.2 已从官方 npm CDN 保存到 composition/assets/gsap.min.js，保留原始许可头（https://gsap.com/standard-license）。低内存渲染使用 --low-memory-mode。

图片由内置 imagegen 生成，首张为新图，后六张以首张作编辑参考延展。原图在 `assets/shot-01.png` 至 `shot-07.png`。原始生成结果为 941×1672，接近 9:16；装配时统一映射至 1080×1920，记录与上游建议 1152×2048 的差异。提示词与来源见 `PROMPTS.md`。

本次使用完整制作授权推进阶段；关键产物持续展示给用户。保留上游分阶段可审阅的产物和记录，未将额外停顿次数当作视频技术能力。

实际草稿已导出：silent-draft.mp4，H.264，1080×1920，30fps，56.000 秒，22,678,544 字节，无音轨。真实视频第 8 秒抽帧确认后续镜头从部分已揭示状态切入。008 网页资源检查通过；总站检查当时被独立的 009 项目缺少 run.html 阻断，未修改该项目。
