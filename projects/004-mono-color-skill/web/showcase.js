(() => {
 const all=window.MONO_CASES, dialog=document.querySelector('#case-dialog');
 let filtered=all,current=0;
 const el=id=>document.getElementById(id);
 function show(index){
  current=(index+filtered.length)%filtered.length;
  const c=filtered[current];
  el('case-large-image').src=c.src;el('case-large-image').alt='Yan Liu 原创生成案例：'+c.title;
  el('case-dialog-title').textContent=c.title;el('case-dialog-colors').textContent=c.colors+' · '+c.category;
  el('case-dialog-look').textContent=c.look;el('case-dialog-use').textContent=c.use;
  el('case-dialog-source').href=c.source;el('case-position').textContent=`${current+1} / ${filtered.length} · 当前分类`;
 }
 document.querySelectorAll('[data-case-filter]').forEach(b=>b.addEventListener('click',()=>{
  const category=b.dataset.caseFilter;
  filtered=category==='全部'?all:all.filter(c=>c.category===category);
  document.querySelectorAll('[data-case-filter]').forEach(other=>{other.classList.toggle('active',other===b);other.setAttribute('aria-pressed',String(other===b));});
  document.querySelectorAll('.case-card').forEach(card=>card.hidden=category!=='全部'&&card.dataset.category!==category);
  el('case-count').textContent=`${filtered.length} / ${all.length} 件作品`;
 }));
 document.querySelectorAll('[data-case]').forEach(b=>b.addEventListener('click',()=>{show(filtered.findIndex(c=>c.id===b.dataset.case));dialog.showModal();}));
 el('case-prev').addEventListener('click',()=>show(current-1));el('case-next').addEventListener('click',()=>show(current+1));
 el('case-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();show(current+1);}if(e.key==='ArrowLeft'){e.preventDefault();show(current-1);}});
 document.querySelectorAll('.case-image img').forEach(img=>img.addEventListener('error',()=>{img.hidden=true;const note=document.createElement('span');note.className='case-load-error';note.textContent='原站图片暂不可用，点击下方「查看原作」';img.parentElement.append(note);},{once:true}));
})();
