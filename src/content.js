// ─────────────────────────────────────────────────────────────
//  코코비 핑크 블랙 히어로 — 소개 페이지 콘텐츠
//  문구/링크/이미지는 모두 여기서 바꾸면 페이지 전체가 갱신돼요.
// ─────────────────────────────────────────────────────────────
const BASE = import.meta.env.BASE_URL;
// 생성 이미지(public/assets). 파일이 없으면 같은 이름의 더미(public/dummy/*.svg)가 대신 보입니다.
const A = (f) => `${BASE}assets/${f}`;
// 코코비 공식 애셋 (bomb/public/assets 에서 복사)
const C = (f) => `${BASE}cocobi/${f}`;
export const dummyOf = (src) => src.replace('/assets/', '/dummy/').replace(/\.(jpg|png)$/, '.svg');

// Google Play 스토어 등록 이미지 (=w..-h.. 로 크기 조절)
const PLAY = 'https://play-lh.googleusercontent.com/';
const shots = {
  house: 'IthykcvmWLsBk9cg__7mlWP6XAP_dt_D8w46mmvytHTsBS5xgtGEKzYifFZqZgHWWkbAh8Ty2W0Hz6ZLqEnE',
  forest: 'sEA7qrDfzymrrygRnT5a9DfusB9MxSzwGy2ZSAziIWTuvdVIqx-pTsCry3pp-l74RhhqbTYK8mt_TKDGXbLp',
  ocean: 'O01n8eeDPDZ8fBEHlP3eV3ptDRCMt7iOHa6FtTzt2qY_q8b5b-rCpLpZYC4srFDzJaJrYiYARpHdhTrWDM_DokY',
  firetruck: 'MqShtZt6EilF_noxVntg7SiXzPHHM6DCkf-nGpWbXedqLWxBd3BjJLVb2Bej4twJnIzlmaOxN97_O8MGfZOmEAc',
  candy: '54HtPS2ZtIwlZntm6tYpa4mqlvYUPn52-FolLwVlbYRzsRxZglKq017vJgbDgC3kPgelaiWDgQG-w4EHhlhXQg',
};
const shot = (k, w = 1280) => `${PLAY}${shots[k]}=w${w}-h${Math.round((w * 9) / 16)}-rw`;
const ytThumb = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

export const links = {
  store: 'https://play.google.com/store/apps/details?id=com.kigle.cocobi.pinkblackhero&hl=ko',
  anime: 'https://www.youtube.com/watch?v=eb6z71CS4C0&list=PLlrAsn3FlPaqh17O_xHEMqEUjRidcYPqu',
};

export const brand = {
  name: '코코비 핑크 블랙 히어로',
  eyebrow: 'COCOBI: PINK BLACK HERO',
  logoImg: C('title_kr.png'), // 로고 이미지 (비우면 엠블럼 + 이름 텍스트)
  studio: 'KIGLE',
  studioSub: '꼬마공룡 코코비',
 
  badgeIcon: 'youtube',
  badgeHref: links.anime,
  // 히어로 재생 버튼 → 코코비 핑크 블랙 애니메이션 ('영상ID|재생목록ID' 이면 재생목록으로 이어서 재생)
  heroPlay: 'eb6z71CS4C0|PLlrAsn3FlPaqh17O_xHEMqEUjRidcYPqu',
};

// 원본 사이트처럼 배경 영상(불투명도 0.5). 비우면 아래 이미지들이 크로스페이드
export const heroVideo = C('cocobi_60sec_web.mp4');
export const heroVideoEnd = 43; // 이 시점(초)에서 처음으로 되돌려 반복 ('PLAY NOW' 엔딩 전까지만)

// 코코비 UI 애셋 (프레임/버튼)
export const ui = {
  playButton: C('home_button.png'),
  framePink: C('popup_front_pink.png'),
  frameBlack: C('popup_front_black.png'),
  monitor: C('monitor_frame.png'), // 영상 모달 프레임 (contents_monitor 화면을 뚫고 16:9 로 줄인 것, scripts/make-monitor-frame.mjs)
};
export const heroBackgrounds = [C('pinkblackvsmonsters.jpg'), shot('candy', 1600)];
export const logoEmblem = A('logo-emblem.png');

// App Store 는 아직 출시 전 → 임시로 Google Play 링크. 출시되면 href 를 바꾸세요.
export const stores = [
  { id: 'apple', top: 'App Store에서', bottom: '다운로드 하기', href: links.store },
  { id: 'google', top: 'Google Play에서', bottom: '다운로드 하기', href: links.store },
];

