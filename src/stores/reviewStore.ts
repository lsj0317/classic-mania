import { create } from 'zustand';

export interface Review {
    id: string;
    performanceId: string;
    userId: string;
    userName: string;
    userProfileImage?: string;
    rating: number;          // 1~5
    content: string;
    createdAt: string;       // ISO date string
    likes: number;
}

interface ReviewState {
    reviews: Review[];

    // 액션
    addReview: (review: Omit<Review, 'id' | 'createdAt' | 'likes'>) => void;
    deleteReview: (reviewId: string) => void;
    toggleLike: (reviewId: string) => void;
    getReviewsByPerformance: (performanceId: string) => Review[];
    getAverageRating: (performanceId: string) => number;
    getBestReview: (performanceId: string) => Review | null;
}

// localStorage 키
const STORAGE_KEY = 'classic-mania-reviews';

const loadReviews = (): Review[] => {
    if (typeof window === 'undefined') return [];
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : getInitialReviews();
    } catch {
        return getInitialReviews();
    }
};

const saveReviews = (reviews: Review[]) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch {
        // localStorage 용량 초과 등
    }
};

// 초기 샘플 리뷰 데이터
function getInitialReviews(): Review[] {
    return [
        {
            id: 'review-1',
            performanceId: 'PF254931',
            userId: 'user2',
            userName: '클래식러버',
            rating: 5,
            content: '정말 감동적인 공연이었습니다. 오케스트라의 앙상블이 완벽했고, 특히 2악장에서의 섬세한 표현이 인상적이었어요.',
            createdAt: '2026-01-15T14:30:00Z',
            likes: 12,
        },
        {
            id: 'review-2',
            performanceId: 'PF254931',
            userId: 'user3',
            userName: '음악학도',
            rating: 4,
            content: '전체적으로 훌륭했지만, 음향이 조금 아쉬웠습니다. 그래도 연주자들의 열정이 느껴지는 좋은 공연이었습니다.',
            createdAt: '2026-01-16T09:15:00Z',
            likes: 5,
        },
        {
            id: 'review-3',
            performanceId: 'PF254931',
            userId: 'user5',
            userName: '피아노마니아',
            rating: 5,
            content: '솔리스트의 연주가 압권이었습니다! 앙코르까지 완벽한 밤이었어요.',
            createdAt: '2026-01-17T20:00:00Z',
            likes: 8,
        },
    ];
}

export const useReviewStore = create<ReviewState>((set, get) => ({
    reviews: loadReviews(),

    addReview: (reviewData) => {
        const newReview: Review = {
            ...reviewData,
            id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            createdAt: new Date().toISOString(),
            likes: 0,
        };
        set((state) => {
            const updated = [newReview, ...state.reviews];
            saveReviews(updated);
            return { reviews: updated };
        });
    },

    deleteReview: (reviewId) => {
        set((state) => {
            const updated = state.reviews.filter((r) => r.id !== reviewId);
            saveReviews(updated);
            return { reviews: updated };
        });
    },

    toggleLike: (reviewId) => {
        set((state) => {
            const updated = state.reviews.map((r) =>
                r.id === reviewId ? { ...r, likes: r.likes + 1 } : r
            );
            saveReviews(updated);
            return { reviews: updated };
        });
    },

    getReviewsByPerformance: (performanceId) => {
        return get().reviews
            .filter((r) => r.performanceId === performanceId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },

    getAverageRating: (performanceId) => {
        const reviews = get().reviews.filter((r) => r.performanceId === performanceId);
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        return sum / reviews.length;
    },

    getBestReview: (performanceId) => {
        const reviews = get().reviews.filter((r) => r.performanceId === performanceId);
        if (reviews.length === 0) return null;
        // 베스트 리뷰: 좋아요 수 기준, 동률이면 높은 별점 우선
        return reviews.reduce((best, current) => {
            if (current.likes > best.likes) return current;
            if (current.likes === best.likes && current.rating > best.rating) return current;
            return best;
        });
    },
}));
