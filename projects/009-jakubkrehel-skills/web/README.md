# 能力展示网页

中文静态交互网页，以能力图谱、工作流程和真实任务指南展示 jakubkrehel/skills 的研究结论。HTML、CSS 与原生 JavaScript 实现，无第三方依赖、外部字体或运行时服务。

## 页面内容

- 11 个技能：分类筛选、关键词搜索、输入/过程/输出/边界详情和固定版本源码链接。
- 排版示意：切换卡片排版规则，观察层级与间距变化；明确标记为本站示意。
- 底层机制：规则、宿主代理、工具、证据与交付之间的关系。
- 四步审查流程：范围、领域检查、证据、合并报告。
- 五种任务场景：推荐技能路径、示例任务与使用限制。
- 扩展价值：中文适配、自动验证、对照评测及研究流程。

## 本地运行

需要 Node.js 22+，在仓库根目录执行：

```sh
node projects/009-jakubkrehel-skills/web/build.mjs
node projects/009-jakubkrehel-skills/web/serve.mjs
```

打开 [本地预览](http://127.0.0.1:4309/0905_codex_project/projects/009-jakubkrehel-skills/)。预览服务器只绑定本机，结束时按 Ctrl+C。可用 PORT 环境变量修改端口。

## 构建与发布

build.mjs 复制能力图谱、效果实验室和工作台的页面文件，并生成项目资料快照到 dist/；publish.json 接入全仓库的静态站点汇总。资源均使用相对路径，导航使用页内锚点。

```sh
node --check projects/009-jakubkrehel-skills/web/app.js
node scripts/projects.mjs check
node scripts/build-site.mjs
node scripts/check-site.mjs
```

产物目录：dist/。预留发布子路径：/0905_codex_project/projects/009-jakubkrehel-skills/。本轮仅本地验证，没有实际部署；project.json 的 demo 保持空值。部署遵守[仓库约定](../../../docs/deployment.md)。

## 已验证与边界

2026-09-06：本地浏览器检查全部 11 个技能详情、四步流程、五个任务场景、搜索筛选、空结果、排版开关及手机详情定位。桌面、375px 与 320px 布局已检查，320px 无横向溢出。浏览器记录中未发现 JavaScript 错误。

本页是能力说明和交互示意，不调用 AI、不执行上游 Skill。网页检查不能代替上游效果评测，也不是全面无障碍认证。详见[验证记录](../notes/02-validation-and-experiments.md)。

## 完整效果演示：研究工作台

2026-09-06 新增 [效果实验室](http://127.0.0.1:4309/0905_codex_project/projects/009-jakubkrehel-skills/lab.html)。先按上面的命令构建并启动预览。

- lab.html / lab.css / lab.js：前后对照、六类规则开关、场景控制与测量显示。
- preview.html / preview.css / preview.js：共享同一实现的真实可操作工作台。
- project-data.json：构建时从 001、002、009 的 project.json 生成的数据快照。

支持搜索、收藏及收藏筛选、原生详情弹窗、添加临时项目、空表单校验和错误重试。父页面把搜索、收藏与新增状态同步给两个 iframe。数据仅存在于当前页面内存，刷新会丢失；独立打开的工作台使用自己的临时状态。

控制项包含常规、长标题、空数据、错误、18 项数据；自适应、375px 和 320px 容器；均衡、紧凑、阅读优先三种密度方案。固定容器宽度包含边框与滚动条，指标会另报实际内容宽度。外层手机过窄时，预览区域可局部横向滚动。

实验基线是本研究特意构建的待优化页面，不是已有网站缺陷的截图。优化版由代理依据六个上游领域中的选定规则实现，并完成真实浏览器检查；页面自身不调用 AI，也不代表上游 11 个 Skill 的完整自动评测。详情见 [完整演示验证记录](../notes/03-live-demo.md)。


## RUN-001：真实页面执行链

打开 [真实执行档案](http://127.0.0.1:4309/0905_codex_project/projects/009-jakubkrehel-skills/run.html)。本轮输入是已经存在的能力图谱，而非早期 lab 中构建的基线。代理读取固定上游规则，审查真实页面，处理发现，修改代码并复核。

交付包括原始冻结快照、SHA-256、实际文件 diff、五项审查发现及修复、共享卡片场景页、真实页面中的三种密度候选、首屏图层实测解释和明确覆盖范围。

- run.html：执行档案与真实版本切换。
- evidence/before/：原始文件快照，不应为展示效果而回写。
- evidence/baseline.json / after.json：源文件散列。
- evidence/changes.diff / report.md：实际差异与详细审查记录。
- skill-card.js / skill-data.js：主页面使用的共享组件与原始 11 项数据。
- stress.html：直接导入真实组件的固定场景页。
- variants.html：构建时由真实主页面生成，variants.js / variants.css 提供密度候选。用户尚未选定，未执行候选定稿与清理。

新增验证命令：

```sh
node projects/009-jakubkrehel-skills/web/verify-run.mjs
```

检查冻结快照完整性、11 项数据无损、可见选中状态和转义。证据目录随站点发布；记录只包含研究资料，不含凭据。尚未线上部署。
