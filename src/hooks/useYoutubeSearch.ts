import { useQuery } from '@tanstack/react-query';
import { searchYouTubeVideos } from '@/api/youtubeApi';
import type { YouTubeVideo } from '@/types';

export const useYoutubeSearch = (artistName: string, enabled = true) => {
    return useQuery<YouTubeVideo[]>({
        queryKey: ['youtube', artistName],
        queryFn: () => searchYouTubeVideos(`${artistName} classical performance`),
        enabled: enabled && !!artistName,
        staleTime: 1000 * 60 * 60, // 1시간
        gcTime: 1000 * 60 * 60 * 2, // 2시간
        refetchOnWindowFocus: false,
        retry: 1,
    });
};
