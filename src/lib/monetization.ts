/**
 * 수익화(제휴 링크 · 광고) 설정
 *
 * 모든 값은 환경변수로 주입되며, 설정되지 않은 항목은 자동으로 비활성화된다.
 * (NEXT_PUBLIC_ 변수는 빌드 시점에 인라인되므로 반드시 process.env.XXX 형태로 직접 참조해야 한다.)
 *
 * ── 제휴 링크 ───────────────────────────────────────────────
 * 각 제휴 프로그램(링크프라이스 등 제휴 네트워크 또는 예매처 자체 제휴)에서 발급받은
 * "딥링크 템플릿"을 등록한다. 템플릿의 `{url}` 자리에 원래 URL(인코딩됨)이 들어간다.
 *   예) NEXT_PUBLIC_AFFILIATE_TEMPLATE_INTERPARK=
 *       https://click.linkprice.com/click.php?m=<머천트ID>&a=<제휴ID>&l=9999&l_cd1=3&l_cd2=0&tu={url}
 *
 *   NEXT_PUBLIC_AFFILIATE_TEMPLATE_INTERPARK   인터파크(NOL) 티켓
 *   NEXT_PUBLIC_AFFILIATE_TEMPLATE_YES24       YES24 티켓 · 음반
 *   NEXT_PUBLIC_AFFILIATE_TEMPLATE_MELON       멜론티켓
 *   NEXT_PUBLIC_AFFILIATE_TEMPLATE_TICKETLINK  티켓링크
 *   NEXT_PUBLIC_AFFILIATE_TEMPLATE_ALADIN      알라딘 음반
 *
 * ── 광고 (Google AdSense) ───────────────────────────────────
 *   NEXT_PUBLIC_ADSENSE_CLIENT                      ca-pub-XXXXXXXXXXXXXXXX
 *   NEXT_PUBLIC_ADSENSE_SLOT_PERFORMANCE_LIST       공연 목록 하단
 *   NEXT_PUBLIC_ADSENSE_SLOT_PERFORMANCE_DETAIL     공연 상세 (탭 아래)
 *   NEXT_PUBLIC_ADSENSE_SLOT_COLUMN_DETAIL          칼럼 본문 하단
 *   NEXT_PUBLIC_ADSENSE_SLOT_ALBUM_DETAIL           음반 상세 하단
 */

// ─────────────────────────────────────────────────────────────
// 제휴 링크
// ─────────────────────────────────────────────────────────────

interface AffiliateProgram {
    /** 표시용 이름 */
    name: string;
    /** 매칭할 도메인 (서브도메인 포함 매칭) */
    hosts: string[];
    /** `{url}` 플레이스홀더를 포함한 딥링크 템플릿. 없으면 비활성 */
    template?: string;
}

const AFFILIATE_PROGRAMS: AffiliateProgram[] = [
    {
        name: '인터파크티켓',
        hosts: ['interpark.com'],
        template: process.env.NEXT_PUBLIC_AFFILIATE_TEMPLATE_INTERPARK,
    },
    {
        name: 'YES24',
        hosts: ['yes24.com'],
        template: process.env.NEXT_PUBLIC_AFFILIATE_TEMPLATE_YES24,
    },
    {
        name: '멜론티켓',
        hosts: ['melon.com'],
        template: process.env.NEXT_PUBLIC_AFFILIATE_TEMPLATE_MELON,
    },
    {
        name: '티켓링크',
        hosts: ['ticketlink.co.kr'],
        template: process.env.NEXT_PUBLIC_AFFILIATE_TEMPLATE_TICKETLINK,
    },
    {
        name: '알라딘',
        hosts: ['aladin.co.kr'],
        template: process.env.NEXT_PUBLIC_AFFILIATE_TEMPLATE_ALADIN,
    },
];

const URL_PLACEHOLDER = '{url}';

function isValidTemplate(template?: string): template is string {
    return !!template && template.includes(URL_PLACEHOLDER);
}

function matchesHost(hostname: string, host: string): boolean {
    return hostname === host || hostname.endsWith(`.${host}`);
}

function findProgram(url: string): AffiliateProgram | undefined {
    let hostname: string;
    try {
        hostname = new URL(url).hostname.toLowerCase();
    } catch {
        return undefined;
    }
    return AFFILIATE_PROGRAMS.find(
        p => isValidTemplate(p.template) && p.hosts.some(h => matchesHost(hostname, h)),
    );
}

/** 하나 이상의 제휴 프로그램이 설정되어 있는지 여부 */
export const isAffiliateEnabled = AFFILIATE_PROGRAMS.some(p => isValidTemplate(p.template));

export interface AffiliateLinkResult {
    href: string;
    isAffiliate: boolean;
}

/**
 * 원본 URL을 제휴 딥링크로 변환한다.
 * 매칭되는 제휴 프로그램이 없으면 원본 URL을 그대로 돌려준다.
 */
export function toAffiliateLink(url: string): AffiliateLinkResult {
    const program = findProgram(url);
    if (!program?.template) return { href: url, isAffiliate: false };
    return {
        href: program.template.split(URL_PLACEHOLDER).join(encodeURIComponent(url)),
        isAffiliate: true,
    };
}

/** 음반 구매처 검색 링크 (제휴 템플릿이 있으면 자동으로 제휴 링크로 변환됨) */
export function getAlbumPurchaseLinks(query: string): { name: string; url: string }[] {
    const q = encodeURIComponent(query);
    return [
        { name: 'YES24', url: `https://www.yes24.com/Product/Search?domain=MUSIC&query=${q}` },
        { name: '알라딘', url: `https://www.aladin.co.kr/search/wsearchresult.aspx?SearchTarget=Music&SearchWord=${q}` },
    ];
}

// ─────────────────────────────────────────────────────────────
// 광고 (Google AdSense)
// ─────────────────────────────────────────────────────────────

export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';

export type AdPlacement = 'performanceList' | 'performanceDetail' | 'columnDetail' | 'albumDetail';

export const AD_SLOTS: Record<AdPlacement, string | undefined> = {
    performanceList: process.env.NEXT_PUBLIC_ADSENSE_SLOT_PERFORMANCE_LIST,
    performanceDetail: process.env.NEXT_PUBLIC_ADSENSE_SLOT_PERFORMANCE_DETAIL,
    columnDetail: process.env.NEXT_PUBLIC_ADSENSE_SLOT_COLUMN_DETAIL,
    albumDetail: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ALBUM_DETAIL,
};
