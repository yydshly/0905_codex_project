# 中文研究网页

静态 HTML / CSS / JavaScript，无 CDN、第三方运行依赖或图像服务调用。页面交互在浏览器本地进行。

## 页面模块

1. 风格简介与上游真实生成样张。
2. 四种交付模式与能力边界。
3. 四步交互流程：输入、风格组装、生图、验收。
4. 任务配置器与四个场景预设：初次体验、阅读笔记封面、风格对照、连贯壁纸。
5. 安装、首次出图、交付复核与 CSV 评测表。
6. 已实现扩展、后续建议、源码限制、证据分层与来源。
7. 钢笔创意图鉴：一张真实生成的六格效果图，点击编号切换用途、改变、任务示例与独立扩展提示词。原图与图鉴生成提示词可直接查看。

## 开发与构建

在仓库根目录：

```sh
node --test projects/005-xxd-panel-092/web/task.test.mjs
node projects/005-xxd-panel-092/web/build.mjs
node scripts/build-site.mjs
node scripts/check-site.mjs
node projects/005-xxd-panel-092/web/preview.mjs
```

打开 `http://127.0.0.1:4185/projects/005-xxd-panel-092/`。可通过 `XXD_PREVIEW_PORT` 更换端口。

`build.mjs` 只复制网页所需文件到自身 `dist/`；总构建发布到 `_site/projects/005-xxd-panel-092/`。资源使用相对路径，导航使用页内锚点。不要直接以 file 协议打开开发文件，ES 模块需要 HTTP 服务。

## 配置器规则

- 普通模式成品数 = 图片数 × 普通模式数 × 去重后的尺寸选项数。
- 每张图片的壁纸包增加四张，不乘普通模式画幅数。
- 等价比例（例如 6:8 和 3:4）合并；准确像素与比例仍是独立交付规格。
- auto / source 与其他画幅可能重合，最终数量由 Agent 解析后确认；目录文件数是用户填写的估计。
- 四端尺寸为本页明确设定的任务参数，不代表模型原生支持。
- 不估算货币费用，不将成品数等同于实际 API 调用次数。
- 无效输入会停止生成任务；准确文案按用户输入保留，写入文本节点或 textarea。
- 参数形式供 Agent 会话阅读，不作为终端脚本执行；自然语言任务单是主要入口。
- 剪贴板不支持时选择文本，提供手动复制提示。

## 发布状态

已于 2026-09-05 通过 GitHub Actions 发布并验证：[在线研究网页](https://yydshly.github.io/0905_codex_project/projects/005-xxd-panel-092/)。入口、CSS、JS 模块、效果图和许可证返回 HTTP 200；已填写 demo 并同步首页。
