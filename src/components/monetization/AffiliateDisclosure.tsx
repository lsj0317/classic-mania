import { Info } from 'lucide-react';
import { isAffiliateEnabled } from '@/lib/monetization';
import { cn } from '@/lib/utils';

interface AffiliateDisclosureProps {
    className?: string;
    language?: 'ko' | 'en';
}

/**
 * 제휴 링크 고지 문구 (공정위 「추천·보증 등에 관한 표시·광고 심사지침」).
 * 제휴 프로그램이 하나도 설정되지 않았으면 렌더링하지 않는다.
 */
export default function AffiliateDisclosure({ className, language = 'ko' }: AffiliateDisclosureProps) {
    if (!isAffiliateEnabled) return null;

    return (
        <p className={cn('flex items-start gap-1.5 text-[11px] leading-snug text-muted-foreground', className)}>
            <Info className="h-3 w-3 mt-0.5 shrink-0" />
            {language === 'ko'
                ? '이 페이지의 일부 링크는 제휴 링크로, 해당 링크를 통해 예매·구매하면 Classic Mania가 일정 수수료를 받을 수 있습니다. 이용자의 결제 금액에는 영향이 없습니다.'
                : 'Some links on this page are affiliate links. Classic Mania may earn a commission from bookings or purchases made through them, at no extra cost to you.'}
        </p>
    );
}
