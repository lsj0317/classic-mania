import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Clock,
    Users,
    Ticket,
    Link as LinkIcon,
    Image,
    Search,
    Loader2,
    ExternalLink,
    Music,
    ChevronRight,
} from "lucide-react";
import { usePerformanceStore } from "../../stores/performanceStore";
import { fetchNews, type NewsItem } from "../../api/newsApi";
import { fetchKopisPerformances } from "../../api/kopisApi";
import type { Performance } from "../../types";

/* ───── 출연진 파싱 헬퍼 ───── */
const parseCastMembers = (cast: string, genre?: string): { name: string; searchQuery: string }[] => {
    // "홍길동, 김철수" 또는 "홍길동 외" 등 다양한 형식 지원
    const names = cast
        .split(/[,，]/)
        .map(s => s.replace(/\s*(외|등|외\s*\d+명)\s*$/, '').trim())
        .filter(Boolean);

    // 장르 키워드를 검색어에 포함 (동명이인 구분)
    const genreKeyword = genre
        ? genre.replace(/클래식/, '클래식 음악가').replace(/오페라/, '오페라 성악가')
        : '클래식 음악가';

    return names.map(name => ({
        name,
        searchQuery: `${genreKeyword} ${name}`,
    }));
};

/* ───── 출연진 정보 컴포넌트 ───── */
const CastProfileCard = ({ name, searchQuery }: { name: string; searchQuery: string }) => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const res = await fetchNews(searchQuery, 1, 5, 'sim');
            setNews(res.items);
        } catch {
            setNews([]);
        } finally {
            setLoading(false);
            setSearched(true);
        }
    };

    return (
        <Card className="p-4 border shadow-none">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                        {name[0]}
                    </div>
                    <span className="font-bold text-sm">{name}</span>
                </div>
                {!searched && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-xs gap-1"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Search className="h-3 w-3" />}
                        프로필 검색
                    </Button>
                )}
            </div>

            {searched && (
                <div className="space-y-2">
                    {news.length > 0 ? (
                        news.map((item, idx) => (
                            <a
                                key={idx}
                                href={item.originallink || item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 rounded-lg border border-transparent hover:border-border hover:bg-accent/50 transition-colors group"
                            >
                                <p
                                    className="text-sm font-medium text-foreground group-hover:text-primary line-clamp-1"
                                    dangerouslySetInnerHTML={{ __html: item.title }}
                                />
                                <p
                                    className="text-xs text-muted-foreground mt-1 line-clamp-2"
                                    dangerouslySetInnerHTML={{ __html: item.description }}
                                />
                            </a>
                        ))
                    ) : (
                        <p className="text-xs text-muted-foreground py-2 text-center">검색 결과가 없습니다.</p>
                    )}
                </div>
            )}
        </Card>
    );
};

