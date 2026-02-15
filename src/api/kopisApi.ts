import axios from 'axios';
import type { Performance, RelatedLink } from '../types';

/**
 * KOPIS API URL 빌드
 * /api/kopis Route Handler 프록시 사용
 * API 키는 서버사이드에서 주입됨
 */
function buildKopisUrl(path: string, params: Record<string, string | number>): string {
    const searchParams = new URLSearchParams();
    searchParams.append('path', path);
    for (const [key, value] of Object.entries(params)) {
        searchParams.append(key, String(value));
    }
    return `/api/kopis?${searchParams.toString()}`;
}

const getTagText = (el: Element, tag: string): string => {
    return el.getElementsByTagName(tag)[0]?.textContent?.trim() || '';
};

const getAllTagTexts = (el: Element, tag: string): string[] => {
    const nodes = el.getElementsByTagName(tag);
    return Array.from(nodes).map((n) => n.textContent?.trim() || '').filter(Boolean);
};

const formatDate = (raw: string): string => {
    if (!raw) return '';
    const clean = raw.replace(/\./g, '');
    if (clean.length === 8) {
        return `${clean.slice(0, 4)}.${clean.slice(4, 6)}.${clean.slice(6, 8)}`;
    }
    return raw;
};

const extractArea = (raw: string): string => {
    if (!raw) return '기타';
    const map: Record<string, string> = {
        '서울': '서울', '경기': '경기', '인천': '인천',
        '부산': '부산', '대구': '대구', '광주': '광주',
        '대전': '대전', '울산': '울산', '세종': '세종',
        '강원': '강원', '충북': '충북', '충남': '충남',
        '전북': '전북', '전남': '전남', '경북': '경북',
        '경남': '경남', '제주': '제주',
    };
    for (const [key, value] of Object.entries(map)) {
        if (raw.includes(key)) return value;
    }
    return raw;
};

export const fetchKopisPerformances = async (page = 1, rows = 100): Promise<Performance[]> => {
    try {
        const today = new Date();
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(today.getMonth() - 6);
        const sixMonthsLater = new Date(today);
        sixMonthsLater.setMonth(today.getMonth() + 6);

        const toYMD = (d: Date) =>
            `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;

        const url = buildKopisUrl('/openApi/restful/pblprfr', {
            stdate: toYMD(sixMonthsAgo),
            eddate: toYMD(sixMonthsLater),
            cpage: page,
            rows: rows,
            shcate: 'CCCA',
        });

        const response = await axios.get(url);
        const parser = new DOMParser();
        const xml = parser.parseFromString(response.data, 'text/xml');
        const items = xml.getElementsByTagName('db');

        if (items.length === 0) return [];

        return Array.from(items).map((item) => {
            const startDate = formatDate(getTagText(item, 'prfpdfrom'));
            const endDate = formatDate(getTagText(item, 'prfpdto'));
            return {
                id: getTagText(item, 'mt20id'),
                title: getTagText(item, 'prfnm') || '제목 없음',
                place: getTagText(item, 'fcltynm') || '장소 미정',
                period: `${startDate} ~ ${endDate}`,
                startDate,
                endDate,
                area: extractArea(getTagText(item, 'area')),
                genre: getTagText(item, 'genrenm') || undefined,
                poster: getTagText(item, 'poster') || undefined,
                status: getTagText(item, 'prfstate') || '공연예정',
            };
        });
    } catch (error) {
        console.error('KOPIS 공연 목록 API 호출 중 에러 발생:', error);
        throw error;
    }
};

export const fetchKopisPerformanceDetail = async (mt20id: string): Promise<Performance | null> => {
    try {
        const url = buildKopisUrl(`/openApi/restful/pblprfr/${mt20id}`, {});

        const response = await axios.get(url);
        const parser = new DOMParser();
        const xml = parser.parseFromString(response.data, 'text/xml');
        const items = xml.getElementsByTagName('db');

        if (items.length === 0) return null;

        const item = items[0];
        const startDate = formatDate(getTagText(item, 'prfpdfrom'));
        const endDate = formatDate(getTagText(item, 'prfpdto'));

        const relatedLinks: RelatedLink[] = [];
        const relateNodes = item.getElementsByTagName('relate');

        const bookingKeywords = ['인터파크', '티켓링크', '예스24', '멜론티켓', '옥션티켓', '예매', '티켓'];
        let foundBookingUrl: string | undefined = undefined;

        Array.from(relateNodes).forEach((node) => {
            const name = getTagText(node, 'relatenm');
            const linkUrl = getTagText(node, 'relateurl');
            if (name && linkUrl) {
                relatedLinks.push({ name, url: linkUrl });
                if (!foundBookingUrl && bookingKeywords.some(keyword => name.includes(keyword))) {
                    foundBookingUrl = linkUrl;
                }
            }
        });

        return {
            id: getTagText(item, 'mt20id') || mt20id,
            title: getTagText(item, 'prfnm') || '제목 없음',
            place: getTagText(item, 'fcltynm') || '장소 미정',
            period: `${startDate} ~ ${endDate}`,
            startDate,
            endDate,
            area: extractArea(getTagText(item, 'area')),
            genre: getTagText(item, 'genrenm') || undefined,
            poster: getTagText(item, 'poster') || undefined,
            status: getTagText(item, 'prfstate') || '공연예정',
            price: getTagText(item, 'pcseguidance') || undefined,
            cast: getTagText(item, 'prfcast') || undefined,
            crew: getTagText(item, 'prfcrew') || undefined,
            runtime: getTagText(item, 'prfruntime') || undefined,
            age: getTagText(item, 'prfage') || undefined,
            synopsis: getTagText(item, 'sty') || undefined,
            schedule: getTagText(item, 'dtguidance') || undefined,
            facilityId: getTagText(item, 'mt10id') || undefined,
            introImages: getAllTagTexts(item, 'steimg') || undefined,
            relatedLinks: relatedLinks.length > 0 ? relatedLinks : undefined,
            bookingUrl: foundBookingUrl,
        };
    } catch (error) {
        console.error('KOPIS 공연 상세 API 호출 중 에러 발생:', error);
        throw error;
    }
};

export const fetchKopisFacilityDetail = async (mt10id: string): Promise<{ lat: number; lng: number } | null> => {
    try {
        const url = buildKopisUrl(`/openApi/restful/prfplc/${mt10id}`, {});

        const response = await axios.get(url);
        const parser = new DOMParser();
        const xml = parser.parseFromString(response.data, 'text/xml');
        const items = xml.getElementsByTagName('db');

        if (items.length === 0) return null;

        const item = items[0];
        const lat = parseFloat(getTagText(item, 'la'));
        const lng = parseFloat(getTagText(item, 'lo'));

        if (isNaN(lat) || isNaN(lng)) return null;
        return { lat, lng };
    } catch (error) {
        console.error('KOPIS 공연시설 상세 API 호출 중 에러 발생:', error);
        return null;
    }
};
