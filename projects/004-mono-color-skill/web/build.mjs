import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {cases,renderCases} from './cases.mjs';
const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, 'dist');
fs.mkdirSync(output, {recursive: true});
const assets = path.join(root, '../assets/generated');
fs.cpSync(assets, path.join(output, 'generated'), {recursive:true});
const recipes=JSON.parse(fs.readFileSync(path.join(assets,'recipes.json'),'utf8'));
const reviews={research:'观察：中文标题可辨读，蓝色主体与橙色书签形成分工，书页有网点。偏差：标题与主体没有紧密交叠，辅墨看起来少于配方目标；未作像素占比测量。',reading:'观察：单墨外观、文学感字形和翻页动作明确，网点在手部与书页可见。边界：未提供参考照片，不能据此证明照片或人物保真；干边效果没有单独验证。',event:'观察：绿色椅子与书形成主体，红色承担辅助信息，中文标题可辨读。边界：这是读书会概念图，无真实日期地点；辅墨占比与目标不完全一致。'};
const demos=recipes.recipes.map(r=>({...r,prompt:fs.readFileSync(path.join(assets,r.prompt_file),'utf8'),review:reviews[r.id]}));
fs.writeFileSync(path.join(output,'demos.js'),'window.MONO_DEMOS='+JSON.stringify(demos)+';');
fs.writeFileSync(path.join(output,'cases-data.js'),'window.MONO_CASES='+JSON.stringify(cases)+';');
fs.writeFileSync(path.join(output,'index.html'),fs.readFileSync(path.join(root,'index.html'),'utf8').replace('<!-- AUTHOR_CASES -->',renderCases()));
for (const file of ['styles.css', 'app.js','showcase.js']) {
  fs.copyFileSync(path.join(root, file), path.join(output, file));
}
console.log('004 mono-color：已构建静态研究网页。');
