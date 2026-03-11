'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

// 경로별 한국어 레이블
const PATH_LABELS: Record<string, string> = {
    board: '게시판',
    write: '글쓰기',
    edit: '수정',
    performance: '공연정보',
    map: '공연지도',
    artist: '아티스트',
    news: '뉴스',
    'ticket-info': '티켓정보',
    mypage: '마이페이지',
    login: '로그인',
    signup: '회원가입',
    calendar: '공연 캘린더',
    profile: '프로필',
    privacy: '개인정보처리방침',
    terms: '이용약관',
};

interface Crumb {
    label: string;
    href: string;
}

function buildCrumbs(pathname: string): Crumb[] {
    const segments = pathname.split('/').filter(Boolean);
    const crumbs: Crumb[] = [{ label: '홈', href: '/' }];

    let accPath = '';
    for (const seg of segments) {
        accPath += `/${seg}`;
        // 동적 세그먼트 ([id], [userId] 등) 스킵하거나 레이블 처리
        const isDynamic = seg.startsWith('[') || seg.match(/^[A-Z0-9]{5,}$/);
        const label = PATH_LABELS[seg] ?? (isDynamic ? null : seg);
        if (label) {
            crumbs.push({ label, href: accPath });
        }
    }

    return crumbs;
}

export default function Breadcrumb() {
    const pathname = usePathname();

    // 홈 제외
    if (pathname === '/') return null;

    const crumbs = buildCrumbs(pathname);
    if (crumbs.length <= 1) return null;

    return (
        <nav aria-label="breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
            {crumbs.map((crumb, idx) => {
                const isLast = idx === crumbs.length - 1;
                return (
                    <span key={crumb.href} className="flex items-center gap-1">
                        {idx === 0 ? (
                            <Link href={crumb.href} className="flex items-center gap-1 hover:text-foreground transition-colors">
                                <Home className="h-3.5 w-3.5" />
                            </Link>
                        ) : isLast ? (
                            <span className="font-medium text-foreground">{crumb.label}</span>
                        ) : (
                            <Link href={crumb.href} className="hover:text-foreground transition-colors">
                                {crumb.label}
                            </Link>
                        )}
                        {!isLast && <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />}
                    </span>
                );
            })}
        </nav>
    );
}
