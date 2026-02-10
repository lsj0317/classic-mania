// src/types/index.ts
export interface User {
    userId: string;
    name: string;
    nickname?: string;
    profileImage?: string;
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