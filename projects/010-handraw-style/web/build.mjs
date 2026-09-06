import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import crypto from 'node:crypto';
const web=path.dirname(fileURLToPath(import.meta.url));
const dist=path.join(web,'dist');
fs.mkdirSync(dist,{recursive:true});
for(const name of ['index.html','overview.html','styles.css','app.js','gallery.js','gallery.css','examples.js']) fs.copyFileSync(path.join(web,name),path.join(dist,name));
const generated=path.resolve(web,'../assets/generated');
for(const item of JSON.parse(fs.readFileSync(path.join(generated,'files.json'),'utf8'))){
 const bytes=fs.readFileSync(path.join(generated,item.file));
 if(crypto.createHash('sha256').update(bytes).digest('hex')!==item.sha256)throw new Error('Generated image changed: '+item.file);
}
fs.mkdirSync(path.join(dist,'generated'),{recursive:true});
for(const name of ['article-reading-v1.png','habits-triptych-v1.png','weekend-tea-v1.png','prompts.json','files.json','REVIEW.md'])fs.copyFileSync(path.join(generated,name),path.join(dist,'generated',name));
console.log('010 构建完成：中文能力研究网页，无第三方依赖。');
