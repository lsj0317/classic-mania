import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const artistName = searchParams.get('s') || '';

    if (!artistName) {
        return NextResponse.json(
            { error: 'Missing "s" query parameter' },
            { status: 400 }
        );
    }

    const targetUrl = `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(artistName)}`;

    try {
        const response = await fetch(targetUrl);
        const data = await response.json();

        return NextResponse.json(data, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
            },
        });
    } catch {
        return NextResponse.json(
            { error: 'AudioDB proxy error' },
            { status: 500 }
        );
    }
}
