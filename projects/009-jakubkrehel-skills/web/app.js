import {skills} from './skill-data.js';
import {renderSkillCard} from './skill-card.js';
const base='https://github.com/jakubkrehel/skills/blob/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/';
let filter='all',query='',selected='better-interface';
const grid=document.querySelector('#skill-grid'),detail=document.querySelector('#detail');
function showDetail(){
const s=skills.find(s=>s.id===selected);if(!s)return;
detail.innerHTML='<div class="detail-label"><span>SKILL / INSIDE</span><span>↗</span></div><h3>'+s.name+'</h3><code>'+s.id+'</code><p class="detail-intro">'+s.intro+'</p><dl><dt>INPUT / 需要什么</dt><dd>'+s.input+'</dd><dt>PROCESS / 怎么工作</dt><dd>'+s.action+'</dd><dt>OUTPUT / 交付什么</dt><dd>'+s.output+'</dd><dt>BOUNDARY / 注意边界</dt><dd>'+s.limit+'</dd></dl><a href="'+base+s.id+'/SKILL.md">阅读上游 Skill 原文 ↗</a>';
}
function render(){
const list=skills.filter(s=>(filter==='all'||s.group===filter)&&[s.id,s.name,s.short,s.intro,s.action].join(' ').toLowerCase().includes(query));
if(list.length&&!list.some(s=>s.id===selected))selected=list[0].id;
grid.innerHTML=list.map(s=>renderSkillCard(s,skills.indexOf(s),selected)).join('');
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


document.querySelector("#clear-filters").addEventListener("click",()=>{filter="all";query="";document.querySelector("#search").value="";document.querySelectorAll("[data-filter]").forEach(b=>{const active=b.dataset.filter==="all";b.classList.toggle("active",active);b.setAttribute("aria-pressed",active);});render();document.querySelector("#search").focus();});
