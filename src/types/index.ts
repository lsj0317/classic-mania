// src/types/index.ts
export type ProfileIconType = 'default' | 'initial' | 'image';

export interface User {
    userId: string;
    name: string;
    nickname?: string;
    profileImage?: string;
    profileIconType?: ProfileIconType;
}

// 활동 배지
export type BadgeId =
    | 'first_review'
    | 'first_follow'
    | 'review_10'
    | 'review_50'
    | 'follow_5'
    | 'follow_10'
    | 'post_10'
    | 'best_reviewer'
    | 'attendance_7'
    | 'attendance_30';

export interface Badge {
    id: BadgeId;
    name: string;
    description: string;
    icon: string;   // 이모지
    color: string;  // tailwind bg color
    earnedAt?: string; // ISO date string
}

// 유저 활동 기록
export interface UserActivity {
    userId: string;
    reviewCount: number;
    followCount: number;
    postCount: number;
    earnedBadges: BadgeId[];
    followerIds: string[];
    followingIds: string[];
    // 장르별 관람 통계 (공연 장르 → 횟수)
    genreStats: Record<string, number>;
    // 월별 관람 통계 (YYYY-MM → 횟수)
    monthlyStats: Record<string, number>;
    // 지역별 관람 통계 (지역명 → 횟수)
    areaStats: Record<string, number>;
    // 선호 시대 (epoch → 횟수)
    epochStats: Record<string, number>;
}

// 이모지 리액션
export interface Reaction {
    emoji: string;
    label: string;
    count: number;
    reactedByCurrentUser: boolean;
}

export interface PostReactions {
    postId: number;
    reactions: Reaction[];
}

// 라이브 채팅 메시지
export interface LiveChatMessage {
    id: string;
    performanceId: string;
    userId: string;
    userName: string;
    userProfileImage?: string;
    message: string;
    createdAt: string;
}

// 알림
export interface Notification {
    id: string;
    type: 'new_performance' | 'new_follower' | 'post_reaction' | 'new_post';
    title: string;
    body: string;
    link?: string;
    isRead: boolean;
    createdAt: string;
}

// 추천 아이템
export interface RecommendedPerformance {
    performance: Performance;
    reason: string; // 추천 이유
    score: number;
}

export interface MentionedPerformance {
    id: string;
    title: string;
    poster?: string;
    position: number; // character index in content where the mention was inserted
}

export interface Post {
    id: number;
    title: string;
    content: string;
    category: "공연후기" | "질문" | "정보" | "자유" | "악기";
    authorId: string;
    authorName: string;
    images: string[];
    createdAt: string;
    views: number;
    mentionedPerformances?: MentionedPerformance[];
}

export interface RelatedLink {
    name: string;
    url: string;
}

export interface Performance {
    id: string;
    title: string;        // 공연 제목
    place: string;        // 공연장 명칭
    period: string;       // 공연 기간 (표시용)
    startDate?: string;   // 공연 시작일 (YYYY.MM.DD)
    endDate?: string;     // 공연 종료일 (YYYY.MM.DD)
    area: string;         // 지역 (서울, 부산, 경기 등)
    genre?: string;       // 장르명 (클래식, 오페라 등)
    status: string;       // 공연 상태 (공연중 | 공연완료 | 공연예정)
    poster?: string;      // 포스터 이미지 URL
    price?: string;       // 가격 정보
    bookingUrl?: string;  // 예매 링크
    lat?: number;         // 지도 표시용 위도
    lng?: number;         // 지도 표시용 경도
    // 상세 전용 필드
    cast?: string;        // 출연진
    crew?: string;        // 제작진
    runtime?: string;     // 공연 런타임
    age?: string;         // 관람 연령
    synopsis?: string;    // 줄거리
    schedule?: string;    // 공연 시간
    facilityId?: string;  // 공연시설 ID
    introImages?: string[];    // 소개 이미지 목록
    relatedLinks?: RelatedLink[]; // 관련 링크 목록
}

// 아티스트 관련 타입
export interface Artist {
    id: string;
    name: string;           // 한글 이름
    nameEn: string;         // 영어 이름
    role: string;           // 역할 (피아니스트, 바이올리니스트, 지휘자 등)
    roleEn: string;         // 영어 역할
    profileImage: string;   // 프로필 이미지 URL
    bio: string;            // 약력/소개
    bioEn: string;          // 영어 약력
    nationality: string;    // 국적
    likes: number;          // 좋아요 수
    performanceCount: number; // 공연 수
}

export interface CheerMessage {
    id: string;
    artistId: string;
    userId: string;
    userName: string;
    userProfileImage?: string;
    message: string;
    createdAt: string;      // ISO date string
}

// Open Opus API 타입
export interface OpenOpusComposer {
    id: string;
    name: string;           // 성 (예: Bach)
    complete_name: string;  // 풀네임 (예: Johann Sebastian Bach)
    birth: string;          // 생년 (예: 1685-01-01)
    death: string | null;   // 사망년 (null이면 생존)
    epoch: string;          // 시대 (예: Baroque, Classical, Romantic)
    portrait: string;       // 초상화 URL
}