// 상단 네비게이션 + 삼선 메뉴 공통 (섹션 순서대로). 외부 링크(다운로드)는 네비게이션 오른쪽 버튼으로
// 모든 섹션 타이틀 위 게임 이름 (단어별 색 = title_kr.png 글자 색에서 추출)
export const gameName = [
  { text: '핑크', color: '#f85ad0' },
  { text: '블랙', color: '#5c5c5c' }, // 로고 회색(#989898)보다 어둡게
  { text: '히어로', color: '#c05af8' },
];

export const menu = [
  { label: '게임소개', href: '#contents' },
  { label: '스토리', href: '#story' },
  { label: '히어로', href: '#character' },
  { label: '몬스터', href: '#monsters' },
  { label: '미디어', href: '#media' },
  { label: '다운로드', href: links.store },
];
export const nav = { logo: C('title_kr.png') };

export const socials = [{ id: 'youtube', label: 'YouTube', href: links.anime }];

// 이미지: public/cocobi/게임소개_*.jpg 를 영문 이름(intro_*.jpg)으로 복사해 사용
// headline: 이미지 위 큰 글자 (sub = 위 라벨). title/desc 는 지금 화면에 안 쓰임 (데이터만 유지)
export const features = [
  { tab: '구조', headline: '시민을 구조해요!', sub: '히어로 미션 01', title: '시민 구조 & 치료', desc: '시민을 안전한 곳으로 대피시키고, 상처와 바이러스를 치료해요.', img: C('intro_rescue.jpg') },
  { tab: '정비', headline: '마을을 깨끗하게!', sub: '히어로 미션 02', title: '엉망이 된 마을 청소', desc: '몬스터의 공격으로 더러워진 코코비 마을을 깨끗하게 정리해요.', img: C('intro_cleanup.jpg') },
  { tab: '전투', headline: '몬스터와 한판 승부!', sub: '히어로 미션 03', title: '합체 몬스터와 대결', desc: '핑크블랙 파워로 몬스터를 물리치고 세상을 구해요.', img: C('intro_battle.jpg') },
  { tab: '하우스', headline: '나만의 하우스 꾸미기!', sub: '승리의 보상', title: '나만의 핑크 블랙 하우스', desc: '하트 코인과 가구로 집을 꾸미고, 새로운 코코 의상도 얻어요.', img: C('intro_house.jpg') },
];

// HEROES 섹션: 왼쪽 카드 위 Spine 캐릭터 + 오른쪽 이름 · 설명 (public/cocobi/spine)
export const heroes = {
  title: '캐릭터',
  base: C('spine/'),
  animation: 'common/pose',
  // 모든 캐릭터에 같은 배율 적용 (가장 작게 맞는 캐릭터 기준) → 핑크/블랙 크기 동일
  fitW: 1.05,     // 카드 폭 대비 캐릭터 최대 폭 (1 넘으면 카드 밖으로 살짝 나옴)
  fitH: 0.86,     // 카드 높이 대비 캐릭터 최대 높이
  offsetY: -0.02, // 카드 중심에서 위(+)/아래(-) 이동 (카드 높이 비율)
  // card: 원본 popup_front 를 9-슬라이스로 재구성한 프레임 (scripts/make-hero-frames.mjs), tone: 안쪽 배경색, flip: 좌우 반전
  list: [
    { spine: 'coco_pink', skin: 'magic', name: '핑크 코코', card: C('hero-frame-pink.png'), tone: 'pink',
      desc: '달콤한 사랑의 힘으로\n나쁜 마음을 정화하는 핑크 히어로!' },
    { spine: 'coco_black', skin: 'magic', name: '블랙 코코', card: C('hero-frame-black.png'), tone: 'black',
      desc: '강력한 어둠의 힘으로\n몬스터를 제압하는 블랙 히어로!' },
  ],
};

