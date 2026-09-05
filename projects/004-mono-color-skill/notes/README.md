# 源码与验证记录

[返回研究概览](../README.md) · [使用指南](./usage.md) · [扩展计划](./extensions.md)

## 版本与方法

- 日期：2026-09-05。
- 上游：`yanliudesign/mono-color-skill`。
- 固定版本：`c8ff70597ddedcd65f21a0b528f6a70c35690b0a`。
- 提交时间：`2026-09-02T11:49:40-07:00`；提交说明：`Add verified poster reference sources`。
- 环境：Windows / PowerShell、Node.js `v22.15.0`、Python `3.10.11`。
- 方法：读取 README、SKILL、六份 JSON 设计目录、评估案例与脚本、绘图脚本、CI 和许可说明；在工作区外的临时克隆中运行两个静态校验脚本。
- 范围：静态研究与规则数据验证，随后按 Skill 工作流通过内置 image_gen 实际生成三张图片；见 [出图记录](../assets/generated/REVIEW.md)。没有安装 Skill、运行辅助绘图脚本、测量生成成本或实际印刷。
- 本仓库未引入上游实现及图片，保留固定版本链接以便复核。

## 证据索引

所有链接固定到本轮研究 commit，避免后续 main 更新改变结论依据。

| 文件 | 支持的结论 | 解释边界 |
| --- | --- | --- |
| [README.zh.md](https://github.com/yanliudesign/mono-color-skill/blob/c8ff70597ddedcd65f21a0b528f6a70c35690b0a/README.zh.md) | 产品定位、场景、安装方式、交付说明 | 展示示例不等于本轮复现结果 |
| [SKILL.md](https://github.com/yanliudesign/mono-color-skill/blob/c8ff70597ddedcd65f21a0b528f6a70c35690b0a/SKILL.md) | 输入理解、配方字段、决策流程、五段提示词、视觉检查、重试规则 | 主要是 Agent 指令，非完整程序化执行器 |
| [colors.json](https://github.com/yanliudesign/mono-color-skill/blob/c8ff70597ddedcd65f21a0b528f6a70c35690b0a/design-system/colors.json) | 三种纸色、19 个墨色、10 个配方、双色默认值 | 墨色集合与已登记配方不是同一个数量 |
| [typography.json](https://github.com/yanliudesign/mono-color-skill/blob/c8ff70597ddedcd65f21a0b528f6a70c35690b0a/design-system/typography.json) | 七类字体角色、层级和适用内容 | 角色描述不等于已加载实际字体 |
| [compositions.json](https://github.com/yanliudesign/mono-color-skill/blob/c8ff70597ddedcd65f21a0b528f6a70c35690b0a/design-system/compositions.json) | 九类布局、主体范围、留白范围和锚点 | 无通用坐标布局求解 |
| [carriers.json](https://github.com/yanliudesign/mono-color-skill/blob/c8ff70597ddedcd65f21a0b528f6a70c35690b0a/design-system/carriers.json) | 海报、刊物、社交封面、唱片、包装、服装、作品集七类载体 | 视觉信号不是实物结构或生产文件 |
| [rhythm.json](https://github.com/yanliudesign/mono-color-skill/blob/c8ff70597ddedcd65f21a0b528f6a70c35690b0a/design-system/rhythm.json) | 三类节奏配置，焦点与安静区域 | 构图质量仍需检查真实图像 |
| [imperfections.json](https://github.com/yanliudesign/mono-color-skill/blob/c8ff70597ddedcd65f21a0b528f6a70c35690b0a/design-system/imperfections.json) | 五类瑕疵及范围、稳定种子策略 | 规定哈希策略，没有通用生成端复现实现 |
| [evals.json](https://github.com/yanliudesign/mono-color-skill/blob/c8ff70597ddedcd65f21a0b528f6a70c35690b0a/evals/evals.json) | 16 个请求与预期断言 | 是预先编写的案例数据，不是运行成绩单 |
| [validate_evals.py](https://github.com/yanliudesign/mono-color-skill/blob/c8ff70597ddedcd65f21a0b528f6a70c35690b0a/scripts/validate_evals.py) | 检查案例数量、字段、色值、模式与局部取值约束 | 不执行 Agent，不读取生成图 |
| [validate_design_system.py](https://github.com/yanliudesign/mono-color-skill/blob/c8ff70597ddedcd65f21a0b528f6a70c35690b0a/scripts/validate_design_system.py) | 检查目录、ID、范围、引用和指定图片资源 | 图片检查主要是存在性及指定 PNG 尺寸，不是视觉评分 |
| [build_design_system_board.py](https://github.com/yanliudesign/mono-color-skill/blob/c8ff70597ddedcd65f21a0b528f6a70c35690b0a/scripts/build_design_system_board.py) | 绘制设计规则展示板的代码 | 辅助展示脚本，不是任意主题生成管线 |
| [build_vibe_coding_poster.py](https://github.com/yanliudesign/mono-color-skill/blob/c8ff70597ddedcd65f21a0b528f6a70c35690b0a/scripts/build_vibe_coding_poster.py) | 特定海报通过 SVG 和渲染工具绘制 | 布局与文案固定，不能据此推断通用中文排版能力 |
| [CI 配置](https://github.com/yanliudesign/mono-color-skill/blob/c8ff70597ddedcd65f21a0b528f6a70c35690b0a/.github/workflows/validate.yml) | 推送和 PR 时运行校验、检查 JSON 语法 | 无端到端生成测试 |
| [软件许可](https://github.com/yanliudesign/mono-color-skill/blob/c8ff70597ddedcd65f21a0b528f6a70c35690b0a/LICENSE) / [素材许可](https://github.com/yanliudesign/mono-color-skill/blob/c8ff70597ddedcd65f21a0b528f6a70c35690b0a/ASSET-LICENSE.md) | 软件 MIT 与图片许可分开 | 软件许可不自动覆盖示例图和参考图 |

## 实际执行结果

在固定版本临时克隆根目录执行：

```powershell
python scripts/validate_evals.py
python scripts/validate_design_system.py
```

得到：

```text
Validated 16 mono-color evaluation cases.
Validated mono-color design system: 19 inks, 10 palettes, 7 type roles, 9 compositions, 7 carriers, 5 imperfections, 3 rhythm profiles.
```

两个校验通过。它们没有向图像服务发送请求，也没有根据生成图片计算通过率。即使案例里有 `generates_image: true`，那也是期望字段，并不是图片已经生成的证明。

完整复现步骤见[使用指南](./usage.md#复现本轮静态校验)。这次运行没有为研究仓库增加 Python 依赖或上游副本。

## 发现的一致性问题

### 1. 留白范围未在所有来源中统一

`compositions.json` 中 `image field`、`type-led declaration`、`overprint collage` 的留白下限为 20%；`rhythm.json` 的 assertive 配置也允许 20%。但 `SKILL.md` 的通用检查要求 25%–55%，`validate_evals.py` 对明确填写的案例留白数值也要求至少 25%。

Skill 说明精确数值以目录为准，能提供一定优先级依据，但按目录产生 20% 留白后又会遇到通用画面检查的重试要求。当前两个校验分别检查各自的数据，并未把这层矛盾连接起来。

建议把范围统一成按布局和节奏共同解析的条件规则，再让生成与验收使用同一结果。

### 2. 文档配色与机器配方覆盖不完全一致

文档展示八种单色主题和九组双色方案；机器目录登记了 19 个墨色，却只有四个单墨配方与六个双色配方。例如植物绿有墨色 ID 和单色使用说明，但缺少对应的单墨 palette ID；粉蓝 + 信号红有文档说明，但未登记为配方。

当 manifest 要求每次引用已有 palette ID 时，这些请求缺少完全匹配的目录项。`validate_evals.py` 主要检查十六进制颜色格式与数量，未要求案例中的所有色值组合映射到目录配方，所以检查通过不能证明覆盖完整。

建议明确配方究竟是穷举目录还是允许按规则动态构造，避免由 Agent 临时决定 ID。

### 3. 载体视觉与通用画布约束存在张力

`carriers.json` 对包装要求折痕、接缝或标签边界，对服装要求织物或服装轮廓；`SKILL.md` 通用画布又要求正面平面纸面、排除样机等视觉。

可以通过“平面图稿”和“载体概念图”两种输出模式解决，但当前规范尚未清楚分离。本结论来自规则阅读，没有实测这些请求会导致何种失败。

### 4. 稳定种子尚不能落实为通用复现保证

瑕疵目录规定由主体、准确文字、配色、布局产生稳定哈希，但没有通用哈希实现与图像服务参数映射。特定海报脚本虽有固定 SVG 噪声种子，也不能代替任意请求的生成复现管线。

应分别承诺“设计配方一致”“程序纹理可复现”和“模型图片是否可复现”，不要用其中一项代替其他两项。

## 本仓库交付与检查

- 使用 `node scripts/projects.mjs new` 创建固定编号 004，未重排已有编号。
- README 汇总能力、机制和场景；使用指南提供环境与请求示例；扩展计划定义建议功能和实验。
- 后续按用户要求增加静态交互网页，支持能力 / 流程切换、三个使用场景、配色联动、请求编辑与复制下载。图形为原创代码示意，不调用模型。浏览器与构建验证详见[网页记录](../web/README.md)。
- `project.json` 记录本轮研究完成；没有出图效果评测或部署，封面和 demo 留空。
- 首页仅通过 `node scripts/projects.mjs sync` 刷新生成区域。
- 交付检查包括 `node scripts/projects.mjs check`、`git diff --check`，以及新增文档相对文件链接存在性检查。
- 既有 003 项目与首页非生成区域的在途修改保留，不为本任务提交或发布。

## 后续验证尚缺什么

真实模型调用、准确中文排版、人物保真、多张系列的一致性、多尺寸重排、用户修改成本和实物打样均需独立实验。建议从[三组封面对照实验](./extensions.md#最小实验规则和中文排版究竟带来什么收益)开始，保留首轮错误和重试记录，避免把精挑示例当作稳定能力。
