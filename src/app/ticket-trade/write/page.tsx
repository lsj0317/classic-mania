'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTicketTradeStore } from "@/stores/ticketTradeStore";
import { currentUser } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import type { TicketTradeType, TicketVerifyStatus } from "@/types";

const TYPE_OPTIONS: TicketTradeType[] = ["양도", "구매"];
const AREA_OPTIONS = ["서울", "부산", "대구", "대전", "광주", "인천", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];

const TicketTradeWritePage = () => {
    const router = useRouter();
    const { addTrade } = useTicketTradeStore();

    const [form, setForm] = useState({
        type: "양도" as TicketTradeType,
        performanceTitle: "",
        performanceDate: "",
        venue: "",
        area: "서울",
        seatInfo: "",
        originalPrice: "",
        tradePrice: "",
        quantity: 1,
        description: "",
        verifyStatus: "unverified" as TicketVerifyStatus,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isLoggedIn = currentUser && currentUser.userId !== "" && currentUser.userId !== "guest";

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.performanceTitle.trim()) e.performanceTitle = "공연명을 입력해주세요.";
        if (!form.performanceDate) e.performanceDate = "공연 날짜를 입력해주세요.";
        if (!form.venue.trim()) e.venue = "공연장을 입력해주세요.";
        if (form.type === "양도" && !form.seatInfo.trim()) e.seatInfo = "좌석 정보를 입력해주세요.";
        if (!form.tradePrice) e.tradePrice = "거래 가격을 입력해주세요.";
        if (!form.description.trim()) e.description = "설명을 입력해주세요.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = () => {
        if (!isLoggedIn) { router.push("/login"); return; }
        if (!validate()) return;

        addTrade({
            type: form.type,
            performanceTitle: form.performanceTitle,
            performanceDate: form.performanceDate,
            venue: form.venue,
            area: form.area,
            seatInfo: form.seatInfo || "구매 희망",
            originalPrice: form.originalPrice ? Number(form.originalPrice) : 0,
            tradePrice: Number(form.tradePrice),
            quantity: form.quantity,
            sellerId: currentUser.userId,
            sellerName: currentUser.nickname || currentUser.name,
            sellerRating: 4.5,
            verifyStatus: form.verifyStatus,
            description: form.description,
            images: [],
        });
        router.push("/ticket-trade");
    };

    const update = (key: string, value: string | number) =>
        setForm(prev => ({ ...prev, [key]: value }));

    return (
        <div className="container mx-auto px-4 py-6 max-w-2xl">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-6"
            >
                <ChevronLeft className="h-4 w-4" />
                돌아가기
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-6">티켓 거래 글쓰기</h2>

            <div className="space-y-5">
                {/* 거래 유형 */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">거래 유형</label>
                    <div className="flex gap-2">
                        {TYPE_OPTIONS.map(type => (
                            <button
                                key={type}
                                onClick={() => update("type", type)}
                                className={`flex-1 py-2.5 text-sm font-medium border rounded transition-all ${form.type === type ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'}`}
                            >
                                {type === "양도" ? "티켓 양도 (팝니다)" : "티켓 구매 (삽니다)"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 공연 정보 */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded space-y-4">
                    <h3 className="text-sm font-bold text-gray-700">공연 정보</h3>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">공연명 *</label>
                        <Input
                            placeholder="예) 베를린 필하모닉 내한공연"
                            value={form.performanceTitle}
                            onChange={e => update("performanceTitle", e.target.value)}
                            className={errors.performanceTitle ? "border-red-400" : ""}
                        />
                        {errors.performanceTitle && <p className="text-xs text-red-500 mt-1">{errors.performanceTitle}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">공연 날짜 *</label>
                            <Input
                                type="date"
                                value={form.performanceDate}
                                onChange={e => update("performanceDate", e.target.value)}
                                className={errors.performanceDate ? "border-red-400" : ""}
                            />
                            {errors.performanceDate && <p className="text-xs text-red-500 mt-1">{errors.performanceDate}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">지역</label>
                            <select
                                value={form.area}
                                onChange={e => update("area", e.target.value)}
                                className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                            >
                                {AREA_OPTIONS.map(a => <option key={a}>{a}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">공연장 *</label>
                        <Input
                            placeholder="예) 롯데콘서트홀"
                            value={form.venue}
                            onChange={e => update("venue", e.target.value)}
                            className={errors.venue ? "border-red-400" : ""}
                        />
                        {errors.venue && <p className="text-xs text-red-500 mt-1">{errors.venue}</p>}
                    </div>
                </div>

                {/* 티켓 정보 */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded space-y-4">
                    <h3 className="text-sm font-bold text-gray-700">티켓 정보</h3>

                    {form.type === "양도" && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">좌석 정보 *</label>
                            <Input
                                placeholder="예) R석 A구역 15열 22번"
                                value={form.seatInfo}
                                onChange={e => update("seatInfo", e.target.value)}
                                className={errors.seatInfo ? "border-red-400" : ""}
                            />
                            {errors.seatInfo && <p className="text-xs text-red-500 mt-1">{errors.seatInfo}</p>}
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">수량</label>
                            <select
                                value={form.quantity}
                                onChange={e => update("quantity", Number(e.target.value))}
                                className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                            >
                                {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}매</option>)}
                            </select>
                        </div>
                        {form.type === "양도" && (
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">정가 (원)</label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={form.originalPrice}
                                    onChange={e => update("originalPrice", e.target.value)}
                                />
                            </div>
                        )}
                        <div className={form.type === "양도" ? "" : "col-span-2"}>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                {form.type === "양도" ? "양도가 (원) *" : "희망 구매가 (원) *"}
                            </label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={form.tradePrice}
                                onChange={e => update("tradePrice", e.target.value)}
                                className={errors.tradePrice ? "border-red-400" : ""}
                            />
                            {errors.tradePrice && <p className="text-xs text-red-500 mt-1">{errors.tradePrice}</p>}
                        </div>
                    </div>
                </div>

                {/* 티켓 인증 안내 (양도 시) */}
                {form.type === "양도" && (
                    <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded">
                        <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-green-700 mb-1">티켓 인증으로 신뢰도를 높이세요</p>
                            <p className="text-xs text-green-600">
                                예매 내역 캡처본을 함께 등록하면 <strong>인증 마크</strong>가 부여되어 구매자에게 신뢰를 줄 수 있습니다.
                                인증 게시글은 더 빠르게 거래가 이루어집니다.
                            </p>
                        </div>
                    </div>
                )}

                {/* 설명 */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">상세 설명 *</label>
                    <textarea
                        placeholder={form.type === "양도"
                            ? "티켓 양도 사유, 거래 방법(직거래/택배/안전결제), 연락처 등을 입력해주세요."
                            : "원하는 좌석 등급, 수량, 거래 방법 등을 입력해주세요."
                        }
                        value={form.description}
                        onChange={e => update("description", e.target.value)}
                        rows={5}
                        className={`w-full px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-gray-400 ${errors.description ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                </div>

                <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => router.back()}>
                        취소
                    </Button>
                    <Button className="flex-1 bg-black text-white" onClick={handleSubmit}>
                        등록하기
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TicketTradeWritePage;
