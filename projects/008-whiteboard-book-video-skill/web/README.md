> 更新：`#library-proof` 已加入 79 秒 MiniMax 有声视频，`#scenarios` 加入七类扩展场景。构建白名单额外复制 `production/small-steps/web-video.mp4` 为 `media/small-steps.mp4`，并复制封面图；不读取本地密钥。下述三个播放器仍指早期原理示意。

# Web 演示

中文静态研究网页，展示上游能力与原理；不会调用图片、音频或视频生成服务。

## 环境与运行

Node.js 22+，原生 HTML / CSS / JavaScript，无 npm 依赖。Python 3 仅用于预览服务器。

在仓库根目录运行：

```sh
node projects/008-whiteboard-book-video-skill/web/build.mjs
node projects/008-whiteboard-book-video-skill/web/check.mjs
node --check projects/008-whiteboard-book-video-skill/web/app.js
node scripts/projects.mjs check
node scripts/build-site.mjs
node scripts/check-site.mjs
python -m http.server 4318 --bind 127.0.0.1 --directory _site
```

本地入口：`http://127.0.0.1:4318/projects/008-whiteboard-book-video-skill/`。无需服务端、密钥或联网字体。构建修改后刷新浏览器。

## 文件与交互

| 文件 | 职责 |
| --- | --- |
| `index.html` | 内容章节、语义结构、静态证据入口 |
| `styles.css` | 白板风布局、响应式与减少动画偏好 |
| `app.js` | 六步流程、两种节奏、播放与暂停；不调用模型 |
| `cases.js` / `cases.css` | 三个真实用途的内容样例：原始材料、六镜口播、画面预览与时间轴；不调用模型 |
| `cases-data.mjs` | 三组案例数据，由浏览器与构建脚本共享 |
| `build.mjs` | 输出六个前端文件和三份 Markdown 脚本，构建时补齐固定版本源码链接 |
| `check.mjs` | 校验发布资源、页内锚点、唯一 ID、源码链接及文件白名单 |
| `publish.json` | 总站构建契约 |

播放示意使用 requestAnimationFrame 与 CSS 遮罩，默认停在完整首帧；播放时开场从空白揭示，其余镜头从 55% 揭示。慢版用 7 帧、高密版用 18 帧；计时仅用于原理演示，不代表实际配音或输出视频。离开可见区域／后台自动暂停，模式切换重置播放，减少动画偏好下直接显示完整图。

无 JavaScript 时主体内容和构建后的源码链接仍可阅读，交互区给出文字说明。资源使用相对路径，章节采用原生锚点，没有 history 路由。

## 发布

使用 GitHub Pages 时，预留路径为 `/0905_codex_project/projects/008-whiteboard-book-video-skill/`。路径约定见[部署指南](../../../docs/deployment.md)。

产物包括 `dist/index.html`、`dist/styles.css`、`dist/app.js`、`dist/cases.css`、`dist/cases.js`、`dist/cases-data.mjs`，以及 `dist/samples/` 下三份 Markdown 脚本。总构建自动汇入 `_site/projects/008-whiteboard-book-video-skill/`；截图留在研究 assets，不复制到网页产物。脚本下载使用静态文件链接，在不支持自动下载的浏览器中也可以直接打开。

场景样例位于 `#examples`。三个案例各有 6 个镜头，按每镜 5 秒示意，总长 30 秒。可选择口播句子、前后切镜、播放暂停、拖动进度并下载 Markdown。时间仅用于解释制作方案；真实配音后需要重新安排。没有音轨或 MP4 导出。390px 等手机视口点击口播会滚动到对应画面。

已发布并验证：[线上入口](https://yydshly.github.io/0905_codex_project/projects/008-whiteboard-book-video-skill/)、视频资源及扩展场景内容均可访问；project.json 与总 README 已同步。
