# 架构图

- `architecture.png`：GitHub 根 README 与项目 README 使用的完整中文架构图。
- `architecture.svg`：同内容矢量图，可放大阅读。
- 类型：根据源码自行绘制的架构示意，非上游截图、运行结果或宣传海报。
- 来源：`deusyu/translate-book` commit `5d07e733fa9318ff9c718085191c0c2243f51383`，依据见[核验笔记](../notes/README.md)。
- 配色：蓝色为脚本与转换工具，绿色为 AI 语义任务，橙色为共享记录，虚线区域为后续建议。

## 重建

绘图源文件为 [tools/draw_architecture.py](../tools/draw_architecture.py)。需要 Python 3.10+、Pillow；依赖仅用于图片生成，不是上游翻译环境。

在总仓库根目录执行：

```sh
python projects/002-translate-book/tools/draw_architecture.py
node scripts/projects.mjs sync
node scripts/projects.mjs check
```

默认使用 Windows Microsoft YaHei。其他环境通过 `--font /path/to/cjk-font.ttf --bold-font /path/to/cjk-bold.ttf` 指定中文字体。PNG 是字体渲染结果；SVG 使用系统字体回退，跨平台字形可能略有不同。
