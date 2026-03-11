import { create } from 'zustand';
import type { Column, ColumnCategory } from '../types';
import { columnData } from '../data/columnData';

interface ColumnState {
    columns: Column[];
    loading: boolean;
    fetchData: () => void;
    getColumnById: (id: string) => Column | undefined;
    getColumnsByCategory: (category: ColumnCategory) => Column[];
    incrementViews: (id: string) => void;
    toggleLike: (id: string) => void;
}

export const useColumnStore = create<ColumnState>((set, get) => ({
    columns: [],
    loading: false,

    fetchData: () => {
        set({ columns: columnData, loading: false });
    },

    getColumnById: (id) => get().columns.find(c => c.id === id),

    getColumnsByCategory: (category) => get().columns.filter(c => c.category === category),

    incrementViews: (id) => {
        set(state => ({
            columns: state.columns.map(c => c.id === id ? { ...c, views: c.views + 1 } : c),
        }));
    },

    toggleLike: (id) => {
        set(state => ({
            columns: state.columns.map(c => c.id === id ? { ...c, likes: c.likes + 1 } : c),
        }));
    },
}));
