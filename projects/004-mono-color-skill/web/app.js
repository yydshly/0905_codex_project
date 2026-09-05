const $ = (selector) => document.querySelector(selector);
const capabilities = {
  color: {count:'19 INKS / 10 PALETTES',title:'让每一种墨色，都有自己的职责。',description:'默认使用受控双色：主墨承担主体，辅墨只强调一个明确事件。明确要求单色时，才切换为单墨。',limit:'这些是生成约束，尚不等于可交付印厂的真实分色文件。'},
  layout: {count:'9 COMPOSITIONS / 3 RHYTHMS',title:'用一个强焦点，给其他区域留出空间。',description:'按内容选择信息海报、编辑封面、标本图版等布局。“松弛感”被拆成大胆焦点与安静区域，而非把所有元素都变小。',tokens:['主体裁切','一个焦点','安静留白','非对称网格'],limit:'目录与通用检查的留白下限存在 20% / 25% 差异，尚需统一规则。'},
  type: {count:'7 TYPOGRAPHIC ROLES',title:'让文字有主次，也有自己的语气。',description:'文学、文化活动、公共信息等内容使用不同字体角色。主标题负责表达，辅助文字负责事实，手写仅作少量插话。',tokens:['主标题','功能文字','尺度差异','准确文案'],limit:'字体角色不是实际字体文件；中文准确性仍需检查，建议外部独立排版。'},
  image: {count:'2 REPRESENTATIONS / 5 EFFECTS',title:'保留主体，再决定如何表达。',description:'照片可忠实再现，也可抽取 2–4 个识别特征进行抽象表达；通过网点、墨色密度和有限套印偏移表现印刷感。',tokens:['忠实再现','身份锚点','网点质感','有限瑕疵'],limit:'保留身份与稳定种子是规范目标，本轮没有进行人物保真或图片复现测试。'},
  quality: {count:'PROMPT + IMAGE + RECIPE',title:'交付图片，也留下设计如何发生的记录。',description:'输出图片、实际提示词与配方；检查失败时重试一次。准确文字仍出错时，说明限制并交付少文字底图。',tokens:['生成图片','实际提示词','设计配方','一次重试'],limit:'没有出图工具时只交付提示词。现有自动测试检查数据，不自动评价真实图片。'}
};
function setPressed(selector, active) {
  document.querySelectorAll(selector).forEach(button => {
    const selected = button === active;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}
document.querySelectorAll('[data-cap]').forEach(button => button.addEventListener('click', () => {
  setPressed('[data-cap]', button);
  const cap = capabilities[button.dataset.cap];
  $('#cap-count').textContent = cap.count;
  $('#cap-title').textContent = cap.title;
  $('#cap-description').textContent = cap.description;
  $('#cap-limit').textContent = cap.limit;
  const visual = $('#cap-visual');
  visual.replaceChildren();
  if (cap.tokens) {
    const tokens = document.createElement('div'); tokens.className = 'mini-tokens';
    for (const label of cap.tokens) { const token = document.createElement('span'); token.textContent = label; tokens.append(token); }
    visual.append(tokens);
  } else {
    const bar = document.createElement('div'); bar.className = 'ink-bar';
    for (const text of ['主墨 70–85%', '辅墨 15–30%']) { const span = document.createElement('span'); span.textContent = text; bar.append(span); }
    const note = document.createElement('small'); note.textContent = '纸色不算墨色 · 网点浓淡与叠印混色不等于额外色版';
    visual.append(bar, note);
  }
}));
const steps = [
  ['执行者 / Agent','先确定必须保留的内容。','理解主体、意图、准确文字与照片角色。照片可以忠实再现，也可以保留少量识别特征后进行抽象表达。'],
  ['执行者 / Agent + 目录','把审美选择写成设计配方。','从设计目录选择纸色、墨色、构图、字体、焦点和质感参数。配方是中间记录，原版没有通用的程序化决策引擎。'],
  ['执行者 / Agent','把配方组织成五段提示词。','依次说明画布与墨色、原创构图、主体、字体与准确文字、材质与排除项。“编译器”主要是语言模型遵循的编写规则。'],
  ['执行者 / 外部图像模型','图像生成发生在宿主工具中。','Agent 把提示词交给可用的图像模型。Skill 本身不附带通用生成服务；无工具时只返回提示词并说明限制。'],
  ['执行者 / Agent','看实际画面，再判断是否交付。','检查主体、文字、色版职责与视觉层级，失败时重试一次。文字仍错误时建议外部排版；保留图片、实际提示词和配方。']
];
document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
  setPressed('[data-step]', button);
  const [owner,title,text] = steps[Number(button.dataset.step)];
  $('#step-owner').textContent=owner; $('#step-title').textContent=title; $('#step-text').textContent=text;
}));
const scenes = {
  research: {title:'给每份研究，一个清晰的视觉入口。',description:'将项目主题提炼成一个视觉隐喻，沿用编号、标题和配色，形成持续积累的研究封面系列。',input:'项目名称、编号、已确认的研究主题。',skill:'选择视觉主体、构图和印刷质感，组织生成提示词。',extra:'程序准确叠加中文标题；概念封面与真实运行截图分别标注。',headline:['把开源项目','读成自己的知识。'],kicker:'OPEN RESEARCH / 004',aside:'发现 / 理解 / 复用',label:'从源码，到可复用的知识',requestTitle:'开源项目研究',purpose:'研究封面',subject:'一本打开的书与纸页，表达从阅读源码到积累知识',guard:'不添加无法验证的技术标签、数据或组织名称。'},
  reading: {title:'把阅读主题，变成可持续的系列。',description:'为外刊主题、翻译章节或阅读笔记建立统一视觉。让封面帮助进入内容，正文继续在文档或网页中准确呈现。',input:'已经核对的专题标题、章节顺序和内容摘要。',skill:'提炼单一主题，以纸页、网点和编辑构图建立系列感。',extra:'核对引文和署名；大量正文独立排版，不由模型补写原文。',headline:['读一页世界，','留一点自己的想法。'],kicker:'READING JOURNAL / 001',aside:'阅读 / 理解 / 记录',label:'专题阅读 · 从材料到思考',requestTitle:'读一页世界',purpose:'阅读专题封面',subject:'错落纸页与一处阅读标记，表达阅读和思考',guard:'不虚构原文引句、作者姓名或文章事实。'},
  event: {title:'让一次分享，有清楚的主题与信息。',description:'把研究分享会、读书会的主视觉和信息层级整理好，让标题表达主题，日期与地点保持准确可读。',input:'准确标题、经过确认的日期、地点与活动信息。',skill:'选择信息海报构图，分配主视觉和辅助信息的墨色职责。',extra:'逐字检查日期与地点，必要时程序叠字；真实印刷另做尺寸与工艺检查。',headline:['让想法，','在交流中生长。'],kicker:'OPEN CONVERSATION / 003',aside:'分享 / 讨论 / 生长',label:'研究分享 · 一起把问题聊明白',requestTitle:'让想法在交流中生长',purpose:'研究分享活动海报',subject:'两组交叠的对话形状，表达交流',guard:'日期和地点尚未提供，必须留空，不虚构赞助商或其他活动事实。'}
};
let sceneKey='research';
function openImage(id){$('#large-image').src='./generated/'+id+'.png';$('#image-dialog').showModal();}
document.querySelectorAll('[data-image]').forEach(b=>b.addEventListener('click',()=>openImage(b.dataset.image)));
$('#close-image').addEventListener('click',()=>$('#image-dialog').close());
$('#image-dialog').addEventListener('click',e=>{if(e.target===$('#image-dialog'))$('#image-dialog').close();});
$('#result-open').addEventListener('click',()=>openImage(sceneKey));
function renderScenario(){
  const scene=scenes[sceneKey], demo=window.MONO_DEMOS.find(d=>d.id===sceneKey);
  for(const [id,key] of [['scene-title','title'],['scene-description','description'],['scene-input','input'],['scene-skill','skill'],['scene-extra','extra']])$('#'+id).textContent=scene[key];
  $('#result-image').src='./generated/'+sceneKey+'.png';
  $('#result-image').alt=demo.exact_text[0]+' — 本次实际生成';
  $('#result-download').href='./generated/'+sceneKey+'.png';
  $('#result-inks').replaceChildren(...demo.inks.map(ink=>{const s=document.createElement('span');s.style.setProperty('--swatch',ink);s.textContent=ink;return s;}));
  $('#scene-input').textContent='准确标题：'+demo.exact_text.join(' / ')+'。主体：'+demo.subject+'。';
  $('#scene-skill').textContent=demo.layout+' · '+demo.type_hierarchy+' · 3:4 · 目标留白 '+demo.empty_paper+'%（配方目标，未量测结果）。';
  $('#result-review').textContent=demo.review;
  $('#request-text').value=demo.prompt;
  $('#copy-status').textContent='';
}
document.querySelectorAll('button[data-scene]').forEach(button=>button.addEventListener('click',()=>{sceneKey=button.dataset.scene;setPressed('button[data-scene]',button);renderScenario();}));
$('#copy-request').addEventListener('click', async () => {
  try {await navigator.clipboard.writeText($('#request-text').value); $('#copy-status').textContent='已复制请求';}
  catch {$('#request-text').focus();$('#request-text').select();$('#copy-status').textContent='已选中文本，请手动复制';}
});
$('#download-request').addEventListener('click', () => {
  const url=URL.createObjectURL(new Blob([$('#request-text').value],{type:'text/plain;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download=`mono-color-${sceneKey}.txt`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);$('#copy-status').textContent='已发起文本下载';
});
renderScenario();
