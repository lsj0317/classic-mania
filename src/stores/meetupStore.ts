import { create } from 'zustand';
import type { Meetup, MeetupComment } from '../types';

const MEETUP_KEY = 'classic-mania-meetups';
const MEETUP_COMMENTS_KEY = 'classic-mania-meetup-comments';

const MOCK_MEETUPS: Meetup[] = [
    {
        id: 6,
        title: '말러 교향곡 전집 감상 모임',
        description: '말러의 교향곡을 순서대로 함께 감상하는 정기 모임입니다. 매월 2회 진행하며 음반과 영상을 함께 보고 이야기 나눕니다. 말러를 처음 접하시는 분도 환영합니다!',
        type: '정기모임',
        status: '모집중',
        hostId: 'user2',
        hostName: '클래식러버',
        location: '서울 마포구 합정동 카페 (상세 주소는 참여 확정 후 안내)',
        area: '서울',
        meetDate: '2026-03-22',
        meetTime: '14:00',
        maxMembers: 10,
        currentMembers: 6,
        memberIds: ['user2', 'user3', 'user4', 'user5', 'user6', 'user7'],
        genre: '말러 / 후기 낭만',
        createdAt: '2026-03-01',
        isOnline: false,
    },
    {
        id: 5,
        title: '온라인 베토벤 후기 3인방 감상회',
        description: '베토벤 후기 피아노 소나타(30, 31, 32번)를 함께 감상합니다. 화상 채팅으로 진행되며 각자 좋아하는 연주자 음반을 소개합니다.',
        type: '온라인',
        status: '모집중',
        hostId: 'user3',
        hostName: '피아노마니아',
        location: '온라인 (Zoom)',
        area: '전국',
        meetDate: '2026-03-18',
        meetTime: '20:00',
        maxMembers: 8,
        currentMembers: 4,
        memberIds: ['user3', 'user4', 'user5', 'user8'],
        genre: '베토벤 / 피아노 소나타',
        createdAt: '2026-03-05',
        isOnline: true,
    },
    {
        id: 4,
        title: '조성진 리사이틀 후 번개 뒤풀이',
        description: '4월 5일 조성진 리사이틀 관람 후 근처에서 가볍게 뒤풀이 하실 분 모집합니다. 공연 후기 이야기하며 클래식 친구 사귀어요!',
        type: '번개',
        status: '모집중',
        hostId: 'mujuki',
        hostName: '이서준',
        location: '예술의전당 인근 (정확한 장소 추후 공지)',
        area: '서울',
        meetDate: '2026-04-05',
        meetTime: '21:30',
        maxMembers: 15,
        currentMembers: 7,
        memberIds: ['mujuki', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7'],
        genre: '쇼팽 / 슈만',
        createdAt: '2026-03-08',
        isOnline: false,
    },
    {
        id: 3,
        title: '클래식 입문자 모임 - 함께 공부해요',
        description: '클래식을 배우고 싶지만 어디서 시작할지 모르는 분들을 위한 모임입니다. 매주 토요일 기초 음악 이론과 추천 음반을 함께 공부합니다.',
        type: '정기모임',
        status: '모집중',
        hostId: 'user5',
        hostName: '루시에',
        location: '서울 강남구 (정확한 장소 신청 후 안내)',
        area: '서울',
        meetDate: '2026-03-15',
        meetTime: '13:00',
        maxMembers: 12,
        currentMembers: 9,
        memberIds: ['user5', 'user6', 'user7', 'user8', 'user9', 'user10', 'user11', 'user12', 'user13'],
        genre: '클래식 전반',
        createdAt: '2026-02-28',
        isOnline: false,
    },
    {
        id: 2,
        title: '부산 클래식 팬 정기모임',
        description: '부산 지역 클래식 애호가 모임입니다. 매월 첫째 주 토요일에 음반 감상과 공연 정보를 나눕니다.',
        type: '정기모임',
        status: '모집중',
        hostId: 'user6',
        hostName: '부산클래식',
        location: '부산 해운대구',
        area: '부산',
        meetDate: '2026-04-04',
        meetTime: '15:00',
        maxMembers: 20,
        currentMembers: 12,
        memberIds: ['user6', 'user7', 'user8', 'user9', 'user10', 'user11', 'user12', 'user13', 'user14', 'user15', 'user16', 'user17'],
        genre: '클래식 전반',
        createdAt: '2026-02-20',
        isOnline: false,
    },
    {
        id: 1,
        title: '온라인 오페라 감상 모임',
        description: '매주 금요일 밤, 온라인으로 오페라 영상을 함께 봅니다. 바그너, 베르디, 모차르트 등 다양한 작품을 다룹니다.',
        type: '온라인',
        status: '모집완료',
        hostId: 'user4',
        hostName: '오페라광',
        location: '온라인 (Discord)',
        area: '전국',
        meetDate: '2026-03-14',
        meetTime: '21:00',
        maxMembers: 6,
        currentMembers: 6,
        memberIds: ['user4', 'user2', 'user3', 'user5', 'user6', 'user7'],
        genre: '오페라',
        createdAt: '2026-02-15',
        isOnline: true,
    },
];

const loadMeetups = (): Meetup[] => {
    if (typeof window === 'undefined') return MOCK_MEETUPS;
    try {
        const saved = localStorage.getItem(MEETUP_KEY);
        return saved ? JSON.parse(saved) : MOCK_MEETUPS;
    } catch {
        return MOCK_MEETUPS;
    }
};

const saveMeetups = (meetups: Meetup[]) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(MEETUP_KEY, JSON.stringify(meetups));
    } catch { /* ignore */ }
};

