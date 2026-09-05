# 多个 Web 演示的部署约定

当前完成研究仓库初始化，尚未配置或发布演示站点。接入第一个可运行 Web 项目时，再按其技术栈增加构建和发布工作流。

## GitHub Pages 路径

GitHub Pages 每个仓库提供一个站点，可以在该站点下发布多个子目录。因此本仓库预留以下地址结构：

```text
https://yydshly.github.io/0905_codex_project/                       未来的演示导航页
https://yydshly.github.io/0905_codex_project/projects/001-slug/     第一个演示
https://yydshly.github.io/0905_codex_project/projects/002-slug/     第二个演示
```

这些是路径约定，不代表地址已上线。官方说明：[GitHub Pages 介绍](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)。

## 发布流程

1. 在各子项目 `web/` 中独立安装依赖、运行检查并构建静态文件，具体命令写在该子项目文档中。
2. 设置应用的资源基础路径为 `/0905_codex_project/projects/编号-slug/`，确保 JS、CSS、图片、字体及路由在子路径下正常工作。
3. 将选定演示的构建产物汇总到 `_site/projects/编号-slug/`，在 `_site/index.html` 生成演示导航页。
4. 在仓库 Settings → Pages 中选择 GitHub Actions，通过 Pages 工作流上传 `_site/` 并发布。
5. 验证首页、静态资源、子项目入口及刷新路由后，将真实地址填入 `project.json` 的 `demo`，再运行 `sync` 更新索引。

每次部署应汇总全部需要保留的演示：发布产物会替换整站，单独上传新项目可能让旧入口消失。只上传构建后的发布目录，不把研究笔记和源代码目录整体当作站点产物。

工作流接入依据：[使用自定义工作流部署 GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 技术边界

- GitHub Pages 托管静态内容。需要服务端、数据库或持久任务的项目，独立部署到适合的平台，并将其公开访问地址填入 `demo`。
- 客户端路由可使用 hash 路由；采用 history 路由时，需要实际解决并验证深层地址刷新。框架的静态导出和资源路径配置由各子项目记录。
- API 密钥保存在服务端或部署平台的环境变量中，不写进静态前端产物。

项目编号同时用作部署路径的一部分，发布后保持稳定。
