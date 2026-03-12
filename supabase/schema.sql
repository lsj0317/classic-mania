-- ============================================================
-- Classic Mania - Supabase Schema & Queries
-- 생성일: 2026-03-12
-- ============================================================

-- ============================================================
-- 1. USERS (유저)
-- ============================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT UNIQUE NOT NULL,           -- 로그인 ID (예: "mujuki")
    name TEXT NOT NULL,
    nickname TEXT,
    email TEXT UNIQUE,
    profile_image TEXT,
    profile_icon_type TEXT DEFAULT 'default',
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 2. USER_ACTIVITY (유저 활동 통계)
-- ============================================================
CREATE TABLE user_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    review_count INT DEFAULT 0,
    follow_count INT DEFAULT 0,
    post_count INT DEFAULT 0,
    earned_badges TEXT[] DEFAULT '{}',      -- BadgeId 배열
    genre_stats JSONB DEFAULT '{}',         -- { "클래식": 5, "오페라": 3 }
    monthly_stats JSONB DEFAULT '{}',       -- { "2026-03": 2 }
    area_stats JSONB DEFAULT '{}',          -- { "서울": 10 }
    epoch_stats JSONB DEFAULT '{}',         -- { "Romantic": 5 }
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 3. USER_FOLLOWS (유저 간 팔로우)
-- ============================================================
CREATE TABLE user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(follower_id, following_id)
);

-- ============================================================
-- 4. NOTIFICATIONS (알림)
-- ============================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('new_performance', 'new_follower', 'post_reaction', 'badge_earned', 'companion_accepted', 'trade_request', 'system')),
    title TEXT NOT NULL,
    body TEXT,
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- ============================================================
-- 5. ARTISTS (아티스트)
-- ============================================================
CREATE TABLE artists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,              -- URL용 (예: "cho-seongjin")
    name TEXT NOT NULL,
    name_en TEXT,
    role TEXT NOT NULL,                     -- 피아니스트, 바이올리니스트 등
    role_en TEXT,
    profile_image TEXT,
    bio TEXT,
    bio_en TEXT,
    nationality TEXT,
    likes INT DEFAULT 0,
    performance_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 6. ARTIST_FOLLOWS (아티스트 팔로우)
-- ============================================================
CREATE TABLE artist_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, artist_id)
);

-- ============================================================
-- 7. CHEER_MESSAGES (아티스트 응원 메시지)
-- ============================================================
CREATE TABLE cheer_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_cheer_artist ON cheer_messages(artist_id, created_at DESC);

-- ============================================================
-- 8. COMPOSERS (작곡가 - OpenOpus 폴백 + 이달의 음악인)
-- ============================================================
CREATE TABLE composers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT UNIQUE,                -- OpenOpus API ID
    name TEXT NOT NULL,
    complete_name TEXT NOT NULL,
    birth DATE,
    death DATE,
    epoch TEXT,                             -- Baroque, Classical, Romantic 등
    portrait TEXT,
    birth_month INT GENERATED ALWAYS AS (EXTRACT(MONTH FROM birth)::INT) STORED,
    birth_day INT GENERATED ALWAYS AS (EXTRACT(DAY FROM birth)::INT) STORED,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_composers_birth_month ON composers(birth_month);

-- ============================================================
-- 9. PERFORMANCES (공연)
-- ============================================================
CREATE TABLE performances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT UNIQUE,                -- KOPIS API ID
    title TEXT NOT NULL,
    place TEXT,
    period TEXT,                            -- "2026.03.01~2026.03.31"
    start_date DATE,
    end_date DATE,
    area TEXT,                              -- 서울, 경기 등
    genre TEXT,                             -- 클래식, 오페라
    status TEXT CHECK (status IN ('공연예정', '공연중', '공연완료')),
    poster TEXT,
    price TEXT,
    booking_url TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    cast_info TEXT,
    crew TEXT,
    runtime TEXT,
    age TEXT,
    synopsis TEXT,
    schedule TEXT,
    facility_id TEXT,
    intro_images TEXT[],
    related_links JSONB,                    -- [{ name, url }]
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_performances_date ON performances(start_date, end_date);
CREATE INDEX idx_performances_area ON performances(area);
CREATE INDEX idx_performances_status ON performances(status);

