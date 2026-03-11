'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, X } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types';

function formatRelativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    return `${Math.floor(hours / 24)}일 전`;
}

const TYPE_ICON: Record<Notification['type'], string> = {
    new_performance: '🎭',
    new_follower: '👤',
    post_reaction: '❤️',
    new_post: '📝',
};

export default function NotificationBell() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const { notifications, unreadCount, markNotificationRead, markAllRead } = useUserStore();

    // 외부 클릭 닫기
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleNotifClick = (notif: Notification) => {
        markNotificationRead(notif.id);
        if (notif.link) router.push(notif.link);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={panelRef}>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="알림"
            >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <h3 className="font-bold text-sm">알림</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
                                >
                                    모두 읽음
                                </button>
                            )}
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="py-8 text-center text-sm text-muted-foreground">
                                새로운 알림이 없습니다
                            </div>
                        ) : (
                            notifications.slice(0, 15).map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => handleNotifClick(notif)}
                                    className={cn(
                                        'flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50',
                                        !notif.isRead && 'bg-blue-50/60'
                                    )}
                                >
                                    <span className="text-xl flex-shrink-0 mt-0.5">
                                        {TYPE_ICON[notif.type]}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold leading-tight truncate">
                                            {notif.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                            {notif.body}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground/70 mt-1">
                                            {formatRelativeTime(notif.createdAt)}
                                        </p>
                                    </div>
                                    {!notif.isRead && (
                                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
