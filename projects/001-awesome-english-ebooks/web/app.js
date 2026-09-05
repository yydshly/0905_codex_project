const search = document.querySelector('#source-search');
const filters = [...document.querySelectorAll('[data-filter]')];
let selected = 'all';
function filterSources() {
  const query = search.value.trim().toLocaleLowerCase();
  let count = 0;
  document.querySelectorAll('[data-source]').forEach(card => {
    const matches = card.dataset.search.toLocaleLowerCase().includes(query) &&
      (selected === 'all' || card.dataset.formats.split(' ').includes(selected));
    card.hidden = !matches;
    if (matches) count++;
  });
  document.querySelector('#source-count').textContent = '显示 '+count+' 个当前收录来源 · 数量为固定版本文件统计，不是期次数';
  document.querySelector('#no-results').hidden = count !== 0;
}
search.addEventListener('input', filterSources);
filters.forEach(button => button.addEventListener('click', () => {
  selected = button.dataset.filter;
  filters.forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  filterSources();
}));
document.querySelectorAll('[data-stage]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-stage]').forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('.stage-panel').forEach((panel, index) => {
    panel.hidden = index !== Number(button.dataset.stage);
  });
}));
const nav = [...document.querySelectorAll('nav a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach(entry => {
      nav.forEach(link => link.classList.toggle('active', link.hash === '#'+entry.target.id));
    });
  }, {rootMargin:'-12% 0px -68% 0px'});
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}
