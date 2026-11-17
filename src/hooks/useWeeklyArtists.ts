import { useQuery } from '@tanstack/react-query';
import { getWeeklyArtists } from '../data/weeklyArtistPool';
import { searchAudioDBArtist, fetchWikiSummary } from '../api/audioDbApi';
import { artistData } from '../data/artistData';
import type { Artist } from '../types';

const STALE_TIME = 1000 * 60 * 30;   // 30분 fresh
const GC_TIME = 1000 * 60 * 60 * 2;  // 2시간 캐시 유지

// 기존 목 데이터 폴백 (좋아요 순 상위 4명)
const fallbackArtists = [...artistData].sort((a, b) => b.likes - a.likes).slice(0, 4);

async function fetchWeeklyArtists(): Promise<Artist[]> {
    const entries = getWeeklyArtists();

    const results = await Promise.allSettled(
        entries.map(async (entry) => {
            const [audiodb, wiki] = await Promise.all([
                searchAudioDBArtist(entry.searchName),
                fetchWikiSummary(entry.wikiTitle),
            ]);

            // 프로필 이미지: AudioDB thumb → Wikipedia thumbnail → 빈 문자열
            const profileImage =
                audiodb?.strArtistThumb ||
                wiki?.thumbnail?.source ||
                wiki?.originalimage?.source ||
                '';

            // 바이오: AudioDB 한국어 → AudioDB 영어 → Wikipedia extract → 빈 문자열
            const bio = audiodb?.strBiographyKR || audiodb?.strBiographyEN || wiki?.extract || '';
            const bioEn = audiodb?.strBiographyEN || wiki?.extract || '';

            const artist: Artist = {
                // 주마다 순서가 바뀌므로 인덱스가 아니라 이름 기반의 고정 ID를 쓴다 (팔로우 유지).
                id: `weekly-${entry.searchName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                name: entry.nameKo,
                nameEn: entry.searchName,
                role: entry.role,
                roleEn: entry.roleEn,
                profileImage,
                bio,
                bioEn,
                nationality: audiodb?.strCountry || entry.nationality,
                likes: 0,
                performanceCount: 0,
            };

            return artist;
        })
    );

    const artists = results
        .filter((r): r is PromiseFulfilledResult<Artist> => r.status === 'fulfilled')
        .map((r) => r.value);

    // 최소 1명이라도 성공하면 반환, 전부 실패 시 폴백
    return artists.length > 0 ? artists : fallbackArtists;
}

/** 금주의 아티스트 4명 조회 (AudioDB + Wikipedia 연동) */
export const useWeeklyArtists = (enabled = true) => {
    return useQuery<Artist[]>({
        queryKey: ['weeklyArtists', getWeeklyArtists().map((e) => e.searchName).join(',')],
        queryFn: fetchWeeklyArtists,
        enabled,
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        refetchOnWindowFocus: false,
        retry: 2,
        placeholderData: fallbackArtists,
    });
};
