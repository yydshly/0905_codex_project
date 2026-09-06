const caps = {
  choose: ['视觉选型','不懂画风术语，也能先做选择。','浏览上游画廊，记下编号，再用同一个编号延续创作方向。','喜欢的风格编号与具体主题','编号对应的名称与风格资料','编号帮助追溯选择，不保证每次生成的人物、笔触或构图一致。'],
  prompt: ['提示词组织','把画风选择与主题放在一起。','默认组织中英文提示词，保留用户明确给出的主题、画幅和文字要求。','编号、主题，以及可选的画幅与限制','选定风格、中英文提示词及使用说明','双语表达依赖对话 Agent；命令行草稿脚本只提供双语标签，不自动翻译中文主题。'],
  reference: ['参考图策略','按预设配置，选择传给模型的信息。','名称优先，其次补正向视觉特征，最后使用对应编号的参考单图。','明确的生图请求、模型配置与编号','名称 / 名称加特征 / 参考图三条路径之一','能力标签来自维护好的配置表，不是实时检测；图像模型仍可能带入原图主体或构图。']
};
const fields = ['cap-kicker','cap-title','cap-description','cap-input','cap-output','cap-boundary'];
document.querySelectorAll('[data-cap]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-cap]').forEach(item => {item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button));});
  fields.forEach((id, index) => document.getElementById(id).textContent = caps[button.dataset.cap][index]);
}));
const mode = document.getElementById('request-mode');
const model = document.getElementById('model-profile');
const style = document.getElementById('style-case');
const theme = document.getElementById('theme');
const output = document.getElementById('request-output');
const copyStatus = document.getElementById('copy-status');
const set = (id, value) => document.getElementById(id).textContent = value;
function update() {
  const imageMode = mode.value === 'image';
  model.disabled = !imageMode;
  let path = 'prompt';
  if (imageMode) {
    if (model.value === 'unknown') path = 'image';
    else if (['001','210'].includes(style.value)) path = 'name';
    else if (style.value === '155') path = 'traits';
    else path = 'image';
  }
  const routes = {
    prompt: ['默认交付','只组织提示词','返回选定风格、中英文提示词和使用说明。普通提示词模式不自动补充核心视觉特征。','不调用生图工具','双语表达由对话 Agent 完成；命令行草稿脚本不会自动翻译主题。'],
    name: ['第一选择 / 名称','使用名称，不传参考图','该编号在上游配置中被标记为名称能力强。输入包含参考作者／风格名称、生图名称和用户主题。','不传图','即使 #210 的特征字段为空，名称分支仍优先命中。配置标签不保证实际生成质量。'],
    traits: ['第二选择 / 补特征','名称加正向视觉特征','名称能力未标记为强，但此配置允许使用特征，且 #155 有可用特征，因此补充可观察的视觉描述。','不传图','脚本过滤含“避免”“不要”“不准”的分句；这属于文字处理，不是视觉质量检测。'],
    image: ['最后选择 / 参考单图','传入对应编号的参考图',model.value === 'unknown' ? '模型未登记，能力未知，按上游约定使用编号单图作为回退。' : '该编号名称能力未确认，且没有可用特征，因此使用对应参考单图。','使用 #' + style.value + ' 单图','要求只借鉴视觉语言、忽略原图主体与构图；图片缺失时应说明限制，并退回文字提示词。']
  };
  ['route-label','route-title','route-description','route-image','route-note'].forEach((id,i) => set(id, routes[path][i]));
  ['name','traits','image'].forEach(step => document.getElementById('step-'+step).classList.toggle('active',step === path));
  const text = theme.value.trim();
  output.textContent = text ? `${style.value} 号风格，主题：${text}。${imageMode ? '请生成图片，并说明是否使用了对应编号参考图。' : '请整理中文和英文提示词。'}` : '请先填写一个具体主题。';
  document.getElementById('copy-request').disabled = !text;
  copyStatus.textContent = '';
}
document.getElementById('route-form').addEventListener('submit', event => event.preventDefault());
[mode,model,style].forEach(element => element.addEventListener('change', update));
theme.addEventListener('input', update);
document.getElementById('copy-request').addEventListener('click', async () => {
  try {await navigator.clipboard.writeText(output.textContent); copyStatus.textContent = '已复制，可以交给 Agent 使用。';}
  catch {const selection = window.getSelection();const range = document.createRange();range.selectNodeContents(output);selection.removeAllRanges();selection.addRange(range);copyStatus.textContent = '已选中文本，请手动复制。';}
});
document.querySelectorAll('[data-source]').forEach(a => {a.href = 'https://github.com/yang0/handraw-style/blob/e51f4f8b9edfd8d2f83e18a4a8eecc6dd5db51a7/' + a.dataset.source;});
update();
