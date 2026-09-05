const rules=[['layout','布局','better-layout','固定宽度 → 自适应容器；建立分组间距和卡片网格。','切换手机宽度，比较页面是否横向溢出。'],['type','排版','better-typography','统一字号层级与行距；移除固定标题高度，连续字符可以换行。','长标题场景中，比较裁剪数量和完整内容。'],['colors','颜色','better-colors','用语义变量管理背景、正文、辅助文字和主要动作。','观察第一张卡片说明文字的实测对比度。'],['a11y','可访问性','better-accessibility','保留可见标签、焦点指示，扩展按钮目标并提供动作名称。','按 Tab 检查焦点；收藏按钮由小符号变成明确动作。'],['writing','文案','better-writing','按钮明确动作；空结果与错误信息给出恢复办法。','切换空数据、加载失败，尝试添加项目或重试。'],['ui','细节','better-ui','调整圆角、层次与按压反馈；尊重减少动态效果设置。','点击按钮观察反馈，对照卡片和内部控件的边界。']];
const frames={before:document.querySelector('#before-frame'),after:document.querySelector('#after-frame')};
let state={query:'',saved:[],onlySaved:false,added:[],recovered:false};
const defaults={scenario:'normal',width:'auto',variant:'balanced',view:'compare'};
let config={...defaults};
document.querySelector('#rule-switches').innerHTML=rules.map(([id,name])=>'<label><input type="checkbox" value="'+id+'" checked>'+name+'</label>').join('');
document.querySelector('#rule-details').innerHTML=rules.map(([id,name,skill,change,observe])=>'<article><h3>'+name+'</h3><code>'+skill+'</code><p>'+change+'</p><p class="result">'+observe+'</p><a href="https://github.com/jakubkrehel/skills/blob/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/'+skill+'/SKILL.md">对应上游规则 ↗</a></article>').join('');
function enabled(){return [...document.querySelectorAll('#rule-switches input:checked')].map(e=>e.value);}
function send(){for(const [mode,frame] of Object.entries(frames)){frame.contentWindow?.postMessage({kind:'lab-config',mode,config:{...config,rules:mode==='before'?[]:enabled()},state},location.origin);}}
function update(){
 const active=enabled();document.querySelector('#enabled-count').textContent=active.length+' 项规则已启用';
 for(const mode of ['before','after']){
  document.querySelector('#'+mode+'-pane').hidden=config.view!=='compare'&&config.view!==mode;
  frames[mode].style.width=config.width==='auto'?'100%':config.width+'px';
  const params=new URLSearchParams({mode,scenario:config.scenario,variant:config.variant,rules:mode==='before'?'':active.join(',')});
  document.querySelector('#'+mode+'-open').href='./preview.html?'+params;
 }
 document.querySelector('#comparison').classList.toggle('single',config.view!=='compare');
 document.querySelectorAll('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===config.view);b.setAttribute('aria-pressed',b.dataset.view===config.view);});
 send();
}
function metrics(mode,m){
 const contrast=m.contrast===null?'<span class="metric neutral">正文对比度：不适用</span>':'<span class="metric '+(m.contrast<4.5?'warn':'')+'">正文对比度 '+m.contrast.toFixed(2)+':1</span>';
 document.querySelector('#'+mode+'-metrics').innerHTML=contrast+'<span class="metric '+(m.clipped?'warn':'')+'">标题裁剪 '+m.clipped+'/'+m.titles+'</span><span class="metric '+(m.overflow?'warn':'')+'">横向溢出 '+(m.overflow?'有':'无')+'</span><span class="metric neutral">实际容器 '+m.width+'px</span>';
}
window.addEventListener('message',e=>{
 if(e.origin!==location.origin)return;
 const mode=Object.keys(frames).find(k=>frames[k].contentWindow===e.source);if(!mode)return;
 const d=e.data;if(d.kind==='lab-ready'){send();return;}
 if(d.kind==='lab-metrics'){metrics(mode,d);return;}
 if(d.kind==='lab-action'){
  const a=d.action;
  if(a.type==='search')state.query=a.value;
  if(a.type==='saved')state.onlySaved=a.value;
  if(a.type==='save'){state.saved=state.saved.includes(a.id)?state.saved.filter(id=>id!==a.id):[...state.saved,a.id];}
  if(a.type==='retry')state.recovered=true;
  if(a.type==='add'){state.added.push({id:'local-'+Date.now(),name:a.name,summary:'刚刚添加的临时研究项目，可搜索、收藏和查看详情。',tags:['本地草稿'],source:''});state.recovered=true;state.query='';state.onlySaved=false;}
  if(a.type==='clear'){state.query='';state.onlySaved=false;}
  send();
 }
});
for(const id of ['scenario','width','variant'])document.querySelector('#'+id).addEventListener('change',e=>{
 config[id]=e.target.value;
 if(id==='scenario')state={...state,query:'',onlySaved:false,recovered:false,added:[]};
 update();
 const hints={long:'试着关闭“排版”，观察同一份超长标题被裁剪；重新启用即可恢复换行。',empty:'右侧空状态可直接添加一个临时项目，提交后左右同步。',error:'右侧解释失败原因并提供重试；点击后两边恢复同一份数据。',many:'两边共用 18 条项目数据。试试紧凑方案与搜索。',normal:'先搜索“翻译”，再收藏、筛选收藏或查看项目详情。'};
 document.querySelector('#hint').textContent=hints[config.scenario]+(config.width==='auto'?'':' 当前为真实 '+config.width+'px 容器；外层过窄时可横向滚动预览区。');
});
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{config.view=b.dataset.view;update();}));
document.querySelector('#rule-switches').addEventListener('change',update);
document.querySelector('#reset').addEventListener('click',()=>{state={query:'',saved:[],onlySaved:false,added:[],recovered:false};config={...defaults};for(const id of ['scenario','width','variant'])document.querySelector('#'+id).value=config[id];document.querySelectorAll('#rule-switches input').forEach(i=>i.checked=true);document.querySelector('#hint').textContent='已重置规则、场景与所有临时数据。';update();});
for(const frame of Object.values(frames))frame.addEventListener('load',send);
update();
