import { create } from 'zustand';
import type { Column, ColumnCategory } from '../types';
import { columnData } from '../data/columnData';

interface ColumnState {
    columns: Column[];
    loading: boolean;
    /** 현재 사용자가 좋아요한 칼럼 ID */
    likedIds: string[];
    fetchData: () => void;
    getColumnById: (id: string) => Column | undefined;
    getColumnsByCategory: (category: ColumnCategory) => Column[];
    incrementViews: (id: string) => void;
    /** 좋아요 토글 (한 사용자당 한 번) */
    toggleLike: (id: string) => void;
}

// 조회수 증가분과 좋아요 여부를 브라우저에 저장 (DB 연동 전까지)
const STATS_KEY = 'classic-mania-column-stats';

type ColumnStats = Record<string, { viewsDelta: number; liked: boolean }>;

const loadStats = (): ColumnStats => {
    if (typeof window === 'undefined') return {};
    try {
        const saved = localStorage.getItem(STATS_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch {
        return {};
    }
};

const saveStats = (stats: ColumnStats) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch { /* ignore */ }
};

const updateStats = (id: string, patch: (prev: { viewsDelta: number; liked: boolean }) => { viewsDelta: number; liked: boolean }) => {
    const stats = loadStats();
    stats[id] = patch(stats[id] ?? { viewsDelta: 0, liked: false });
    saveStats(stats);
};

export const useColumnStore = create<ColumnState>((set, get) => ({
    columns: [],
    loading: false,
    likedIds: [],

    // 클라이언트 이펙트에서 호출되므로 localStorage를 읽어도 하이드레이션에 영향이 없다.
    fetchData: () => {
        const stats = loadStats();
        set({
            columns: columnData.map(c => {
                const s = stats[c.id];
                if (!s) return c;
                return { ...c, views: c.views + s.viewsDelta, likes: c.likes + (s.liked ? 1 : 0) };
            }),
            likedIds: Object.entries(stats).filter(([, s]) => s.liked).map(([id]) => id),
            loading: false,
        });
    },

    getColumnById: (id) => get().columns.find(c => c.id === id),

    getColumnsByCategory: (category) => get().columns.filter(c => c.category === category),

    incrementViews: (id) => {
        updateStats(id, s => ({ ...s, viewsDelta: s.viewsDelta + 1 }));
        set(state => ({
            columns: state.columns.map(c => c.id === id ? { ...c, views: c.views + 1 } : c),
        }));
    },

    toggleLike: (id) => {
        const liked = get().likedIds.includes(id);
        updateStats(id, s => ({ ...s, liked: !liked }));
        set(state => ({
            likedIds: liked ? state.likedIds.filter(x => x !== id) : [...state.likedIds, id],
            columns: state.columns.map(c => c.id === id ? { ...c, likes: c.likes + (liked ? -1 : 1) } : c),
        }));
    },
}));
