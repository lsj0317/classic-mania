'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useColumnStore } from '@/stores/columnStore';
import { useLanguageStore } from '@/stores/languageStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PenLine, Eye, Heart, ChevronRight } from 'lucide-react';
import type { ColumnCategory } from '@/types';

const CATEGORY_CONFIG: Record<ColumnCategory, { label: string; color: string }> = {
    '인터뷰': { label: '인터뷰', color: 'bg-purple-100 text-purple-700' },
    '공연비평': { label: '공연비평', color: 'bg-blue-100 text-blue-700' },
    '음반리뷰': { label: '음반리뷰', color: 'bg-emerald-100 text-emerald-700' },
    '에디터추천': { label: '에디터추천', color: 'bg-amber-100 text-amber-700' },
    '유저기고': { label: '유저기고', color: 'bg-rose-100 text-rose-700' },
};

export default function ColumnPage() {
    const router = useRouter();
    const { language } = useLanguageStore();
    const { columns, fetchData } = useColumnStore();
    const [activeCategory, setActiveCategory] = useState<ColumnCategory | '전체'>('전체');
    const isKo = language === 'ko';

    useEffect(() => { fetchData(); }, [fetchData]);

    const filteredColumns = activeCategory === '전체'
        ? columns
        : columns.filter(c => c.category === activeCategory);

    const featuredColumn = columns.find(c => c.category === '에디터추천');

    const categories: (ColumnCategory | '전체')[] = ['전체', '인터뷰', '공연비평', '음반리뷰', '에디터추천', '유저기고'];

    return (
        <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 py-8">
            {/* 헤더 */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                    <PenLine className="h-7 w-7 text-primary" />
                    {isKo ? '칼럼 & 인터뷰' : 'Columns & Interviews'}
                </h1>
                <p className="text-muted-foreground mt-2">
                    {isKo
                        ? '전문가 칼럼, 아티스트 인터뷰, 공연 비평, 유저 기고 콘텐츠를 만나보세요.'
                        : 'Expert columns, artist interviews, performance reviews, and user contributions.'}
                </p>
            </div>

            {/* 에디터 추천 히어로 */}
            {featuredColumn && (
                <Card
                    className="mb-8 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                    onClick={() => router.push(`/column/${featuredColumn.id}`)}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {featuredColumn.thumbnail && (
                            <div className="aspect-[16/9] md:aspect-auto overflow-hidden bg-muted">
                                <img
                                    src={featuredColumn.thumbnail}
                                    alt={featuredColumn.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        )}
                        <CardContent className="p-6 flex flex-col justify-center">
                            <span className={`self-start px-2.5 py-1 rounded-full text-xs font-bold ${CATEGORY_CONFIG['에디터추천'].color}`}>
                                {isKo ? '에디터 추천' : "Editor's Pick"}
                            </span>
                            <h2 className="text-lg sm:text-xl font-bold mt-3 group-hover:text-primary transition-colors">
                                {featuredColumn.title}
                            </h2>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{featuredColumn.excerpt}</p>
                            <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
                                <span>{featuredColumn.authorName}</span>
                                <span>·</span>
                                <span>{featuredColumn.createdAt}</span>
                                <span>·</span>
                                <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{featuredColumn.views}</span>
                            </div>
                        </CardContent>
                    </div>
                </Card>
            )}

            {/* 카테고리 필터 */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-6">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
                            activeCategory === cat
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background text-muted-foreground border-border hover:bg-accent'
                        }`}
                    >
                        {cat === '전체' ? (isKo ? '전체' : 'All') : cat}
                    </button>
                ))}
            </div>

            {/* 칼럼 리스트 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredColumns.map(column => (
                    <Card
                        key={column.id}
                        className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
                        onClick={() => router.push(`/column/${column.id}`)}
                    >
                        {column.thumbnail && (
                            <div className="aspect-[16/9] overflow-hidden bg-muted">
                                <img
                                    src={column.thumbnail}
                                    alt={column.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        )}
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${CATEGORY_CONFIG[column.category].color}`}>
                                    {column.category}
                                </span>
                            </div>
                            <h3 className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-2">
                                {column.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{column.excerpt}</p>
                            <div className="flex items-center justify-between mt-3 text-[11px] text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <span>{column.authorName}</span>
                                    <span>·</span>
                                    <span>{column.createdAt}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{column.views}</span>
                                    <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{column.likes}</span>
                                </div>
                            </div>
                            {column.tags.length > 0 && (
                                <div className="flex gap-1 mt-2 flex-wrap">
                                    {column.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* 유저 기고 CTA */}
            <Card className="mt-10 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-base">
                            {isKo ? '당신의 이야기를 들려주세요' : 'Share Your Story'}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {isKo
                                ? '클래식 음악에 대한 감상, 공연 후기, 첫 경험 등을 커뮤니티와 나눠보세요.'
                                : 'Share your thoughts, reviews, and experiences with the community.'}
                        </p>
                    </div>
                    <Button onClick={() => router.push('/board/write')} className="gap-2 whitespace-nowrap">
                        <PenLine className="h-4 w-4" />
                        {isKo ? '기고하기' : 'Contribute'}
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
