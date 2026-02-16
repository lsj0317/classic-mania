import type { YouTubeVideo } from '@/types';

export async function searchYouTubeVideos(query: string, maxResults = 10): Promise<YouTubeVideo[]> {
    const params = new URLSearchParams({ q: query, maxResults: String(maxResults) });
    const response = await fetch(`/api/youtube?${params.toString()}`);

    if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    return data.videos || [];
}
