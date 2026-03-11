import { create } from 'zustand';
import type { CompanionPost, CompanionRequest, DirectMessage } from '../types';

const COMPANION_KEY = 'classic-mania-companion-posts';
const REQUESTS_KEY = 'classic-mania-companion-requests';
const DM_KEY = 'classic-mania-dm';

const MOCK_POSTS: CompanionPost[] = [
    {
        id: 5,
        performanceTitle: '2026 베를린 필하모닉 내한공연',
        performanceDate: '2026-03-20',
        venue: '롯데콘서트홀',
        area: '서울',
        title: '베를린 필 같이 가실 분 구해요 (R석)',
        content: '3월 20일 베를린 필하모닉 내한공연 R석 2자리 구매했는데 동행분 구합니다. 공연 전 저녁식사도 함께 할 수 있으면 좋겠어요. 클래식 좋아하시는 분이라면 연령대는 무관합니다!',
        authorId: 'user2',
        authorName: '클래식러버',
        preferGender: '무관',
        maxCompanions: 1,
        currentCompanions: 0,
        status: '모집중',
        createdAt: '2026-03-10',
        views: 128,
        ageRange: '무관',
    },
    {
        id: 4,
        performanceTitle: '조성진 피아노 리사이틀',
        performanceDate: '2026-04-05',
        venue: '예술의전당 콘서트홀',
        area: '서울',
        title: '조성진 리사이틀 함께 관람해요 (S석)',
        content: '4월 5일 조성진 리사이틀 S석 1장 여유가 생겼습니다. 같이 가실 20-30대 여성분 구합니다. 공연 후 간단한 후기 이야기도 나눌 수 있으면 좋겠어요.',
        authorId: 'user3',
        authorName: '피아노마니아',
        preferGender: '여성',
        maxCompanions: 1,
        currentCompanions: 1,
        status: '모집완료',
        createdAt: '2026-03-09',
        views: 245,
        ageRange: '20-30대',
    },
    {
        id: 3,
        performanceTitle: '서울시향 정기연주회',
        performanceDate: '2026-03-25',
        venue: '롯데콘서트홀',
        area: '서울',
        title: '서울시향 3월 정기연주회 동행 구합니다',
        content: '말러 교향곡 5번 프로그램입니다. 처음 클래식 공연 가보시는 분도 환영해요! 공연 전 홀 안내해드릴게요.',
        authorId: 'user5',
        authorName: '말러팬',
        preferGender: '무관',
        maxCompanions: 2,
        currentCompanions: 1,
        status: '모집중',
        createdAt: '2026-03-08',
        views: 87,
        ageRange: '무관',
    },
    {
        id: 2,
        performanceTitle: '부산시향 정기연주회',
        performanceDate: '2026-04-12',
        venue: '부산문화회관 대극장',
        area: '부산',
        title: '부산시향 4월 공연 같이 가요',
        content: '부산 거주하시는 분 우선입니다. 베토벤 교향곡 7번 프로그램이에요. 공연 전 남포동에서 밥 먹고 가면 좋을 것 같아요.',
        authorId: 'user6',
        authorName: '부산클래식',
        preferGender: '무관',
        maxCompanions: 3,
        currentCompanions: 2,
        status: '모집중',
        createdAt: '2026-03-07',
        views: 63,
        ageRange: '무관',
    },
    {
        id: 1,
        performanceTitle: '대구시향 신년음악회',
        performanceDate: '2026-03-15',
        venue: '대구콘서트하우스',
        area: '대구',
        title: '대구 신년음악회 동행 구합니다',
        content: '대구 지역 클래식 애호가분 계신가요? 같이 가실 분 연락주세요.',
        authorId: 'user7',
        authorName: '대구클래식맨',
        preferGender: '무관',
        maxCompanions: 1,
        currentCompanions: 0,
        status: '모집중',
        createdAt: '2026-03-06',
        views: 41,
        ageRange: '무관',
    },
];

const loadPosts = (): CompanionPost[] => {
    if (typeof window === 'undefined') return MOCK_POSTS;
    try {
        const saved = localStorage.getItem(COMPANION_KEY);
        return saved ? JSON.parse(saved) : MOCK_POSTS;
    } catch {
        return MOCK_POSTS;
    }
};

const savePosts = (posts: CompanionPost[]) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(COMPANION_KEY, JSON.stringify(posts));
    } catch { /* ignore */ }
};

