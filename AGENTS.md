# 仓库协作约定

- 这是多个独立开源项目的研究总仓库。根 README 保持简短，承载摘要、有序索引和封面预览；细节写入子项目。
- 子项目位于 `projects/编号-slug/`。编号从 001 递增，固定后不重排、不回收；归档项目保留入口。
- 新增项目使用 `node scripts/projects.mjs new`，用法见 `docs/project-guide.md`。
- 首页索引资料来自各子项目 `project.json`；修改后运行 `node scripts/projects.mjs sync`，不要手工编辑 README 的生成区域。
- 使用真实截图和经过验证的演示链接；没有内容时保持空值。配图描述、来源和研究结论优先使用中文。
- 技术栈、依赖和构建命令由各子项目独立管理。引入上游实现需保留来源、版本及原许可信息。
- 多 Web 演示遵守 `docs/deployment.md` 的稳定子路径约定；只有完成实际部署验证后才填写演示地址。
- 提交前运行 `node scripts/projects.mjs check`；修改了某个子项目时，再运行该项目适用的检查。
