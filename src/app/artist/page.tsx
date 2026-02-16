'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Heart, ChevronLeft, ChevronRight, Loader2, Music2, Mic2, Piano } from "lucide-react";
import { useArtistStore } from '@/stores/artistStore';
import { useLanguageStore } from '@/stores/languageStore';
import {
    usePopularComposers,
    useEssentialComposers,
    useComposersByEpoch,
    useComposerSearch,
} from '@/hooks/useOpenOpusQueries';
import { useConductors, usePerformers } from '@/hooks/useClassicalArtists';
import type { Artist } from '@/types';

const EPOCH_KO: Record<string, string> = {
    Medieval: "중세", Renaissance: "르네상스", Baroque: "바로크",
    Classical: "고전주의", "Early Romantic": "초기 낭만", Romantic: "낭만주의",
    "Late Romantic": "후기 낭만", "20th Century": "20세기",
    "Post-War": "전후", "21st Century": "21세기",
};

const EPOCH_FILTERS = [
    { key: 'popular', labelKo: '인기', labelEn: 'Popular' },
    { key: 'essential', labelKo: '추천', labelEn: 'Essential' },
    { key: 'Baroque', labelKo: '바로크', labelEn: 'Baroque' },
    { key: 'Classical', labelKo: '고전주의', labelEn: 'Classical' },
    { key: 'Early Romantic', labelKo: '초기 낭만', labelEn: 'Early Romantic' },
    { key: 'Romantic', labelKo: '낭만주의', labelEn: 'Romantic' },
    { key: 'Late Romantic', labelKo: '후기 낭만', labelEn: 'Late Romantic' },
    { key: '20th Century', labelKo: '20세기', labelEn: '20th Century' },
    { key: 'Post-War', labelKo: '전후', labelEn: 'Post-War' },
    { key: '21st Century', labelKo: '21세기', labelEn: '21st Century' },
];

const ITEMS_PER_PAGE = 12;

type TopTab = 'composers' | 'conductors' | 'performers';

const TOP_TABS: { key: TopTab; labelKo: string; labelEn: string; icon: typeof Music2 }[] = [
    { key: 'composers', labelKo: '작곡가', labelEn: 'Composers', icon: Music2 },
    { key: 'conductors', labelKo: '지휘자', labelEn: 'Conductors', icon: Mic2 },
    { key: 'performers', labelKo: '연주자', labelEn: 'Performers', icon: Piano },
];

