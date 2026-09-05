# 研究网页：构建、验证与部署

[返回项目研究](../README.md) · [来源与处理详解](../notes/source-processing.md)

## 已实现内容

静态研究网页包含来源目录与搜索、按格式筛选、完整架构 SVG、七个处理步骤的交互说明、四本 EPUB 样本证据及参考链接。当前实现用于研究展示；完整采集、文章清洗和学习系统仍是扩展建议。

技术栈为 HTML、CSS、原生 JavaScript 与 Node.js 构建脚本。没有第三方前端依赖，无需 npm install；Node.js 22+ 即可构建。页面的脚本、样式与图像均从本站加载，无运行时 CDN 依赖。

## 本地构建

在总仓库根目录运行：

```sh
node projects/001-awesome-english-ebooks/web/build.mjs
node scripts/build-site.mjs
node scripts/check-site.mjs
python -m http.server 8765 --bind 127.0.0.1 --directory _site
```

第一个命令独立构建本子项目；第二个命令会构建并汇总所有启用发布的项目，不必重复执行第一步。访问本机预览地址 [研究网页](http://127.0.0.1:8765/projects/001-awesome-english-ebooks/)。

- `data.json`：来源、统计、处理逻辑和参考链接。
- `build.mjs`：生成完整 HTML，复制 CSS、JS、SVG 和样本元数据到 `dist/`。
- `../tools/draw-architecture.mjs`：生成 `../assets/architecture.svg`，由构建脚本自动调用。
- `publish.json`：选择加入总仓库 Pages 发布，构建入口为 `build.mjs`、输出为 `dist/`。
- `app.js`：搜索、筛选、处理步骤切换及导航高亮。
- `styles.css`：桌面、手机、打印和减少动态效果的样式。

## 验证记录

- 项目资料与首页索引：`node scripts/projects.mjs check`。
- 静态页面与资源链接：`node scripts/check-site.mjs`。
- 浏览器实际验证：音频过滤得到 1 个来源；WIRED 搜索得到 1 个来源；无匹配搜索显示空状态；七个处理步骤均可切换。
- 手机宽度布局已检查，无页面横向溢出；完整架构图已目视检查。
- 浏览器控制台未观察到 error / warn。
- 四本 EPUB 的结构审计结果与完整 SHA-256 保存在 `../notes/epub-inspection.json`，不发布电子书原件。

## GitHub Pages

工作流位于 [pages.yml](../../../.github/workflows/pages.yml)。每次向 `main` 推送会先校验资料、构建全部启用发布的子项目、检查静态链接，再发布 `_site/`。

稳定子路径为 `/0905_codex_project/projects/001-awesome-english-ebooks/`。网页使用相对资源路径和页面内锚点，没有依赖服务器回退的 history 路由。正式地址只在实际部署并验证后写入 [project.json](../project.json) 的 `demo` 字段。

这是静态研究站点，不需要数据库、服务端或 API 密钥。部署只上传构建结果，详见[总仓库部署约定](../../../docs/deployment.md)。
