import './style.css';
import { heroesSection } from './heroes.js';
import { monstersSection } from './monsters.js';
import { stickerTrail } from './cta.js';
import { dummyOf, ui, brand, heroVideo, heroVideoEnd, heroBackgrounds, logoEmblem, stores, menu, socials, features, heroes, monsters, story, nav, media, mediaInitial, cta, footer, gameName } from './content.js';

const $ = (s, el = document) => el.querySelector(s);
const h = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
};

/* ───────── 지연 로딩 + 0.25s 페이드인 (원본 gatsby-image 방식) ─────────
   <div class="lazy" data-src> 가 뷰포트에 가까워지면 이미지를 받아 opacity 0→1 */
const lazyIO = new IntersectionObserver(
  (entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      lazyIO.unobserve(en.target);
      loadLazy(en.target);
    }
  },
  { rootMargin: '200px 0px' },
);
function loadLazy(box) {
  const img = box.querySelector('img');
  if (!img || img.src) return;
  img.onload = () => box.classList.add('is-loaded');
  img.onerror = () => {
    if (!img.dataset.fallback) { img.dataset.fallback = 1; img.src = dummyOf(box.dataset.src); return; }
    box.classList.add('is-loaded', 'is-missing');
  };
  img.src = box.dataset.src;
}
function lazyImg(src, cls = '', alt = '') {
  const box = h('div', `lazy ${cls}`);
  box.dataset.src = src;
  const img = h('img');
  img.alt = alt;
  img.decoding = 'async';
  box.append(img);
  lazyIO.observe(box);
  return box;
}

/* ───────── 아이콘 ───────── */
const ICON = {
  apple: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.7-1-2.7-4.1zM13.9 5c.7-.9 1.2-2 1-3.2-1 0-2.2.7-3 1.6-.6.7-1.2 1.9-1 3.1 1.1.1 2.3-.6 3-1.5z"/></svg>',
  google: '<svg viewBox="0 0 24 24"><path fill="#00d7fe" d="M3.6 2.3 13.3 12l-9.7 9.7c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1z"/><path fill="#ffce00" d="m16.6 15.3-3.3-3.3 3.3-3.3 3.8 2.2c1 .6 1 1.6 0 2.2z"/><path fill="#ff3a44" d="M16.6 15.3 13.3 12l-9.7 9.7c.4.2.9.2 1.4-.1z"/><path fill="#00f076" d="M16.6 8.7 5 2.4c-.5-.3-1-.3-1.4-.1l9.7 9.7z"/></svg>',
  web: '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6" fill="#ff3c64"/><text x="12" y="17" text-anchor="middle" font-size="13" font-weight="900" fill="#fff" font-family="Pretendard,sans-serif">M</text></svg>',
  facebook: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.4H7.4v3.2h2.8V22z"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.8 3h3.1l-6.8 7.7 8 10.3h-6.2l-4.9-6.3L5.4 21H2.3l7.2-8.3L1.8 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M22 8.2s-.2-1.5-.8-2.1c-.8-.8-1.6-.8-2-.9C16.4 5 12 5 12 5s-4.4 0-7.2.2c-.4.1-1.3.1-2 .9-.6.6-.8 2.1-.8 2.1S2 9.9 2 11.6v1.6c0 1.7.2 3.4.2 3.4s.2 1.5.8 2.1c.8.8 1.8.8 2.2.9 1.6.2 6.8.2 6.8.2s4.4 0 7.2-.2c.4-.1 1.3-.1 2-.9.6-.6.8-2.1.8-2.1s.2-1.7.2-3.4v-1.6c0-1.7-.2-3.4-.2-3.4zM9.9 15.1V9.2l5.4 3z"/></svg>',
  cafe: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 9h13v4a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6zm13 1h1.5a2.5 2.5 0 0 1 0 5H17v-1.6h1.5a.9.9 0 0 0 0-1.8H17zM8 3.5c1 1-1 2 0 3.5M11.5 3c1 1.2-1 2.2 0 3.8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
};


/* ───────── 로고 (생성 엠블럼 + 텍스트) ───────── */
function logoHTML(size = '') {
  if (brand.logoImg) return `<div class="logo-mark logo-mark--img ${size}"><img class="logo-img" src="${brand.logoImg}" alt="${brand.name}" /></div>`;
  return `<div class="logo-mark ${size}">
    <img class="logo-emblem" src="${logoEmblem}" alt="" onerror="this.onerror=null;this.src='${dummyOf(logoEmblem)}'" />
    <span class="logo-text"><b>${brand.name.split(' ')[0]}</b><b>${brand.name.split(' ').slice(1).join(' ')}</b></span>
  </div>`;
}

