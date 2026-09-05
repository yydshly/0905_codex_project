import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const dist=path.join(root,'dist');
fs.mkdirSync(dist,{recursive:true});
for(const file of ['index.html','styles.css','app.js','lab.html','lab.css','lab.js','preview.html','preview.css','preview.js'])fs.copyFileSync(path.join(root,file),path.join(dist,file));
for(const file of ['skill-data.js','skill-card.js','variants.js','variants.css','stress.html','stress.js','run.html','run.css','run.js'])fs.copyFileSync(path.join(root,file),path.join(dist,file));
fs.cpSync(path.join(root,'evidence'),path.join(dist,'evidence'),{recursive:true});
const variants=fs.readFileSync(path.join(root,'index.html'),'utf8').replace('</head>','<link rel="stylesheet" href="./variants.css"><script type="module" src="./variants.js"></script></head>');
fs.writeFileSync(path.join(dist,'variants.html'),variants);
const projectsRoot=path.resolve(root,'../..');
const records=['001-awesome-english-ebooks','002-translate-book','009-jakubkrehel-skills'].map(folder=>{
 const data=JSON.parse(fs.readFileSync(path.join(projectsRoot,folder,'project.json'),'utf8'));
 return {id:String(data.id),name:data.name,summary:data.summary,tags:data.tags,source:data.source};
});
fs.writeFileSync(path.join(dist,'project-data.json'),JSON.stringify(records,null,2));
console.log('009 构建完成：静态 HTML、CSS、JavaScript，无第三方依赖。');
