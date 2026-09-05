// Shared renderer used by the real atlas and its boundary harness.
const escapeHtml=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
export function renderSkillCard(skill,index,selected){
 const active=skill.id===selected;
 return '<button type="button" class="skill-card '+(active?'selected':'')+'" data-skill="'+escapeHtml(skill.id)+'" aria-pressed="'+active+'" aria-controls="detail"><span class="skill-top"><span class="skill-icon" aria-hidden="true">'+escapeHtml(skill.icon)+'</span><span class="skill-num">'+String(index+1).padStart(2,'0')+' · '+(active?'✓ 已选':'查看')+'</span></span><span class="skill-title">'+escapeHtml(skill.name)+'</span><code>'+escapeHtml(skill.id)+'</code><span class="skill-summary">'+escapeHtml(skill.short)+'</span></button>';
}

