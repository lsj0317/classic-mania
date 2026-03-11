'use client';

import { useUserStore, ALL_BADGES } from '@/stores/userStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ActivityBadges() {
    const { getEarnedBadges, getLockedBadges, activity } = useUserStore();
    const earned = getEarnedBadges();
    const locked = getLockedBadges();

    return (
        <Card className="shadow-sm border border-gray-100">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Award className="h-5 w-5 text-muted-foreground" />
                        활동 배지
                    </h3>
                    <Badge variant="secondary" className="text-sm">
                        {earned.length} / {ALL_BADGES.length}
                    </Badge>
                </div>

                {/* 획득한 배지 */}
                {earned.length > 0 && (
                    <div className="mb-6">
                        <p className="text-sm font-semibold text-gray-700 mb-3">획득한 배지</p>
                        <div className="flex flex-wrap gap-2">
                            {earned.map((badge) => (
                                <div
                                    key={badge.id}
                                    title={badge.description}
                                    className={cn(
                                        'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium cursor-help',
                                        badge.color
                                    )}
                                >
                                    <span className="text-lg">{badge.icon}</span>
                                    <div>
                                        <p className="font-semibold leading-none">{badge.name}</p>
                                        <p className="text-[10px] mt-0.5 opacity-75">{badge.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 잠긴 배지 */}
                {locked.length > 0 && (
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-3">획득 가능한 배지</p>
                        <div className="flex flex-wrap gap-2">
                            {locked.map((badge) => (
                                <div
                                    key={badge.id}
                                    title={badge.description}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm bg-gray-100 text-gray-400 cursor-help opacity-60"
                                >
                                    <Lock className="h-4 w-4 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold leading-none">{badge.name}</p>
                                        <p className="text-[10px] mt-0.5">{badge.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {earned.length === 0 && locked.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        공연 리뷰 작성, 아티스트 팔로우 등 활동을 통해 배지를 획득하세요!
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
