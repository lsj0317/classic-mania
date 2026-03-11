'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useNoticeStore } from "@/stores/noticeStore";
import type { NoticeBadge } from "@/types";

const BADGE_COLORS: Record<NoticeBadge, string> = {
    "신규기능": "bg-blue-100 text-blue-700 border-blue-200",
    "기능개선": "bg-green-100 text-green-700 border-green-200",
    "공지사항": "bg-gray-100 text-gray-700 border-gray-200",
    "긴급공지": "bg-red-100 text-red-700 border-red-200",
};

const NoticeDetail = () => {
    const params = useParams();
    const id = params?.id as string | undefined;
    const router = useRouter();
    const { notices, fetchNotices, incrementViews } = useNoticeStore();

    useEffect(() => {
        if (notices.length === 0) {
            fetchNotices();
        }
    }, [notices.length, fetchNotices]);

    const notice = notices.find((n) => n.id === Number(id));

    useEffect(() => {
        if (notice) {
            incrementViews(notice.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notice?.id]);

    if (!notice) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">공지사항을 찾을 수 없습니다.</h2>
                <Button onClick={() => router.push("/board?tab=notice")}>공지사항으로 돌아가기</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <Card className="mx-auto max-w-[900px] shadow-sm border border-gray-100">
                <CardContent className="p-8 md:p-12">
                    <div className="flex items-center justify-between mb-6">
                        <Badge variant="outline" className={`text-xs font-bold border ${BADGE_COLORS[notice.badge]}`}>
                            {notice.badge}
                        </Badge>
                        <span className="text-sm text-gray-400">{notice.createdAt}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">{notice.title}</h1>

                    <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                            {notice.authorName.charAt(0)}
                        </div>
                        <div>
                            <span className="text-sm font-bold text-gray-800 block">{notice.authorName}</span>
                            <span className="text-xs text-gray-500">조회수 {notice.views}</span>
                        </div>
                    </div>

                    <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap min-h-[150px]">
                        {notice.content}
                    </div>

                    {notice.thumbnail && (
                        <div className="mt-8">
                            <img
                                src={notice.thumbnail}
                                alt={notice.title}
                                className="w-full max-w-lg rounded-xl shadow-md"
                            />
                        </div>
                    )}
                </CardContent>
                <CardFooter className="bg-gray-50/50 p-6">
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 text-gray-600"
                        onClick={() => router.push("/board?tab=notice")}
                    >
                        <ArrowLeft className="w-4 h-4" /> 공지사항 목록으로 돌아가기
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default NoticeDetail;
