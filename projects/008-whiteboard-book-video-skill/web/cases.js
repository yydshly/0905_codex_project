import {caseStudies} from './cases-data.mjs';
let selectedCase='reading',caseElapsed=0,caseRunning=false,caseFrame=0,casePreviousTime=0,caseShot=-1;
const $case=id=>document.getElementById(id);
const caseReduced=window.matchMedia('(prefers-reduced-motion: reduce)');
function stopCase(){caseRunning=false;cancelAnimationFrame(caseFrame);$case('case-play').setAttribute('aria-pressed','false');$case('case-play').textContent=caseElapsed>=30?'↻ 重新播放':caseElapsed>0?'▶ 继续播放':'▶ 播放案例';}
function renderCase(){
  const data=caseStudies[selectedCase],index=Math.min(5,Math.floor(caseElapsed/5)),shot=data.shots[index];
  if(caseShot!==index){
    caseShot=index;
    $case('case-shot-label').textContent=`${String(index+1).padStart(2,'0')} / 06 · ${index*5}–${index*5+5} 秒`;
    $case('case-shot-title').textContent=shot[0];
    $case('case-visual').replaceChildren();
    shot[2].forEach((label,i)=>{if(i){const arrow=document.createElement('span');arrow.className='case-arrow';arrow.textContent='↓';arrow.setAttribute('aria-hidden','true');$case('case-visual').append(arrow);}const box=document.createElement('div');box.className='case-node';const number=document.createElement('small');number.textContent=i?'要点 02':'要点 01';const text=document.createElement('b');text.textContent=label;box.append(number,text);$case('case-visual').append(box);});
    $case('case-takeaway').textContent=shot[3];$case('case-subtitle').textContent=shot[1];$case('case-explanation').textContent='为什么这样安排：'+shot[4];
    document.querySelectorAll('[data-case-shot]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.caseShot)===index)));
  }
  const portion=Math.min(1,(caseElapsed-index*5)/1.2),base=index?55:0;
  $case('case-drawing').style.clipPath=caseReduced.matches||!caseRunning?'none':`inset(0 ${100-(base+(100-base)*portion)}% 0 0)`;
  $case('case-time').textContent=`00:${String(Math.floor(caseElapsed)).padStart(2,'0')} / 00:30`;
  $case('case-seek').value=caseElapsed;
  $case('case-prev').disabled=index===0;$case('case-next').disabled=index===5;
}
function selectCase(id){stopCase();selectedCase=id;$case('download-case').href='./samples/'+id+'.md';caseElapsed=0;caseShot=-1;const d=caseStudies[id];
  for(const [element,key] of [['case-title','title'],['case-goal','goal'],['case-input-title','inputTitle'],['case-input','input'],['case-origin','origin']])$case(element).textContent=d[key];
  const script=$case('case-script');script.replaceChildren();
  d.shots.forEach((shot,i)=>{const b=document.createElement('button');b.type='button';b.dataset.caseShot=i;b.setAttribute('aria-controls','case-screen');const time=document.createElement('span');time.textContent=`${String(i*5).padStart(2,'0')}–${String(i*5+5).padStart(2,'0')}s`;const text=document.createElement('span');text.textContent=shot[1];b.append(time,text);b.addEventListener('click',()=>{stopCase();caseElapsed=i*5;stopCase();renderCase();if(window.matchMedia('(max-width:760px)').matches)$case('case-screen').scrollIntoView({block:'start',behavior:caseReduced.matches?'auto':'smooth'});});script.append(b);});
  document.querySelectorAll('[data-case]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.case===id)));stopCase();renderCase();
}
document.querySelectorAll('[data-case]').forEach(b=>b.addEventListener('click',()=>selectCase(b.dataset.case)));
function caseTick(now){if(!caseRunning)return;caseElapsed=Math.min(30,caseElapsed+Math.max(0,(now-casePreviousTime)/1000));casePreviousTime=now;renderCase();if(caseElapsed>=30){stopCase();return;}caseFrame=requestAnimationFrame(caseTick);}
$case('case-play').addEventListener('click',()=>{if(caseRunning){stopCase();renderCase();return;}if(caseElapsed>=30){caseElapsed=0;caseShot=-1;}caseRunning=true;casePreviousTime=performance.now();$case('case-play').textContent='Ⅱ 暂停';$case('case-play').setAttribute('aria-pressed','true');caseFrame=requestAnimationFrame(caseTick);});
$case('case-prev').addEventListener('click',()=>{stopCase();caseElapsed=Math.max(0,(caseShot-1)*5);renderCase();});
$case('case-next').addEventListener('click',()=>{stopCase();caseElapsed=Math.min(25,(caseShot+1)*5);renderCase();});
$case('case-seek').addEventListener('input',e=>{stopCase();caseElapsed=Number(e.target.value);renderCase();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopCase();renderCase();}});
if('IntersectionObserver' in window)new IntersectionObserver(entries=>{if(!entries[0].isIntersecting){stopCase();renderCase();}}).observe($case('case-screen'));
selectCase('reading');
