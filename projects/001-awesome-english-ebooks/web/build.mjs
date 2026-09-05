import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import '../tools/draw-architecture.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url));
const data=JSON.parse(fs.readFileSync(path.join(dir,'data.json'),'utf8'));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const link=(url,label,cls='')=>`<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label}<span aria-hidden="true"> ↗</span></a>`;
const format=f=>f==='audio'?'音频 JSON':f.toUpperCase();
const sourceCards=data.sources.map((s,i)=>`<article class="source-card" data-source data-search="${esc(s.name+' '+s.cn+' '+s.topic+' '+s.dir)}" data-formats="${Object.entries(s.formats).filter(([,v])=>v).map(([k])=>k).join(' ')}">
<div class="card-top"><span class="source-number">0${i+1}</span><span class="eyebrow">${s.schedule}</span></div>
<h3>${s.name}</h3><p class="source-cn">${s.cn} <span> / ${s.topic}</span></p>
<div class="format-list">${Object.entries(s.formats).map(([k,v])=>`<span class="${v?'':'muted'}">${format(k)} <b>${v}</b></span>`).join('')}</div>
<p>${s.note}</p><p class="source-status"><span class="status-dot"></span>${s.status}</p>
<div class="card-links">${link(s.official,'出版方官网')}${link(data.upstream+'/tree/'+data.commit+'/'+s.dir,'仓库目录')}${link(data.upstream+'/blob/'+data.commit+'/'+s.sample,'样本文件')}</div>
</article>`).join('');
const stages=data.stages.map((s,i)=>`<button class="stage-button ${i===0?'active':''}" type="button" data-stage="${i}" aria-pressed="${i===0}" aria-controls="stage-panel-${i}"><span>0${i+1}</span>${s.short}<span aria-hidden="true">↗</span></button>`).join('');
const panels=data.stages.map((s,i)=>`<article id="stage-panel-${i}" class="stage-panel" ${i?'hidden':''}><div class="eyebrow">处理步骤 0${i+1} / 07 · 建议实现</div><h3>${s.title}</h3><div class="io"><div><small>输入</small><p>${s.input}</p></div><span aria-hidden="true">→</span><div><small>输出</small><p>${s.output}</p></div></div><dl><dt>处理逻辑</dt><dd>${s.method}</dd><dt>质量检查</dt><dd>${s.check}</dd><dt>失败处理</dt><dd>${s.failure}</dd></dl><p class="insight"><strong>研究提示</strong> ${s.insight}</p></article>`).join('');
const samples=data.sources.map(s=>`<tr><td>${s.cn}</td><td><code>${s.opf}</code></td><td>${s.spine}</td><td>${s.links}</td></tr>`).join('');
const scopeRows=data.sourceScope.map(s=>`<tr><td>${esc(s.name)}</td><td>${esc(s.status)}</td><td>${esc(s.detail)} ${link(s.evidence,'证据')}</td></tr>`).join('');
const refs=data.refs.map(([name,url,detail],i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><div>${link(url,esc(name))}<small>${detail}</small></div></li>`).join('');
const html=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#183e31"><meta name="description" content="英语外刊资源库的来源目录、获取与处理流程、EPUB 样本核验和完整架构研究。"><title>${data.title}｜项目研究 001</title><link rel="stylesheet" href="./styles.css"><script defer src="./app.js"></script></head><body>
<a class="skip" href="#main">跳到主要内容</a>
<aside class="sidebar"><a class="brand" href="../../"><span class="brand-icon" aria-hidden="true">▥</span><span>项目研究集<small>OPEN RESEARCH / 001</small></span></a><div class="nav-caption">本篇研究</div><nav aria-label="研究章节"><a href="#overview" class="active"><span>01</span>研究概览</a><a href="#sources"><span>02</span>内容来源</a><a href="#architecture"><span>03</span>完整架构</a><a href="#pipeline"><span>04</span>获取与处理</a><a href="#evidence"><span>05</span>样本与证据</a><a href="#value"><span>06</span>场景与价值</a></nav><div class="sidebar-bottom"><span class="status-dot"></span> 固定版本研究<small>2026.09.05 · 56973cd</small>${link('https://github.com/yydshly/0905_codex_project/tree/main/projects/001-awesome-english-ebooks','研究文档')}</div></aside>
<main id="main"><header class="topbar"><span>资源研究 <span class="slash">/</span> awesome-english-ebooks</span>${link(data.upstream,'上游仓库')}</header>
<section id="overview" class="hero"><div class="hero-copy"><div class="eyebrow"><span class="status-dot"></span> RESEARCH DOSSIER 001</div><h1>从内容来源，<br>到<span>可用知识。</span></h1><p class="lead">理解英语外刊资源库的真正价值：<br>来源如何组织，文件如何交付，获取之后如何处理。</p><div class="hero-actions"><a class="button primary" href="#sources">浏览内容来源 <span>↗</span></a><a class="button" href="#architecture">查看完整架构 <span>↓</span></a></div></div><div class="hero-note"><div class="eyebrow">本篇核心判断</div><h2>来源是起点，<br>处理决定可用性。</h2><p>这个仓库提供外刊文件与导航。将它用于精读、检索和知识整理，还需要建立可追溯的文章处理层。</p><div class="mini-flow"><span>出版方 / 来源</span><b>↓</b><span>上游资源库</span><b>↓</b><span class="outline">文章处理层 · 扩展</span><b>↓</b><span class="outline">阅读与检索 · 扩展</span></div></div></section>
<div class="stats"><div><strong>04</strong><span>当前有文件的刊物目录</span></div><div><strong>568</strong><span>电子书文件 / 三种格式</span></div><div><strong>04</strong><span>实际抽查 EPUB</span></div><div><strong>07</strong><span>下游处理步骤</span></div></div>
<section id="sources"><div class="section-heading"><div><div class="eyebrow">02 / SOURCE MAP</div><h2>先把来源说清楚。</h2></div><p>出版方、分发入口、原文地址与普通外链，<br>各自承担不同角色。</p></div>
<div class="source-layers"><div><b>内容发布者</b><p>当前文件对应四家出版方；历史提及和未核实线索另列。官网身份不代表已知抓取接口。</p></div><div><b>文件分发者</b><p>GitHub 仓库保存按期整理的电子书；Raw 地址交付具体文件。</p></div><div><b>文章与音频来源</b><p>原文 URL 需逐篇核验；历史音频 JSON 指向 economist.com 的 MP3。</p></div></div>
<div class="filter-bar"><label class="search"><span aria-hidden="true">⌕</span><input type="search" id="source-search" placeholder="搜索刊物、主题或目录" aria-label="搜索内容来源"></label><div class="filters" role="group" aria-label="按文件类型筛选">${[['all','全部'],['epub','EPUB'],['pdf','PDF'],['mobi','MOBI'],['audio','音频']].map(([id,label])=>`<button type="button" data-filter="${id}" aria-pressed="${id==='all'}" class="${id==='all'?'active':''}">${label}</button>`).join('')}</div></div><p id="source-count" class="result-count" aria-live="polite">显示 4 个当前收录来源 · 数量为固定版本文件统计，不是期次数</p>
<div class="sources-grid">${sourceCards}</div><p id="no-results" hidden>没有符合条件的来源，请更换关键词或文件类型。</p>
<div class="note"><b>不止四种来源</b><p>“4”只表示当前有文件的刊物目录。历史 README 还明确提到卫报；Nature 目前只有待核实线索。以下分层记录，不把历史提及或普通外链混入当前下载统计。</p></div>
<h3 class="refs-title">当前收录、历史提及与待核实线索</h3><div class="table-wrap"><table class="scope-table"><thead><tr><th>刊物</th><th>证据状态</th><th>核验结果</th></tr></thead><tbody>${scopeRows}</tbody></table></div><p class="caption">更广泛的外刊来源并不限于这些名称。其他官网内容、授权 RSS 或用户导入文件可通过独立适配接入；这属于扩展方向，尚未计入上游能力。样本内的引用、零售与推广外链也不等于采集来源。</p></section>
<section id="architecture"><div class="section-heading"><div><div class="eyebrow">03 / SYSTEM ARCHITECTURE</div><h2>一张图，理解完整链路。</h2></div><div class="diagram-actions"><a class="button" href="./architecture.svg" target="_blank" rel="noopener">打开大图 ↗</a><a href="./architecture.svg" download="english-ebooks-architecture.svg">下载 SVG ↓</a></div></div>
<div class="legend"><span><i class="fact"></i>已核实结构</span><span><i class="unknown"></i>上游未公开</span><span><i class="plan"></i>建议实现</span></div><a class="diagram" href="./architecture.svg" target="_blank" rel="noopener" aria-label="打开完整架构图"><img src="./architecture.svg" width="1500" height="1290" alt="六层完整架构：内容来源、未公开的上游生产、公开资源层、获取与留存、处理与结构化、阅读与学习。绿色为已核实，橙色为未公开，蓝色为建议实现。" loading="lazy"></a><p class="caption">研究架构示意。上游公开事实与建议扩展在图中分层标记，完整学习系统尚未实现。</p></section>
<section id="pipeline"><div class="section-heading"><div><div class="eyebrow">04 / PROCESSING LOGIC</div><h2>文件获取后，发生什么？</h2></div><p>从版本清单到文章数据，<br>每一步都保留输入、输出与检查标准。</p></div><div class="pipeline"><div class="stage-list" aria-label="选择处理步骤">${stages}</div><div>${panels}</div></div>
<div class="schema"><div><div class="eyebrow">DATA CONTRACT / 建议字段</div><h3>让每条内容，都能回到来源。</h3><p>作者不从包级 creator 直接填充；文章发布日期、期号日期和获取时间分别记录。来源无法确定时保留空值。</p></div><pre><code>{
  "publication": "economist",
  "issueDate": "2026-09-05",
  "articleId": "stable-id",
  "author": null,
  "canonicalUrl": null,
  "source": {
    "commit": "56973cd…",
    "path": "…/TheEconomist.2026.09.05.epub",
    "sha256": "99639fbd…",
    "internalPath": "从 spine 解析",
    "anchor": "原文定位"
  },
  "processingVersion": "待实现"
}</code></pre></div><p class="caption">字段结构示意；不是已提取的文章结果。完整散列与包结构见样本核验记录。</p>
<details class="format-note"><summary>为什么建议优先处理 EPUB？</summary><p>EPUB 已封装结构化网页、目录和资源，可以沿 container → OPF → spine 读取。PDF 需要处理页码、分栏和可能的 OCR；MOBI 可经工具转换后解析，但应记录转换版本。三种格式不能共用一个“直接抽取纯文本”的假设。</p>${link('https://www.w3.org/TR/epub-33/','EPUB 标准')}${link('https://manual.calibre-ebook.com/conversion.html','Calibre 转换说明')}</details></section>
<section id="evidence"><div class="section-heading"><div><div class="eyebrow">05 / VERIFIED FINDINGS</div><h2>结论来自实际样本。</h2></div><span class="pill">4 本 EPUB · 仅结构核验</span></div>
<div class="findings"><article><span>发现 01</span><h3>打包工具留下了证据</h3><p>Atlantic 与 WIRED 样本有 calibre:timestamp、publication_type，creator / publisher 为 calibre。可以确认打包元数据，仍不能复现全部采集流程。</p></article><article><span>发现 02</span><h3>元数据不能照单全收</h3><p>经济学人和纽约客样本的 creator 为 Kovid Goyal。处理时必须区分包级信息与文章 byline，也要区分引用外链与原文地址。</p></article><article><span>发现 03</span><h3>阅读顺序需要解析</h3><p>两类 OPF 路径、不同的 spine 长度。WIRED 还有 8 个文档未通过严格 XML 解析；链接审计使用容错 HTML 解析并保留告警。</p></article></div>
<div class="table-wrap"><table><caption>固定版本各取一个 EPUB；使用 HTMLParser 统计指向对应出版方域名的超链接，含重复及导航，不代表文章数。</caption><thead><tr><th>样本刊物</th><th>OPF 位置</th><th>spine 项</th><th>出版方域名链接</th></tr></thead><tbody>${samples}</tbody></table></div>
<p class="caption">本轮未评估全部正文质量、PDF / MOBI 转换效果、音频可播放性或学习效果。</p><div class="evidence-download">${link('./epub-inspection.json','查看结构核验 JSON')}${link('https://github.com/yydshly/0905_codex_project/blob/main/projects/001-awesome-english-ebooks/notes/source-processing.md','阅读来源与处理详解')}</div>
<h3 class="refs-title">证据与技术参考</h3><ol class="references">${refs}</ol></section>
<section id="value"><div class="section-heading"><div><div class="eyebrow">06 / WHY IT MATTERS</div><h2>把资源积累，变成处理能力。</h2></div></div><div class="value-grid"><article><span>现在可用</span><h3>按期阅读与选材</h3><p>利用来源目录选择刊物和期次，再交给支持相应格式的阅读器。英语精读、听读练习和专题阅读仍需配套工具。</p></article><article><span>优先扩展</span><h3>文章结构化与精读</h3><p>先完成来源清单、EPUB 解析和原文定位，再加入选句解释、生词与笔记，用实际样本检查完整性。</p></article><article><span>长期复用</span><h3>文档与知识处理</h3><p>把检索、去重、来源追溯和笔记关联复用到论文、技术文档与行业报告。质量检查与可回溯性是共同基础。</p></article></div><div class="closing"><h3>本次交付：研究网页 + 来源目录 + 完整架构 + 处理逻辑</h3><p>网页发布研究结论与元数据，不托管外刊正文。上游未发现明确许可证，后续内容使用范围需按来源核实。本页不是上游采集器或已完成的英语学习系统。</p></div></section>
<footer><span>项目研究集 / 001</span><span>研究日期 ${data.date} · 上游版本 ${data.commit.slice(0,7)}</span><a href="#overview">返回顶部 ↑</a></footer></main></body></html>`;
const dist=path.join(dir,'dist');fs.mkdirSync(dist,{recursive:true});
fs.writeFileSync(path.join(dist,'index.html'),html);
for(const name of ['styles.css','app.js']) fs.copyFileSync(path.join(dir,name),path.join(dist,name));
fs.copyFileSync(path.join(dir,'../assets/architecture.svg'),path.join(dist,'architecture.svg'));
fs.copyFileSync(path.join(dir,'../notes/epub-inspection.json'),path.join(dist,'epub-inspection.json'));
console.log('已构建研究网页：'+dist);
