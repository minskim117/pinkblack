## Cloudflare 배포

이 사이트는 Vite 로 빌드한 정적 파일(`dist/`)을 Cloudflare Workers 정적 자산으로 배포한다. 설정은 `wrangler.jsonc` (Worker 이름 `pinkblack`, `assets.directory: ./dist`).

- 로컬 확인 (Workers 환경): `npm run cf:dev` — 빌드 후 `wrangler dev`
- 개발 서버 (Vite): `npm run dev` — http://localhost:5175
- 배포 점검 (업로드 안 함): `npm run build && npx wrangler deploy --dry-run`
- 배포: `npm run deploy` — 빌드 후 `wrangler deploy`
- 처음 한 번: `npx wrangler login`, 확인은 `npx wrangler whoami`
- 업로드 제외 목록: `public/.assetsignore` (빌드 시 `dist/` 루트로 복사됨)

원칙
- Workers 관련 작업 전에는 developers.cloudflare.com 최신 문서를 확인한다.
- `wrangler delete`, `wrangler rollback` 처럼 지우거나 되돌리는 명령은 승인 없이 실행하지 않는다.
- API 토큰·비밀번호는 파일에 쓰거나 출력하지 않는다.
