'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { posts } from "@/data/mockData";
import { useLanguageStore } from "@/stores/languageStore";
import { useMonthlyPerformances, useBoxOffice } from "@/hooks/usePerformanceQueries";
import { useMonthlyMusicians } from "@/hooks/useMonthlyMusicians";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, ImageIcon, Calendar, Music } from "lucide-react";
import type { Performance } from "@/types";
import RecommendationSection from "@/components/recommendations/RecommendationSection";
import { useNoticeStore } from "@/stores/noticeStore";

// 날짜 파싱 (YYYY.MM.DD or YYYY-MM-DD)
function parseDateStr(str: string): Date | null {
    if (!str) return null;
    const clean = str.trim().replace(/\./g, '-');
    const d = new Date(clean);
    return isNaN(d.getTime()) ? null : d;
}

function isOnToday(perf: Performance): boolean {
    const today = new Date();
    const start = parseDateStr(perf.startDate || perf.period?.split('~')[0]?.trim() || '');
    const end = parseDateStr(perf.endDate || perf.period?.split('~')[1]?.trim() || perf.period || '');
    if (!start) return false;
    const endDate = end || start;
    const t = new Date(today); t.setHours(0,0,0,0);
    start.setHours(0,0,0,0); endDate.setHours(0,0,0,0);
    return t >= start && t <= endDate;
}

/** 이번 달에 해당하고, 아직 끝나지 않은 공연인지 확인 */
function isCurrentMonthUpcoming(perf: Performance): boolean {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    now.setHours(0, 0, 0, 0);

    const end = parseDateStr(perf.endDate || perf.period?.split('~')[1]?.trim() || perf.period?.split('~')[0]?.trim() || '');
    const start = parseDateStr(perf.startDate || perf.period?.split('~')[0]?.trim() || '');

    if (!start) return false;

    // 이미 종료된 공연 제외
    const endDate = end || start;
    const endCheck = new Date(endDate); endCheck.setHours(0, 0, 0, 0);
    if (endCheck < now) return false;

    // 시작일이 이번 달이거나, 현재 진행중인 공연
    const startCheck = new Date(start); startCheck.setHours(0, 0, 0, 0);
    if (startCheck.getMonth() === currentMonth && startCheck.getFullYear() === currentYear) return true;
    // 이미 시작했지만 아직 끝나지 않은 공연도 포함
    if (startCheck <= now && endCheck >= now) return true;

    return false;
}

const EPOCH_KO: Record<string, string> = {
    Medieval: "중세",
    Renaissance: "르네상스",
    Baroque: "바로크",
    Classical: "고전주의",
    "Early Romantic": "초기 낭만",
    Romantic: "낭만주의",
    "Late Romantic": "후기 낭만",
    "20th Century": "20세기",
    "Post-War": "전후",
    "21st Century": "21세기",
};

// ── 스켈레톤 컴포넌트 ──

const CarouselSkeleton = () => (
    <div className="relative w-full h-[280px] sm:h-[360px] lg:h-[460px] overflow-hidden bg-black">
        <Skeleton className="absolute inset-0 rounded-none bg-gray-800" />
        <div className="absolute bottom-8 sm:bottom-12 left-0 right-0 px-6 sm:px-12 lg:px-20">
            <div className="container mx-auto max-w-screen-xl">
                <Skeleton className="h-6 w-20 rounded-full bg-white/10 mb-3" />
                <Skeleton className="h-8 sm:h-10 w-3/4 bg-white/10 mb-2" />
                <Skeleton className="h-4 w-1/2 bg-white/10" />
            </div>
        </div>
    </div>
);

const PerformanceCardSkeleton = () => (
    <Card>
        <CardContent className="p-4">
            <div className="flex items-center gap-3">
                <Skeleton className="w-16 h-20 rounded" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                </div>
            </div>
        </CardContent>
    </Card>
);

const MusicianCardSkeleton = () => (
    <Card>
        <CardContent className="p-4 text-center">
            <Skeleton className="w-20 h-20 rounded-full mx-auto mb-3" />
            <Skeleton className="h-4 w-24 mx-auto mb-1" />
            <Skeleton className="h-3 w-16 mx-auto" />
        </CardContent>
    </Card>
);

