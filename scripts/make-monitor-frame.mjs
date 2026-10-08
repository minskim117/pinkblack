// 영상 모달 프레임: contents_monitor.png (690×374) 를 영상 위에 얹을 수 있게 가공
// 1) 화면 영역의 단색(핑크 #ffb0f4 / 그레이 #6c6c74)을 투명하게 뚫음 (화면 안쪽에서 flood-fill)
// 2) 모서리·가운데 장식이 없는 '단색 테두리' 열만 잘라내 화면 비율을 16:9 로 (장식 변형 없음)
// 결과: public/cocobi/monitor_frame.png  + 화면 위치(%)를 콘솔에 출력
// 사용법: node scripts/make-monitor-frame.mjs   (API 호출 없음)
import fs from 'node:fs';
import { PNG } from 'pngjs';

const DIR = 'public/cocobi';
const src = PNG.sync.read(fs.readFileSync(`${DIR}/contents_monitor.png`));
const { width: W, height: H, data } = src;
const at = (x, y) => (y * W + x) * 4;

/* ── 1) 화면 영역 측정 + 투명 처리 ── */
const SCREEN = [[255, 176, 244], [108, 108, 116]];
const isScreen = (i) => SCREEN.some(([r, g, b]) => Math.abs(data[i] - r) + Math.abs(data[i + 1] - g) + Math.abs(data[i + 2] - b) < 40) && data[i + 3] > 200;
const seen = new Uint8Array(W * H);
const stack = [[Math.round(W * 0.25), H >> 1], [Math.round(W * 0.75), H >> 1]];
let x0 = W, x1 = 0, y0 = H, y1 = 0;
while (stack.length) {
  const [x, y] = stack.pop();
  if (x < 0 || y < 0 || x >= W || y >= H) continue;
  const p = y * W + x;
  if (seen[p]) continue;
  seen[p] = 1;
  if (!isScreen(p * 4)) continue;
  data[p * 4 + 3] = 0;
  x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
  stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}
// 경계의 안티앨리어싱 픽셀(화면색과 테두리색 사이)은 반투명으로
for (let y = y0 - 2; y <= y1 + 2; y++) for (let x = x0 - 2; x <= x1 + 2; x++) {
  const i = at(x, y);
  if (data[i + 3] === 0) continue;
  const near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => data[at(x + dx, y + dy) + 3] === 0);
  if (near && SCREEN.some(([r, g, b]) => Math.abs(data[i] - r) + Math.abs(data[i + 1] - g) + Math.abs(data[i + 2] - b) < 90)) data[i + 3] = 90;
}

/* ── 2) 가로로 잘라낼 열 고르기 ── */
const screenW = x1 - x0 + 1, screenH = y1 - y0 + 1;
const cut = Math.round(screenW - (screenH * 16) / 9); // 잘라낼 총 폭
// '단색 테두리' 열: 바로 옆 열과 (화면 위·아래 테두리 행 전부) 픽셀이 같은 열
const same = (xa, xb) => {
  for (let y = 0; y < H; y++) {
    if (y >= y0 && y <= y1) continue;
    const a = at(xa, y), b = at(xb, y);
    for (let c = 0; c < 4; c++) if (Math.abs(data[a + c] - data[b + c]) > 6) return false;
  }
  return true;
};
const runs = [];
let start = null;
for (let x = x0 + 1; x < x1; x++) {
  const ok = same(x, x - 1);
  if (ok && start === null) start = x;
  if (!ok && start !== null) { runs.push([start, x]); start = null; }
}
if (start !== null) runs.push([start, x1]);
// 왼쪽 절반·오른쪽 절반에서 가장 긴 구간에서 절반씩 잘라냄 (좌우 대칭 유지)
const mid = W / 2;
const longest = (side) => runs.filter(([a, b]) => (side < 0 ? b <= mid : a >= mid)).sort((p, q) => q[1] - q[0] - (p[1] - p[0]))[0];
const L = longest(-1), R = longest(1);
const cutL = Math.floor(cut / 2), cutR = cut - cutL;
if (!L || !R || L[1] - L[0] < cutL || R[1] - R[0] < cutR) throw new Error(`잘라낼 단색 구간이 부족해요: ${JSON.stringify({ cut, L, R })}`);
const dropL = [L[0] + ((L[1] - L[0] - cutL) >> 1)];
dropL.push(dropL[0] + cutL);
const dropR = [R[0] + ((R[1] - R[0] - cutR) >> 1)];
dropR.push(dropR[0] + cutR);
const keep = [];
for (let x = 0; x < W; x++) if (!(x >= dropL[0] && x < dropL[1]) && !(x >= dropR[0] && x < dropR[1])) keep.push(x);

const NW = keep.length;
const out = new PNG({ width: NW, height: H });
keep.forEach((sx, dx) => {
  for (let y = 0; y < H; y++) {
    const s = at(sx, y), d = (y * NW + dx) * 4;
    for (let c = 0; c < 4; c++) out.data[d + c] = data[s + c];
  }
});
fs.writeFileSync(`${DIR}/monitor_frame.png`, PNG.sync.write(out));

const nx0 = keep.indexOf(x0), nx1 = keep.indexOf(x1);
const pct = (v, t) => +((v / t) * 100).toFixed(2);
console.log(`✓ monitor_frame.png ${NW}×${H}  (잘라낸 열: ${dropL.join('~')}, ${dropR.join('~')})`);
console.log('화면 영역 %:', { left: pct(nx0, NW), right: pct(NW - 1 - nx1, NW), top: pct(y0, H), bottom: pct(H - 1 - y1, H), ratio: ((nx1 - nx0 + 1) / screenH).toFixed(3) });
