import { create } from 'zustand';
import type { BadgeId, Badge, UserActivity, Notification } from '../types';

// 전체 배지 정의
export const ALL_BADGES: Badge[] = [
    {
        id: 'first_review',
        name: '첫 리뷰어',
        description: '첫 번째 공연 리뷰를 작성했습니다',
        icon: '✍️',
        color: 'bg-blue-100 text-blue-700',
    },
    {
        id: 'first_follow',
        name: '팬덤 시작',
        description: '첫 번째 아티스트를 팔로우했습니다',
        icon: '❤️',
        color: 'bg-pink-100 text-pink-700',
    },
    {
        id: 'review_10',
        name: '리뷰 10회',
        description: '공연 리뷰를 10회 작성했습니다',
        icon: '🌟',
        color: 'bg-yellow-100 text-yellow-700',
    },
    {
        id: 'review_50',
        name: '리뷰 50회',
        description: '공연 리뷰를 50회 작성했습니다',
        icon: '🏆',
        color: 'bg-amber-100 text-amber-700',
    },
    {
        id: 'follow_5',
        name: '음악 팬',
        description: '5명의 아티스트를 팔로우했습니다',
        icon: '🎵',
        color: 'bg-purple-100 text-purple-700',
    },
    {
        id: 'follow_10',
        name: '클래식 매니아',
        description: '10명의 아티스트를 팔로우했습니다',
        icon: '🎼',
        color: 'bg-violet-100 text-violet-700',
    },
    {
        id: 'post_10',
        name: '활발한 작가',
        description: '게시글을 10개 작성했습니다',
        icon: '📝',
        color: 'bg-green-100 text-green-700',
    },
    {
        id: 'best_reviewer',
        name: '베스트 리뷰어',
        description: '베스트 리뷰에 선정되었습니다',
        icon: '👑',
        color: 'bg-orange-100 text-orange-700',
    },
    {
        id: 'attendance_7',
        name: '7일 연속 방문',
        description: '7일 연속으로 방문했습니다',
        icon: '🔥',
        color: 'bg-red-100 text-red-700',
    },
    {
        id: 'attendance_30',
        name: '한달 개근',
        description: '30일 연속으로 방문했습니다',
        icon: '💎',
        color: 'bg-cyan-100 text-cyan-700',
    },
];

const ACTIVITY_KEY = 'classic-mania-user-activity';
const NOTIFICATIONS_KEY = 'classic-mania-notifications';

const defaultActivity = (userId: string): UserActivity => ({
    userId,
    reviewCount: 0,
    followCount: 0,
    postCount: 0,
    earnedBadges: [],
    followerIds: [],
    followingIds: [],
    genreStats: {},
    monthlyStats: {},
    areaStats: {},
    epochStats: {},
});

const loadActivity = (userId: string): UserActivity => {
    if (typeof window === 'undefined') return defaultActivity(userId);
    try {
        const saved = localStorage.getItem(ACTIVITY_KEY);
        const all: Record<string, UserActivity> = saved ? JSON.parse(saved) : {};
        return all[userId] || defaultActivity(userId);
    } catch {
        return defaultActivity(userId);
    }
};

const saveActivity = (activity: UserActivity) => {
    if (typeof window === 'undefined') return;
    try {
        const saved = localStorage.getItem(ACTIVITY_KEY);
        const all: Record<string, UserActivity> = saved ? JSON.parse(saved) : {};
        all[activity.userId] = activity;
        localStorage.setItem(ACTIVITY_KEY, JSON.stringify(all));
    } catch { /* ignore */ }
};

const loadNotifications = (): Notification[] => {
    if (typeof window === 'undefined') return [];
    try {
        const saved = localStorage.getItem(NOTIFICATIONS_KEY);
        return saved ? JSON.parse(saved) : getSampleNotifications();
    } catch {
        return getSampleNotifications();
    }
};

const saveNotifications = (notifications: Notification[]) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch { /* ignore */ }
};

