#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projectRoot = path.join(root, 'projects');
const readmePath = path.join(root, 'README.md');
const statuses = {
  planned: '待研究',
  researching: '研究中',
  prototyping: '实验中',
  completed: '已完成',
  archived: '已归档',
};
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const number = (id) => String(id).padStart(3, '0');
const markdown = (value) => value.replace(/[\\`*_[\]<>|]/g, '\\$&');
const read = (file) => fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

function requireValue(condition, message) {
  if (!condition) throw new Error(message);
}

function singleLine(value) {
  return typeof value === 'string' && value.trim().length > 0 && !/[\r\n]/.test(value);
}

function validateUrl(value, label, optional = false) {
  if (optional && value === '') return;
  requireValue(singleLine(value) && !/[\s<>"\\]/.test(value), `${label} 必须是有效的 HTTPS 链接。`);
  let parsed;
  try { parsed = new URL(value); } catch { throw new Error(`${label} 链接格式无效。`); }
  requireValue(parsed.protocol === 'https:' && !parsed.username && !parsed.password, `${label} 必须使用 HTTPS 且不包含凭据。`);
}

function validateProject(project, folder, checkFiles = true) {
  requireValue(project && typeof project === 'object' && !Array.isArray(project), `${folder}: project.json 必须是对象。`);
  requireValue(Number.isSafeInteger(project.id) && project.id > 0, `${folder}: id 必须为正整数。`);
  requireValue(typeof project.slug === 'string' && slugPattern.test(project.slug), `${folder}: slug 格式无效。`);
  requireValue(folder === `${number(project.id)}-${project.slug}`, `${folder}: 目录与 id / slug 不一致。`);
  for (const field of ['name', 'summary']) {
    requireValue(singleLine(project[field]), `${folder}: ${field} 必须是非空单行文本。`);
  }
  requireValue(typeof project.status === 'string' && Object.hasOwn(statuses, project.status), `${folder}: status 须为 ${Object.keys(statuses).join(' / ')}。`);
  requireValue(Array.isArray(project.tags) && project.tags.every(singleLine), `${folder}: tags 必须是非空文本组成的数组（可为空数组）。`);
  validateUrl(project.source, `${folder}: source`);
  validateUrl(project.demo, `${folder}: demo`, true);
  requireValue(typeof project.cover === 'string' && typeof project.coverAlt === 'string', `${folder}: cover 与 coverAlt 须为字符串。`);
  if (project.cover) {
    requireValue(/^assets\/[a-zA-Z0-9_./-]+\.(png|jpe?g|webp|gif|svg)$/i.test(project.cover)
      && !project.cover.split('/').some((segment) => segment === '..' || segment === '.' || segment === ''),
    `${folder}: cover 须为 assets/ 内的图片路径，文件名使用英文、数字、短横线或下划线。`);
    requireValue(singleLine(project.coverAlt), `${folder}: 有封面时必须填写 coverAlt。`);
    if (checkFiles) {
      const imagePath = path.join(projectRoot, folder, project.cover);
      requireValue(fs.existsSync(imagePath) && fs.statSync(imagePath).isFile(), `${folder}: 封面文件不存在。`);
      const imageRelative = path.relative(fs.realpathSync(path.join(projectRoot, folder)), fs.realpathSync(imagePath));
      requireValue(!imageRelative.startsWith('..') && !path.isAbsolute(imageRelative), `${folder}: 封面必须位于项目内。`);
    }
  }
  if (checkFiles) {
    const projectReadme = path.join(projectRoot, folder, 'README.md');
    requireValue(fs.existsSync(projectReadme) && fs.statSync(projectReadme).isFile(), `${folder}: 缺少 README.md。`);
  }
}

function loadProjects() {
  const projects = [];
  const ids = new Set();
  const slugs = new Set();
  for (const entry of fs.readdirSync(projectRoot, { withFileTypes: true })) {
    requireValue(!entry.isSymbolicLink(), `${entry.name}: projects/ 中不支持符号链接。`);
    if (!entry.isDirectory()) continue;
    const metadataPath = path.join(projectRoot, entry.name, 'project.json');
    requireValue(fs.existsSync(metadataPath), `${entry.name}: 缺少 project.json。`);
    let project;
    try { project = JSON.parse(read(metadataPath)); } catch { throw new Error(`${entry.name}: project.json 不是有效的 JSON。`); }
    validateProject(project, entry.name);
    requireValue(!ids.has(project.id), `${entry.name}: 编号 ${number(project.id)} 重复。`);
    requireValue(!slugs.has(project.slug), `${entry.name}: slug ${project.slug} 重复。`);
    ids.add(project.id);
    slugs.add(project.slug);
    projects.push({ ...project, folder: entry.name });
  }
  return projects.sort((a, b) => a.id - b.id);
}

function replaceBlock(text, key, content) {
  const start = `<!-- ${key}:START -->`;
  const end = `<!-- ${key}:END -->`;
  requireValue(text.split(start).length === 2 && text.split(end).length === 2
    && text.indexOf(start) < text.indexOf(end), `README.md 须包含唯一且成对的 ${key} 标记。`);
  return text.slice(0, text.indexOf(start) + start.length) + `\n${content}\n` + text.slice(text.indexOf(end));
}

function renderReadme(original, projects) {
  const index = [`当前收录 **${projects.length}** 个研究项目。`, ''];
  if (!projects.length) {
    index.push('尚未添加子项目，首个项目将从 **001** 开始。');
  } else {
    index.push('| 编号 | 项目 | 研究摘要 | 主题 | 状态 | 上游 | 演示 |', '| --- | --- | --- | --- | --- | --- | --- |');
    for (const project of projects) {
      const link = `./projects/${project.folder}/README.md`;
      index.push(`| ${number(project.id)} | [${markdown(project.name)}](${link}) | ${markdown(project.summary)} | ${project.tags.map(markdown).join(' / ') || '—'} | ${statuses[project.status]} | [源码](<${project.source}>) | ${project.demo ? `[在线体验](<${project.demo}>)` : '—'} |`);
    }
  }
  const gallery = projects.filter((project) => project.cover).map((project) => {
    const prefix = `./projects/${project.folder}`;
    return `### ${number(project.id)} · ${markdown(project.name)}\n\n[![${markdown(project.coverAlt)}](${prefix}/${project.cover})](${prefix}/README.md)\n\n${markdown(project.summary)}\n\n[研究详情](${prefix}/README.md)${project.demo ? ` · [在线体验](<${project.demo}>)` : ''}`;
  }).join('\n\n');
  const withIndex = replaceBlock(original, 'PROJECT_INDEX', index.join('\n'));
  return replaceBlock(withIndex, 'PROJECT_GALLERY', gallery || '子项目添加封面后，这里会按编号展示图片、摘要和研究入口。');
}

