# 三个场景的实际生图实验

日期：2026-09-05。上游规则版本：`b51eff18eed78926e85f3e5602e1f79b220c7925`。

## 执行范围

本次使用内置 `image_gen` 进行实际生成和图像编辑，不是仅展示上游图片，也不是用 CSS 滤镜伪造结果。共 5 次成功提交：2 次生成输入样图、2 次基于这些样图的编辑、1 次纯文字海报生成。每项保留第一版，没有重试和另行修图。

具体底层模型标识、随机种子和计费信息未由工具返回，均不推断。全部提示词见 [generation-prompts.md](./generation-prompts.md) 和 [JSON](./generation-prompts.json)，文件尺寸、字节数及 SHA-256 见 [generated-assets.json](./generated-assets.json)。

本次实验根据上游公开视觉规则撰写场景指令；没有安装或完整执行官方 Skill，没有携带其运行参考图，也没有执行随机设定或印刷后处理脚本。因此，这是三组“公开规则 + 多模态模型”的改编演示，不能用于宣称完整官方 Skill 的质量或成功率。

风格规则作者：@威比 Hunter Wei.（抖音、小红书同名）。[上游来源](https://github.com/Vieeeeeee/wibi-style) · [原许可存档](./upstream-LICENSE.txt)。本实验用于个人非商业研究。

## 场景一：人像 → 电蓝海报

输入：本次 AI 生成的虚构成年女性，短深色发、圆框眼镜、银色耳环、轻微闭口微笑与绿色毛衣。不是用户本人、真实拍摄或上游原片。

- 生成输入：`assets/generated/portrait-input-v1.png`，1254×1254 PNG。
- 编辑输出：`assets/generated/portrait-output-v1.png`，1254×1254 PNG。
- 实际附件：编辑调用通过 referenced_image_paths 指定上述输入文件，已先查看图像。
- 风格来源：[electric-blue-halftone-poster 的规则](https://github.com/Vieeeeeee/wibi-style/blob/b51eff18eed78926e85f3e5602e1f79b220c7925/skills/electric-blue-halftone-poster/references/style-prompt.md)。

目视观察：眼镜、发型、微笑、耳环和整体人物关系仍可辨认；黑白大头、电蓝背景、三红三黄六颗星星及右下装饰条码均出现。实际网点比目标粗网点偏细，头发外缘存在白色细边，部分明暗以网点为主，不能判定严格通过全部质量门槛。身份保留仅为这一对样图的目视判断，未运行身份相似度评测。

## 场景二：餐桌 → 复古杂志

输入：本次 AI 生成的普通木桌餐照，番茄意面、三片罗勒、芝士碎片、蓝细边白盘、水杯、叉子与浅色餐巾。

- 生成输入：`assets/generated/table-input-v1.png`，1086×1448 PNG。
- 编辑输出：`assets/generated/table-output-v1.png`，1086×1448 PNG。
- 实际附件：编辑调用以该餐照文件为唯一图像输入。
- 风格来源：[retro-table-print 的构建规则](https://github.com/Vieeeeeee/wibi-style/blob/b51eff18eed78926e85f3e5602e1f79b220c7925/skills/retro-table-print/references/build.md)。

目视观察：保留三片罗勒、蓝边白盘、水杯、叉子和餐巾；主盘移向右下并出框，左上形成连续红色留白。部分芝士和面条的局部细节被重绘，红底仍有明显颗粒，不能认为食品形态逐像素保持。模型直接表现了印刷质感；未执行 `vintage_finish.py`，没有把结果称为完整官方后处理效果。

## 场景三：文字 → 水豚开会

没有输入图片。场景需求：一只水豚在办公室开会，情绪稳定；以中文 Y2K 杂志形式表现。

- 输出：`assets/generated/office-output-v1.png`，1086×1448 PNG。
- 主标题：`今天也很稳定`。
- 四组蓝色边注：`情绪稳定`、`准时下班`、`会议观察`、`保持平静`。
- 风格来源：[office-animals 的视觉规则](https://github.com/Vieeeeeee/wibi-style/blob/b51eff18eed78926e85f3e5602e1f79b220c7925/skills/office-animals/references/style-prompt.md)。

目视观察：水豚、会议桌、文件和电脑构成清楚场景；主标题与四组边注可辨认，红色与蓝色的文字层次已呈现。红色描边包住部分椅子，纸张边缘旧化偏重；不是完全符合“只沿动物轮廓、无外部边框”的要求。没有使用官方 `draw_brief.py`；动物、场景与文字由本研究直接指定。

## 从这些结果能知道什么

三组结果展示了两种实际调用：文字生成，以及携带指定输入图片进行编辑。明确的内容约束和视觉规则能组织出方向清楚的结果，但细节、边界和质感仍会偏离要求。

单次样本不能回答总体成功率、跨模型稳定性或成本，也没有证明完整 Skill 一定优于普通提示词。若进一步研究，应固定输入，设计基线对照并记录多次输出。

## 网页呈现

网页“实际效果”提供三场景切换。前两组并排展示 AI 输入素材与实际编辑结果；第三组展示文字需求与实际海报。图片可打开原图、下载 PNG，每个场景明确列出观察与偏差。

网页展示已保存的结果，不在浏览器中运行生成服务。新图均在本项目本地保存并随静态构建发布，效果演示不依赖上游图片热链。
