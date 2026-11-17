import { NextRequest, NextResponse } from 'next/server';

const NAVER_ORIGIN = 'https://openapi.naver.com';

/**
 * 프록시를 허용하는 네이버 검색 API 경로.
 * 임의 경로를 받으면 요청 호스트가 바뀌어 Client ID/Secret 헤더가 외부로 전송될 수 있으므로
 * 사용하는 엔드포인트만 허용한다.
 */
const ALLOWED_PATHS = new Set(['/v1/search/news.json']);

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const naverPath = searchParams.get('path') || '';

    if (!ALLOWED_PATHS.has(naverPath)) {
        return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const target = new URL(naverPath, NAVER_ORIGIN);
    searchParams.forEach((value, key) => {
        if (key !== 'path') {
            target.searchParams.append(key, value);
        }
    });

    const clientId = process.env.NAVER_CLIENT_ID || '';
    const clientSecret = process.env.NAVER_CLIENT_SECRET || '';

    try {
        const response = await fetch(target, {
            headers: {
                'X-Naver-Client-Id': clientId,
                'X-Naver-Client-Secret': clientSecret,
            },
        });
        const data = await response.text();

        return new NextResponse(data, {
            status: response.status,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        });
    } catch {
        return NextResponse.json(
            { error: 'Naver proxy error' },
            { status: 500 }
        );
    }
}
