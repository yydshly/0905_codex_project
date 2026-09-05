let version='after';const frame=document.querySelector('#page-view');
function update(){const url=version==='before'?'./evidence/before/index.html#skills':'./index.html#skills';frame.src=url;document.querySelector('#open-page').href=url;document.querySelectorAll('[data-version]').forEach(b=>{b.classList.toggle('active',b.dataset.version===version);b.setAttribute('aria-pressed',b.dataset.version===version);});}
document.querySelectorAll('[data-version]').forEach(b=>b.addEventListener('click',()=>{version=b.dataset.version;update();}));
document.querySelector('#view-width').addEventListener('change',e=>{frame.style.width=e.target.value==='auto'?'100%':e.target.value+'px';});
fetch('./evidence/changes.diff').then(r=>{if(!r.ok)throw Error('读取失败');return r.text()}).then(text=>{document.querySelector('#diff-text').textContent=text;}).catch(()=>{document.querySelector('#diff-text').textContent='差异文件读取失败，请重新构建或使用下载链接。'});


// Display the actual pages in equal observation containers; keep their component styles and handlers.
let scene='card';
const focusFrames=[document.querySelector('#focus-before'),document.querySelector('#focus-after')];
function applyScene(f){
 const d=f.contentDocument;if(!d?.querySelector('.skill-card'))return;
 const input=d.querySelector('#search');input.value=scene==='empty'?'不存在的技能':'';
 input.dispatchEvent(new Event('input',{bubbles:true}));
}
for(const f of focusFrames)f.addEventListener('load',()=>{
 const d=f.contentDocument;const style=d.createElement('style');
 style.textContent=`body> :not(main){display:none!important}main> :not(#skills){display:none!important}#skills{padding:12px!important;margin:0!important;max-width:none!important}#skills>.section-heading,#result-count,.detail-panel{display:none!important}.atlas-layout{display:block!important}.skill-grid{grid-template-columns:1fr!important}.skill-card:not(:first-child){display:none!important}.atlas-toolbar{display:block!important}.filters{display:none!important}.search{width:100%!important}.skill-card{width:100%!important}html{scroll-behavior:auto!important}`;
 d.head.append(style);applyScene(f);
});
document.querySelectorAll('[data-scene]').forEach(b=>b.addEventListener('click',()=>{
 scene=b.dataset.scene;
 document.querySelectorAll('[data-scene]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b?'true':'false');});
 document.querySelector('#scene-note').textContent=scene==='empty'?'同样的无结果搜索：右侧多了直接恢复入口，请实际点击。':'比较说明文字大小，以及选中卡片是否写明“已选”。';
 focusFrames.forEach(applyScene);
}));
