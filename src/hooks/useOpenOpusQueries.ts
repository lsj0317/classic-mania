import { useQuery } from '@tanstack/react-query';
import {
    fetchPopularComposers,
    fetchEssentialComposers,
    fetchComposersByEpoch,
    searchComposers,
    fetchComposersByIds,
    fetchComposerGenres,
    fetchWorksByComposer,
} from '../api/openOpusApi';
import type { OpenOpusComposer, OpenOpusWork } from '../types';

const STALE_TIME = 1000 * 60 * 30;   // 30분 fresh
const GC_TIME = 1000 * 60 * 60 * 2;  // 2시간 캐시 유지

/** 인기 작곡가 목록 */
export const usePopularComposers = () => {
    return useQuery<OpenOpusComposer[]>({
        queryKey: ['openopus', 'composers', 'popular'],
        queryFn: fetchPopularComposers,
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        refetchOnWindowFocus: false,
        retry: 2,
    });
};

/** 추천 작곡가 목록 */
export const useEssentialComposers = () => {
    return useQuery<OpenOpusComposer[]>({
        queryKey: ['openopus', 'composers', 'essential'],
        queryFn: fetchEssentialComposers,
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        refetchOnWindowFocus: false,
        retry: 2,
    });
};

/** 시대별 작곡가 */
export const useComposersByEpoch = (epoch: string, enabled = true) => {
    return useQuery<OpenOpusComposer[]>({
        queryKey: ['openopus', 'composers', 'epoch', epoch],
        queryFn: () => fetchComposersByEpoch(epoch),
        enabled,
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        refetchOnWindowFocus: false,
    });
};

/** 작곡가 검색 */
export const useComposerSearch = (query: string) => {
    return useQuery<OpenOpusComposer[]>({
        queryKey: ['openopus', 'composers', 'search', query],
        queryFn: () => searchComposers(query),
        enabled: query.length >= 2,
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        refetchOnWindowFocus: false,
    });
};

/** ID로 작곡가 조회 */
export const useComposersByIds = (ids: string[], enabled = true) => {
    return useQuery<OpenOpusComposer[]>({
        queryKey: ['openopus', 'composers', 'ids', ids.join(',')],
        queryFn: () => fetchComposersByIds(ids),
        enabled: enabled && ids.length > 0,
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        refetchOnWindowFocus: false,
    });
};

/** 작곡가의 장르 목록 */
export const useComposerGenres = (composerId: string | undefined) => {
    return useQuery<string[]>({
        queryKey: ['openopus', 'genres', composerId],
        queryFn: () => fetchComposerGenres(composerId!),
        enabled: !!composerId,
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        refetchOnWindowFocus: false,
    });
};

/** 작곡가의 작품 목록 */
export const useComposerWorks = (
    composerId: string | undefined,
    genre: string = 'Popular'
) => {
    return useQuery<{ composer: OpenOpusComposer | null; works: OpenOpusWork[] }>({
        queryKey: ['openopus', 'works', composerId, genre],
        queryFn: () => fetchWorksByComposer(composerId!, genre),
        enabled: !!composerId,
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        refetchOnWindowFocus: false,
    });
};
