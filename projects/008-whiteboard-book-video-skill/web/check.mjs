import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const dist=path.join(root,'dist');
const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'HTML IDs must be unique');
let checked=0;
for(const [,link] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(link.startsWith('https://')){new URL(link);continue;}
  if(link==='../../')continue; // Stable project URL returns to the aggregate navigation page.
  if(link.startsWith('#')){assert(ids.includes(link.slice(1)),`Missing anchor: ${link}`);}
  else {assert(link.startsWith('./'),`Non-relative asset: ${link}`);assert(fs.existsSync(path.join(dist,link)),`Missing asset: ${link}`);}
  checked++;
}
assert(!/<a\s+data-source=/.test(html),'Source links must work without JavaScript');
assert.equal(fs.readdirSync(dist).sort().join(','),'app.js,cases-data.mjs,cases.css,cases.js,index.html,media,samples,styles.css','Unexpected publish files');
assert.equal(fs.readdirSync(path.join(dist,'media')).sort().join(','),'poster.png,small-steps.mp4','Unexpected media files');
for(const id of ['reading','project','training'])assert(fs.readFileSync(path.join(dist,'samples',id+'.md'),'utf8').includes('### 6.'),'Incomplete scenario script: '+id);
console.log(`008 检查通过：${checked} 个本地资源与锚点，静态源码链接、唯一 ID 和发布文件白名单。`);