export interface OpenOpusWork {
    id: string;
    title: string;          // 작품 제목
    subtitle: string;       // 부제
    searchterms: string;    // 검색 키워드
    popular: string;        // "1" 또는 "0"
    recommended: string;    // "1" 또는 "0"
    genre: string;          // 장르 (Orchestral, Chamber, Keyboard 등)
}

export interface OpenOpusComposerResponse {
    status: { success: string; rows: number };
    request: { type: string; item: string };
    composers: OpenOpusComposer[];
}

export interface OpenOpusWorkResponse {
    status: { success: string; rows: number };
    request: { type: string; item: string };
    composer: OpenOpusComposer;
    works: OpenOpusWork[];
}

// TheAudioDB API 타입
export interface AudioDBArtist {
    idArtist: string;
    strArtist: string;
    strArtistThumb: string | null;
    strBiographyKR: string | null;
    strBiographyEN: string | null;
    strCountry: string | null;
    strGenre: string | null;
    strStyle: string | null;
}

export interface AudioDBArtistResponse {
    artists: AudioDBArtist[] | null;
}

// YouTube Data API 타입
export interface YouTubeVideo {
    videoId: string;
    title: string;
    description: string;
    thumbnail: string;
    channelTitle: string;
    publishedAt: string;
}

// 공지사항 타입
export type NoticeBadge = '신규기능' | '기능개선' | '공지사항' | '긴급공지';

export interface Notice {
    id: number;
    title: string;
    content: string;
    badge: NoticeBadge;
    authorName: string;
    createdAt: string;
    views: number;
    thumbnail?: string;
}

// ── Phase 3: 콘텐츠 차별화 타입 ──

// 3.1 학습 허브 타입
export type DifficultyLevel = '입문' | '초급' | '중급' | '고급';

export interface WorkGuide {
    id: string;
    composerId: string;
    composerName: string;
    title: string;
    subtitle?: string;
    epoch: string;
    difficulty: DifficultyLevel;
    duration: string;
    genre: string;
    background: string;
    structure: string;
    listeningPoints: string[];
    youtubeVideoId?: string;
    thumbnail?: string;
}

export interface CuratedPlaylist {
    id: string;
    title: string;
    description: string;
    category: '입문' | '시대별' | '분위기별' | '장르별';
    thumbnail: string;
    tracks: PlaylistTrack[];
    createdAt: string;
}

export interface PlaylistTrack {
    id: string;
    composerName: string;
    title: string;
    performer?: string;
    duration: string;
    youtubeVideoId?: string;
    spotifyUrl?: string;
}

// 3.2 칼럼 & 인터뷰 타입
export type ColumnCategory = '인터뷰' | '공연비평' | '음반리뷰' | '에디터추천' | '유저기고';

export interface Column {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: ColumnCategory;
    authorName: string;
    authorRole?: string;
    authorImage?: string;
    thumbnail?: string;
    tags: string[];
    createdAt: string;
    views: number;
    likes: number;
    relatedPerformanceId?: string;
}

// 3.3 공연장 가이드 타입
export interface Venue {
    id: string;
    name: string;
    address: string;
    area: string;
    phone?: string;
    website?: string;
    thumbnail?: string;
    images: string[];
    totalSeats: number;
    halls: VenueHall[];
    nearbySpots: NearbySpot[];
    accessibility: AccessibilityInfo;
    transportInfo: string;
    parkingInfo: string;
}

export interface VenueHall {
    name: string;
    seats: number;
    description: string;
}

export interface NearbySpot {
    name: string;
    type: '맛집' | '카페' | '문화공간';
    distance: string;
    description: string;
    rating?: number;
}

export interface AccessibilityInfo {
    wheelchair: boolean;
    elevator: boolean;
    disabledParking: boolean;
    disabledRestroom: boolean;
    hearingAid: boolean;
    braille: boolean;
    notes?: string;
}

export interface VenueReview {
    id: string;
    venueId: string;
    userId: string;
    userName: string;
    seatInfo?: string;
    soundRating: number;
    viewRating: number;
    comfortRating: number;
    content: string;
    createdAt: string;
}

// 3.4 음반/음원 타입
export interface Album {
    id: string;
    title: string;
    artist: string;
    composerName?: string;
    label?: string;
    releaseDate: string;
    genre: string;
    coverImage?: string;
    trackCount: number;
    tracks: AlbumTrack[];
    averageRating: number;
    reviewCount: number;
    spotifyUrl?: string;
    appleMusicUrl?: string;
    youtubeMusicUrl?: string;
}

export interface AlbumTrack {
    number: number;
    title: string;
    duration: string;
}

export interface AlbumReview {
    id: string;
    albumId: string;
    userId: string;
    userName: string;
    rating: number;
    title: string;
    content: string;
    createdAt: string;
    likes: number;
}

// Wikipedia REST API Summary 타입
export interface WikiSummary {
    title: string;
    extract: string;
    thumbnail?: {
        source: string;
        width: number;
        height: number;
    };
    originalimage?: {
        source: string;
        width: number;
        height: number;
    };
}