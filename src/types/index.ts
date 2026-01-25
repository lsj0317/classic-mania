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