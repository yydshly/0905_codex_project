const upstreamCommit = 'e51f4f8b9edfd8d2f83e18a4a8eecc6dd5db51a7';
const upstreamRaw = `https://raw.githubusercontent.com/yang0/handraw-style/${upstreamCommit}/`;
const upstreamBlob = `https://github.com/yang0/handraw-style/blob/${upstreamCommit}/`;
const imageURL = number => `${upstreamRaw}images/individual/${number}.png`;
const groups = [
  ['A',1,35,'幽默漫画'],['B',36,54,'叙事绘本'],['C',55,82,'平面人物'],
  ['D',83,123,'日本插画'],['E',124,154,'中国插画'],['F',155,200,'媒介与地域'],['G',201,216,'插画补充']
];
const featured = ['001','003','013','018','036','041','048','059','083','127','193','210'];
const titles = {'001':'怪萌日常涂鸦','003':'细线城市小景','013':'粗线平涂人物','018':'极简冷幽默','036':'松散墨线绘本','041':'奇想弯曲造型','048':'装饰性民间绘本','059':'强对比图形人物','083':'动态东方墨线','127':'繁密东方幻想','193':'广式早茶国潮','210':'东方奇幻绘本'};
let library = Array.from({length:216},(_,index) => {
  const number = String(index+1).padStart(3,'0');
  const group = groups.find(([,start,end]) => index+1>=start && index+1<=end);
  return {number,group:group[0],category:group[3],title:titles[number] || `${group[3]} · ${number}`,reference:'',generation_name:''};
});
let visibleCount=12;
let selectedNumber='003';
let previewNumber='003';
let activeScene='article';
const sceneData = {
 article:{title:'为一篇文章，找到配图的气质。',brief:'你正在写一篇关于“每天读一页”的文章，需要一张轻松、安静的配图。',input:'文章中心意思、画面主体、发布比例；若有标题，提供准确文字。',deliver:'一张无字配图，作为文章首图或正文插图。',next:'核对画面是否表达了文章主题，再到内容编辑器中加入标题并裁切预览。',check:'主体清楚、画面与文章意思一致；缩小后仍能识别，标题区域可用。',topic:'一个成年人坐在窗边读书，桌上有一杯茶，窗外有一株小树',ratio:'16:9',constraints:'画面不含文字；上方留出标题区域，标题由我后期排版。',recommend:['003','048','059'],steps:['选一个能表达文章情绪的编号','提供主体、动作和发布比例','让 Agent 输出提示词，再由图像模型生成','检查缩略图效果，排入真实文章']},
 series:{title:'给一组内容，建立共同视觉方向。',brief:'你准备连续发布“下班后的三个小习惯”：散步、做饭、读书，希望三张卡片看起来属于同一系列。',input:'每张卡片的主题清单、共同配色、画幅，以及需要保持一致的角色描述。',deliver:'三张分别生成的内容卡片素材，共用一个风格编号。',next:'先做第一张确认方向，再逐张生成；把三张并排检查后统一排版。',check:'编号相同不保证角色一致。逐张核对人物、配色、笔触和留白，不合格时局部重做。',topic:'系列主题：下班后的三个小习惯，分别表现公园散步、在家做饭和睡前读书',ratio:'3:4',constraints:'先生成第一张供我确认，再继续其余两张。三张使用同一风格编号、相同画幅与共同配色，画面不含文字。',recommend:['001','013','018'],steps:['列清楚三张各自要讲什么','固定编号、配色、比例与人物描述','先确认一张，再生成其余图片','并排检查一致性，统一添加文案']},
 event:{title:'让活动主题，先有一张视觉草图。',brief:'你在筹备一场周末茶会，需要探索主视觉。风格图帮助选择氛围，活动日期和地点随后准确排版。',input:'活动内容、主角物件、需要出现的元素、画幅与准确文案。',deliver:'一张活动主视觉草图，用于讨论方向；不是可直接印刷的生产文件。',next:'检查主题和构图，再用排版工具添加日期、地点与报名信息；需要限色设计时可参考 mono-color。',check:'物件与主题对应；文案真实准确；印刷还要核对尺寸、分辨率与授权。',topic:'周末茶会的主视觉，表现围坐喝茶的人、茶壶和几盘点心，气氛热闹而放松',ratio:'4:5',constraints:'先做无字主视觉草图，顶部留标题空间，底部留日期与地点区域，具体文字由我后期排版。',recommend:['193','127','036'],steps:['把活动信息整理成画面需求','看参考图，选一个视觉方向','生成无字主视觉，确认主题与留白','补准确文案，完成尺寸与用途检查']}
};
const byId = id => document.getElementById(id);
function makeImage(number, loading='lazy') {
 const img=document.createElement('img'); img.src=imageURL(number); img.alt=`上游编号 #${number} 风格参考图`; img.loading=loading; img.decoding='async';
 img.addEventListener('error',()=>{img.hidden=true;const notice=document.createElement('span');notice.className='image-error';notice.textContent='参考图暂未加载，可打开上游原图查看';img.parentNode.append(notice);},{once:true});
 return img;
}
function filtered() {
 const group=byId('gallery-group').value;
 const query=byId('gallery-search').value.trim().toLowerCase();
 const items=library.filter(item => (group==='all'||item.group===group)&&(!query||[item.number,item.title,item.reference,item.generation_name,item.category].some(v=>v.toLowerCase().includes(query))));
 if(group==='all'&&!query) items.sort((a,b)=>{const ia=featured.indexOf(a.number),ib=featured.indexOf(b.number);return (ia<0?1000+Number(a.number):ia)-(ib<0?1000+Number(b.number):ib);});
 return items;
}
function renderGallery() {
 const items=filtered();const grid=byId('effect-grid');grid.replaceChildren();
 for(const item of items.slice(0,visibleCount)) {
  const card=document.createElement('article');card.className='effect-card';
  const button=document.createElement('button');button.className='image-button';button.type='button';button.setAttribute('aria-label',`放大 #${item.number} ${item.title}`);button.append(makeImage(item.number));button.addEventListener('click',()=>openPreview(item.number));
  const info=document.createElement('div');info.className='effect-info';
  const label=document.createElement('span');label.className='effect-id';label.textContent=`#${item.number} / ${item.category}`;
  const title=document.createElement('h3');title.textContent=item.title;
  const ref=document.createElement('p');ref.textContent=item.reference ? `索引参考：${item.reference}` : '上游风格参考 · 非本次生成';
  const use=document.createElement('button');use.type='button';use.className='use-style';use.textContent='用这个风格做任务 ↗';use.addEventListener('click',()=>chooseStyle(item.number,true));
  info.append(label,title,ref,use);card.append(button,info);grid.append(card);
 }
 const shown=Math.min(items.length,visibleCount);
 byId('gallery-count').textContent=items.length ? `显示 ${shown} / ${items.length} 款 · 点击图片可放大` : '没有匹配的风格，试试编号或切换分类。';
 byId('gallery-more').hidden=shown>=items.length;
 byId('gallery-empty').hidden=!!items.length;
}
function openPreview(number) {
 previewNumber=number;const item=library.find(x=>x.number===number);
 byId('preview-image').replaceChildren(makeImage(number,'eager'));
 byId('preview-title').textContent=`#${number} · ${item.title}`;
 byId('preview-reference').textContent=item.reference ? `上游索引参考：${item.reference}` : `上游编号参考图 · ${item.category}`;
 byId('preview-original').href=upstreamBlob+`images/individual/${number}.png`;
 byId('style-dialog').showModal();
}
function chooseStyle(number,scroll=false) {
 selectedNumber=number;renderSelection();updateSceneRequest();
 if(scroll) {byId('scenarios').scrollIntoView({behavior:'smooth'});byId('selected-style-name').focus({preventScroll:true});}
}
function renderSelection() {
 const item=library.find(x=>x.number===selectedNumber);
 byId('selected-style-image').replaceChildren(makeImage(selectedNumber,'eager'));
 byId('selected-style-name').textContent=`#${selectedNumber} · ${item.title}`;
 byId('selected-style-reference').textContent=item.reference ? `索引参考：${item.reference}` : `上游参考图 · ${item.category}`;
 byId('selected-style-original').href=upstreamBlob+`images/individual/${selectedNumber}.png`;
}
function renderScene() {
 const scene=sceneData[activeScene];
 document.querySelectorAll('[data-scene]').forEach(b=>{b.classList.toggle('active',b.dataset.scene===activeScene);b.setAttribute('aria-pressed',String(b.dataset.scene===activeScene));});
 for(const key of ['title','brief','input','deliver','next','check'])byId('scene-'+key).textContent=scene[key];
 byId('scene-topic').value={article:'每天读一页',series:'下班后的三个小习惯',event:'周末茶会'}[activeScene];
 byId('scene-content').value=scene.topic;byId('scene-text').value='';
 byId('scene-ratio').value=scene.ratio;
 byId('scene-constraints').value={article:'主体清楚，画面留白便于后续排版。',series:'先生成第一张供我确认，再继续其余两张。三张使用同一风格编号、相同画幅与共同配色。',event:'底部留日期与地点区域，不要编造实际活动信息。'}[activeScene];
 byId('scene-steps').replaceChildren(...scene.steps.map((s,i)=>{const li=document.createElement('li');const num=document.createElement('span');num.textContent=String(i+1).padStart(2,'0');li.append(num,document.createTextNode(s));return li;}));
 byId('scene-recommendations').replaceChildren(...scene.recommend.map(number=>{const b=document.createElement('button');b.type='button';b.textContent=`#${number} ${titles[number]}`;b.addEventListener('click',()=>chooseStyle(number));return b;}));
 updateSceneRequest();
}
function updateSceneRequest() {
 const item=library.find(x=>x.number===selectedNumber);const topic=byId('scene-topic').value.trim();const content=byId('scene-content').value.trim();const literal=byId('scene-text').value.trim();const constraints=byId('scene-constraints').value.trim();
 const ready=!!topic&&!!content;
 const text=ready ? `请根据以下主题和内容，使用 handdraw-style 的 ${selectedNumber} 号风格生成实际图片。${item.generation_name?`\n生图名称：${item.generation_name}。`:''}${item.reference?`\n索引参考作者／风格名称：${item.reference}。`:''}\n用途：${{article:'文章配图',series:'系列内容卡片',event:'活动主视觉草图'}[activeScene]}。\n主题：${topic}\n要表达的内容：\n${content}\n画幅：${byId('scene-ratio').value}。\n图中必须出现的文字：${literal||'无，生成无字配图'}。${constraints?'\n其他要求：'+constraints:''}\n请理解内容后提炼适合画面表达的主体、动作和环境，不要把整段内容直接写在图上，不编造活动信息。若指定的图中文字与其他要求冲突，先明确冲突再生成。\n请使用可用的生图工具实际生成并交付图片，同时保留实际提示词、说明是否使用编号参考图；如果无法生图，明确说明，不能仅给提示词就声称已生成。\n风格资料：${upstreamBlob}styles_200_reorganized.md\n编号参考图：${imageURL(selectedNumber)}` : '请填写主题和要表达的内容，再复制生成任务。';
 byId('scene-request').textContent=text;byId('copy-scene').disabled=!ready;byId('scene-copy-status').textContent='';
}
for(const id of ['gallery-group','gallery-search'])byId(id).addEventListener(id==='gallery-search'?'input':'change',()=>{visibleCount=12;renderGallery();});
byId('gallery-more').addEventListener('click',()=>{visibleCount+=12;renderGallery();});
byId('gallery-reset').addEventListener('click',()=>{byId('gallery-search').value='';byId('gallery-group').value='all';visibleCount=12;renderGallery();});
byId('preview-close').addEventListener('click',()=>byId('style-dialog').close());
byId('preview-use').addEventListener('click',()=>{byId('style-dialog').close();chooseStyle(previewNumber,true);});
byId('style-dialog').addEventListener('click',event=>{if(event.target===byId('style-dialog')){const r=event.target.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.target.close();}});
document.querySelectorAll('[data-preview]').forEach(b=>b.addEventListener('click',()=>openPreview(b.dataset.preview)));
document.querySelectorAll('[data-scene]').forEach(b=>b.addEventListener('click',()=>{activeScene=b.dataset.scene;renderScene();}));
for(const id of ['scene-topic','scene-content','scene-text','scene-ratio','scene-constraints'])byId(id).addEventListener('input',updateSceneRequest);
byId('copy-scene').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(byId('scene-request').textContent);byId('scene-copy-status').textContent='已复制完整任务。'}catch{const range=document.createRange();range.selectNodeContents(byId('scene-request'));const s=getSelection();s.removeAllRanges();s.addRange(range);byId('scene-copy-status').textContent='已选中，请手动复制。';}});
async function loadIndex() {
 byId('gallery-retry').hidden=true;
 try {
  const response=await fetch(upstreamRaw+'handdraw-style-prompter/references/styles.json',{signal:AbortSignal.timeout(12000)});
  if(!response.ok)throw new Error('index');const data=await response.json();
  if(!Array.isArray(data)||data.length!==216)throw new Error('count');
  library=library.map(item=>{const record=data.find(r=>r.number===item.number);return {...item,reference:typeof record?.reference==='string'?record.reference:'',generation_name:typeof record?.generation_name==='string'?record.generation_name:''};});
  byId('gallery-network').textContent='已载入固定版本的风格名称与索引参考。图片按需从上游加载。';
  renderGallery();renderSelection();updateSceneRequest();
 }catch{byId('gallery-network').textContent='风格名称暂未载入；仍可按编号选图，或通过来源链接查看。';byId('gallery-retry').hidden=false;}
}
byId('gallery-retry').addEventListener('click',loadIndex);
document.querySelectorAll('.hero-samples img').forEach(img=>img.addEventListener('error',()=>{img.hidden=true;const p=document.createElement('p');p.textContent='图片暂未加载，点击可查看来源';img.parentNode.append(p);},{once:true}));
renderGallery();renderScene();renderSelection();loadIndex();
