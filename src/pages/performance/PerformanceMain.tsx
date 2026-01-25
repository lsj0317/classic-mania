import { useState, useEffect } from "react";
import {
    Card,
    Typography,
    Button,
    CardBody,
    Input,
    CardFooter,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, MapIcon, PhotoIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
// 목업 데이터 및 타입 임포트
import { performanceData } from "../../data/performanceData";

const TABLE_HEAD = ["포스터", "공연명", "공연장", "공연기간", "지역", "상태"];
const PERFORMANCE_TABS = ["전체", "예매중", "예정", "공연종료", "지역별"];
// 전국 시도 하위 카테고리 정의
const AREA_CATEGORIES = ["전체 지역", "서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
const ITEMS_PER_PAGE = 5;

const PerformanceMain = () => {
    const navigate = useNavigate();

    // 상태 관리
    const [activePage, setActivePage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTab, setSelectedTab] = useState("전체");
    const [selectedArea, setSelectedArea] = useState("전체 지역");

    // [로직] 상단 탭(상태/지역별) + 하위 지역 + 검색어에 따른 삼중 필터링
    const filteredData = performanceData.filter((p) => {
        // 1. 상단 메인 탭 필터링
        const matchesStatus = (selectedTab === "전체" || selectedTab === "지역별") || p.status === selectedTab;

        // 2. 지역별 하위 카테고리 필터링 (메인 탭이 '지역별'일 때만 작동)
        const matchesArea = selectedTab !== "지역별" || selectedArea === "전체 지역" || p.area === selectedArea;

        // 3. 검색어 필터링
        const matchesSearch =
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.place.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesArea && matchesSearch;
    });

    // [로직] 페이징 계산
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const indexOfLastItem = activePage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // 필터 조건 변경 시 페이지 1로 리셋
    useEffect(() => {
        setActivePage(1);
    }, [selectedTab, selectedArea, searchTerm]);

    const PerformanceThumbnail = ({ src, alt }: { src?: string; alt: string }) => (
        <div className="w-16 h-20 bg-gray-50 flex items-center justify-center border border-gray-100 relative overflow-hidden group">
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
            ) : (
                <div className="flex flex-col items-center gap-1">
                    <PhotoIcon className="h-6 w-6 text-gray-200" />
                    <span className="text-[8px] text-gray-300 font-bold uppercase tracking-widest leading-none">No Poster</span>
                </div>
            )}
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-screen-xl">
            {/* 상단 헤더 영역 */}
            <div className="mb-8 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                <div>
                    <Typography variant="h4" color="blue-gray" className="font-bold tracking-tighter uppercase">
                        Performance Info
                    </Typography>
                    <Typography color="gray" className="mt-1 font-normal text-sm">
                        전국의 클래식 공연 소식과 실시간 예매 현황을 확인하세요.
                    </Typography>
                </div>
                <Button
                    className="flex items-center gap-3 bg-black rounded-none shadow-none hover:shadow-lg transition-all px-8"
                    onClick={() => navigate("/performance/map")}
                >
                    <MapIcon className="h-5 w-5" /> 공연지도 보기
                </Button>
            </div>

            {/* 메인 필터 및 검색 */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center justify-between border-b border-gray-100 pb-6">
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-none w-max">
                    {PERFORMANCE_TABS.map((tab) => (
                        <Button
                            key={tab}
                            variant={selectedTab === tab ? "white" : "text"}
                            size="sm"
                            className={`rounded-none px-6 py-2 ${selectedTab === tab ? "shadow-sm text-white font-bold" : "text-gray-500"}`}
                            onClick={() => {
                                setSelectedTab(tab);
                                if (tab !== "지역별") setSelectedArea("전체 지역"); // 지역별이 아니면 하위 필터 리셋
                            }}
                        >
                            {tab}
                        </Button>
                    ))}
                </div>
                <div className="w-full md:w-80">
                    <Input
                        label="공연명 또는 공연장 검색"
                        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        crossOrigin={undefined}
                        className="!rounded-none focus:!border-black"
                    />
                </div>
            </div>

            {/* [추가] 지역별 하위 카테고리 UI: '지역별' 탭 선택 시 노출 */}
            {selectedTab === "지역별" && (
                <Card className="mb-8 shadow-none border border-gray-100 bg-gray-50/30 rounded-none p-4">
                    <div className="flex flex-wrap gap-2">
                        {AREA_CATEGORIES.map((area) => (
                            <Button
                                key={area}
                                size="sm"
                                variant={selectedArea === area ? "filled" : "text"}
                                className={`rounded-none px-4 py-1.5 transition-all text-[11px] font-bold ${
                                    selectedArea === area ? "bg-black text-white" : "text-gray-500 hover:text-black"
                                }`}
                                onClick={() => setSelectedArea(area)}
                            >
                                {area}
                            </Button>
                        ))}
                    </div>
                </Card>
            )}

            {/* 공연 리스트 테이블 */}
            <Card className="h-full w-full shadow-none border border-gray-200 rounded-none overflow-hidden">
                <CardBody className="px-0 py-0">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                        <tr className="bg-gray-50/50">
                            {TABLE_HEAD.map((head) => (
                                <th key={head} className="border-b border-gray-100 p-4">
                                    <Typography variant="small" color="blue-gray" className="font-bold opacity-80 uppercase tracking-wider">
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map(({ id, poster, title, place, period, area, status }, index) => {
                                const isLast = index === currentItems.length - 1;
                                const classes = isLast ? "p-4" : "p-4 border-b border-gray-50";

                                return (
                                    <tr key={id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                                        <td className={classes}>
                                            <PerformanceThumbnail src={poster} alt={title} />
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" className="font-bold text-black group-hover:text-gray-600 transition-colors">
                                                {title}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" className="text-gray-600 font-medium">{place}</Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" className="text-gray-500 text-xs font-mono">{period}</Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" className="text-gray-600">{area}</Typography>
                                        </td>
                                        <td className={classes}>
                                            <div className={`inline-block px-3 py-1 border text-[10px] font-bold tracking-tighter ${
                                                status === "예매중" ? "border-black text-black bg-white" :
                                                    status === "공연종료" ? "border-gray-200 text-gray-300 bg-gray-50" : "border-gray-300 text-gray-500"
                                            }`}>
                                                {status}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-20 text-center text-gray-400">
                                    해당 조건의 공연 정보가 없습니다.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </CardBody>

                <CardFooter className="flex items-center justify-between border-t border-gray-100 p-4 bg-white">
                    <Button
                        variant="text"
                        size="sm"
                        onClick={() => setActivePage(activePage - 1)}
                        disabled={activePage === 1}
                        className={`flex items-center gap-1 font-bold ${activePage === 1 ? "text-gray-300" : "text-black hover:bg-gray-100"}`}
                    >
                        <ChevronLeftIcon strokeWidth={3} className="h-3 w-3" /> 이전
                    </Button>
                    <Typography variant="small" className="font-bold text-gray-500">
                        <span className="text-black">{activePage}</span> / {totalPages || 1}
                    </Typography>
                    <Button
                        variant="text"
                        size="sm"
                        onClick={() => setActivePage(activePage + 1)}
                        disabled={activePage === totalPages || totalPages === 0}
                        className={`flex items-center gap-1 font-bold ${activePage === totalPages ? "text-gray-300" : "text-black hover:bg-gray-100"}`}
                    >
                        다음 <ChevronRightIcon strokeWidth={3} className="h-3 w-3" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default PerformanceMain;