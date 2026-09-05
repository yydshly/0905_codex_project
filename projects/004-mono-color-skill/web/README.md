# 实际图片展示网页

静态 HTML/CSS/JavaScript，无运行依赖。按上游 Skill 与设计目录，Agent 已通过内置 image_gen 生成三张原图；页面展示这些结果，不实时调用生成服务。

功能：三图画廊、原图放大与下载、三种场景切换、实际五段提示词的编辑复制与下载、配方与人工检查记录、能力说明与扩展路径。图片、提示词、配方来自 ../assets/generated；build.mjs 自动复制资源并生成 demos.js。

## 本地预览

在总仓库根目录运行：

```powershell
node projects/004-mono-color-skill/web/build.mjs
python -m http.server 8765 --bind 127.0.0.1 --directory projects/004-mono-color-skill/web/dist
```

打开 http://127.0.0.1:8765/。独立预览不提供总项目首页，页脚返回入口需在汇总站点使用。

正式路径遵守 docs/deployment.md：/0905_codex_project/projects/004-mono-color-skill/。已于 2026-09-05 经 GitHub Actions 成功发布，正式网页与生成图片返回 HTTP 200；project.json 已填写验证后的演示地址。

## 本轮验证 / 2026-09-05

- JavaScript 语法检查、子项目构建、仓库索引检查通过。
- 浏览器确认三张原图加载，分辨率宽度均为 1086px。
- 原图弹窗开启与关闭、场景切换与图片联动、实际提示词复制通过。
- 桌面及 390px 手机视口检查，手机无横向溢出。
- 图片质量观察见 ../assets/generated/REVIEW.md；没有对照组，不是成功率测试。

## 作者精选案例画廊 / 2026-09-05

新增 12 张上游作者精选输出案例，按海报、观察与刊物、包装、品牌周边筛选。支持原图放大、当前分类内前后翻看和键盘方向键。每张包含看图分析、应用建议及作者原作链接。

数据维护在 web/cases.mjs，构建时生成完整 HTML 和 cases-data.js。浏览器直接读取固定提交版本的 raw.githubusercontent.com 图片，构建不下载或复制作者资产；没有网络时保留原作链接和加载失败提示。软件 MIT 不适用于这些图片，复用需另获授权。

检查：浏览器确认全部 12 张图片成功加载；包装筛选得到 4 张，弹窗由沙丁鱼切换到耳机正确；390px 手机视口无横向溢出。
