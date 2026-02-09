import axios from 'axios';
import type { Performance, RelatedLink } from '../types';

const API_KEY = import.meta.env.VITE_KOPIS_API_KEY;

const isDev = import.meta.env.DEV;
const CORS_PROXY = 'https://corsproxy.io/?url=';

/**
 * KOPIS API URL 빌드 (개발: Vite 프록시, 배포: corsproxy.io CORS 프록시)
 * 배포 환경에서는 전체 URL을 encodeURIComponent로 인코딩하여 query params가
 * corsproxy.io가 아닌 실제 KOPIS API로 전달되도록 합니다.
 */
function buildKopisUrl(path: string, params: Record<string, string | number>): string {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        searchParams.append(key, String(value));
    }

    if (isDev) {
        return `/api/kopis${path}?${searchParams.toString()}`;
    }

    const targetUrl = `http://www.kopis.or.kr${path}?${searchParams.toString()}`;
    return `${CORS_PROXY}${encodeURIComponent(targetUrl)}`;
}

/**
 * XML Element에서 태그명으로 텍스트 값 추출
 */
const getTagText = (el: Element, tag: string): string => {
    return el.getElementsByTagName(tag)[0]?.textContent?.trim() || '';
};

/**
 * XML Element에서 태그명으로 모든 텍스트 값 추출 (배열)
 */
const getAllTagTexts = (el: Element, tag: string): string[] => {
    const nodes = el.getElementsByTagName(tag);
    return Array.from(nodes).map((n) => n.textContent?.trim() || '').filter(Boolean);
};

/**
 * KOPIS 날짜 형식(YYYYMMDD 또는 YYYY.MM.DD) → YYYY.MM.DD 변환
 */
const formatDate = (raw: string): string => {
    if (!raw) return '';
    const clean = raw.replace(/\./g, '');
    if (clean.length === 8) {
        return `${clean.slice(0, 4)}.${clean.slice(4, 6)}.${clean.slice(6, 8)}`;
    }
    return raw;
};

/**
 * KOPIS 지역명에서 시도명 추출 (예: "서울특별시" → "서울")
 */
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

/**
 * 공연 목록 조회 (KOPIS)
 * GET /openApi/restful/pblprfr
 */
export const fetchKopisPerformances = async (page = 1, rows = 100): Promise<Performance[]> => {
    try {
        // 검색 기간: 6개월 전 ~ 6개월 후
        const today = new Date();
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(today.getMonth() - 6);
        const sixMonthsLater = new Date(today);
        sixMonthsLater.setMonth(today.getMonth() + 6);

        const toYMD = (d: Date) =>
            `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;

        const url = buildKopisUrl('/openApi/restful/pblprfr', {
            service: API_KEY,
            stdate: toYMD(sixMonthsAgo),
            eddate: toYMD(sixMonthsLater),
            cpage: page,
            rows: rows,
            shcate: 'CCCA', // 클래식 장르
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

/**
 * 공연 상세 조회 (KOPIS)
 * GET /openApi/restful/pblprfr/{mt20id}
 */
export const fetchKopisPerformanceDetail = async (mt20id: string): Promise<Performance | null> => {
    try {
        const url = buildKopisUrl(`/openApi/restful/pblprfr/${mt20id}`, {
            service: API_KEY,
        });

        const response = await axios.get(url);

        const parser = new DOMParser();
        const xml = parser.parseFromString(response.data, 'text/xml');
        const items = xml.getElementsByTagName('db');

        if (items.length === 0) return null;

        const item = items[0];
        const startDate = formatDate(getTagText(item, 'prfpdfrom'));
        const endDate = formatDate(getTagText(item, 'prfpdto'));

        // 관련 링크 파싱
        const relatedLinks: RelatedLink[] = [];
        const relateNodes = item.getElementsByTagName('relate');
        
        // 예매처 키워드
        const bookingKeywords = ['인터파크', '티켓링크', '예스24', '멜론티켓', '옥션티켓', '예매', '티켓'];
        let foundBookingUrl: string | undefined = undefined;

        Array.from(relateNodes).forEach((node) => {
            const name = getTagText(node, 'relatenm');
            const url = getTagText(node, 'relateurl');
            if (name && url) {
                relatedLinks.push({ name, url });
                
                // 아직 bookingUrl을 못 찾았고, 이름에 예매처 키워드가 있다면 설정
                if (!foundBookingUrl && bookingKeywords.some(keyword => name.includes(keyword))) {
                    foundBookingUrl = url;
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

/**
 * 공연시설 상세 조회 (KOPIS)
 * GET /openApi/restful/prfplc/{mt10id}
 */
export const fetchKopisFacilityDetail = async (mt10id: string): Promise<{ lat: number; lng: number } | null> => {
    try {
        const url = buildKopisUrl(`/openApi/restful/prfplc/${mt10id}`, {
            service: API_KEY,
        });

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
