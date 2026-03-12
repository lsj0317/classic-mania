import { create } from 'zustand';
import { fetchNews, type NewsItem } from '../api/newsApi';

interface NewsState {
    newsList: NewsItem[];
    loading: boolean;
    error: string | null;
    keyword: string;
    currentPage: number;
    totalResults: number;
    sortBy: string; // 'sim' (정확도순) or 'date' (최신순)
    lastFetched: number; // 마지막으로 데이터를 가져온 시간 (Timestamp)
    selectedNews: NewsItem | null; // NewsDetail 데이터 전달용

    // Actions
    fetchNewsList: () => Promise<void>;
    setKeyword: (keyword: string) => void;
    setCurrentPage: (page: number) => void;
    setSortBy: (sort: string) => void;
    setSelectedNews: (news: NewsItem | null) => void;
}

export const useNewsStore = create<NewsState>((set, get) => ({
    newsList: [],
    loading: false,
    error: null,
    keyword: '클래식 공연',
    currentPage: 1,
    totalResults: 0,
    sortBy: 'sim',
    lastFetched: 0,
    selectedNews: null,

    fetchNewsList: async () => {
        const { keyword, currentPage, sortBy } = get();

        set({ loading: true, error: null });

        try {
            // 네이버 API start 파라미터 계산 (1, 11, 21...)
            const start = (currentPage - 1) * 10 + 1;
            const data = await fetchNews(keyword, start, 10, sortBy);
            
            set({ 
                newsList: data.items, 
                totalResults: data.total,
                loading: false,
                lastFetched: Date.now()
            });
        } catch {
            set({ 
                loading: false, 
                error: '뉴스를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' 
            });
        }
    },

    setKeyword: (keyword) => set({ keyword, currentPage: 1 }), // 검색어 변경 시 1페이지로
    setCurrentPage: (page) => set({ currentPage: page }),
    setSortBy: (sort) => set({ sortBy: sort, currentPage: 1 }),
    setSelectedNews: (news) => set({ selectedNews: news }),
}));
