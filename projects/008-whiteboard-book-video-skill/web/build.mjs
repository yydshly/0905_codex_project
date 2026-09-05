import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {caseStudies} from './cases-data.mjs';
const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, 'dist');
fs.mkdirSync(output, {recursive:true});
// Explicit allowlist keeps research notes and private/local files out of the site.
for (const file of ['index.html','styles.css','app.js','cases.css','cases.js','cases-data.mjs']) {
  let content = fs.readFileSync(path.join(root,file),'utf8');
  if (file==='index.html') content=content.replace(/data-source="([^"]+)"/g,(_,source)=>`href="https://github.com/nutllwhy/whiteboard-book-video-skill/blob/aac0295461f381c4a6052b28802221cfec7b28b9/${source}" data-source="${source}"`);
  fs.writeFileSync(path.join(output,file),content);
}
fs.mkdirSync(path.join(output,'samples'),{recursive:true});
fs.mkdirSync(path.join(output,'media'),{recursive:true});
const production=path.resolve(root,'../production/small-steps');
fs.copyFileSync(path.join(production,'web-video.mp4'),path.join(output,'media/small-steps.mp4'));
fs.copyFileSync(path.join(production,'assets/shot-01.png'),path.join(output,'media/poster.png'));
for (const [id,d] of Object.entries(caseStudies)) {
  const text=`# ${d.title}\n\n${d.goal}\n\n## 原始材料\n\n${d.input}\n\n来源：${d.origin}\n\n## 口播与分镜\n\n${d.shots.map((s,i)=>`### ${i+1}. ${i*5}–${i*5+5} 秒：${s[0]}\n\n口播：${s[1]}\n\n画面要点：${s[2].join(' / ')}\n\n重点：${s[3]}\n\n编排理由：${s[4]}`).join('\n\n')}\n\n说明：本研究场景样例。时间为示意分配，真实制作应按配音重排；未执行上游生图、配音或 MP4 渲染。\n`;
  fs.writeFileSync(path.join(output,'samples',id+'.md'),text);
}
console.log('008：已构建研究网页与 3 份可下载场景脚本（无第三方依赖）。');
