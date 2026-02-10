import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
    ArrowLeft,
    Heart,
    Music,
    Newspaper,
    MessageCircle,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Send,
    Calendar,
    MapPin,
} from "lucide-react";
import { useArtistStore } from '../../stores/artistStore';
import { useLanguageStore } from '../../stores/languageStore';
import { currentUser } from '../../data/mockData';
import type { NewsItem } from '../../api/newsApi';

type TabType = 'performances' | 'news' | 'cheers';

const CHEER_PAGE_SIZE = 10;

const ArtistDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { language } = useLanguageStore();
    const isKo = language === 'ko';

    const {
        artists,
        followedArtistIds,
        toggleFollow,
        fetchArtistPerformances,
        fetchArtistNews,
        artistPerformances,
        performancesLoading,
        performanceFilter,
        setPerformanceFilter,
        artistNews,
        newsLoading,
        getCheerMessages,
        addCheerMessage,
        cheerCurrentPage,
        setCheerCurrentPage,
    } = useArtistStore();

    const [activeTab, setActiveTab] = useState<TabType>('performances');
    const [cheerInput, setCheerInput] = useState('');

    const artist = artists.find(a => a.id === id);
    const isFollowed = followedArtistIds.includes(id || '');

    useEffect(() => {
        if (artist) {
            fetchArtistPerformances(artist.name);
            fetchArtistNews(artist.name);
        }
    }, [artist, fetchArtistPerformances, fetchArtistNews]);

    // 탭 변경 시 응원 페이지 리셋
    useEffect(() => {
        if (activeTab === 'cheers') {
            setCheerCurrentPage(1);
        }
    }, [activeTab, setCheerCurrentPage]);

    if (!artist) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <p className="text-gray-500">{isKo ? '아티스트를 찾을 수 없습니다.' : 'Artist not found.'}</p>
                <Button variant="ghost" className="mt-4" onClick={() => navigate('/artist')}>
                    {isKo ? '목록으로 돌아가기' : 'Back to list'}
                </Button>
            </div>
        );
    }

    // 공연 필터링
    const filteredPerformances = artistPerformances.filter(p => {
        if (performanceFilter === 'upcoming') return p.status === '공연예정' || p.status === '공연중';
        if (performanceFilter === 'completed') return p.status === '공연완료';
        return true;
    });

    // 응원 메시지
    const allCheers = getCheerMessages(artist.id);
    const cheerTotalPages = Math.ceil(allCheers.length / CHEER_PAGE_SIZE);
    const paginatedCheers = allCheers.slice(
        (cheerCurrentPage - 1) * CHEER_PAGE_SIZE,
        cheerCurrentPage * CHEER_PAGE_SIZE
    );

    const handleSubmitCheer = () => {
        if (!cheerInput.trim()) return;
        if (!currentUser.userId || currentUser.userId === 'guest') {
            navigate('/login');
            return;
        }
        addCheerMessage(
            artist.id,
            currentUser.userId,
            currentUser.nickname || currentUser.name,
            currentUser.profileImage,
            cheerInput.trim()
        );
        setCheerInput('');
    };

    const handleCheerKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmitCheer();
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    const decodeHtml = (html: string) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value.replace(/<[^>]*>?/gm, '');
    };

    const tabs: { key: TabType; label: string; icon: typeof Music }[] = [
        { key: 'performances', label: isKo ? '공연정보' : 'Performances', icon: Music },
        { key: 'news', label: isKo ? '관련기사' : 'Articles', icon: Newspaper },
        { key: 'cheers', label: isKo ? '응원의 한마디' : 'Cheers', icon: MessageCircle },
    ];

    return (
        <div className="container mx-auto px-0 sm:px-4 py-6 lg:py-8 max-w-screen-xl min-h-screen">
            {/* 상단 헤더 - 뒤로가기 + 이름 */}
            <div className="flex items-center gap-3 mb-6 lg:mb-8 px-4 sm:px-0">
                <button
                    onClick={() => navigate('/artist')}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h2 className="font-bold text-black text-xl lg:text-2xl tracking-tight">
                    {isKo ? artist.name : artist.nameEn}
                </h2>
            </div>

            {/* 프로필 섹션 */}
            <div className="flex flex-col md:flex-row gap-6 lg:gap-10 mb-8 lg:mb-12 px-4 sm:px-0">
                {/* 이미지 (좌측) */}
                <div className="w-full md:w-[280px] lg:w-[320px] flex-shrink-0">
                    <div className="aspect-square overflow-hidden bg-gray-100 relative">
                        <img
                            src={artist.profileImage}
                            alt={artist.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* 프로필 정보 (우측) */}
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-2xl lg:text-3xl font-bold text-black">
                                    {isKo ? artist.name : artist.nameEn}
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    {isKo ? artist.nameEn : artist.name}
                                </p>
                            </div>
                            <button
                                onClick={() => toggleFollow(artist.id)}
                                className={`p-3 rounded-full transition-all ${
                                    isFollowed
                                        ? 'text-red-500 bg-red-50 hover:bg-red-100'
                                        : 'text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-red-400'
                                }`}
                            >
                                <Heart
                                    className="h-6 w-6"
                                    fill={isFollowed ? "currentColor" : "none"}
                                    strokeWidth={isFollowed ? 0 : 1.5}
                                />
                            </button>
                        </div>

                        <div className="flex items-center gap-1 mb-4">
                            <span className="px-3 py-1 bg-black text-white text-xs font-medium">
                                {isKo ? artist.role : artist.roleEn}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium">
                                {artist.nationality}
                            </span>
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed mb-6">
                            {isKo ? artist.bio : artist.bioEn}
                        </p>
                    </div>

                    <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-black">{artist.likes.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{isKo ? '좋아요' : 'Likes'}</p>
                        </div>
                        <div className="w-px h-10 bg-gray-200" />
                        <div className="text-center">
                            <p className="text-2xl font-bold text-black">{artist.performanceCount}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{isKo ? '공연' : 'Shows'}</p>
                        </div>
                        <div className="w-px h-10 bg-gray-200" />
                        <div className="text-center">
                            <p className="text-2xl font-bold text-black">{allCheers.length}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{isKo ? '응원글' : 'Cheers'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="border-b-2 border-black mb-6 px-4 sm:px-0">
                <div className="flex">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-[2px] ${
                                    activeTab === tab.key
                                        ? 'border-black text-black'
                                        : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 탭 콘텐츠 */}
            <div className="px-4 sm:px-0">
                {/* 공연정보 탭 */}
                {activeTab === 'performances' && (
                    <div>
                        {/* 필터 */}
                        <div className="flex gap-2 mb-6">
                            {[
                                { key: 'all', label: isKo ? '전체' : 'All' },
                                { key: 'upcoming', label: isKo ? '예정공연' : 'Upcoming' },
                                { key: 'completed', label: isKo ? '지난공연' : 'Past' },
                            ].map(f => (
                                <button
                                    key={f.key}
                                    onClick={() => setPerformanceFilter(f.key as 'all' | 'upcoming' | 'completed')}
                                    className={`px-4 py-2 text-xs font-medium transition-colors ${
                                        performanceFilter === f.key
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        {performancesLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <Spinner size="md" />
                                <span className="ml-3 text-gray-500 text-sm">
                                    {isKo ? '공연 정보를 불러오는 중...' : 'Loading performances...'}
                                </span>
                            </div>
                        ) : filteredPerformances.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {filteredPerformances.map((perf) => (
                                    <Card
                                        key={perf.id}
                                        className="p-4 sm:p-5 rounded-none border border-gray-200 shadow-none hover:border-black transition-all cursor-pointer group"
                                        onClick={() => navigate(`/performance/${perf.id}`)}
                                    >
                                        <div className="flex gap-4">
                                            {perf.poster && (
                                                <img
                                                    src={perf.poster}
                                                    alt={perf.title}
                                                    className="w-16 h-20 sm:w-20 sm:h-24 object-cover flex-shrink-0"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 text-[10px] font-bold ${
                                                        perf.status === '공연예정' ? 'bg-blue-100 text-blue-700' :
                                                        perf.status === '공연중' ? 'bg-green-100 text-green-700' :
                                                        'bg-gray-100 text-gray-500'
                                                    }`}>
                                                        {perf.status}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-sm sm:text-base text-black group-hover:text-blue-700 transition-colors truncate">
                                                    {perf.title}
                                                </h4>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1.5 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {perf.place}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {perf.period}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 text-center border border-dashed border-gray-300">
                                <Music className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-400 text-sm">
                                    {isKo ? '관련 공연 정보가 없습니다.' : 'No related performances found.'}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* 관련기사 탭 */}
                {activeTab === 'news' && (
                    <div>
                        {newsLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <Spinner size="md" />
                                <span className="ml-3 text-gray-500 text-sm">
                                    {isKo ? '관련 기사를 불러오는 중...' : 'Loading articles...'}
                                </span>
                            </div>
                        ) : artistNews.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {artistNews.map((news: NewsItem, index: number) => (
                                    <Card
                                        key={index}
                                        className="p-4 sm:p-5 rounded-none border border-gray-200 shadow-none hover:border-black transition-all cursor-pointer group"
                                        onClick={() => navigate('/news/detail', { state: { news } })}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1.5">
                                                    <span className="text-[10px] sm:text-xs font-bold text-blue-600 uppercase tracking-wider">News</span>
                                                    <span className="text-[10px] sm:text-xs text-gray-400 border-l pl-3 border-gray-300">
                                                        {formatDate(news.pubDate)}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-sm sm:text-base text-black group-hover:text-blue-700 transition-colors leading-tight">
                                                    {decodeHtml(news.title)}
                                                </h4>
                                                <p className="text-gray-600 text-xs sm:text-sm mt-1.5 leading-relaxed line-clamp-2">
                                                    {decodeHtml(news.description)}
                                                </p>
                                            </div>
                                            <div className="hidden md:flex items-center">
                                                <ExternalLink className="h-4 w-4 text-gray-300 group-hover:text-black" />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 text-center border border-dashed border-gray-300">
                                <Newspaper className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-400 text-sm">
                                    {isKo ? '관련 기사가 없습니다.' : 'No related articles found.'}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* 응원의 한마디 탭 */}
                {activeTab === 'cheers' && (
                    <div>
                        {/* 응원 메시지 입력 */}
                        <div className="flex gap-3 mb-6 p-4 bg-gray-50 border border-gray-200">
                            <img
                                src={currentUser.profileImage || '/placeholder-avatar.jpg'}
                                alt={currentUser.name}
                                className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-gray-200"
                            />
                            <div className="flex-1 flex gap-2">
                                <Input
                                    type="text"
                                    placeholder={isKo ? '응원의 한마디를 남겨주세요!' : 'Leave a cheer message!'}
                                    value={cheerInput}
                                    onChange={(e) => setCheerInput(e.target.value)}
                                    onKeyDown={handleCheerKeyDown}
                                    className="flex-1 bg-white"
                                />
                                <Button
                                    size="sm"
                                    className="bg-black text-white hover:bg-gray-800 px-4"
                                    onClick={handleSubmitCheer}
                                    disabled={!cheerInput.trim()}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* 응원 메시지 목록 */}
                        {paginatedCheers.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {paginatedCheers.map((cheer) => (
                                    <div
                                        key={cheer.id}
                                        className="flex gap-3 p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                                    >
                                        <img
                                            src={cheer.userProfileImage || 'https://docs.material-tailwind.com/img/face-2.jpg'}
                                            alt={cheer.userName}
                                            className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-gray-200"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-bold text-black">{cheer.userName}</span>
                                                <span className="text-[10px] text-gray-400">
                                                    {formatDate(cheer.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 leading-relaxed">{cheer.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 text-center border border-dashed border-gray-300">
                                <MessageCircle className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-400 text-sm">
                                    {isKo ? '첫 번째 응원 메시지를 남겨보세요!' : 'Be the first to leave a cheer!'}
                                </p>
                            </div>
                        )}

                        {/* 응원 메시지 페이지네이션 */}
                        {cheerTotalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <Button
                                    variant="ghost"
                                    className="p-2"
                                    onClick={() => setCheerCurrentPage(Math.max(cheerCurrentPage - 1, 1))}
                                    disabled={cheerCurrentPage === 1}
                                >
                                    <ChevronLeft strokeWidth={2} className="h-4 w-4" />
                                </Button>
                                <div className="flex items-center gap-1">
                                    {[...Array(cheerTotalPages)].map((_, index) => {
                                        const pageNum = index + 1;
                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={cheerCurrentPage === pageNum ? "default" : "ghost"}
                                                size="sm"
                                                className={`w-8 h-8 p-0 ${cheerCurrentPage === pageNum ? "bg-black text-white" : "text-gray-600"}`}
                                                onClick={() => setCheerCurrentPage(pageNum)}
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    })}
                                </div>
                                <Button
                                    variant="ghost"
                                    className="p-2"
                                    onClick={() => setCheerCurrentPage(Math.min(cheerCurrentPage + 1, cheerTotalPages))}
                                    disabled={cheerCurrentPage === cheerTotalPages}
                                >
                                    <ChevronRight strokeWidth={2} className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArtistDetail;
