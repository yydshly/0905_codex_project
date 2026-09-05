const base='https://github.com/jakubkrehel/skills/blob/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/';
const skills=[
{id:'better-interface',name:'综合界面审查',group:'review',icon:'◎',short:'六个领域，一份有优先级的结论。',intro:'让各领域的判断汇合成一份可定位、可执行的审查报告。',input:'一个页面、功能或完整用户流程，以及项目代码与设计规范。',action:'依次检查无障碍、布局、文案、排版、颜色与 UI；按根因去重并排序。',output:'范围与覆盖情况、最多 15 项发现、验证记录与审查结论。',limit:'默认只读；缺少领域时标记未审查，无法运行的检查标记未验证。'},
{id:'better-ui',name:'界面细节',group:'domain',icon:'◈',short:'圆角、光学对齐、阴影与动效。',intro:'把视觉上的细小偏差拆成可调整的实现细节。',input:'组件代码、现有设计变量、图标与动效库。',action:'检查嵌套圆角、图标笔画、阴影层次与交互反馈，复用现有实现。',output:'带位置的 UI 问题和具体调整建议。',limit:'固定动效数值包含作者偏好；需要结合项目的密度与动效语言。'},
{id:'better-typography',name:'排版与文字',group:'domain',icon:'Aa',short:'层级、行距、换行与完整内容。',intro:'让标题、正文、标签和动态数值各自拥有适合的排版。',input:'真实文本、字体配置、样式和实际容器宽度。',action:'检查字号层级、字体特性、行距、截断恢复和数字对齐。',output:'排版发现及适配项目样式系统的建议。',limit:'换行与裁剪需要真实页面观察；中文排版还需要本地化评测。'},
{id:'better-colors',name:'颜色系统',group:'domain',icon:'◐',short:'从单个颜色，到有语义的系统。',intro:'用角色明确的颜色变量组织色阶、主题和状态。',input:'颜色变量、主题定义以及实际前景和背景组合。',action:'分析语义变量、色阶与色域；计算实际颜色组合的对比度。',output:'颜色系统建议或可追溯的测量记录。',limit:'不能凭视觉猜测测量值。失败先报告；改变配色需要明确任务范围。'},
{id:'better-accessibility',name:'无障碍体验',group:'domain',icon:'↹',short:'键盘、焦点、读屏与缩放。',intro:'优先使用原生平台能力，让内容与操作对更多人可达。',input:'交互控件、表单、页面结构和可运行流程。',action:'检查名称、键盘路径、焦点、标签、缩放和减少动态效果。',output:'按影响分级的问题与验证覆盖记录。',limit:'源码检查不能替代实际键盘、浏览器和读屏验证。'},
{id:'better-layout',name:'布局与层级',group:'domain',icon:'⊞',short:'用空间分组，用内容决定断点。',intro:'让阅读顺序、分组和响应式结构在内容变化时仍然成立。',input:'页面结构、容器、实际内容及支持的显示范围。',action:'检查共享对齐边、逻辑方向、隐藏内容提示和翻译增长。',output:'可定位的结构问题与布局调整建议。',limit:'密度数值是有语境的配方；应保留能通过检查的既有设计系统。'},
{id:'better-writing',name:'产品文案',group:'domain',icon:'¶',short:'说清动作，也说清下一步。',intro:'让界面文字帮助用户行动、理解状态并从错误中恢复。',input:'按钮、提示、空状态、错误信息及产品语气规范。',action:'统一术语，明确按钮动作、错误恢复办法与空状态入口。',output:'文案前后对照和修改理由。',limit:'面向产品界面文案；中文语气与术语需要结合真实用户判断。'},
{id:'interface-review',name:'变更审查',group:'review',icon:'±',short:'分清新增、回归与历史问题。',intro:'回答“这次改动有没有让界面变差”，控制审查边界。',input:'PR、分支、提交范围或未提交的变更。',action:'读取 diff 两侧，扩展受影响使用方，将发现交给综合入口汇总。',output:'变更范围、分类发现、最多三项历史问题与本次裁决。',limit:'默认只读，依赖 better-interface；不承担完整业务、安全或性能审查。'},
{id:'explain-interface',name:'解释实现',group:'explore',icon:'⌘',short:'从视觉效果，追到图层与机制。',intro:'理解网页为何呈现这样的效果，并提取可迁移的方法。',input:'一个网站 URL、指定效果，或只能看到的截图。',action:'分析 HTML、CSS 或浏览器状态，区分测量、推导和意图推测。',output:'图层顺序、实现机制、证据强度和迁移限制。',limit:'截图只能支持重建解释；不能证明原始框架、源码或未观察到的状态。'},
{id:'break',name:'组件边界检查',group:'explore',icon:'⌁',short:'把真实组件放进极端场景。',intro:'在问题进入正式页面前，看见内容与状态如何破坏组件。',input:'一个真实组件及其属性、插槽、状态与数据来源。',action:'按适用性选择长文本、空数据、数量和宽度场景，搭建临时展示页。',output:'真实组件场景页和实际观察到的破损记录。',limit:'是轻量视觉检查，不是并发压测或完整回归套件；不凭预测报告破损。'},
{id:'variant',name:'方案探索',group:'explore',icon:'▤',short:'三个方向，一次有依据的选择。',intro:'通过有明确差异的候选方案，帮助你判断设计取舍。',input:'一个组件、它的实际页面上下文和设计任务。',action:'选择一个主要变化维度，默认制作三个方案并提供切换器。',output:'可切换候选方案、适用条件与代价；选择后落实并清理。',limit:'每个方案都必须达到基础可用性要求；不能只换颜色假装探索。'}
];
let filter='all',query='',selected='better-interface';
const grid=document.querySelector('#skill-grid'),detail=document.querySelector('#detail');
function showDetail(){
const s=skills.find(s=>s.id===selected);if(!s)return;
detail.innerHTML='<div class="detail-label"><span>SKILL / INSIDE</span><span>↗</span></div><h3>'+s.name+'</h3><code>'+s.id+'</code><p class="detail-intro">'+s.intro+'</p><dl><dt>INPUT / 需要什么</dt><dd>'+s.input+'</dd><dt>PROCESS / 怎么工作</dt><dd>'+s.action+'</dd><dt>OUTPUT / 交付什么</dt><dd>'+s.output+'</dd><dt>BOUNDARY / 注意边界</dt><dd>'+s.limit+'</dd></dl><a href="'+base+s.id+'/SKILL.md">阅读上游 Skill 原文 ↗</a>';
}
function render(){
const list=skills.filter(s=>(filter==='all'||s.group===filter)&&[s.id,s.name,s.short,s.intro,s.action].join(' ').toLowerCase().includes(query));
if(list.length&&!list.some(s=>s.id===selected))selected=list[0].id;
grid.innerHTML=list.map(s=>'<button type="button" class="skill-card '+(s.id===selected?'selected':'')+'" data-skill="'+s.id+'" aria-pressed="'+(s.id===selected)+'" aria-controls="detail"><span class="skill-top"><span class="skill-icon" aria-hidden="true">'+s.icon+'</span><span class="skill-num">'+String(skills.indexOf(s)+1).padStart(2,'0')+' ↗</span></span><h3>'+s.name+'</h3><code>'+s.id+'</code><p>'+s.short+'</p></button>').join('');
document.querySelector('#empty').hidden=list.length>0;detail.hidden=!list.length;
document.querySelector('#result-count').textContent='找到 '+list.length+' 个技能。';
if(list.length)showDetail();
}
grid.addEventListener('click',e=>{const button=e.target.closest('[data-skill]');if(!button)return;selected=button.dataset.skill;for(const card of grid.querySelectorAll('button')){const active=card.dataset.skill===selected;card.classList.toggle('selected',active);card.setAttribute('aria-pressed',active);}showDetail();if(matchMedia('(max-width:760px)').matches){detail.scrollIntoView({block:'start',behavior:'instant'});detail.focus({preventScroll:true});}});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',b===button)});render();}));
document.querySelector('#search').addEventListener('input',e=>{query=e.target.value.trim().toLowerCase();render();});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){e.preventDefault();document.querySelector('#search').focus();}});
document.querySelector('#polish').addEventListener('change',e=>{document.querySelector('#specimen').classList.toggle('unpolished',!e.target.checked);document.querySelector('#demo-state').textContent=e.target.checked?'层级清晰 · 留白有序':'规则关闭 · 对比观察';});
const steps=[
['先说清楚，看哪里。','从一个完整页面或流程开始，读取项目规范、技术栈和已有设计系统。','证据起点','说明审查范围与排除内容。针对 PR 或分支的任务，由 interface-review 解析基线与变更范围。'],
['先基础，再打磨。','依次检查无障碍、布局、文案、排版、颜色和 UI 细节。每类规则只由所属技能维护。','覆盖记录','缺失技能要标记未审查；一类问题只归属一个根因，避免六份报告重复提出同一件事。'],
['看见了，才报告。','代码问题对应文件和位置；运行时结论需要真实页面观察，颜色数值需要计算。','验证边界','不能用源码推断代替视觉观察。无法完成的检查标记为未验证，不编造测量结果。'],
['交付能行动的结论。','按根因合并并按用户影响排序，优先处理阻断操作、内容不可达等问题。','最终产物','范围、覆盖表、最多 15 项发现与验证记录。审查默认只读；要求实施时再修改并复核。']
];
function selectStep(i){const s=steps[i];document.querySelector('#step-detail').innerHTML='<div><h4>'+s[0]+'</h4><p>'+s[1]+'</p></div><div class="step-evidence"><h4>'+s[2]+'</h4><p>'+s[3]+'</p></div>';document.querySelectorAll('[data-step]').forEach(b=>{const active=Number(b.dataset.step)===i;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});}
document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>selectStep(Number(b.dataset.step))));
const scenarios=[
{title:'先系统检查，再修关键问题。',route:['better-interface','领域 Skill','复核'],result:'一份按用户影响排序的报告，说明问题位置、根因与建议。',prompt:'请审查项目导航页的卡片列表，覆盖窄屏、长中文标题和键盘访问，先给出有证据的问题，不修改代码。',limit:'这是一条示例任务，不会在本网页内执行 AI 审查。'},
{title:'把“改了什么”和“影响哪里”连起来。',route:['interface-review','better-interface'],result:'区分新增、回归和历史问题，重点追踪共享组件的受影响使用方。',prompt:'请审查本次分支的界面变更，重点检查共享按钮的键盘操作与焦点是否回归，并说明未覆盖的使用方。',limit:'需要访问 Git 基线与项目上下文；历史问题不计入本次变更裁决。'},
{title:'先让最难的内容出现。',route:['break','领域 Skill','重新观察'],result:'一个真实组件的场景页面，让长文本、空数据与窄容器问题集中可见。',prompt:'请为项目卡片制作边界场景页，覆盖长中文标题、连续 URL、无封面与窄容器，只测试组件实际支持的输入。',limit:'临时页面是交付物的一部分；没有实际渲染的预测不能当成观察结果。'},
{title:'比较结构，不只比较颜色。',route:['variant','用户选择','落实方案'],result:'默认三个方案，沿同一个主要维度探索，展示各自适用条件与代价。',prompt:'请为项目卡片制作三个信息密度不同的方案，放在实际导航页中比较，保留相同内容和基础可用性。',limit:'用户决定最终方向。这里的方案探索不等于真实用户 A/B 实验。'},
{title:'找到制造效果的那几层。',route:['explain-interface','测量与推导','迁移方法'],result:'解释图层、样式与动效怎样共同产生效果，并标出不能确认的部分。',prompt:'请解释目标网页首屏渐变的图层结构与模糊机制，区分实际测量、计算推导和对设计意图的推测。',limit:'只有截图时，产出应说明是可能的重建方法，无法确认原始实现。'}
];
function selectScenario(i){const s=scenarios[i];document.querySelector('#scenario-detail').innerHTML='<p class="eyebrow">RECOMMENDED PATH / 建议路径</p><h3>'+s.title+'</h3><div class="route">'+s.route.map(x=>'<span>'+x+'</span>').join('<i aria-hidden="true">→</i>')+'</div><h4>你会得到</h4><p>'+s.result+'</p><h4>试着这样描述任务</h4><div class="prompt">'+s.prompt+'</div><p class="scenario-boundary">'+s.limit+'</p>';document.querySelectorAll('[data-scenario]').forEach(b=>{const active=Number(b.dataset.scenario)===i;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});}
document.querySelectorAll('[data-scenario]').forEach(b=>b.addEventListener('click',()=>selectScenario(Number(b.dataset.scenario))));
render();selectStep(0);selectScenario(0);

