import axios from 'axios';

/**
 * 네이버 API URL 빌드
 * 개발/배포 모두 /api/naver 프록시 사용
 * - 개발: Vite dev server proxy
 * - 배포: Vercel Serverless Function (API 키는 서버사이드에서 관리)
 */
function buildNaverUrl(path: string, params: Record<string, string | number>): string {
    const searchParams = new URLSearchParams();
    searchParams.append('path', `/${path}`);
    for (const [key, value] of Object.entries(params)) {
        searchParams.append(key, String(value));
    }
    return `/api/naver?${searchParams.toString()}`;
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
        const url = buildNaverUrl('v1/search/news.json', {
            query: query,
            display: display,
            start: start,
            sort: sort,
        });

        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('네이버 뉴스 API 호출 중 에러 발생:', error);
        throw error;
    }
};