const loadRequests = (): CompanionRequest[] => {
    if (typeof window === 'undefined') return [];
    try {
        const saved = localStorage.getItem(REQUESTS_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const saveRequests = (requests: CompanionRequest[]) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
    } catch { /* ignore */ }
};

const loadDMs = (): DirectMessage[] => {
    if (typeof window === 'undefined') return [];
    try {
        const saved = localStorage.getItem(DM_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const saveDMs = (dms: DirectMessage[]) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(DM_KEY, JSON.stringify(dms));
    } catch { /* ignore */ }
};

interface CompanionState {
    posts: CompanionPost[];
    requests: CompanionRequest[];
    dms: DirectMessage[];

    addPost: (post: Omit<CompanionPost, 'id' | 'createdAt' | 'views' | 'currentCompanions' | 'status'>) => void;
    incrementViews: (postId: number) => void;
    applyCompanion: (postId: number, userId: string, userName: string, message: string) => void;
    acceptRequest: (requestId: string, postId: number) => void;
    rejectRequest: (requestId: string) => void;
    getRequestsByPost: (postId: number) => CompanionRequest[];
    getUserRequests: (userId: string) => CompanionRequest[];
    sendDM: (senderId: string, senderName: string, receiverId: string, message: string) => void;
    getDMRoom: (userId1: string, userId2: string) => DirectMessage[];
    markAsRead: (roomId: string, userId: string) => void;
    getUnreadCount: (userId: string) => number;
}

export const useCompanionStore = create<CompanionState>((set, get) => ({
    posts: loadPosts(),
    requests: loadRequests(),
    dms: loadDMs(),

    addPost: (postData) => {
        const { posts } = get();
        const newPost: CompanionPost = {
            ...postData,
            id: (posts[0]?.id ?? 0) + 1,
            currentCompanions: 0,
            status: '모집중',
            createdAt: new Date().toISOString().split('T')[0],
            views: 0,
        };
        const updated = [newPost, ...posts];
        savePosts(updated);
        set({ posts: updated });
    },

    incrementViews: (postId) => {
        const { posts } = get();
        const updated = posts.map(p => p.id === postId ? { ...p, views: p.views + 1 } : p);
        savePosts(updated);
        set({ posts: updated });
    },

    applyCompanion: (postId, userId, userName, message) => {
        const { requests } = get();
        const existing = requests.find(r => r.postId === postId && r.userId === userId);
        if (existing) return;

        const newRequest: CompanionRequest = {
            id: `req-${Date.now()}`,
            postId,
            userId,
            userName,
            message,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        const updated = [...requests, newRequest];
        saveRequests(updated);
        set({ requests: updated });
    },

    acceptRequest: (requestId, postId) => {
        const { requests, posts } = get();
        const updatedRequests = requests.map(r =>
            r.id === requestId ? { ...r, status: 'accepted' as const } : r
        );
        const acceptedCount = updatedRequests.filter(r => r.postId === postId && r.status === 'accepted').length;
        const post = posts.find(p => p.id === postId);
        const updatedPosts = posts.map(p => {
            if (p.id !== postId) return p;
            const isFull = acceptedCount >= p.maxCompanions;
            return { ...p, currentCompanions: acceptedCount, status: isFull ? '모집완료' as const : '모집중' as const };
        });
        saveRequests(updatedRequests);
        savePosts(updatedPosts);
        set({ requests: updatedRequests, posts: updatedPosts });
    },

    rejectRequest: (requestId) => {
        const { requests } = get();
        const updated = requests.map(r =>
            r.id === requestId ? { ...r, status: 'rejected' as const } : r
        );
        saveRequests(updated);
        set({ requests: updated });
    },

    getRequestsByPost: (postId) => {
        return get().requests.filter(r => r.postId === postId);
    },

    getUserRequests: (userId) => {
        return get().requests.filter(r => r.userId === userId);
    },

    sendDM: (senderId, senderName, receiverId, message) => {
        const { dms } = get();
        const roomId = [senderId, receiverId].sort().join('-');
        const newDM: DirectMessage = {
            id: `dm-${Date.now()}`,
            roomId,
            senderId,
            senderName,
            receiverId,
            message,
            isRead: false,
            createdAt: new Date().toISOString(),
        };
        const updated = [...dms, newDM];
        saveDMs(updated);
        set({ dms: updated });
    },

    getDMRoom: (userId1, userId2) => {
        const roomId = [userId1, userId2].sort().join('-');
        return get().dms.filter(dm => dm.roomId === roomId);
    },

    markAsRead: (roomId, userId) => {
        const { dms } = get();
        const updated = dms.map(dm =>
            dm.roomId === roomId && dm.receiverId === userId ? { ...dm, isRead: true } : dm
        );
        saveDMs(updated);
        set({ dms: updated });
    },

    getUnreadCount: (userId) => {
        return get().dms.filter(dm => dm.receiverId === userId && !dm.isRead).length;
    },
}));
