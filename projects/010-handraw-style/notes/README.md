# 源码与验证笔记

[返回研究概览](../README.md) · [对照实验方案](./experiment-plan.md)

## 研究范围与版本

- 日期：2026-09-06。
- 上游固定 commit：`e51f4f8b9edfd8d2f83e18a4a8eecc6dd5db51a7`。
- 方法：读取 GitHub 提交与递归文件树，核对固定版本 JSON 数据，阅读 Skill、提示词脚本与参考图决策脚本；结合前一轮对风格表、能力表和校验脚本的阅读进行整理。
- 初期只做上游静态核对，随后新增独立网页，最后用内置 image_gen 与 003、013、193 参考图生成三个实际场景。未安装或完整执行上游 Skill，未部署网页。
- 比较依据为本仓库 003、004、005、008 的既有研究版本，不宣称这些上游的最新版本均已重新核对。

## 来源索引

链接固定到本次 commit，避免分支更新改变证据。

| 来源 | 用途 |
| --- | --- |
| [README](https://github.com/yang0/handraw-style/blob/e51f4f8b9edfd8d2f83e18a4a8eecc6dd5db51a7/README.md) | 面向用户的定位与调用方式 |
| [Skill](https://github.com/yang0/handraw-style/blob/e51f4f8b9edfd8d2f83e18a4a8eecc6dd5db51a7/handdraw-style-prompter/SKILL.md) | 普通提示词和显式生图的行为约定 |
| [风格 Markdown 表](https://github.com/yang0/handraw-style/blob/e51f4f8b9edfd8d2f83e18a4a8eecc6dd5db51a7/styles_200_reorganized.md) | 权威资料，文件名保留 200 但范围扩至 216 |
| [styles.json](https://github.com/yang0/handraw-style/blob/e51f4f8b9edfd8d2f83e18a4a8eecc6dd5db51a7/handdraw-style-prompter/references/styles.json) | 编号、分组、参考名称、生图名称和特征 |
| [能力配置](https://github.com/yang0/handraw-style/blob/e51f4f8b9edfd8d2f83e18a4a8eecc6dd5db51a7/handdraw-style-prompter/references/model_capabilities.json) | 模型与风格分支选择的预设数据 |
| [resolve_reference.py](https://github.com/yang0/handraw-style/blob/e51f4f8b9edfd8d2f83e18a4a8eecc6dd5db51a7/handdraw-style-prompter/scripts/resolve_reference.py) | 名称、特征和参考图的实际条件分支 |
| [prompt_style.py](https://github.com/yang0/handraw-style/blob/e51f4f8b9edfd8d2f83e18a4a8eecc6dd5db51a7/handdraw-style-prompter/scripts/prompt_style.py) | 固定模板提示词草稿 |
| [validate_library.py](https://github.com/yang0/handraw-style/blob/e51f4f8b9edfd8d2f83e18a4a8eecc6dd5db51a7/handdraw-style-prompter/scripts/validate_library.py) | 资料、编号、文件、规则分支与格式检查 |
| [画廊源码](https://github.com/yang0/handraw-style/blob/e51f4f8b9edfd8d2f83e18a4a8eecc6dd5db51a7/handdraw-style-prompter/gallery/index.html) | 原始视觉入口；链接为源码页，不是部署演示 |

## 本轮实际核对

通过 PowerShell 读取固定版本文件树与 JSON，得到：

| 项目 | 核对结果 | 证据边界 |
| --- | --- | --- |
| 风格索引条目 | 216 | 数量不代表逐款出图验证 |
| 单图文件路径 | 216 | 文件树存在，不等于逐张查看图像 |
| 空视觉特征条目 | 16 | 不代表必定走参考图；名称分支可能优先命中 |
| 能力表模型键 | 只有 gpt-image-2 | 只是上游配置标识，不证明当前宿主模型或可用性 |
| 名称能力标为 strong 的条目 | 78 | 静态标签数量，不是实测成功数 |
| 许可文件 | 文件树未发现 LICENSE 文件 | 本轮未复制上游实现或图像 |

## 实现细节

### 能力判断来自查表

决策脚本合并默认配置、模型配置和编号覆盖配置，再依次检查名称能力、特征能力与特征是否存在。模型未登记时退回参考图。

它没有调用图像模型来测量能力；表中标签未附逐条实验输入、输出和评分。校验脚本验证预设分支，没有对生成结果做视觉评测。

### 提示词脚本不自动翻译

`prompt_style.py` 的中文和英文段落都插入同一个 `args.theme`，主体限制与文字要求也复用原始输入。中文主题不会由该脚本自动译成英文。自然双语组织是对话 Agent 的任务，CLI 只是模板草稿工具。

普通提示词模式不自动加入核心特征；显式生图模式才根据分支选择是否补特征。

### 固定路径与图像约束需要适配

Skill 画廊入口和脚本参考图路径固定在作者的 `E:\handraw-style` 下。迁移时需解析实际项目路径，并核对工具是否支持参考图片参数。

传图时要求忽略原图主体、构图与故事，只借鉴视觉语言。该约束是提示词意图，不能由脚本保证效果。

## 验证记录与未验证项

- 已核对固定提交、文件树、索引数量、空特征数和能力标签数。
- 已核对普通提示词、显式生图、CLI 主题插值与固定路径实现。
- 本地交付检查通过：索引同步后，研究仓库检查确认 10 个项目的编号、资料、封面与首页一致；本子项目 Markdown 相对文件链接检查通过。
- 未运行上游 validate_library.py，不声称其全部校验通过。
- 未逐图查看图库，未测量风格匹配、主题遵循、人物保真、跨模型一致性或成本。
- [实验方案](./experiment-plan.md)为未来工作，不计入当前完成范围。

## 素材与许可处理

保存原创中文分析、独立网页与本地页面截图，不归档上游实现、整套风格文案或图库。本轮未发现明确 LICENSE；后续若引入实现或素材，再核实对应使用条件与署名要求。

网页实现与实际交互检查见[网页验证记录](./web-verification.md)。后续三个实际场景见[生成记录](../assets/generated/REVIEW.md)：提供局部样本观察，不等于完整 Skill 或全库评测。
