'use client';

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useMeetupStore } from "@/stores/meetupStore";
import { currentUser } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Users, MapPin, Calendar, Video, Zap, Clock, User, Send, Trash2 } from "lucide-react";
import type { MeetupType, MeetupStatus } from "@/types";

const TYPE_BADGE: Record<MeetupType, { color: string; label: string }> = {
    정기모임: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "정기모임" },
    번개: { color: "bg-orange-50 text-orange-700 border-orange-200", label: "번개" },
    온라인: { color: "bg-purple-50 text-purple-700 border-purple-200", label: "온라인" },
};

const STATUS_COLOR: Record<MeetupStatus, string> = {
    모집중: "bg-green-50 text-green-700 border-green-200",
    모집완료: "bg-gray-100 text-gray-500 border-gray-200",
    종료: "bg-red-50 text-red-500 border-red-200",
};

const MeetupDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const router = useRouter();
    const { meetups, joinMeetup, leaveMeetup, addComment, getCommentsByMeetup, deleteComment } = useMeetupStore();

    const meetup = meetups.find(m => m.id === Number(id));
    const comments = getCommentsByMeetup(Number(id));

    const [commentText, setCommentText] = useState("");

    const isLoggedIn = currentUser && currentUser.userId !== "" && currentUser.userId !== "guest";
    const isHost = meetup?.hostId === currentUser.userId;
    const isMember = meetup?.memberIds.includes(currentUser.userId) ?? false;
    const isFull = (meetup?.currentMembers ?? 0) >= (meetup?.maxMembers ?? 0);

    if (!meetup) {
        return (
            <div className="container mx-auto px-4 py-20 text-center text-gray-400">
                <p>존재하지 않는 소모임입니다.</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push("/meetup")}>목록으로</Button>
            </div>
        );
    }

    const handleJoin = () => {
        if (!isLoggedIn) { router.push("/login"); return; }
        joinMeetup(meetup.id, currentUser.userId);
    };

    const handleLeave = () => {
        leaveMeetup(meetup.id, currentUser.userId);
    };

    const handleComment = () => {
        if (!isLoggedIn) { router.push("/login"); return; }
        if (!commentText.trim()) return;
        addComment(meetup.id, currentUser.userId, currentUser.nickname || currentUser.name, commentText);
        setCommentText("");
    };

    const typeBadge = TYPE_BADGE[meetup.type];

    return (
        <div className="container mx-auto px-4 py-6 max-w-3xl">
            <button
                onClick={() => router.push("/meetup")}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-6"
            >
                <ChevronLeft className="h-4 w-4" />
                소모임 목록
            </button>

            {/* 헤더 */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className={`text-xs font-bold ${typeBadge.color}`}>
                        {typeBadge.label}
                    </Badge>
                    <Badge variant="outline" className={`text-xs font-bold ${STATUS_COLOR[meetup.status]}`}>
                        {meetup.status}
                    </Badge>
                    {meetup.genre && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{meetup.genre}</span>
                    )}
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">{meetup.title}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        <span>주최: <span className="font-medium text-gray-700">{meetup.hostName}</span></span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span>{meetup.createdAt}</span>
                </div>
            </div>

            {/* 정보 카드 */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded mb-6 grid sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span>{meetup.meetDate} {meetup.meetTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="line-clamp-1">{meetup.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span>{meetup.currentMembers}명 / {meetup.maxMembers}명 참여 중</span>
                </div>
                {meetup.isOnline && (
                    <div className="flex items-center gap-2 text-sm text-purple-600">
                        <Video className="h-4 w-4 flex-shrink-0" />
                        <span>온라인 모임</span>
                    </div>
                )}
            </div>

            {/* 인원 바 */}
            <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>참여 인원</span>
                    <span className="font-bold">{meetup.currentMembers}/{meetup.maxMembers}명</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-black rounded-full transition-all"
                        style={{ width: `${Math.min(100, (meetup.currentMembers / meetup.maxMembers) * 100)}%` }}
                    />
                </div>
            </div>

            {/* 소개 */}
            <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3">소모임 소개</h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{meetup.description}</p>
            </div>

            {/* 참여 버튼 */}
            <div className="border-t pt-5 mb-8">
                {isHost ? (
                    <div className="p-3 bg-gray-50 border rounded text-sm text-center text-gray-600 font-medium">
                        내가 개설한 소모임입니다.
                    </div>
                ) : isMember ? (
                    <div className="flex gap-2">
                        <div className="flex-1 p-3 bg-green-50 border border-green-200 rounded text-sm text-center text-green-700 font-medium">
                            참여 중인 소모임입니다.
                        </div>
                        <Button variant="outline" className="text-red-500 border-red-200" onClick={handleLeave}>
                            나가기
                        </Button>
                    </div>
                ) : meetup.status !== '모집중' || isFull ? (
                    <div className="p-3 bg-gray-50 border rounded text-sm text-center text-gray-500">
                        모집이 완료된 소모임입니다.
                    </div>
                ) : (
                    <Button className="w-full bg-black text-white" onClick={handleJoin}>
                        <Users className="h-4 w-4 mr-2" />
                        참여하기
                    </Button>
                )}
            </div>

            {/* 댓글 / 소모임 게시판 */}
            <div>
                <h3 className="text-sm font-bold text-gray-700 mb-4">
                    소모임 게시판 <span className="text-gray-400 font-normal ml-1">({comments.length})</span>
                </h3>

                {/* 댓글 입력 */}
                {isLoggedIn && (isMember || isHost) && (
                    <div className="flex gap-2 mb-5">
                        <Input
                            placeholder="소모임 멤버만 작성할 수 있습니다."
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleComment(); } }}
                            className="text-sm"
                        />
                        <Button size="icon" className="bg-black text-white flex-shrink-0" onClick={handleComment}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {comments.length === 0 ? (
                    <div className="py-10 text-center text-gray-400 text-sm">
                        아직 게시글이 없습니다. 소모임에 참여하고 첫 글을 남겨보세요!
                    </div>
                ) : (
                    <div className="space-y-3">
                        {comments.map(c => (
                            <div key={c.id} className="border border-gray-100 rounded p-3">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-bold text-gray-800">{c.userName}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">
                                            {new Date(c.createdAt).toLocaleDateString('ko-KR')}
                                        </span>
                                        {c.userId === currentUser.userId && (
                                            <button
                                                onClick={() => deleteComment(c.id, currentUser.userId)}
                                                className="text-gray-300 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700">{c.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MeetupDetailPage;
