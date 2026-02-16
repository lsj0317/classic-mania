import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const maxResults = searchParams.get('maxResults') || '10';

    if (!query) {
        return NextResponse.json({ error: 'Missing query parameter "q"' }, { status: 400 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 });
    }

    try {
        const url = new URL('https://www.googleapis.com/youtube/v3/search');
        url.searchParams.set('part', 'snippet');
        url.searchParams.set('type', 'video');
        url.searchParams.set('q', query);
        url.searchParams.set('maxResults', maxResults);
        url.searchParams.set('key', apiKey);

        const response = await fetch(url.toString());

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: 'YouTube API error', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();

        const videos = (data.items || []).map((item: {
            id: { videoId: string };
            snippet: {
                title: string;
                description: string;
                thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
                channelTitle: string;
                publishedAt: string;
            };
        }) => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
        }));

        return NextResponse.json(
            { videos },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
                },
            }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch YouTube data', details: String(error) },
            { status: 500 }
        );
    }
}
