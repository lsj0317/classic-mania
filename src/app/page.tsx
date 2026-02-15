'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { posts } from "@/data/mockData";
import { artistData } from "@/data/artistData";
import { useLanguageStore } from "@/stores/languageStore";
import { useMonthlyPerformances } from "@/hooks/usePerformanceQueries";
import { usePopularComposers } from "@/hooks/useOpenOpusQueries";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ImageIcon, Loader2 } from "lucide-react";
import type { OpenOpusComposer } from "@/types";

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

const CAROUSEL_SLIDES = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1465847899078-b413929f7120?q=80&w=1200&auto=format&fit=crop",
        title: "2026 빈 필하모닉 내한 공연",
        subtitle: "세계 최고의 오케스트라가 서울에 옵니다",
        tag: "event",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
        title: "베토벤 합창 교향곡",
        subtitle: "예술의전당 | 2026.02.01 ~ 2026.02.02",
        tag: "performance",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1514782390807-73d762e58c97?q=80&w=1200&auto=format&fit=crop",
        title: "조성진 피아노 리사이틀",
        subtitle: "롯데콘서트홀 | 2026.02.15",
        tag: "performance",
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1200&auto=format&fit=crop",
        title: "신규회원 가입 이벤트",
        subtitle: "가입만 해도 공연 할인 쿠폰 증정!",
        tag: "event",
    },
];

const Home = () => {
    const router = useRouter();
    const { t, language } = useLanguageStore();

    const {
        data: monthlyPerformances = [],
        isLoading: perfLoading,
    } = useMonthlyPerformances();

    const {
        data: popularComposers = [],
        isLoading: composersLoading,
    } = usePopularComposers();

    const popularPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 5);
    const latestPosts = [...posts].sort((a, b) => b.id - a.id).slice(0, 5);
    const weeklyArtists = [...artistData].sort((a, b) => b.likes - a.likes).slice(0, 4);
    const displayPerformances = monthlyPerformances.slice(0, 6);

    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    const [perfSlide, setPerfSlide] = useState(0);
    const perfPerPage = 3;
    const perfMaxSlide = Math.max(0, Math.ceil(displayPerformances.length / perfPerPage) - 1);

    const [activeTab, setActiveTab] = useState("all");
    const tabs = [
        { key: "all", label: t.home.tabAll },
        { key: "performance", label: t.home.tabPerformance },
        { key: "community", label: t.home.tabCommunity },
        { key: "artist", label: t.home.tabArtist },
    ];

    const handlePostClick = (postId: number) => {
        const targetPost = posts.find((p) => p.id === postId);
        if (targetPost) targetPost.views += 1;
        router.push(`/board/${postId}`);
    };

    const isKo = language === "ko";

    const renderComposerCard = (composer: OpenOpusComposer) => (
        <Card
            key={composer.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(`/artist/composer-${composer.id}`)}
        >
            <CardContent className="p-4 text-center">
                <img
                    src={composer.portrait}
                    alt={composer.complete_name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                />
                <h6 className="font-semibold text-sm">{composer.complete_name}</h6>
                <p className="text-xs text-muted-foreground">
                    {isKo ? EPOCH_KO[composer.epoch] || composer.epoch : composer.epoch}
                </p>
            </CardContent>
        </Card>
    );

    const renderLoadingSpinner = () => (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
                {isKo ? "데이터를 불러오는 중..." : "Loading..."}
            </span>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case "performance":
                if (perfLoading) return renderLoadingSpinner();
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
            case "artist":
                if (composersLoading) return renderLoadingSpinner();
                return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {popularComposers.length > 0
                            ? popularComposers.slice(0, 8).map(renderComposerCard)
                            : artistData.slice(0, 8).map((artist) => (
                                <Card
                                    key={artist.id}
                                    className="cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => router.push(`/artist/${artist.id}`)}
                                >
                                    <CardContent className="p-4 text-center">
                                        <img
                                            src={artist.profileImage}
                                            alt={artist.name}
                                            className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                                        />
                                        <h6 className="font-semibold text-sm">{artist.name}</h6>
                                        <p className="text-xs text-muted-foreground">{artist.role}</p>
                                    </CardContent>
                                </Card>
                            ))
                        }
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
                                renderLoadingSpinner()
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
            <section className="relative w-full h-[280px] sm:h-[360px] lg:h-[460px] overflow-hidden bg-black">
                {CAROUSEL_SLIDES.map((slide, idx) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-700 ${idx === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                    >
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                        <div className="absolute bottom-8 sm:bottom-12 left-0 right-0 px-6 sm:px-12 lg:px-20">
                            <div className="container mx-auto max-w-screen-xl">
                                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white mb-3">
                                    {slide.tag === "event" ? t.home.carouselEvent : t.home.carouselPerformance}
                                </span>
                                <h2 className="text-white text-xl sm:text-2xl lg:text-4xl font-bold mb-1">
                                    {slide.title}
                                </h2>
                                <p className="text-white/80 text-sm sm:text-base">{slide.subtitle}</p>
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={prevSlide}
                    className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {CAROUSEL_SLIDES.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? "bg-white w-6" : "bg-white/50"}`}
                        />
                    ))}
                </div>
            </section>

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
                                renderLoadingSpinner()
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

            <section className="container mx-auto max-w-screen-xl px-4 sm:px-6 mt-12 mb-4">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">{t.home.artistOfTheWeek}</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="font-bold text-sm"
                        onClick={() => router.push("/artist")}
                    >
                        {t.home.moreArtist} +
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {weeklyArtists.map((artist) => (
                        <Card
                            key={artist.id}
                            className="cursor-pointer hover:shadow-md transition-shadow group relative"
                            onClick={() => router.push(`/artist/${artist.id}`)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={artist.profileImage}
                                        alt={artist.name}
                                        className="w-16 h-16 rounded-full object-cover flex-shrink-0 group-hover:ring-2 ring-primary transition-all"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h6 className="font-bold text-sm group-hover:text-primary transition-colors">
                                            {artist.name}
                                        </h6>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {artist.role}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {artist.nationality}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="container mx-auto max-w-screen-xl px-4 sm:px-6 mt-4 mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">
                        {isKo ? "인기 작곡가" : "Popular Composers"}
                    </h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="font-bold text-sm"
                        onClick={() => router.push("/artist")}
                    >
                        {t.home.moreArtist} +
                    </Button>
                </div>

                {composersLoading ? (
                    renderLoadingSpinner()
                ) : popularComposers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {popularComposers.slice(0, 4).map((composer) => (
                            <Card
                                key={composer.id}
                                className="cursor-pointer hover:shadow-md transition-shadow group relative"
                                onClick={() => router.push(`/artist/composer-${composer.id}`)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={composer.portrait}
                                            alt={composer.complete_name}
                                            className="w-16 h-16 rounded-full object-cover flex-shrink-0 group-hover:ring-2 ring-primary transition-all"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h6 className="font-bold text-sm group-hover:text-primary transition-colors">
                                                {composer.complete_name}
                                            </h6>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {isKo ? EPOCH_KO[composer.epoch] || composer.epoch : composer.epoch}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {composer.birth?.slice(0, 4)}
                                                {composer.death ? ` - ${composer.death.slice(0, 4)}` : ""}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : null}
            </section>
        </div>
    );
};

export default Home;
