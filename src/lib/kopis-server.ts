import { XMLParser } from 'fast-xml-parser';

/**
 * Server-side KOPIS API utility for generateMetadata
 * Uses fast-xml-parser instead of DOMParser (not available server-side)
 */

const parser = new XMLParser({
    ignoreAttributes: false,
    trimValues: true,
});

interface KopisPerformanceMeta {
    title: string;
    place: string;
    period: string;
    poster?: string;
    genre?: string;
    status?: string;
    area?: string;
}

export async function fetchPerformanceMeta(mt20id: string): Promise<KopisPerformanceMeta | null> {
    try {
        const apiKey = process.env.KOPIS_API_KEY || '';
        const url = `http://www.kopis.or.kr/openApi/restful/pblprfr/${mt20id}?service=${apiKey}`;

        const response = await fetch(url, { next: { revalidate: 3600 } });
        const xml = await response.text();
        const parsed = parser.parse(xml);

        const db = parsed?.dbs?.db;
        if (!db) return null;

        const formatDate = (raw: string): string => {
            if (!raw) return '';
            const clean = String(raw).replace(/\./g, '');
            if (clean.length === 8) {
                return `${clean.slice(0, 4)}.${clean.slice(4, 6)}.${clean.slice(6, 8)}`;
            }
            return String(raw);
        };

        const startDate = formatDate(db.prfpdfrom || '');
        const endDate = formatDate(db.prfpdto || '');

        return {
            title: db.prfnm || '제목 없음',
            place: db.fcltynm || '장소 미정',
            period: `${startDate} ~ ${endDate}`,
            poster: db.poster || undefined,
            genre: db.genrenm || undefined,
            status: db.prfstate || undefined,
            area: db.area || undefined,
        };
    } catch (error) {
        console.error('Server-side KOPIS metadata fetch failed:', error);
        return null;
    }
}
