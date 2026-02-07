import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Spinner } from "@material-tailwind/react";
import { ArrowLeftIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { usePerformanceStore } from '../../stores/performanceStore';

const TicketDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { detailCache, detailLoading, detailError, fetchDetail } = usePerformanceStore();

    useEffect(() => {
        if (id) fetchDetail(id);
    }, [id, fetchDetail]);

    const performance = id ? detailCache[id] : null;

    if (detailLoading && !performance) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner className="h-8 w-8" />
                <Typography className="ml-3 text-gray-500">티켓 정보를 불러오는 중...</Typography>
            </div>
        );
    }

    if (!performance) {
        return (
            <div className="p-10 text-center">
                <Typography className="text-gray-400 mb-4">
                    {detailError || '공연 정보를 찾을 수 없습니다.'}
                </Typography>
                <Button variant="text" onClick={() => navigate(-1)}>뒤로가기</Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 lg:p-10 bg-white min-h-screen">
            <Button
                variant="text"
                className="flex items-center gap-2 mb-6 px-0 hover:bg-transparent"
                onClick={() => navigate(-1)}
            >
                <ArrowLeftIcon className="h-4 w-4" /> 뒤로가기
            </Button>

            <div className="flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-1/2">
                    <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden border shadow-xl">
                        {performance.poster ? (
                            <img src={performance.poster} className="w-full h-full object-cover" alt={performance.title} />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                <PhotoIcon className="h-16 w-16 mb-2" />
                                <span className="text-sm font-bold">NO POSTER</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full md:w-1/2 space-y-6">
                    <div>
                        <div className={`inline-block px-2 py-0.5 mb-2 border text-[10px] font-bold ${
                            performance.status === "공연중" ? "border-black text-black" : "border-gray-300 text-gray-400"
                        }`}>
                            {performance.status}
                        </div>
                        <Typography variant="h3" className="font-bold text-black leading-tight">{performance.title}</Typography>
                        <Typography className="text-gray-600 mt-2 font-bold">{performance.place}</Typography>
                        <Typography className="text-sm text-gray-400 font-mono">{performance.period}</Typography>
                    </div>

                    {/* 가격 정보 섹션 */}
                    <div className="p-6 bg-gray-50 border-l-4 border-black">
                        <Typography className="text-xs uppercase text-gray-500 mb-2 font-bold tracking-wider">Ticket Price</Typography>
                        <Typography className="text-xl font-bold text-black">
                            {performance.price || "가격 정보 없음"}
                        </Typography>
                    </div>

                    {/* 예매처 목록 섹션 */}
                    <div className="space-y-3">
                        <Typography className="font-bold text-sm uppercase border-b pb-2 tracking-wider">Booking Vendors</Typography>
                        
                        {/* KOPIS 데이터 기반 예매처 표시 */}
                        {performance.relatedLinks && performance.relatedLinks.length > 0 ? (
                            performance.relatedLinks.map((link, idx) => (
                                <div key={idx} className="flex justify-between items-center p-4 border border-gray-200 hover:border-black hover:bg-gray-50 transition-all group">
                                    <span className="font-bold text-sm group-hover:text-black text-gray-700">{link.name}</span>
                                    <Button 
                                        size="sm" 
                                        className="rounded-none bg-black hover:scale-105 transition-transform" 
                                        onClick={() => window.open(link.url, '_blank')}
                                    >
                                        예매하기
                                    </Button>
                                </div>
                            ))
                        ) : (
                            // 예매처 정보가 없을 경우
                            <div className="flex flex-col gap-3">
                                <div className="p-4 border border-dashed border-gray-300 text-center text-gray-500 text-sm">
                                    등록된 예매처 링크가 없습니다.
                                </div>
                                {performance.bookingUrl ? (
                                     <div className="flex justify-between items-center p-4 border border-gray-200 hover:border-black hover:bg-gray-50 transition-all group">
                                        <span className="font-bold text-sm group-hover:text-black text-gray-700">공식 예매처</span>
                                        <Button 
                                            size="sm" 
                                            className="rounded-none bg-black hover:scale-105 transition-transform" 
                                            onClick={() => window.open(performance.bookingUrl, '_blank')}
                                        >
                                            예매하기
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center p-4 border border-gray-200 hover:border-black hover:bg-gray-50 transition-all group">
                                        <span className="font-bold text-sm group-hover:text-black text-gray-700">네이버 검색</span>
                                        <Button 
                                            size="sm" 
                                            className="rounded-none bg-gray-800 hover:scale-105 transition-transform" 
                                            onClick={() => window.open(`https://search.naver.com/search.naver?query=${encodeURIComponent(performance.title + ' 예매')}`, '_blank')}
                                        >
                                            예매처 찾기
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <Typography className="text-[10px] text-gray-400 text-center italic mt-8">
                        * 예매처 정보는 공연 주최측의 사정에 따라 변경될 수 있습니다.
                    </Typography>
                </div>
            </div>
        </div>
    );
};

export default TicketDetailPage;