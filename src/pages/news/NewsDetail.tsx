import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Button, Card } from "@material-tailwind/react";
import { ArrowLeftIcon, CalendarIcon, LinkIcon } from "@heroicons/react/24/outline";
import { useEffect } from 'react';
import type { NewsItem } from '../../api/newsApi';

const NewsDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const news = location.state?.news as NewsItem;

    // 데이터 없이 접근 시 목록으로 리다이렉트
    useEffect(() => {
        if (!news) {
            alert("잘못된 접근입니다.");
            navigate('/news');
        }
    }, [news, navigate]);

    if (!news) return null;

    // 날짜 포맷팅
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    // HTML 엔티티 디코딩
    const decodeHtml = (html: string) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value.replace(/<[^>]*>?/gm, '');
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-screen-md min-h-screen">
            <Button
                variant="text"
                size="sm"
                className="flex items-center gap-2 mb-8 px-0 hover:bg-transparent font-bold text-black uppercase tracking-widest"
                onClick={() => navigate(-1)}
            >
                <ArrowLeftIcon className="h-4 w-4" /> Back to list
            </Button>

            <div className="flex flex-col gap-6">
                {/* 헤더 영역 */}
                <div className="border-b border-black pb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                            Naver News
                        </span>
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                            <CalendarIcon className="h-3 w-3" />
                            <span>{formatDate(news.pubDate)}</span>
                        </div>
                    </div>
                    <Typography variant="h3" className="font-bold text-black leading-tight">
                        {decodeHtml(news.title)}
                    </Typography>
                </div>

                {/* 본문 요약 영역 */}
                <Card className="p-8 bg-gray-50 border border-gray-100 shadow-none rounded-none">
                    <Typography className="text-lg text-gray-800 leading-relaxed font-serif">
                        {decodeHtml(news.description)}
                    </Typography>
                </Card>

                {/* 링크 및 액션 버튼 */}
                <div className="flex flex-col gap-4 mt-4">
                    <div className="flex items-center gap-2 p-4 border border-gray-200 bg-white">
                        <LinkIcon className="h-5 w-5 text-gray-400" />
                        <div className="flex-1 overflow-hidden">
                            <Typography variant="small" className="font-bold text-gray-900 block">
                                원본 링크
                            </Typography>
                            <a 
                                href={news.originallink || news.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-xs truncate block"
                            >
                                {news.originallink || news.link}
                            </a>
                        </div>
                    </div>

                    <Button 
                        className="w-full bg-black rounded-none py-4 text-base font-bold tracking-widest hover:scale-[1.01] transition-transform"
                        onClick={() => window.open(news.link, '_blank')}
                    >
                        기사 원문 전체 보기
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;
