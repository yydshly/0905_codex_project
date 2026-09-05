# HyperFrames 渲染 + 字幕 + 装配规范

用 HyperFrames（本地 HTML→视频渲染）做无水印成片。**不要用云端视频生成模型**。

## 环境与版本

- Node 22+、FFmpeg；CLI 固定 pin：`npx --yes hyperframes@0.8.27 ...`
- 每轮使用前先重读 `~/.agents/skills/hyperframes-core/SKILL.md` 与 `hyperframes-cli/SKILL.md`，按其 clip/timeline/lint 契约执行。

## 步骤

1. **准备素材**：分镜图转为真 PNG 后拷入当前渲染项目的 `assets/`（`sips -s format png wb1.jpg --out assets/wb1.png`）；配音拷为 `assets/vo.wav`。
2. **写 index.html**：
   - 竖屏根节点 `1080×1920`、`data-duration=<配音时长>`、30fps。
   - 每个镜头一个 `<section class="clip" data-start data-duration data-track-index="0">`，内含遮罩容器 `.wb` + `<img>`。
   - 镜头边界落在口播停顿处，硬切即可（白底图硬切不突兀）。
3. **"逐步画出"揭示动效**：对每个 `.wb` 用 CSS 遮罩 + GSAP 动画 CSS 变量 `--p`：
   ```css
   .wb { position:absolute; inset:0;
     -webkit-mask-image: linear-gradient(135deg,#000 0%,#000 calc(var(--p,0%) - 7%),transparent calc(var(--p,0%)));
     mask-image: linear-gradient(135deg,#000 0%,#000 calc(var(--p,0%) - 7%),transparent calc(var(--p,0%))); }
   ```
   **连贯性规则（实测有效）**：镜头从"已画出约 55%"的画面切入，再在镜头内约 1.5s 从容补完剩余笔迹——避免"镜头开头大面积空白 + 瞬间刷出"的断裂感，全程保持手绘动感。开场镜头 1 仍从 0% 起笔（白板空白开场是自然开篇）：
   ```js
   tl.fromTo("#wb1", {"--p":"0%"}, {"--p":"110%", duration:1.8, ease:"power1.inOut"}, 0.0);
   tl.fromTo("#wb2", {"--p":"55%"}, {"--p":"110%", duration:1.5, ease:"power1.inOut"}, <start>);
   ```
   每镜加轻微推近：`tl.fromTo("#shot1 img", {scale:1.0}, {scale:1.06, duration:<镜头长>, ease:"sine.inOut"}, <start>)`。
4. **字幕**：用 `scripts/make_subtitles.py` 生成字幕 HTML/JS（词级卡点），样式用白板便签风：白底黑边圆角条、黑字、红高亮、底部 4.5%、左右留 16%、圆角 24px、padding 14px 26px、阴影淡。
   **字幕文本纪律**：不要出现任何标点符号（含句号、逗号、问号、书名号、引号），用空格做自然断句；书名/关键词用红色高亮突出即可。**字号 42px 左右，一行尽量不换行**（若必须换行则缩到 38px 或放宽左右留白）。
   退出时加 `tl.set(...,{autoAlpha:0})` 硬清除（否则 lint 报 gsap_exit_missing_hard_kill）。
5. **校验**：`npx --yes hyperframes@0.8.27 lint`（0 错误）→ `check`（运行时/动效/布局 0 问题）。
6. **渲染**：先 `render --quality draft` 抽帧验证（逐步画出起笔、每镜字幕位置无重叠）→ 通过后 `render --quality high --output 成片.mp4`。
7. **混音 BGM**：见 `audio-music.md` 侧链 ducking 命令（`-c:v copy` 不重编码画面）。
8. **交付**：拷贝到项目根目录（中文文件名），`present_files` 交付。

## 验证清单（交付前必须做）

- ffprobe：1080×1920、h264+aac、时长=配音时长、文件非空。
- 抽帧验证：镜头**切入瞬间**画面应已有内容（约 55% 已画，非空白）、补完过程自然；每镜字幕底部不压内容/火柴人、字幕单行无标点。
- 响度：口播清晰、BGM 垫底、无削波（见 audio-music.md）。

## 节奏模式适配

- **慢版**（6-8 画面）：每画面 = 一个 `<section class="clip">`，直接按画面数写镜头。
- **高密版**（16-20 画面）：两种实现，按需选：
  - 简单做法：每画面一个 `<section>`（18 个 clip，lint 会有 track_too_dense warning，可接受）。
  - 合并做法：把相邻同主题画面（如"本能脑/情绪脑/理智脑"三图）合并进一个 `<section>`，内部分 3 个子块 `.wb-block`，每个子块内嵌一张图，GSAP 依次 reveal（错开 0.6-1s），实现"一镜内连续画出多张"：
    ```html
    <section class="clip" data-start="15" data-duration="9" data-track-index="0">
      <div class="wb" id="wb4a"><img src="assets/wb4a.png" alt=""/></div>
      <div class="wb" id="wb5a"><img src="assets/wb5a.png" alt=""/></div>
      <div class="wb" id="wb6a"><img src="assets/wb6a.png" alt=""/></div>
    </section>
    ```
    ```js
    tl.fromTo("#wb4a", {"--p":"55%"}, {"--p":"110%", duration:1.4, ease:"power1.inOut"}, 15.0);
    tl.fromTo("#wb5a", {"--p":"55%"}, {"--p":"110%", duration:1.4, ease:"power1.inOut"}, 18.0);
    tl.fromTo("#wb6a", {"--p":"55%"}, {"--p":"110%", duration:1.4, ease:"power1.inOut"}, 21.0);
    ```
  - **合并做法有重叠风险（实测）**：同 `<section>` 内多张图，后面图的 `fromTo` 起始值可能被提前应用，在轮到它 reveal 前就部分可见、盖住前图。**推荐优先用"简单做法"（每图独立 `<section>`）**；确需"一镜多小节"时，把每张图拆成独立 `<section>` 连续排列（前镜 duration 只覆盖其口播小节），用硬切衔接即可，不要在同一 section 里叠多图。
  - 高密版字幕 cue 更短更密，用 `make_subtitles.py` 生成时按短句逐条给出即可。

## 常见坑

- 字幕位置要按各图底部留白实测调整（角落火柴人/“赞”气泡处要避开）；必要时按镜头分组 `data-g` 做位置覆盖。
- draft 渲染截图与真实渲染可能有差异，验证以真实渲染抽帧为准。
- 配乐/字幕 cue 时间以词级时间戳为准，别用"按字数估算"。
