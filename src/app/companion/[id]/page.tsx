'use client';

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCompanionStore } from "@/stores/companionStore";
import { currentUser } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    ChevronLeft, Users, MapPin, Calendar, Eye, User,
    Clock, MessageSquare, Send, CheckCircle, XCircle, MessageCircle
} from "lucide-react";
import type { CompanionGender } from "@/types";

const GENDER_LABEL: Record<CompanionGender, string> = {
    무관: "성별 무관",
    남성: "남성 선호",
    여성: "여성 선호",
};

const CompanionDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const router = useRouter();
    const { posts, requests, applyCompanion, acceptRequest, rejectRequest, sendDM, getDMRoom, markAsRead } = useCompanionStore();

    const post = posts.find(p => p.id === Number(id));

    const [applyMessage, setApplyMessage] = useState("");
    const [dmTarget, setDmTarget] = useState<string | null>(null);
    const [dmMessage, setDmMessage] = useState("");
    const [showApply, setShowApply] = useState(false);
    const [tab, setTab] = useState<'info' | 'dm'>('info');

    const isLoggedIn = currentUser && currentUser.userId !== "" && currentUser.userId !== "guest";
    const isHost = post?.authorId === currentUser.userId;
    const postRequests = requests.filter(r => r.postId === Number(id));
    const myRequest = postRequests.find(r => r.userId === currentUser.userId);

    // DM 상태
    const dmMessages = dmTarget ? getDMRoom(currentUser.userId, dmTarget) : [];
    const chatPartnerName = dmTarget
        ? (post?.authorId === dmTarget ? post?.authorName : postRequests.find(r => r.userId === dmTarget)?.userName)
        : null;

    useEffect(() => {
        if (dmTarget) markAsRead(`${[currentUser.userId, dmTarget].sort().join('-')}`, currentUser.userId);
    }, [dmTarget, markAsRead]);

    if (!post) {
        return (
            <div className="container mx-auto px-4 py-20 text-center text-gray-400">
                <p>존재하지 않는 게시글입니다.</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push("/companion")}>목록으로</Button>
            </div>
        );
    }

    const handleApply = () => {
        if (!isLoggedIn) { router.push("/login"); return; }
        if (!applyMessage.trim()) return;
        applyCompanion(post.id, currentUser.userId, currentUser.nickname || currentUser.name, applyMessage);
        setApplyMessage("");
        setShowApply(false);
    };

    const handleSendDM = () => {
        if (!dmTarget || !dmMessage.trim()) return;
        sendDM(currentUser.userId, currentUser.nickname || currentUser.name, dmTarget, dmMessage);
        setDmMessage("");
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-3xl">
            <button
                onClick={() => router.push("/companion")}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-6"
            >
                <ChevronLeft className="h-4 w-4" />
                동행 구하기
            </button>

            {/* 헤더 */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Badge
                        variant="outline"
                        className={`text-xs font-bold ${post.status === '모집중' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}
                    >
                        {post.status}
                    </Badge>
                    <span className="text-xs text-gray-400">{GENDER_LABEL[post.preferGender]}</span>
                    {post.ageRange && post.ageRange !== "무관" && (
                        <span className="text-xs text-gray-400">{post.ageRange}</span>
                    )}
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-4">{post.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 border-y border-gray-100 py-3">
                    <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        <span className="font-medium text-gray-700">{post.authorName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{post.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Eye className="h-4 w-4" />
                        <span>조회 {post.views}</span>
                    </div>
                </div>
            </div>

            {/* 탭 (호스트용) */}
            {isHost && (
                <div className="flex gap-2 mb-5">
                    <Button
                        size="sm"
                        variant={tab === 'info' ? 'default' : 'outline'}
                        className={tab === 'info' ? 'bg-black text-white' : 'text-gray-500'}
                        onClick={() => setTab('info')}
                    >
                        게시글 정보
                    </Button>
                    <Button
                        size="sm"
                        variant={tab === 'dm' ? 'default' : 'outline'}
                        className={tab === 'dm' ? 'bg-black text-white' : 'text-gray-500'}
                        onClick={() => setTab('dm')}
                    >
                        <MessageSquare className="h-3.5 w-3.5 mr-1" />
                        신청 관리 ({postRequests.filter(r => r.status === 'pending').length})
                    </Button>
                </div>
            )}

            {tab === 'info' ? (
                <>
                    {/* 공연 정보 카드 */}
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded mb-5 space-y-2">
                        <h3 className="text-sm font-bold text-gray-700 mb-3">공연 정보</h3>
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="font-medium text-gray-800">{post.performanceTitle}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span>{post.venue} · {post.area}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span>{post.performanceDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span>모집 {post.maxCompanions}명 · 신청 {post.currentCompanions}명</span>
                        </div>
                    </div>

                    {/* 본문 */}
                    <div className="prose prose-sm max-w-none mb-6">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    </div>

                    {/* 신청 섹션 */}
                    {!isHost && isLoggedIn && (
                        <div className="border-t pt-5">
                            {myRequest ? (
                                <div className={`p-4 rounded border text-sm font-medium text-center ${
                                    myRequest.status === 'pending' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                                    myRequest.status === 'accepted' ? 'bg-green-50 border-green-200 text-green-700' :
                                    'bg-red-50 border-red-200 text-red-600'
                                }`}>
                                    {myRequest.status === 'pending' && '신청 완료! 호스트의 수락을 기다리고 있습니다.'}
                                    {myRequest.status === 'accepted' && '신청이 수락되었습니다! 동행이 확정되었어요.'}
                                    {myRequest.status === 'rejected' && '신청이 거절되었습니다.'}
                                </div>
                            ) : post.status === '모집완료' ? (
                                <div className="p-4 rounded border bg-gray-50 text-sm text-gray-500 text-center">
                                    모집이 완료된 게시글입니다.
                                </div>
                            ) : (
                                <>
                                    {!showApply ? (
                                        <div className="flex gap-2">
                                            <Button
                                                className="flex-1 bg-black text-white"
                                                onClick={() => setShowApply(true)}
                                            >
                                                <Users className="h-4 w-4 mr-2" />
                                                동행 신청하기
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => { setDmTarget(post.authorId); setTab('dm'); }}
                                                className="flex items-center gap-1.5"
                                            >
                                                <MessageCircle className="h-4 w-4" />
                                                DM 보내기
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <textarea
                                                placeholder="자기 소개와 함께 신청 메시지를 작성해주세요."
                                                value={applyMessage}
                                                onChange={e => setApplyMessage(e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded resize-none focus:outline-none focus:ring-1 focus:ring-gray-400"
                                            />
                                            <div className="flex gap-2">
                                                <Button variant="outline" className="flex-1" onClick={() => setShowApply(false)}>
                                                    취소
                                                </Button>
                                                <Button className="flex-1 bg-black text-white" onClick={handleApply}>
                                                    신청하기
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </>
            ) : (
                /* 호스트용 신청 관리 + DM */
                <div className="space-y-4">
                    {/* 신청 목록 */}
                    {postRequests.length === 0 ? (
                        <div className="py-10 text-center text-gray-400 text-sm">아직 신청자가 없습니다.</div>
                    ) : (
                        postRequests.map(req => (
                            <div key={req.id} className="border border-gray-200 rounded p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div>
                                        <span className="text-sm font-bold text-gray-900">{req.userName}</span>
                                        <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                            req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            req.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                            'bg-red-100 text-red-600'
                                        }`}>
                                            {req.status === 'pending' ? '대기중' : req.status === 'accepted' ? '수락됨' : '거절됨'}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(req.createdAt).toLocaleDateString('ko-KR')}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{req.message}</p>
                                <div className="flex gap-2">
                                    {req.status === 'pending' && (
                                        <>
                                            <Button
                                                size="sm"
                                                className="bg-black text-white flex items-center gap-1"
                                                onClick={() => acceptRequest(req.id, post.id)}
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
                                        </>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex items-center gap-1"
                                        onClick={() => setDmTarget(req.userId)}
                                    >
                                        <MessageCircle className="h-3.5 w-3.5" />
                                        DM
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}

                    {/* DM 영역 */}
                    {dmTarget && (
                        <div className="border border-gray-200 rounded">
                            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                <span className="text-sm font-bold">{chatPartnerName}님과의 대화</span>
                                <button onClick={() => setDmTarget(null)} className="text-xs text-gray-400 hover:text-gray-700">닫기</button>
                            </div>
                            <div className="p-4 h-48 overflow-y-auto space-y-2">
                                {dmMessages.length === 0 ? (
                                    <p className="text-xs text-gray-400 text-center mt-8">아직 메시지가 없습니다.</p>
                                ) : (
                                    dmMessages.map(dm => {
                                        const isMe = dm.senderId === currentUser.userId;
                                        return (
                                            <div key={dm.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${isMe ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'}`}>
                                                    {dm.message}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            <div className="flex items-center gap-2 p-3 border-t border-gray-100">
                                <Input
                                    placeholder="메시지를 입력하세요"
                                    value={dmMessage}
                                    onChange={e => setDmMessage(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendDM(); } }}
                                    className="text-sm"
                                />
                                <Button size="icon" className="bg-black text-white flex-shrink-0" onClick={handleSendDM}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CompanionDetailPage;
