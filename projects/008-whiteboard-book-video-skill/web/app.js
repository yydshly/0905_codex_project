const upstream = 'https://github.com/nutllwhy/whiteboard-book-video-skill/blob/aac0295461f381c4a6052b28802221cfec7b28b9/';
document.querySelectorAll('[data-source]').forEach(a => { a.href = upstream + a.dataset.source; });

const stages = [
  {tag:'AI / 语义与策划',title:'先决定讲什么，再决定怎么拍。',body:'执行工作流的 AI 调研书籍与目标读者，按钩子、痛点、观点、论证、行动和收尾组织讲述。每个镜头都有对应的口播与生图提示词。',input:'书籍或长内容、目标读者、节奏选择',output:'调研报告、分镜表、逐字稿、提示词',limit:'没有自带完整电子书解析器；检索资料也不能代替原书论证核验。',source:'references/script-writing.md'},
  {tag:'IMAGE MODEL / 素材生成',title:'统一风格，让信息有视觉秩序。',body:'图像模型生成竖版白板信息图：马克笔线条、红蓝黑配色、角落火柴人。系列图片参考已确认核心图延展，底部留给字幕。',input:'逐镜头提示词、已确认的风格参考',output:'每个镜头对应的静态信息图',limit:'文字包含在生成图片里；乱码、肢体异常和风格漂移仍需检查与修图。',source:'references/image-prompt.md'},
  {tag:'TTS + ASR / 声音与时间',title:'配音，是整条视频的时间基准。',body:'先生成口播，再用 ffprobe 核验真实时长。faster-whisper 的词级转写提供时间戳，用于后续字幕卡点与镜头安排。',input:'口播逐字稿、所选声线',output:'配音音频、带时间戳的转写 JSON',limit:'换声线后要重新检查时长和对齐；中文错字、繁简及断句需要额外处理。',source:'references/audio-voice.md'},
  {tag:'PYTHON / 片段生成',title:'把已整理字幕，转换成网页动画。',body:'make_subtitles.py 遍历 cues 数组，将文字与高亮标记转换为字幕 HTML，并生成 GSAP 入场、退场和强制隐藏片段。',input:'已整理的 start / end / group / segs',output:'subs.html 与 subs.js 片段',limit:'脚本不执行 ASR，不自动把识别结果变成 cues，也没有逐字推进的高亮逻辑。',source:'scripts/make_subtitles.py'},
  {tag:'HTML + GSAP / 确定性装配',title:'用浏览器动画，组织最终画面。',body:'每个镜头使用带时间属性的 section；CSS 遮罩配合 GSAP 逐步揭示图片并轻微推近。HyperFrames 本地渲染，画面按配音长度铺设。',input:'分镜图、配音、字幕片段、时间安排',output:'竖屏视频；随后进入音乐混音',limit:'当前“手绘”是图片揭示效果，不识别真实笔画；多图同镜的初始状态与重叠需实际抽帧核验。',source:'references/render-and-assemble.md'},
  {tag:'FFMPEG + REVIEW / 混音与验收',title:'人声清晰，才算完成讲述。',body:'优先使用足够长的纯音乐，裁剪并淡入淡出。以旁白作侧链触发源压低 BGM，混音后检查音量、编码、时长与真实渲染画面。',input:'带口播的视频、背景音乐',output:'经过检查的 MP4 成片',limit:'流程检查不证明内容准确或表达有效；本轮已导出 MiniMax 纯旁白视频，音乐混音及系统性费用与速度测评尚未进行。',source:'references/audio-music.md'}
];
const panel = document.querySelector('#stage-panel');
function showStage(index) {
  const s = stages[index];
  panel.innerHTML = `<div class="eyebrow">${String(index+1).padStart(2,'0')} / ${s.tag}</div><h3>${s.title}</h3><p>${s.body}</p><div class="io-row"><div><small>输入 / INPUT</small><p>${s.input}</p></div><b aria-hidden="true">→</b><div><small>输出 / OUTPUT</small><p>${s.output}</p></div></div><p class="stage-limit"><strong>实现边界</strong>　${s.limit}</p><a class="stage-source" href="${upstream+s.source}">查看固定版本依据 ↗</a>`;
  document.querySelectorAll('[data-stage]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.stage)===index)));
}
document.querySelectorAll('[data-stage]').forEach(b => b.addEventListener('click', () => showStage(Number(b.dataset.stage))));
showStage(0);

const scenes = [
  ['提炼观点','一本书，只讲清','一个关键问题。','内容 × 结构 × 表达','先有观点，再有画面'],
  ['组织讲述','一个好问题，','带出一段讲述。','钩子 → 观点 → 行动','把长内容组织成短句'],
  ['制作画面','用一张关系图，','让逻辑可见。','白板 + 箭头 + 关键词','图像模型先生成完整图片'],
  ['生成配音','让声音，','决定视频节奏。','口播时长 = 时间基准','根据真实配音安排镜头'],
  ['准备字幕','每一句话，','都有出场时间。','时间戳 → cues → 字幕','识别之后还需要校对与断句'],
  ['本地渲染','逐步露出图片，','形成手绘观感。','CSS 遮罩 + GSAP','揭示图片不等于按笔画绘制'],
  ['混音验收','画面与声音，','一起完成讲述。','抽帧 + 音量 + 时长','说话时压低音乐再检查成片']
];
let mode = 'slow';
const modes = {
  slow:{title:'一个叙事块，一张画面。',desc:'把同主题的信息放在一起，用较长停留给观众理解关系的时间。',count:'6–8 张',duration:'6–9 秒',words:'320–380 字',labels:['钩子','痛点','观点','论证','延伸','行动','收尾'],seconds:7},
  dense:{title:'一个短句，推进一个画面。',desc:'将同一主题拆成多个更小的视觉单元，让每张图只对应一句讲述。',count:'16–20 张',duration:'4–5 秒',words:'280–340 字',labels:['设问','反差','困境','原因','观点','拆解一','拆解二','拆解三','案例','对照','解释','延伸','方法一','方法二','方法三','回顾','书名','行动'],seconds:4.5}
};
const storyboard = document.querySelector('#storyboard');
function setMode(next) {
  mode = next;
  const m = modes[mode];
  for (const key of ['title','desc','count','duration','words']) document.querySelector('#mode-'+key).textContent = m[key];
  document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
  storyboard.classList.toggle('dense',mode==='dense');
  storyboard.setAttribute('aria-label',(mode==='slow'?'慢版 7 张':'高密版 18 张')+'分镜结构示意');
  storyboard.innerHTML = m.labels.map((label,i) => `<div class="story-cell"><span>${String(i+1).padStart(2,'0')}</span><i aria-hidden="true"></i><b>${label}</b></div>`).join('');
  resetDemo();
}
document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click',()=>setMode(b.dataset.mode)));

const playButton = document.querySelector('#play-demo');
const ink = document.querySelector('#board-ink');
const progress = document.querySelector('#demo-progress');
const counter = document.querySelector('#scene-counter');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let running = false, elapsed = 0, lastTime = 0, frame = 0, currentScene = -1;
function drawDemo() {
  const m = modes[mode], total = m.labels.length, shotDuration = m.seconds*1000;
  const index = Math.min(Math.floor(elapsed/shotDuration), total-1);
  const sceneIndex = mode==='slow' ? index : Math.min(6,Math.floor(index/total*7));
  if (currentScene!==index) {
    const s = scenes[sceneIndex];
    document.querySelector('#scene-label').textContent = String(index+1).padStart(2,'0')+' / '+m.labels[index];
    const title = document.querySelector('#scene-title');
    title.replaceChildren(document.createTextNode(s[1]),document.createElement('br'));
    const em = document.createElement('em'); em.textContent=s[2]; title.append(em);
    document.querySelector('#scene-formula').textContent=s[3];
    document.querySelector('#scene-caption').textContent=s[4];
    counter.textContent=String(index+1).padStart(2,'0')+' / '+String(total).padStart(2,'0');
    currentScene=index;
  }
  const start = index===0?0:55;
  const fraction = Math.min((elapsed-index*shotDuration)/(index===0?1800:1500),1);
  const reveal = reducedMotion.matches || !running && elapsed===0 ? 110 : start+(110-start)*fraction;
  ink.style.setProperty('--reveal',reveal+'%');
  progress.style.width=(elapsed/(total*shotDuration)*100)+'%';
}
function stopDemo() { running=false; cancelAnimationFrame(frame); playButton.textContent='▶ 继续播放'; playButton.setAttribute('aria-pressed','false'); }
function tick(now) {
  if (!running) return;
  elapsed+=Math.max(0,Math.min(now-lastTime,100)); lastTime=now;
  const duration=modes[mode].labels.length*modes[mode].seconds*1000;
  if (elapsed>=duration) { elapsed=duration;drawDemo();stopDemo();playButton.textContent='↻ 重新播放';return; }
  drawDemo(); frame=requestAnimationFrame(tick);
}
function resetDemo() { stopDemo();elapsed=0;currentScene=-1;drawDemo();playButton.textContent='▶ 播放示意'; }
playButton.addEventListener('click',()=>{
  if(running){stopDemo();return;}
  if(elapsed>=modes[mode].labels.length*modes[mode].seconds*1000){elapsed=0;currentScene=-1;}
  running=true;lastTime=performance.now();playButton.textContent='Ⅱ 暂停示意';playButton.setAttribute('aria-pressed','true');frame=requestAnimationFrame(tick);
});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&running)stopDemo();});
if ('IntersectionObserver' in window) {
  new IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting&&running)stopDemo();}},{threshold:0}).observe(document.querySelector('#demo-board'));
  const links=[...document.querySelectorAll('.site-header nav a')];
  const navObserver = new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting)links.forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));}},{rootMargin:'-20% 0px -60% 0px'});
  links.forEach(a=>navObserver.observe(document.querySelector(a.hash)));
}
setMode('slow');