const ArtistList = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { language } = useLanguageStore();
    const { followedArtistIds, toggleFollow } = useArtistStore();
    const isKo = language === 'ko';

    const initialTab = (searchParams.get('tab') as TopTab) || 'composers';
    const [activeTopTab, setActiveTopTab] = useState<TopTab>(
        TOP_TABS.some(t => t.key === initialTab) ? initialTab : 'composers'
    );

    const [selectedFilter, setSelectedFilter] = useState('popular');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const isEpochFilter = selectedFilter !== 'popular' && selectedFilter !== 'essential';
    const isSearching = searchQuery.length >= 2;

    // 작곡가 API
    const { data: popularComposers = [], isLoading: popularLoading } = usePopularComposers();
    const { data: essentialComposers = [], isLoading: essentialLoading } = useEssentialComposers();
    const { data: epochComposers = [], isLoading: epochLoading } = useComposersByEpoch(
        selectedFilter,
        isEpochFilter && !isSearching && activeTopTab === 'composers'
    );
    const { data: searchedComposers = [], isLoading: searchLoading } = useComposerSearch(
        activeTopTab === 'composers' ? searchQuery : ''
    );

    // 지휘자/연주자 API
    const { data: conductors = [], isLoading: conductorsLoading } = useConductors();
    const { data: performers = [], isLoading: performersLoading } = usePerformers();

    const displayComposers = useMemo(() => {
        if (isSearching) return searchedComposers;
        if (selectedFilter === 'popular') return popularComposers;
        if (selectedFilter === 'essential') return essentialComposers;
        return epochComposers;
    }, [isSearching, selectedFilter, searchedComposers, popularComposers, essentialComposers, epochComposers]);

    const composerLoading = isSearching
        ? searchLoading
        : selectedFilter === 'popular'
            ? popularLoading
            : selectedFilter === 'essential'
                ? essentialLoading
                : epochLoading;

    // 페이지네이션 (작곡가용)
    const totalPages = Math.ceil(displayComposers.length / ITEMS_PER_PAGE);
    const paginatedComposers = displayComposers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleTopTabChange = (tab: TopTab) => {
        setActiveTopTab(tab);
        setCurrentPage(1);
        setSearchQuery('');
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        router.replace(url.pathname + url.search, { scroll: false });
    };

    const handleFilterChange = (filter: string) => {
        setSelectedFilter(filter);
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const getPageNumbers = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, start + 4);
        const adjustedStart = Math.max(1, end - 4);
        return Array.from({ length: end - adjustedStart + 1 }, (_, i) => adjustedStart + i);
    };

    const renderArtistCard = (artist: Artist) => {
        const isFollowed = followedArtistIds.includes(artist.id);
        return (
            <Card
                key={artist.id}
                className="group overflow-hidden border border-gray-200 shadow-none hover:border-black hover:shadow-md transition-all cursor-pointer rounded-none"
            >
                <div
                    className="relative aspect-square overflow-hidden bg-gray-100"
                    onClick={() => router.push(`/artist/${artist.id}`)}
                >
                    {artist.profileImage ? (
                        <img
                            src={artist.profileImage}
                            alt={artist.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Music2 className="h-12 w-12 text-gray-400" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-bold text-sm sm:text-base leading-tight">
                            {isKo ? artist.name : artist.nameEn}
                        </h3>
                        <p className="text-white/80 text-xs mt-0.5">
                            {isKo ? artist.role : artist.roleEn}
                        </p>
                    </div>
                </div>

                <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{artist.nationality}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-500">
                            {isKo ? artist.role : artist.roleEn}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFollow(artist.id);
                            }}
                            className={`p-1.5 rounded-full transition-colors ${
                                isFollowed
                                    ? 'text-red-500 hover:bg-red-50'
                                    : 'text-gray-400 hover:bg-gray-100 hover:text-red-400'
                            }`}
                        >
                            <Heart
                                className="h-4 w-4"
                                fill={isFollowed ? "currentColor" : "none"}
                                strokeWidth={isFollowed ? 0 : 1.5}
                            />
                        </button>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="container mx-auto px-0 sm:px-4 py-6 lg:py-8 max-w-screen-xl min-h-screen">
            {/* 헤더 섹션 */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 lg:gap-6 mb-8 lg:mb-12 border-b-2 border-black pb-4 lg:pb-6 px-4 sm:px-0">
                <div className="flex-1">
                    <h2 className="font-bold text-black tracking-tighter mb-1 lg:mb-2 text-xl lg:text-3xl">
                        {isKo ? '아티스트' : 'Artists'}
                    </h2>
                    <p className="text-gray-600 font-normal text-sm">
                        {isKo
                            ? '클래식 음악의 위대한 작곡가, 지휘자, 연주자들을 만나보세요.'
                            : 'Discover the great composers, conductors, and performers of classical music.'}
                    </p>
                </div>

                {activeTopTab === 'composers' && (
                    <div className="relative w-full lg:w-80">
                        <Input
                            type="text"
                            placeholder={isKo ? '작곡가 검색 (영문, 최소 2글자)' : 'Search composers (min 2 chars)'}
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="pr-10"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                )}
            </div>

            {/* 상위 탭: 작곡가 / 지휘자 / 연주자 */}
            <div className="flex gap-1 mb-6 px-4 sm:px-0 border-b border-gray-200">
                {TOP_TABS.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => handleTopTabChange(tab.key)}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-[1px] ${
                                activeTopTab === tab.key
                                    ? 'border-black text-black'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            {isKo ? tab.labelKo : tab.labelEn}
                        </button>
                    );
                })}
            </div>

            {/* ===== 작곡가 탭 ===== */}
            {activeTopTab === 'composers' && (
                <>
                    {/* 시대별 필터 */}
                    {!isSearching && (
                        <div className="flex gap-2 mb-6 px-4 sm:px-0 overflow-x-auto scrollbar-hide pb-1">
                            {EPOCH_FILTERS.map((filter) => (
                                <button
                                    key={filter.key}
                                    onClick={() => handleFilterChange(filter.key)}
                                    className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors rounded-full border ${
                                        selectedFilter === filter.key
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                                >
                                    {isKo ? filter.labelKo : filter.labelEn}
                                </button>
                            ))}
                        </div>
                    )}

                    {isSearching && (
                        <div className="flex items-center gap-2 mb-6 px-4 sm:px-0">
                            <span className="text-sm text-gray-500">
                                {isKo
                                    ? `"${searchQuery}" 검색 결과 (${displayComposers.length}명)`
                                    : `Search results for "${searchQuery}" (${displayComposers.length})`}
                            </span>
                            <button
                                onClick={() => handleSearchChange('')}
                                className="text-xs text-gray-400 hover:text-black underline"
                            >
                                {isKo ? '초기화' : 'Clear'}
                            </button>
                        </div>
                    )}

                    {!isSearching && !composerLoading && (
                        <div className="flex items-center justify-between mb-4 px-4 sm:px-0">
                            <span className="text-xs text-gray-400">
                                {isKo
                                    ? `총 ${displayComposers.length}명의 작곡가`
                                    : `${displayComposers.length} composers`}
                            </span>
                        </div>
                    )}

                    {composerLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            <span className="ml-2 text-sm text-gray-500">
                                {isKo ? '아티스트 정보를 불러오는 중...' : 'Loading artists...'}
                            </span>
                        </div>
                    ) : paginatedComposers.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0">
                            {paginatedComposers.map((composer) => {
                                const composerKey = `composer-${composer.id}`;
                                const isFollowed = followedArtistIds.includes(composerKey);
                                return (
                                    <Card
                                        key={composer.id}
                                        className="group overflow-hidden border border-gray-200 shadow-none hover:border-black hover:shadow-md transition-all cursor-pointer rounded-none"
                                    >
                                        <div
                                            className="relative aspect-square overflow-hidden bg-gray-100"
                                            onClick={() => router.push(`/artist/composer-${composer.id}`)}
                                        >
                                            <img
                                                src={composer.portrait}
                                                alt={composer.complete_name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                            <div className="absolute bottom-3 left-3 right-3">
                                                <h3 className="text-white font-bold text-sm sm:text-base leading-tight">
                                                    {composer.complete_name}
                                                </h3>
                                                <p className="text-white/80 text-xs mt-0.5">
                                                    {isKo ? EPOCH_KO[composer.epoch] || composer.epoch : composer.epoch}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-3 flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <span>
                                                    {composer.birth?.slice(0, 4) || '?'}
                                                    {composer.death ? ` - ${composer.death.slice(0, 4)}` : ''}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-500">
                                                    {isKo ? EPOCH_KO[composer.epoch] || composer.epoch : composer.epoch}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFollow(composerKey);
                                                    }}
                                                    className={`p-1.5 rounded-full transition-colors ${
                                                        isFollowed
                                                            ? 'text-red-500 hover:bg-red-50'
                                                            : 'text-gray-400 hover:bg-gray-100 hover:text-red-400'
                                                    }`}
                                                >
                                                    <Heart
                                                        className="h-4 w-4"
                                                        fill={isFollowed ? "currentColor" : "none"}
                                                        strokeWidth={isFollowed ? 0 : 1.5}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-20 lg:py-40 text-center border border-dashed border-gray-300 mx-4 sm:mx-0">
                            <p className="text-gray-400">
                                {isSearching
                                    ? isKo ? '검색 결과가 없습니다.' : 'No results found.'
                                    : isKo ? '작곡가 정보가 없습니다.' : 'No composers found.'}
                            </p>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-16">
                            <Button
                                variant="ghost"
                                className="flex items-center gap-1 p-2"
                                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft strokeWidth={2} className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center gap-1">
                                {getPageNumbers().map((pageNum) => (
                                    <Button
                                        key={pageNum}
                                        variant={currentPage === pageNum ? "default" : "ghost"}
                                        size="sm"
                                        className={`w-8 h-8 p-0 ${currentPage === pageNum ? "bg-black text-white" : "text-gray-600"}`}
                                        onClick={() => setCurrentPage(pageNum)}
                                    >
                                        {pageNum}
                                    </Button>
                                ))}
                            </div>
                            <Button
                                variant="ghost"
                                className="flex items-center gap-1 p-2"
                                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight strokeWidth={2} className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* ===== 지휘자 탭 ===== */}
            {activeTopTab === 'conductors' && (
                <>
                    {!conductorsLoading && (
                        <div className="flex items-center justify-between mb-4 px-4 sm:px-0">
                            <span className="text-xs text-gray-400">
                                {isKo
                                    ? `총 ${conductors.length}명의 지휘자`
                                    : `${conductors.length} conductors`}
                            </span>
                        </div>
                    )}

                    {conductorsLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            <span className="ml-2 text-sm text-gray-500">
                                {isKo ? '지휘자 정보를 불러오는 중...' : 'Loading conductors...'}
                            </span>
                        </div>
                    ) : conductors.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0">
                            {conductors.map(renderArtistCard)}
                        </div>
                    ) : (
                        <div className="py-20 lg:py-40 text-center border border-dashed border-gray-300 mx-4 sm:mx-0">
                            <p className="text-gray-400">
                                {isKo ? '지휘자 정보가 없습니다.' : 'No conductors found.'}
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* ===== 연주자 탭 ===== */}
            {activeTopTab === 'performers' && (
                <>
                    {!performersLoading && (
                        <div className="flex items-center justify-between mb-4 px-4 sm:px-0">
                            <span className="text-xs text-gray-400">
                                {isKo
                                    ? `총 ${performers.length}명의 연주자`
                                    : `${performers.length} performers`}
                            </span>
                        </div>
                    )}

                    {performersLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            <span className="ml-2 text-sm text-gray-500">
                                {isKo ? '연주자 정보를 불러오는 중...' : 'Loading performers...'}
                            </span>
                        </div>
                    ) : performers.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0">
                            {performers.map(renderArtistCard)}
                        </div>
                    ) : (
                        <div className="py-20 lg:py-40 text-center border border-dashed border-gray-300 mx-4 sm:mx-0">
                            <p className="text-gray-400">
                                {isKo ? '연주자 정보가 없습니다.' : 'No performers found.'}
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ArtistList;
