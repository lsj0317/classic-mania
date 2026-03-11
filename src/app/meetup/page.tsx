'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMeetupStore } from "@/stores/meetupStore";
import { currentUser } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Search, Users, MapPin, Calendar, ChevronLeft, ChevronRight, Plus, Video, Zap } from "lucide-react";
import type { MeetupType, MeetupStatus } from "@/types";

const ITEMS_PER_PAGE = 6;
const AREA_FILTERS = ["전체", "서울", "부산", "대구", "대전", "광주", "전국"];
const TYPE_FILTERS: { label: string; value: MeetupType | "전체"; icon?: React.ReactNode }[] = [
    { label: "전체", value: "전체" },
    { label: "정기모임", value: "정기모임" },
    { label: "번개", value: "번개" },
    { label: "온라인", value: "온라인" },
];

const TYPE_BADGE: Record<MeetupType, { color: string; icon: React.ReactNode }> = {
    정기모임: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: <Users className="h-3 w-3" /> },
    번개: { color: "bg-orange-50 text-orange-700 border-orange-200", icon: <Zap className="h-3 w-3" /> },
    온라인: { color: "bg-purple-50 text-purple-700 border-purple-200", icon: <Video className="h-3 w-3" /> },
};

const STATUS_COLOR: Record<MeetupStatus, string> = {
    모집중: "bg-green-50 text-green-700 border-green-200",
    모집완료: "bg-gray-100 text-gray-500 border-gray-200",
    종료: "bg-red-50 text-red-500 border-red-200",
};

const MeetupPage = () => {
    const router = useRouter();
    const { meetups, joinMeetup } = useMeetupStore();

    const [search, setSearch] = useState("");
    const [areaFilter, setAreaFilter] = useState("전체");
    const [typeFilter, setTypeFilter] = useState<MeetupType | "전체">("전체");
    const [page, setPage] = useState(1);

    const isLoggedIn = currentUser && currentUser.userId !== "" && currentUser.userId !== "guest";

    const filtered = meetups.filter(m => {
        const matchArea = areaFilter === "전체" || m.area === areaFilter;
        const matchType = typeFilter === "전체" || m.type === typeFilter;
        const matchSearch =
            m.title.toLowerCase().includes(search.toLowerCase()) ||
            (m.genre ?? "").toLowerCase().includes(search.toLowerCase());
        return matchArea && matchType && matchSearch;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const handleJoin = (e: React.MouseEvent, meetupId: number) => {
        e.stopPropagation();
        if (!isLoggedIn) { router.push("/login"); return; }
        joinMeetup(meetupId, currentUser.userId);
    };

    return (
        <div className="container mx-auto px-4 py-6 lg:py-8 max-w-screen-xl">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">소모임 & 이벤트</h2>
                <p className="mt-1 text-sm text-gray-500">클래식 애호가들과 오프라인·온라인으로 만나보세요.</p>
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
                        {TYPE_FILTERS.map(f => (
                            <Button
                                key={f.value}
                                variant="ghost"
                                size="sm"
                                className={`px-4 py-2 ${typeFilter === f.value ? "bg-white shadow-sm font-bold" : "text-gray-500"}`}
                                onClick={() => { setTypeFilter(f.value); setPage(1); }}
                            >
                                {f.label}
                            </Button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="flex-1 sm:w-72 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="소모임명 또는 장르 검색"
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1); }}
                                className="pl-9"
                            />
                        </div>
                        <Button
                            className="bg-black text-white whitespace-nowrap flex items-center gap-1.5"
                            size="sm"
                            onClick={() => router.push("/meetup/create")}
                        >
                            <Plus className="h-4 w-4" />
                            모임 개설
                        </Button>
                    </div>
                </div>
            </div>

            {/* 목록 */}
            {paginated.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {paginated.map(meetup => {
                        const isMember = meetup.memberIds.includes(currentUser.userId);
                        const isHost = meetup.hostId === currentUser.userId;
                        const typeBadge = TYPE_BADGE[meetup.type];
                        const isFull = meetup.currentMembers >= meetup.maxMembers;

                        return (
                            <Card
                                key={meetup.id}
                                className="border border-gray-200 shadow-none hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => router.push(`/meetup/${meetup.id}`)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge variant="outline" className={`text-[10px] font-bold flex items-center gap-1 ${typeBadge.color}`}>
                                            {typeBadge.icon}
                                            {meetup.type}
                                        </Badge>
                                        <Badge variant="outline" className={`text-[10px] font-bold ${STATUS_COLOR[meetup.status]}`}>
                                            {meetup.status}
                                        </Badge>
                                    </div>

                                    <h3 className="font-bold text-sm text-gray-900 line-clamp-2 mb-2 leading-snug">
                                        {meetup.title}
                                    </h3>

                                    <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                                        {meetup.description}
                                    </p>

                                    <div className="space-y-1.5 text-xs text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                                            <span>{meetup.meetDate} {meetup.meetTime}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                            <span className="line-clamp-1">{meetup.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users className="h-3.5 w-3.5 flex-shrink-0" />
                                            <span>{meetup.currentMembers}/{meetup.maxMembers}명 참여 중</span>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-xs text-gray-500">주최: {meetup.hostName}</span>
                                    {isHost ? (
                                        <span className="text-xs font-bold text-gray-700">내 모임</span>
                                    ) : isMember ? (
                                        <span className="text-xs font-bold text-green-600">참여중</span>
                                    ) : meetup.status === '모집중' && !isFull ? (
                                        <Button
                                            size="sm"
                                            className="bg-black text-white h-7 px-3 text-xs"
                                            onClick={e => handleJoin(e, meetup.id)}
                                        >
                                            참여하기
                                        </Button>
                                    ) : (
                                        <span className="text-xs text-gray-400">마감</span>
                                    )}
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="py-20 text-center text-gray-400">
                    <Users className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                    <p className="text-sm">조건에 맞는 소모임이 없습니다.</p>
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

export default MeetupPage;
