import axios from 'axios';
import type {
    OpenOpusComposer,
    OpenOpusComposerResponse,
    OpenOpusWork,
    OpenOpusWorkResponse,
} from '../types';

const BASE_URL = 'https://api.openopus.org';

/**
 * Open Opus API - 클래식 음악 메타데이터 무료 공개 API
 * 인증 불필요, CORS 지원
 * https://openopus.org
 */

/** 인기 작곡가 목록 (상위 23명) */
export const fetchPopularComposers = async (): Promise<OpenOpusComposer[]> => {
    try {
        const response = await axios.get<OpenOpusComposerResponse>(
            `${BASE_URL}/composer/list/pop.json`
        );
        if (response.data.status?.success === 'true' && response.data.composers) {
            return response.data.composers;
        }
        return [];
    } catch (error) {
        console.error('Open Opus 인기 작곡가 API 호출 중 에러 발생:', error);
        throw error;
    }
};

/** 추천 작곡가 목록 (77명) */
export const fetchEssentialComposers = async (): Promise<OpenOpusComposer[]> => {
    try {
        const response = await axios.get<OpenOpusComposerResponse>(
            `${BASE_URL}/composer/list/rec.json`
        );
        if (response.data.status?.success === 'true' && response.data.composers) {
            return response.data.composers;
        }
        return [];
    } catch (error) {
        console.error('Open Opus 추천 작곡가 API 호출 중 에러 발생:', error);
        throw error;
    }
};

/** 시대별 작곡가 목록 */
export const fetchComposersByEpoch = async (epoch: string): Promise<OpenOpusComposer[]> => {
    try {
        const response = await axios.get<OpenOpusComposerResponse>(
            `${BASE_URL}/composer/list/epoch/${encodeURIComponent(epoch)}.json`
        );
        if (response.data.status?.success === 'true' && response.data.composers) {
            return response.data.composers;
        }
        return [];
    } catch (error) {
        console.error('Open Opus 시대별 작곡가 API 호출 중 에러 발생:', error);
        throw error;
    }
};

/** 작곡가 이름 검색 */
export const searchComposers = async (query: string): Promise<OpenOpusComposer[]> => {
    try {
        const response = await axios.get<OpenOpusComposerResponse>(
            `${BASE_URL}/composer/list/search/${encodeURIComponent(query)}.json`
        );
        if (response.data.status?.success === 'true' && response.data.composers) {
            return response.data.composers;
        }
        return [];
    } catch (error) {
        console.error('Open Opus 작곡가 검색 API 호출 중 에러 발생:', error);
        throw error;
    }
};

/** ID로 작곡가 조회 (여러 ID 쉼표 구분) */
export const fetchComposersByIds = async (ids: string[]): Promise<OpenOpusComposer[]> => {
    try {
        const response = await axios.get<OpenOpusComposerResponse>(
            `${BASE_URL}/composer/list/ids/${ids.join(',')}.json`
        );
        if (response.data.status?.success === 'true' && response.data.composers) {
            return response.data.composers;
        }
        return [];
    } catch (error) {
        console.error('Open Opus 작곡가 ID 조회 API 호출 중 에러 발생:', error);
        throw error;
    }
};

/** 작곡가의 장르 목록 */
export const fetchComposerGenres = async (composerId: string): Promise<string[]> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/genre/list/composer/${composerId}.json`
        );
        if (response.data.status?.success === 'true' && response.data.genres) {
            return response.data.genres;
        }
        return [];
    } catch (error) {
        console.error('Open Opus 장르 목록 API 호출 중 에러 발생:', error);
        throw error;
    }
};

/** 작곡가의 작품 목록 (장르별) */
export const fetchWorksByComposer = async (
    composerId: string,
    genre: string = 'Popular'
): Promise<{ composer: OpenOpusComposer | null; works: OpenOpusWork[] }> => {
    try {
        const response = await axios.get<OpenOpusWorkResponse>(
            `${BASE_URL}/work/list/composer/${composerId}/genre/${encodeURIComponent(genre)}.json`
        );
        if (response.data.status?.success === 'true' && response.data.works) {
            return {
                composer: response.data.composer || null,
                works: response.data.works,
            };
        }
        return { composer: null, works: [] };
    } catch (error) {
        console.error('Open Opus 작품 목록 API 호출 중 에러 발생:', error);
        throw error;
    }
};
