# 中文能力展示页

Node.js 22+，原生 HTML / CSS / JavaScript，无第三方依赖。

在仓库根目录执行：

```sh
node scripts/build-site.mjs
node scripts/check-site.mjs
node projects/006-humanlayer-skills/web/preview.mjs
```

打开 http://127.0.0.1:4186/projects/006-humanlayer-skills/ 。环境变量 HUMANLAYER_PREVIEW_PORT 可修改端口。

独立构建：`node projects/006-humanlayer-skills/web/build.mjs`，输出 web/dist/。publish.json 接入仓库统一构建。样式、脚本、文件使用相对路径，页内导航使用 hash，返回导航链接按站点稳定子路径设计。

包含五项能力面板、三种闭环场景、待审 PR 阻挡与应用建议。不调用模型，不创建 PR，不持久保存模拟记忆。尚未验证线上部署，演示字段留空。
