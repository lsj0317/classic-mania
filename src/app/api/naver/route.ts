import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const naverPath = searchParams.get('path') || '';

    // Build target URL with remaining params
    const targetParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
        if (key !== 'path') {
            targetParams.append(key, value);
        }
    });

    const targetUrl = `https://openapi.naver.com${naverPath}?${targetParams.toString()}`;

    const clientId = process.env.NAVER_CLIENT_ID || '';
    const clientSecret = process.env.NAVER_CLIENT_SECRET || '';

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'X-Naver-Client-Id': clientId,
                'X-Naver-Client-Secret': clientSecret,
            },
        });
        const data = await response.text();

        return new NextResponse(data, {
            status: 200,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch {
        return NextResponse.json(
            { error: 'Naver proxy error' },
            { status: 500 }
        );
    }
}
