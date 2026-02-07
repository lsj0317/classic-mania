import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Card, Spinner } from "@material-tailwind/react";
import {
    ArrowLeftIcon,
    MapPinIcon,
    CalendarIcon,
    ClockIcon,
    UserGroupIcon,
    TicketIcon,
    LinkIcon,
    PhotoIcon,
} from "@heroicons/react/24/outline";
import { usePerformanceStore } from "../../stores/performanceStore";

const PerformanceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { detailCache, detailLoading, detailError, fetchDetail } = usePerformanceStore();

    useEffect(() => {
        if (id) fetchDetail(id);
    }, [id, fetchDetail]);

    const performance = id ? detailCache[id] : null;

    if (detailLoading && !performance) {
        return (
            <div className="flex justify-center items-center py-20">
                <Spinner className="h-8 w-8" />
                <Typography className="ml-3 text-gray-500">공연 정보를 불러오는 중...</Typography>
            </div>
        );
    }

    if (!performance) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-screen-md text-center">
                <Typography className="text-gray-400 py-20">
                    {detailError || '공연 정보를 찾을 수 없습니다.'}
                </Typography>
                <Button variant="text" className="text-black font-bold" onClick={() => navigate(-1)}>
                    목록으로 돌아가기
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-screen-md">
            <Button
                variant="text"
                size="sm"
                className="flex items-center gap-2 mb-8 px-0 hover:bg-transparent font-bold text-black uppercase tracking-widest"
                onClick={() => navigate(-1)}
            >
                <ArrowLeftIcon className="h-4 w-4" /> Back to list
            </Button>

            {/* 에러 알림 */}
            {detailError && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
                    {detailError}
                </div>
            )}

            <div className="flex flex-col gap-10">
                {/* 포스터 및 기본 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="aspect-[3/4] bg-gray-50 border overflow-hidden">
                        {performance.poster ? (
                            <img src={performance.poster} alt={performance.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold">NO POSTER</div>
                        )}
                    </div>

                    <div className="flex flex-col justify-between">
                        <div>
                            <div className={`inline-block px-3 py-1 mb-4 border text-[10px] font-bold ${
                                performance.status === "공연중" ? "border-black text-black" : "border-gray-300 text-gray-400"
                            }`}>
                                {performance.status}
                            </div>
                            <Typography variant="h3" className="font-bold text-black leading-tight mb-6">
                                {performance.title}
                            </Typography>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPinIcon className="h-5 w-5 text-gray-400 shrink-0" />
                                    <div>
                                        <Typography variant="small" className="font-bold text-black">{performance.place}</Typography>
                                        <Typography className="text-xs text-gray-500">{performance.area} 지역</Typography>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CalendarIcon className="h-5 w-5 text-gray-400 shrink-0" />
                                    <Typography variant="small" className="font-mono text-black">{performance.period}</Typography>
                                </div>
                                {performance.schedule && (
                                    <div className="flex items-center gap-3">
                                        <ClockIcon className="h-5 w-5 text-gray-400 shrink-0" />
                                        <Typography variant="small" className="text-gray-700">{performance.schedule}</Typography>
                                    </div>
                                )}
                                {performance.runtime && (
                                    <div className="flex items-center gap-3">
                                        <ClockIcon className="h-5 w-5 text-gray-400 shrink-0" />
                                        <Typography variant="small" className="text-gray-500">러닝타임: {performance.runtime}</Typography>
                                    </div>
                                )}
                                {performance.age && (
                                    <div className="flex items-center gap-3">
                                        <TicketIcon className="h-5 w-5 text-gray-400 shrink-0" />
                                        <Typography variant="small" className="text-gray-500">관람연령: {performance.age}</Typography>
                                    </div>
                                )}
                                {performance.price && (
                                    <div className="flex items-center gap-3">
                                        <Typography variant="small" className="text-gray-500">가격: {performance.price}</Typography>
                                    </div>
                                )}
                                {performance.genre && (
                                    <div className="flex items-center gap-3">
                                        <Typography variant="small" className="text-gray-500">장르: {performance.genre}</Typography>
                                    </div>
                                )}
                            </div>
                        </div>

                        {performance.bookingUrl ? (
                            <a href={performance.bookingUrl} target="_blank" rel="noopener noreferrer">
                                <Button className="w-full bg-black rounded-none mt-10 py-4 font-bold tracking-widest">
                                    예매하러 가기
                                </Button>
                            </a>
                        ) : (
                            <Button className="w-full bg-black rounded-none mt-10 py-4 font-bold tracking-widest">
                                예매하러 가기
                            </Button>
                        )}
                    </div>
                </div>

                {/* 출연진 / 제작진 */}
                {(performance.cast || performance.crew) && (
                    <Card className="p-6 border border-gray-100 shadow-none bg-gray-50 rounded-none">
                        <div className="flex items-center gap-2 mb-4">
                            <UserGroupIcon className="h-5 w-5 text-gray-400" />
                            <Typography variant="small" className="font-bold uppercase tracking-widest">Cast & Crew</Typography>
                        </div>
                        {performance.cast && (
                            <div className="mb-3">
                                <Typography className="text-xs text-gray-400 font-bold mb-1">출연진</Typography>
                                <Typography className="text-sm text-gray-700 leading-relaxed">{performance.cast}</Typography>
                            </div>
                        )}
                        {performance.crew && (
                            <div>
                                <Typography className="text-xs text-gray-400 font-bold mb-1">제작진</Typography>
                                <Typography className="text-sm text-gray-700 leading-relaxed">{performance.crew}</Typography>
                            </div>
                        )}
                    </Card>
                )}

                {/* 줄거리 */}
                {performance.synopsis && (
                    <Card className="p-6 border border-gray-100 shadow-none bg-white rounded-none">
                        <Typography variant="small" className="font-bold uppercase tracking-widest mb-4">Synopsis</Typography>
                        <Typography className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                            {performance.synopsis}
                        </Typography>
                    </Card>
                )}

                {/* 소개 이미지 갤러리 */}
                {performance.introImages && performance.introImages.length > 0 && (
                    <Card className="p-6 border border-gray-100 shadow-none bg-white rounded-none">
                        <div className="flex items-center gap-2 mb-4">
                            <PhotoIcon className="h-5 w-5 text-gray-400" />
                            <Typography variant="small" className="font-bold uppercase tracking-widest">Gallery</Typography>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {performance.introImages.map((img, idx) => (
                                <div key={idx} className="border border-gray-100 overflow-hidden">
                                    <img src={img} alt={`${performance.title} 소개 이미지 ${idx + 1}`} className="w-full h-auto object-cover" />
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* 관련 링크 */}
                {performance.relatedLinks && performance.relatedLinks.length > 0 && (
                    <Card className="p-6 border border-gray-100 shadow-none bg-gray-50 rounded-none">
                        <div className="flex items-center gap-2 mb-4">
                            <LinkIcon className="h-5 w-5 text-gray-400" />
                            <Typography variant="small" className="font-bold uppercase tracking-widest">Related Links</Typography>
                        </div>
                        <div className="space-y-2">
                            {performance.relatedLinks.map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-sm text-blue-600 hover:text-blue-800 underline"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </Card>
                )}

                {/* 하단 위치 정보 안내 */}
                <Card className="p-6 border border-gray-100 shadow-none bg-gray-50 rounded-none">
                    <Typography variant="small" className="font-bold uppercase tracking-widest mb-2">Location Info</Typography>
                    <Typography className="text-xs text-gray-500 leading-relaxed">
                        해당 공연은 <span className="text-black font-bold">{performance.place}</span>에서 진행됩니다.
                        {performance.lat && performance.lng && (
                            <><br/>좌표 정보: {performance.lat}, {performance.lng}</>
                        )}
                    </Typography>
                </Card>
            </div>
        </div>
    );
};

export default PerformanceDetail;
