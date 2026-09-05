import {mkdir, copyFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
await import('./generate-research.mjs');
const root=path.dirname(fileURLToPath(import.meta.url));
await mkdir(path.join(root,'dist'),{recursive:true});
for(const file of ['index.html','styles.css','app.js','data.js','details.js']) await copyFile(path.join(root,file),path.join(root,'dist',file));
await copyFile(path.join(root,'../assets/workflow-map.svg'),path.join(root,'dist/workflow-map.svg'));
console.log('007 dzhng-skills：已构建静态研究网页。');
