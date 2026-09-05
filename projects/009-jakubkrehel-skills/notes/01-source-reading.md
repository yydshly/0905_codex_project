# 源码阅读与证据索引

## 固定研究版本

研究日期：2026-09-05。上游：[jakubkrehel/skills](https://github.com/jakubkrehel/skills/tree/267330e1adfc66a718fb65fa6918c1f06d0a689e)。通过临时目录浅克隆并读取 HEAD，确认研究版本为 267330e1adfc66a718fb65fa6918c1f06d0a689e。临时检出未作为子项目源码引入。

## 目录职责

| 路径 | 作用 |
| --- | --- |
| skills/*/SKILL.md | 技能名称、描述、流程、规则和输出要求，共 11 个入口 |
| skills/*/*.md | 领域参考资料、检查配方或报告格式 |
| skills/*/agents/openai.yaml | 展示信息，部分技能含显式调用策略 |
| .claude-plugin/plugin.json | 插件元数据；声明版本 1.6.3 |
| .claude-plugin/marketplace.json | 插件市场入口 |
| opencode.json | 配置本仓库 skills 搜索路径 |
| LICENSE | MIT 许可与原作者版权声明 |

仓库中的配置与文档描述了宿主应如何发现和执行技能；它们不等于经过本研究验证的跨宿主兼容性。参考文档含代码片段，但仓库没有独立应用运行时或完整测试平台。

## 核心证据

| 结论 | 固定版本源码 | 阅读要点 |
| --- | --- | --- |
| 综合入口维护编排与共同报告规则 | [better-interface](https://github.com/jakubkrehel/skills/blob/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/better-interface/SKILL.md) | 六领域顺序、证据、严重程度、根因合并、最多 15 项、默认只读 |
| PR 与工作区审查有独立范围解析 | [interface-review](https://github.com/jakubkrehel/skills/blob/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/interface-review/SKILL.md) | diff 两侧、新增/回归/历史分类、历史最多三项、不计入本次裁决 |
| 文件变化需要扩展到受影响页面 | [scope-resolution](https://github.com/jakubkrehel/skills/blob/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/interface-review/scope-resolution.md) | 通常扩展一层，变量和基础组件可扩展两层；限制消费者数量并报告遗漏 |
| 网页解释区分证据强度 | [explain-interface](https://github.com/jakubkrehel/skills/blob/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/explain-interface/SKILL.md) | 测量、推导、推测；截图是重建解释；图层顺序比参数罗列更重要 |
| 边界检查直接使用真实组件 | [break](https://github.com/jakubkrehel/skills/blob/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/break/SKILL.md) | 临时页面、真实组件、适用场景、一次观察、页面作为交付物 |
| 场景按组件输入筛选 | [scenarios](https://github.com/jakubkrehel/skills/blob/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/break/scenarios.md) | 文本长度、文本形态、数量、状态；环境模式由观察者切换 |
| 方案应有可归因差异 | [variant](https://github.com/jakubkrehel/skills/blob/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/variant/SKILL.md) | 默认三个方案、一个主要维度、真实上下文、URL 参数切换、选择后清理 |
| 配色关注角色与实际测量 | [better-colors](https://github.com/jakubkrehel/skills/blob/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/better-colors/SKILL.md) | 原始颜色与语义变量分层；沿用项目记法；失败先报告 |
| 无障碍优先使用原生平台能力 | [better-accessibility](https://github.com/jakubkrehel/skills/blob/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/better-accessibility/SKILL.md) | 原生控件、可访问名称、焦点、键盘、动态状态与未验证标记 |
| 排版需观察真实内容 | [better-typography](https://github.com/jakubkrehel/skills/blob/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/better-typography/SKILL.md) | 层级、换行、截断恢复、字体特性；含需要本地化适配的配方 |
| 布局面对内容增长而非固定设备表 | [better-layout](https://github.com/jakubkrehel/skills/blob/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/better-layout/SKILL.md) | 内容决定断点、逻辑属性、翻译增长、分组与隐藏内容提示 |
| 文案承担行动与恢复指引 | [better-writing](https://github.com/jakubkrehel/skills/blob/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/better-writing/SKILL.md) | 动词按钮、统一术语、错误恢复与空状态 |
| UI 规则含作者强偏好 | [better-ui](https://github.com/jakubkrehel/skills/blob/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/better-ui/SKILL.md) | 固定 0.96 按压缩放及明确动效数值，需区分规则与风格 |

## 调用和依赖边界

interface-review、explain-interface、break、variant 的入口声明 disable-model-invocation: true，对应配置声明 allow_implicit_invocation: false，体现显式调用意图。实际触发行为由宿主解释，本轮没有验证。

interface-review 依赖 better-interface 汇总裁决；后者缺失时要求只报告范围与文件清单并停止。综合入口缺失某个领域时则标记该领域未审查并继续。依赖关系和降级行为都有文字约定，不能只复制一个入口就假设获得完整能力。

## 评价与限制

1. **优点：** 把规则归属、范围、证据和报告格式写清楚，降低遗漏与重复报告的机会。
2. **工程边界：** 规则由模型解释，缺少确定性执行引擎，仍可能误读、漏查或跳过步骤。
3. **验证边界：** “文档要求测量”与“实际完成测量”是两件事，需要保留命令、页面状态和结果。
4. **风格边界：** 硬编码的视觉配方不应全部转成团队发布门槛。
5. **覆盖边界：** 有数量与范围上限，报告应展示遗漏范围；少量观察不代表全面测试。
6. **扩展机会：** 中文规则、自动工具和缺陷样本评测能补足从流程说明到稳定效果的距离。

这些评价来自实现结构与规则阅读，尚无实测数据证明效率或质量提高的幅度。
