import type { Metadata } from 'next';
import { fetchPerformanceMeta } from '@/lib/kopis-server';
import PerformanceDetailClient from './PerformanceDetailClient';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://classic-mania.vercel.app';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;

    try {
        const meta = await fetchPerformanceMeta(id);
        if (!meta) {
            return {
                title: '공연 정보 | Classic Mania',
                description: '클래식 공연 상세 정보',
            };
        }

        const title = `${meta.title} | Classic Mania`;
        const description = `${meta.title} - ${meta.place} | ${meta.period}${meta.genre ? ` | ${meta.genre}` : ''}`;

        return {
            title,
            description,
            openGraph: {
                title: meta.title,
                description,
                type: 'website',
                url: `${BASE_URL}/performance/${id}`,
                siteName: 'Classic Mania',
                ...(meta.poster && {
                    images: [
                        {
                            url: meta.poster,
                            width: 600,
                            height: 800,
                            alt: meta.title,
                        },
                    ],
                }),
            },
            twitter: {
                card: 'summary_large_image',
                title: meta.title,
                description,
                ...(meta.poster && { images: [meta.poster] }),
            },
        };
    } catch {
        return {
            title: '공연 정보 | Classic Mania',
            description: '클래식 공연 상세 정보',
        };
    }
}

export default function PerformanceDetailPage() {
    return <PerformanceDetailClient />;
}