function createProject(args) {
  const { values } = parseArgs({
    args,
    options: { slug: { type: 'string' }, name: { type: 'string' }, source: { type: 'string' }, summary: { type: 'string' } },
    allowPositionals: false,
  });
  const projects = loadProjects();
  const project = {
    id: Math.max(0, ...projects.map((item) => item.id)) + 1,
    slug: values.slug,
    name: values.name,
    summary: values.summary,
    source: values.source,
    status: 'planned',
    tags: [],
    demo: '',
    cover: '',
    coverAlt: '',
  };
  const folder = `${number(project.id)}-${project.slug}`;
  validateProject(project, folder, false);
  requireValue(!projects.some((item) => item.slug === project.slug), `slug ${project.slug} 已存在。`);
  const destination = path.join(projectRoot, folder);
  requireValue(!fs.existsSync(destination), `${folder} 已存在。`);
  const generatedReadme = renderReadme(read(readmePath), [...projects, { ...project, folder }]);
  const replacements = { ID: number(project.id), NAME: markdown(project.name), SUMMARY: markdown(project.summary), SOURCE: project.source, FOLDER: folder };
  const files = ['README.md', 'assets/README.md', 'notes/README.md', 'web/README.md'].map((file) => ({
    file,
    content: read(path.join(root, 'templates', 'project', file)).replace(/\{\{([A-Z]+)\}\}/g, (match, key) => replacements[key] ?? match),
  }));
  fs.mkdirSync(destination);
  for (const { file, content } of files) {
    const target = path.join(destination, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
  fs.writeFileSync(path.join(destination, 'project.json'), JSON.stringify(project, null, 2) + '\n');
  fs.writeFileSync(readmePath, generatedReadme);
  console.log(`已创建 projects/${folder}/，并同步首页索引。`);
}

const help = `用法（在仓库根目录运行）：
  node scripts/projects.mjs new --slug project-name --name "项目名称" --source "https://github.com/owner/repo" --summary "研究摘要"
  node scripts/projects.mjs sync    生成首页索引和图片预览
  node scripts/projects.mjs check   校验资料与首页同步情况`;

try {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === 'help' || command === '--help') {
    console.log(help);
  } else if (command === 'new') {
    createProject(args);
  } else if (command === 'sync' || command === 'check') {
    requireValue(args.length === 0, `${command} 不接受额外参数。`);
    const projects = loadProjects();
    const original = read(readmePath);
    const generated = renderReadme(original, projects);
    if (command === 'sync') {
      if (generated !== original) fs.writeFileSync(readmePath, generated);
      console.log(`已同步 ${projects.length} 个项目的索引与预览。`);
    } else {
      requireValue(original === generated, '首页索引或预览未同步，请运行 node scripts/projects.mjs sync。');
      console.log(`校验通过：${projects.length} 个项目，编号、资料、封面与首页索引一致。`);
    }
  } else {
    throw new Error(`未知命令：${command}\n${help}`);
  }
} catch (error) {
  console.error(`错误：${error.message}`);
  process.exitCode = 1;
}