/* ───────── 공통 ───────── */
document.querySelectorAll('[data-brand-eyebrow]').forEach((e) => (e.textContent = brand.eyebrow));
// 모든 섹션 타이틀 위에 게임 이름 (단어별 색)
document.querySelectorAll('.sec-head').forEach((head) => {
  const p = h('p', 'sec-game');
  p.setAttribute('aria-hidden', 'true');
  p.innerHTML = gameName.map((w) => `<span style="color:${w.color}">${w.text}</span>`).join(' ');
  head.prepend(p);
});
document.title = brand.name;

/* ───────── 메뉴 ───────── */
const burger = $('#burger');
const menuEl = $('#menu');
$('#menuLogo').replaceWith(Object.assign(h('div', 'menu-logo', logoHTML('logo-mark--sm'))));
const ext = (href) => (/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : '');
$('#menuList').innerHTML = menu.map((m) => `<li><a href="${m.href}"${ext(m.href)}>${m.label}</a></li>`).join('');
$('#menuSocial').innerHTML = socials.map((s) => `<a href="${s.href}"${ext(s.href)} aria-label="${s.label}">${ICON[s.id]}</a>`).join('');
function setMenu(open) {
  document.documentElement.classList.toggle('menu-open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  menuEl.setAttribute('aria-hidden', !open);
}
burger.addEventListener('click', () => setMenu(!document.documentElement.classList.contains('menu-open')));
menuEl.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  e.preventDefault();
  setMenu(false);
  const target = a.getAttribute('href').length > 1 && $(a.getAttribute('href'));
  if (target) target.scrollIntoView({ behavior: 'smooth' });
});
addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  setMenu(false);
  closeModal();
});

