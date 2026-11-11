import type { AnchorHTMLAttributes } from 'react';
import { toAffiliateLink } from '@/lib/monetization';

interface AffiliateLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'rel' | 'target'> {
    /** 원본 URL (제휴 프로그램이 설정된 도메인이면 자동으로 제휴 링크로 변환) */
    href: string;
}

/**
 * 외부 구매·예매 링크.
 * 제휴 링크로 변환된 경우 검색엔진 가이드에 따라 rel="sponsored"를 붙인다.
 */
export default function AffiliateLink({ href, children, ...rest }: AffiliateLinkProps) {
    const { href: finalHref, isAffiliate } = toAffiliateLink(href);
    return (
        <a
            {...rest}
            href={finalHref}
            target="_blank"
            rel={isAffiliate ? 'sponsored noopener noreferrer' : 'noopener noreferrer'}
        >
            {children}
        </a>
    );
}
