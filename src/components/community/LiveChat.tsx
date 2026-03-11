'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Users, Send, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCommunityStore } from '@/stores/communityStore';
import { cn } from '@/lib/utils';
import type { LiveChatMessage } from '@/types';

interface Props {
    performanceId: string;
    userId: string;
    userName: string;
    userProfileImage?: string;
}

function formatTime(iso: string): string {
    const d = new Date(iso);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

export default function LiveChat({ performanceId, userId, userName, userProfileImage }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isScrolledUp, setIsScrolledUp] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { chatMessages, viewerCount, loadChat, sendChatMessage, refreshViewerCount } = useCommunityStore();

    useEffect(() => {
        if (isOpen) {
            loadChat(performanceId);
        }
    }, [isOpen, performanceId]);

    // 시청자 수 주기적 업데이트 (30초마다)
    useEffect(() => {
        if (!isOpen) return;
        const interval = setInterval(() => {
            refreshViewerCount(performanceId);
        }, 30000);
        return () => clearInterval(interval);
    }, [isOpen, performanceId]);

    // 새 메시지 시 자동 스크롤
    useEffect(() => {
        if (!isScrolledUp && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages, isScrolledUp]);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        setIsScrolledUp(scrollHeight - scrollTop - clientHeight > 100);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        setIsScrolledUp(false);
    };

    const handleSend = () => {
        const msg = input.trim();
        if (!msg || !userId) return;
        sendChatMessage(performanceId, userId, userName, userProfileImage, msg);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50">
            {/* 채팅 창 */}
            {isOpen && (
                <div className="mb-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
                    style={{ height: '420px' }}>
                    {/* 헤더 */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 flex items-center justify-between">
                        <div>
                            <p className="text-white font-bold text-sm">공연 실황 채팅</p>
                            <p className="text-blue-100 text-xs flex items-center gap-1 mt-0.5">
                                <Users className="h-3 w-3" />
                                {viewerCount}명이 보고 있어요
                            </p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-blue-100 hover:text-white transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* 메시지 목록 */}
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto px-3 py-2 space-y-2 bg-gray-50"
                    >
                        {chatMessages.map((msg: LiveChatMessage) => {
                            const isMe = msg.userId === userId;
                            return (
                                <div
                                    key={msg.id}
                                    className={cn('flex items-end gap-2', isMe && 'flex-row-reverse')}
                                >
                                    {!isMe && (
                                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-600">
                                            {msg.userName.charAt(0)}
                                        </div>
                                    )}
                                    <div className={cn('max-w-[70%]', isMe && 'items-end')}>
                                        {!isMe && (
                                            <p className="text-[10px] text-muted-foreground mb-0.5 ml-1">
                                                {msg.userName}
                                            </p>
                                        )}
                                        <div
                                            className={cn(
                                                'px-3 py-2 rounded-2xl text-sm',
                                                isMe
                                                    ? 'bg-blue-500 text-white rounded-br-sm'
                                                    : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                                            )}
                                        >
                                            {msg.message}
                                        </div>
                                        <p
                                            className={cn(
                                                'text-[9px] text-muted-foreground mt-0.5',
                                                isMe ? 'text-right mr-1' : 'ml-1'
                                            )}
                                        >
                                            {formatTime(msg.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* 스크롤 다운 버튼 */}
                    {isScrolledUp && (
                        <button
                            onClick={scrollToBottom}
                            className="absolute bottom-16 right-4 bg-blue-500 text-white rounded-full p-1 shadow-md"
                        >
                            <ChevronDown className="h-4 w-4" />
                        </button>
                    )}

                    {/* 입력창 */}
                    {userId ? (
                        <div className="border-t border-gray-100 p-2 flex gap-2 bg-white">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="메시지를 입력하세요..."
                                maxLength={100}
                                className="flex-1 text-sm px-3 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-blue-400 bg-gray-50"
                            />
                            <Button
                                size="icon"
                                className="rounded-full w-9 h-9 flex-shrink-0"
                                onClick={handleSend}
                                disabled={!input.trim()}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="border-t border-gray-100 p-3 text-center">
                            <p className="text-xs text-muted-foreground">채팅에 참여하려면 로그인하세요</p>
                        </div>
                    )}
                </div>
            )}

            {/* 채팅 토글 버튼 */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all relative"
            >
                <MessageCircle className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            </button>
        </div>
    );
}
