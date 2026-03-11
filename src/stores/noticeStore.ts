import { create } from 'zustand';
import type { Notice } from '../types';
import { notices as dummyNotices } from '../data/noticeData';

interface NoticeState {
    notices: Notice[];
    loading: boolean;
    error: string | null;
    fetchNotices: () => void;
    getNoticeById: (id: number) => Notice | undefined;
    incrementViews: (id: number) => void;
}

export const useNoticeStore = create<NoticeState>((set, get) => ({
    notices: [],
    loading: false,
    error: null,

    fetchNotices: () => {
        set({ loading: true, error: null });
        // 현재는 더미 데이터 사용, 추후 DB 연결 시 API 호출로 대체
        set({ notices: dummyNotices, loading: false });
    },

    getNoticeById: (id: number) => {
        return get().notices.find(n => n.id === id);
    },

    incrementViews: (id: number) => {
        set(state => ({
            notices: state.notices.map(n =>
                n.id === id ? { ...n, views: n.views + 1 } : n
            )
        }));
    },
}));
