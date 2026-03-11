import { create } from 'zustand';
import type { LiveChatMessage, PostReactions, Reaction } from '../types';

const REACTIONS_KEY = 'classic-mania-reactions';
const CHAT_KEY = 'classic-mania-livechat';
const VIEWER_KEY = 'classic-mania-viewers';

const DEFAULT_EMOJIS: Array<{ emoji: string; label: string }> = [
    { emoji: '❤️', label: '좋아요' },
    { emoji: '🔥', label: '뜨거워' },
    { emoji: '👏', label: '박수' },
    { emoji: '😢', label: '감동' },
    { emoji: '🎵', label: '음악' },
];

const loadReactions = (): Record<number, Record<string, number>> => {
    if (typeof window === 'undefined') return {};
    try {
        const saved = localStorage.getItem(REACTIONS_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch {
        return {};
    }
};

const saveReactions = (data: Record<number, Record<string, number>>) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(REACTIONS_KEY, JSON.stringify(data));
    } catch { /* ignore */ }
};

// 사용자가 이미 누른 리액션 추적
const USER_REACTIONS_KEY = 'classic-mania-user-reactions';
const loadUserReactions = (): Record<string, string[]> => {
    if (typeof window === 'undefined') return {};
    try {
        const saved = localStorage.getItem(USER_REACTIONS_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch {
        return {};
    }
};
const saveUserReactions = (data: Record<string, string[]>) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(USER_REACTIONS_KEY, JSON.stringify(data));
    } catch { /* ignore */ }
};

const loadChatMessages = (performanceId: string): LiveChatMessage[] => {
    if (typeof window === 'undefined') return [];
    try {
        const saved = localStorage.getItem(`${CHAT_KEY}-${performanceId}`);
        return saved ? JSON.parse(saved) : getInitialChatMessages(performanceId);
    } catch {
        return [];
    }
};

const saveChatMessages = (performanceId: string, messages: LiveChatMessage[]) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(`${CHAT_KEY}-${performanceId}`, JSON.stringify(messages.slice(-100)));
    } catch { /* ignore */ }
};

function getInitialChatMessages(performanceId: string): LiveChatMessage[] {
    return [
        {
            id: 'chat-1',
            performanceId,
            userId: 'user2',
            userName: '클래식러버',
            message: '오늘 공연 정말 기대됩니다! 🎵',
            createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        },
        {
            id: 'chat-2',
            performanceId,
            userId: 'user3',
            userName: '음악학도',
            message: '저도 지금 공연장 도착했어요!',
            createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        },
        {
            id: 'chat-3',
            performanceId,
            userId: 'user4',
            userName: '피아노마니아',
            message: '1악장부터 전율이 느껴지네요 ✨',
            createdAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
        },
    ];
}

// 공연별 가상 시청자 수
const getViewerCount = (performanceId: string): number => {
    if (typeof window === 'undefined') return 0;
    try {
        const saved = localStorage.getItem(`${VIEWER_KEY}-${performanceId}`);
        if (saved) return JSON.parse(saved);
        // 초기값: 랜덤 (12~87)
        const count = Math.floor(Math.random() * 75) + 12;
        localStorage.setItem(`${VIEWER_KEY}-${performanceId}`, JSON.stringify(count));
        return count;
    } catch {
        return 0;
    }
};

interface CommunityState {
    // 이모지 리액션 (postId -> emoji -> count)
    reactions: Record<number, Record<string, number>>;
    userReactions: Record<string, string[]>; // `${postId}-${userId}` -> emoji[]

    // 라이브 채팅
    chatMessages: LiveChatMessage[];
    activeChatPerformanceId: string | null;
    viewerCount: number;

    // 액션
    getReactions: (postId: number, userId: string) => PostReactions;
    toggleReaction: (postId: number, userId: string, emoji: string) => void;
    loadChat: (performanceId: string) => void;
    sendChatMessage: (performanceId: string, userId: string, userName: string, userProfileImage: string | undefined, message: string) => void;
    refreshViewerCount: (performanceId: string) => void;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
    reactions: loadReactions(),
    userReactions: loadUserReactions(),
    chatMessages: [],
    activeChatPerformanceId: null,
    viewerCount: 0,

    getReactions: (postId, userId) => {
        const { reactions, userReactions } = get();
        const postReactions = reactions[postId] || {};
        const key = `${postId}-${userId}`;
        const userEmojis = userReactions[key] || [];

        return {
            postId,
            reactions: DEFAULT_EMOJIS.map(({ emoji, label }) => ({
                emoji,
                label,
                count: postReactions[emoji] || 0,
                reactedByCurrentUser: userEmojis.includes(emoji),
            })),
        };
    },

    toggleReaction: (postId, userId, emoji) => {
        const { reactions, userReactions } = get();
        const postReactions = { ...(reactions[postId] || {}) };
        const key = `${postId}-${userId}`;
        const userEmojis = [...(userReactions[key] || [])];

        if (userEmojis.includes(emoji)) {
            // 이미 눌렀으면 취소
            postReactions[emoji] = Math.max(0, (postReactions[emoji] || 1) - 1);
            const idx = userEmojis.indexOf(emoji);
            userEmojis.splice(idx, 1);
        } else {
            // 새로 추가
            postReactions[emoji] = (postReactions[emoji] || 0) + 1;
            userEmojis.push(emoji);
        }

        const newReactions = { ...reactions, [postId]: postReactions };
        const newUserReactions = { ...userReactions, [key]: userEmojis };

        saveReactions(newReactions);
        saveUserReactions(newUserReactions);
        set({ reactions: newReactions, userReactions: newUserReactions });
    },

    loadChat: (performanceId) => {
        const messages = loadChatMessages(performanceId);
        const viewerCount = getViewerCount(performanceId);
        set({ chatMessages: messages, activeChatPerformanceId: performanceId, viewerCount });
    },

    sendChatMessage: (performanceId, userId, userName, userProfileImage, message) => {
        const newMsg: LiveChatMessage = {
            id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            performanceId,
            userId,
            userName,
            userProfileImage,
            message,
            createdAt: new Date().toISOString(),
        };

        const updated = [...get().chatMessages, newMsg];
        saveChatMessages(performanceId, updated);
        set({ chatMessages: updated });
    },

    refreshViewerCount: (performanceId) => {
        if (typeof window === 'undefined') return;
        try {
            const base = getViewerCount(performanceId);
            // ±3 정도 랜덤 변화 (실시간 느낌)
            const delta = Math.floor(Math.random() * 7) - 3;
            const newCount = Math.max(1, base + delta);
            localStorage.setItem(`${VIEWER_KEY}-${performanceId}`, JSON.stringify(newCount));
            set({ viewerCount: newCount });
        } catch { /* ignore */ }
    },
}));
