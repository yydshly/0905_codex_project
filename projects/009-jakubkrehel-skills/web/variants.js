const choices=[['compact','紧凑扫描'],['balanced','均衡浏览'],['reading','阅读优先']];
const picker=document.createElement('nav');picker.className='variant-picker';picker.setAttribute('aria-label','选择密度方案');
picker.innerHTML=choices.map(([id,name],i)=>'<button type="button" data-choice="'+id+'">'+(i+1)+' '+name+'</button>').join('')+'<a href="./run.html#variants">取舍与证据 ↗</a>';document.body.append(picker);
function apply(id){if(!choices.some(c=>c[0]===id))id='balanced';document.body.dataset.variant=id;const url=new URL(location.href);url.searchParams.set('variant',id);history.replaceState(null,'',url);picker.querySelectorAll('button').forEach(b=>{if(b.dataset.choice===id)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});}
picker.addEventListener('click',e=>{const b=e.target.closest('button');if(b)apply(b.dataset.choice);});
document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))return;let i=choices.findIndex(c=>c[0]===document.body.dataset.variant);if(e.key==='ArrowRight')i=(i+1)%3;else if(e.key==='ArrowLeft')i=(i+2)%3;else if(['1','2','3'].includes(e.key))i=Number(e.key)-1;else return;e.preventDefault();apply(choices[i][0]);});
apply(new URL(location.href).searchParams.get('variant'));