-- ============================================================
-- 10. PERFORMANCE_REVIEWS (공연 리뷰)
-- ============================================================
CREATE TABLE performance_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    performance_id UUID REFERENCES performances(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title TEXT,
    content TEXT NOT NULL,
    seat_info TEXT,
    tags TEXT[],
    likes INT DEFAULT 0,
    liked_by UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reviews_perf ON performance_reviews(performance_id, created_at DESC);

-- ============================================================
-- 11. POSTS (게시판)
-- ============================================================
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('공연후기', '질문', '정보', '자유', '악기')),
    images TEXT[],
    views INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_posts_category ON posts(category, created_at DESC);
CREATE INDEX idx_posts_views ON posts(views DESC);

-- ============================================================
-- 12. POST_COMMENTS (게시글 댓글)
-- ============================================================
CREATE TABLE post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_comments_post ON post_comments(post_id, created_at);

-- ============================================================
-- 13. POST_REACTIONS (게시글 이모지 리액션)
-- ============================================================
CREATE TABLE post_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(post_id, user_id, emoji)
);

-- ============================================================
-- 14. NOTICES (공지사항)
-- ============================================================
CREATE TABLE notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    badge TEXT,                             -- 신규기능, 기능개선, 공지사항, 긴급공지
    author_name TEXT DEFAULT '운영팀',
    thumbnail TEXT,
    views INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 15. COMPANION_POSTS (동행 구하기)
-- ============================================================
CREATE TABLE companion_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    performance_id UUID REFERENCES performances(id) ON DELETE SET NULL,
    performance_title TEXT NOT NULL,
    performance_date TEXT,
    venue TEXT,
    area TEXT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    prefer_gender TEXT CHECK (prefer_gender IN ('무관', '남성', '여성')),
    max_companions INT DEFAULT 1,
    current_companions INT DEFAULT 0,
    status TEXT DEFAULT '모집중' CHECK (status IN ('모집중', '모집완료', '마감')),
    age_range TEXT,
    views INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 16. COMPANION_REQUESTS (동행 신청)
-- ============================================================
CREATE TABLE companion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES companion_posts(id) ON DELETE CASCADE,
    requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
    requester_name TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT '대기중' CHECK (status IN ('대기중', '수락', '거절')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 17. DIRECT_MESSAGES (쪽지)
-- ============================================================
CREATE TABLE direct_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_dm_conversation ON direct_messages(
    LEAST(sender_id, receiver_id),
    GREATEST(sender_id, receiver_id),
    created_at
);

-- ============================================================
-- 18. MEETUPS (소모임 & 이벤트)
-- ============================================================
CREATE TABLE meetups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT CHECK (type IN ('소모임', '이벤트', '스터디', '감상회')),
    status TEXT DEFAULT '모집중' CHECK (status IN ('모집중', '모집완료', '진행중', '종료')),
    host_id UUID REFERENCES users(id) ON DELETE CASCADE,
    host_name TEXT NOT NULL,
    location TEXT,
    area TEXT,
    meet_date DATE,
    meet_time TEXT,
    max_members INT DEFAULT 10,
    current_members INT DEFAULT 1,
    genre TEXT,
    thumbnail TEXT,
    is_online BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 19. MEETUP_MEMBERS (소모임 참가자)
-- ============================================================
CREATE TABLE meetup_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meetup_id UUID REFERENCES meetups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(meetup_id, user_id)
);

-- ============================================================
-- 20. MEETUP_COMMENTS (소모임 댓글)
-- ============================================================
CREATE TABLE meetup_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meetup_id UUID REFERENCES meetups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 21. TICKET_TRADES (티켓 중고거래)
-- ============================================================
CREATE TABLE ticket_trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('판매', '구매')),
    status TEXT DEFAULT '거래중' CHECK (status IN ('거래중', '예약중', '거래완료')),
    performance_id UUID REFERENCES performances(id) ON DELETE SET NULL,
    performance_title TEXT NOT NULL,
    performance_date TEXT,
    venue TEXT,
    area TEXT,
    seat_info TEXT,
    original_price INT,
    trade_price INT NOT NULL,
    quantity INT DEFAULT 1,
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    seller_name TEXT NOT NULL,
    seller_rating NUMERIC(2,1) DEFAULT 0,
    verify_status TEXT DEFAULT '미인증' CHECK (verify_status IN ('미인증', '인증완료', '인증실패')),
    description TEXT,
    images TEXT[],
    views INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 22. TICKET_TRADE_REQUESTS (거래 요청)
