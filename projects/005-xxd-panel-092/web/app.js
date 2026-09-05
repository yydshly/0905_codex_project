import {makeTask, taskMarkdown, modeNames, revision} from './task.mjs';
import {creativeIdeas} from './creative.mjs';
const $ = id => document.getElementById(id);
const selected = name => [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value);
const form = $('config');
let current;
function update() {
  const modes = selected('mode');
  const ordinary = modes.some(mode => mode !== 'wallpaper-pack');
  $('size-field').hidden = !ordinary;
  $('wallpaper-field').hidden = !modes.includes('wallpaper-pack');
  $('batch-field').hidden = $('input-kind').value !== 'batch';
  $('locale-field').hidden = $('text-mode').value === 'none';
  $('copy-field').hidden = $('text-mode').value !== 'exact';
  current = makeTask({source:$('source-path').value,kind:$('input-kind').value,count:$('image-count').value,modes,sizes:selected('size'),custom:$('custom-size').value,text:$('text-mode').value,locale:$('locale').value,copy:$('exact-copy').value,wallpaper:$('wallpaper').value});
  $('validation').textContent = current.errors.join(' ');
  $('output-count').textContent = current.errors.length ? '等待完整配置' : `${current.total} 张成品${$('input-kind').value === 'batch' ? '（估计）' : ''}`;
  $('request-output').value = current.request;
  $('command-output').textContent = current.command;
  $('copy-request').disabled = $('download-task').disabled = current.errors.length > 0;
  $('copy-status').textContent = '';
  $('output-meta').textContent = current.errors.length ? '补齐设置后会自动生成任务。' : `${current.count} 张输入 · ${current.modes.map(mode => modeNames[mode]).join(' / ')} · 不含失败重试${current.total > 20 ? '。规模较大，建议先用一张验证效果与成本。' : ''}`;
}
form.addEventListener('submit', event => event.preventDefault());
$('input-kind').addEventListener('change', () => {
  // Only replace our examples, never rewrite a path entered by the user.
  if ($('input-kind').value === 'batch' && $('source-path').value === 'photo.jpg') $('source-path').value = './photos';
  if ($('input-kind').value === 'single' && $('source-path').value === './photos') $('source-path').value = 'photo.jpg';
  update();
});
form.addEventListener('input', () => {
  document.querySelectorAll('[data-preset]').forEach(button => button.setAttribute('aria-pressed','false'));
  $('task-title').textContent = '按你的交付要求组织任务';
  $('task-note').textContent = '这里估算成品数量，不代表原生分辨率支持或实际调用费用。不同画幅重新构图，同一画幅的多个分辨率可在验收后导出。';
  update();
});
const presets = {
  first:{modes:['left-right'],sizes:['16:9'],text:'none',title:'从一张照片观察风格转译',note:'首次建议无文字、单一画幅，先判断主体是否可辨认、线条是否符合预期。'},
  cover:{modes:['design-only'],sizes:['3:4'],text:'none',title:'为自己的阅读笔记制作封面',note:'先生成无字插画，再用排版工具添加准确标题。素材请使用自己的图片或已获许可的图片。'},
  compare:{modes:['top-bottom','design-only'],sizes:['3:4','16:9'],text:'none',title:'让模式和画幅成为对照变量',note:'同一素材输出四张，比较主体保持、留白和重构能力。记录每张的失败点，不只挑最好看的一张。'},
  wallpaper:{modes:['wallpaper-pack'],sizes:[],text:'none',title:'以共同定调图连接四个屏幕',note:'先完成一张定调图，其余设备共同参考它与原照片，分别重构。成品数量为四张，不是一张四宫格。'}
};
function setChecks(name, values) {document.querySelectorAll(`input[name="${name}"]`).forEach(input => input.checked = values.includes(input.value));}
document.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', () => {
  const preset = presets[button.dataset.preset];
  setChecks('mode',preset.modes); setChecks('size',preset.sizes);
  $('custom-size').value = ''; $('text-mode').value = preset.text; $('wallpaper').value = 'linked';
  $('task-title').textContent = preset.title; $('task-note').textContent = preset.note;
  document.querySelectorAll('[data-preset]').forEach(item => item.setAttribute('aria-pressed',String(item === button)));
  update();
}));
document.querySelectorAll('[data-mode]').forEach(link => link.addEventListener('click', () => {
  setChecks('mode',[link.dataset.mode]);
  setChecks('size',link.dataset.mode === 'left-right' ? ['16:9'] : ['3:4']);
  $('custom-size').value = '';
  document.querySelectorAll('[data-preset]').forEach(button => button.setAttribute('aria-pressed','false'));
  $('task-title').textContent = `开始配置${modeNames[link.dataset.mode]}`;
  $('task-note').textContent = '继续选择画幅和文字方式，补上真实素材路径，然后复制任务给支持该 Skill 的 Agent。';
  update();
}));
$('copy-request').addEventListener('click', async () => {
  if (current.errors.length) return;
  const request = current.request;
  try {
    await navigator.clipboard.writeText(request);
    $('copy-status').textContent = '已复制。打开支持该 Skill 的 Agent，附上素材后粘贴。';
  } catch {
    $('request-output').focus(); $('request-output').select();
    $('copy-status').textContent = '浏览器未开放剪贴板，已选中指令；请按 Ctrl+C / ⌘C 复制。';
  }
});
$('download-task').addEventListener('click', () => {
  if (current.errors.length) return;
  const url = URL.createObjectURL(new Blob([taskMarkdown(current)],{type:'text/markdown;charset=utf-8'}));
  const a = document.createElement('a'); a.href = url; a.download = 'xxd-panel-092-task.md';
  a.click(); setTimeout(() => URL.revokeObjectURL(url),1000);
  $('copy-status').textContent = '已准备下载任务单；完成后可将它交给 Agent 执行。';
});
const steps = [
  {owner:'Agent 执行规范',title:'先确定这次到底要交付什么',text:'识别输入图片，解析模式、尺寸、文字与语言。目录输入逐张隔离；一次确认共同设置，避免把上一张的内容带到下一张。',source:'SKILL.md',boundary:'批量队列目前主要由 Agent 按文档执行，不是独立的持久任务服务。'},
  {owner:'风格原文 + 运行适配器',title:'完整风格原文，追加一个交付方案',text:'每张请求包含中文原始风格正文、公共交付前言、一个选定模式、一个文字模式和用户明确要求。运行层替换旧画幅容器，其余审美要求保留。',source:'references/xxd-panel-092-prompt.zh-CN.md',boundary:'这是自然语言约束。规则写入请求，不代表模型一定准确遵守；输出仍需验收。'},
  {owner:'外部图像模型 + 接口脚本',title:'让图像模型重构整张画面',text:'Agent 提供参考照片和完整提示词，通过可用生图工具或兼容接口生成位图。对照海报也默认整张一次生成，不先拆成两个局部。',source:'scripts/configured_imagegen.py',boundary:'没有模型权重或本地线描算法。接口脚本负责请求、响应和 PNG 保存；尺寸校准可能包含裁切。'},
  {owner:'Agent 视觉检查 + 有限脚本辅助',title:'核对交付，失败项单独重试',text:'检查主体可辨认、风格、模式、文字、尺寸和数量。完整画布失败时，仅重试有问题的输出一次。精确分区或保留原图时才按条件使用拼接脚本。',source:'scripts/compose_panel.py',boundary:'脚本能处理尺寸和分界，不会自动判断审美、主体一致性或中文准确率；需要视觉与人工复核。'}
];
document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
  const step = steps[Number(button.dataset.step)];
  document.querySelectorAll('[data-step]').forEach(item => item.setAttribute('aria-pressed',String(item === button)));
  $('step-owner').textContent = step.owner; $('step-title').textContent = step.title;
  $('step-text').textContent = step.text; $('step-boundary').textContent = step.boundary;
  $('step-source').textContent = `${step.source} ↗`;
  $('step-source').href = `https://github.com/nevertoday/xxd-panel-092/blob/${revision}/${step.source}`;
}));
update();
function showIdea(index) {
  const idea = creativeIdeas[index];
  document.querySelectorAll('[data-idea]').forEach(button => button.setAttribute('aria-pressed',String(Number(button.dataset.idea) === index)));
  $('idea-name').textContent = `${String(index+1).padStart(2,'0')} / ${idea.name}`;
  for (const key of ['level','change','scene','example','value','boundary']) $('idea-'+key).textContent = idea[key];
  $('idea-request').value = idea.prompt;
  $('idea-copy-status').textContent = '';
}
document.querySelectorAll('[data-idea]').forEach(button => button.addEventListener('click', () => showIdea(Number(button.dataset.idea))));
$('copy-idea').addEventListener('click', async () => {
  try {await navigator.clipboard.writeText($('idea-request').value); $('idea-copy-status').textContent = '已复制。附上自己的参考图片，并说明要尝试这条扩展创意。';}
  catch {$('idea-request').focus(); $('idea-request').select(); $('idea-copy-status').textContent = '已选中文本，请按 Ctrl+C / ⌘C 复制。';}
});
showIdea(0);