function getSampleNotifications(): Notification[] {
    return [
        {
            id: 'notif-1',
            type: 'new_performance',
            title: '조성진 새 공연 등록!',
            body: '팔로우한 아티스트의 새 공연이 등록되었습니다: "조성진 피아노 리사이틀 2026"',
            link: '/performance',
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
            id: 'notif-2',
            type: 'new_follower',
            title: '새 팔로워',
            body: '클래식러버님이 회원님을 팔로우하기 시작했습니다',
            link: '/profile/mujuki',
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        {
            id: 'notif-3',
            type: 'post_reaction',
            title: '게시글에 반응',
            body: '회원님의 게시글 "2026 빈 필하모닉 내한 공연 후기"에 ❤️ 리액션이 달렸습니다',
            link: '/board/20',
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        },
    ];
}

// 배지 체크 로직
function checkBadges(activity: UserActivity): BadgeId[] {
    const earned = new Set(activity.earnedBadges);
    const newBadges: BadgeId[] = [];

    if (activity.reviewCount >= 1 && !earned.has('first_review')) newBadges.push('first_review');
    if (activity.followCount >= 1 && !earned.has('first_follow')) newBadges.push('first_follow');
    if (activity.reviewCount >= 10 && !earned.has('review_10')) newBadges.push('review_10');
    if (activity.reviewCount >= 50 && !earned.has('review_50')) newBadges.push('review_50');
    if (activity.followCount >= 5 && !earned.has('follow_5')) newBadges.push('follow_5');
    if (activity.followCount >= 10 && !earned.has('follow_10')) newBadges.push('follow_10');
    if (activity.postCount >= 10 && !earned.has('post_10')) newBadges.push('post_10');

    return newBadges;
}

interface UserStoreState {
    currentUserId: string;
    activity: UserActivity;
    notifications: Notification[];
    unreadCount: number;

    // 액션
    initUser: (userId: string) => void;
    recordReview: (performanceId: string, genre: string, area: string, month: string) => void;
    recordFollow: (artistId: string) => void;
    recordUnfollow: (artistId: string) => void;
    recordPost: () => void;
    recordEpochInteraction: (epoch: string) => void;
    awardBadge: (badgeId: BadgeId) => void;
    followUser: (targetUserId: string) => void;
    unfollowUser: (targetUserId: string) => void;
    isFollowingUser: (targetUserId: string) => boolean;
    getEarnedBadges: () => Badge[];
    getLockedBadges: () => Badge[];
    addNotification: (notif: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
    markNotificationRead: (id: string) => void;
    markAllRead: () => void;
    clearAllNotifications: () => void;
    getActivityByUserId: (userId: string) => UserActivity;
    getPreferredEpochs: () => string[];
}

export const useUserStore = create<UserStoreState>((set, get) => ({
    currentUserId: 'mujuki',
    activity: loadActivity('mujuki'),
    notifications: loadNotifications(),
    unreadCount: loadNotifications().filter((n) => !n.isRead).length,

    initUser: (userId) => {
        const activity = loadActivity(userId);
        set({ currentUserId: userId, activity });
    },

    recordReview: (performanceId, genre, area, month) => {
        const activity = { ...get().activity };
        activity.reviewCount += 1;
        if (genre) activity.genreStats[genre] = (activity.genreStats[genre] || 0) + 1;
        if (area) activity.areaStats[area] = (activity.areaStats[area] || 0) + 1;
        if (month) activity.monthlyStats[month] = (activity.monthlyStats[month] || 0) + 1;

        const newBadges = checkBadges(activity);
        activity.earnedBadges = [...activity.earnedBadges, ...newBadges];

        saveActivity(activity);
        set({ activity });
    },

    recordFollow: (artistId) => {
        const activity = { ...get().activity };
        if (!activity.followerIds) activity.followerIds = [];
        activity.followCount += 1;

        const newBadges = checkBadges(activity);
        activity.earnedBadges = [...activity.earnedBadges, ...newBadges];

        saveActivity(activity);
        set({ activity });
    },

    recordUnfollow: () => {
        const activity = { ...get().activity };
        activity.followCount = Math.max(0, activity.followCount - 1);
        saveActivity(activity);
        set({ activity });
    },

    recordPost: () => {
        const activity = { ...get().activity };
        activity.postCount += 1;

        const newBadges = checkBadges(activity);
        activity.earnedBadges = [...activity.earnedBadges, ...newBadges];

        saveActivity(activity);
        set({ activity });
    },

    recordEpochInteraction: (epoch) => {
        const activity = { ...get().activity };
        activity.epochStats[epoch] = (activity.epochStats[epoch] || 0) + 1;
        saveActivity(activity);
        set({ activity });
    },

    awardBadge: (badgeId) => {
        const activity = { ...get().activity };
        if (!activity.earnedBadges.includes(badgeId)) {
            activity.earnedBadges = [...activity.earnedBadges, badgeId];
            saveActivity(activity);
            set({ activity });
        }
    },

    followUser: (targetUserId) => {
        const activity = { ...get().activity };
        if (!activity.followingIds.includes(targetUserId)) {
            activity.followingIds = [...activity.followingIds, targetUserId];

            // 상대방 팔로워에도 추가
            const targetActivity = loadActivity(targetUserId);
            if (!targetActivity.followerIds.includes(get().currentUserId)) {
                targetActivity.followerIds = [...targetActivity.followerIds, get().currentUserId];
                saveActivity(targetActivity);
            }

            saveActivity(activity);
            set({ activity });
        }
    },

    unfollowUser: (targetUserId) => {
        const activity = { ...get().activity };
        activity.followingIds = activity.followingIds.filter((id) => id !== targetUserId);

        // 상대방 팔로워에서도 제거
        const targetActivity = loadActivity(targetUserId);
        targetActivity.followerIds = targetActivity.followerIds.filter(
            (id) => id !== get().currentUserId
        );
        saveActivity(targetActivity);

        saveActivity(activity);
        set({ activity });
    },

    isFollowingUser: (targetUserId) => {
        return get().activity.followingIds.includes(targetUserId);
    },

    getEarnedBadges: () => {
        const { earnedBadges } = get().activity;
        return ALL_BADGES.filter((b) => earnedBadges.includes(b.id));
    },

    getLockedBadges: () => {
        const { earnedBadges } = get().activity;
        return ALL_BADGES.filter((b) => !earnedBadges.includes(b.id));
    },

    addNotification: (notifData) => {
        const newNotif: Notification = {
            ...notifData,
            id: `notif-${Date.now()}`,
            createdAt: new Date().toISOString(),
            isRead: false,
        };
        const updated = [newNotif, ...get().notifications].slice(0, 50);
        saveNotifications(updated);
        set({ notifications: updated, unreadCount: updated.filter((n) => !n.isRead).length });
    },

    markNotificationRead: (id) => {
        const updated = get().notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
        );
        saveNotifications(updated);
        set({ notifications: updated, unreadCount: updated.filter((n) => !n.isRead).length });
    },

    markAllRead: () => {
        const updated = get().notifications.map((n: Notification) => ({ ...n, isRead: true }));
        saveNotifications(updated);
        set({ notifications: updated, unreadCount: 0 });
    },

    clearAllNotifications: () => {
        saveNotifications([]);
        set({ notifications: [], unreadCount: 0 });
    },

    getActivityByUserId: (userId) => {
        return loadActivity(userId);
    },

    getPreferredEpochs: () => {
        const { epochStats } = get().activity;
        return Object.entries(epochStats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([epoch]) => epoch);
    },
}));
