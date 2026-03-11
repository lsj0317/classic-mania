'use client';

interface JsonLdProps {
    data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

/* ───── JSON-LD 생성 헬퍼 ───── */

export function createMusicEventJsonLd({
    name,
    startDate,
    endDate,
    location,
    image,
    description,
    url,
}: {
    name: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    image?: string;
    description?: string;
    url?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'MusicEvent',
        name,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(location && {
            location: {
                '@type': 'Place',
                name: location,
            },
        }),
        ...(image && { image }),
        ...(description && { description }),
        ...(url && { url }),
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    };
}

export function createPersonJsonLd({
    name,
    image,
    description,
    jobTitle,
    nationality,
    url,
}: {
    name: string;
    image?: string;
    description?: string;
    jobTitle?: string;
    nationality?: string;
    url?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name,
        ...(image && { image }),
        ...(description && { description }),
        ...(jobTitle && { jobTitle }),
        ...(nationality && { nationality }),
        ...(url && { url }),
    };
}

export function createArticleJsonLd({
    headline,
    author,
    datePublished,
    description,
    image,
    url,
}: {
    headline: string;
    author?: string;
    datePublished?: string;
    description?: string;
    image?: string;
    url?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline,
        ...(author && { author: { '@type': 'Person', name: author } }),
        ...(datePublished && { datePublished }),
        ...(description && { description }),
        ...(image && { image }),
        ...(url && { url }),
        publisher: {
            '@type': 'Organization',
            name: 'Classic Mania',
        },
    };
}

export function createAggregateRatingJsonLd({
    ratingValue,
    reviewCount,
    itemName,
    itemType = 'MusicEvent',
}: {
    ratingValue: number;
    reviewCount: number;
    itemName: string;
    itemType?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': itemType,
        name: itemName,
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: ratingValue.toFixed(1),
            bestRating: '5',
            worstRating: '1',
            reviewCount: String(reviewCount),
        },
    };
}
