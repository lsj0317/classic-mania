'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLearnStore } from '@/stores/learnStore';
import { useLanguageStore } from '@/stores/languageStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Music, ListMusic, Play, ChevronRight, Star, Youtube } from 'lucide-react';
import type { DifficultyLevel } from '@/types';

const DIFFICULTY_COLOR: Record<DifficultyLevel, string> = {
    '입문': 'bg-green-100 text-green-700',
    '초급': 'bg-blue-100 text-blue-700',
    '중급': 'bg-orange-100 text-orange-700',
    '고급': 'bg-red-100 text-red-700',
};

const EPOCH_KO: Record<string, string> = {
    Medieval: '중세', Renaissance: '르네상스', Baroque: '바로크',
    Classical: '고전주의', 'Early Romantic': '초기 낭만', Romantic: '낭만주의',
    'Late Romantic': '후기 낭만', '20th Century': '20세기',
};

export default function LearnPage() {
    const router = useRouter();
    const { language } = useLanguageStore();
    const { workGuides, playlists, fetchData } = useLearnStore();
    const [activeTab, setActiveTab] = useState<'guides' | 'playlists' | 'videos'>('guides');
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | '전체'>('전체');
    const isKo = language === 'ko';

    useEffect(() => { fetchData(); }, [fetchData]);

    const filteredGuides = difficultyFilter === '전체'
        ? workGuides
        : workGuides.filter(g => g.difficulty === difficultyFilter);

    const tabs = [
        { key: 'guides' as const, label: isKo ? '작품 해설' : 'Work Guides', icon: BookOpen },
        { key: 'playlists' as const, label: isKo ? '추천 플레이리스트' : 'Playlists', icon: ListMusic },
        { key: 'videos' as const, label: isKo ? '추천 영상' : 'Videos', icon: Youtube },
    ];

    return (
        <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 py-8">
            {/* 헤더 */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                    <Music className="h-7 w-7 text-primary" />
                    {isKo ? '클래식 음악 학습 허브' : 'Classic Music Learning Hub'}
                </h1>
                <p className="text-muted-foreground mt-2">
                    {isKo
                        ? '작곡가별 대표곡 가이드, 입문자 추천 플레이리스트, 작품 해설을 만나보세요.'
                        : 'Explore composer guides, curated playlists, and work commentaries.'}
                </p>
            </div>

            {/* 탭 */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
                            activeTab === tab.key
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background text-muted-foreground border-border hover:bg-accent'
                        }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 작품 해설 탭 */}
            {activeTab === 'guides' && (
                <div>
                    {/* 난이도 필터 */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {(['전체', '입문', '초급', '중급', '고급'] as const).map(level => (
                            <button
                                key={level}
                                onClick={() => setDifficultyFilter(level)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                    difficultyFilter === level
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-background text-muted-foreground border-border hover:bg-accent'
                                }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredGuides.map(guide => (
                            <Card
                                key={guide.id}
                                className="cursor-pointer hover:shadow-md transition-shadow group"
                                onClick={() => router.push(`/learn?guide=${guide.id}`)}
                            >
                                <CardContent className="p-5">
                                    <div className="flex gap-4">
                                        {guide.thumbnail && (
                                            <img
                                                src={guide.thumbnail}
                                                alt={guide.composerName}
                                                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${DIFFICULTY_COLOR[guide.difficulty]}`}>
                                                    {guide.difficulty}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {isKo ? EPOCH_KO[guide.epoch] || guide.epoch : guide.epoch}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-sm group-hover:text-primary transition-colors truncate">
                                                {guide.title}
                                            </h3>
                                            {guide.subtitle && (
                                                <p className="text-xs text-muted-foreground">{guide.subtitle}</p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {guide.composerName} · {guide.duration}
                                            </p>
                                        </div>
                                    </div>

                                    {/* 감상 포인트 미리보기 */}
                                    <div className="mt-3 pl-2 border-l-2 border-primary/20">
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {guide.background}
                                        </p>
                                    </div>

                                    {/* 감상 포인트 */}
                                    <div className="mt-3">
                                        <p className="text-[11px] font-semibold text-primary mb-1">
                                            {isKo ? '감상 포인트' : 'Listening Points'}
                                        </p>
                                        <ul className="space-y-1">
                                            {guide.listeningPoints.slice(0, 2).map((point, i) => (
                                                <li key={i} className="text-[11px] text-muted-foreground flex gap-1.5">
                                                    <Star className="h-3 w-3 flex-shrink-0 mt-0.5 text-amber-400" />
                                                    <span className="line-clamp-1">{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* YouTube 링크 */}
                                    {guide.youtubeVideoId && (
                                        <a
                                            href={`https://www.youtube.com/watch?v=${guide.youtubeVideoId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={e => e.stopPropagation()}
                                            className="mt-3 flex items-center gap-2 text-xs text-red-600 hover:text-red-700 font-medium"
                                        >
                                            <Play className="h-3.5 w-3.5" />
                                            {isKo ? '추천 연주 영상 보기' : 'Watch recommended performance'}
                                        </a>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* 플레이리스트 탭 */}
            {activeTab === 'playlists' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {playlists.map(playlist => (
                        <Card key={playlist.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                            <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                                <img
                                    src={playlist.thumbnail}
                                    alt={playlist.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-3 left-3 right-3">
                                    <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-bold text-white">
                                        {playlist.category}
                                    </span>
                                    <h3 className="text-white font-bold text-sm mt-1 line-clamp-2">{playlist.title}</h3>
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{playlist.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-muted-foreground">
                                        {playlist.tracks.length}{isKo ? '곡' : ' tracks'}
                                    </span>
                                    <Button variant="ghost" size="sm" className="text-xs gap-1 h-7">
                                        {isKo ? '곡 목록' : 'Track List'} <ChevronRight className="h-3 w-3" />
                                    </Button>
                                </div>

                                {/* 트랙 목록 */}
                                <div className="mt-3 space-y-2">
                                    {playlist.tracks.slice(0, 5).map((track, i) => (
                                        <div key={track.id} className="flex items-center gap-2 text-xs">
                                            <span className="text-muted-foreground/50 w-4 text-right">{i + 1}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="truncate font-medium">{track.title}</p>
                                                <p className="text-muted-foreground text-[10px]">{track.composerName}</p>
                                            </div>
                                            <span className="text-muted-foreground text-[10px]">{track.duration}</span>
                                            {track.youtubeVideoId && (
                                                <a
                                                    href={`https://www.youtube.com/watch?v=${track.youtubeVideoId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <Play className="h-3 w-3" />
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                    {playlist.tracks.length > 5 && (
                                        <p className="text-[10px] text-muted-foreground text-center">
                                            +{playlist.tracks.length - 5}{isKo ? '곡 더' : ' more'}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* 추천 영상 탭 */}
            {activeTab === 'videos' && (
                <div>
                    <p className="text-sm text-muted-foreground mb-6">
                        {isKo
                            ? '작품 해설에서 추천된 연주 영상들을 모아보았습니다.'
                            : 'Recommended performance videos from our work guides.'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {workGuides.filter(g => g.youtubeVideoId).map(guide => (
                            <Card key={guide.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                <a
                                    href={`https://www.youtube.com/watch?v=${guide.youtubeVideoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <div className="relative aspect-video bg-muted overflow-hidden">
                                        <img
                                            src={`https://img.youtube.com/vi/${guide.youtubeVideoId}/hqdefault.jpg`}
                                            alt={guide.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                                                <Play className="h-5 w-5 text-white ml-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                </a>
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${DIFFICULTY_COLOR[guide.difficulty]}`}>
                                            {guide.difficulty}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-sm line-clamp-1">{guide.title}</h4>
                                    <p className="text-xs text-muted-foreground">{guide.composerName}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
