import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const kopisPath = searchParams.get('path') || '';

    const apiKey = process.env.KOPIS_API_KEY || '';

    // Build target URL with remaining params + server-side API key
    const targetParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
        if (key !== 'path') {
            targetParams.append(key, value);
        }
    });
    // Inject API key server-side (override any client-sent value)
    targetParams.set('service', apiKey);

    const targetUrl = `http://www.kopis.or.kr${kopisPath}?${targetParams.toString()}`;

    try {
        const response = await fetch(targetUrl);
        const data = await response.text();

        return new NextResponse(data, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch {
        return NextResponse.json(
            { error: 'KOPIS proxy error' },
            { status: 500 }
        );
    }
}
