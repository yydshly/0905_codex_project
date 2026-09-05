import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'dist');
const prefix='/0905_codex_project/projects/009-jakubkrehel-skills/';
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8'};
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/'){res.writeHead(302,{Location:prefix});res.end();return;}
  if(!url.pathname.startsWith(prefix)){res.writeHead(404);res.end('Not found');return;}
  let name;try{name=decodeURIComponent(url.pathname.slice(prefix.length))||'index.html';}catch{res.writeHead(400);res.end('Bad request');return;}
  const file=path.resolve(root,name);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);
});
server.listen(Number(process.env.PORT||4309),'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:'+server.address().port+prefix));
