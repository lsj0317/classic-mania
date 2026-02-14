import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search, Heart, ChevronLeft, ChevronRight, Music, Loader2 } from "lucide-react";
import { useArtistStore } from '../../stores/artistStore';
import { useLanguageStore } from '../../stores/languageStore';
import { usePopularComposers, useComposerSearch } from '../../hooks/useOpenOpusQueries';

const EPOCH_KO: Record<string, string> = {
    Medieval: "중세", Renaissance: "르네상스", Baroque: "바로크",
    Classical: "고전주의", "Early Romantic": "초기 낭만", Romantic: "낭만주의",
    "Late Romantic": "후기 낭만", "20th Century": "20세기",
    "Post-War": "전후", "21st Century": "21세기",
};

const ITEMS_PER_PAGE = 8;

type ViewMode = 'artists' | 'composers';

const ArtistList = () => {
    const navigate = useNavigate();
    const { language } = useLanguageStore();
    const {
        sortBy,
        searchTerm,
        currentPage,
        followedArtistIds,
        setSortBy,
        setSearchTerm,
        setCurrentPage,
        toggleFollow,
        getFilteredArtists,
    } = useArtistStore();

    const [localSearch, setLocalSearch] = React.useState(searchTerm);
    const [viewMode, setViewMode] = useState<ViewMode>('artists');
    const [composerSearch, setComposerSearch] = useState('');

    const filteredArtists = getFilteredArtists();
    const { data: popularComposers = [], isLoading: composersLoading } = usePopularComposers();
    const { data: searchedComposers = [], isLoading: searchLoading } = useComposerSearch(composerSearch);

    const displayComposers = composerSearch.length >= 2 ? searchedComposers : popularComposers;
    const isComposerLoading = composerSearch.length >= 2 ? searchLoading : composersLoading;

    const totalPages = Math.ceil(filteredArtists.length / ITEMS_PER_PAGE);
    const paginatedArtists = filteredArtists.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSearch = () => {
        setSearchTerm(localSearch);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    const isKo = language === 'ko';

    return (
        <div className="container mx-auto px-0 sm:px-4 py-6 lg:py-8 max-w-screen-xl min-h-screen">
            {/* 헤더 섹션 */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 lg:gap-6 mb-8 lg:mb-12 border-b-2 border-black pb-4 lg:pb-6 px-4 sm:px-0">
                <div className="flex-1">
                    <h2 className="font-bold text-black tracking-tighter mb-1 lg:mb-2 text-xl lg:text-3xl">
                        {isKo ? '아티스트 & 작곡가' : 'Artists & Composers'}
                    </h2>
                    <p className="text-gray-600 font-normal text-sm">
                        {isKo
                            ? '클래식 음악계를 빛내는 아티스트와 작곡가들을 만나보세요.'
                            : 'Discover the artists and composers who illuminate the world of classical music.'}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
                    {viewMode === 'artists' && (
                        <div className="w-full sm:w-44">
                            <Select
                                value={sortBy}
                                onValueChange={(val) => setSortBy(val as 'name' | 'likes' | 'performances')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={isKo ? '정렬' : 'Sort'} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">{isKo ? '가나다순' : 'Alphabetical'}</SelectItem>
                                    <SelectItem value="likes">{isKo ? '좋아요 많은 순' : 'Most Liked'}</SelectItem>
                                    <SelectItem value="performances">{isKo ? '공연 많은 순' : 'Most Performances'}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <div className="relative w-full sm:w-80">
                        <Input
                            type="text"
                            placeholder={
                                viewMode === 'artists'
                                    ? isKo ? '아티스트 검색 (이름, 초성, 영문)' : 'Search artists'
                                    : isKo ? '작곡가 검색 (영문)' : 'Search composers'
                            }
                            value={viewMode === 'artists' ? localSearch : composerSearch}
                            onChange={(e) => {
                                if (viewMode === 'artists') {
                                    setLocalSearch(e.target.value);
                                } else {
                                    setComposerSearch(e.target.value);
                                }
                            }}
                            onKeyDown={viewMode === 'artists' ? handleKeyDown : undefined}
                            className="pr-10"
                        />
                        <Search
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 cursor-pointer hover:text-black text-gray-400"
                            onClick={viewMode === 'artists' ? handleSearch : undefined}
                        />
                    </div>
                </div>
            </div>

            {/* 뷰 모드 탭 */}
            <div className="flex gap-2 mb-6 px-4 sm:px-0">
                <button
                    onClick={() => setViewMode('artists')}
                    className={`px-5 py-2 text-sm font-semibold transition-colors rounded-full border ${
                        viewMode === 'artists'
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    {isKo ? '아티스트' : 'Artists'}
                </button>
                <button
                    onClick={() => setViewMode('composers')}
                    className={`px-5 py-2 text-sm font-semibold transition-colors rounded-full border ${
                        viewMode === 'composers'
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    {isKo ? '작곡가 (Open Opus)' : 'Composers (Open Opus)'}
                </button>
            </div>

            {/* ═══════════════ 아티스트 뷰 ═══════════════ */}
            {viewMode === 'artists' && (
                <>
                    {paginatedArtists.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0">
                            {paginatedArtists.map((artist) => {
                                const isFollowed = followedArtistIds.includes(artist.id);
                                return (
                                    <Card
                                        key={artist.id}
                                        className="group overflow-hidden border border-gray-200 shadow-none hover:border-black hover:shadow-md transition-all cursor-pointer rounded-none"
                                    >
                                        <div
                                            className="relative aspect-square overflow-hidden bg-gray-100"
                                            onClick={() => navigate(`/artist/${artist.id}`)}
                                        >
                                            <img
                                                src={artist.profileImage}
                                                alt={artist.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
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
                                                <span className="flex items-center gap-1">
                                                    <Heart className="h-3.5 w-3.5" fill={isFollowed ? "currentColor" : "none"} />
                                                    {artist.likes.toLocaleString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Music className="h-3.5 w-3.5" />
                                                    {artist.performanceCount}
                                                </span>
                                            </div>
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
                                                    className="h-5 w-5"
                                                    fill={isFollowed ? "currentColor" : "none"}
                                                    strokeWidth={isFollowed ? 0 : 1.5}
                                                />
                                            </button>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-20 lg:py-40 text-center border border-dashed border-gray-300 mx-4 sm:mx-0">
                            <p className="text-gray-400">
                                {isKo ? '검색 결과가 없습니다.' : 'No results found.'}
                            </p>
                        </div>
                    )}

                    {/* 페이지네이션 */}
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
                                {[...Array(totalPages)].map((_, index) => {
                                    const pageNum = index + 1;
                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? "default" : "ghost"}
                                            size="sm"
                                            className={`w-8 h-8 p-0 ${currentPage === pageNum ? "bg-black text-white" : "text-gray-600"}`}
                                            onClick={() => setCurrentPage(pageNum)}
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}
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

            {/* ═══════════════ 작곡가 뷰 (Open Opus) ═══════════════ */}
            {viewMode === 'composers' && (
                <>
                    {isComposerLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            <span className="ml-2 text-sm text-gray-500">
                                {isKo ? '작곡가 정보를 불러오는 중...' : 'Loading composers...'}
                            </span>
                        </div>
                    ) : displayComposers.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0">
                            {displayComposers.map((composer) => (
                                <Card
                                    key={composer.id}
                                    className="group overflow-hidden border border-gray-200 shadow-none hover:border-black hover:shadow-md transition-all cursor-pointer rounded-none"
                                    onClick={() => navigate(`/artist/composer-${composer.id}`)}
                                >
                                    <div className="relative aspect-square overflow-hidden bg-gray-100">
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
                                        <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-500">
                                            {isKo ? '작곡가' : 'Composer'}
                                        </span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 lg:py-40 text-center border border-dashed border-gray-300 mx-4 sm:mx-0">
                            <p className="text-gray-400">
                                {composerSearch.length >= 2
                                    ? isKo ? '검색 결과가 없습니다.' : 'No results found.'
                                    : isKo ? '작곡가 이름을 검색해주세요 (최소 2글자).' : 'Search for a composer (min 2 characters).'}
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ArtistList;
