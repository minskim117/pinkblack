// ─────────────────────────────────────────────────────────────
//  MONSTERS 섹션: 왼쪽 Spine 몬스터 + 오른쪽 아이콘 선택줄 · 이름 · 대사 · 설명
//  몬스터를 바꾸면 그림은 왼쪽에서(-16px), 글은 오른쪽에서(12px) 340ms 페이드 인
// ─────────────────────────────────────────────────────────────
import { loadSpineRuntime, waitForAssets, measure, pickAnimation } from './spine-runtime.js';

export function monstersSection({ root, opts }) {
  const list = opts.list;
  const portrait = root.querySelector('.mon-portrait');
  const canvas = root.querySelector('.mon-canvas');
  const copy = root.querySelector('.mon-copy');
  const icons = root.querySelector('.mon-icons');
  const nameEl = root.querySelector('.mon-name');
  const quoteEl = root.querySelector('.mon-quote');
  const descEl = root.querySelector('.mon-desc');

  let current = 0;
  let stage = null;
  let visible = false;
  let running = false;

  /* ── 아이콘 선택줄 ── */
  list.forEach((m, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'mon-icon';
    b.setAttribute('aria-label', m.name);
    const [fx, fy, zoom] = m.face || [50, 50, 1];
    b.innerHTML = `<img src="${m.icon}" alt="" loading="lazy" style="width:${zoom * 100}%;transform:translate(-${fx}%,-${fy}%)" />`;
    b.addEventListener('click', () => select(i));
    icons.append(b);
  });

  const replay = (el, cls) => {
    el.classList.remove(cls);
    void el.offsetWidth; // 애니메이션 재시작
    el.classList.add(cls);
  };

  function select(i, first) {
    current = i;
    const m = list[i];
    [...icons.children].forEach((b, k) => {
      b.classList.toggle('is-active', k === i);
      b.setAttribute('aria-pressed', k === i);
    });
    nameEl.textContent = m.name;
    quoteEl.textContent = m.quote;
    descEl.textContent = m.desc;
    if (!first) {
      replay(portrait, 'is-in');
      replay(copy, 'is-in');
    }
    const a = stage?.actors[i];
    if (a) a.state.setAnimation(0, a.anim, true); // 처음부터 다시 재생
  }

  /* ── Spine ── */
  const setup = async () => {
    const spine = await loadSpineRuntime();
    const ctx = new spine.webgl.ManagedWebGLRenderingContext(canvas, { alpha: true, premultipliedAlpha: true });
    const renderer = new spine.webgl.SceneRenderer(canvas, ctx);
    const assets = new spine.webgl.AssetManager(ctx, opts.base);
    list.forEach((m) => {
      assets.loadBinary(`${m.spine}.skel.bytes`);
      assets.loadTextureAtlas(`${m.spine}.atlas.txt`);
    });
    await waitForAssets(assets);

    const actors = list.map((m) => {
      const atlas = assets.get(`${m.spine}.atlas.txt`);
      const data = new spine.SkeletonBinary(new spine.AtlasAttachmentLoader(atlas)).readSkeletonData(assets.get(`${m.spine}.skel.bytes`));
      const skeleton = new spine.Skeleton(data);
      if (m.skin) skeleton.setSkinByName(m.skin);
      skeleton.setSlotsToSetupPose();
      const anim = pickAnimation(data, opts.animation, m.spine);
      const state = new spine.AnimationState(new spine.AnimationStateData(data));
      const box = measure(spine, skeleton, state, anim, data.findAnimation(anim).duration, m.measureIgnore);
      state.setAnimation(0, anim, true);
      return { skeleton, state, box, anim };
    });

    stage = { renderer, actors };
    if (import.meta.env.DEV) window.__monsters = stage;
    resize();
    addEventListener('resize', resize);
    start();
  };

  const dpr = () => Math.min(2, devicePixelRatio || 1);
  const resize = () => {
    if (!stage) return;
    const r = portrait.getBoundingClientRect();
    canvas.width = Math.round(r.width * dpr());
    canvas.height = Math.round(r.height * dpr());
    const cam = stage.renderer.camera;
    cam.setViewport(r.width, r.height);
    cam.position.x = r.width / 2;
    cam.position.y = r.height / 2;
  };

  let last = 0;
  const frame = (t) => {
    if (!stage || !visible) { running = false; last = 0; return; }
    const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
    last = t;
    const { renderer } = stage;
    const a = stage.actors[current];
    const W = canvas.width / dpr();
    const H = canvas.height / dpr();
    const gl = renderer.context.gl;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    renderer.camera.update();
    renderer.begin();
    // 칸 안에 꽉 차게(contain), 오른쪽(글 쪽)을 바라보도록
    const k = Math.min((W * opts.fit) / a.box.w, (H * opts.fit) / a.box.h);
    const flip = opts.facing === 'left' ? -1 : 1;
    a.skeleton.scaleX = k * flip;
    a.skeleton.scaleY = k;
    a.skeleton.x = W / 2 - (a.box.x + a.box.w / 2) * k * flip;
    a.skeleton.y = H / 2 - (a.box.y + a.box.h / 2) * k;
    a.state.update(dt);
    a.state.apply(a.skeleton);
    a.skeleton.updateWorldTransform();
    renderer.drawSkeleton(a.skeleton, true);
    renderer.end();
    requestAnimationFrame(frame);
  };
  const start = () => { if (!running && visible && stage) { running = true; requestAnimationFrame(frame); } };

  let loading = false;
  new IntersectionObserver(
    ([en]) => {
      visible = en.isIntersecting;
      if (visible && !loading) {
        loading = true;
        setup().catch((e) => console.warn('[monsters] Spine 로딩 실패', e));
      }
      start();
    },
    { rootMargin: '300px 0px' },
  ).observe(portrait);

  // 좌우 화살표: 처음/마지막에서 반대쪽 끝으로 이어짐
  root.querySelector('.mon-arrow--prev')?.addEventListener('click', () => select((current - 1 + list.length) % list.length));
  root.querySelector('.mon-arrow--next')?.addEventListener('click', () => select((current + 1) % list.length));

  select(0, true);
}
