'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ADSENSE_CLIENT, AD_SLOTS, type AdPlacement } from '@/lib/monetization';
import { cn } from '@/lib/utils';

declare global {
    interface Window {
        adsbygoogle?: unknown[];
    }
}

interface AdSlotProps {
    placement: AdPlacement;
    className?: string;
}

/**
 * Google AdSense 광고 영역.
 * - 클라이언트 ID / 슬롯 ID가 설정되지 않았으면 운영 환경에서는 아무것도 렌더링하지 않는다.
 * - 개발 환경에서는 위치 확인용 플레이스홀더를 보여준다.
 * - SPA 라우팅 시 페이지마다 새 광고를 요청하도록 경로가 바뀌면 <ins>를 다시 마운트한다.
 */
export default function AdSlot({ placement, className }: AdSlotProps) {
    const pathname = usePathname();
    const slot = AD_SLOTS[placement];
    const enabled = !!ADSENSE_CLIENT && !!slot;

    useEffect(() => {
        if (!enabled) return;
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch {
            // 광고 차단기나 중복 push(개발 모드 StrictMode)로 실패해도 페이지 렌더링에는 영향을 주지 않는다.
        }
    }, [enabled, pathname]);

    if (!enabled) {
        if (process.env.NODE_ENV !== 'development') return null;
        return (
            <div
                className={cn(
                    'flex h-24 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground',
                    className,
                )}
            >
                광고 영역 ({placement})
            </div>
        );
    }

    return (
        <aside className={cn('w-full overflow-hidden', className)} aria-label="광고">
            <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground/70">Advertisement</p>
            <ins
                key={pathname}
                className="adsbygoogle block"
                data-ad-client={ADSENSE_CLIENT}
                data-ad-slot={slot}
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </aside>
    );
}
