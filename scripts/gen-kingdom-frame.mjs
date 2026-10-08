// HEROES 카드 프레임: popup_front_{pink|black}.png 를 참고 이미지로 넣어 같은 스타일의 세로 카드 생성
// 원본 → assets-src/hero-card-{색}.png, 웹용 → public/cocobi/hero-card-{색}.png
// 사용법: node scripts/gen-kingdom-frame.mjs pink   |   node scripts/gen-kingdom-frame.mjs black
import 'dotenv/config';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2.5-sunburst';
if (!KEY) { console.error('✗ .env 의 OPENAI_API_KEY 가 비어 있어요.'); process.exit(1); }

const COLOR = process.argv[2] === 'black' ? 'black' : 'pink';
const REF = `public/cocobi/popup_front_${COLOR}.png`;
const OUT = `assets-src/hero-card-${COLOR}.png`;
const WEB = `public/cocobi/hero-card-${COLOR}.png`;

const STYLE = {
  pink: [
    'thick border of hot pink and light pink diagonal candy stripes,',
    'clean white outline around the border, a glossy pink heart-shaped ribbon bow at the top center, small white pearl beads and swirls on the four corners, rounded corners.',
    'Fill the inside of the card with a soft pastel pink background with a subtle lighter pink pattern of tiny hearts and polka dots, and a soft white glow in the center.',
  ],
  black: [
    'thick border of charcoal black and dark gray diagonal stripes,',
    'clean white outline around the border, a glossy black heart-shaped ribbon bow with silver highlights at the top center, small black and silver pearl beads and swirls on the four corners, rounded corners.',
    'Fill the inside of the card with a deep charcoal gray background with a subtle slightly lighter gray pattern of tiny hearts and polka dots, and a soft silvery glow in the center.',
  ],
}[COLOR];

const prompt = [
  'Use the attached image only as a style reference for a UI frame.',
  'Create a NEW tall vertical portrait card (2:3) in exactly the same style:',
  ...STYLE,
  'Flat 2D mobile game UI art, front view, symmetric, the card fills the whole image edge to edge, no characters, no text, no letters, no logos.',
].join(' ');

const form = new FormData();
form.append('model', MODEL);
form.append('prompt', prompt);
form.append('size', '1024x1536');
form.append('quality', 'high');
form.append('n', '1');
form.append('image', new Blob([await fs.readFile(REF)], { type: 'image/png' }), `popup_front_${COLOR}.png`);

for (let attempt = 1; attempt <= 4; attempt++) {
  const r = await fetch('https://api.openai.com/v1/images/edits', { method: 'POST', headers: { Authorization: `Bearer ${KEY}` }, body: form });
  if (r.ok) {
    const b64 = (await r.json()).data?.[0]?.b64_json;
    if (!b64) throw new Error('응답에 이미지가 없어요');
    await fs.mkdir('assets-src', { recursive: true });
    await fs.writeFile(OUT, Buffer.from(b64, 'base64'));
    execFileSync('sips', ['-Z', '900', OUT, '--out', WEB], { stdio: 'ignore' });
    console.log(`✓ ${WEB}`);
    process.exit(0);
  }
  const msg = await r.text();
  if (r.status >= 500 || r.status === 429) {
    console.warn(`… 재시도 ${attempt}/4 (${r.status})`);
    await new Promise((s) => setTimeout(s, 6000 * attempt));
    continue;
  }
  console.error(`✗ 실패 ${r.status}: ${msg}`);
  process.exit(1);
}
