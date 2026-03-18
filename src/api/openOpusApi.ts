import type {
    OpenOpusComposer,
    OpenOpusWork,
} from '../types';
import {
    getPopularComposers,
    getEssentialComposers,
    getComposersByEpoch,
    searchComposersLocal,
    getComposersByIds,
    getComposersByLetter,
    getAllComposers,
    getComposerGenres,
    getWorksByComposer,
} from '../data/composerData';

/**
 * Open Opus API 대체 레이어
 * 원본 API(api.openopus.org)가 중단되어 로컬 더미 데이터로 전환
 */

/** 인기 작곡가 목록 (상위 23명) */
export const fetchPopularComposers = async (): Promise<OpenOpusComposer[]> => {
    return getPopularComposers();
};

/** 추천 작곡가 목록 */
export const fetchEssentialComposers = async (): Promise<OpenOpusComposer[]> => {
    return getEssentialComposers();
};

/** 시대별 작곡가 목록 */
export const fetchComposersByEpoch = async (epoch: string): Promise<OpenOpusComposer[]> => {
    return getComposersByEpoch(epoch);
};

/** 작곡가 이름 검색 */
export const searchComposers = async (query: string): Promise<OpenOpusComposer[]> => {
    return searchComposersLocal(query);
};

/** ID로 작곡가 조회 */
export const fetchComposersByIds = async (ids: string[]): Promise<OpenOpusComposer[]> => {
    return getComposersByIds(ids);
};

/** 이름 첫 글자별 작곡가 목록 */
export const fetchComposersByLetter = async (letter: string): Promise<OpenOpusComposer[]> => {
    return getComposersByLetter(letter);
};

/** 전체 작곡가 목록 (A-Z 전체 조회) */
export const fetchAllComposers = async (): Promise<OpenOpusComposer[]> => {
    return getAllComposers();
};

/** 작곡가의 작품 목록 (장르별) */
export const fetchWorksByComposer = async (
    composerId: string,
    genre: string = 'Popular'
): Promise<{ composer: OpenOpusComposer | null; works: OpenOpusWork[] }> => {
    return getWorksByComposer(composerId, genre);
};

/** 작곡가의 장르 목록 */
export const fetchComposerGenres = async (composerId: string): Promise<string[]> => {
    return getComposerGenres(composerId);
};
