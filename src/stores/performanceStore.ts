import { create } from 'zustand';
import type { Performance } from '../types';
import { fetchKopisPerformances, fetchKopisPerformanceDetail, fetchKopisFacilityDetail } from '../api/kopisApi';
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

    // 시설 좌표 캐시 (FacilityID → {lat, lng})
    facilityCache: Record<string, { lat: number; lng: number }>;

    // 필터 / 페이징 상태 (뒤로가기 시 유지)
    selectedTab: string;
    selectedArea: string;
    searchTerm: string;
    currentPage: number;

    // 티켓 페이지 전용 상태 (뒤로가기 시 유지)
    ticketSearchTerm: string;
    ticketCurrentPage: number;

    // 액션
    fetchList: () => Promise<void>;
    fetchDetail: (id: string) => Promise<void>;
    fetchPriceForList: (ids: string[]) => Promise<void>; // 목록에 가격 정보 채우기
    fetchLocationsForList: () => Promise<void>; // 목록에 있는 공연들의 좌표 정보 채우기
    setSelectedTab: (tab: string) => void;
    setSelectedArea: (area: string) => void;
    setSearchTerm: (term: string) => void;
    setCurrentPage: (page: number) => void;
    setTicketSearchTerm: (term: string) => void;
    setTicketCurrentPage: (page: number) => void;
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

    facilityCache: {},

    selectedTab: '전체',
    selectedArea: '전체 지역',
    searchTerm: '',
    currentPage: 1,

    ticketSearchTerm: '',
    ticketCurrentPage: 1,

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

    // 목록에 있는 아이템들의 가격 정보를 채우기 위해 상세 API를 병렬 호출
    fetchPriceForList: async (ids: string[]) => {
        const { detailCache, performances } = get();
        
        // 이미 가격 정보가 있는 아이템은 제외 (detailCache에 있거나 performances에 price가 있는 경우)
        const targetIds = ids.filter(id => {
            const inCache = detailCache[id]?.price;
            const inList = performances.find(p => p.id === id)?.price;
            return !inCache && !inList;
        });

        if (targetIds.length === 0) return;

        // 병렬 호출 제한 (너무 많은 요청 방지)
        const CHUNK_SIZE = 5;
        for (let i = 0; i < targetIds.length; i += CHUNK_SIZE) {
            const chunk = targetIds.slice(i, i + CHUNK_SIZE);
            await Promise.all(chunk.map(async (id) => {
                try {
                    const detail = await fetchKopisPerformanceDetail(id);
                    if (detail && detail.price) {
                        set((state) => {
                            // 캐시 업데이트
                            const newCache = { ...state.detailCache, [id]: detail };
                            
                            // 목록 데이터 업데이트 (가격 정보 추가)
                            const newPerformances = state.performances.map(p => 
                                p.id === id ? { ...p, price: detail.price } : p
                            );
                            
                            return { detailCache: newCache, performances: newPerformances };
                        });
                    }
                } catch (e) {
                    console.error(`Failed to fetch price for ${id}`, e);
                }
            }));
        }
    },

    // 목록에 있는 공연들의 좌표 정보 채우기 (지도용)
    fetchLocationsForList: async () => {
        const { performances, facilityCache, detailCache } = get();
        
        // 좌표가 없는 공연들만 필터링
        const targetPerformances = performances.filter(p => !p.lat || !p.lng);
        if (targetPerformances.length === 0) return;

        // 병렬 처리 (청크 단위)
        const CHUNK_SIZE = 5;
        for (let i = 0; i < targetPerformances.length; i += CHUNK_SIZE) {
            const chunk = targetPerformances.slice(i, i + CHUNK_SIZE);
            
            await Promise.all(chunk.map(async (perf) => {
                try {
                    let facilityId = perf.facilityId;

                    // 1. 목록 데이터에 facilityId가 없으면 상세 조회로 획득 시도
                    if (!facilityId) {
                        // 캐시에 있으면 사용
                        if (detailCache[perf.id]?.facilityId) {
                            facilityId = detailCache[perf.id].facilityId;
                        } else {
                            // 없으면 API 호출
                            const detail = await fetchKopisPerformanceDetail(perf.id);
                            if (detail) {
                                facilityId = detail.facilityId;
                                // 상세 캐시 업데이트
                                set(state => ({
                                    detailCache: { ...state.detailCache, [perf.id]: detail }
                                }));
                            }
                        }
                    }

                    if (!facilityId) return;

                    // 2. 시설 좌표 조회 (캐시 확인)
                    let coords = facilityCache[facilityId];
                    if (!coords) {
                        const facilityDetail = await fetchKopisFacilityDetail(facilityId);
                        if (facilityDetail) {
                            coords = facilityDetail;
                            // 시설 캐시 업데이트
                            set(state => ({
                                facilityCache: { ...state.facilityCache, [facilityId!]: coords }
                            }));
                        }
                    }

                    // 3. 공연 목록 데이터에 좌표 업데이트
                    if (coords) {
                        set(state => ({
                            performances: state.performances.map(p => 
                                p.id === perf.id ? { ...p, lat: coords.lat, lng: coords.lng, facilityId } : p
                            )
                        }));
                    }

                } catch (e) {
                    console.error(`Failed to fetch location for ${perf.id}`, e);
                }
            }));
        }
    },

    setSelectedTab: (tab) => set({ selectedTab: tab, currentPage: 1 }),
    setSelectedArea: (area) => set({ selectedArea: area, currentPage: 1 }),
    setSearchTerm: (term) => set({ searchTerm: term, currentPage: 1 }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setTicketSearchTerm: (term) => set({ ticketSearchTerm: term, ticketCurrentPage: 1 }),
    setTicketCurrentPage: (page) => set({ ticketCurrentPage: page }),
}));
