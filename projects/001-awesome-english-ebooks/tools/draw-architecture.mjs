import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const out = fileURLToPath(new URL('../assets/architecture.svg', import.meta.url));
const esc = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const colors = { fact:['#edf5ee','#226147'], unknown:['#fff5e8','#ac641e'], plan:['#eef2fc','#455c91'] };
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="1290" viewBox="0 0 1500 1290" role="img" aria-labelledby="title desc"><title id="title">英语外刊：来源、上游交付与下游处理完整架构</title><desc id="desc">绿色为已核实结构，橙色虚线为上游未公开的生产过程，蓝色为建议实现的获取、解析、清洗、结构化和应用流程。</desc><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8" fill="none" stroke="#879087" stroke-width="1.5"/></marker></defs><rect width="1500" height="1290" fill="#faf9f5"/><g font-family="Arial, Microsoft YaHei, sans-serif"><text x="45" y="58" font-size="30" font-weight="700" fill="#173c30">从内容来源，到可用知识</text><text x="45" y="96" font-size="18" fill="#606a62">awesome-english-ebooks · 架构研究示意 · 2026-09-05 · commit 56973cd</text>`;
const text=(x,y,s,size=18,color='#273d33',weight=400)=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}">${esc(s)}</text>`;
function box(x,y,w,h,title,lines,type='fact') {
 const [fill,stroke]=colors[type];
 svg+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="1.5" ${type==='unknown'?'stroke-dasharray="7 5"':''}/>`;
 svg+=text(x+20,y+32,title,21,stroke,700);
 lines.forEach((s,i)=>svg+=text(x+20,y+61+i*25,s,17));
}
function label(y,n,t,s){svg+=text(45,y,n,16,'#7c867e',700)+text(45,y+34,t,23,'#173c30',700)+text(45,y+62,s,15,'#69746c');}
function arrow(y1,y2,dash=false){svg+=`<path d="M815 ${y1} V${y2}" stroke="#879087" stroke-width="2" ${dash?'stroke-dasharray="7 5"':''} fill="none" marker-end="url(#arrow)"/>`;}
[['fact','已核实'],['unknown','未公开 / 待核验'],['plan','下游建议实现']].forEach(([k,t],i)=>{
svg+=`<rect x="${45+i*275}" y="126" width="16" height="16" rx="4" fill="${colors[k][0]}" stroke="${colors[k][1]}"/>`+text(70+i*275,141,t,16);
});
label(225,'01 / ORIGINS','内容来源','身份已确认；渠道未知');
box(235,195,275,105,'经济学人',['economist.com','经济 · 商业 · 国际事务']);
box(530,195,275,105,'纽约客',['newyorker.com','文化 · 报道 · 文学']);
box(825,195,275,105,'大西洋月刊',['theatlantic.com','社会 · 观点 · 长篇报道']);
box(1120,195,335,105,'连线',['wired.com','科技 · 科学 · 数字文化']);
arrow(300,350,true);
label(385,'02 / PRODUCTION','上游生产','保留未知边界');
box(235,355,1220,110,'获取 → 整理 → 打包：完整流程未公开',['账号、接口、recipe 内容、调度方式与格式转换顺序均未确认。','样本证据：Atlantic / WIRED 存在 Calibre 元数据；不据此推断完整采集实现。'],'unknown');
arrow(465,510,true);
label(545,'03 / REPOSITORY','公开资源层','文件与链接可核验');
box(235,515,395,120,'按刊物 / 期次归档',['EPUB 211 · MOBI 177 · PDF 180','这是文件数量，不是独立期次数量']);
box(650,515,395,120,'README + GitHub Raw',['分类导航 · 版本记录 · 文件交付','现有用途：下载 → 外部阅读器']);
box(1065,515,390,120,'历史音频索引',['15 个 JSON + Wiki 外链','article / url，无句子时间戳']);
arrow(635,685);
label(720,'04 / ACQUISITION','获取与留存','下游处理建议');
box(235,690,395,100,'来源清单',['commit · 路径 · blob SHA · 使用范围'],'plan');
box(650,690,395,100,'按需获取 / 校验',['格式选择 · 临时文件 · SHA-256'],'plan');
box(1065,690,390,100,'原件与状态留存',['获取时间 · 有限重试 · 失败记录'],'plan');
arrow(790,840);
label(880,'05 / PROCESSING','处理与结构化','保留来源和定位');
box(235,845,290,120,'格式解析',['container → OPF → spine','PDF / MOBI 单独适配'],'plan');
box(545,845,290,120,'清洗与文章拆分',['正文 / 导航 / 推广分离','作者与原文链接另行核验'],'plan');
box(855,845,290,120,'规范化与去重',['刊物 → 期次 → 文章 → 段落','稳定 ID · 修订保留'],'plan');
box(1165,845,290,120,'音频与索引',['标题候选匹配 · 置信度','全文 / 可选向量索引'],'plan');
arrow(965,1015);
label(1055,'06 / APPLICATIONS','阅读与学习','扩展能力，尚未实现');
box(235,1020,395,105,'来源可追溯的阅读',['文章目录 · 原文定位 · 阅读记录'],'plan');
box(650,1020,395,105,'精读与学习',['选句解释 · 生词 · 笔记 · 复习'],'plan');
box(1065,1020,390,105,'专题检索与问答',['时间筛选 · 跨期比较 · 引用回跳'],'plan');
svg+=`<rect x="235" y="1165" width="1220" height="65" rx="12" fill="#e7ebe4"/>`+text(255,1204,'贯穿下游：来源谱系 · 处理版本 · 质量抽查 · 错误隔离 / 重试 · 原文与派生内容分离',19);
svg+=text(45,1265,'本图描述已核实的上游结构与建议的下游系统，不表示全部流程已经实现。',16,'#647066')+'</g></svg>';
fs.writeFileSync(out,svg);
console.log('已生成架构示意图。');
