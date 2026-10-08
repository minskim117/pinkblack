// 공식 spine-ts 3.8 WebGL 런타임을 한 번만 불러옴 (에디터 버전 3.8.79 와 맞춤)
const RUNTIME = 'vendor/spine-webgl-3.8.js';
let promise = null;

export function loadSpineRuntime() {
  if (window.spine) return Promise.resolve(window.spine);
  promise ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = RUNTIME;
    s.onload = () => resolve(window.spine);
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return promise;
}

// AssetManager 로딩 완료까지 대기
export function waitForAssets(assets) {
  return new Promise((resolve, reject) => {
    const check = () => {
      if (assets.hasErrors()) return reject(assets.getErrors());
      if (assets.isLoadingComplete()) return resolve();
      requestAnimationFrame(check);
    };
    check();
  });
}

// 이름이 정확히 없으면 '…/이름' 으로 끝나는 애니메이션 (예: 'vs' → 'common/vs'), 그래도 없으면 첫 번째
export function pickAnimation(data, want, label = '') {
  const names = data.animations.map((a) => a.name);
  const found = names.find((n) => n === want) || names.find((n) => n.endsWith('/' + want));
  if (!found) console.warn(`[spine] ${label}: '${want}' 없음 → '${names[0]}' 재생. 목록:`, names);
  return found || names[0];
}

// 애니메이션 한 바퀴 동안의 최대 외곽 박스
export function measure(spine, skeleton, state, anim, duration, ignore = []) {
  state.setAnimation(0, anim, true);
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const skip = new Set(ignore);
  let verts = new Float32Array(8);
  const steps = 12;
  for (let s = 0; s <= steps; s++) {
    state.update(s === 0 ? 0 : duration / steps);
    state.apply(skeleton);
    skeleton.x = 0; skeleton.y = 0; skeleton.scaleX = 1; skeleton.scaleY = 1;
    skeleton.updateWorldTransform();
    for (const slot of skeleton.drawOrder) {
      const at = slot.getAttachment();
      if (!at || skip.has(slot.data.name) || slot.color.a === 0) continue;
      let n = 0;
      if (at instanceof spine.RegionAttachment) {
        at.computeWorldVertices(slot.bone, verts, 0, 2); n = 8;
      } else if (at instanceof spine.MeshAttachment) {
        n = at.worldVerticesLength;
        if (verts.length < n) verts = new Float32Array(n);
        at.computeWorldVertices(slot, 0, n, verts, 0, 2);
      } else continue;
      for (let i = 0; i < n; i += 2) {
        minX = Math.min(minX, verts[i]); maxX = Math.max(maxX, verts[i]);
        minY = Math.min(minY, verts[i + 1]); maxY = Math.max(maxY, verts[i + 1]);
      }
    }
  }
  skeleton.setToSetupPose();
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}
