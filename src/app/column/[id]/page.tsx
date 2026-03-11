'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useColumnStore } from '@/stores/columnStore';
import { useLanguageStore } from '@/stores/languageStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Heart, Clock, Tag } from 'lucide-react';

const CATEGORY_COLOR: Record<string, string> = {
    '인터뷰': 'bg-purple-100 text-purple-700',
    '공연비평': 'bg-blue-100 text-blue-700',
    '음반리뷰': 'bg-emerald-100 text-emerald-700',
    '에디터추천': 'bg-amber-100 text-amber-700',
    '유저기고': 'bg-rose-100 text-rose-700',
};

export default function ColumnDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { language } = useLanguageStore();
    const { columns, fetchData, incrementViews, toggleLike, getColumnById } = useColumnStore();
    const isKo = language === 'ko';

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (id && columns.length > 0) {
            incrementViews(id);
        }
    }, [id, columns.length, incrementViews]);

    const column = getColumnById(id);

    if (!column) {
        return (
            <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 py-12 text-center">
                <p className="text-muted-foreground">{isKo ? '칼럼을 찾을 수 없습니다.' : 'Column not found.'}</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push('/column')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {isKo ? '목록으로' : 'Back to list'}
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-screen-lg px-4 sm:px-6 py-8">
            {/* 뒤로가기 */}
            <Button variant="ghost" size="sm" className="mb-6 gap-2" onClick={() => router.push('/column')}>
                <ArrowLeft className="h-4 w-4" />
                {isKo ? '칼럼 목록' : 'Column List'}
            </Button>

            {/* 썸네일 */}
            {column.thumbnail && (
                <div className="aspect-[21/9] rounded-xl overflow-hidden bg-muted mb-6">
                    <img
                        src={column.thumbnail}
                        alt={column.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* 메타 정보 */}
            <div className="mb-6">
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${CATEGORY_COLOR[column.category] || 'bg-gray-100 text-gray-700'}`}>
                    {column.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold mt-3">{column.title}</h1>
                <p className="text-muted-foreground mt-2">{column.excerpt}</p>

                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        {column.authorImage && (
                            <img src={column.authorImage} alt={column.authorName} className="w-6 h-6 rounded-full" />
                        )}
                        <span className="font-medium text-foreground">{column.authorName}</span>
                        {column.authorRole && <span>· {column.authorRole}</span>}
                    </div>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{column.createdAt}</span>
                    <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{column.views}</span>
                </div>
            </div>

            {/* 본문 */}
            <Card>
                <CardContent className="p-6 sm:p-8">
                    <article className="prose prose-sm max-w-none whitespace-pre-wrap leading-relaxed text-foreground">
                        {column.content}
                    </article>
                </CardContent>
            </Card>

            {/* 태그 & 좋아요 */}
            <div className="flex items-center justify-between mt-6">
                <div className="flex gap-2 flex-wrap">
                    {column.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                            <Tag className="h-3 w-3" />
                            {tag}
                        </span>
                    ))}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => toggleLike(id)}
                >
                    <Heart className="h-4 w-4" />
                    {column.likes}
                </Button>
            </div>
        </div>
    );
}
