import { create } from 'zustand';
import type { Performance } from '../types';
import { fetchKopisPerformances, fetchKopisPerformanceDetail } from '../api/kopisApi';
import { performanceData } from '../data/performanceData';

interface PerformanceState {
    // 목록 데이터
    performances: Performance[];
    listFetched: boolean;
    listLoading: boolean;
    listError: string | null;

    // 상세 캐시 (ID → Performance)
    detailCache: Record<string, Performance>;
    detailLoading: boolean;
    detailError: string | null;

    // 필터 / 페이징 상태 (뒤로가기 시 유지)
    selectedTab: string;
    selectedArea: string;
    searchTerm: string;
    currentPage: number;

    // 액션
    fetchList: () => Promise<void>;
    fetchDetail: (id: string) => Promise<void>;
    setSelectedTab: (tab: string) => void;
    setSelectedArea: (area: string) => void;
    setSearchTerm: (term: string) => void;
    setCurrentPage: (page: number) => void;
}

export const usePerformanceStore = create<PerformanceState>((set, get) => ({
    // 초기 상태
    performances: [],
    listFetched: false,
    listLoading: false,
    listError: null,

    detailCache: {},
    detailLoading: false,
    detailError: null,

    selectedTab: '전체',
    selectedArea: '전체 지역',
    searchTerm: '',
    currentPage: 1,

    // 목록 조회 (이미 fetch 했으면 스킵)
    fetchList: async () => {
        if (get().listFetched) return;

        set({ listLoading: true, listError: null });
        try {
            const data = await fetchKopisPerformances();
            set({ performances: data, listFetched: true, listLoading: false });
        } catch (err) {
            console.error('API 실패, 더미 데이터로 대체:', err);
            set({
                performances: performanceData,
                listFetched: true,
                listLoading: false,
                listError: 'API 연동에 실패하여 샘플 데이터를 표시합니다.',
            });
        }
    },

    // 상세 조회 (캐시에 있으면 스킵)
    fetchDetail: async (id: string) => {
        if (get().detailCache[id]) return;

        set({ detailLoading: true, detailError: null });
        try {
            const data = await fetchKopisPerformanceDetail(id);
            if (data) {
                set((state) => ({
                    detailCache: { ...state.detailCache, [id]: data },
                    detailLoading: false,
                }));
            } else {
                // API에서 못 찾으면 더미 데이터 fallback
                const fallback = performanceData.find((p) => p.id === id);
                if (fallback) {
                    set((state) => ({
                        detailCache: { ...state.detailCache, [id]: fallback },
                        detailLoading: false,
                        detailError: 'API에서 상세 정보를 찾을 수 없어 샘플 데이터를 표시합니다.',
                    }));
                } else {
                    set({ detailLoading: false, detailError: '공연 정보를 찾을 수 없습니다.' });
                }
            }
        } catch (err) {
            console.error('상세 API 실패, 더미 데이터로 대체:', err);
            const fallback = performanceData.find((p) => p.id === id);
            if (fallback) {
                set((state) => ({
                    detailCache: { ...state.detailCache, [id]: fallback },
                    detailLoading: false,
                    detailError: 'API 연동에 실패하여 샘플 데이터를 표시합니다.',
                }));
            } else {
                set({ detailLoading: false, detailError: '공연 정보를 불러올 수 없습니다.' });
            }
        }
    },

    setSelectedTab: (tab) => set({ selectedTab: tab, currentPage: 1 }),
    setSelectedArea: (area) => set({ selectedArea: area, currentPage: 1 }),
    setSearchTerm: (term) => set({ searchTerm: term, currentPage: 1 }),
    setCurrentPage: (page) => set({ currentPage: page }),
}));
