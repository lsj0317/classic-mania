'use client';

import { useParams, useRouter } from 'next/navigation';
import { useUserStore, ALL_BADGES } from '@/stores/userStore';
import { useArtistStore } from '@/stores/artistStore';
import { useReviewStore } from '@/stores/reviewStore';
import { posts, currentUser } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, UserPlus, UserCheck, Star, Award, Theater, CalendarDays, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export default function ProfilePage() {
    const params = useParams();
    const router = useRouter();
    const userId = params?.userId as string;

    const { getActivityByUserId, isFollowingUser, followUser, unfollowUser, currentUserId } = useUserStore();
    const { artists } = useArtistStore();
    const { reviews } = useReviewStore();

    const isMe = userId === currentUserId;
    const activity = getActivityByUserId(userId);

    // 프로필 기본 정보 (mock)
    const profileInfo = userId === currentUser.userId
        ? currentUser
        : { userId, name: userId, nickname: userId, profileImage: undefined };

    const isFollowing = isFollowingUser(userId);

    // 유저 게시글
    const userPosts = posts.filter((p) => p.authorId === userId).slice(0, 5);
    // 유저 리뷰
    const userReviews = reviews.filter((r) => r.userId === userId).slice(0, 3);
    // 팔로우 아티스트
    const followedArtists = artists.filter((a) => {
        // 현재 유저의 경우 artistStore에서 가져옴
        if (isMe) return false;
        return false;
    });

    // 장르 차트 데이터
    const genreData = Object.entries(activity.genreStats || {})
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

    // 월별 차트 데이터
    const monthlyData = Object.entries(activity.monthlyStats || {})
        .map(([month, count]) => ({ month: month.slice(5), count }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-6);

    const earnedBadges = ALL_BADGES.filter((b) => activity.earnedBadges.includes(b.id));

    // 샘플 활동 데이터 (mujuki 유저)
    const displayActivity = isMe
        ? {
            ...activity,
            reviewCount: activity.reviewCount || userReviews.length || 3,
            postCount: activity.postCount || userPosts.length || 5,
            followCount: activity.followCount || 2,
            followerIds: activity.followerIds?.length ? activity.followerIds : ['user2', 'user3'],
            followingIds: activity.followingIds?.length ? activity.followingIds : ['user4'],
            genreStats: Object.keys(activity.genreStats || {}).length
                ? activity.genreStats
                : { 클래식: 8, 오페라: 3, 발레: 2 },
            monthlyStats: Object.keys(activity.monthlyStats || {}).length
                ? activity.monthlyStats
                : { '01': 3, '02': 2, '03': 4, '04': 1, '05': 3, '06': 2 },
            earnedBadges: activity.earnedBadges.length
                ? activity.earnedBadges
                : ['first_review', 'first_follow', 'review_10'],
        }
        : activity;

    const displayGenreData = Object.entries(displayActivity.genreStats || {})
        .map(([name, value]) => ({ name, value: value as number }))
        .sort((a, b) => b.value - a.value);

    const displayMonthlyData = Object.entries(displayActivity.monthlyStats || {})
        .map(([month, count]) => ({ month: `${month}월`, count: count as number }))
        .sort((a, b) => a.month.localeCompare(b.month));

    const displayBadges = ALL_BADGES.filter((b) =>
        (displayActivity.earnedBadges || []).includes(b.id)
    );

    return (
        <div className="container mx-auto max-w-screen-lg px-4 py-8">
            <Button
                variant="ghost"
                className="mb-6 flex items-center gap-2 text-gray-600"
                onClick={() => router.back()}
            >
                <ArrowLeft className="w-4 h-4" />
                뒤로가기
            </Button>

            {/* 프로필 헤더 */}
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex items-start gap-5">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            {profileInfo.profileImage ? (
                                <img
                                    src={profileInfo.profileImage}
                                    alt={profileInfo.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                                    {profileInfo.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div>
                                    <h1 className="text-xl font-bold">{profileInfo.nickname || profileInfo.name}</h1>
                                    <p className="text-sm text-muted-foreground">@{profileInfo.userId}</p>
                                </div>
                                {!isMe && (
                                    <Button
                                        variant={isFollowing ? 'outline' : 'default'}
                                        size="sm"
                                        className="flex items-center gap-2"
                                        onClick={() =>
                                            isFollowing ? unfollowUser(userId) : followUser(userId)
                                        }
                                    >
                                        {isFollowing ? (
                                            <><UserCheck className="h-4 w-4" /> 팔로잉</>
                                        ) : (
                                            <><UserPlus className="h-4 w-4" /> 팔로우</>
                                        )}
                                    </Button>
                                )}
                            </div>

                            {/* 통계 */}
                            <div className="flex gap-6 mt-4">
                                <div className="text-center">
                                    <p className="text-xl font-bold">{displayActivity.reviewCount}</p>
                                    <p className="text-xs text-muted-foreground">리뷰</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold">{(displayActivity.followerIds || []).length}</p>
                                    <p className="text-xs text-muted-foreground">팔로워</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold">{(displayActivity.followingIds || []).length}</p>
                                    <p className="text-xs text-muted-foreground">팔로잉</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold">{displayActivity.postCount}</p>
                                    <p className="text-xs text-muted-foreground">게시글</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 획득 배지 */}
                <Card>
                    <CardContent className="p-5">
                        <h2 className="font-bold mb-4 flex items-center gap-2">
                            <Award className="h-4 w-4 text-muted-foreground" />
                            활동 배지
                            <Badge variant="secondary">{displayBadges.length}/{ALL_BADGES.length}</Badge>
                        </h2>
                        {displayBadges.length === 0 ? (
                            <p className="text-sm text-muted-foreground">아직 획득한 배지가 없습니다</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {displayBadges.map((badge) => (
                                    <div
                                        key={badge.id}
                                        title={badge.description}
                                        className={cn(
                                            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
                                            badge.color
                                        )}
                                    >
                                        <span>{badge.icon}</span>
                                        <span>{badge.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* 장르별 통계 */}
                <Card>
                    <CardContent className="p-5">
                        <h2 className="font-bold mb-4 flex items-center gap-2"><Theater className="h-4 w-4 text-muted-foreground" />장르별 관람 통계</h2>
                        {displayGenreData.length === 0 ? (
                            <p className="text-sm text-muted-foreground">관람 기록이 없습니다</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={displayGenreData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={70}
                                        label={false}
                                        labelLine={false}
                                    >
                                        {displayGenreData.map((_, idx) => (
                                            <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* 월별 통계 */}
                <Card>
                    <CardContent className="p-5">
                        <h2 className="font-bold mb-4 flex items-center gap-2"><CalendarDays className="h-4 w-4 text-muted-foreground" />월별 관람 통계</h2>
                        {displayMonthlyData.length === 0 ? (
                            <p className="text-sm text-muted-foreground">관람 기록이 없습니다</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={displayMonthlyData}>
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="count" name="관람 수" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* 최근 게시글 */}
                <Card>
                    <CardContent className="p-5">
                        <h2 className="font-bold mb-4 flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" />최근 게시글</h2>
                        {userPosts.length === 0 ? (
                            <p className="text-sm text-muted-foreground">작성한 게시글이 없습니다</p>
                        ) : (
                            <ul className="space-y-2">
                                {userPosts.map((post) => (
                                    <li
                                        key={post.id}
                                        className="cursor-pointer hover:bg-gray-50 rounded p-2 transition-colors"
                                        onClick={() => router.push(`/board/${post.id}`)}
                                    >
                                        <p className="text-sm font-medium truncate">{post.title}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <Badge variant="secondary" className="text-[10px] px-1 py-0">
                                                {post.category}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">{post.createdAt}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* 최근 리뷰 */}
            {userReviews.length > 0 && (
                <Card className="mt-6">
                    <CardContent className="p-5">
                        <h2 className="font-bold mb-4 flex items-center gap-2"><Star className="h-4 w-4 text-muted-foreground" />최근 공연 리뷰</h2>
                        <div className="space-y-3">
                            {userReviews.map((review) => (
                                <div key={review.id} className="border border-gray-100 rounded-lg p-3">
                                    <div className="flex items-center gap-1 mb-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={cn(
                                                    'h-4 w-4',
                                                    i < review.rating
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-200'
                                                )}
                                            />
                                        ))}
                                        <span className="text-xs text-muted-foreground ml-1">
                                            {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 line-clamp-2">{review.content}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
