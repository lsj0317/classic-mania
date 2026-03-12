'use client';

import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Bell, Trash2, CheckCheck } from "lucide-react";
import type { Notification } from "@/types";

interface NotificationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function timeAgo(dateStr: string): string {
    const now = Date.now();
    const diff = now - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    return `${days}일 전`;
}

const NotificationModal = ({ open, onOpenChange }: NotificationModalProps) => {
    const router = useRouter();
    const { notifications, unreadCount, markNotificationRead, markAllRead, clearAllNotifications } = useUserStore();

    const handleClick = (notif: Notification) => {
        markNotificationRead(notif.id);
        onOpenChange(false);
        if (notif.link) router.push(notif.link);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[80vh] flex flex-col p-0">
                <DialogHeader className="p-5 pb-3 border-b">
                    <DialogTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        알림
                        {unreadCount > 0 && (
                            <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </DialogTitle>
                    <DialogDescription className="sr-only">알림 목록</DialogDescription>
                </DialogHeader>

                {/* 알림 목록 */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    {notifications.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground">
                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">알림이 없습니다</p>
                        </div>
                    ) : (
                        <ul>
                            {notifications.map((notif) => (
                                <li
                                    key={notif.id}
                                    className={`px-5 py-3.5 border-b last:border-b-0 cursor-pointer transition-colors hover:bg-accent ${!notif.isRead ? 'bg-blue-50/50' : ''}`}
                                    onClick={() => handleClick(notif)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notif.isRead ? 'bg-blue-500' : 'bg-transparent'}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm ${!notif.isRead ? 'font-semibold' : 'font-medium text-muted-foreground'}`}>
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                                {notif.body}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground/60 mt-1">
                                                {timeAgo(notif.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* 하단 액션 버튼 */}
                {notifications.length > 0 && (
                    <div className="p-3 border-t flex gap-2">
                        {unreadCount > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 gap-1.5 text-xs"
                                onClick={() => markAllRead()}
                            >
                                <CheckCheck className="h-3.5 w-3.5" />
                                모두 읽음
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-1.5 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => clearAllNotifications()}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            전체 삭제
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default NotificationModal;
