# 中文交互研究网页

原生 HTML / CSS / JavaScript，无网络字体、CDN 或 API 请求；外部访问仅发生在用户点击来源链接时。浏览器需要支持 ES Modules。Node.js 22+ 用于构建与本地预览，无需安装第三方依赖。

## 运行

在本目录执行：

```sh
npm run check
npm run build
npm start
```

访问 [本地网页](http://127.0.0.1:4177/0905_codex_project/projects/007-dzhng-skills/)。

预览服务仅绑定 127.0.0.1，端口由 PORT 环境变量指定（默认 4177）。使用稳定子路径，便于检验 GitHub Pages 下的资源地址。不要通过 file:// 打开含模块脚本的入口。

## 文件职责

| 文件 | 职责 |
| --- | --- |
| index.html | 内容章节与页面结构 |
| styles.css | 编辑式布局、移动端与减少动态效果适配 |
| data.js | 22 个技能、固定版本来源和三种教学场景 |
| app.js | 搜索筛选、详情、流程步骤与锚点初始化 |
| build.mjs | 将四个静态源文件复制到 dist/ |
| serve.mjs | 本地预览服务，不进入发布产物 |
| publish.json | 接入 Pages 汇总构建 |

## 构建与发布

静态资源全部使用相对链接，无 history 路由。目标子路径为 /0905_codex_project/projects/007-dzhng-skills/。总仓库 scripts/build-site.mjs 自动发现 publish.json，并汇总到 _site/projects/007-dzhng-skills/。

目前仅完成本地验证，没有验证线上部署。project.json 的 demo 保持空值；实际发布并验证后再填写，见[部署约定](../../../docs/deployment.md)。

## 交互验收

检查 22 项初始列表、四类数量、中文搜索、搜索与类别组合、空结果重置、技能详情来源、三个场景切换、首末步骤按钮、键盘 Enter 操作及锚点刷新。浏览器操作记录见[研究笔记](../notes/README.md)。

页面不会执行真实 Agent、修改用户文件或调用模型。所有产物是明确标注的教学示例。


## 完整能力图与详细内容维护

新增 details.js 保存全部技能的工作方法、输入案例、调用时机，以及模型增强后的价值判断。data.js 将其与原有能力字段组合；网页详情与 notes/skills-guide.md 共用内容。

运行 node generate-research.mjs 生成文档和 assets/workflow-map.svg；build.mjs 会自动执行生成，并把 details.js 与 workflow-map.svg 纳入发布文件。

网页 #complete-map 支持缩放和原图查看，#skill-value 展示分析与建议评测方案。总览图为原创矢量示意，不是上游运行记录。
