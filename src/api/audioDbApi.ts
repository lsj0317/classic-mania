import axios from 'axios';
import type { AudioDBArtist, AudioDBArtistResponse, WikiSummary } from '../types';

/**
 * TheAudioDB 프록시 경유 아티스트 검색
 * CORS 미지원 → Next.js API Route 프록시 사용
 */
export const searchAudioDBArtist = async (name: string): Promise<AudioDBArtist | null> => {
    try {
        const response = await axios.get<AudioDBArtistResponse>(
            `/api/audiodb`,
            { params: { s: name } }
        );
        if (response.data.artists && response.data.artists.length > 0) {
            return response.data.artists[0];
        }
        return null;
    } catch (error) {
        console.error(`AudioDB 아티스트 검색 실패 (${name}):`, error);
        return null;
    }
};

/**
 * Wikipedia REST API 요약 정보 조회
 * CORS 지원 → 직접 호출 가능
 */
export const fetchWikiSummary = async (title: string): Promise<WikiSummary | null> => {
    if (!title) return null;
    try {
        const response = await axios.get<WikiSummary>(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
            { validateStatus: (status) => status < 500 }
        );
        if (response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error(`Wikipedia 요약 조회 실패 (${title}):`, error);
        return null;
    }
};