-- ============================================================
CREATE TABLE ticket_trade_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_id UUID REFERENCES ticket_trades(id) ON DELETE CASCADE,
    requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
    requester_name TEXT NOT NULL,
    message TEXT,
    offered_price INT,
    status TEXT DEFAULT '대기중' CHECK (status IN ('대기중', '수락', '거절')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 23. ALBUMS (음반)
-- ============================================================
CREATE TABLE albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    artist TEXT,
    performer TEXT,
    composer TEXT,
    composer_name TEXT,
    label TEXT,
    year INT,
    release_date DATE,
    genre TEXT,
    cover_image TEXT,
    track_count INT DEFAULT 0,
    description TEXT,
    tracks JSONB,                           -- [{ number, title, duration }]
    average_rating NUMERIC(2,1) DEFAULT 0,
    review_count INT DEFAULT 0,
    spotify_url TEXT,
    apple_music_url TEXT,
    youtube_music_url TEXT,
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 24. ALBUM_REVIEWS (음반 리뷰)
-- ============================================================
CREATE TABLE album_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title TEXT,
    content TEXT NOT NULL,
    likes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 25. COLUMNS (칼럼/기사)
-- ============================================================
CREATE TABLE columns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category TEXT CHECK (category IN ('인터뷰', '공연비평', '음반리뷰', '에디터추천', '유저기고')),
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    author_role TEXT,
    author_image TEXT,
    thumbnail TEXT,
    tags TEXT[],
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    read_time INT DEFAULT 5,               -- 분 단위
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 26. VENUES (공연장)
-- ============================================================
CREATE TABLE venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    area TEXT,
    phone TEXT,
    website TEXT,
    thumbnail TEXT,
    images TEXT[],
    total_seats INT,
    halls JSONB,                            -- [{ name, seats, features }]
    nearby_spots JSONB,                     -- [{ name, type, distance, description }]
    accessibility JSONB,                    -- { wheelchair, elevator, parking, ... }
    transport_info TEXT,
    parking_info TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 27. VENUE_REVIEWS (공연장 리뷰)
-- ============================================================
CREATE TABLE venue_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    sound_rating SMALLINT CHECK (sound_rating BETWEEN 1 AND 5),
    view_rating SMALLINT CHECK (view_rating BETWEEN 1 AND 5),
    comfort_rating SMALLINT CHECK (comfort_rating BETWEEN 1 AND 5),
    content TEXT NOT NULL,
    seat_info TEXT,
    visited_at DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 28. WORK_GUIDES (작품 학습 가이드)
-- ============================================================
CREATE TABLE work_guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    composer_id UUID REFERENCES composers(id) ON DELETE SET NULL,
    composer_name TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    work_title TEXT,
    epoch TEXT,
    genre TEXT,
    difficulty TEXT CHECK (difficulty IN ('입문', '초급', '중급', '고급')),
    duration TEXT,
    background TEXT,
    structure JSONB,                        -- [{ name, description }]
    description TEXT,
    listening_points JSONB,                 -- [{ title, description, timestamp }]
    youtube_video_id TEXT,
    thumbnail TEXT,
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 29. PLAYLISTS (큐레이션 플레이리스트)
-- ============================================================
CREATE TABLE playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    theme TEXT,
    category TEXT CHECK (category IN ('입문', '시대별', '분위기별', '장르별')),
    difficulty TEXT CHECK (difficulty IN ('입문', '초급', '중급', '고급')),
    tracks JSONB NOT NULL,                  -- [{ title, composer, performer, duration, youtubeVideoId }]
    thumbnail TEXT,
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 30. LIVE_CHAT_MESSAGES (실시간 채팅)
-- ============================================================
CREATE TABLE live_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    performance_id UUID REFERENCES performances(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_profile_image TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_chat_perf ON live_chat_messages(performance_id, created_at DESC);

-- ============================================================
-- 31. CONDUCTORS (지휘자 풀)
-- ============================================================
CREATE TABLE conductors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    search_name TEXT NOT NULL,
    wiki_title TEXT,
    name_ko TEXT NOT NULL,
    nationality TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 32. PERFORMERS (연주자 풀)
-- ============================================================
CREATE TABLE performers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    search_name TEXT NOT NULL,
    wiki_title TEXT,
    name_ko TEXT NOT NULL,
    instrument TEXT,                        -- piano, violin, cello, voice 등
    nationality TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 33. TICKET_PRICES (티켓 가격 정보)
-- ============================================================
CREATE TABLE ticket_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    performance_id UUID REFERENCES performances(id) ON DELETE CASCADE,
    vendor TEXT NOT NULL,
    price INT NOT NULL,
    url TEXT,
    fetched_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ticket_prices_perf ON ticket_prices(performance_id);


-- ============================================================
-- RLS (Row Level Security) 정책
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE cheer_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE companion_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE companion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetup_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_trade_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_chat_messages ENABLE ROW LEVEL SECURITY;

-- 읽기: 모든 공개 데이터
CREATE POLICY "Public read" ON users FOR SELECT USING (true);
CREATE POLICY "Public read" ON artists FOR SELECT USING (true);
CREATE POLICY "Public read" ON composers FOR SELECT USING (true);
CREATE POLICY "Public read" ON performances FOR SELECT USING (true);
CREATE POLICY "Public read" ON performance_reviews FOR SELECT USING (true);
CREATE POLICY "Public read" ON posts FOR SELECT USING (true);
CREATE POLICY "Public read" ON post_comments FOR SELECT USING (true);
CREATE POLICY "Public read" ON notices FOR SELECT USING (true);
CREATE POLICY "Public read" ON albums FOR SELECT USING (true);
CREATE POLICY "Public read" ON album_reviews FOR SELECT USING (true);
CREATE POLICY "Public read" ON columns FOR SELECT USING (true);
CREATE POLICY "Public read" ON venues FOR SELECT USING (true);
CREATE POLICY "Public read" ON venue_reviews FOR SELECT USING (true);
CREATE POLICY "Public read" ON work_guides FOR SELECT USING (true);
CREATE POLICY "Public read" ON playlists FOR SELECT USING (true);
CREATE POLICY "Public read" ON companion_posts FOR SELECT USING (true);
CREATE POLICY "Public read" ON meetups FOR SELECT USING (true);
CREATE POLICY "Public read" ON ticket_trades FOR SELECT USING (true);
CREATE POLICY "Public read" ON cheer_messages FOR SELECT USING (true);
CREATE POLICY "Public read" ON conductors FOR SELECT USING (true);
CREATE POLICY "Public read" ON performers FOR SELECT USING (true);
CREATE POLICY "Public read" ON live_chat_messages FOR SELECT USING (true);

-- 쓰기: 본인 데이터만
CREATE POLICY "Own data" ON users FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Own data" ON user_activity FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Own data" ON notifications FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Own insert" ON posts FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "Own update" ON posts FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Own delete" ON posts FOR DELETE USING (author_id = auth.uid());
CREATE POLICY "Own insert" ON performance_reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Own insert" ON cheer_messages FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Own insert" ON post_reactions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Own delete" ON post_reactions FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "Own insert" ON artist_follows FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Own delete" ON artist_follows FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "Own insert" ON user_follows FOR INSERT WITH CHECK (follower_id = auth.uid());
CREATE POLICY "Own delete" ON user_follows FOR DELETE USING (follower_id = auth.uid());
CREATE POLICY "Own insert" ON companion_posts FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "Own insert" ON companion_requests FOR INSERT WITH CHECK (requester_id = auth.uid());
CREATE POLICY "Own data" ON direct_messages FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "Own insert" ON direct_messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Own insert" ON meetup_members FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Own delete" ON meetup_members FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "Own insert" ON ticket_trades FOR INSERT WITH CHECK (seller_id = auth.uid());
CREATE POLICY "Own insert" ON ticket_trade_requests FOR INSERT WITH CHECK (requester_id = auth.uid());
CREATE POLICY "Own insert" ON live_chat_messages FOR INSERT WITH CHECK (user_id = auth.uid());


-- ============================================================
-- QUERIES (자주 사용하는 쿼리)
-- ============================================================

-- ── 홈화면 ──

-- Q1: 이달의 음악인 (해당 월 생일 작곡가)
SELECT id, name, complete_name, birth, death, epoch, portrait, birth_month, birth_day
FROM composers
WHERE birth_month = EXTRACT(MONTH FROM CURRENT_DATE)::INT
ORDER BY birth_day;

-- Q2: 이달의 음악인 - 다음 달 폴백 (현재 월에 없을 경우)
SELECT id, name, complete_name, birth, death, epoch, portrait, birth_month, birth_day
FROM composers
WHERE birth_month = (EXTRACT(MONTH FROM CURRENT_DATE)::INT % 12) + 1
ORDER BY birth_day;

-- Q3: 이번 달 공연 목록
SELECT *
FROM performances
WHERE start_date <= (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')::DATE
  AND end_date >= CURRENT_DATE
ORDER BY start_date;

-- Q4: 오늘의 공연
SELECT *
FROM performances
WHERE start_date <= CURRENT_DATE
  AND end_date >= CURRENT_DATE
ORDER BY title;

-- Q5: 인기 게시글 (조회수 TOP 5)
SELECT p.*, u.profile_image, u.nickname
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
ORDER BY p.views DESC
LIMIT 5;

-- Q6: 최신 게시글
SELECT p.*, u.profile_image, u.nickname
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
ORDER BY p.created_at DESC
LIMIT 5;

-- Q7: 공지사항 (최신)
SELECT * FROM notices ORDER BY created_at DESC LIMIT 10;


-- ── 아티스트 ──

-- Q8: 아티스트 목록 (이름순)
SELECT a.*,
       (SELECT COUNT(*) FROM artist_follows af WHERE af.artist_id = a.id) AS follower_count
FROM artists a
ORDER BY a.name;

-- Q9: 아티스트 검색 (한글 + 영어)
SELECT * FROM artists
WHERE name ILIKE '%' || $1 || '%'
   OR name_en ILIKE '%' || $1 || '%'
ORDER BY name;

-- Q10: 아티스트 팔로우 토글
-- 팔로우
INSERT INTO artist_follows (user_id, artist_id) VALUES ($1, $2)
ON CONFLICT (user_id, artist_id) DO NOTHING;
-- 언팔로우
DELETE FROM artist_follows WHERE user_id = $1 AND artist_id = $2;

-- Q11: 내가 팔로우한 아티스트 목록
SELECT a.*
FROM artists a
INNER JOIN artist_follows af ON a.id = af.artist_id
WHERE af.user_id = $1
ORDER BY af.created_at DESC;

-- Q12: 아티스트 응원 메시지
SELECT cm.*, u.profile_image, u.nickname
FROM cheer_messages cm
LEFT JOIN users u ON cm.user_id = u.id
WHERE cm.artist_id = $1
ORDER BY cm.created_at DESC
LIMIT 20;


-- ── 공연 ──

-- Q13: 공연 목록 (필터링)
SELECT * FROM performances
WHERE ($1::TEXT IS NULL OR area = $1)
  AND ($2::TEXT IS NULL OR genre = $2)
  AND ($3::TEXT IS NULL OR status = $3)
  AND ($4::TEXT IS NULL OR title ILIKE '%' || $4 || '%')
ORDER BY start_date DESC
LIMIT $5 OFFSET $6;

-- Q14: 공연 상세
SELECT * FROM performances WHERE id = $1;

-- Q15: 공연 리뷰 목록
SELECT r.*, u.profile_image, u.nickname, u.user_id
FROM performance_reviews r
LEFT JOIN users u ON r.user_id = u.id
WHERE r.performance_id = $1
ORDER BY r.created_at DESC;

-- Q16: 공연 평균 평점
SELECT
    COUNT(*) AS review_count,
    ROUND(AVG(rating), 1) AS avg_rating
FROM performance_reviews
WHERE performance_id = $1;

-- Q17: 공연 리뷰 작성
INSERT INTO performance_reviews (performance_id, user_id, rating, title, content, seat_info, tags)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;


-- ── 게시판 ──

-- Q18: 게시글 목록 (카테고리 필터 + 페이지네이션)
SELECT p.*, u.profile_image, u.nickname,
       (SELECT COUNT(*) FROM post_comments pc WHERE pc.post_id = p.id) AS comment_count
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
WHERE ($1::TEXT IS NULL OR p.category = $1)
  AND ($2::TEXT IS NULL OR p.title ILIKE '%' || $2 || '%')
ORDER BY p.created_at DESC
LIMIT $3 OFFSET $4;

-- Q19: 게시글 상세 + 조회수 증가
UPDATE posts SET views = views + 1 WHERE id = $1 RETURNING *;

-- Q20: 게시글 댓글 (대댓글 포함)
SELECT c.*, u.profile_image, u.nickname
FROM post_comments c
LEFT JOIN users u ON c.user_id = u.id
WHERE c.post_id = $1
ORDER BY c.created_at;

-- Q21: 게시글 리액션 집계
SELECT emoji, COUNT(*) AS count,
       BOOL_OR(user_id = $2) AS reacted_by_current_user
FROM post_reactions
WHERE post_id = $1
GROUP BY emoji;


-- ── 동행 구하기 ──

-- Q22: 동행 게시글 목록
SELECT cp.*, u.profile_image
FROM companion_posts cp
LEFT JOIN users u ON cp.author_id = u.id
WHERE ($1::TEXT IS NULL OR cp.area = $1)
  AND ($2::TEXT IS NULL OR cp.status = $2)
ORDER BY cp.created_at DESC
LIMIT $3 OFFSET $4;

-- Q23: 동행 신청
INSERT INTO companion_requests (post_id, requester_id, requester_name, message)
VALUES ($1, $2, $3, $4) RETURNING *;


-- ── 소모임 ──

-- Q24: 소모임 목록
SELECT m.*,
       (SELECT COUNT(*) FROM meetup_members mm WHERE mm.meetup_id = m.id) AS member_count
FROM meetups m
WHERE ($1::TEXT IS NULL OR m.type = $1)
  AND ($2::TEXT IS NULL OR m.status = $2)
ORDER BY m.meet_date;

-- Q25: 소모임 참가
INSERT INTO meetup_members (meetup_id, user_id) VALUES ($1, $2)
ON CONFLICT (meetup_id, user_id) DO NOTHING;

-- Q26: 소모임 댓글
SELECT mc.*, u.profile_image, u.nickname
FROM meetup_comments mc
LEFT JOIN users u ON mc.user_id = u.id
WHERE mc.meetup_id = $1
ORDER BY mc.created_at;


-- ── 티켓 중고거래 ──

-- Q27: 티켓 거래 목록
SELECT tt.*, u.profile_image
FROM ticket_trades tt
LEFT JOIN users u ON tt.seller_id = u.id
WHERE ($1::TEXT IS NULL OR tt.type = $1)
  AND ($2::TEXT IS NULL OR tt.status = $2)
  AND ($3::TEXT IS NULL OR tt.area = $3)
ORDER BY tt.created_at DESC
LIMIT $4 OFFSET $5;

-- Q28: 거래 요청
INSERT INTO ticket_trade_requests (trade_id, requester_id, requester_name, message, offered_price)
VALUES ($1, $2, $3, $4, $5) RETURNING *;


-- ── 알림 ──

-- Q29: 내 알림 목록
SELECT * FROM notifications
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT 50;

-- Q30: 안 읽은 알림 수
SELECT COUNT(*) AS unread_count
FROM notifications
WHERE user_id = $1 AND is_read = false;

-- Q31: 알림 읽음 처리
UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2;

-- Q32: 알림 전체 읽음
UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false;

-- Q33: 알림 전체 삭제
DELETE FROM notifications WHERE user_id = $1;


-- ── DM (쪽지) ──

-- Q34: 대화 목록 (두 유저 간)
SELECT dm.*, u.nickname AS sender_nickname, u.profile_image AS sender_image
FROM direct_messages dm
LEFT JOIN users u ON dm.sender_id = u.id
WHERE (dm.sender_id = $1 AND dm.receiver_id = $2)
   OR (dm.sender_id = $2 AND dm.receiver_id = $1)
ORDER BY dm.created_at;

-- Q35: 쪽지 읽음 처리
UPDATE direct_messages SET is_read = true
WHERE receiver_id = $1 AND sender_id = $2 AND is_read = false;


-- ── 음반 ──

-- Q36: 음반 목록
SELECT * FROM albums ORDER BY created_at DESC;

-- Q37: 음반 리뷰
SELECT ar.*, u.profile_image, u.nickname
FROM album_reviews ar
LEFT JOIN users u ON ar.user_id = u.id
WHERE ar.album_id = $1
ORDER BY ar.created_at DESC;


-- ── 칼럼 ──

-- Q38: 칼럼 목록 (카테고리 필터)
SELECT * FROM columns
WHERE ($1::TEXT IS NULL OR category = $1)
ORDER BY created_at DESC;

-- Q39: 칼럼 상세 + 조회수
UPDATE columns SET views = views + 1 WHERE id = $1 RETURNING *;


-- ── 공연장 ──

-- Q40: 공연장 목록
SELECT * FROM venues ORDER BY name;

-- Q41: 공연장 상세
SELECT * FROM venues WHERE id = $1;

-- Q42: 공연장 리뷰
SELECT vr.*, u.profile_image, u.nickname
FROM venue_reviews vr
LEFT JOIN users u ON vr.user_id = u.id
WHERE vr.venue_id = $1
ORDER BY vr.created_at DESC;


-- ── 학습 ──

-- Q43: 작품 가이드 목록
SELECT * FROM work_guides ORDER BY created_at DESC;

-- Q44: 플레이리스트 목록
SELECT * FROM playlists ORDER BY created_at DESC;


-- ── 유저 활동 ──

-- Q45: 유저 활동 조회
SELECT * FROM user_activity WHERE user_id = $1;

-- Q46: 유저 활동 업데이트 (upsert)
INSERT INTO user_activity (user_id, review_count, follow_count, post_count, earned_badges, genre_stats, monthly_stats, area_stats, epoch_stats)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
ON CONFLICT (user_id)
DO UPDATE SET
    review_count = EXCLUDED.review_count,
    follow_count = EXCLUDED.follow_count,
    post_count = EXCLUDED.post_count,
    earned_badges = EXCLUDED.earned_badges,
    genre_stats = EXCLUDED.genre_stats,
    monthly_stats = EXCLUDED.monthly_stats,
    area_stats = EXCLUDED.area_stats,
    epoch_stats = EXCLUDED.epoch_stats,
    updated_at = now();

-- Q47: 유저 팔로워/팔로잉 수
SELECT
    (SELECT COUNT(*) FROM user_follows WHERE following_id = $1) AS follower_count,
    (SELECT COUNT(*) FROM user_follows WHERE follower_id = $1) AS following_count;

-- Q48: 유저 팔로우
INSERT INTO user_follows (follower_id, following_id) VALUES ($1, $2)
ON CONFLICT (follower_id, following_id) DO NOTHING;

-- Q49: 유저 언팔로우
DELETE FROM user_follows WHERE follower_id = $1 AND following_id = $2;


-- ── 실시간 채팅 (Supabase Realtime 연동) ──

-- Q50: 공연 채팅 메시지 로드
SELECT lcm.*, u.profile_image, u.nickname
FROM live_chat_messages lcm
LEFT JOIN users u ON lcm.user_id = u.id
WHERE lcm.performance_id = $1
ORDER BY lcm.created_at DESC
LIMIT 100;

-- Q51: 채팅 메시지 전송
INSERT INTO live_chat_messages (performance_id, user_id, user_name, user_profile_image, message)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;


-- ============================================================
-- FUNCTIONS (유틸리티 함수)
-- ============================================================

-- F1: 조회수 증가 (공통)
CREATE OR REPLACE FUNCTION increment_views(table_name TEXT, row_id UUID)
RETURNS VOID AS $$
BEGIN
    EXECUTE format('UPDATE %I SET views = views + 1 WHERE id = $1', table_name) USING row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- F2: 좋아요 토글
CREATE OR REPLACE FUNCTION toggle_like(table_name TEXT, row_id UUID, delta INT)
RETURNS VOID AS $$
BEGIN
    EXECUTE format('UPDATE %I SET likes = likes + $1 WHERE id = $2', table_name) USING delta, row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- F3: 동행 게시글 인원 자동 업데이트
CREATE OR REPLACE FUNCTION update_companion_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = '수락' THEN
        UPDATE companion_posts
        SET current_companions = current_companions + 1
        WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_companion_accepted
    AFTER INSERT OR UPDATE ON companion_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_companion_count();

-- F4: 소모임 인원 자동 업데이트
CREATE OR REPLACE FUNCTION update_meetup_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE meetups SET current_members = current_members + 1 WHERE id = NEW.meetup_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE meetups SET current_members = current_members - 1 WHERE id = OLD.meetup_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_meetup_member_change
    AFTER INSERT OR DELETE ON meetup_members
    FOR EACH ROW
    EXECUTE FUNCTION update_meetup_count();
