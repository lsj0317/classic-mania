import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Music, BookOpen, Video, Loader2 } from "lucide-react";
import { useComposersByIds, useComposerWorks, useComposerGenres } from '../../hooks/useOpenOpusQueries';
import { useYoutubeSearch } from '../../hooks/useYoutubeSearch';
import { useLanguageStore } from '../../stores/languageStore';

const EPOCH_KO: Record<string, string> = {
    Medieval: "중세", Renaissance: "르네상스", Baroque: "바로크",
    Classical: "고전주의", "Early Romantic": "초기 낭만", Romantic: "낭만주의",
    "Late Romantic": "후기 낭만", "20th Century": "20세기",
    "Post-War": "전후", "21st Century": "21세기",
};

const GENRE_KO: Record<string, string> = {
    Popular: "인기 작품", Recommended: "추천 작품", all: "전체",
    Chamber: "실내악", Keyboard: "건반", Orchestral: "관현악",
    Vocal: "성악", Stage: "무대", Concerto: "협주곡",
};

type DetailTab = 'works' | 'videos';

interface ComposerDetailProps {
    composerId: string;
}

const ComposerDetail = ({ composerId }: ComposerDetailProps) => {
    const router = useRouter();
    const { language } = useLanguageStore();
    const isKo = language === 'ko';

    const [selectedGenre, setSelectedGenre] = useState('Popular');
    const [activeTab, setActiveTab] = useState<DetailTab>('works');

    const { data: composers = [], isLoading: composerLoading } = useComposersByIds([composerId]);
    const { data: genreList = [] } = useComposerGenres(composerId);
    const { data: worksData, isLoading: worksLoading } = useComposerWorks(composerId, selectedGenre);

    const composer = composers[0] || worksData?.composer;
    const works = worksData?.works || [];

    // YouTube 검색 (영상보기 탭이 활성화될 때만)
    const { data: youtubeVideos = [], isLoading: youtubeLoading } = useYoutubeSearch(
        composer?.complete_name || '',
        activeTab === 'videos' && !!composer
    );

    if (composerLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Spinner size="md" />
                <span className="ml-3 text-gray-500 text-sm">
                    {isKo ? '작곡가 정보를 불러오는 중...' : 'Loading composer...'}
                </span>
            </div>
        );
    }

    if (!composer) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <p className="text-gray-500">{isKo ? '작곡가를 찾을 수 없습니다.' : 'Composer not found.'}</p>
                <Button variant="ghost" className="mt-4" onClick={() => router.push('/artist')}>
                    {isKo ? '목록으로 돌아가기' : 'Back to list'}
                </Button>
            </div>
        );
    }

    const availableGenres = ['Popular', 'Recommended', ...genreList.filter(g => g !== 'Popular' && g !== 'Recommended')];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    const detailTabs: { key: DetailTab; label: string; icon: typeof BookOpen }[] = [
        { key: 'works', label: isKo ? '작품목록' : 'Works', icon: BookOpen },
        { key: 'videos', label: isKo ? '영상보기' : 'Videos', icon: Video },
    ];

    return (
        <div className="container mx-auto px-0 sm:px-4 py-6 lg:py-8 max-w-screen-xl min-h-screen">
            {/* 상단 헤더 */}
            <div className="flex items-center gap-3 mb-6 lg:mb-8 px-4 sm:px-0">
                <button
                    onClick={() => router.push('/artist')}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h2 className="font-bold text-black text-xl lg:text-2xl tracking-tight">
                    {composer.complete_name}
                </h2>
            </div>

            {/* 프로필 섹션 */}
            <div className="flex flex-col md:flex-row gap-6 lg:gap-10 mb-8 lg:mb-12 px-4 sm:px-0">
                <div className="w-full md:w-[280px] lg:w-[320px] flex-shrink-0">
                    <div className="aspect-square overflow-hidden bg-gray-100 relative">
                        <img
                            src={composer.portrait}
                            alt={composer.complete_name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-black">
                            {composer.complete_name}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                            {composer.name}
                        </p>

                        <div className="flex items-center gap-1 mt-4 mb-4">
                            <span className="px-3 py-1 bg-black text-white text-xs font-medium">
                                {isKo ? '작곡가' : 'Composer'}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium">
                                {isKo ? EPOCH_KO[composer.epoch] || composer.epoch : composer.epoch}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                            <span>
                                {isKo ? '출생' : 'Born'}: {composer.birth?.slice(0, 4) || '-'}
                            </span>
                            {composer.death && (
                                <span>
                                    {isKo ? '사망' : 'Died'}: {composer.death.slice(0, 4)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-black">{works.length}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{isKo ? '작품 수' : 'Works'}</p>
                        </div>
                        <div className="w-px h-10 bg-gray-200" />
                        <div className="text-center">
                            <p className="text-2xl font-bold text-black">
                                {works.filter(w => w.popular === '1').length}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{isKo ? '인기 작품' : 'Popular'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="px-4 sm:px-0">
                <div className="border-b-2 border-black mb-6">
                    <div className="flex">
                        {detailTabs.map(tab => {
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

                {/* 작품목록 탭 */}
                {activeTab === 'works' && (
                    <>
                        {/* 장르 필터 */}
                        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
                            {availableGenres.map(genre => (
                                <button
                                    key={genre}
                                    onClick={() => setSelectedGenre(genre)}
                                    className={`px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                                        selectedGenre === genre
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {isKo ? GENRE_KO[genre] || genre : genre}
                                </button>
                            ))}
                        </div>

                        {/* 작품 리스트 */}
                        {worksLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                <span className="ml-2 text-sm text-muted-foreground">
                                    {isKo ? '작품을 불러오는 중...' : 'Loading works...'}
                                </span>
                            </div>
                        ) : works.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {works.map((work) => (
                                    <Card
                                        key={work.id}
                                        className="p-4 sm:p-5 rounded-none border border-gray-200 shadow-none hover:border-black transition-all"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                <Music className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {work.popular === '1' && (
                                                        <span className="px-2 py-0.5 text-[10px] font-bold bg-yellow-100 text-yellow-700">
                                                            {isKo ? '인기' : 'Popular'}
                                                        </span>
                                                    )}
                                                    {work.recommended === '1' && (
                                                        <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-700">
                                                            {isKo ? '추천' : 'Recommended'}
                                                        </span>
                                                    )}
                                                    <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-500">
                                                        {isKo ? GENRE_KO[work.genre] || work.genre : work.genre}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-sm sm:text-base text-black leading-tight">
                                                    {work.title}
                                                </h4>
                                                {work.subtitle && (
                                                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
                                                        {work.subtitle}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 text-center border border-dashed border-gray-300">
                                <Music className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-400 text-sm">
                                    {isKo ? '해당 장르의 작품이 없습니다.' : 'No works found in this genre.'}
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* 영상보기 탭 */}
                {activeTab === 'videos' && (
                    <div>
                        {youtubeLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                <span className="ml-2 text-sm text-gray-500">
                                    {isKo ? '영상을 불러오는 중...' : 'Loading videos...'}
                                </span>
                            </div>
                        ) : youtubeVideos.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {youtubeVideos.map((video) => (
                                    <Card
                                        key={video.videoId}
                                        className="overflow-hidden rounded-none border border-gray-200 shadow-none hover:border-black hover:shadow-md transition-all cursor-pointer group"
                                        onClick={() => window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank')}
                                    >
                                        <div className="relative aspect-video overflow-hidden bg-gray-100">
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                                                    <div className="w-0 h-0 border-l-[16px] border-l-white border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h4 className="font-bold text-sm text-black leading-tight line-clamp-2 mb-1">
                                                {video.title}
                                            </h4>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span className="truncate">{video.channelTitle}</span>
                                                <span className="flex-shrink-0 ml-2">{formatDate(video.publishedAt)}</span>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 text-center border border-dashed border-gray-300">
                                <Video className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-400 text-sm">
                                    {isKo ? '관련 영상이 없습니다.' : 'No related videos found.'}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComposerDetail;
