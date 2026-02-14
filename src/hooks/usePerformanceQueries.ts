import { useQuery } from '@tanstack/react-query';
import { fetchKopisPerformances, fetchKopisPerformanceDetail } from '../api/kopisApi';
import { performanceData } from '../data/performanceData';
import type { Performance } from '../types';

/** KOPIS 공연 목록 - React Query 캐싱 */
export const usePerformanceList = () => {
    return useQuery<Performance[]>({
        queryKey: ['performances', 'list'],
        queryFn: async () => {
            try {
                const data = await fetchKopisPerformances();
                return data.length > 0 ? data : performanceData;
            } catch {
                console.warn('KOPIS API 실패, 더미 데이터로 대체');
                return performanceData;
            }
        },
        staleTime: 1000 * 60 * 10,      // 10분간 fresh
        gcTime: 1000 * 60 * 30,          // 30분 캐시 유지
        refetchOnWindowFocus: false,
        retry: 2,
    });
};

/** KOPIS 공연 상세 - React Query 캐싱 */
export const usePerformanceDetail = (id: string | undefined) => {
    return useQuery<Performance | null>({
        queryKey: ['performances', 'detail', id],
        queryFn: async () => {
            if (!id) return null;
            try {
                const data = await fetchKopisPerformanceDetail(id);
                if (data) return data;
                // API에서 못 찾으면 더미 데이터 fallback
                return performanceData.find((p) => p.id === id) || null;
            } catch {
                return performanceData.find((p) => p.id === id) || null;
            }
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 15,      // 15분간 fresh
        gcTime: 1000 * 60 * 60,          // 1시간 캐시 유지
        refetchOnWindowFocus: false,
    });
};

/** 이달의 공연 (공연중 + 공연예정만 필터) */
export const useMonthlyPerformances = () => {
    const query = usePerformanceList();

    const monthlyPerformances = (query.data ?? []).filter(
        (p) => p.status === '공연중' || p.status === '공연예정'
    );

    return {
        ...query,
        data: monthlyPerformances,
    };
};