// MONSTERS 섹션: Spine 몬스터 (public/cocobi/spine) + 아이콘(스티커)
// face: [머리 중심 x%, y% (스티커 이미지 기준), 확대 배율] → 원형 버튼에 머리 전체가 들어오도록
// skin / measureIgnore 는 bomb/ 페이지에서 검증된 값 (기본 스킨은 부품이 빠져 있는 경우가 있음)
export const monsters = {
  title: '몬스터',
  base: C('spine/'),
  animation: 'vs',  // 'vs' 또는 '…/vs'
  facing: 'left',   // Spine 원본이 바라보는 방향 → 글 쪽(오른쪽)을 보도록 반전
  fit: 0.9,         // 그림 칸 대비 크기
  list: [
    { spine: 'icetyranno', name: '아이스크림 티라노', icon: C('sticker_icetyranno.png'), face: [33, 22, 1.8],
      quote: '“꽁꽁 얼려 주마! 아이스크림 발사~!”', desc: '차가운 아이스크림을 마구 발사하는 몬스터. 피하지 않으면 몸이 꽁꽁 얼어버려요!' },
    { spine: 'mosquito', skin: 'color', name: '무지개 모기', icon: C('sticker_mosquito.png'), face: [39, 40, 2.2],
      quote: '“알록달록한 색깔은 전부 내 거야!”', desc: '무지개 침에 맞으면 색을 빼앗겨요. 날쌘 모기를 조심해야 해요!' },
    { spine: 'tank', name: '코딱지 탱크', icon: C('sticker_tank.png'), face: [38, 66, 2.1], measureIgnore: ['tank_bomb'],
      quote: '“끈적끈적 코딱지 폭탄 맛 좀 봐라!”', desc: '코딱지 폭탄 속에는 끈적한 콧물이 가득! 맞기 전에 먼저 터뜨려야 해요.' },
    { spine: 'shark', name: '티라노 상어', icon: C('sticker_tyrannoshark.png'), face: [57, 20, 1.5],
      quote: '“바닷속은 내 구역이다, 쿠아앙!”', desc: '바닷속에서 빠르게 돌진하는 몬스터. 재빠르게 움직여 무찔러요!' },
    { spine: 'firetruck', skin: 'phase_0', name: '코끼리 소방차', icon: C('sticker_firetruck.png'), face: [35, 53, 1.8],
      quote: '“뿌우~ 물대포 발사!”', desc: '코끼리 코로 물대포를 발사해요. 마법 광선으로 힘겨루기 한판!' },
    { spine: 'princess', skin: '0', name: '좀비 프린세스', icon: C('sticker_princess.png'), face: [45, 30, 2.3],
      quote: '“모두 나의 좀비 친구가 되어라~”', desc: '좀비 떼가 몰려와요! 좀비들을 막아내고 공주님을 원래 모습으로 되돌려요.' },
    { spine: 'crane', skin: '0', name: '티라노 크레인', icon: C('sticker_crane.png'), face: [39, 63, 2.0],
      quote: '“공사 장비 받아라, 쿵! 쾅!”', desc: '몬스터가 던지는 공사 장비들을 막아내면 거인으로 변신할 수 있어요!' },
    { spine: 'pepper', skin: '0', name: '고추사탕 괴물', icon: C('sticker_pepper.png'), face: [44, 39, 1.4],
      quote: '“화끈한 고추사탕 하나 먹어 볼래?”', desc: '고추맛 사탕은 무척 뜨겁고 매콤해요. 닿으면 화상을 입을지도 몰라요!' },
  ],
};

export const story = {
  title: '스토리',
  bg: '', // 배경 이미지 (비우면 블랙 도트 패턴)
  paragraphs: [
    ['공룡이 멸종하지 않은 세계,', '꼬마공룡 코코와 러비가 사는', '평화로운 코코비 마을.'],
    ['그런데 어느 날,', '몬스터들이 나타나', '마을을 엉망으로 만들기 시작했어요!'],
    ['<em>“사랑과 어둠의 힘으로 널 용서하지 않겠어!”</em>', '팬던트에 마법의 기운이 모이고,', '핑크 블랙 히어로가 출동합니다!'],
  ],
};

// video: 유튜브 영상 ID, 'list:재생목록ID' 는 재생목록
export const media = [
  { title: '공식 트레일러', img: C('youtube_0.png'), video: 'rmSjR8692ug' },
  { title: '애니메이션 〈코코비 핑크 블랙〉', img: C('youtube_1.png'), video: 'eb6z71CS4C0' },
];
export const mediaInitial = 4;

// 하단 영역 연출 (bomb/ 페이지에서 이식): 마우스를 움직이면 몬스터 스티커 트레일 + 잭잭 커서
export const cta = {
  trail: ['icetyranno', 'mosquito', 'tank', 'tyrannoshark', 'firetruck', 'princess', 'crane', 'pepper'].map((k) => C(`sticker_${k}.png`)),
  trailSpacing: 8,                                 // 화면 폭 ÷ 8 만큼 움직일 때마다 스티커 1개 (클수록 촘촘)
  trailInertia: { multiplier: 4, duration: 1.5 },  // 마우스 이동량 × 4 만큼 1.5초 동안 미끄러짐
  trailBase: 600,                                  // 원본 600px 스티커가 화면에서 130~220px (원본 비율 유지)
  cursor: [C('jj_cursor_0.png'), C('jj_cursor_1.png')],
  cursorFps: 5,
};

export const footer = {
  title: C('title_kr.png'), // 이용약관 위 타이틀 로고
  logo: C('kiglelogo.png'), // 하단 로고 이미지
  links: ['이용약관', '개인정보처리방침', '고객센터'],
  lines: ['(주)키글 서울특별시 서초구 방배로18길 5, 3층 (방배동, BH빌딩)', '© KIGLE Inc. 꼬마공룡 코코비. All Rights Reserved.'],
};