const loadComments = (): MeetupComment[] => {
    if (typeof window === 'undefined') return [];
    try {
        const saved = localStorage.getItem(MEETUP_COMMENTS_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const saveComments = (comments: MeetupComment[]) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(MEETUP_COMMENTS_KEY, JSON.stringify(comments));
    } catch { /* ignore */ }
};

interface MeetupState {
    meetups: Meetup[];
    comments: MeetupComment[];

    addMeetup: (meetup: Omit<Meetup, 'id' | 'createdAt' | 'currentMembers' | 'memberIds' | 'status'>) => void;
    joinMeetup: (meetupId: number, userId: string) => void;
    leaveMeetup: (meetupId: number, userId: string) => void;
    getMeetupById: (id: number) => Meetup | undefined;
    addComment: (meetupId: number, userId: string, userName: string, content: string) => void;
    getCommentsByMeetup: (meetupId: number) => MeetupComment[];
    deleteComment: (commentId: string, userId: string) => void;
}

export const useMeetupStore = create<MeetupState>((set, get) => ({
    meetups: loadMeetups(),
    comments: loadComments(),

    addMeetup: (meetupData) => {
        const { meetups } = get();
        const newMeetup: Meetup = {
            ...meetupData,
            id: (meetups[0]?.id ?? 0) + 1,
            currentMembers: 1,
            memberIds: [meetupData.hostId],
            status: '모집중',
            createdAt: new Date().toISOString().split('T')[0],
        };
        const updated = [newMeetup, ...meetups];
        saveMeetups(updated);
        set({ meetups: updated });
    },

    joinMeetup: (meetupId, userId) => {
        const { meetups } = get();
        const updated = meetups.map(m => {
            if (m.id !== meetupId || m.memberIds.includes(userId)) return m;
            const newMemberIds = [...m.memberIds, userId];
            const isFull = newMemberIds.length >= m.maxMembers;
            return {
                ...m,
                memberIds: newMemberIds,
                currentMembers: newMemberIds.length,
                status: isFull ? '모집완료' as const : '모집중' as const,
            };
        });
        saveMeetups(updated);
        set({ meetups: updated });
    },

    leaveMeetup: (meetupId, userId) => {
        const { meetups } = get();
        const updated = meetups.map(m => {
            if (m.id !== meetupId || !m.memberIds.includes(userId)) return m;
            const newMemberIds = m.memberIds.filter(id => id !== userId);
            return {
                ...m,
                memberIds: newMemberIds,
                currentMembers: newMemberIds.length,
                status: '모집중' as const,
            };
        });
        saveMeetups(updated);
        set({ meetups: updated });
    },

    getMeetupById: (id) => {
        return get().meetups.find(m => m.id === id);
    },

    addComment: (meetupId, userId, userName, content) => {
        const { comments } = get();
        const newComment: MeetupComment = {
            id: `mc-${Date.now()}`,
            meetupId,
            userId,
            userName,
            content,
            createdAt: new Date().toISOString(),
        };
        const updated = [...comments, newComment];
        saveComments(updated);
        set({ comments: updated });
    },

    getCommentsByMeetup: (meetupId) => {
        return get().comments.filter(c => c.meetupId === meetupId);
    },

    deleteComment: (commentId, userId) => {
        const { comments } = get();
        const updated = comments.filter(c => !(c.id === commentId && c.userId === userId));
        saveComments(updated);
        set({ comments: updated });
    },
}));
