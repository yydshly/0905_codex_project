import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const site=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../_site');
let checked=0;
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
for(const file of walk(site)){
 if(!file.endsWith('.html'))continue;
 const html=fs.readFileSync(file,'utf8');
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const link=match[1];
  if(/^(https?:|mailto:|data:)/.test(link))continue;
  const [pathAndQuery,anchor]=link.split('#');
  const relative=pathAndQuery.split('?')[0];
  let target=path.resolve(path.dirname(file),relative||path.basename(file));
  if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  if(!target.startsWith(site+path.sep)||!fs.existsSync(target))throw new Error('Broken local link: '+file+' -> '+link);
  if(anchor&&target.endsWith('.html')&&!fs.readFileSync(target,'utf8').includes('id="'+anchor+'"'))throw new Error('Missing anchor: '+link);
  checked++;
 }
}
console.log('静态站点检查通过：'+checked+' 个本地链接与资源。');