const PerfCarouselSkeleton = () => (
    <div className="flex gap-3">
        {[0, 1, 2].map(i => (
            <div key={i} className="flex-shrink-0" style={{ width: 'calc((100% - 1.5rem) / 3)' }}>
                <Skeleton className="aspect-[3/4] rounded-lg" />
                <Skeleton className="h-3 w-3/4 mt-2" />
                <Skeleton className="h-3 w-1/2 mt-1" />
            </div>
        ))}
    </div>
);

// ── 메인 컴포넌트 ──

const Home = () => {
    const router = useRouter();
    const { t, language } = useLanguageStore();

    const {
        data: monthlyPerformances = [],
        isLoading: perfLoading,
    } = useMonthlyPerformances();

    const {
        data: boxOfficePerfs = [],
    } = useBoxOffice();

    const {
        data: monthlyMusicians = [],
        isLoading: musiciansLoading,
    } = useMonthlyMusicians();

    // Notice store
    const { notices, fetchNotices: loadNotices } = useNoticeStore();

    useEffect(() => {
        loadNotices();
    }, [loadNotices]);

    const popularPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 5);
    const latestPosts = [...posts].sort((a, b) => b.id - a.id).slice(0, 5);
    const displayPerformances = monthlyPerformances.slice(0, 6);

    const currentMonth = new Date().getMonth() + 1;
    const isKo = language === "ko";

    // 동적 캐러셀 슬라이드 생성
    const carouselSlides = useMemo(() => {
        const slides: { id: string; image: string; title: string; subtitle: string; badge: string; badgeColor: string; link: string }[] = [];

        // 슬라이드 1: 이번 달 공연 (현재 월에 해당하고 아직 끝나지 않은 공연)
        const thisMonthPerf = monthlyPerformances.find(p => p.poster && isCurrentMonthUpcoming(p));
        if (thisMonthPerf) {
            slides.push({
                id: 'monthly',
                image: thisMonthPerf.poster!,
                title: thisMonthPerf.title,
                subtitle: `${thisMonthPerf.place} | ${thisMonthPerf.period}`,
                badge: isKo ? `${currentMonth}월 공연` : `${new Date().toLocaleString('en', { month: 'long' })} Performance`,
                badgeColor: 'bg-blue-500/80',
                link: `/performance/${thisMonthPerf.id}`,
            });
        }

        // 슬라이드 2: 인기 TOP 공연 (박스오피스 1위)
        const topPerf = boxOfficePerfs.find(p => p.poster) || monthlyPerformances.filter(p => p.poster && p.id !== thisMonthPerf?.id)[0];
        if (topPerf) {
            slides.push({
                id: 'top',
                image: topPerf.poster!,
                title: topPerf.title,
                subtitle: `${topPerf.place} | ${topPerf.period}`,
                badge: '인기TOP공연',
                badgeColor: 'bg-red-500/80',
                link: `/performance/${topPerf.id}`,
            });
        }

        // 슬라이드 3: 신규 기능 소개 (첫 번째 공지사항)
        const featureNotice = notices.find(n => n.badge === '신규기능') || notices[0];
        if (featureNotice) {
            slides.push({
                id: 'feature',
                image: featureNotice.thumbnail || 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=600&auto=format&fit=crop',
                title: featureNotice.title,
                subtitle: '새로운 기능을 확인해 보세요!',
                badge: '신규기능',
                badgeColor: 'bg-emerald-500/80',
                link: `/board/notice/${featureNotice.id}`,
            });
        }

        // 슬라이드가 없으면 기본 슬라이드
        if (slides.length === 0) {
            slides.push({
                id: 'default',
                image: 'https://images.unsplash.com/photo-1465847899078-b413929f7120?q=80&w=1200&auto=format&fit=crop',
                title: 'Classic Mania',
                subtitle: '클래식 음악 커뮤니티에 오신 것을 환영합니다',
                badge: '환영',
                badgeColor: 'bg-white/20',
                link: '/',
            });
        }

        return slides;
    }, [monthlyPerformances, boxOfficePerfs, notices, isKo, currentMonth]);

    const [currentSlide, setCurrentSlide] = useState(0);
    const [carouselReady, setCarouselReady] = useState(false);

    const slideCount = carouselSlides.length;

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.max(slideCount, 1));
    }, [slideCount]);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + Math.max(slideCount, 1)) % Math.max(slideCount, 1));
    }, [slideCount]);

    // 캐러셀 이미지 프리로드
    useEffect(() => {
        if (carouselSlides.length === 0) return;
        let loaded = 0;
        const total = carouselSlides.length;
        carouselSlides.forEach((slide) => {
            const img = new window.Image();
            img.onload = img.onerror = () => {
                loaded++;
                if (loaded >= total) setCarouselReady(true);
            };
            img.src = slide.image;
        });
        const timer = setTimeout(() => setCarouselReady(true), 3000);
        return () => clearTimeout(timer);
    }, [carouselSlides]);

    useEffect(() => {
        if (!carouselReady || slideCount <= 1) return;
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide, carouselReady, slideCount]);

    const [perfSlide, setPerfSlide] = useState(0);
    const perfPerPage = 3;
    const perfMaxSlide = Math.max(0, Math.ceil(displayPerformances.length / perfPerPage) - 1);

    // 오늘의 공연
    const todayPerformances = useMemo(
        () => monthlyPerformances.filter(isOnToday),
        [monthlyPerformances]
    );

    const [activeTab, setActiveTab] = useState("all");
    const tabs = [
        { key: "all", label: t.home.tabAll },
        { key: "performance", label: t.home.tabPerformance },
        { key: "community", label: t.home.tabCommunity },
    ];

    const handlePostClick = (postId: number) => {
        const targetPost = posts.find((p) => p.id === postId);
        if (targetPost) targetPost.views += 1;
        router.push(`/board/${postId}`);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "performance":
                if (perfLoading) return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[0, 1, 2, 3, 4, 5].map(i => <PerformanceCardSkeleton key={i} />)}
                    </div>
                );
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {displayPerformances.map((perf) => (
                            <Card
                                key={perf.id}
                                className="cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => router.push(`/performance/${perf.id}`)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        {perf.poster ? (
                                            <img
                                                src={perf.poster}
                                                alt={perf.title}
                                                className="w-16 h-20 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-16 h-20 bg-muted rounded flex items-center justify-center">
                                                <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h6 className="font-semibold text-sm truncate">{perf.title}</h6>
                                            <p className="text-xs text-muted-foreground mt-1">{perf.place}</p>
                                            <p className="text-xs text-muted-foreground">{perf.period}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                );
            case "community":
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {latestPosts.map((post) => (
                            <Card
                                key={post.id}
                                className="cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => handlePostClick(post.id)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        {post.images?.[0] ? (
                                            <img
                                                src={post.images[0]}
                                                alt={post.title}
                                                className="w-14 h-14 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 bg-muted rounded flex items-center justify-center">
                                                <ImageIcon className="h-5 w-5 text-muted-foreground/30" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h6 className="font-semibold text-sm truncate">{post.title}</h6>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {post.authorName} | {post.createdAt}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                );
            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-bold text-base mb-3">{t.home.popularPosts}</h4>
                            <ul className="space-y-3">
                                {popularPosts.slice(0, 3).map((post) => (
                                    <li
                                        key={post.id}
                                        className="flex items-center gap-3 cursor-pointer hover:bg-accent rounded p-2 transition-colors"
                                        onClick={() => handlePostClick(post.id)}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{post.title}</p>
                                            <p className="text-xs text-muted-foreground">{post.authorName}</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {t.home.views} {post.views}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-base mb-3">{t.home.monthlyPerformance}</h4>
                            {perfLoading ? (
                                <ul className="space-y-3">
                                    {[0, 1, 2].map(i => (
                                        <li key={i} className="flex items-center gap-3 p-2">
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-4 w-3/4" />
                                                <Skeleton className="h-3 w-1/2" />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <ul className="space-y-3">
                                    {displayPerformances.slice(0, 3).map((perf) => (
                                        <li
                                            key={perf.id}
                                            className="flex items-center gap-3 cursor-pointer hover:bg-accent rounded p-2 transition-colors"
                                            onClick={() => router.push(`/performance/${perf.id}`)}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{perf.title}</p>
                                                <p className="text-xs text-muted-foreground">{perf.place}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="w-full">
            {/* 히어로 캐러셀 */}
            {!carouselReady ? (
                <CarouselSkeleton />
            ) : (
                <section className="relative w-full h-[280px] sm:h-[360px] lg:h-[460px] overflow-hidden bg-black">
                    {carouselSlides.map((slide, idx) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-700 cursor-pointer ${idx === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                            onClick={() => router.push(slide.link)}
                        >
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                            {/* 뱃지 - 상단 우측 */}
                            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                                <span className={`inline-block px-3 py-1.5 ${slide.badgeColor} backdrop-blur-sm rounded-full text-xs font-bold text-white shadow-lg`}>
                                    {slide.badge}
                                </span>
                            </div>
                            <div className="absolute bottom-8 sm:bottom-12 left-0 right-0 px-6 sm:px-12 lg:px-20">
                                <div className="container mx-auto max-w-screen-xl">
                                    <h2 className="text-white text-xl sm:text-2xl lg:text-4xl font-bold mb-1">
                                        {slide.title}
                                    </h2>
                                    <p className="text-white/80 text-sm sm:text-base">{slide.subtitle}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {slideCount > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>

                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                                {carouselSlides.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? "bg-white w-6" : "bg-white/50"}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </section>
            )}

            {/* 탭 콘텐츠 */}
            <section className="container mx-auto max-w-screen-xl px-4 sm:px-6 mt-8">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
                                activeTab === tab.key
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background text-muted-foreground border-border hover:bg-accent"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="mt-6">
                    {renderTabContent()}
                </div>
            </section>

            {/* 인기 게시글 + 이달의 공연 */}
            <section className="container mx-auto max-w-screen-xl px-4 sm:px-6 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-bold">{t.home.boardPopular}</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="font-bold text-sm"
                                    onClick={() => router.push("/board?sort=views")}
                                >
                                    {t.home.more}
                                </Button>
                            </div>
                            <ul className="space-y-3">
                                {popularPosts.map((post, idx) => (
                                    <li
                                        key={post.id}
                                        className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-accent transition-colors rounded"
                                        onClick={() => handlePostClick(post.id)}
                                    >
                                        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                                            {idx + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <h6 className="text-sm font-medium group-hover:text-primary/70 transition-colors truncate">
                                                {post.title}
                                            </h6>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs text-muted-foreground">
                                                    {post.authorName}
                                                </span>
                                                <span className="text-muted-foreground/30 text-xs">|</span>
                                                <span className="text-[11px] text-muted-foreground">
                                                    {post.createdAt}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-[11px] text-muted-foreground font-bold whitespace-nowrap">
                                            {t.home.views} {post.views}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-bold">{t.home.monthlyPerformance}</h3>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setPerfSlide((p) => Math.max(0, p - 1))}
                                        disabled={perfSlide === 0}
                                        className="p-1 rounded hover:bg-accent disabled:opacity-30 transition-colors"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setPerfSlide((p) => Math.min(perfMaxSlide, p + 1))}
                                        disabled={perfSlide === perfMaxSlide}
                                        className="p-1 rounded hover:bg-accent disabled:opacity-30 transition-colors"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {perfLoading ? (
                                <PerfCarouselSkeleton />
                            ) : (
                                <div className="overflow-hidden">
                                    <div
                                        className="flex transition-transform duration-300 gap-3"
                                        style={{ transform: `translateX(-${perfSlide * 100}%)` }}
                                    >
                                        {displayPerformances.map((perf) => (
                                            <div
                                                key={perf.id}
                                                className="flex-shrink-0 cursor-pointer"
                                                style={{ width: `calc((100% - 1.5rem) / ${perfPerPage})` }}
                                                onClick={() => router.push(`/performance/${perf.id}`)}
                                            >
                                                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted group">
                                                    {perf.poster ? (
                                                        <img
                                                            src={perf.poster}
                                                            alt={perf.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                                                            <span className="text-xs text-muted-foreground text-center px-2 font-medium">
                                                                {perf.title}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-xs font-medium mt-2 truncate">{perf.title}</p>
                                                <p className="text-[11px] text-muted-foreground truncate">{perf.place}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Button
                                variant="outline"
                                className="w-full mt-5 font-semibold"
                                onClick={() => router.push("/performance")}
                            >
                                {t.home.morePerformance}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* 이달의 음악인 */}
            <section className="container mx-auto max-w-screen-xl px-4 sm:px-6 mt-12 mb-4">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Music className="h-5 w-5 text-primary" />
                        {isKo ? `${currentMonth}월의 음악인` : `Musicians of ${new Date().toLocaleString('en', { month: 'long' })}`}
                    </h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="font-bold text-sm"
                        onClick={() => router.push("/artist?tab=composers")}
                    >
                        {t.home.moreArtist} +
                    </Button>
                </div>

                {musiciansLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[0, 1, 2, 3].map(i => <MusicianCardSkeleton key={i} />)}
                    </div>
                ) : monthlyMusicians.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {monthlyMusicians.slice(0, 8).map((musician) => (
                            <Card
                                key={musician.id}
                                className="cursor-pointer hover:shadow-md transition-shadow group relative overflow-hidden"
                                onClick={() => router.push(`/artist/composer-${musician.id}`)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={musician.portrait}
                                            alt={musician.completeName}
                                            className="w-16 h-16 rounded-full object-cover flex-shrink-0 group-hover:ring-2 ring-primary transition-all"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h6 className="font-bold text-sm group-hover:text-primary transition-colors truncate">
                                                {musician.completeName}
                                            </h6>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {isKo ? EPOCH_KO[musician.epoch] || musician.epoch : musician.epoch}
                                            </p>
                                            <p className="text-xs text-primary/80 font-medium mt-1">
                                                {isKo
                                                    ? `${musician.birthMonth}월 ${musician.birthDay}일 출생`
                                                    : `Born ${new Date(musician.birth).toLocaleDateString('en', { month: 'short', day: 'numeric' })}`
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                            <Music className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">
                                {isKo
                                    ? `${currentMonth}월에 태어난 음악인 정보를 불러오는 중입니다...`
                                    : `Loading musicians born in ${new Date().toLocaleString('en', { month: 'long' })}...`
                                }
                            </p>
                        </CardContent>
                    </Card>
                )}
            </section>

            {/* 오늘의 공연 위젯 */}
            {todayPerformances.length > 0 && (
                <section className="container mx-auto max-w-screen-xl px-4 sm:px-6 mt-12">
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-base flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    오늘의 공연
                                    <span className="text-sm font-normal text-muted-foreground">
                                        ({todayPerformances.length}건)
                                    </span>
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-sm flex items-center gap-1"
                                    onClick={() => router.push('/calendar')}
                                >
                                    <Calendar className="h-4 w-4" />
                                    캘린더 보기
                                </Button>
                            </div>
                            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                                {todayPerformances.slice(0, 6).map((perf) => (
                                    <div
                                        key={perf.id}
                                        className="flex-shrink-0 w-40 cursor-pointer"
                                        onClick={() => router.push(`/performance/${perf.id}`)}
                                    >
                                        <div className="w-full h-24 rounded-lg overflow-hidden bg-muted">
                                            {perf.poster ? (
                                                <img src={perf.poster} alt={perf.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                                                    <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs font-medium mt-1 line-clamp-2 leading-tight">{perf.title}</p>
                                        <p className="text-[11px] text-muted-foreground truncate">{perf.place}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* 개인화 추천 섹션 */}
            <RecommendationSection allPerformances={monthlyPerformances} />
        </div>
    );
};

export default Home;
