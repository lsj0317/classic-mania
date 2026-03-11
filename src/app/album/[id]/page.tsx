'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAlbumStore } from '@/stores/albumStore';
import { useLanguageStore } from '@/stores/languageStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Disc3, ExternalLink, Heart, Clock, Music } from 'lucide-react';

function StarRating({ value }: { value: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className={`h-4 w-4 ${i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
            ))}
        </div>
    );
}

export default function AlbumDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { language } = useLanguageStore();
    const { albums, reviews, fetchData, getAlbumById, getReviewsByAlbumId } = useAlbumStore();
    const isKo = language === 'ko';

    useEffect(() => { fetchData(); }, [fetchData]);

    const album = getAlbumById(id);
    const albumReviews = getReviewsByAlbumId(id);

    if (!album) {
        return (
            <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 py-12 text-center">
                <p className="text-muted-foreground">{isKo ? '음반을 찾을 수 없습니다.' : 'Album not found.'}</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push('/album')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {isKo ? '목록으로' : 'Back'}
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-screen-lg px-4 sm:px-6 py-8">
            <Button variant="ghost" size="sm" className="mb-6 gap-2" onClick={() => router.push('/album')}>
                <ArrowLeft className="h-4 w-4" />
                {isKo ? '음반 목록' : 'Album List'}
            </Button>

            {/* 앨범 헤더 */}
            <div className="grid grid-cols-1 sm:grid-cols-[250px,1fr] gap-8 mb-8">
                <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                    {album.coverImage ? (
                        <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                            <Disc3 className="h-16 w-16 text-muted-foreground/30" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col justify-center">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">{album.genre}</p>
                    <h1 className="text-2xl sm:text-3xl font-bold mt-1">{album.title}</h1>
                    <p className="text-lg text-muted-foreground mt-1">{album.artist}</p>
                    {album.composerName && (
                        <p className="text-sm text-muted-foreground">{album.composerName}</p>
                    )}

                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <StarRating value={album.averageRating ?? 0} />
                            <span className="font-bold">{album.averageRating}</span>
                            <span className="text-sm text-muted-foreground">({album.reviewCount}{isKo ? '개 리뷰' : ' reviews'})</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        {album.label && <span>{album.label}</span>}
                        <span>·</span>
                        <span>{album.releaseDate}</span>
                        <span>·</span>
                        <span>{album.trackCount}{isKo ? '곡' : ' tracks'}</span>
                    </div>

                    {/* 스트리밍 링크 */}
                    <div className="flex gap-2 mt-4">
                        {album.spotifyUrl && (
                            <a href={album.spotifyUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="gap-1.5 text-green-700 border-green-200 hover:bg-green-50">
                                    <ExternalLink className="h-3.5 w-3.5" />Spotify
                                </Button>
                            </a>
                        )}
                        {album.appleMusicUrl && (
                            <a href={album.appleMusicUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="gap-1.5 text-pink-700 border-pink-200 hover:bg-pink-50">
                                    <ExternalLink className="h-3.5 w-3.5" />Apple Music
                                </Button>
                            </a>
                        )}
                        {album.youtubeMusicUrl && (
                            <a href={album.youtubeMusicUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="gap-1.5 text-red-700 border-red-200 hover:bg-red-50">
                                    <ExternalLink className="h-3.5 w-3.5" />YouTube Music
                                </Button>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 트랙리스트 */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Music className="h-5 w-5 text-primary" />
                                {isKo ? '수록곡' : 'Track List'}
                            </h2>
                            <div className="space-y-0">
                                {album.tracks.map((track: { number: number; title: string; duration?: string }) => (
                                    <div key={track.number} className="flex items-center gap-3 py-2.5 border-b last:border-0 hover:bg-accent/50 transition-colors rounded px-2">
                                        <span className="text-xs text-muted-foreground w-6 text-right">{track.number}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm truncate">{track.title}</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" />{track.duration}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 리뷰 사이드바 */}
                <div>
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="font-bold text-lg mb-4">{isKo ? '리뷰' : 'Reviews'}</h2>
                            {albumReviews.length === 0 ? (
                                <p className="text-sm text-muted-foreground">{isKo ? '아직 리뷰가 없습니다.' : 'No reviews yet.'}</p>
                            ) : (
                                <div className="space-y-4">
                                    {albumReviews.map(review => (
                                        <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-semibold text-sm">{review.userName}</span>
                                                <div className="flex items-center gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <Star key={i} className={`h-3 w-3 ${i <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <h4 className="font-medium text-sm">{review.title}</h4>
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{review.content}</p>
                                            <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground">
                                                <span>{review.createdAt}</span>
                                                <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{review.likes}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
