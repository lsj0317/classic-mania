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

    // Actions
    fetchNewsList: () => Promise<void>;
    setKeyword: (keyword: string) => void;
    setCurrentPage: (page: number) => void;
    setSortBy: (sort: string) => void;
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

    fetchNewsList: async () => {
        const { keyword, currentPage, sortBy, lastFetched, newsList } = get();
        
        // 캐싱 로직: 
        // 1. 이미 데이터가 있고 (newsList.length > 0)
        // 2. 마지막 요청으로부터 1시간(3600000ms)이 지나지 않았으며
        // 3. 페이지나 검색어, 정렬 조건이 변경되지 않았을 때 (이 부분은 컴포넌트 레벨에서 제어하거나, 상태 변경 시 lastFetched를 초기화하는 방식으로 처리)
        // 여기서는 단순하게 "같은 조건일 때 재요청 방지"보다는 "시간 기반 캐싱"을 적용하되,
        // 페이지네이션이나 검색어 변경 시에는 무조건 새로 요청해야 하므로,
        // setKeyword, setCurrentPage 등에서 lastFetched를 초기화하지 않고,
        // fetchNewsList 호출 시점에 판단하기 어렵기 때문에
        // "상세 페이지 갔다가 돌아왔을 때"를 위해, 데이터가 이미 존재하면 재요청을 하지 않도록 함.
        // 단, 사용자가 명시적으로 검색하거나 페이지를 이동했을 때는 호출해야 함.
        
        // 하지만 Zustand 구조상 fetchNewsList는 컴포넌트의 useEffect에서 호출됨.
        // 따라서 "조건이 바뀌었을 때만" 호출되도록 useEffect 의존성을 설정하는 것이 맞음.
        // 여기서는 "데이터가 이미 있고, 로딩 중이 아니면" 스킵하는 로직을 추가할 수도 있지만,
        // 페이지 이동 시에는 데이터가 달라져야 하므로 무조건 스킵하면 안 됨.
        
        // 해결책:
        // 컴포넌트에서 useEffect(() => { fetchNewsList() }, [currentPage, keyword, sortBy]) 로 호출하고 있음.
        // 따라서 스토어에서는 "현재 상태와 동일한 요청"인지를 판단하기 어려움.
        // 대신, "상세 페이지 갔다가 뒤로가기" 시에는 컴포넌트가 다시 마운트되더라도
        // Zustand 상태(newsList)는 유지됨.
        // 따라서 컴포넌트 마운트 시점에 "이미 데이터가 있으면 fetch를 스킵"하는 로직을 추가하면 됨.
        // 단, 페이지/검색어/정렬이 바뀌었을 때는 fetch를 해야 함.
        
        // 이를 위해 lastFetchedTime을 체크하는 것보다,
        // "현재 요청하려는 파라미터"와 "마지막으로 성공한 파라미터"를 비교하는 것이 정확함.
        // 하지만 간단하게 구현하기 위해, NewsPage.tsx에서 useEffect 조건을 수정하는 것이 더 나음.
        // 여기서는 API 호출 로직만 담당.

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
        } catch (err) {
            console.error('뉴스 로딩 실패:', err);
            set({ 
                loading: false, 
                error: '뉴스를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' 
            });
        }
    },

    setKeyword: (keyword) => set({ keyword, currentPage: 1 }), // 검색어 변경 시 1페이지로
    setCurrentPage: (page) => set({ currentPage: page }),
    setSortBy: (sort) => set({ sortBy: sort, currentPage: 1 }),
}));
