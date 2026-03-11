'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAlbumStore } from '@/stores/albumStore';
import { useLanguageStore } from '@/stores/languageStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Disc3, Star, ExternalLink, MessageSquare } from 'lucide-react';

export default function AlbumPage() {
    const router = useRouter();
    const { language } = useLanguageStore();
    const { albums, fetchData } = useAlbumStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [genreFilter, setGenreFilter] = useState<string>('전체');
    const isKo = language === 'ko';

    useEffect(() => { fetchData(); }, [fetchData]);

    const genres = ['전체', ...new Set(albums.map(a => a.genre))];

    const filteredAlbums = albums.filter(a => {
        const matchesSearch = !searchTerm ||
            a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (a.artist?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (a.composerName?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesGenre = genreFilter === '전체' || a.genre === genreFilter;
        return matchesSearch && matchesGenre;
    });

    return (
        <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 py-8">
            {/* 헤더 */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                    <Disc3 className="h-7 w-7 text-primary" />
                    {isKo ? '음반 리뷰' : 'Album Reviews'}
                </h1>
                <p className="text-muted-foreground mt-2">
                    {isKo
                        ? '클래식 음반 데이터베이스 — 리뷰, 평점, 스트리밍 링크를 확인하세요.'
                        : 'Classic album database with reviews, ratings, and streaming links.'}
                </p>
            </div>

            {/* 검색 & 필터 */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                    type="text"
                    placeholder={isKo ? '음반, 연주자, 작곡가 검색...' : 'Search albums, artists, composers...'}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="flex-1 max-w-md px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {genres.map(genre => (
                        <button
                            key={genre}
                            onClick={() => setGenreFilter(genre)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${
                                genreFilter === genre
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background text-muted-foreground border-border hover:bg-accent'
                            }`}
                        >
                            {genre === '전체' ? (isKo ? '전체' : 'All') : genre}
                        </button>
                    ))}
                </div>
            </div>

            {/* 음반 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAlbums.map(album => (
                    <Card
                        key={album.id}
                        className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
                        onClick={() => router.push(`/album/${album.id}`)}
                    >
                        <div className="aspect-square overflow-hidden bg-muted">
                            {album.coverImage ? (
                                <img
                                    src={album.coverImage}
                                    alt={album.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                                    <Disc3 className="h-12 w-12 text-muted-foreground/30" />
                                </div>
                            )}
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-2">
                                {album.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">{album.artist}</p>
                            {album.label && (
                                <p className="text-[10px] text-muted-foreground">{album.label} · {album.releaseDate?.slice(0, 4)}</p>
                            )}

                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-1">
                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                    <span className="text-sm font-bold">{album.averageRating}</span>
                                    <span className="text-[10px] text-muted-foreground">
                                        ({album.reviewCount})
                                    </span>
                                </div>
                                <div className="flex gap-1.5">
                                    {album.spotifyUrl && (
                                        <a
                                            href={album.spotifyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={e => e.stopPropagation()}
                                            className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded hover:bg-green-100"
                                        >
                                            Spotify
                                        </a>
                                    )}
                                    {album.appleMusicUrl && (
                                        <a
                                            href={album.appleMusicUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={e => e.stopPropagation()}
                                            className="text-[10px] bg-pink-50 text-pink-700 px-1.5 py-0.5 rounded hover:bg-pink-100"
                                        >
                                            Apple
                                        </a>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
