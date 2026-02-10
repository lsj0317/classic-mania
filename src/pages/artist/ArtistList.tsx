import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search, Heart, ChevronLeft, ChevronRight, Music } from "lucide-react";
import { useArtistStore } from '../../stores/artistStore';
import { useLanguageStore } from '../../stores/languageStore';

const ITEMS_PER_PAGE = 8;

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
    const filteredArtists = getFilteredArtists();

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
                        {isKo ? '아티스트' : 'Artists'}
                    </h2>
                    <p className="text-gray-600 font-normal text-sm">
                        {isKo
                            ? '클래식 음악계를 빛내는 아티스트들을 만나보세요.'
                            : 'Discover the artists who illuminate the world of classical music.'}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
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
                    <div className="relative w-full sm:w-80">
                        <Input
                            type="text"
                            placeholder={isKo ? '아티스트 검색 (이름, 초성, 영문)' : 'Search artists'}
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="pr-10"
                        />
                        <Search
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 cursor-pointer hover:text-black text-gray-400"
                            onClick={handleSearch}
                        />
                    </div>
                </div>
            </div>

            {/* 아티스트 그리드 */}
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
        </div>
    );
};

export default ArtistList;
