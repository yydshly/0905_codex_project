const params=new URLSearchParams(location.search);
const mode=params.get('mode')==='before'?'before':'after';
const allRules=['layout','type','colors','a11y','writing','ui'];
let config={scenario:params.get('scenario')||'normal',variant:params.get('variant')||'balanced',rules:mode==='before'?[]:(params.has('rules')?params.get('rules').split(','):allRules)};
let state={query:'',saved:[],onlySaved:false,added:[],recovered:false},projects=[],visible=[];
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const has=id=>config.rules.includes(id);
document.querySelector('#app').innerHTML='<main class="app-shell"><header class="topbar"><span class="logo"><i>r.</i> 研究工作台</span><span class="local-note">个人知识库 / LOCAL DEMO</span></header><section class="page-head"><div><h1>把好想法，留在这里。</h1><p>从发现一个项目，到理解它为什么值得研究。</p></div><button id="add" class="primary">添加研究</button></section><section class="stats" aria-label="项目统计"><div><strong id="total">0</strong> 研究项目</div><div><strong id="saved-count">0</strong> 已收藏</div><div><strong>3</strong> 研究方向</div></section><section class="toolbar" aria-label="筛选项目"><div class="field"><label for="query">搜索研究项目</label><input id="query" placeholder="搜索项目…" type="search"></div><button id="saved-filter" aria-pressed="false">只看收藏</button></section><p id="results" class="results-label" role="status"></p><section id="list" class="cards" aria-label="研究项目列表"></section><p class="bottom-note">内容取自研究仓库的项目资料；18 项与长标题为压力场景。添加和收藏仅在当前实验中生效。</p></main>';
const query=document.querySelector('#query'),list=document.querySelector('#list'),dialog=document.querySelector('#dialog');
function notify(text){const el=document.querySelector('#announcement');el.textContent=text;clearTimeout(notify.timer);notify.timer=setTimeout(()=>{el.textContent=''},2500);}
function action(a){
 if(window.parent!==window){parent.postMessage({kind:'lab-action',action:a},location.origin);return;}
 if(a.type==='search')state.query=a.value;
 if(a.type==='saved')state.onlySaved=a.value;
 if(a.type==='save')state.saved=state.saved.includes(a.id)?state.saved.filter(x=>x!==a.id):[...state.saved,a.id];
 if(a.type==='clear'){state.query='';state.onlySaved=false;}
 if(a.type==='retry')state.recovered=true;
 if(a.type==='add'){state.added.push({id:'local-'+Date.now(),name:a.name,summary:'刚添加的临时研究项目。',tags:['本地草稿'],source:''});state.query='';state.onlySaved=false;state.recovered=true;}
 render();
}
function data(){
 let items=projects.map(x=>({...x}));
 if(config.scenario==='empty')items=[];
 if(config.scenario==='long')items=items.map((x,i)=>({...x,name:i===0?'英语外刊与跨语言阅读工作流研究：从来源检索、内容获取到排版、翻译与长期学习体验的完整实践说明':i===1?'TranslateBook_ParallelTranslation_TerminologyFeedback_ResumeCheckpoint_ExtraLongIdentifier_2026':x.name,summary:x.summary+'。这段较长说明用于检查容器、行距和文本增长后的可读性。'}));
 if(config.scenario==='many')items=Array.from({length:18},(_,i)=>({...items[i%projects.length],id:'many-'+i,name:items[i%projects.length].name+' · 案例 '+(i+1)}));
 return [...items,...state.added];
}
function render(){
 document.body.className=config.rules.map(r=>'r-'+r).join(' ')+' density-'+config.variant;
 document.querySelector('#add').textContent=has('writing')?'添加研究':'新增';
 query.placeholder=has('writing')?'输入标题或研究方向':'搜索…';
 if(has('a11y'))query.setAttribute('aria-label','搜索研究项目');else query.removeAttribute('aria-label');
 if(query.value!==state.query)query.value=state.query;
 const items=data(),savedButton=document.querySelector('#saved-filter');
 document.querySelector('#total').textContent=items.length;document.querySelector('#saved-count').textContent=items.filter(p=>state.saved.includes(p.id)).length;
 savedButton.textContent=has('writing')?(state.onlySaved?'显示全部':'只看收藏'):(state.onlySaved?'全部':'收藏');
 savedButton.setAttribute('aria-pressed',state.onlySaved);
 visible=items.filter(p=>(p.name+' '+p.summary+' '+p.tags.join(' ')).toLowerCase().includes(state.query.toLowerCase())&&(!state.onlySaved||state.saved.includes(p.id)));
 document.querySelector('#results').textContent='显示 '+visible.length+' 个项目';
 const focused=document.activeElement?.dataset?.save;
 if(config.scenario==='error'&&!state.recovered){
  document.querySelector('#results').textContent='项目尚未载入';
  list.innerHTML='<div class="no-data"><h2>'+ (has('writing')?'暂时无法加载研究项目':'错误')+'</h2><p>'+(has('writing')?'这是模拟的连接失败。已有记录不会丢失，重新加载即可继续。':'Error 500')+'</p><button data-retry class="primary">'+(has('writing')?'重新加载项目':'确定')+'</button></div>';
 }else if(!visible.length){
  list.innerHTML='<div class="no-data"><h2>'+(has('writing')?(state.query||state.onlySaved?'没有找到匹配项目':'从第一份研究开始'):'暂无数据')+'</h2>'+(has('writing')?'<p>'+(state.query?'没有找到“'+esc(state.query)+'”。试试其他词，或清空筛选。':state.onlySaved?'还没有收藏项目。返回全部项目，选择值得继续阅读的内容。':'把感兴趣的开源项目放在这里，逐步记录原理、实验和结论。')+'</p><button '+(state.query||state.onlySaved?'data-clear':'data-add')+' class="primary">'+(state.query||state.onlySaved?'清空筛选':'添加第一个研究')+'</button>':'')+'</div>';
 }else{
  list.innerHTML=visible.map((p,i)=>'<article class="card"><div class="card-top"><span class="project-icon" aria-hidden="true">'+['文','译','界'][i%3]+'</span><span class="badge">'+(has('writing')?'研究笔记':'项目')+'</span></div><h2 class="project-title">'+esc(p.name)+'</h2><p class="description">'+esc(p.summary)+'</p><div class="tags">'+p.tags.map(t=>'<span class="tag">'+esc(t)+'</span>').join('')+'</div><div class="card-footer"><button data-detail="'+esc(p.id)+'">'+(has('writing')?'查看完整研究 ↗':'查看')+'</button><button class="save" data-save="'+esc(p.id)+'" aria-pressed="'+state.saved.includes(p.id)+'" '+(has('a11y')?'aria-label="'+(state.saved.includes(p.id)?'取消收藏':'收藏')+'：'+esc(p.name)+'"':'')+'>'+(state.saved.includes(p.id)?'★':'☆')+(has('a11y')?'<span class="save-label"> '+(state.saved.includes(p.id)?'已收藏':'收藏')+'</span>':'')+'</button></div></article>').join('');
 }
 if(focused){const b=[...list.querySelectorAll('[data-save]')].find(e=>e.dataset.save===focused);b?.focus();}
 scheduleMeasure();
}
function openDetail(id){
 const p=data().find(p=>p.id===id);if(!p)return;
 document.querySelector('#dialog-content').innerHTML='<h2 id="dialog-title" class="modal-title">'+esc(p.name)+'</h2><p class="modal-description">'+esc(p.summary)+'</p><p class="modal-description">研究方向：'+p.tags.map(esc).join(' / ')+'</p>'+(p.source?'<a class="dialog-link" href="'+esc(p.source)+'" target="_blank" rel="noopener">访问这个项目的上游仓库 ↗</a>':'<p class="modal-description">这是当前会话创建的临时研究记录。</p>');
 dialog.showModal();
}
function openAdd(){
 document.querySelector('#dialog-content').innerHTML='<h2 id="dialog-title" class="modal-title">'+(has('writing')?'添加一份新研究':'新增')+'</h2><form id="new-form" class="modal-form" novalidate><label for="name">'+(has('writing')?'研究标题':'名称')+'</label><input id="name" name="name" maxlength="120" aria-describedby="name-error" placeholder="例如：界面动效研究"><p id="name-error" class="error-text"></p><button class="primary" type="submit">'+(has('writing')?'添加到工作台':'确定')+'</button></form>';
 dialog.showModal();document.querySelector('#name').focus();
 document.querySelector('#new-form').addEventListener('submit',e=>{e.preventDefault();const input=document.querySelector('#name'),name=input.value.trim();if(name.length<2){document.querySelector('#name-error').textContent=has('writing')?'请输入至少 2 个字符的研究标题。':'输入错误';input.setAttribute('aria-invalid','true');input.focus();return;}dialog.close();action({type:'add',name});notify('已添加临时研究');});
}
document.querySelector('#add').addEventListener('click',openAdd);
query.addEventListener('input',e=>action({type:'search',value:e.target.value}));
document.querySelector('#saved-filter').addEventListener('click',()=>action({type:'saved',value:!state.onlySaved}));
list.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-save')){const id=b.dataset.save;notify(state.saved.includes(id)?'已取消收藏':'已收藏，可在“只看收藏”中查看');action({type:'save',id});}if(b.hasAttribute('data-detail'))openDetail(b.dataset.detail);if(b.hasAttribute('data-add'))openAdd();if(b.hasAttribute('data-clear'))action({type:'clear'});if(b.hasAttribute('data-retry')){action({type:'retry'});notify('项目已重新加载');}});
function luminance(rgb){return rgb.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);}
function measure(){
 const p=document.querySelector('.description');let contrast=null;
 if(p){const fg=getComputedStyle(p).color.match(/[\d.]+/g).map(Number),bg=getComputedStyle(p.closest('.card')).backgroundColor.match(/[\d.]+/g).map(Number),a=luminance(fg),b=luminance(bg);contrast=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);}
 const titles=[...document.querySelectorAll('.project-title')];
 const message={kind:'lab-metrics',contrast,clipped:titles.filter(t=>t.scrollWidth>t.clientWidth+1||t.scrollHeight>t.clientHeight+1).length,titles:titles.length,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1,width:document.documentElement.clientWidth};
 if(parent!==window)parent.postMessage(message,location.origin);
}
function scheduleMeasure(){requestAnimationFrame(measure);}
window.addEventListener('resize',scheduleMeasure);
window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent||e.data.kind!=='lab-config')return;config=e.data.config;state=e.data.state;render();});
try{const response=await fetch('./project-data.json');if(!response.ok)throw Error('数据读取失败');projects=await response.json();render();if(parent!==window)parent.postMessage({kind:'lab-ready'},location.origin);}catch(error){document.querySelector('#list').textContent='无法读取演示数据，请重新构建页面后刷新。';console.error(error);}

