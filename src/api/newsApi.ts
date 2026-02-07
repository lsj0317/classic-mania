import axios from 'axios';

const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = import.meta.env.VITE_NAVER_CLIENT_SECRET;

const isDev = import.meta.env.DEV;

// 네이버 API는 서버 사이드 호출을 권장하므로, 클라이언트에서 직접 호출 시 CORS 문제가 발생할 수 있습니다.
// 개발 환경에서는 Vite proxy를 사용하고, 배포 환경에서는 백엔드 프록시가 필요합니다.
// 여기서는 corsproxy.io를 사용하여 우회합니다.
const BASE_URL = isDev
    ? '/api/naver/v1/search/news.json'
    : 'https://corsproxy.io/?url=https://openapi.naver.com/v1/search/news.json';

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

        const response = await axios.get(BASE_URL, {
            params: {
                query: query,
                display: display,
                start: start,
                sort: sort
            },
            headers: {
                'X-Naver-Client-Id': NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
            }
        });
        return response.data;
    } catch (error) {
        console.error('네이버 뉴스 API 호출 중 에러 발생:', error);
        throw error;
    }
};
