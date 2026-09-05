import {skills, categories, scenarios, revision, source} from './data.js';
import {assessments} from './details.js';
const $ = id => document.getElementById(id);
let category = 'all', selected = 'explore-unknowns', scenario = 'feature', step = 0;
function detail(skill) {
  if (!skill) { $('skill-detail').innerHTML = '<div class="detail-label">暂无匹配</div><h3>换个关键词试试。</h3><p class="detail-description">可搜索技能名、中文场景或产物，例如“截图”“决策”“测试”。</p>'; return; }
  $('skill-detail').innerHTML = `<div class="detail-label">SKILL NOTE / ${categories[skill.category]}</div><h3>${skill.name}</h3><p class="detail-description">${skill.description}</p>${[['具体如何工作',skill.how],['适用场景',skill.when],['案例与输入',skill.example],['交付产物',skill.output],['何时调用 / 与谁配合',skill.sequence],['能力边界',skill.limit]].map(([label,text])=>`<div class="detail-row"><span>${label}</span><p>${text}</p></div>`).join('')}<a class="detail-source" href="${skill.url}" target="_blank" rel="noreferrer">阅读原始 SKILL.md ↗</a>`;
}
function renderSkills() {
  const query = $('skill-search').value.trim().toLowerCase();
  const filtered = skills.filter(s => (category === 'all' || s.category === category) && [s.name,s.title,s.description,s.when,s.output].join(' ').toLowerCase().includes(query));
  if (!filtered.some(s=>s.name === selected)) selected = filtered[0]?.name;
  $('result-count').textContent = `显示 ${filtered.length} / ${skills.length} 项技能 · 点击卡片查看详情`;
  $('filters').querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.category === category)));
  $('skill-grid').innerHTML = filtered.length ? filtered.map(s=>`<button class="skill-card" type="button" data-skill="${s.name}" aria-pressed="${s.name === selected}"><span class="card-category"><span>${categories[s.category]}</span><span aria-hidden="true">↗</span></span><h3>${s.name}</h3><p>${s.title}</p></button>`).join('') : '<div class="empty">没有匹配的技能。<button id="reset-search" type="button">清除搜索与筛选</button></div>';
  detail(filtered.find(s=>s.name === selected));
}
$('filters').innerHTML = Object.entries(categories).map(([key,label])=>`<button class="filter" type="button" data-category="${key}" aria-pressed="${key==='all'}">${label}<small>${key==='all'?skills.length:skills.filter(s=>s.category===key).length}</small></button>`).join('');
$('filters').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;category=b.dataset.category;$('skill-grid').scrollTop=0;renderSkills();});
$('skill-search').addEventListener('input',renderSkills);
$('skill-grid').addEventListener('click',e=>{if(e.target.closest('#reset-search')){category='all';$('skill-search').value='';renderSkills();$('skill-search').focus();return;}const b=e.target.closest('[data-skill]');if(!b)return;selected=b.dataset.skill;$('skill-grid').querySelectorAll('[data-skill]').forEach(card=>card.setAttribute('aria-pressed',String(card.dataset.skill===selected)));detail(skills.find(s=>s.name===selected));});
function renderWorkflow() {
  const current = scenarios[scenario];
  $('scenarios').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scenario===scenario)));
  $('scenario-summary').textContent=current.summary;
  $('step-count').textContent=`${String(step+1).padStart(2,'0')} / ${String(current.steps.length).padStart(2,'0')}`;
  $('steps').innerHTML=current.steps.map(([skill,title],i)=>`<button type="button" class="step" data-step="${i}" aria-pressed="${i===step}"><span class="step-number">${String(i+1).padStart(2,'0')}</span><strong>${title}</strong><code>${skill}</code></button>`).join('');
  const [skill,title,input,description,artifact,body]=current.steps[step];
  $('step-detail').innerHTML=`<span class="artifact-label">${input}</span><h3>${title}</h3><p class="step-description">${description}</p><div class="artifact"><div>${artifact}<span>示例产物 · 非实测结果</span></div><pre>${body}</pre></div><a class="step-source" href="${skills.find(s=>s.name===skill).url}" target="_blank" rel="noreferrer">查看 ${skill} 源码 ↗</a>`;
  $('previous').disabled=step===0;$('next').disabled=step===current.steps.length-1;
}
$('scenarios').innerHTML=Object.entries(scenarios).map(([key,s])=>`<button type="button" data-scenario="${key}" aria-pressed="${key===scenario}">${s.label}</button>`).join('');
$('scenarios').addEventListener('click',e=>{const b=e.target.closest('[data-scenario]');if(!b)return;scenario=b.dataset.scenario;step=0;renderWorkflow();});
$('steps').addEventListener('click',e=>{const b=e.target.closest('[data-step]');if(!b)return;step=Number(b.dataset.step);renderWorkflow();$('steps').querySelector(`[data-step="${step}"]`).focus({preventScroll:true});});
$('previous').addEventListener('click',()=>{if(step>0){step--;renderWorkflow();}});
$('next').addEventListener('click',()=>{if(step<scenarios[scenario].steps.length-1){step++;renderWorkflow();}});
const links = {'mechanism-source':'skills/engineering/implement-spec/SKILL.md','audit-source':'skills/engineering/audit-choices/SKILL.md','script-source':'skills/visual/compare-screenshots/scripts/visual-parity-diff.mjs','eval-source':'skills/authoring/eval-skills/SKILL.md','license-source':'LICENSE'};
Object.entries(links).forEach(([id,path])=>$(id).href=source(path));
$('repo-source').href=`https://github.com/dzhng/skills/tree/${revision}`;
renderSkills();renderWorkflow();
$('assessment-grid').innerHTML = assessments.map(([title,body])=>`<article><h3>${title}</h3><p>${body}</p></article>`).join('');
let zoom = 1;
for (const [id,delta] of [['map-plus',0.25],['map-minus',-0.25]]) $(id).addEventListener('click',()=>{
  zoom=Math.max(1,Math.min(2.5,zoom+delta));
  $('workflow-map').style.width=`${zoom*100}%`;
  $('map-zoom').textContent=`${Math.round(zoom*100)}%`;
  $('map-minus').disabled=zoom===1;$('map-plus').disabled=zoom===2.5;
});
// Dynamic cards change the height above deep links; align after rendering.
if (location.hash) {
  const target = document.getElementById(location.hash.slice(1));
  window.addEventListener('pageshow', () => {
    setTimeout(() => target?.scrollIntoView({behavior:'instant',block:'start'}), 0);
  }, {once:true});
}
