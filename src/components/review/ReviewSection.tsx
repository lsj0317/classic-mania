'use client';

import { useState } from 'react';
import { Star, ThumbsUp, Award, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useReviewStore } from '@/stores/reviewStore';
import { currentUser } from '@/data/mockData';
import { useRouter } from 'next/navigation';

interface ReviewSectionProps {
    performanceId: string;
    performanceTitle: string;
}

/* ───── 별점 입력 컴포넌트 ───── */
const StarRating = ({
    rating,
    onRate,
    size = 'md',
    interactive = true,
}: {
    rating: number;
    onRate?: (rating: number) => void;
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
}) => {
    const [hoverRating, setHoverRating] = useState(0);
    const sizeMap = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' };
    const iconSize = sizeMap[size];

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= (hoverRating || rating);
                return (
                    <button
                        key={star}
                        type="button"
                        disabled={!interactive}
                        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
                        onClick={() => onRate?.(star)}
                        onMouseEnter={() => interactive && setHoverRating(star)}
                        onMouseLeave={() => interactive && setHoverRating(0)}
                    >
                        <Star
                            className={`${iconSize} ${
                                filled
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-transparent text-gray-300'
                            } transition-colors`}
                        />
                    </button>
                );
            })}
        </div>
    );
};

/* ───── 메인 리뷰 섹션 ───── */
export default function ReviewSection({ performanceId, performanceTitle }: ReviewSectionProps) {
    const router = useRouter();
    const {
        addReview,
        deleteReview,
        toggleLike,
        getReviewsByPerformance,
        getAverageRating,
        getBestReview,
    } = useReviewStore();

    const [newRating, setNewRating] = useState(0);
    const [newContent, setNewContent] = useState('');
    const [showAllReviews, setShowAllReviews] = useState(false);

    const reviews = getReviewsByPerformance(performanceId);
    const averageRating = getAverageRating(performanceId);
    const bestReview = getBestReview(performanceId);
    const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

    const handleSubmit = () => {
        if (!currentUser.userId || currentUser.userId === 'guest') {
            router.push('/login');
            return;
        }
        if (newRating === 0 || !newContent.trim()) return;

        addReview({
            performanceId,
            userId: currentUser.userId,
            userName: currentUser.nickname || currentUser.name,
            userProfileImage: currentUser.profileImage,
            rating: newRating,
            content: newContent.trim(),
        });
        setNewRating(0);
        setNewContent('');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6">
            {/* ── 평균 평점 요약 ── */}
            <Card className="p-5">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-foreground">
                            {averageRating > 0 ? averageRating.toFixed(1) : '-'}
                        </p>
                        <StarRating rating={Math.round(averageRating)} interactive={false} size="sm" />
                        <p className="text-xs text-muted-foreground mt-1">
                            {reviews.length}개의 리뷰
                        </p>
                    </div>

                    <div className="flex-1 w-full sm:w-auto">
                        {/* 별점 분포 바 */}
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = reviews.filter((r) => r.rating === star).length;
                            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                            return (
                                <div key={star} className="flex items-center gap-2 text-xs">
                                    <span className="w-3 text-muted-foreground">{star}</span>
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-yellow-400 h-full rounded-full transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="w-6 text-right text-muted-foreground">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>

            {/* ── 베스트 리뷰 ── */}
            {bestReview && reviews.length >= 3 && (
                <Card className="p-5 border-l-4 border-l-yellow-400 bg-yellow-50/30">
                    <div className="flex items-center gap-2 mb-3">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="text-xs font-bold uppercase tracking-widest text-yellow-700">
                            Best Review
                        </span>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-sm font-bold text-yellow-700 shrink-0">
                            {bestReview.userName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-bold">{bestReview.userName}</span>
                                <StarRating rating={bestReview.rating} interactive={false} size="sm" />
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {bestReview.content}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span>{formatDate(bestReview.createdAt)}</span>
                                <span className="flex items-center gap-1">
                                    <ThumbsUp className="h-3 w-3" />
                                    {bestReview.likes}
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* ── 리뷰 작성 ── */}
            <Card className="p-5">
                <h4 className="text-sm font-bold mb-3">리뷰 작성</h4>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">별점</span>
                        <StarRating rating={newRating} onRate={setNewRating} size="lg" />
                        {newRating > 0 && (
                            <span className="text-sm font-bold text-yellow-600">{newRating}점</span>
                        )}
                    </div>
                    <textarea
                        placeholder={`"${performanceTitle}" 공연은 어떠셨나요? 리뷰를 남겨주세요!`}
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="w-full min-h-[80px] p-3 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        maxLength={500}
                    />
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                            {newContent.length}/500
                        </span>
                        <Button
                            size="sm"
                            className="gap-1.5"
                            onClick={handleSubmit}
                            disabled={newRating === 0 || !newContent.trim()}
                        >
                            <Send className="h-3.5 w-3.5" />
                            리뷰 등록
                        </Button>
                    </div>
                </div>
            </Card>

            {/* ── 리뷰 목록 ── */}
            {reviews.length > 0 ? (
                <div className="space-y-3">
                    {displayedReviews.map((review) => (
                        <Card key={review.id} className="p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                                    {review.userName[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold">{review.userName}</span>
                                            <StarRating rating={review.rating} interactive={false} size="sm" />
                                        </div>
                                        {review.userId === currentUser.userId && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                                                onClick={() => deleteReview(review.id)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {review.content}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-xs text-muted-foreground">
                                            {formatDate(review.createdAt)}
                                        </span>
                                        <button
                                            onClick={() => toggleLike(review.id)}
                                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <ThumbsUp className="h-3 w-3" />
                                            {review.likes > 0 && review.likes}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {reviews.length > 3 && (
                        <Button
                            variant="outline"
                            className="w-full text-sm"
                            onClick={() => setShowAllReviews(!showAllReviews)}
                        >
                            {showAllReviews
                                ? '접기'
                                : `리뷰 ${reviews.length - 3}개 더 보기`}
                        </Button>
                    )}
                </div>
            ) : (
                <div className="py-12 text-center text-muted-foreground text-sm border border-dashed rounded-lg">
                    아직 리뷰가 없습니다. 첫 번째 리뷰를 남겨보세요!
                </div>
            )}
        </div>
    );
}
