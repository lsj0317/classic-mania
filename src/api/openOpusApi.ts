import axios from 'axios';
import type {
    OpenOpusComposer,
    OpenOpusComposerResponse,
    OpenOpusWork,
    OpenOpusWorkResponse,
} from '../types';

const BASE_URL = 'https://api.openopus.org';

/** API 요청 타임아웃 (8초) */
const API_TIMEOUT = 8000;

/**
 * Open Opus API - 클래식 음악 메타데이터 무료 공개 API
 * 인증 불필요, CORS 지원
 * https://openopus.org
 */

const opusClient = axios.create({
    baseURL: BASE_URL,
    timeout: API_TIMEOUT,
});

/** 응답에서 composers 추출 헬퍼 */
const extractComposers = (data: OpenOpusComposerResponse): OpenOpusComposer[] => {
    if (data.status?.success === 'true' && data.composers) {
        return data.composers;
    }
    return [];
};

/** 인기 작곡가 목록 (상위 23명) */
export const fetchPopularComposers = async (): Promise<OpenOpusComposer[]> => {
    const response = await opusClient.get<OpenOpusComposerResponse>(
        '/composer/list/pop.json'
    );
    return extractComposers(response.data);
};

/** 추천 작곡가 목록 (77명) */
export const fetchEssentialComposers = async (): Promise<OpenOpusComposer[]> => {
    const response = await opusClient.get<OpenOpusComposerResponse>(
        '/composer/list/rec.json'
    );
    return extractComposers(response.data);
};

/** 시대별 작곡가 목록 */
export const fetchComposersByEpoch = async (epoch: string): Promise<OpenOpusComposer[]> => {
    const response = await opusClient.get<OpenOpusComposerResponse>(
        `/composer/list/epoch/${encodeURIComponent(epoch)}.json`
    );
    return extractComposers(response.data);
};

/** 작곡가 이름 검색 */
export const searchComposers = async (query: string): Promise<OpenOpusComposer[]> => {
    const response = await opusClient.get<OpenOpusComposerResponse>(
        `/composer/list/search/${encodeURIComponent(query)}.json`
    );
    return extractComposers(response.data);
};

/** ID로 작곡가 조회 (여러 ID 쉼표 구분) */
export const fetchComposersByIds = async (ids: string[]): Promise<OpenOpusComposer[]> => {
    const response = await opusClient.get<OpenOpusComposerResponse>(
        `/composer/list/ids/${ids.join(',')}.json`
    );
    return extractComposers(response.data);
};

/** 작곡가의 장르 목록 */
export const fetchComposerGenres = async (composerId: string): Promise<string[]> => {
    const response = await opusClient.get(
        `/genre/list/composer/${composerId}.json`
    );
    if (response.data.status?.success === 'true' && response.data.genres) {
        return response.data.genres;
    }
    return [];
};

/** 이름 첫 글자별 작곡가 목록 */
export const fetchComposersByLetter = async (letter: string): Promise<OpenOpusComposer[]> => {
    const response = await opusClient.get<OpenOpusComposerResponse>(
        `/composer/list/name/${encodeURIComponent(letter)}.json`
    );
    return extractComposers(response.data);
};

/** 전체 작곡가 목록 (A-Z 전체 조회) */
export const fetchAllComposers = async (): Promise<OpenOpusComposer[]> => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const results = await Promise.all(
        letters.map(letter =>
            opusClient.get<OpenOpusComposerResponse>(
                `/composer/list/name/${letter}.json`
            ).then(res => extractComposers(res.data))
            .catch(() => [] as OpenOpusComposer[])
        )
    );
    return results.flat().sort((a, b) => a.complete_name.localeCompare(b.complete_name));
};

/** 작곡가의 작품 목록 (장르별) */
export const fetchWorksByComposer = async (
    composerId: string,
    genre: string = 'Popular'
): Promise<{ composer: OpenOpusComposer | null; works: OpenOpusWork[] }> => {
    const response = await opusClient.get<OpenOpusWorkResponse>(
        `/work/list/composer/${composerId}/genre/${encodeURIComponent(genre)}.json`
    );
    if (response.data.status?.success === 'true' && response.data.works) {
        return {
            composer: response.data.composer || null,
            works: response.data.works,
        };
    }
    return { composer: null, works: [] };
};
