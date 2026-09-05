export const revision = '9e86434703fe8eeccac2b6055900716c8eda4ee6';
export const modeNames = {'top-bottom':'上下对照','left-right':'左右对照','design-only':'纯设计图','wallpaper-pack':'四端壁纸'};
export const wallpaperSizes = 'phone=1440x3200,ipad=2048x2732,desktop=3840x2160,watch=1024x1024';
const unique = values => [...new Set(values)];
export function makeTask(input) {
  const errors = [];
  const source = input.source.trim();
  if (!source || /[\r\n\x00-\x1f]/.test(source)) errors.push('请填写非空、单行的图片或目录路径。');
  const modes = unique(input.modes);
  if (!modes.length || modes.some(mode => !modeNames[mode])) errors.push('请至少选择一种有效的交付模式。');
  const ordinary = modes.filter(mode => mode !== 'wallpaper-pack');
  const hasWallpaper = modes.includes('wallpaper-pack');
  const custom = (input.custom || '').replaceAll('×','x').split(/[,，\s]+/).filter(Boolean);
  const rawSizes = ordinary.length ? unique([...input.sizes, ...custom]) : [];
  const validSize = value => /^(auto|source)$/.test(value) || /^[1-9]\d{0,4}:[1-9]\d{0,4}$/.test(value) || /^[1-9]\d{0,4}x[1-9]\d{0,4}$/.test(value);
  if (ordinary.length && !rawSizes.length) errors.push('普通模式至少需要一个画幅或准确像素尺寸。');
  if (rawSizes.some(size => !validSize(size))) errors.push('尺寸格式应为 3:4 或 2160x3840；多项用逗号分隔。');
  // Canonicalize equivalent ratios (6:8 and 3:4), while retaining exact pixel targets.
  const gcd = (a,b) => b ? gcd(b,a%b) : a;
  const sizes = unique(rawSizes.map(size => {
    if (!validSize(size) || !size.includes(':')) return size;
    const [a,b] = size.split(':').map(Number); const d = gcd(a,b);
    return `${a/d}:${b/d}`;
  }));
  const count = input.kind === 'batch' ? Number(input.count) : 1;
  if (!Number.isInteger(count) || count < 1 || count > 1000) errors.push('图片数应为 1–1000 的整数。');
  if (!['none','prompt','exact'].includes(input.text)) errors.push('请选择有效的文字方式。');
  if (input.text === 'exact' && !input.copy.trim()) errors.push('请填写需要逐字保留的文案。');
  if (input.text !== 'none' && !['zh-CN','en-GB','ja-JP'].includes(input.locale)) errors.push('请选择画面文字语言。');
  if (hasWallpaper && !['linked','independent'].includes(input.wallpaper)) errors.push('请选择壁纸关系。');
  if (errors.length) return {errors, total:0, request:'', command:'', modes, sizes};
  const total = count * (ordinary.length * sizes.length + (hasWallpaper ? 4 : 0));
  const language = {'zh-CN':'简体中文','en-GB':'英语','ja-JP':'日语'}[input.locale];
  const sizeLabels = sizes.map(size => ({auto:'按图片智能推荐',source:'跟随原图比例'}[size] || size));
  const lines = ['请使用 XXD Panel 092 Skill，按它的中文原始风格提示词处理本次素材。', '', `输入：${source}`, input.kind === 'batch' ? `输入是一个图片目录，预计 ${count} 张；请先盘点实际可读图片并报告数量，共用以下设置，逐张隔离处理。` : '输入是一张图片；如该路径不可访问，请使用我在本次会话上传的对应图片；没有图片时请告知，不要寻找替代素材。', `交付模式：${modes.map(mode => modeNames[mode]).join('、')}。`];
  if (ordinary.length) lines.push(`普通模式画幅：${sizeLabels.join('、')}；应用到每种普通模式。不同画幅分别完整构图。`);
  if (hasWallpaper) lines.push(`四端壁纸：${input.wallpaper === 'linked' ? '连贯模式。先生成一张定调图，经确认后，其余设备共同参考原照片与该定调图，分别重新构图' : '独立模式。每张只参考原照片，分别重新构图'}。`, '壁纸目标像素：手机 1440x3200、平板 2048x2732、电脑 3840x2160、手表 1024x1024。请先确认生成通道支持；若原生尺寸不支持，请说明尺寸适配方案及是否裁切。');
  if (input.text === 'none') lines.push('文字：无文字，不要字母、数字、Logo 或伪文字。');
  if (input.text === 'prompt') lines.push(`文字：由图像模型按原始风格提炼，语言为${language}；事实性信息只能来自已提供或已核实的内容。`);
  if (input.text === 'exact') lines.push(`文字语言：${language}。准确文案如下（逐字使用，不改写、不翻译、不补充）：`, input.copy, '准确文案结束。', ...(input.kind === 'batch' ? ['上述同一文案应用到目录内每张图片。'] : []));
  lines.push(`按当前填写的数量与尺寸选项，预计交付 ${total} 张 PNG，不含失败重试。auto / source 解析后如与其他画幅重合，请明确实际数量。`, '本次使用明确给出的设置，不读取或保存交付偏好（--prefs off）。', '请先确认参考图生成能力实际可用。使用新任务目录，检查主体可辨认、模式、文字、画幅与数量；失败仅重试对应项，并报告结果路径及未完成项。');
  if (input.kind === 'batch') lines.push('每张素材内容和定调图互相隔离；实际文件数量与本页估计不一致时，以盘点结果重新计算。');
  const quote = value => JSON.stringify(value);
  const args = [`/xxd-panel-092 ${quote(source)}`, `--mode ${modes.join(',')}`];
  if (ordinary.length) args.push(`--size ${sizes.join(',')}`);
  if (hasWallpaper) args.push(`--wallpaper ${input.wallpaper}`, `--wallpaper-size ${wallpaperSizes}`);
  args.push(`--text ${input.text}`);
  if (input.text !== 'none') args.push(`--locale ${input.locale}`);
  if (input.text === 'exact') args.push(`--copy ${quote(input.copy)}`);
  args.push('--prefs off');
  return {errors, total, request:lines.join('\n'), command:args.join(' '), modes, sizes, count, hasWallpaper};
}
export function taskMarkdown(task) {
  return `# XXD Panel 092 创作任务单\n\n研究来源：https://github.com/nevertoday/xxd-panel-092\n研究版本：${revision}\n\n## 交给 Agent 的指令\n\n${task.request}\n\n## 交付复核\n\n- [ ] 主体身份与关系可辨认\n- [ ] 线描与留白符合原始风格\n- [ ] 模式、尺寸、PNG 数量正确\n- [ ] 文字准确，无意外裁切\n- [ ] 记录耗时、重试与失败项\n\n本任务单由研究网页生成，不代表已经执行。上游为 PolyForm Noncommercial 1.0.0；商业复用需先解决授权。\n`;
}
