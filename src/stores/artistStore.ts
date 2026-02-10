import { create } from 'zustand';
import type { Artist, CheerMessage, Performance } from '../types';
import { artistData, cheerMessages as initialCheerMessages } from '../data/artistData';
import { fetchNews, type NewsItem } from '../api/newsApi';
import { fetchKopisPerformances } from '../api/kopisApi';

interface ArtistState {
    // 아티스트 목록
    artists: Artist[];

    // 팔로우 (좋아요) 상태 - localStorage 연동
    followedArtistIds: string[];

    // 응원 메시지
    cheerMessages: CheerMessage[];

    // 정렬 / 검색 상태
    sortBy: 'name' | 'likes' | 'performances';
    searchTerm: string;
    currentPage: number;

    // 상세 페이지 - 관련 공연
    artistPerformances: Performance[];
    performancesLoading: boolean;
    performanceFilter: 'all' | 'upcoming' | 'completed';

    // 상세 페이지 - 관련 뉴스
    artistNews: NewsItem[];
    newsLoading: boolean;

    // 상세 페이지 - 응원 메시지 페이징
    cheerCurrentPage: number;

    // 액션
    toggleFollow: (artistId: string) => void;
    isFollowed: (artistId: string) => boolean;
    addCheerMessage: (artistId: string, userId: string, userName: string, userProfileImage: string | undefined, message: string) => void;
    getCheerMessages: (artistId: string) => CheerMessage[];
    setSortBy: (sort: 'name' | 'likes' | 'performances') => void;
    setSearchTerm: (term: string) => void;
    setCurrentPage: (page: number) => void;
    setPerformanceFilter: (filter: 'all' | 'upcoming' | 'completed') => void;
    setCheerCurrentPage: (page: number) => void;
    fetchArtistPerformances: (artistName: string) => Promise<void>;
    fetchArtistNews: (artistName: string) => Promise<void>;
    getFilteredArtists: () => Artist[];
    getFollowedArtists: () => Artist[];
}

// localStorage에서 팔로우 데이터 로드
const loadFollowedArtists = (): string[] => {
    try {
        const stored = localStorage.getItem('followedArtists');
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

// localStorage에서 응원 메시지 로드
const loadCheerMessages = (): CheerMessage[] => {
    try {
        const stored = localStorage.getItem('cheerMessages');
        return stored ? JSON.parse(stored) : initialCheerMessages;
    } catch {
        return initialCheerMessages;
    }
};

// 초성 추출 함수 (한글 검색용)
const getChosung = (str: string): string => {
    const CHOSUNG = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    return str.split('').map(ch => {
        const code = ch.charCodeAt(0) - 0xAC00;
        if (code >= 0 && code <= 11171) {
            return CHOSUNG[Math.floor(code / 588)];
        }
        return ch;
    }).join('');
};

// 검색 매칭 함수
const matchSearch = (artist: Artist, term: string): boolean => {
    if (!term) return true;
    const lowerTerm = term.toLowerCase();

    // 한글 이름 매칭
    if (artist.name.toLowerCase().includes(lowerTerm)) return true;
    // 영어 이름 매칭 (대소문자 무시)
    if (artist.nameEn.toLowerCase().includes(lowerTerm)) return true;
    // 역할 매칭
    if (artist.role.includes(term)) return true;
    // 초성 매칭
    const chosung = getChosung(artist.name);
    if (chosung.includes(term)) return true;

    return false;
};

export const useArtistStore = create<ArtistState>((set, get) => ({
    artists: artistData,
    followedArtistIds: loadFollowedArtists(),
    cheerMessages: loadCheerMessages(),

    sortBy: 'name',
    searchTerm: '',
    currentPage: 1,

    artistPerformances: [],
    performancesLoading: false,
    performanceFilter: 'all',

    artistNews: [],
    newsLoading: false,

    cheerCurrentPage: 1,

    toggleFollow: (artistId: string) => {
        const { followedArtistIds, artists } = get();
        let newFollowed: string[];
        let newArtists: Artist[];

        if (followedArtistIds.includes(artistId)) {
            newFollowed = followedArtistIds.filter(id => id !== artistId);
            newArtists = artists.map(a =>
                a.id === artistId ? { ...a, likes: Math.max(0, a.likes - 1) } : a
            );
        } else {
            newFollowed = [...followedArtistIds, artistId];
            newArtists = artists.map(a =>
                a.id === artistId ? { ...a, likes: a.likes + 1 } : a
            );
        }

        localStorage.setItem('followedArtists', JSON.stringify(newFollowed));
        set({ followedArtistIds: newFollowed, artists: newArtists });
    },

    isFollowed: (artistId: string) => {
        return get().followedArtistIds.includes(artistId);
    },

    addCheerMessage: (artistId, userId, userName, userProfileImage, message) => {
        const newMessage: CheerMessage = {
            id: `cheer-${Date.now()}`,
            artistId,
            userId,
            userName,
            userProfileImage,
            message,
            createdAt: new Date().toISOString(),
        };

        const updated = [newMessage, ...get().cheerMessages];
        localStorage.setItem('cheerMessages', JSON.stringify(updated));
        set({ cheerMessages: updated });
    },

    getCheerMessages: (artistId: string) => {
        return get().cheerMessages
            .filter(m => m.artistId === artistId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },

    setSortBy: (sort) => set({ sortBy: sort, currentPage: 1 }),
    setSearchTerm: (term) => set({ searchTerm: term, currentPage: 1 }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setPerformanceFilter: (filter) => set({ performanceFilter: filter }),
    setCheerCurrentPage: (page) => set({ cheerCurrentPage: page }),

    fetchArtistPerformances: async (artistName: string) => {
        set({ performancesLoading: true, artistPerformances: [] });
        try {
            const allPerformances = await fetchKopisPerformances(1, 200);
            // cast 필드에서 아티스트 이름 매칭
            // 목록에서는 cast가 없으므로 이름이 제목에 포함된 공연을 찾음
            const matched = allPerformances.filter(p =>
                p.title.includes(artistName) ||
                p.cast?.includes(artistName)
            );
            set({ artistPerformances: matched, performancesLoading: false });
        } catch {
            set({ performancesLoading: false, artistPerformances: [] });
        }
    },

    fetchArtistNews: async (artistName: string) => {
        set({ newsLoading: true, artistNews: [] });
        try {
            const result = await fetchNews(`${artistName} 클래식`, 1, 10, 'date');
            set({ artistNews: result.items, newsLoading: false });
        } catch {
            set({ newsLoading: false, artistNews: [] });
        }
    },

    getFilteredArtists: () => {
        const { artists, sortBy, searchTerm } = get();
        let filtered = artists.filter(a => matchSearch(a, searchTerm));

        switch (sortBy) {
            case 'name':
                filtered = filtered.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
                break;
            case 'likes':
                filtered = filtered.sort((a, b) => b.likes - a.likes);
                break;
            case 'performances':
                filtered = filtered.sort((a, b) => b.performanceCount - a.performanceCount);
                break;
        }

        return filtered;
    },

    getFollowedArtists: () => {
        const { artists, followedArtistIds } = get();
        return artists.filter(a => followedArtistIds.includes(a.id));
    },
}));
