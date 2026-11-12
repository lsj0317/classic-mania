# Cloudflare Workers 배포 가이드

Next.js 앱을 [OpenNext Cloudflare 어댑터](https://opennext.js.org/cloudflare)로 Cloudflare Workers에 배포한다.
(Cloudflare **Pages**가 아니라 **Workers**다. API 라우트와 서버 렌더링 페이지가 있어서 정적 Pages로는 동작하지 않는다.)

## 명령어

| 명령 | 설명 |
|---|---|
| `npm run dev` | 기존과 동일한 Next.js 개발 서버 |
| `npm run preview` | Cloudflare용으로 빌드 후 로컬 Workers 런타임에서 실행 (http://localhost:8787) |
| `npm run deploy` | 빌드 후 Cloudflare에 바로 배포 (`npx wrangler login` 필요) |
| `npm run upload` | 새 버전을 업로드만 하고 트래픽은 전환하지 않음 |

## 방법 A. GitHub 연동 자동 배포 (권장)

1. Cloudflare 대시보드 → **Workers & Pages → Create → Import a repository** → 이 저장소 선택
2. 빌드 설정
   - Build command: `npx opennextjs-cloudflare build`
   - Deploy command: `npx opennextjs-cloudflare deploy`
   - Production branch: `main`
3. **Build variables** (빌드할 때 코드에 박히는 공개 값 — 바꾸면 재빌드 필요)
   - `NEXT_PUBLIC_SITE_URL` = `https://<내 도메인>`
   - 광고·제휴를 쓸 경우 `NEXT_PUBLIC_ADSENSE_*`, `NEXT_PUBLIC_AFFILIATE_TEMPLATE_*` (목록은 `src/lib/monetization.ts` 참고)
4. Worker 설정 → **Variables and Secrets** (런타임 서버 비밀값, 타입은 Secret)
   - `KOPIS_API_KEY`, `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`, `YOUTUBE_API_KEY`

## 방법 B. 로컬에서 직접 배포

```bash
npx wrangler login
npx wrangler secret put KOPIS_API_KEY        # 나머지 비밀값도 같은 방식
NEXT_PUBLIC_SITE_URL=https://<내 도메인> npm run deploy
```

`NEXT_PUBLIC_*` 값은 빌드 시점에 필요하므로 `.env.local`이나 명령 앞 환경변수로 넣는다.

## 로컬 미리보기

```bash
cp .dev.vars.example .dev.vars   # 서버 비밀값 채우기
npm run preview
```

## 커스텀 도메인

Worker → **Settings → Domains & Routes → Add → Custom domain**.
도메인이 Cloudflare DNS에 있어야 한다(Cloudflare Registrar에서 구입하면 자동).
연결 후 `NEXT_PUBLIC_SITE_URL`을 새 도메인으로 바꾸고 다시 배포한다 (sitemap, OG 태그, canonical에 사용됨).

## 선택 설정

- **이미지 최적화**: 지금은 `next/image`가 원본 이미지를 그대로 내려준다. 최적화가 필요하면
  Cloudflare Images를 활성화하고 `wrangler.jsonc`의 `images` 바인딩 주석을 해제한다.
- **fetch/ISR 캐시**: 지금은 `fetch(..., { next: { revalidate } })` 결과를 Worker 간에 공유하지 않는다
  (요청마다 원본 API 호출). 트래픽이 늘면 R2 버킷을 만들고 `open-next.config.ts` 주석대로 켠다.

## 제한 (무료 플랜 기준, 변경될 수 있음)

- Worker 크기: 압축 3 MiB — 현재 약 1.6 MiB
- 하루 요청 수 / 요청당 CPU 시간 제한이 있으므로 트래픽이 늘면 Workers Paid 플랜을 검토한다.
