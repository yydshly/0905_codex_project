# 研究依据与验证记录

日期：2026-09-05。版本：`3c2629142c5d437428269b1b722b08c0b87f574d`。

[固定版本源码](https://github.com/humanlayer/skills/tree/3c2629142c5d437428269b1b722b08c0b87f574d)

## 已阅读的关键实现

路径均相对上游根目录：

- `.claude-plugin/marketplace.json`：分发五个独立 Skill。
- `plugins/<skill>/skills/<skill>/SKILL.md`：已阅读全部五项；支持页面中的能力、输入输出与步骤描述。
- `plugins/design-control-loop/skills/design-control-loop/references/workflow-template.yml`：待审 PR gate、评论身份条件、隐藏标记路由；Sensor / Controller 有 TODO。
- 同 references 目录中的 `agent-iteration.ts`：通过 GitHub CLI 读取 PR 正文、评论，和 Markdown 记忆一起拼入新提示词。
- 同目录中的 `agent-runner-templates.md`：外部 Agent 执行与输出提取范例；未实测兼容性。
- 同目录中的 `control-loop-taxonomy.md`、`example-control-loop.md`：检测、选择、执行、外部变化及反馈的设计。

## 事实与建议的区分

上游事实：五个 Skill、工作流模板、PR 上限、反馈辅助脚本与记忆机制均有源码。
研究判断：条件标签没有程序级强制语义；公共组件需额外核对外部契约；文字记忆不等同参数学习。
下游建议：独立 CI 验收、结构化问题输出、反馈失效机制及收益评测。
本地实现：原创能力介绍、三种示例场景和手动逐步模拟。6、8、12 等数字为预设数据，不是实际扫描结果。
未验证：上游工作流实跑、指令遵循改善幅度、重构质量提升、线上部署。

## 验证命令

在仓库根目录运行：

```sh
node --check projects/006-humanlayer-skills/web/app.js
node scripts/projects.mjs sync
node scripts/projects.mjs check
node scripts/build-site.mjs
node scripts/check-site.mjs
node projects/006-humanlayer-skills/web/preview.mjs
```

浏览器验收覆盖能力面板、键盘切换、三种场景、待审 PR 暂停、六阶段进度、合并后数量、反馈文字、重置和移动端布局。

## 许可与素材

上游为 MIT License，Copyright (c) 2026 HumanLayer，原文保存在 upstream-LICENSE.txt。网页讲解、样式和交互为本仓库原创，未移植上游执行代码。截图来自本地展示页，属于下游研究界面，不是上游产品截图。

## 本轮验收结果

- JavaScript 语法检查与独立构建通过。
- 浏览器验证五个面板及固定版本源码链接；Home 键切回第一项通过。
- 三个场景全部六阶段通过：合并前问题数保持 6 / 8 / 12，模拟合并后为 5 / 6 / 9；完成后按钮禁用。
- 待审 PR gate、长期反馈显示和重置通过；控制台未发现错误。
- 390 像素移动视口文档宽度为 390，没有水平溢出；已检查布局并保存真实桌面与移动截图。
- 首次全站构建被 003 项目缺少 notes/generation-experiments.md 阻挡；独立构建 006 后对汇总目录的 49 个本地链接与资源检查通过。最终汇总结果见后续记录。
- 线上部署和上游 Agent 执行不在本轮验证范围内。
最终汇总重试：003 已能构建；全站构建目前被 005 项目缺少 assets/SOURCES.md 阻挡。006 独立构建及展示验证通过，未修改其他项目以绕过其错误。

## 展示重构与提交验收

2026-09-05：将介绍重心改为五个可独立使用的 Skill。新增每项的实际问题、示例请求和产物；README 增加重命名回调前后代码示例；首页封面更换为原创五项能力 SVG 引导图。浏览器已确认五项示例可切换，首页强调独立使用；进阶循环仅作为第 3 / 4 项的补充说明。未执行上游 Skill。

最终发布前验收：在基于 origin/main 的独立工作目录中，项目索引校验、JavaScript 语法检查、全站构建、136 个本地链接与资源检查、git diff --check 全部通过。此前其他项目缺文件的临时阻挡已不影响本次提交。

