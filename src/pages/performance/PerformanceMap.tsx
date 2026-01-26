import { Typography } from "@material-tailwind/react";

const PerformanceMap = () => {
    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden">
            {/* A 영역: 지도 (70%) */}
            <div className="w-[70%] bg-gray-100 flex items-center justify-center border-r border-gray-200">
                <Typography color="gray">지도 API 로딩 예정 (70%)</Typography>
            </div>

            {/* B 영역: 리스트 (30%) */}
            <div className="w-[30%] bg-white overflow-y-auto p-6">
                <Typography variant="h6" className="font-bold mb-4">지역 공연 목록</Typography>
                <Typography variant="small" color="gray">마커를 클릭하면 해당 지역의 공연 정보가 표시됩니다.</Typography>
            </div>
        </div>
    );
};

export default PerformanceMap;