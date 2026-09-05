# Web 演示

原生 HTML / CSS / JavaScript 静态研究页，Node.js 22+ 构建，无需安装第三方依赖。

## 本地构建与预览

在总仓库根目录运行：

```sh
node projects/003-wibi-style/web/build.mjs
node scripts/build-site.mjs
node scripts/check-site.mjs
node projects/003-wibi-style/web/preview.mjs
```

访问 http://127.0.0.1:4178/projects/003-wibi-style/ 。预览服务只绑定 127.0.0.1，从总仓库 `_site/` 提供静态文件，支持返回导航页；用 `WIBI_PREVIEW_PORT` 设置其他端口。修改源码后重新构建并刷新页面。

## 文件与交互

- `data.mjs`：28 款风格元数据、固定版本来源、三条工作流；中文说明为本研究整理。
- `demos.mjs`：三个实际生图场景、输入输出对照与偏差观察；构建验证文件散列并复制本地 PNG。
- `overview.mjs`：完整 28 款风格的独立总览排版，导出为首页封面 `assets/style-atlas-28.png`；网页提供查看与下载入口。
- `build.mjs`：生成 `dist/index.html` 并复制运行资源与研究记录。
- `app.js`：题材和搜索联合筛选、详情弹窗、调用示例复制、三条流程与五个步骤切换、场景跳转、图片失败降级。
- `styles.css`：桌面四列、手机两列图鉴；响应式流程，键盘焦点和减少动画适配。
- `publish.json`：遵守总仓库发布契约。资源使用相对路径和页内锚点。

实际效果区展示已经用内置 image_gen 生成的本地 PNG，支持场景切换、打开原图和下载。网页本身不会接收或上传照片、实时调用生图接口或执行远程 Skill。复制按钮仅提供安装后使用的调用示例。28 款图鉴的上游图片需要访问 GitHub Raw；无法载入时提供文字降级。本次生成结果无外部热链依赖。

## 验证

已在实际浏览器检查 1280px 桌面及 390px 手机视口，筛选、详情、复制反馈、Escape 关闭和三条流程均可用，未发现横向溢出。详见 [验证记录](../notes/verification.md)。

已部署至 [GitHub Pages](https://yydshly.github.io/0905_codex_project/projects/003-wibi-style/)，稳定路径为 `/0905_codex_project/projects/003-wibi-style/`。路径约定见[部署指南](../../../docs/deployment.md)。

已接入总仓库汇总构建。2026-09-05 线上入口、CSS、JavaScript、全览 PNG、独立全览页与实际生成图片均通过 HTTP 检查；浏览器验证 28 张上游示例全部载入。正式地址已写入 `../project.json` 的 `demo` 字段并同步首页。