/* ───── 작품활동 (지난 공연) 컴포넌트 ───── */
const CastPastPerformances = ({ castName }: { castName: string }) => {
    const [performances, setPerformances] = useState<Performance[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const all = await fetchKopisPerformances(1, 100);
                if (!cancelled) {
                    const filtered = all.filter(p =>
                        p.title?.includes(castName) || p.cast?.includes(castName)
                    );
                    setPerformances(filtered);
                }
            } catch {
                if (!cancelled) setPerformances([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [castName]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">공연 이력 조회 중...</span>
            </div>
        );
    }

    if (performances.length === 0) {
        return <p className="text-sm text-muted-foreground py-6 text-center">관련 공연 이력을 찾을 수 없습니다.</p>;
    }

    return (
        <div className="space-y-2">
            {performances.map((p) => (
                <button
                    key={p.id}
                    onClick={() => navigate(`/performance/${p.id}`)}
                    className="flex items-center gap-3 w-full p-3 rounded-lg border hover:bg-accent/50 transition-colors text-left group"
                >
                    {p.poster ? (
                        <img src={p.poster} alt={p.title} className="w-12 h-16 object-cover rounded border" />
                    ) : (
                        <div className="w-12 h-16 bg-muted rounded border flex items-center justify-center">
                            <Music className="h-4 w-4 text-muted-foreground" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.place}</p>
                        <p className="text-xs text-muted-foreground font-mono">{p.period}</p>
                    </div>
                    <div className={`text-[10px] px-2 py-0.5 border font-bold shrink-0 ${
                        p.status === '공연중' ? 'border-primary text-primary' :
                        p.status === '공연예정' ? 'border-blue-400 text-blue-500' :
                        'border-muted-foreground/30 text-muted-foreground'
                    }`}>
                        {p.status}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
            ))}
        </div>
    );
};

/* ───── 메인 컴포넌트 ───── */
const PerformanceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { detailCache, detailLoading, detailError, fetchDetail } = usePerformanceStore();
    const [castSubTab, setCastSubTab] = useState<'info' | 'works'>('info');
    const [selectedCast, setSelectedCast] = useState<string | null>(null);

    useEffect(() => {
        if (id) fetchDetail(id);
    }, [id, fetchDetail]);

    const performance = id ? detailCache[id] : null;

    const castMembers = performance?.cast
        ? parseCastMembers(performance.cast, performance.genre)
        : [];

    // 첫 출연진 자동 선택
    useEffect(() => {
        if (castMembers.length > 0 && !selectedCast) {
            setSelectedCast(castMembers[0].name);
        }
    }, [castMembers, selectedCast]);

    if (detailLoading && !performance) {
        return (
            <div className="flex justify-center items-center py-20">
                <Spinner size="md" />
                <span className="ml-3 text-muted-foreground">공연 정보를 불러오는 중...</span>
            </div>
        );
    }

    if (!performance) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-screen-md text-center">
                <p className="text-muted-foreground py-20">
                    {detailError || '공연 정보를 찾을 수 없습니다.'}
                </p>
                <Button variant="ghost" className="font-bold" onClick={() => navigate(-1)}>
                    목록으로 돌아가기
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-screen-md">
            <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 mb-6 px-0 hover:bg-transparent font-bold uppercase tracking-widest"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="h-4 w-4" /> Back to list
            </Button>

            {detailError && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg">
                    {detailError}
                </div>
            )}

            {/* ── 포스터 이미지 (상단 고정) ── */}
            <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="aspect-[3/4] bg-muted border rounded-lg overflow-hidden">
                        {performance.poster ? (
                            <img src={performance.poster} alt={performance.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold">NO POSTER</div>
                        )}
                    </div>

                    <div className="flex flex-col justify-between">
                        <div>
                            <div className={`inline-block px-3 py-1 mb-3 border text-[10px] font-bold rounded ${
                                performance.status === "공연중" ? "border-primary text-primary" : "border-muted-foreground/30 text-muted-foreground"
                            }`}>
                                {performance.status}
                            </div>
                            <h1 className="text-2xl font-bold leading-tight mb-4">{performance.title}</h1>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
                                    <div>
                                        <span className="text-sm font-bold">{performance.place}</span>
                                        <p className="text-xs text-muted-foreground">{performance.area} 지역</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
                                    <span className="text-sm font-mono">{performance.period}</span>
                                </div>
                                {performance.schedule && (
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
                                        <span className="text-sm text-muted-foreground">{performance.schedule}</span>
                                    </div>
                                )}
                                {performance.runtime && (
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
                                        <span className="text-sm text-muted-foreground">러닝타임: {performance.runtime}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {performance.bookingUrl ? (
                            <a href={performance.bookingUrl} target="_blank" rel="noopener noreferrer">
                                <Button className="w-full mt-6 py-5 font-bold tracking-widest hover:scale-[1.02] transition-transform">
                                    예매하러 가기
                                </Button>
                            </a>
                        ) : (
                            <a
                                href={`https://search.naver.com/search.naver?query=${encodeURIComponent(performance.title + ' 예매')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="secondary" className="w-full mt-6 py-5 font-bold tracking-widest hover:scale-[1.02] transition-transform">
                                    예매처 검색하기
                                </Button>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* ── 탭 영역 ── */}
            <Tabs defaultValue="detail" className="w-full">
                <TabsList className="w-full grid grid-cols-4 h-12">
                    <TabsTrigger value="detail" className="text-xs sm:text-sm font-semibold">공연상세</TabsTrigger>
                    <TabsTrigger value="cast" className="text-xs sm:text-sm font-semibold">출연진</TabsTrigger>
                    <TabsTrigger value="booking" className="text-xs sm:text-sm font-semibold">예매정보</TabsTrigger>
                    <TabsTrigger value="location" className="text-xs sm:text-sm font-semibold">공연장소</TabsTrigger>
                </TabsList>

                {/* ── 공연상세 탭 ── */}
                <TabsContent value="detail" className="space-y-6 mt-6">
                    {/* 기본 정보 */}
                    <Card className="p-5 space-y-3">
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-3">기본 정보</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            {performance.age && (
                                <div className="flex items-center gap-2">
                                    <Ticket className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">관람연령:</span>
                                    <span className="font-medium">{performance.age}</span>
                                </div>
                            )}
                            {performance.price && (
                                <div className="flex items-center gap-2">
                                    <Ticket className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">가격:</span>
                                    <span className="font-medium">{performance.price}</span>
                                </div>
                            )}
                            {performance.genre && (
                                <div className="flex items-center gap-2">
                                    <Music className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">장르:</span>
                                    <span className="font-medium">{performance.genre}</span>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* 줄거리 */}
                    {performance.synopsis && (
                        <Card className="p-5">
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-3">Synopsis</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                {performance.synopsis}
                            </p>
                        </Card>
                    )}

                    {/* 소개 이미지 갤러리 */}
                    {performance.introImages && performance.introImages.length > 0 && (
                        <Card className="p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Image className="h-4 w-4 text-muted-foreground" />
                                <h3 className="text-sm font-bold uppercase tracking-widest">Gallery</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {performance.introImages.map((img, idx) => (
                                    <div key={idx} className="border rounded-lg overflow-hidden">
                                        <img src={img} alt={`${performance.title} 소개 이미지 ${idx + 1}`} className="w-full h-auto object-cover" />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </TabsContent>

                {/* ── 출연진 탭 ── */}
                <TabsContent value="cast" className="mt-6">
                    {(performance.cast || performance.crew) ? (
                        <div className="space-y-4">
                            {/* 출연진 / 제작진 기본 정보 */}
                            {performance.cast && (
                                <Card className="p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-xs font-bold text-muted-foreground">출연진</span>
                                    </div>
                                    <p className="text-sm leading-relaxed">{performance.cast}</p>
                                </Card>
                            )}
                            {performance.crew && (
                                <Card className="p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-xs font-bold text-muted-foreground">제작진</span>
                                    </div>
                                    <p className="text-sm leading-relaxed">{performance.crew}</p>
                                </Card>
                            )}

                            {/* 서브 탭: 출연진 정보 / 작품활동 */}
                            {castMembers.length > 0 && (
                                <Card className="p-5">
                                    <div className="flex gap-2 mb-4">
                                        <Button
                                            size="sm"
                                            variant={castSubTab === 'info' ? 'default' : 'outline'}
                                            className="text-xs font-semibold"
                                            onClick={() => setCastSubTab('info')}
                                        >
                                            출연진 정보
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={castSubTab === 'works' ? 'default' : 'outline'}
                                            className="text-xs font-semibold"
                                            onClick={() => setCastSubTab('works')}
                                        >
                                            작품활동
                                        </Button>
                                    </div>

                                    {/* 출연진 칩 선택 */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {castMembers.map((m) => (
                                            <button
                                                key={m.name}
                                                onClick={() => setSelectedCast(m.name)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                                    selectedCast === m.name
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted text-muted-foreground hover:bg-accent'
                                                }`}
                                            >
                                                {m.name}
                                            </button>
                                        ))}
                                    </div>

                                    {/* 서브 콘텐츠 */}
                                    {selectedCast && castSubTab === 'info' && (
                                        <CastProfileCard
                                            key={selectedCast}
                                            name={selectedCast}
                                            searchQuery={castMembers.find(m => m.name === selectedCast)?.searchQuery || selectedCast}
                                        />
                                    )}

                                    {selectedCast && castSubTab === 'works' && (
                                        <CastPastPerformances key={selectedCast} castName={selectedCast} />
                                    )}
                                </Card>
                            )}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-muted-foreground text-sm">
                            출연진 정보가 등록되지 않았습니다.
                        </div>
                    )}
                </TabsContent>

                {/* ── 예매정보 탭 ── */}
                <TabsContent value="booking" className="mt-6 space-y-4">
                    {/* 가격 정보 */}
                    {performance.price && (
                        <Card className="p-5 border-l-4 border-l-primary">
                            <p className="text-xs uppercase text-muted-foreground mb-1 font-bold tracking-wider">Ticket Price</p>
                            <p className="text-lg font-bold">{performance.price}</p>
                        </Card>
                    )}

                    {/* 예매처 링크 */}
                    <Card className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <LinkIcon className="h-4 w-4 text-muted-foreground" />
                            <h3 className="text-sm font-bold uppercase tracking-widest">예매처</h3>
                        </div>

                        {performance.relatedLinks && performance.relatedLinks.length > 0 ? (
                            <div className="space-y-2">
                                {performance.relatedLinks.map((link, idx) => (
                                    <a
                                        key={idx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-4 rounded-lg border hover:border-primary hover:bg-accent/50 transition-all group"
                                    >
                                        <span className="font-medium text-sm group-hover:text-primary">{link.name}</span>
                                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-sm text-muted-foreground text-center py-2">
                                    등록된 예매처 링크가 없습니다.
                                </p>
                                {performance.bookingUrl ? (
                                    <a href={performance.bookingUrl} target="_blank" rel="noopener noreferrer"
                                       className="flex items-center justify-between p-4 rounded-lg border hover:border-primary hover:bg-accent/50 transition-all group">
                                        <span className="font-medium text-sm group-hover:text-primary">공식 예매처</span>
                                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                    </a>
                                ) : (
                                    <a href={`https://search.naver.com/search.naver?query=${encodeURIComponent(performance.title + ' 예매')}`}
                                       target="_blank" rel="noopener noreferrer"
                                       className="flex items-center justify-between p-4 rounded-lg border hover:border-primary hover:bg-accent/50 transition-all group">
                                        <span className="font-medium text-sm group-hover:text-primary">네이버에서 예매처 찾기</span>
                                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                    </a>
                                )}
                            </div>
                        )}
                    </Card>

                    <p className="text-[10px] text-muted-foreground text-center italic">
                        * 예매처 정보는 공연 주최측의 사정에 따라 변경될 수 있습니다.
                    </p>
                </TabsContent>

                {/* ── 공연장소 탭 ── */}
                <TabsContent value="location" className="mt-6">
                    <Card className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <h3 className="text-sm font-bold uppercase tracking-widest">공연장 정보</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">공연장명</p>
                                <p className="font-bold">{performance.place}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">지역</p>
                                <p className="text-sm">{performance.area}</p>
                            </div>
                            {performance.lat && performance.lng && (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">좌표</p>
                                    <p className="text-sm font-mono">{performance.lat}, {performance.lng}</p>
                                </div>
                            )}
                        </div>

                        {/* 지도 링크 */}
                        <div className="mt-4 pt-4 border-t">
                            <a
                                href={`https://map.naver.com/v5/search/${encodeURIComponent(performance.place)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="outline" size="sm" className="gap-2 text-xs w-full">
                                    <MapPin className="h-4 w-4" />
                                    네이버 지도에서 보기
                                </Button>
                            </a>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PerformanceDetail;
