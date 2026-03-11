'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ImageIcon, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecommendationStore } from '@/stores/recommendationStore';
import { useArtistStore } from '@/stores/artistStore';
import { useReviewStore } from '@/stores/reviewStore';
import { useUserStore } from '@/stores/userStore';
import { cn } from '@/lib/utils';
import type { Performance } from '@/types';

interface Props {
    allPerformances: Performance[];
}

const STATUS_COLOR: Record<string, string> = {
    '공연중': 'bg-green-500',
    '공연예정': 'bg-blue-500',
    '공연완료': 'bg-gray-400',
};

export default function RecommendationSection({ allPerformances }: Props) {
    const router = useRouter();
    const { followedArtistIds, artists } = useArtistStore();
    const { reviews } = useReviewStore();
    const { getPreferredEpochs } = useUserStore();
    const { recommendations, isLoading, generateRecommendations } = useRecommendationStore();

    const reviewedPerformanceIds = reviews.map((r) => r.performanceId);
    const preferredEpochs = getPreferredEpochs();

    // 팔로우 아티스트 이름 목록
    const followedArtistNames = artists
        .filter((a) => followedArtistIds.includes(a.id))
        .map((a) => a.name);

    useEffect(() => {
        if (allPerformances.length > 0 && recommendations.length === 0) {
            generateRecommendations(
                followedArtistNames,
                reviewedPerformanceIds,
                preferredEpochs,
                allPerformances
            );
        }
    }, [allPerformances.length]);

    const handleRefresh = () => {
        generateRecommendations(
            followedArtistNames,
            reviewedPerformanceIds,
            preferredEpochs,
            allPerformances
        );
    };

    if (isLoading) {
        return (
            <section className="container mx-auto max-w-screen-xl px-4 sm:px-6 mt-12">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        당신을 위한 공연
                    </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[0, 1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardContent className="p-3">
                                <Skeleton className="aspect-[3/4] rounded mb-2" />
                                <Skeleton className="h-3 w-3/4 mb-1" />
                                <Skeleton className="h-3 w-1/2" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        );
    }

    if (recommendations.length === 0) return null;

    return (
        <section className="container mx-auto max-w-screen-xl px-4 sm:px-6 mt-12">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        당신을 위한 공연
                    </h3>
                    {followedArtistNames.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                            팔로우한 아티스트 및 관람 이력 기반 추천
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleRefresh} className="flex items-center gap-1 text-sm">
                        <RefreshCw className="h-4 w-4" />
                        새로고침
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="font-bold text-sm"
                        onClick={() => router.push('/performance')}
                    >
                        더보기 +
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {recommendations.slice(0, 8).map(({ performance, reason }) => (
                    <Card
                        key={performance.id}
                        className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden group"
                        onClick={() => router.push(`/performance/${performance.id}`)}
                    >
                        <CardContent className="p-0">
                            <div className="relative aspect-[3/4] bg-muted">
                                {performance.poster ? (
                                    <img
                                        src={performance.poster}
                                        alt={performance.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                                    </div>
                                )}
                                <div className="absolute top-2 left-2">
                                    <Badge
                                        className={cn(
                                            'text-white text-[10px] px-1.5 py-0',
                                            STATUS_COLOR[performance.status] || 'bg-gray-400'
                                        )}
                                    >
                                        {performance.status}
                                    </Badge>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                    <p className="text-[10px] text-yellow-300 flex items-center gap-0.5">
                                        <Sparkles className="h-3 w-3" />
                                        {reason}
                                    </p>
                                </div>
                            </div>
                            <div className="p-2">
                                <p className="text-xs font-semibold line-clamp-2 leading-tight">{performance.title}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{performance.place}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
