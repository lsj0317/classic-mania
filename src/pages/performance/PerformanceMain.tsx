import { useEffect } from "react";
import {
    Card,
    Typography,
    Button,
    CardBody,
    Input,
    CardFooter,
    Spinner,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, MapIcon, PhotoIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { usePerformanceStore } from "../../stores/performanceStore";

const TABLE_HEAD = ["포스터", "공연명", "공연장", "공연기간", "지역", "상태"];
const PERFORMANCE_TABS = ["전체", "공연중", "공연예정", "공연완료", "지역별"];
const AREA_CATEGORIES = ["전체 지역", "서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
const ITEMS_PER_PAGE = 5;

const PerformanceMain = () => {
    const navigate = useNavigate();

    // Zustand 스토어에서 상태와 액션 가져오기
    const {
        performances,
        listLoading,
        listError,
        fetchList,
        selectedTab,
        selectedArea,
        searchTerm,
        currentPage,
        setSelectedTab,
        setSelectedArea,
        setSearchTerm,
        setCurrentPage,
    } = usePerformanceStore();

    // 최초 1회 목록 로드
    useEffect(() => {
        fetchList();
    }, [fetchList]);

    // 삼중 필터링: 상태 탭 + 지역 + 검색어
    const filteredData = performances.filter((p) => {
        const matchesStatus =
            selectedTab === "전체" || selectedTab === "지역별" || p.status === selectedTab;

        const matchesArea =
            selectedTab !== "지역별" || selectedArea === "전체 지역" || p.area.includes(selectedArea);

        const matchesSearch =
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.place.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesArea && matchesSearch;
    });

    // 페이징 계산
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const PerformanceThumbnail = ({ src, alt }: { src?: string; alt: string }) => (
        <div className="w-16 h-20 bg-gray-50 flex items-center justify-center border border-gray-100 relative overflow-hidden group flex-shrink-0">
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

    const StatusBadge = ({ status }: { status: string }) => (
        <div className={`inline-block px-3 py-1 border text-[10px] font-bold tracking-tighter ${
            status === "공연중" ? "border-black text-black bg-white" :
                status === "공연완료" ? "border-gray-200 text-gray-300 bg-gray-50" : "border-gray-300 text-gray-500"
        }`}>
            {status}
        </div>
    );

    return (
        <div className="container mx-auto px-0 sm:px-4 py-6 lg:py-8 max-w-screen-xl">
            {/* 상단 헤더 영역 */}
            <div className="mb-6 lg:mb-8 flex flex-col justify-between gap-4 lg:gap-8 md:flex-row md:items-center px-4 sm:px-0">
                <div>
                    <Typography variant="h4" color="blue-gray" className="font-bold tracking-tighter uppercase text-xl lg:text-2xl">
                        공연정보
                    </Typography>
                    <Typography color="gray" className="mt-1 font-normal text-sm">
                        전국의 클래식 공연 소식과 실시간 예매 현황을 확인하세요.
                    </Typography>
                </div>
                <Button
                    className="flex items-center gap-3 bg-black rounded-none shadow-none hover:shadow-lg transition-all px-8 w-full sm:w-auto justify-center"
                    onClick={() => navigate("/performance/map")}
                >
                    <MapIcon className="h-5 w-5" /> 공연지도 보기
                </Button>
            </div>

            {/* 에러 알림 */}
            {listError && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm mx-4 sm:mx-0">
                    {listError}
                </div>
            )}

            {/* 메인 필터 및 검색 */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center justify-between border-b border-gray-100 pb-6 px-4 sm:px-0">
                {/* 탭 필터 - 모바일에서 가로 스크롤 */}
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-none overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-1 sm:overflow-visible sm:w-max">
                    {PERFORMANCE_TABS.map((tab) => (
                        <Button
                            key={tab}
                            variant={selectedTab === tab ? "white" : "text"}
                            size="sm"
                            className={`rounded-none px-4 sm:px-6 py-2 whitespace-nowrap flex-shrink-0 ${selectedTab === tab ? "shadow-sm text-white font-bold" : "text-gray-500"}`}
                            onClick={() => {
                                setSelectedTab(tab);
                                if (tab !== "지역별") setSelectedArea("전체 지역");
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

            {/* 지역별 하위 카테고리 UI */}
            {selectedTab === "지역별" && (
                <Card className="mb-6 lg:mb-8 shadow-none border border-gray-100 bg-gray-50/30 rounded-none p-3 lg:p-4 mx-4 sm:mx-0">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {AREA_CATEGORIES.map((area) => (
                            <Button
                                key={area}
                                size="sm"
                                variant={selectedArea === area ? "filled" : "text"}
                                className={`rounded-none px-3 sm:px-4 py-1.5 transition-all text-[10px] sm:text-[11px] font-bold ${
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

            {/* 로딩 상태 */}
            {listLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Spinner className="h-8 w-8" />
                    <Typography className="ml-3 text-gray-500">공연 정보를 불러오는 중...</Typography>
                </div>
            ) : (
                <>
                    {/* 데스크톱: 테이블 뷰 */}
                    <Card className="h-full w-full shadow-none border border-gray-200 rounded-none overflow-hidden hidden md:block">
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
                                            <tr key={id} className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                                onClick={() => navigate(`/performance/${id}`)}>
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
                                                    <StatusBadge status={status} />
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
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`flex items-center gap-1 font-bold ${currentPage === 1 ? "text-gray-300" : "text-black hover:bg-gray-100"}`}
                            >
                                <ChevronLeftIcon strokeWidth={3} className="h-3 w-3" /> 이전
                            </Button>
                            <Typography variant="small" className="font-bold text-gray-500">
                                <span className="text-black">{currentPage}</span> / {totalPages || 1}
                            </Typography>
                            <Button
                                variant="text"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className={`flex items-center gap-1 font-bold ${currentPage === totalPages ? "text-gray-300" : "text-black hover:bg-gray-100"}`}
                            >
                                다음 <ChevronRightIcon strokeWidth={3} className="h-3 w-3" />
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* 모바일: 카드 리스트 뷰 */}
                    <div className="md:hidden">
                        {currentItems.length > 0 ? (
                            <div className="flex flex-col gap-3 px-4 sm:px-0">
                                {currentItems.map(({ id, poster, title, place, period, area, status }) => (
                                    <div
                                        key={id}
                                        className="border border-gray-200 p-3 active:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => navigate(`/performance/${id}`)}
                                    >
                                        <div className="flex gap-3">
                                            <PerformanceThumbnail src={poster} alt={title} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <StatusBadge status={status} />
                                                    <span className="text-[10px] text-gray-400">{area}</span>
                                                </div>
                                                <Typography className="font-bold text-sm text-black line-clamp-2 mb-1">
                                                    {title}
                                                </Typography>
                                                <Typography className="text-xs text-gray-500 truncate">
                                                    {place}
                                                </Typography>
                                                <Typography className="text-[10px] text-gray-400 font-mono mt-1">
                                                    {period}
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-20 text-center text-gray-400 mx-4">
                                해당 조건의 공연 정보가 없습니다.
                            </div>
                        )}

                        {/* 모바일 페이지네이션 */}
                        <div className="flex items-center justify-between border-t border-gray-100 p-4 mt-3">
                            <Button
                                variant="text"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`flex items-center gap-1 font-bold ${currentPage === 1 ? "text-gray-300" : "text-black hover:bg-gray-100"}`}
                            >
                                <ChevronLeftIcon strokeWidth={3} className="h-3 w-3" /> 이전
                            </Button>
                            <Typography variant="small" className="font-bold text-gray-500">
                                <span className="text-black">{currentPage}</span> / {totalPages || 1}
                            </Typography>
                            <Button
                                variant="text"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className={`flex items-center gap-1 font-bold ${currentPage === totalPages ? "text-gray-300" : "text-black hover:bg-gray-100"}`}
                            >
                                다음 <ChevronRightIcon strokeWidth={3} className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PerformanceMain;
