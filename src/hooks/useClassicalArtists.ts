import { useQuery } from '@tanstack/react-query';
import { getAllConductors } from '../data/conductorPool';
import { getAllPerformers } from '../data/performerPool';
import { searchAudioDBArtist, fetchWikiSummary } from '../api/audioDbApi';
import type { Artist } from '../types';

const STALE_TIME = 1000 * 60 * 30;   // 30분
const GC_TIME = 1000 * 60 * 60 * 2;  // 2시간

async function fetchArtistList(
    entries: { searchName: string; wikiTitle: string; nameKo: string; nationality: string; role?: string; roleEn?: string }[],
    prefix: string
): Promise<Artist[]> {
    const results = await Promise.allSettled(
        entries.map(async (entry, idx) => {
            const [audiodb, wiki] = await Promise.all([
                searchAudioDBArtist(entry.searchName),
                fetchWikiSummary(entry.wikiTitle),
            ]);

            const profileImage =
                audiodb?.strArtistThumb ||
                wiki?.thumbnail?.source ||
                wiki?.originalimage?.source ||
                '';

            const bio = audiodb?.strBiographyKR || audiodb?.strBiographyEN || wiki?.extract || '';
            const bioEn = audiodb?.strBiographyEN || wiki?.extract || '';

            const artist: Artist = {
                id: `${prefix}-${idx}`,
                name: entry.nameKo,
                nameEn: entry.searchName,
                role: entry.role || (prefix === 'conductor' ? '지휘자' : '연주자'),
                roleEn: entry.roleEn || (prefix === 'conductor' ? 'Conductor' : 'Performer'),
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

    return results
        .filter((r): r is PromiseFulfilledResult<Artist> => r.status === 'fulfilled')
        .map((r) => r.value);
}

export const useConductors = () => {
    const entries = getAllConductors();
    return useQuery<Artist[]>({
        queryKey: ['conductors'],
        queryFn: () => fetchArtistList(
            entries.map(e => ({ ...e, role: '지휘자', roleEn: 'Conductor' })),
            'conductor'
        ),
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        refetchOnWindowFocus: false,
        retry: 2,
    });
};

export const usePerformers = () => {
    const entries = getAllPerformers();
    return useQuery<Artist[]>({
        queryKey: ['performers'],
        queryFn: () => fetchArtistList(entries, 'performer'),
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        refetchOnWindowFocus: false,
        retry: 2,
    });
};