/* ───────── 상단 네비게이션 ───────── */
{
  $('#gnbLogo').src = nav.logo;
  $('#gnbLogo').alt = brand.name;
  const inner = menu.filter((m) => m.href.startsWith('#'));
  $('#gnbMenu').innerHTML = inner.map((m) => `<a href="${m.href}">${m.label}</a>`).join('');

  // 지금 보고 있는 섹션의 메뉴 강조
  const links = [...$('#gnbMenu').children];
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${en.target.id}`));
    }),
    { rootMargin: '-45% 0px -50% 0px' },
  );
  inner.forEach((m) => { const sec = $(m.href); if (sec) io.observe(sec); });
}

/* ───────── HERO ───────── */
const heroBg = $('#heroBg');
heroBackgrounds.forEach((src, i) => {
  const layer = h('div', `hero-layer${i === 0 ? ' is-on' : ''}`);
  layer.style.backgroundImage = `url("${src}"), url("${dummyOf(src)}")`;
  heroBg.append(layer);
});
// 원본처럼 배경 영상 루프. 영상이 없거나 재생 실패 시 장면 크로스페이드 + 켄번스
if (heroVideo) {
  const v = Object.assign(h('video', 'hero-video'), { src: heroVideo, muted: true, loop: true, autoplay: true, playsInline: true, preload: 'auto' });
  v.setAttribute('muted', '');
  v.addEventListener('playing', () => heroBg.classList.add('has-video'));
  // 엔딩('PLAY NOW') 전 구간만 반복: 매 프레임 확인해 heroVideoEnd 직전에 처음으로
  if (heroVideoEnd) {
    const watch = () => {
      if (v.currentTime >= heroVideoEnd - 0.05) v.currentTime = 0;
      requestAnimationFrame(watch);
    };
    requestAnimationFrame(watch);
  }
  heroBg.append(v);
  v.play().catch(() => {});
}
{
  const layers = heroBg.children;
  let cur = 0;
  setInterval(() => {
    if (layers.length < 2) return;
    layers[cur].classList.remove('is-on');
    cur = (cur + 1) % layers.length;
    layers[cur].classList.add('is-on');
  }, 7000);
}
$('#heroLogo').innerHTML = logoHTML();
$('#stores').innerHTML = stores
  .map((s) =>
    s.id === 'web'
      ? `<a class="store store--plain" href="${s.href}"><i>${ICON.web}</i><span><small>${s.top}</small><b>${s.bottom}</b></span></a>`
      : `<a class="store" href="${s.href}"${ext(s.href)}><i>${ICON[s.id]}</i><span><b>${s.top}</b><small>${s.bottom}</small></span></a>`,
  )
  .join('');
$('#heroPlayImg').src = ui.playButton;
$('#heroPlay').addEventListener('click', () => openVideo(brand.heroPlay));
$('#carFrameImg').src = ui.framePink;

/* ───────── 게임소개 캐러셀 ───────── */
{
  const tabs = $('#featureTabs');
  const stage = $('#carStage');
  const dots = $('#carDots');
  let idx = 0;
  let timer;

  features.forEach((f, i) => {
    const tab = h('button', 'tab', `<span>${f.tab}</span>`);
    tab.setAttribute('role', 'tab');
    tab.addEventListener('click', () => go(i, true));
    tabs.append(tab);

    const slide = h('div', 'slide');
    slide.append(lazyImg(f.img, 'slide-img', f.title));
    slide.append(h('div', 'slide-cap', `<p class="slide-sub">${f.sub}</p><h3 class="slide-title" data-text="${f.headline || f.title}">${f.headline || f.title}</h3>`)); // 큰 글자 = headline, 작은 설명 삭제
    stage.append(slide);

    const dot = h('button', 'dot');
    dot.setAttribute('aria-label', `${i + 1}번 슬라이드`);
    dot.addEventListener('click', () => go(i, true));
    dots.append(dot);
  });

  function go(i, user) {
    idx = (i + features.length) % features.length;
    [...stage.children].forEach((s, k) => {
      s.classList.toggle('is-active', k === idx);
      if (Math.abs(k - idx) <= 1) loadLazy(s.firstChild); // 다음 슬라이드 미리 로드
    });
    [...tabs.children].forEach((t, k) => t.classList.toggle('is-active', k === idx));
    [...dots.children].forEach((d, k) => d.classList.toggle('is-active', k === idx));
    if (user) restart();
  }
  function restart() {
    clearInterval(timer);
    timer = setInterval(() => go(idx + 1), 5000);
  }
  $('.car-arrow--prev').addEventListener('click', () => go(idx - 1, true));
  $('.car-arrow--next').addEventListener('click', () => go(idx + 1, true));

  // 스와이프
  let sx = null;
  stage.addEventListener('pointerdown', (e) => (sx = e.clientX));
  stage.addEventListener('pointerup', (e) => {
    if (sx == null) return;
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1), true);
    sx = null;
  });

  go(0);
  restart();
}

/* ───────── 히어로 (Spine) ───────── */
$('#heroesTitle').textContent = heroes.title;
heroesSection({ root: $('#heroesRoot'), opts: heroes });

/* ───────── 몬스터 (Spine) ───────── */
$('#monstersTitle').textContent = monsters.title;
monstersSection({ root: $('#monstersRoot'), opts: monsters });

/* ───────── 세계관 ───────── */
{
  if (story.bg) $('#storyBg').style.backgroundImage = `url("${story.bg}"), url("${dummyOf(story.bg)}")`;
  $('#storyTitle').textContent = story.title;
  $('#storyText').innerHTML = story.paragraphs.map((p) => `<p>${p.join('<br>')}</p>`).join('');
}

/* ───────── 미디어 ───────── */
{
  const grid = $('#mediaGrid');
  let shown = 0;
  function render(n) {
    media.slice(shown, n).forEach((m, k) => {
      const li = h('li', 'media-item');
      const btn = h('button', 'media-thumb');
      btn.setAttribute('aria-label', `${m.title} 재생`);
      btn.append(lazyImg(m.img, 'media-img', ''));
      // 재생 아이콘: 흰색 둥근 삼각형 (프레임 없음)
      btn.append(h('span', 'media-play', '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#fff" d="M12 6.5c0-2.3 2.5-3.7 4.5-2.5l26 16.6c1.8 1.2 1.8 3.8 0 5L16.5 42.2C14.5 43.4 12 42 12 39.7z"/></svg>'));
      btn.addEventListener('click', () => openVideo(m.video));
      li.append(btn, h('p', 'media-title', m.title));
      grid.append(li);
    });
    shown = Math.min(n, media.length);
  }
  render(mediaInitial);
}

/* ───────── 하단 영역: 잭잭 커서 + 스티커 트레일 ───────── */
stickerTrail({ box: $('.footer'), opts: cta });

/* ───────── 푸터 ───────── */
Object.assign($('#footerTitle'), { src: footer.title, alt: brand.name });
// 링크는 아직 준비 전 → 비활성 버튼 (주소가 생기면 <a href> 로 바꾸세요)
$('#footerLinks').innerHTML = footer.links.map((l) => `<button type="button" disabled>${l}</button>`).join('');
$('#footerLines').innerHTML = footer.lines.map((l) => `<p>${l}</p>`).join('');
$('#footerBrand').innerHTML = `<img src="${footer.logo}" alt="${brand.studio}" />`;

/* ───────── 영상 모달 ───────── */
const modal = $('#modal');
// id: '영상ID' | '영상ID|재생목록ID' | 'list:재생목록ID'
function ytEmbed(id) {
  if (id.startsWith('list:')) return `videoseries?list=${id.slice(5)}&`;
  const [vid, list] = id.split('|');
  return list ? `${vid}?list=${list}&` : `${vid}?`;
}
function openVideo(id) {
  $('#modalBody').innerHTML = id
    ? `<iframe src="https://www.youtube.com/embed/${ytEmbed(id)}autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
    : `<div class="modal-empty">${logoHTML('logo-mark--sm')}<p>영상이 곧 공개됩니다!</p></div>`;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal() {
  if (!modal.classList.contains('is-open')) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  setTimeout(() => ($('#modalBody').innerHTML = ''), 250);
}
$('#modalClose').addEventListener('click', closeModal);
$('#modalFrame').src = ui.monitor;
modal.addEventListener('click', (e) => e.target === modal && closeModal());
