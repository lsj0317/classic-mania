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

export interface Performance {
    id: number;
    title: string;        // 공연 제목
    place: string;        // 공연장 명칭
    period: string;       // 공연 기간
    area: string;         // 지역 (서울, 부산, 경기 등)
    status: "예매중" | "공연종료" | "예정"; // 공연 상태
    poster?: string;      // 포스터 이미지 URL (선택 사항)
    price?: string;       // 가격 정보
    bookingUrl?: string;  // 예매 링크
    lat: number;          // 지도 표시용 위도
    lng: number;          // 지도 표시용 경도
}