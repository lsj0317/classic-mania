# Phase 5: 수익 모델 & 확장 — 개발 로드맵

> 기준일: 2026-03-12
> 현재 스택: Next.js 15 + React 18 + Zustand + Supabase(예정) + Tailwind CSS
> 예상 기간: 6개월 (3개 스프린트)

---

## 전체 타임라인 요약

| 스프린트 | 기간 | 핵심 목표 |
|----------|------|-----------|
| Sprint 1 | 1~2개월 | PWA 기반 + 푸시 알림 + Supabase Auth 연동 |
| Sprint 2 | 3~4개월 | 제휴 시스템 + 프리미엄 구독 + 결제 |
| Sprint 3 | 5~6개월 | React Native 전환 준비 + 위치 기반 추천 + 런칭 |

---

## Sprint 1: PWA 기반 & 인프라 (1~2개월)

### 1.1 PWA 전환
현재 PWA 설정이 전혀 없는 상태. Next.js PWA 플러그인으로 빠르게 적용.

**작업 항목:**
- [ ] `next-pwa` 또는 `@ducanh2912/next-pwa` 설치 및 next.config.mjs 설정
- [ ] `public/manifest.json` 생성 (앱 이름, 아이콘, 테마컬러, start_url)
- [ ] 앱 아이콘 생성 (192x192, 512x512, maskable)
- [ ] Service Worker 캐싱 전략 설정 (네트워크 우선 → 캐시 폴백)
- [ ] 오프라인 폴백 페이지 (`/offline`) 생성
- [ ] 설치 유도 배너 컴포넌트 (`InstallPrompt`) 구현
- [ ] `<meta>` 태그 추가 (theme-color, apple-mobile-web-app 등)

**신규 파일:**
```
public/manifest.json
public/icons/icon-192.png
public/icons/icon-512.png
src/components/InstallPrompt.tsx
src/app/offline/page.tsx
```

**수정 파일:**
```
next.config.mjs          — PWA 플러그인 래핑
src/app/layout.tsx        — manifest link, meta 태그
```

---

### 1.2 웹 푸시 알림
Supabase Edge Functions + Web Push API 조합.

**작업 항목:**
- [ ] 브라우저 Notification 권한 요청 UI
- [ ] Service Worker에 push 이벤트 핸들러 등록
- [ ] VAPID 키 생성 및 환경변수 설정
- [ ] Supabase `push_subscriptions` 테이블 추가
- [ ] 구독 정보 저장 API (subscription endpoint → Supabase)
- [ ] Supabase Edge Function: 알림 발송 (`web-push` 라이브러리)
- [ ] 트리거: 팔로우 아티스트 새 공연 등록 시 자동 발송
- [ ] 트리거: 동행 신청 수락 시 발송
- [ ] 알림 설정 페이지 (카테고리별 ON/OFF)

**신규 테이블:**
```sql
CREATE TABLE push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, endpoint)
);

CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    new_performance BOOLEAN DEFAULT true,
    companion_update BOOLEAN DEFAULT true,
    trade_update BOOLEAN DEFAULT true,
    system_notice BOOLEAN DEFAULT true,
    marketing BOOLEAN DEFAULT false
);
```

**신규 파일:**
```
src/components/PushPermissionBanner.tsx
src/app/settings/notifications/page.tsx
supabase/functions/send-push/index.ts
```

---

### 1.3 Supabase Auth 연동
현재 `currentUser`가 하드코딩된 mock 데이터. 실제 인증으로 전환.

**작업 항목:**
- [ ] `@supabase/supabase-js` 설치 및 클라이언트 초기화
- [ ] Supabase Auth 설정 (이메일/비밀번호 + 소셜 로그인)
- [ ] 소셜 프로바이더: Google, Kakao (한국 사용자 대상)
- [ ] `src/lib/supabase.ts` 클라이언트 싱글톤
- [ ] AuthProvider 컨텍스트 (세션 관리, 자동 새로고침)
- [ ] 로그인/회원가입 페이지 리뉴얼
- [ ] `currentUser` mock → Supabase session user 교체
- [ ] 미들웨어: 인증 필요 라우트 보호

**신규 파일:**
```
src/lib/supabase.ts               — Supabase 클라이언트
src/providers/AuthProvider.tsx     — 인증 컨텍스트
src/middleware.ts                  — 라우트 보호
src/app/login/page.tsx             — 리뉴얼
src/app/signup/page.tsx            — 신규
```

---

## Sprint 2: 제휴 시스템 & 프리미엄 (3~4개월)

### 2.1 제휴 & 파트너십 시스템

