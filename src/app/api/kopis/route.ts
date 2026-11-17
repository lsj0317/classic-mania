import { NextRequest, NextResponse } from 'next/server';

const KOPIS_ORIGIN = 'http://www.kopis.or.kr';

/**
 * 프록시를 허용하는 KOPIS 경로.
 * 임의 경로를 받으면 `path=.attacker.com/...` 같은 값으로 요청 호스트가 바뀌어
 * 서버의 API 키가 외부로 전송될 수 있으므로, 사용하는 엔드포인트만 정확히 허용한다.
 */
const ALLOWED_PATHS = [
    /^\/openApi\/restful\/pblprfr$/,                   // 공연 목록
    /^\/openApi\/restful\/pblprfr\/[A-Za-z0-9]+$/,     // 공연 상세
    /^\/openApi\/restful\/boxoffice$/,                 // 박스오피스
    /^\/openApi\/restful\/prfplc\/[A-Za-z0-9]+$/,      // 공연시설 상세
];

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const kopisPath = searchParams.get('path') || '';

    if (!ALLOWED_PATHS.some((re) => re.test(kopisPath))) {
        return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const apiKey = process.env.KOPIS_API_KEY || '';

    // Build target URL with remaining params + server-side API key
    const target = new URL(kopisPath, KOPIS_ORIGIN);
    searchParams.forEach((value, key) => {
        if (key !== 'path') {
            target.searchParams.append(key, value);
        }
    });
    // Inject API key server-side (override any client-sent value)
    target.searchParams.set('service', apiKey);

    try {
        const response = await fetch(target);
        const data = await response.text();

        return new NextResponse(data, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
            },
        });
    } catch {
        return NextResponse.json(
            { error: 'KOPIS proxy error' },
            { status: 500 }
        );
    }
}
