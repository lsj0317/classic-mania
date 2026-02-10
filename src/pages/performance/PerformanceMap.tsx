import { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePerformanceStore } from '../../stores/performanceStore';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar } from "lucide-react";

// 네이버 지도 타입 정의 (간략화)
declare global {
    interface Window {
        naver: any;
    }
}

const PerformanceMap = () => {
    const mapElement = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const navigate = useNavigate();

    const { performances, listLoading, fetchList, fetchLocationsForList } = usePerformanceStore();
    const [selectedPerformance, setSelectedPerformance] = useState<any | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    // 1. 네이버 지도 스크립트 동적 로드
    useEffect(() => {
        const scriptId = 'naver-map-script';
        const existingScript = document.getElementById(scriptId);

        if (existingScript) {
            if (window.naver && window.naver.maps) {
                setMapLoaded(true);
            } else {
                existingScript.onload = () => setMapLoaded(true);
            }
            return;
        }

        const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;
        if (!clientId) {
            console.error("네이버 지도 클라이언트 ID가 설정되지 않았습니다.");
            return;
        }

        const script = document.createElement('script');
        script.id = scriptId;
        script.type = 'text/javascript';
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
        script.onload = () => setMapLoaded(true);
        document.head.appendChild(script);

        return () => {
            // 컴포넌트 언마운트 시 스크립트를 제거하지 않음 (SPA에서 재사용을 위해)
        };
    }, []);

    // 2. 공연 데이터 로드 및 좌표 정보 추가 로드
    useEffect(() => {
        const loadData = async () => {
            await fetchList();
            // 목록 로드 후 좌표 정보 비동기 로드 시작
            fetchLocationsForList();
        };
        loadData();
    }, [fetchList, fetchLocationsForList]);

    // 3. 지도 초기화
    useEffect(() => {
        if (!mapLoaded || !mapElement.current || !window.naver) return;

        // 이미 지도가 생성되었다면 스킵
        if (mapRef.current) return;

        const mapOptions = {
            center: new window.naver.maps.LatLng(36.3504, 127.3845), // 대한민국 중심
            zoom: 7,
            zoomControl: true,
            zoomControlOptions: {
                position: window.naver.maps.Position.TOP_RIGHT
            }
        };

        mapRef.current = new window.naver.maps.Map(mapElement.current, mapOptions);
    }, [mapLoaded]);

    // 4. 마커 생성 및 이벤트 바인딩
    useEffect(() => {
        if (!mapLoaded || !mapRef.current || performances.length === 0) return;

        // 기존 마커 제거
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        const newMarkers: any[] = [];

        performances.forEach((perf) => {
            // 좌표가 있는 경우에만 마커 생성
            if (perf.lat && perf.lng) {
                const position = new window.naver.maps.LatLng(perf.lat, perf.lng);

                const marker = new window.naver.maps.Marker({
                    position: position,
                    map: mapRef.current,
                    title: perf.title,
                    icon: {
                        content: `
                            <div style="
                                padding: 5px 10px;
                                background: black;
                                color: white;
                                border-radius: 0px;
                                font-size: 12px;
                                font-weight: bold;
                                box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
                                white-space: nowrap;
                                cursor: pointer;
                            ">
                                ${perf.place}
                            </div>
                        `,
                        anchor: new window.naver.maps.Point(15, 15)
                    }
                });

                // 마커 클릭 이벤트
                window.naver.maps.Event.addListener(marker, 'click', () => {
                    setSelectedPerformance(perf);
                    mapRef.current.panTo(position); // 지도 중심 이동
                });

                newMarkers.push(marker);
            }
        });

        markersRef.current = newMarkers;

    }, [mapLoaded, performances]); // performances가 업데이트될 때마다(좌표 로드 시) 마커 갱신

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden">
            {/* A 영역: 지도 (70%) */}
            <div className="w-full md:w-[70%] h-[50vh] md:h-full relative bg-gray-100 border-r border-gray-200">
                <div ref={mapElement} className="w-full h-full outline-none" />

                {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                        <span className="text-gray-500">지도를 불러오는 중...</span>
                    </div>
                )}

                {/* 선택된 공연 정보 오버레이 (모바일용) */}
                {selectedPerformance && (
                    <div className="md:hidden absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 z-20 shadow-lg">
                        <div className="flex justify-between items-start mb-2">
                            <h6 className="font-bold truncate pr-4">{selectedPerformance.title}</h6>
                            <button onClick={() => setSelectedPerformance(null)} className="text-gray-500">✕</button>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{selectedPerformance.place}</p>
                        <p className="text-sm text-gray-500 mb-3">{selectedPerformance.period}</p>
                        <Button
                            size="sm"
                            className="w-full bg-black hover:bg-black/90 rounded-none"
                            onClick={() => navigate(`/performance/${selectedPerformance.id}`)}
                        >
                            상세보기
                        </Button>
                    </div>
                )}
            </div>

            {/* B 영역: 리스트 (30%) */}
            <div className="w-full md:w-[30%] h-[50vh] md:h-full bg-white overflow-y-auto p-0 border-l border-gray-200">
                <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h5 className="text-lg font-bold mb-1 tracking-tight">공연장 지도</h5>
                    <p className="text-sm text-gray-500">지도에서 마커를 클릭하여 공연 정보를 확인하세요.</p>
                </div>

                {listLoading ? (
                    <div className="flex justify-center py-10">
                        <Spinner size="md" />
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {selectedPerformance ? (
                            <div className="p-6 bg-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                    <h6 className="font-bold">선택된 공연</h6>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-gray-500 p-0 hover:bg-transparent"
                                        onClick={() => setSelectedPerformance(null)}
                                    >
                                        목록 보기
                                    </Button>
                                </div>
                                <Card className="rounded-none shadow-sm border border-gray-200 p-0 overflow-hidden">
                                    <div className="aspect-video bg-gray-200 relative">
                                        {selectedPerformance.poster ? (
                                            <img src={selectedPerformance.poster} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">NO IMAGE</div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className={`inline-block px-2 py-0.5 mb-2 border text-[10px] font-bold ${
                                            selectedPerformance.status === "공연중" ? "border-black text-black" : "border-gray-300 text-gray-400"
                                        }`}>
                                            {selectedPerformance.status}
                                        </div>
                                        <h6 className="font-bold mb-2 leading-tight">
                                            {selectedPerformance.title}
                                        </h6>
                                        <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                                            <MapPin className="h-3 w-3" />
                                            {selectedPerformance.place}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 text-xs mb-4">
                                            <Calendar className="h-3 w-3" />
                                            {selectedPerformance.period}
                                        </div>
                                        <Button
                                            className="w-full bg-black hover:bg-black/90 rounded-none"
                                            onClick={() => navigate(`/performance/${selectedPerformance.id}`)}
                                        >
                                            상세 정보 보기
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            performances.map((perf) => (
                                <div
                                    key={perf.id}
                                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                                    onClick={() => {
                                        if (perf.lat && perf.lng && mapRef.current) {
                                            const position = new window.naver.maps.LatLng(perf.lat, perf.lng);
                                            mapRef.current.panTo(position);
                                            setSelectedPerformance(perf);
                                        } else {
                                            alert("해당 공연장의 위치 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
                                        }
                                    }}
                                >
                                    <span className="text-sm font-bold mb-1 block group-hover:text-blue-600 transition-colors">
                                        {perf.title}
                                    </span>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs text-gray-600">{perf.place}</p>
                                            <p className="text-[10px] text-gray-400">{perf.period}</p>
                                        </div>
                                        <div className={`text-[10px] font-bold px-1.5 py-0.5 border ${
                                            perf.status === "공연중" ? "border-black text-black" : "border-gray-200 text-gray-400"
                                        }`}>
                                            {perf.status}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PerformanceMap;
