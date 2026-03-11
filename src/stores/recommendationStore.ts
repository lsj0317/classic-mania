import { create } from 'zustand';
import type { Performance, RecommendedPerformance } from '../types';

interface RecommendationState {
    recommendations: RecommendedPerformance[];
    isLoading: boolean;
    lastUpdated: string | null;

    // 액션
    generateRecommendations: (
        followedArtistIds: string[],
        reviewedPerformanceIds: string[],
        preferredEpochs: string[],
        allPerformances: Performance[]
    ) => void;
    clearRecommendations: () => void;
}

const STORAGE_KEY = 'classic-mania-recommendations';

const loadRecommendations = (): RecommendedPerformance[] => {
    if (typeof window === 'undefined') return [];
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return [];
        const parsed = JSON.parse(saved);
        // 24시간 이상 지난 캐시는 무효
        if (parsed.lastUpdated) {
            const diff = Date.now() - new Date(parsed.lastUpdated).getTime();
            if (diff > 24 * 60 * 60 * 1000) return [];
        }
        return parsed.recommendations || [];
    } catch {
        return [];
    }
};

// 공연 추천 점수 계산 로직
function scorePerformance(
    perf: Performance,
    followedArtistIds: string[],
    reviewedPerformanceIds: string[],
    preferredEpochs: string[]
): { score: number; reason: string } {
    let score = 0;
    const reasons: string[] = [];

    // 이미 리뷰한 공연은 제외 (낮은 점수)
    if (reviewedPerformanceIds.includes(perf.id)) {
        return { score: -1, reason: '' };
    }

    // 공연 상태 가중치 (공연 예정인 공연 우선)
    if (perf.status === '공연예정') {
        score += 30;
    } else if (perf.status === '공연중') {
        score += 20;
    }

    // 팔로우 아티스트 이름이 출연진에 포함
    for (const id of followedArtistIds) {
        if (perf.cast?.includes(id) || perf.title.includes(id)) {
            score += 50;
            reasons.push('팔로우한 아티스트 출연');
            break;
        }
    }

    // 시대별 관련 작곡가 키워드
    const epochKeywords: Record<string, string[]> = {
        Baroque: ['바흐', '헨델', '비발디', 'Bach', 'Handel', 'Vivaldi'],
        Classical: ['모차르트', '하이든', '베토벤', 'Mozart', 'Haydn', 'Beethoven'],
        Romantic: ['쇼팽', '리스트', '슈만', '브람스', 'Chopin', 'Liszt', 'Schumann', 'Brahms'],
        'Late Romantic': ['말러', '브루크너', '리하르트 슈트라우스', 'Mahler', 'Bruckner', 'Strauss'],
        '20th Century': ['스트라빈스키', '쇼스타코비치', 'Stravinsky', 'Shostakovich'],
    };

    for (const epoch of preferredEpochs) {
        const keywords = epochKeywords[epoch] || [];
        for (const kw of keywords) {
            if (perf.title.includes(kw) || perf.cast?.includes(kw) || perf.synopsis?.includes(kw)) {
                score += 25;
                reasons.push(`선호 시대(${epoch}) 관련 공연`);
                break;
            }
        }
    }

    // 장르 우선순위
    if (perf.genre === '클래식') score += 10;
    if (perf.genre === '오페라') score += 8;
    if (perf.genre === '발레') score += 5;

    // 기본 추천 이유 설정
    if (reasons.length === 0) {
        reasons.push('인기 클래식 공연');
    }

    return { score, reason: reasons[0] };
}

export const useRecommendationStore = create<RecommendationState>((set) => ({
    recommendations: loadRecommendations(),
    isLoading: false,
    lastUpdated: null,

    generateRecommendations: (followedArtistIds, reviewedPerformanceIds, preferredEpochs, allPerformances) => {
        set({ isLoading: true });

        const scored = allPerformances
            .map((perf) => {
                const { score, reason } = scorePerformance(
                    perf,
                    followedArtistIds,
                    reviewedPerformanceIds,
                    preferredEpochs
                );
                return { performance: perf, score, reason };
            })
            .filter((item) => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8);

        const now = new Date().toISOString();

        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ recommendations: scored, lastUpdated: now })
            );
        } catch { /* ignore */ }

        set({ recommendations: scored, isLoading: false, lastUpdated: now });
    },

    clearRecommendations: () => {
        localStorage.removeItem(STORAGE_KEY);
        set({ recommendations: [], lastUpdated: null });
    },
}));
