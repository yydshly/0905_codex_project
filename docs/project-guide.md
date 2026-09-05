# 新增与维护研究项目

## 新增项目

在仓库根目录运行（Node.js 22+，无需安装依赖）：

```sh
node scripts/projects.mjs new --slug project-name --name "项目名称" --source "https://github.com/owner/repo" --summary "一句话说明研究重点"
```

- `slug` 使用小写英文、数字和短横线，如 `threejs-camera`。
- 编号取现有最大编号加一，从 `001` 开始，超过 `999` 后自动扩展。
- 命令创建 `README.md`、`project.json`、`assets/`、`notes/`、`web/`，并刷新首页。
- 模板仅用于新建，不会改写已有子项目文档。根目录 README 的两个标记区域由脚本维护，其他部分可自由编辑。

## 资料与排序

每个子项目的 `project.json` 是首页索引和预览的资料来源：

| 字段 | 用途 |
| --- | --- |
| `id` | 正整数，固定编号，须与目录前缀一致 |
| `slug` | 目录名称后缀，创建后保持稳定 |
| `name` | 展示名称 |
| `summary` | 简短的研究摘要，建议控制在一句话 |
| `source` | 上游仓库或项目来源的 HTTPS 链接 |
| `status` | 研究状态，见下表 |
| `tags` | 技术或主题标签的字符串数组 |
| `demo` | 已验证可访问的演示链接；未部署时留空字符串 |
| `cover` | 相对子项目目录的本地图片路径，如 `assets/cover.webp`；无图时留空 |
| `coverAlt` | 图片内容说明，设置封面时必填 |
| `previewVideo` | 可选；已验证的 GitHub 视频附件 URL，在对应项目预览处直接显示播放器，优先于封面 |

| 状态值 | 首页显示 | 含义 |
| --- | --- | --- |
| `planned` | 待研究 | 已收录，尚未开始 |
| `researching` | 研究中 | 正在阅读、运行和分析 |
| `prototyping` | 实验中 | 正在复现、改造或制作演示 |
| `completed` | 已完成 | 本轮研究完成，有结论和验证记录 |
| `archived` | 已归档 | 暂停或停止维护，保留历史入口 |

首页始终按 `id` 数值升序排列。不要通过改编号调整展示顺序，也不要删除归档项目后复用编号。后续若需要主题分类，可使用 `tags`，不改变主索引顺序。

## 图片与说明

1. 将真实截图或有明确标注的示意图放到子项目 `assets/` 中，优先使用 PNG、WebP 或 JPG。
2. 在 `project.json` 填写 `cover` 与 `coverAlt`，运行 `sync` 后自动展示在首页。
3. 子项目 README 可使用 `![界面说明](./assets/cover.webp)` 插入图片，在下方补充它展示的功能、运行条件和素材来源。
4. 首页保留一张代表性封面；更多截图、动图和实验过程放在子项目文档中。没有封面时不生成失效图片链接。

## 研究内容

按模板补充：研究目标、上游版本或 commit、运行环境、关键设计、实验过程、结论与限制。Web 代码和依赖放在各项目 `web/` 下；其他类型的源码可按需增加 `src/`、`examples/` 等目录。

引入上游代码时记录来源、版本及许可证，保留必要的许可文件；避免直接复制包含 `.git` 的仓库目录。这里不统一绑定前端框架或包管理器，各子项目提交自己的依赖锁文件。

## 更新与校验

```sh
node scripts/projects.mjs sync
node scripts/projects.mjs check
```

`sync` 根据项目资料重建首页索引和图片预览。`check` 检查资料格式、编号和目录一致性、重复编号或 slug、项目 README、封面文件以及首页是否已同步；失败时以非零状态退出。远程演示是否可访问需在实际部署后另外验证。

GitHub Actions 在推送与 Pull Request 时自动运行相同校验。提交前，将项目资料和生成后的根 README 一起纳入提交。

视频预览与图片预览同级，统一放在该项目编号下面，不另设首页置顶区。视频须上传为 GitHub user-attachments 附件，并验证 Markdown 渲染产生播放器；普通仓库 MP4 链接不能替代这一验证。设置 previewVideo 后可将 cover 与 coverAlt 留空。
