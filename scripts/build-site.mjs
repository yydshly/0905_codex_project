import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const site=path.join(root,'_site');
const projects=path.join(root,'projects');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
// Build every opted-in project before replacing the aggregate output.
const published=[];
for(const entry of fs.readdirSync(projects,{withFileTypes:true})){
  if(!entry.isDirectory())continue;
  const web=path.join(projects,entry.name,'web');
  const manifest=path.join(web,'publish.json');
  if(!fs.existsSync(manifest))continue;
  const config=JSON.parse(fs.readFileSync(manifest,'utf8'));
  if(config.build!=='build.mjs'||config.output!=='dist')throw new Error('Unsupported publish contract: '+entry.name);
  execFileSync(process.execPath,[path.join(web,config.build)],{cwd:web,stdio:'inherit'});
  if(!fs.existsSync(path.join(web,config.output,'index.html')))throw new Error('Missing index: '+entry.name);
  published.push({...JSON.parse(fs.readFileSync(path.join(projects,entry.name,'project.json'),'utf8')),folder:entry.name,dist:path.join(web,config.output)});
}
if(!published.length)throw new Error('No publishable projects');
published.sort((a,b)=>a.id-b.id);
const resolved=path.resolve(site);
if(resolved!==path.join(root,'_site'))throw new Error('Invalid output directory');
fs.rmSync(resolved,{recursive:true,force:true});
fs.mkdirSync(path.join(site,'projects'),{recursive:true});
for(const project of published)fs.cpSync(project.dist,path.join(site,'projects',project.folder),{recursive:true});
fs.writeFileSync(path.join(site,'.nojekyll'),'');
const cards=published.map(p=>`<a class="card" href="./projects/${esc(p.folder)}/"><span>RESEARCH / ${String(p.id).padStart(3,'0')}</span><h2>${esc(p.name)}</h2><p>${esc(p.summary)}</p><b>打开研究网页 ↗</b></a>`).join('');
fs.writeFileSync(path.join(site,'index.html'),`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GitHub 项目研究集</title><style>*{box-sizing:border-box}body{margin:0;background:#f8f7f2;color:#233b31;font:16px/1.8 "Segoe UI","Microsoft YaHei",sans-serif}main{max-width:1150px;margin:auto;padding:65px 28px}header{display:flex;justify-content:space-between;border-bottom:1px solid #dce0d5;padding-bottom:25px;font-size:13px}a{color:inherit}h1{font:clamp(34px,6vw,65px)/1.4 Georgia,SimSun,serif;margin:70px 0 20px}.intro{color:#6b756b;max-width:660px;margin-bottom:45px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,330px),1fr));gap:22px}.card{text-decoration:none;border:1px solid #dce0d5;background:#fffefa;border-top:3px solid #24523f;padding:30px;border-radius:6px}.card:hover{background:#eef1e8}.card span{font-size:11px;letter-spacing:2px;color:#6b756b}.card h2{font-size:24px}.card p{font-size:14px;color:#6b756b}.card b{font-size:13px}footer{margin-top:60px;color:#6b756b;font-size:12px}a:focus-visible{outline:2px solid #a3562c;outline-offset:5px}</style></head><body><main><header><b>项目研究集 / OPEN RESEARCH</b><a href="https://github.com/yydshly/0905_codex_project">GitHub 仓库 ↗</a></header><h1>理解项目，<br>记录可复用的知识。</h1><p class="intro">从来源和设计，到验证、处理逻辑与可运行网页。这里汇总每个独立项目的研究入口，按固定编号持续积累。</p><div class="grid">${cards}</div><footer>已发布 ${published.length} 个项目 · 每次构建汇总全部启用发布的子项目。</footer></main></body></html>`);
console.log('已汇总 '+published.length+' 个研究网页到 _site。');
