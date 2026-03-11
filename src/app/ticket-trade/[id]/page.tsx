'use client';

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useTicketTradeStore } from "@/stores/ticketTradeStore";
import { currentUser } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    ChevronLeft, Star, ShieldCheck, ShieldOff, Clock,
    MapPin, Ticket, User, Eye, CheckCircle, XCircle,
    MessageSquare, AlertTriangle
} from "lucide-react";
import type { TicketTradeStatus, TicketVerifyStatus } from "@/types";

const STATUS_COLOR: Record<TicketTradeStatus, string> = {
    거래가능: "bg-green-50 text-green-700 border-green-200",
    예약중: "bg-yellow-50 text-yellow-700 border-yellow-200",
    거래완료: "bg-gray-100 text-gray-500 border-gray-200",
};

const VERIFY_DETAIL: Record<TicketVerifyStatus, { icon: React.ReactNode; label: string; desc: string; color: string; bg: string }> = {
    verified: {
        icon: <ShieldCheck className="h-4 w-4" />,
        label: "인증 완료",
        desc: "예매 내역이 확인된 티켓입니다. 사기 위험이 낮습니다.",
        color: "text-green-700",
        bg: "bg-green-50 border-green-200",
    },
    pending: {
        icon: <Clock className="h-4 w-4" />,
        label: "인증 진행 중",
        desc: "현재 티켓 인증이 진행 중입니다.",
        color: "text-yellow-700",
        bg: "bg-yellow-50 border-yellow-200",
    },
    unverified: {
        icon: <ShieldOff className="h-4 w-4" />,
        label: "미인증",
        desc: "인증되지 않은 티켓입니다. 거래 시 주의하세요.",
        color: "text-gray-600",
        bg: "bg-gray-50 border-gray-200",
    },
};

const TicketTradeDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const router = useRouter();
    const { trades, requests, requestTrade, acceptRequest, rejectRequest, completeTrade } = useTicketTradeStore();

    const trade = trades.find(t => t.id === Number(id));
    const tradeRequests = requests.filter(r => r.tradeId === Number(id));
    const myRequest = tradeRequests.find(r => r.buyerId === currentUser.userId);

    const [message, setMessage] = useState("");
    const [showRequest, setShowRequest] = useState(false);
    const [showRequests, setShowRequests] = useState(false);

    const isLoggedIn = currentUser && currentUser.userId !== "" && currentUser.userId !== "guest";
    const isSeller = trade?.sellerId === currentUser.userId;

    if (!trade) {
        return (
            <div className="container mx-auto px-4 py-20 text-center text-gray-400">
                <p>존재하지 않는 게시글입니다.</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push("/ticket-trade")}>목록으로</Button>
            </div>
        );
    }

    const verifyInfo = VERIFY_DETAIL[trade.verifyStatus];
    const priceDiff = trade.type === '양도' && trade.originalPrice > 0 ? trade.tradePrice - trade.originalPrice : null;

    const handleRequest = () => {
        if (!isLoggedIn) { router.push("/login"); return; }
        if (!message.trim()) return;
        requestTrade(trade.id, currentUser.userId, currentUser.nickname || currentUser.name, message);
        setMessage("");
        setShowRequest(false);
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-3xl">
            <button
                onClick={() => router.push("/ticket-trade")}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-6"
            >
                <ChevronLeft className="h-4 w-4" />
                티켓 거래 목록
            </button>

            {/* 헤더 */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Badge
                        variant="outline"
                        className={`text-xs font-bold ${trade.type === '양도' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}
                    >
                        {trade.type === '양도' ? '티켓 양도' : '티켓 구매 희망'}
                    </Badge>
                    <Badge variant="outline" className={`text-xs font-bold ${STATUS_COLOR[trade.status]}`}>
                        {trade.status}
                    </Badge>
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">{trade.performanceTitle}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-500 border-y border-gray-100 py-3">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-gray-800">{trade.sellerRating.toFixed(1)}</span>
                        <span className="ml-1">{trade.sellerName}</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span>{trade.createdAt}</span>
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>조회 {trade.views}</span>
                    </div>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {/* 공연 정보 */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded space-y-2.5">
                    <h3 className="text-sm font-bold text-gray-700 mb-3">공연 정보</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span>{trade.performanceDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span>{trade.venue} · {trade.area}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Ticket className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span>{trade.seatInfo}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span>{trade.quantity}매</span>
                    </div>
                </div>

                {/* 가격 + 인증 */}
                <div className="space-y-3">
                    {/* 가격 */}
                    <div className="p-4 border border-gray-200 rounded">
                        <p className="text-xs text-gray-500 mb-1">
                            {trade.type === '양도' ? '양도가' : '희망 구매가'}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">{trade.tradePrice.toLocaleString()}원</p>
                        {trade.originalPrice > 0 && (
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-400 line-through">{trade.originalPrice.toLocaleString()}원</span>
                                {priceDiff !== null && (
                                    <span className={`text-xs font-bold ${priceDiff < 0 ? 'text-green-600' : priceDiff > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                        {priceDiff < 0 ? `${Math.abs(priceDiff).toLocaleString()}원 저렴` : priceDiff > 0 ? `${priceDiff.toLocaleString()}원 비쌈` : '정가'}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 인증 상태 */}
                    <div className={`flex items-start gap-2.5 p-3 border rounded ${verifyInfo.bg}`}>
                        <div className={`flex-shrink-0 mt-0.5 ${verifyInfo.color}`}>{verifyInfo.icon}</div>
                        <div>
                            <p className={`text-xs font-bold ${verifyInfo.color}`}>{verifyInfo.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{verifyInfo.desc}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 상세 설명 */}
            <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3">상세 설명</h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{trade.description}</p>
            </div>

            {/* 사기 방지 안내 */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded mb-6">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-bold text-amber-700 mb-1">안전한 거래를 위한 안내</p>
                    <ul className="text-xs text-amber-600 space-y-0.5 list-disc list-inside">
                        <li>가능하면 직거래 또는 공식 안전결제 서비스를 이용하세요.</li>
                        <li>선입금 후 잠적하는 사기에 주의하세요.</li>
                        <li>예매 내역 확인 후 거래하시고, 의심스러우면 신고해주세요.</li>
                        <li>인증 완료 티켓을 우선적으로 거래하세요.</li>
                    </ul>
                </div>
            </div>

            {/* 판매자 관리 영역 */}
            {isSeller && (
                <div className="border-t pt-5 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-gray-700">거래 신청 관리</h3>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowRequests(!showRequests)}
                            className="flex items-center gap-1.5"
                        >
                            <MessageSquare className="h-3.5 w-3.5" />
                            신청 ({tradeRequests.filter(r => r.status === 'pending').length})
                        </Button>
                    </div>

                    {showRequests && (
                        <div className="space-y-3">
                            {tradeRequests.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-6">아직 거래 신청이 없습니다.</p>
                            ) : (
                                tradeRequests.map(req => (
                                    <div key={req.id} className="border border-gray-200 rounded p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-bold">{req.buyerName}</span>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                req.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-600'
                                            }`}>
                                                {req.status === 'pending' ? '대기중' : req.status === 'accepted' ? '수락됨' : '거절됨'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{req.message}</p>
                                        {req.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-black text-white flex items-center gap-1"
                                                    onClick={() => acceptRequest(req.id, trade.id)}
                                                >
                                                    <CheckCircle className="h-3.5 w-3.5" />
                                                    수락
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex items-center gap-1 text-red-500 border-red-200"
                                                    onClick={() => rejectRequest(req.id)}
                                                >
                                                    <XCircle className="h-3.5 w-3.5" />
                                                    거절
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                            {trade.status === '예약중' && (
                                <Button
                                    className="w-full bg-black text-white mt-2"
                                    onClick={() => completeTrade(trade.id)}
                                >
                                    거래 완료 처리
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* 구매자 신청 영역 */}
            {!isSeller && (
                <div className="border-t pt-5">
                    {myRequest ? (
                        <div className={`p-4 rounded border text-sm font-medium text-center ${
                            myRequest.status === 'pending' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                            myRequest.status === 'accepted' ? 'bg-green-50 border-green-200 text-green-700' :
                            'bg-red-50 border-red-200 text-red-600'
                        }`}>
                            {myRequest.status === 'pending' && '거래 신청 완료! 판매자의 수락을 기다리고 있습니다.'}
                            {myRequest.status === 'accepted' && '거래 신청이 수락되었습니다! 판매자와 직접 연락해주세요.'}
                            {myRequest.status === 'rejected' && '거래 신청이 거절되었습니다.'}
                        </div>
                    ) : trade.status === '거래완료' ? (
                        <div className="p-4 rounded border bg-gray-50 text-sm text-gray-500 text-center">
                            거래가 완료된 게시글입니다.
                        </div>
                    ) : trade.status === '예약중' ? (
                        <div className="p-4 rounded border bg-yellow-50 border-yellow-200 text-sm text-yellow-700 text-center">
                            현재 다른 구매자와 거래 협의 중입니다.
                        </div>
                    ) : !showRequest ? (
                        <Button className="w-full bg-black text-white" onClick={() => {
                            if (!isLoggedIn) { router.push("/login"); return; }
                            setShowRequest(true);
                        }}>
                            <Ticket className="h-4 w-4 mr-2" />
                            {trade.type === '양도' ? '구매 신청하기' : '판매 연락하기'}
                        </Button>
                    ) : (
                        <div className="space-y-3">
                            <textarea
                                placeholder="판매자에게 메시지를 보내세요. (희망 거래 방법, 연락처 등)"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded resize-none focus:outline-none focus:ring-1 focus:ring-gray-400"
                            />
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1" onClick={() => setShowRequest(false)}>
                                    취소
                                </Button>
                                <Button className="flex-1 bg-black text-white" onClick={handleRequest}>
                                    신청하기
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TicketTradeDetailPage;