**데이터 모델:**
```sql
-- 제휴사
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('기획사', '공연장', '음반사')),
    logo TEXT,
    website TEXT,
    contact_email TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 할인 쿠폰
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES partners(id),
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    discount_type TEXT CHECK (discount_type IN ('percent', 'fixed')),
    discount_value INT NOT NULL,
    performance_id UUID REFERENCES performances(id),   -- NULL이면 전체 적용
    max_uses INT,
    used_count INT DEFAULT 0,
    starts_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_premium_only BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 쿠폰 사용 내역
CREATE TABLE coupon_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID REFERENCES coupons(id),
    user_id UUID REFERENCES users(id),
    redeemed_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(coupon_id, user_id)
);

-- 선예매 기회
CREATE TABLE early_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES partners(id),
    performance_id UUID REFERENCES performances(id),
    title TEXT NOT NULL,
    description TEXT,
    booking_url TEXT NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    is_premium_only BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

**작업 항목:**
- [ ] 제휴사 관리 (어드민 전용)
- [ ] 쿠폰 목록 페이지 (`/coupons`)
- [ ] 공연 상세에 "제휴 할인" 배지 표시
- [ ] 쿠폰 다운로드 & 사용 처리
- [ ] 선예매 알림 (팔로우 아티스트 기준)
- [ ] 공연장 파트너십: 좌석 추천 UI (좌석 맵 + 추천 표시)
- [ ] 음반사 제휴: 신보 프로모션 배너

**신규 파일:**
```
src/app/coupons/page.tsx
src/app/admin/partners/page.tsx
src/components/performance/PartnerBadge.tsx
src/components/performance/SeatRecommendation.tsx
src/components/promotions/NewReleaseBanner.tsx
```

---

### 2.2 프리미엄 구독 시스템

**결제 연동: Toss Payments (한국 PG)**
- 국내 서비스 → Toss Payments가 가장 적합
- 정기결제(빌링키) 지원, 카드/간편결제 가능

**데이터 모델:**
```sql
-- 구독 플랜
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,                   -- 'free', 'premium'
    price INT NOT NULL DEFAULT 0,         -- 월 가격 (원)
    features JSONB NOT NULL,              -- ["ad_free", "advanced_alerts", "expert_columns", "profile_custom"]
    is_active BOOLEAN DEFAULT true
);

-- 유저 구독
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id),
    status TEXT CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
    billing_key TEXT,                     -- Toss Payments 빌링키
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 결제 내역
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    subscription_id UUID REFERENCES user_subscriptions(id),
    amount INT NOT NULL,
    currency TEXT DEFAULT 'KRW',
    status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    pg_payment_key TEXT,                  -- Toss Payments 결제키
    pg_order_id TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

**프리미엄 기능 상세:**

| 기능 | Free | Premium |
|------|------|---------|
| 광고 | 있음 | 제거 |
| 공연 알림 | 기본 (팔로우 아티스트) | 고급 (장르/지역/가격 조건) |
| 전문가 칼럼 | 월 3편 | 무제한 |
| 프로필 커스터마이징 | 기본 아이콘 | 테마/배경/뱃지 프레임 |
| 쿠폰 | 일반 쿠폰 | 프리미엄 전용 쿠폰 |
| 선예매 | - | 제휴 선예매 참여 |

**작업 항목:**
- [ ] Toss Payments SDK 연동 (`@tosspayments/tosspayments-sdk`)
- [ ] 구독 플랜 페이지 (`/premium`)
- [ ] 결제 플로우: 플랜 선택 → 결제 → 빌링키 등록 → 구독 활성화
- [ ] 결제 성공/실패 콜백 페이지
- [ ] Supabase Edge Function: 정기결제 실행 (Cron)
- [ ] Supabase Edge Function: Toss Payments 웹훅 처리
- [ ] 프리미엄 게이트 HOC/훅 (`usePremium`, `PremiumGate`)
- [ ] 광고 컴포넌트 (Free 유저에게만 표시)
- [ ] 고급 알림 설정 UI (장르, 지역, 가격 범위 조건)
- [ ] 전문가 칼럼 접근 제한 (월 3편 초과 시 프리미엄 유도)
- [ ] 프로필 커스터마이징 UI (테마, 배경, 뱃지 프레임)
- [ ] 마이페이지 > 구독 관리 (해지, 플랜 변경, 결제 내역)

**신규 파일:**
```
src/lib/tossPayments.ts                    — Toss SDK 초기화
src/app/premium/page.tsx                   — 구독 플랜 페이지
src/app/premium/success/page.tsx           — 결제 성공
src/app/premium/fail/page.tsx              — 결제 실패
src/hooks/usePremium.ts                    — 프리미엄 상태 훅
src/components/PremiumGate.tsx             — 프리미엄 기능 게이트
src/components/ads/AdBanner.tsx            — 광고 배너
src/app/mypage/subscription/page.tsx       — 구독 관리
src/app/settings/alerts/page.tsx           — 고급 알림 설정
supabase/functions/billing-cron/index.ts   — 정기결제
supabase/functions/toss-webhook/index.ts   — 결제 웹훅
```

**환경변수:**
```env
NEXT_PUBLIC_TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=
```

---

## Sprint 3: 네이티브 앱 전환 & 런칭 (5~6개월)

### 3.1 React Native 전환 준비

**전략: 단계적 전환**
1. PWA로 초기 런칭 (Sprint 1 결과물)
2. 핵심 로직을 공유 가능한 구조로 리팩토링
3. React Native + Expo로 네이티브 앱 개발

