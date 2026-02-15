'use client';

import { useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Search, Map, Image, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePerformanceStore } from "@/stores/performanceStore";

const TABLE_HEAD = ["포스터", "공연명", "공연장", "공연기간", "지역", "상태"];
const PERFORMANCE_TABS = ["전체", "공연중", "공연예정", "공연완료", "지역별"];
const AREA_CATEGORIES = ["전체 지역", "서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
const ITEMS_PER_PAGE = 5;

const PerformanceMain = () => {
    const router = useRouter();

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
                    <Image className="h-6 w-6 text-gray-200" />
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
                    <h4 className="font-bold tracking-tighter uppercase text-xl lg:text-2xl text-gray-900">
                        공연정보
                    </h4>
                    <p className="mt-1 font-normal text-sm text-gray-500">
                        전국의 클래식 공연 소식과 실시간 예매 현황을 확인하세요.
                    </p>
                </div>
                <Button
                    className="flex items-center gap-3 bg-black hover:bg-black/90 shadow-none hover:shadow-lg transition-all px-8 w-full sm:w-auto justify-center rounded-none"
                    onClick={() => router.push("/performance/map")}
                >
                    <Map className="h-5 w-5" /> 공연지도 보기
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
                <div className="flex items-center gap-2 bg-gray-100 p-1 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-1 sm:overflow-visible sm:w-max">
                    {PERFORMANCE_TABS.map((tab) => (
                        <Button
                            key={tab}
                            variant={selectedTab === tab ? "default" : "ghost"}
                            size="sm"
                            className={`rounded-none px-4 sm:px-6 py-2 whitespace-nowrap flex-shrink-0 ${selectedTab === tab ? "shadow-sm font-bold" : "text-gray-500"}`}
                            onClick={() => {
                                setSelectedTab(tab);
                                if (tab !== "지역별") setSelectedArea("전체 지역");
                            }}
                        >
                            {tab}
                        </Button>
                    ))}
                </div>
                <div className="w-full md:w-80 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="공연명 또는 공연장 검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 focus:border-black"
                    />
                </div>
            </div>

            {/* 지역별 하위 카테고리 UI */}
            {selectedTab === "지역별" && (
                <div className="mb-6 lg:mb-8 shadow-none border border-gray-100 bg-gray-50/30 p-3 lg:p-4 mx-4 sm:mx-0">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {AREA_CATEGORIES.map((area) => (
                            <Button
                                key={area}
                                size="sm"
                                variant={selectedArea === area ? "default" : "ghost"}
                                className={`rounded-none px-3 sm:px-4 py-1.5 transition-all text-[10px] sm:text-[11px] font-bold ${
                                    selectedArea === area ? "bg-black text-white hover:bg-black/90" : "text-gray-500 hover:text-black"
                                }`}
                                onClick={() => setSelectedArea(area)}
                            >
                                {area}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* 로딩 상태 */}
            {listLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Spinner size="md" />
                    <span className="ml-3 text-gray-500">공연 정보를 불러오는 중...</span>
                </div>
            ) : (
                <>
                    {/* 데스크톱: 테이블 뷰 */}
                    <Card className="h-full w-full shadow-none border border-gray-200 rounded-none overflow-hidden hidden md:block">
                        <CardContent className="px-0 py-0">
                            <table className="w-full min-w-max table-auto text-left">
                                <thead>
                                <tr className="bg-gray-50/50">
                                    {TABLE_HEAD.map((head) => (
                                        <th key={head} className="border-b border-gray-100 p-4">
                                            <span className="text-sm font-bold text-gray-700 opacity-80 uppercase tracking-wider">
                                                {head}
                                            </span>
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
                                                onClick={() => router.push(`/performance/${id}`)}>
                                                <td className={classes}>
                                                    <PerformanceThumbnail src={poster} alt={title} />
                                                </td>
                                                <td className={classes}>
                                                    <span className="text-sm font-bold text-black group-hover:text-gray-600 transition-colors">
                                                        {title}
                                                    </span>
                                                </td>
                                                <td className={classes}>
                                                    <span className="text-sm text-gray-600 font-medium">{place}</span>
                                                </td>
                                                <td className={classes}>
                                                    <span className="text-sm text-gray-500 text-xs font-mono">{period}</span>
                                                </td>
                                                <td className={classes}>
                                                    <span className="text-sm text-gray-600">{area}</span>
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
                        </CardContent>

                        <CardFooter className="flex items-center justify-between border-t border-gray-100 p-4 bg-white">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`flex items-center gap-1 font-bold ${currentPage === 1 ? "text-gray-300" : "text-black hover:bg-gray-100"}`}
                            >
                                <ChevronLeft strokeWidth={3} className="h-3 w-3" /> 이전
                            </Button>
                            <span className="text-sm font-bold text-gray-500">
                                <span className="text-black">{currentPage}</span> / {totalPages || 1}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className={`flex items-center gap-1 font-bold ${currentPage === totalPages ? "text-gray-300" : "text-black hover:bg-gray-100"}`}
                            >
                                다음 <ChevronRight strokeWidth={3} className="h-3 w-3" />
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
                                        onClick={() => router.push(`/performance/${id}`)}
                                    >
                                        <div className="flex gap-3">
                                            <PerformanceThumbnail src={poster} alt={title} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <StatusBadge status={status} />
                                                    <span className="text-[10px] text-gray-400">{area}</span>
                                                </div>
                                                <p className="font-bold text-sm text-black line-clamp-2 mb-1">
                                                    {title}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {place}
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-mono mt-1">
                                                    {period}
                                                </p>
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
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`flex items-center gap-1 font-bold ${currentPage === 1 ? "text-gray-300" : "text-black hover:bg-gray-100"}`}
                            >
                                <ChevronLeft strokeWidth={3} className="h-3 w-3" /> 이전
                            </Button>
                            <span className="text-sm font-bold text-gray-500">
                                <span className="text-black">{currentPage}</span> / {totalPages || 1}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className={`flex items-center gap-1 font-bold ${currentPage === totalPages ? "text-gray-300" : "text-black hover:bg-gray-100"}`}
                            >
                                다음 <ChevronRight strokeWidth={3} className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PerformanceMain;
