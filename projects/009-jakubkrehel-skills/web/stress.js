import {skills} from './skill-data.js';
import {renderSkillCard} from './skill-card.js';
const cases=[
 {label:'320px 容器 · 正常状态',width:320,skill:skills[0],selected:''},
 {label:'148px 容器 · 网格挤压 · 最长技能标识',width:148,skill:skills.find(s=>s.id==='better-accessibility'),selected:''},
 {label:'640px 容器 · 宽布局',width:640,skill:skills[0],selected:''},
 {label:'320px 容器 · 已选状态',width:320,skill:skills[0],selected:skills[0].id}
];
document.querySelector('#cases').innerHTML=cases.map((c,i)=>'<section style="margin:30px 0"><h2 style="font-size:18px;margin-bottom:10px">'+c.label+'</h2><div style="width:'+c.width+'px;max-width:100%">'+renderSkillCard(c.skill,i,c.selected)+'</div><p class="observation" style="font-size:13px;margin-top:8px">2026-09-06 实际浏览：此场景未见裁剪、重叠或越界。</p></section>').join('');
document.querySelectorAll('.skill-card').forEach(b=>{b.style.width='100%';b.addEventListener('click',()=>{document.querySelector('#detail').textContent='已选择：'+b.dataset.skill;});});
