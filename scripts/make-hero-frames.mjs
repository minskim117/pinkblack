// HEROES 카드 프레임: 원본 popup_front_{pink,black}.png (928×539) 를 9-슬라이스 방식으로 세로 카드로 재구성
// - 네 모서리 장식 · 상단 리본은 원본 픽셀 그대로
// - 테두리 스트라이프만 무늬 주기(44px)의 배수로 잘라내거나(가로) 반복(세로) → 이음새 없음
// - 가운데는 투명 그대로 (안쪽 배경은 CSS)
// 사용법: node scripts/make-hero-frames.mjs   (API 호출 없음)
import fs from 'node:fs';
import { PNG } from 'pngjs';

const DIR = 'public/cocobi';
const PERIOD = 44;            // 핑크 스트라이프 주기 (블랙은 단색이라 무관)
const CUT_X = PERIOD * 10;    // 가로에서 잘라낼 폭  → 928 - 440 = 488
const ADD_Y = PERIOD * 4;     // 세로로 늘릴 높이    → 539 + 176 = 715
const SEAM_Y = 300;           // 세로 이음 위치 (모서리 장식이 없는 옆 테두리 구간)
const BOW = { x0: 396, x1: 532, y1: 70 }; // 상단 리본 영역 (원본 기준)

for (const color of ['pink', 'black']) {
  const src = PNG.sync.read(fs.readFileSync(`${DIR}/popup_front_${color}.png`));
  const W = src.width - CUT_X;
  const H = src.height + ADD_Y;
  const half = W / 2;
  const out = new PNG({ width: W, height: H });

  const copy = (sx, sy, dx, dy) => {
    const si = (sy * src.width + sx) * 4, di = (dy * W + dx) * 4;
    for (let c = 0; c < 4; c++) out.data[di + c] = src.data[si + c];
  };

  for (let y = 0; y < H; y++) {
    const sy = y < SEAM_Y ? y : y - ADD_Y;               // 세로: 위는 그대로, 아래는 ADD_Y 만큼 당겨서 옆 테두리 반복
    for (let x = 0; x < W; x++) {
      const sx = x < half ? x : x + CUT_X;               // 가로: 왼쪽 절반 + 오른쪽 절반 (가운데 잘라냄)
      copy(sx, sy, x, y);
    }
  }
  // 리본을 새 가운데에 다시 붙임 (이동량 CUT_X/2 = 220 은 주기의 배수라 주변 무늬와 이어짐)
  const shift = CUT_X / 2;
  for (let y = 0; y < BOW.y1; y++) for (let sx = BOW.x0; sx < BOW.x1; sx++) copy(sx, y, sx - shift, y);

  fs.writeFileSync(`${DIR}/hero-frame-${color}.png`, PNG.sync.write(out));
  console.log(`✓ hero-frame-${color}.png ${W}×${H}`);
}
