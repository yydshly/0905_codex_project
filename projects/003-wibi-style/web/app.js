(() => {
  'use strict';
  const {styles,routes}=JSON.parse(document.getElementById('research-data').textContent);
  const get=id=>document.getElementById(id);
  document.querySelectorAll('[data-demo]').forEach(button=>button.addEventListener('click',()=>{
    for(const b of document.querySelectorAll('[data-demo]')){
      const selected=b===button;
      b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));
      get(`demo-${b.dataset.demo}`).hidden=!selected;
    }
    get('demo-selection').textContent=`正在查看：${button.querySelector('b').textContent}`;
  }));
  const cards=[...document.querySelectorAll('.style-card')];
  let category='全部',routeIndex=0,stepIndex=0;
  const filterButtons=[...document.querySelectorAll('[data-filter]')];
  function filter(){
    const query=get('style-search').value.trim().toLocaleLowerCase();
    let count=0;
    for(const card of cards){
      const show=(category==='全部'||card.dataset.category===category)&&card.dataset.search.toLocaleLowerCase().includes(query);
      card.hidden=!show;if(show)count++;
    }
    for(const b of filterButtons){const active=b.dataset.filter===category;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));}
    get('style-count').textContent=`${category==='全部'?'全部风格':category} · ${count} 款${query?' · 搜索结果':''}`;
    get('empty-state').hidden=count!==0;
  }
  filterButtons.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;filter();}));
  get('style-search').addEventListener('input',filter);
  get('reset-filters').addEventListener('click',()=>{category='全部';get('style-search').value='';filter();get('style-search').focus();});
  document.querySelectorAll('[data-scenario]').forEach(b=>b.addEventListener('click',()=>{
    category=b.dataset.scenario;get('style-search').value='';filter();
    location.hash='catalog';filterButtons.find(x=>x.dataset.filter===category).focus({preventScroll:true});
  }));
  function renderStep(){
    const route=routes[routeIndex],step=route.steps[stepIndex];
    get('route-label').textContent=route.label;
    get('step-progress').textContent=`0${stepIndex+1} / 05`;
    ['step-title','step-description','step-output','step-note'].forEach((id,i)=>get(id).textContent=step[i]);
    get('route-source').href=styles.find(s=>s.slug===route.slug).source;
    get('next-step').textContent=stepIndex===4?'回到第一步 ↺':'下一步 →';
    for(const b of document.querySelectorAll('[data-route]')){const active=Number(b.dataset.route)===routeIndex;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));}
    for(const b of document.querySelectorAll('[data-step]')){const active=Number(b.dataset.step)===stepIndex;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));}
  }
  document.querySelectorAll('[data-route]').forEach(b=>b.addEventListener('click',()=>{routeIndex=Number(b.dataset.route);stepIndex=0;renderStep();}));
  document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{stepIndex=Number(b.dataset.step);renderStep();}));
  get('next-step').addEventListener('click',()=>{stepIndex=(stepIndex+1)%5;renderStep();});
  const dialog=get('style-dialog');let opener=null;
  document.querySelectorAll('[data-detail]').forEach(b=>b.addEventListener('click',()=>{
    const s=styles.find(x=>x.slug===b.dataset.detail);opener=b;
    get('detail-title').textContent=s.name;get('detail-category').textContent=`${s.category} / ${s.method}`;
    get('detail-description').textContent=s.description;get('detail-input').textContent=s.input;
    get('detail-scene').textContent=s.scene;get('detail-visual').textContent=s.visual;
    get('detail-image').src=s.image;get('detail-image').alt=`${s.name}的上游展示图`;
    get('detail-source').href=s.source;
    get('detail-command').value=s.slug==='office-animals'?`使用 $${s.slug}，生成一张水豚在办公室开会的海报。`:`使用 $${s.slug} 处理这张照片。`;
    get('copy-status').textContent='';dialog.showModal();get('close-dialog').focus();
  }));
  get('close-dialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
  get('copy-command').addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(get('detail-command').value);get('copy-status').textContent='已复制。可在安装对应 Skill 的生图环境中使用。';}
    catch{get('detail-command').focus();get('detail-command').select();get('copy-status').textContent='请按 Ctrl+C（Mac 使用 ⌘C）复制已选中的调用示例。';}
  });
  document.querySelectorAll('.image-button img').forEach(img=>{
    const fallback=()=>{img.hidden=true;img.parentElement.querySelector('.image-fallback').hidden=false;};
    img.addEventListener('error',fallback);if(img.complete&&img.naturalWidth===0)fallback();
  });
})();