**모노레포 구조:**
```
classic-mania/
├── apps/
│   ├── web/            ← 현재 Next.js 앱 이동
│   └── mobile/         ← React Native (Expo)
├── packages/
│   ├── shared/         ← 공유 로직
│   │   ├── types/      ← 타입 정의 (현재 src/types)
│   │   ├── stores/     ← Zustand 스토어 (현재 src/stores)
│   │   ├── api/        ← API 함수 (현재 src/api)
│   │   └── utils/      ← 유틸리티
│   └── ui/             ← 공유 UI 컴포넌트 (선택)
├── supabase/           ← DB 스키마 & Edge Functions
├── turbo.json
└── package.json
```

**작업 항목:**
- [ ] Turborepo 모노레포 전환
- [ ] `packages/shared`로 stores, types, api 추출
- [ ] Expo 프로젝트 초기 세팅 (`apps/mobile`)
- [ ] React Navigation 라우팅 설정
- [ ] Supabase React Native 클라이언트 설정
- [ ] 네이티브 푸시 알림 (Expo Notifications)
- [ ] 핵심 화면 구현: 홈, 공연 목록, 공연 상세, 아티스트
- [ ] 앱 스토어 배포 준비 (App Store, Google Play)

---

### 3.2 위치 기반 공연 추천

**작업 항목:**
- [ ] Geolocation API 연동 (웹 + 네이티브)
- [ ] 현재 위치 기반 근처 공연장 조회

```sql
-- 위치 기반 공연 검색 (PostGIS 확장)
CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE venues ADD COLUMN location GEOGRAPHY(POINT, 4326);

-- 반경 N km 내 공연장
SELECT v.*, ST_Distance(v.location, ST_Point($1, $2)::geography) AS distance_m
FROM venues v
WHERE ST_DWithin(v.location, ST_Point($1, $2)::geography, $3)  -- $3 = 반경(미터)
ORDER BY distance_m;

-- 근처 공연장에서 진행 중인 공연
SELECT p.*, v.name AS venue_name,
       ST_Distance(v.location, ST_Point($1, $2)::geography) AS distance_m
FROM performances p
JOIN venues v ON p.place = v.name
WHERE ST_DWithin(v.location, ST_Point($1, $2)::geography, $3)
  AND p.end_date >= CURRENT_DATE
ORDER BY distance_m, p.start_date;
```

- [ ] "내 주변 공연" 섹션 (홈화면)
- [ ] 공연장 지도 뷰 (Kakao Maps 또는 Naver Maps)
- [ ] 위치 기반 푸시 알림 (근처 공연 시작 N시간 전)

---

### 3.3 오프라인 지원

**작업 항목:**
- [ ] Service Worker 캐싱 강화 (공연 상세, 아티스트 정보)
- [ ] IndexedDB 로컬 데이터 저장 (즐겨찾기, 내 리뷰)
- [ ] 오프라인 상태 감지 UI (토스트 알림)
- [ ] 오프라인에서 작성한 리뷰/글 → 온라인 복귀 시 자동 동기화
- [ ] React Native: AsyncStorage + NetInfo 연동

---

## 의존성 & 신규 패키지 요약

### Sprint 1
```json
{
  "@ducanh2912/next-pwa": "^5.x",
  "@supabase/supabase-js": "^2.x",
  "@supabase/ssr": "^0.x",
  "web-push": "^3.x"
}
```

### Sprint 2
```json
{
  "@tosspayments/tosspayments-sdk": "^2.x"
}
```

### Sprint 3
```json
// apps/mobile
{
  "expo": "~52.x",
  "react-native": "0.76.x",
  "@react-navigation/native": "^7.x",
  "expo-notifications": "~0.29.x",
  "expo-location": "~18.x",
  "@supabase/supabase-js": "^2.x"
}
// root
{
  "turbo": "^2.x"
}
```

---

## 우선순위 매트릭스

```
높은 영향 + 낮은 노력  →  먼저
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 [1] PWA 전환           — 영향: 높음, 노력: 낮음  ★★★
 [2] Supabase Auth      — 영향: 높음, 노력: 중간  ★★★
 [3] 웹 푸시 알림        — 영향: 높음, 노력: 중간  ★★☆
 [4] 제휴 쿠폰 시스템    — 영향: 중간, 노력: 중간  ★★☆
 [5] 프리미엄 구독       — 영향: 높음, 노력: 높음  ★★☆
 [6] 위치 기반 추천      — 영향: 중간, 노력: 중간  ★☆☆
 [7] 네이티브 앱 전환    — 영향: 높음, 노력: 높음  ★☆☆
```

---

## 선행 조건 체크리스트

- [ ] Supabase 프로젝트 생성 & schema.sql 실행
- [ ] 기존 mock 데이터 → Supabase 마이그레이션 (Phase 4)
- [ ] Zustand stores → Supabase 쿼리 연동 (Phase 4)
- [ ] Toss Payments 사업자 가입 & API 키 발급
- [ ] VAPID 키 생성 (웹 푸시용)
- [ ] Apple Developer / Google Play Console 계정 (네이티브 앱용)
- [ ] 도메인 SSL 인증서 확인 (PWA 필수)
