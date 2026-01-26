import { useEffect, useRef, useState } from "react";
import { Typography, Card } from "@material-tailwind/react";
import { performanceData } from "../../data/performanceData";
import type { Performance } from "../../types";
import { PhotoIcon, MapPinIcon } from "@heroicons/react/24/outline";

declare global {
    interface Window {
        kakao: any;
    }
}

const PerformanceMap = () => {
    const mapElement = useRef<HTMLDivElement>(null);
    const [selectedAreaPosts, setSelectedAreaPosts] = useState<Performance[]>([]);
    const [currentAreaName, setCurrentAreaName] = useState<string>("전국");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const kakaoKey = import.meta.env.VITE_KAKAO_MAP_KEY;
        const scriptId = "kakao-map-script";

        const initMap = () => {
            // [수정] kakao.maps 객체가 존재하지 않으면 0.1초 후 재시도 (비동기 방어 로직) [cite: 2026-01-27]
            if (!window.kakao || !window.kakao.maps) {
                setTimeout(initMap, 100);
                return;
            }

            window.kakao.maps.load(() => {
                if (!mapElement.current) return;

                const options = {
                    center: new window.kakao.maps.LatLng(36.3504, 127.3845),
                    level: 9,
                };

                const map = new window.kakao.maps.Map(mapElement.current, options);

                performanceData.forEach((perf) => {
                    const position = new window.kakao.maps.LatLng(perf.lat, perf.lng);
                    const content = document.createElement('div');
                    content.innerHTML = `<div style="cursor:pointer; background:black; color:white; padding:4px 10px; border-radius:20px; font-size:11px; font-weight:bold; border:2px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.3);">${perf.area}</div>`;

                    const customOverlay = new window.kakao.maps.CustomOverlay({
                        position: position,
                        content: content,
                        yAnchor: 1,
                    });

                    customOverlay.setMap(map);

                    content.onclick = () => {
                        setSelectedAreaPosts(performanceData.filter((p) => p.area === perf.area));
                        setCurrentAreaName(perf.area);
                        map.panTo(position);
                    };
                });
                setIsLoaded(true);
            });
        };

        const existingScript = document.getElementById(scriptId);
        if (!existingScript) {
            const script = document.createElement("script");
            script.id = scriptId;
            // autoload=false 옵션을 주어 동적 로딩을 제어합니다.
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`;
            script.async = true;
            script.onload = initMap;
            document.head.appendChild(script);
        } else {
            initMap();
        }
    }, []);

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden bg-white">
            <div ref={mapElement} className="w-full lg:w-[70%] h-[60%] lg:h-full bg-gray-50 relative">
                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mr-3" />
                        <Typography className="font-bold text-gray-400 uppercase tracking-widest text-xs">
                            Kakao Map Loading...
                        </Typography>
                    </div>
                )}
            </div>

            <div className="w-full lg:w-[30%] h-[40%] lg:h-full bg-white flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-2 mb-1">
                        <MapPinIcon className="h-4 w-4 text-black" />
                        <Typography variant="h6" className="font-bold text-black uppercase tracking-tighter">
                            {currentAreaName} 공연 목록 테스트
                        </Typography>
                    </div>
                    <Typography className="text-[11px] text-gray-500 italic">
                        지도 위의 지역 마커를 클릭하여 정보를 확인하세요.
                    </Typography>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {selectedAreaPosts.length > 0 ? (
                        selectedAreaPosts.map((perf) => (
                            <Card key={perf.id} className="p-2 border border-gray-100 rounded-none shadow-none hover:border-black transition-all group cursor-pointer">
                                <div className="flex gap-3">
                                    <div className="w-16 h-20 bg-gray-50 border shrink-0 overflow-hidden">
                                        {perf.poster ? (
                                            <img src={perf.poster} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={perf.title} />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center gap-1 opacity-20">
                                                <PhotoIcon className="h-6 w-6" />
                                                <span className="text-[8px] font-bold uppercase">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-between py-0.5 overflow-hidden">
                                        <Typography variant="small" className="font-bold text-black leading-tight line-clamp-2 group-hover:text-gray-600 transition-colors">
                                            {perf.title}
                                        </Typography>
                                        <div className="mt-1">
                                            <Typography className="text-[11px] text-gray-600 truncate">{perf.place}</Typography>
                                            <Typography className="text-[10px] text-gray-400 font-mono">{perf.period}</Typography>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-10 py-10">
                            <MapPinIcon className="h-16 w-16 mb-2" />
                            <Typography className="text-[10px] font-bold uppercase tracking-widest text-center">
                                Select a Region<br/>on the Map
                            </Typography>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PerformanceMap;