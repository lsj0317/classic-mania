// src/pages/performance/PerformanceDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Card } from "@material-tailwind/react";
import { ArrowLeftIcon, MapPinIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { performanceData } from "../../data/performanceData";

const PerformanceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // ID와 일치하는 공연 데이터 찾기 [cite: 2026-01-28]
    const performance = performanceData.find((p) => p.id === Number(id));

    if (!performance) {
        return <div className="p-20 text-center">공연 정보를 찾을 수 없습니다.</div>;
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
                                performance.status === "예매중" ? "border-black text-black" : "border-gray-300 text-gray-400"
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
                            </div>
                        </div>

                        <Button className="w-full bg-black rounded-none mt-10 py-4 font-bold tracking-widest">
                            예매하러 가기
                        </Button>
                    </div>
                </div>

                {/* 하단 위치 정보 안내 */}
                <Card className="p-6 border border-gray-100 shadow-none bg-gray-50 rounded-none">
                    <Typography variant="small" className="font-bold uppercase tracking-widest mb-2">Location Info</Typography>
                    <Typography className="text-xs text-gray-500 leading-relaxed">
                        해당 공연은 <span className="text-black font-bold">{performance.place}</span>에서 진행됩니다.<br/>
                        좌표 정보: {performance.lat}, {performance.lng}
                    </Typography>
                    {/* 추후 여기에 개별 지도를 추가할 수 있습니다 [cite: 2026-01-28] */}
                </Card>
            </div>
        </div>
    );
};

export default PerformanceDetail;