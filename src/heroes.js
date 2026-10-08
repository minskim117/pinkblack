// ─────────────────────────────────────────────────────────────
//  HEROES 섹션: 캐릭터마다 카드(프레임 이미지) + 아래 이름 · 설명, 카드 위에 Spine 캐릭터
//  캔버스 하나가 카드들 전체를 덮고(조금 더 넓게), 각 카드 위치에 캐릭터를 그림
//  Spine 데이터: 3.8.79 (Unity export: .skel.bytes / .atlas.txt, premultiplied alpha)
// ─────────────────────────────────────────────────────────────
import { loadSpineRuntime, waitForAssets, measure, pickAnimation } from './spine-runtime.js';

export function heroesSection({ root, opts }) {
  const list = opts.list;
  const canvas = root.querySelector('.hero-canvas');

  // 카드 + 이름 · 설명 마크업
  const cards = list.map((h) => {
    const item = document.createElement('article');
    item.className = `hero-item hero-item--${h.tone || 'pink'}`;
    item.innerHTML = `
      <div class="hero-visual">
        <div class="hero-card"><div class="hero-card-fill hero-card-fill--${h.tone || 'pink'}"></div><div class="hero-card-glow"></div><img class="hero-card-bg" src="${h.card}" alt="" /></div>
        <div class="hero-sparkles" aria-hidden="true"><i></i><i></i><i></i></div>
      </div>
      <div class="hero-info"><h3 class="hero-name"></h3><p class="hero-desc"></p></div>`;
    item.querySelector('.hero-name').textContent = h.name;
    item.querySelector('.hero-desc').textContent = h.desc;
    root.append(item);
    return item.querySelector('.hero-card');
  });

  let stage = null;
  let visible = false;
  let running = false;

  const setup = async () => {
    const spine = await loadSpineRuntime();
    const ctx = new spine.webgl.ManagedWebGLRenderingContext(canvas, { alpha: true, premultipliedAlpha: true });
    const renderer = new spine.webgl.SceneRenderer(canvas, ctx);
    const assets = new spine.webgl.AssetManager(ctx, opts.base);
    list.forEach((h) => {
      assets.loadBinary(`${h.spine}.skel.bytes`);
      assets.loadTextureAtlas(`${h.spine}.atlas.txt`);
    });
    await waitForAssets(assets);

    const actors = list.map((h) => {
      const atlas = assets.get(`${h.spine}.atlas.txt`);
      const data = new spine.SkeletonBinary(new spine.AtlasAttachmentLoader(atlas)).readSkeletonData(assets.get(`${h.spine}.skel.bytes`));
      const skeleton = new spine.Skeleton(data);
      if (h.skin) skeleton.setSkinByName(h.skin);
      skeleton.setSlotsToSetupPose();
      const anim = pickAnimation(data, h.animation || opts.animation, h.spine);
      const state = new spine.AnimationState(new spine.AnimationStateData(data));
      const box = measure(spine, skeleton, state, anim, data.findAnimation(anim).duration);
      state.setAnimation(0, anim, true);
      return { skeleton, state, box, anim };
    });

    stage = { renderer, actors };
    if (import.meta.env.DEV) window.__heroes = stage;
    resize();
    addEventListener('resize', resize);
    start();
  };

  const dpr = () => Math.min(2, devicePixelRatio || 1);
  const resize = () => {
    if (!stage) return;
    const r = canvas.getBoundingClientRect();
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
    const { renderer, actors } = stage;
    const gl = renderer.context.gl;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    renderer.camera.update();
    renderer.begin();
    const cr = canvas.getBoundingClientRect();
    // 모든 캐릭터에 같은 배율: 각자 카드에 맞는 배율 중 가장 작은 값
    const k = Math.min(
      ...actors.map((a, i) => {
        const kr = cards[i].getBoundingClientRect();
        return Math.min((kr.width * opts.fitW) / a.box.w, (kr.height * opts.fitH) / a.box.h);
      }),
    );
    actors.forEach((a, i) => {
      const h = list[i];
      const kr = cards[i].getBoundingClientRect();
      const s = k * (h.scale || 1);
      const flip = h.flip ? -1 : 1;
      const cx = kr.left - cr.left + kr.width / 2 + kr.width * (opts.offsetX || 0);
      const cy = cr.bottom - (kr.top + kr.height / 2) + kr.height * (opts.offsetY || 0);
      a.skeleton.scaleX = s * flip;
      a.skeleton.scaleY = s;
      a.skeleton.x = cx - (a.box.x + a.box.w / 2) * s * flip;
      a.skeleton.y = cy - (a.box.y + a.box.h / 2) * s;
      a.state.update(dt);
      a.state.apply(a.skeleton);
      a.skeleton.updateWorldTransform();
      renderer.drawSkeleton(a.skeleton, true);
    });
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
        setup().catch((e) => console.warn('[heroes] Spine 로딩 실패', e));
      }
      start();
    },
    { rootMargin: '300px 0px' },
  ).observe(root);
}
