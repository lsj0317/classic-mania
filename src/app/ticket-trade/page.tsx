'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTicketTradeStore } from "@/stores/ticketTradeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
    Search, ChevronLeft, ChevronRight, Plus, Star,
    ShieldCheck, ShieldOff, Clock, MapPin, Ticket
} from "lucide-react";
import type { TicketTradeStatus, TicketTradeType, TicketVerifyStatus } from "@/types";

const ITEMS_PER_PAGE = 8;
const AREA_FILTERS = ["전체", "서울", "부산", "대구", "대전", "광주", "경기"];
const TYPE_FILTERS: { label: string; value: TicketTradeType | "전체" }[] = [
    { label: "전체", value: "전체" },
    { label: "양도", value: "양도" },
    { label: "구매", value: "구매" },
];
const STATUS_FILTERS: { label: string; value: TicketTradeStatus | "전체" }[] = [
    { label: "전체", value: "전체" },
    { label: "거래가능", value: "거래가능" },
    { label: "예약중", value: "예약중" },
    { label: "거래완료", value: "거래완료" },
];

const STATUS_COLOR: Record<TicketTradeStatus, string> = {
    거래가능: "bg-green-50 text-green-700 border-green-200",
    예약중: "bg-yellow-50 text-yellow-700 border-yellow-200",
    거래완료: "bg-gray-100 text-gray-500 border-gray-200",
};

const VERIFY_INFO: Record<TicketVerifyStatus, { icon: React.ReactNode; label: string; color: string }> = {
    verified: { icon: <ShieldCheck className="h-3 w-3" />, label: "인증완료", color: "text-green-600" },
    pending: { icon: <Clock className="h-3 w-3" />, label: "인증중", color: "text-yellow-600" },
    unverified: { icon: <ShieldOff className="h-3 w-3" />, label: "미인증", color: "text-gray-400" },
};

const TicketTradePage = () => {
    const router = useRouter();
    const { trades, incrementViews } = useTicketTradeStore();

    const [search, setSearch] = useState("");
    const [areaFilter, setAreaFilter] = useState("전체");
    const [typeFilter, setTypeFilter] = useState<TicketTradeType | "전체">("전체");
    const [statusFilter, setStatusFilter] = useState<TicketTradeStatus | "전체">("전체");
    const [page, setPage] = useState(1);

    const filtered = trades.filter(t => {
        const matchArea = areaFilter === "전체" || t.area === areaFilter;
        const matchType = typeFilter === "전체" || t.type === typeFilter;
        const matchStatus = statusFilter === "전체" || t.status === statusFilter;
        const matchSearch =
            t.performanceTitle.toLowerCase().includes(search.toLowerCase()) ||
            t.seatInfo.toLowerCase().includes(search.toLowerCase());
        return matchArea && matchType && matchStatus && matchSearch;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const handleClick = (id: number) => {
        incrementViews(id);
        router.push(`/ticket-trade/${id}`);
    };

    const priceDiff = (original: number, trade: number, type: TicketTradeType) => {
        if (type === "구매") return null;
        if (original === 0) return null;
        const diff = trade - original;
        if (diff < 0) return <span className="text-green-600 font-bold text-xs">정가보다 {Math.abs(diff).toLocaleString()}원 저렴</span>;
        if (diff > 0) return <span className="text-red-500 font-bold text-xs">정가보다 {diff.toLocaleString()}원 비쌈</span>;
        return <span className="text-gray-500 text-xs">정가와 동일</span>;
    };

    return (
        <div className="container mx-auto px-4 py-6 lg:py-8 max-w-screen-xl">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">티켓 중고거래 & 양도</h2>
                <p className="mt-1 text-sm text-gray-500">안전하게 티켓을 양도하거나 구매하세요. 인증된 티켓은 사기 위험이 낮습니다.</p>
            </div>

            {/* 필터 */}
            <div className="mb-6 space-y-4">
                {/* 지역 필터 */}
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

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center border-t pt-4">
                    {/* 유형 필터 */}
                    <div className="flex gap-2 bg-gray-100 p-1 flex-shrink-0">
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

                    {/* 상태 필터 */}
                    <div className="flex gap-2 flex-wrap">
                        {STATUS_FILTERS.map(f => (
                            <button
                                key={f.value}
                                onClick={() => { setStatusFilter(f.value); setPage(1); }}
                                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${statusFilter === f.value ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-300 hover:border-gray-500'}`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
                        <div className="flex-1 sm:w-64 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="공연명 또는 좌석 검색"
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1); }}
                                className="pl-9"
                            />
                        </div>
                        <Button
                            className="bg-black text-white whitespace-nowrap flex items-center gap-1.5"
                            size="sm"
                            onClick={() => router.push("/ticket-trade/write")}
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
                    {paginated.map(trade => {
                        const verifyInfo = VERIFY_INFO[trade.verifyStatus];
                        return (
                            <Card
                                key={trade.id}
                                className={`border shadow-none hover:shadow-md transition-shadow cursor-pointer ${trade.status === '거래완료' ? 'opacity-60' : 'border-gray-200'}`}
                                onClick={() => handleClick(trade.id)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-1.5 mb-3">
                                        <Badge
                                            variant="outline"
                                            className={`text-[10px] font-bold ${trade.type === '양도' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}
                                        >
                                            {trade.type}
                                        </Badge>
                                        <Badge variant="outline" className={`text-[10px] font-bold ${STATUS_COLOR[trade.status]}`}>
                                            {trade.status}
                                        </Badge>
                                        <div className={`flex items-center gap-0.5 text-[10px] font-medium ml-auto ${verifyInfo.color}`}>
                                            {verifyInfo.icon}
                                            <span>{verifyInfo.label}</span>
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-sm text-gray-900 line-clamp-1 mb-1">
                                        {trade.performanceTitle}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-3">{trade.seatInfo}</p>

                                    <div className="space-y-1 text-xs text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <Ticket className="h-3.5 w-3.5 flex-shrink-0" />
                                            <span>{trade.performanceDate} · {trade.quantity}매</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                            <span className="line-clamp-1">{trade.venue}</span>
                                        </div>
                                    </div>

                                    {/* 가격 */}
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        {trade.type === '구매' ? (
                                            <div>
                                                <span className="text-xs text-gray-500">희망 구매가</span>
                                                <p className="font-bold text-gray-900">{trade.tradePrice.toLocaleString()}원</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="flex items-baseline gap-1.5">
                                                    <p className="font-bold text-gray-900">{trade.tradePrice.toLocaleString()}원</p>
                                                    {trade.originalPrice > 0 && (
                                                        <span className="text-xs text-gray-400 line-through">{trade.originalPrice.toLocaleString()}원</span>
                                                    )}
                                                </div>
                                                {priceDiff(trade.originalPrice, trade.tradePrice, trade.type)}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <span className="font-medium">{trade.sellerRating.toFixed(1)}</span>
                                        <span className="text-gray-400 ml-1">{trade.sellerName}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400">조회 {trade.views}</span>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="py-20 text-center text-gray-400">
                    <Ticket className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                    <p className="text-sm">조건에 맞는 티켓 거래 게시글이 없습니다.</p>
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

export default TicketTradePage;
