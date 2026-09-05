# 图片与来源

`generated/` 保存本次按 mono-color 规则实际生成的三张原始 PNG，分别为研究封面、单墨阅读专题、双色读书会海报。未进行后期叠字或改色，未复制作者示例。

- 执行：Agent 读取上游规则与目录，调用内置 image_gen。
- 配方：generated/recipes.json。
- 原始提示词：generated/*-prompt.txt。
- 人工检查与边界：generated/REVIEW.md。
- 封面使用本次 AI 生成研究图，明确标注为生成图片，并非运行截图。

上游作者示例与第三方参考图不属于软件 MIT 许可的自动授权范围。本项目没有复制这些图片。

## 首页能力总览

首页封面改为 overview.png（1600×1000）：左侧说明输入、规则、生成与交付，右侧展示三张本项目实际生成样本。overview.html 是可编辑的原创排版源文件，render-overview.cjs 使用 Playwright 截图导出 PNG；未修改三张原图。安装 Playwright 后可运行 `node assets/render-overview.cjs`；也可用 PLAYWRIGHT_MODULE 指向已有模块。作者案例不进入这张封面。
