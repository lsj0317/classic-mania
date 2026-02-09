import axios from 'axios';

const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = import.meta.env.VITE_NAVER_CLIENT_SECRET;

const isDev = import.meta.env.DEV;
const CORS_PROXY = 'https://corsproxy.io/?url=';

/**
 * 네이버 API URL 빌드 (개발: Vite 프록시, 배포: corsproxy.io CORS 프록시)
 * 배포 환경에서는 전체 URL을 encodeURIComponent로 인코딩하여 query params가
 * corsproxy.io가 아닌 실제 네이버 API로 전달되도록 합니다.
 */
function buildNaverUrl(path: string, params: Record<string, string | number>): string {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        searchParams.append(key, String(value));
    }

    if (isDev) {
        return `/api/naver/${path}?${searchParams.toString()}`;
    }

    const targetUrl = `https://openapi.naver.com/${path}?${searchParams.toString()}`;
    return `${CORS_PROXY}${encodeURIComponent(targetUrl)}`;
}

export interface NewsItem {
    title: string;
    originallink: string;
    link: string;
    description: string;
    pubDate: string;
}

export interface NewsResponse {
    lastBuildDate: string;
    total: number;
    start: number;
    display: number;
    items: NewsItem[];
}

export const fetchNews = async (query: string, start = 1, display = 10, sort = 'sim'): Promise<NewsResponse> => {
    try {
        // [디버깅] API 키 로드 상태 확인
        if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
            console.error("🚨 [오류] 네이버 API 키가 환경변수에서 로드되지 않았습니다.");
        }

        const url = buildNaverUrl('v1/search/news.json', {
            query: query,
            display: display,
            start: start,
            sort: sort,
        });

        const response = await axios.get(url, {
            headers: {
                'X-Naver-Client-Id': NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
            },
        });
        return response.data;
    } catch (error) {
        console.error('네이버 뉴스 API 호출 중 에러 발생:', error);
        throw error;
    }
};
