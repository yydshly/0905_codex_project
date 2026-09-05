# 多个 Web 演示的部署约定

本仓库已配置 GitHub Actions 静态站点构建与发布工作流。正式可访问的项目地址仅在部署验证后写入各子项目的 `project.json`；首页索引据此生成入口。

## GitHub Pages 路径

GitHub Pages 每个仓库提供一个站点，本仓库在该站点下按固定编号发布独立子目录：

```text
https://yydshly.github.io/0905_codex_project/                         研究导航页
https://yydshly.github.io/0905_codex_project/projects/001-awesome-english-ebooks/
https://yydshly.github.io/0905_codex_project/projects/002-slug/        后续项目路径示意
```

后续项目的示意路径不代表已经上线。官方说明：[GitHub Pages 介绍](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)。

## 子项目构建契约

各子项目独立管理技术栈、依赖与构建。需要加入 Pages 时，在自己的 `web/` 下提供：

- `build.mjs`：Node.js 构建入口；由子项目负责调用适用的构建工具。
- `publish.json`：内容为 `{"build":"build.mjs","output":"dist"}`。
- `dist/index.html`：构建后的入口，以及仅用于发布的静态文件。

当前 001 项目无第三方依赖。后续项目如需安装依赖，应在工作流中增加该项目适用的安装步骤并使用其锁文件，不统一强制前端框架。

在仓库根目录运行：

```sh
node scripts/projects.mjs check
node scripts/build-site.mjs
node scripts/check-site.mjs
```

汇总脚本先构建每个带有 `publish.json` 的项目；全部成功后重建 `_site/`，将产物复制到 `_site/projects/编号-slug/`，并生成导航页。所有启用项目每次一起发布，避免只上传新项目导致旧入口消失。不要将研究目录或原始电子书整体复制到发布目录。

## 发布与验证

[Pages 工作流](../.github/workflows/pages.yml) 在推送 `main` 或手动触发时执行检查、构建、上传与部署。仓库 Settings → Pages 使用 GitHub Actions。

1. 各子项目先完成本地构建、交互和资源检查。
2. 工作流将 `_site/` 上传为 Pages artifact 并部署，部署权限仅授予部署 job。
3. 验证导航页、子项目入口、CSS、JS、图像、数据文件及锚点刷新。
4. 只有线上验证通过后，才填写项目 `demo`，运行 `node scripts/projects.mjs sync` 和 `check`，同步外部 README 引导。

发布工作流串行执行，避免并发替换站点。构建依据：[自定义工作流部署 GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 技术边界

- 资源基础路径必须适配 `/0905_codex_project/projects/编号-slug/`。001 项目使用相对路径和页内锚点。
- 采用 history 路由时，必须另外解决并验证深层地址刷新；优先使用静态页面或 hash 路由。
- GitHub Pages 仅托管静态内容，需要服务端、数据库或持久任务的项目使用独立平台。
- API 密钥不进入静态前端产物。
- 编号和发布子路径保持稳定，归档项目保留入口。
