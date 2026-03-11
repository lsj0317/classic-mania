'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCompanionStore } from "@/stores/companionStore";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronLeft, ChevronRight, Users, MapPin, Calendar, Plus } from "lucide-react";
import type { CompanionStatus, CompanionGender } from "@/types";

const ITEMS_PER_PAGE = 8;
const AREA_FILTERS = ["전체", "서울", "부산", "대구", "대전", "광주", "경기"];
const STATUS_FILTERS: { label: string; value: CompanionStatus | "전체" }[] = [
    { label: "전체", value: "전체" },
    { label: "모집중", value: "모집중" },
    { label: "모집완료", value: "모집완료" },
];

const GENDER_LABEL: Record<CompanionGender, string> = {
    "무관": "성별 무관",
    "남성": "남성 선호",
    "여성": "여성 선호",
};

const CompanionPage = () => {
    const router = useRouter();
    const { posts, incrementViews } = useCompanionStore();

    const [search, setSearch] = useState("");
    const [areaFilter, setAreaFilter] = useState("전체");
    const [statusFilter, setStatusFilter] = useState<CompanionStatus | "전체">("전체");
    const [page, setPage] = useState(1);

    const filtered = posts.filter(p => {
        const matchArea = areaFilter === "전체" || p.area === areaFilter;
        const matchStatus = statusFilter === "전체" || p.status === statusFilter;
        const matchSearch =
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.performanceTitle.toLowerCase().includes(search.toLowerCase());
        return matchArea && matchStatus && matchSearch;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const handleClick = (id: number) => {
        incrementViews(id);
        router.push(`/companion/${id}`);
    };

    return (
        <div className="container mx-auto px-4 py-6 lg:py-8 max-w-screen-xl">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">동행 구하기</h2>
                <p className="mt-1 text-sm text-gray-500">같은 공연을 함께 즐길 동행을 찾아보세요.</p>
            </div>

            {/* 필터 */}
            <div className="mb-6 space-y-4">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {AREA_FILTERS.map(area => (
                        <Button
                            key={area}
                            variant={areaFilter === area ? "default" : "outline"}
                            size="sm"
                            className={`whitespace-nowrap flex-shrink-0 ${areaFilter === area ? "bg-black text-white border-black" : "text-gray-500 border-gray-300"}`}
                            onClick={() => { setAreaFilter(area); setPage(1); }}
                        >
                            {area}
                        </Button>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border-t pt-4">
                    <div className="flex gap-2 bg-gray-100 p-1">
                        {STATUS_FILTERS.map(f => (
                            <Button
                                key={f.value}
                                variant="ghost"
                                size="sm"
                                className={`px-4 py-2 ${statusFilter === f.value ? "bg-white shadow-sm font-bold" : "text-gray-500"}`}
                                onClick={() => { setStatusFilter(f.value); setPage(1); }}
                            >
                                {f.label}
                            </Button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="flex-1 sm:w-72 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="공연명 또는 제목 검색"
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1); }}
                                className="pl-9"
                            />
                        </div>
                        <Button
                            className="bg-black text-white whitespace-nowrap flex items-center gap-1.5"
                            size="sm"
                            onClick={() => router.push("/companion/write")}
                        >
                            <Plus className="h-4 w-4" />
                            글쓰기
                        </Button>
                    </div>
                </div>
            </div>

            {/* 목록 */}
            {paginated.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {paginated.map(post => (
                        <Card
                            key={post.id}
                            className="border border-gray-200 shadow-none hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleClick(post.id)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <Badge
                                        variant="outline"
                                        className={`text-[10px] font-bold flex-shrink-0 ${post.status === '모집중' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}
                                    >
                                        {post.status}
                                    </Badge>
                                    <span className="text-[10px] text-gray-400">{GENDER_LABEL[post.preferGender]}</span>
                                </div>

                                <h3 className="font-bold text-sm text-gray-900 line-clamp-2 mb-2 leading-snug">
                                    {post.title}
                                </h3>

                                <div className="space-y-1.5 text-xs text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                                        <span className="line-clamp-1">{post.performanceTitle}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                        <span>{post.venue} · {post.area}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users className="h-3.5 w-3.5 flex-shrink-0" />
                                        <span>{post.currentCompanions}/{post.maxCompanions}명 신청</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-medium">{post.authorName}</span>
                                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                    <span>{post.performanceDate}</span>
                                    <span>·</span>
                                    <span>조회 {post.views}</span>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center text-gray-400">
                    <Users className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                    <p className="text-sm">조건에 맞는 동행 모집글이 없습니다.</p>
                </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className={`flex items-center gap-1 font-bold ${page === 1 ? "text-gray-300" : "text-black"}`}
                    >
                        <ChevronLeft strokeWidth={3} className="h-3 w-3" /> 이전
                    </Button>
                    <span className="text-sm font-bold text-gray-500">
                        <span className="text-black">{page}</span> / {totalPages}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                        className={`flex items-center gap-1 font-bold ${page === totalPages ? "text-gray-300" : "text-black"}`}
                    >
                        다음 <ChevronRight strokeWidth={3} className="h-3 w-3" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CompanionPage;
