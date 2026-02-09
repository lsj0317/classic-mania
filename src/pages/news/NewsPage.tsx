import React, { useEffect, useRef } from 'react';
import { Typography, Input, Button, Spinner, Card, Select, Option } from "@material-tailwind/react";
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { useNewsStore } from '../../stores/newsStore';
import type {NewsItem} from '../../api/newsApi';
import { useNavigate } from 'react-router-dom';

const NewsPage = () => {
    const navigate = useNavigate();
    const { 
        newsList, 
        loading, 
        error, 
        keyword, 
        currentPage, 
        totalResults, 
        sortBy,
        lastFetched,
        fetchNewsList, 
        setKeyword, 
        setCurrentPage,
        setSortBy
    } = useNewsStore();

    // 검색어 입력 상태 (엔터키 입력 시 검색을 위해 별도 관리)
    const [localKeyword, setLocalKeyword] = React.useState(keyword);
    
    // 이전 파라미터 추적을 위한 Ref (불필요한 재요청 방지)
    const prevParamsRef = useRef({ keyword, currentPage, sortBy });

    useEffect(() => {
        // 1. 데이터가 없으면 무조건 호출
        if (newsList.length === 0) {
            fetchNewsList();
            return;
        }

        // 2. 파라미터(검색어, 페이지, 정렬)가 변경되었는지 확인
        const isParamsChanged = 
            prevParamsRef.current.keyword !== keyword ||
            prevParamsRef.current.currentPage !== currentPage ||
            prevParamsRef.current.sortBy !== sortBy;

        // 3. 파라미터가 변경되었을 때만 호출 (뒤로가기 시에는 호출 안 함)
        if (isParamsChanged) {
            fetchNewsList();
            prevParamsRef.current = { keyword, currentPage, sortBy };
        } else {
            // 4. 파라미터가 같더라도, 데이터가 너무 오래되었으면(예: 1시간) 재호출
            const oneHour = 60 * 60 * 1000;
            if (Date.now() - lastFetched > oneHour) {
                fetchNewsList();
            }
        }
    }, [fetchNewsList, currentPage, sortBy, keyword, newsList.length, lastFetched]);

    // 검색 핸들러
    const handleSearch = () => {
        if (localKeyword.trim() === '') return;
        setKeyword(localKeyword);
        // useEffect에서 감지하여 fetchNewsList 호출됨
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // 뉴스 클릭 핸들러 (상세 페이지 이동)
    const handleNewsClick = (news: NewsItem) => {
        navigate('/news/detail', { state: { news } });
    };

    // 날짜 포맷팅 (YYYY.MM.DD)
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    // HTML 엔티티 디코딩 (제목/내용에 포함된 <b> 태그 등 제거)
    const decodeHtml = (html: string) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value.replace(/<[^>]*>?/gm, '');
    };

    // 페이지네이션 계산
    const itemsPerPage = 10;
    const maxPages = Math.min(Math.ceil(totalResults / itemsPerPage), 100);

    return (
        <div className="container mx-auto px-0 sm:px-4 py-6 lg:py-8 max-w-screen-xl min-h-screen">
            {/* 헤더 섹션 */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 lg:gap-6 mb-8 lg:mb-12 border-b-2 border-black pb-4 lg:pb-6 px-4 sm:px-0">
                <div className="flex-1">
                    <Typography variant="h2" className="font-bold text-black tracking-tighter mb-1 lg:mb-2 text-xl lg:text-3xl">
                        클래식뉴스
                    </Typography>
                    <Typography className="text-gray-600 font-normal text-sm">
                        클래식 공연계의 최신 소식과 아티스트들의 이야기를 전해드립니다.
                    </Typography>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
                    <div className="w-full sm:w-40">
                        <Select 
                            label="정렬" 
                            value={sortBy} 
                            onChange={(val) => setSortBy(val || 'sim')}
                            className="!rounded-none border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                            containerProps={{
                                className: "!min-w-[100px] !rounded-none",
                            }}
                            menuProps={{ className: "rounded-none" }}
                        >
                            <Option value="sim" className="rounded-none">관련도순</Option>
                            <Option value="date" className="rounded-none">최신순</Option>
                        </Select>
                    </div>
                    <div className="relative w-full sm:w-80">
                        <Input
                            type="text"
                            label="뉴스 검색"
                            value={localKeyword}
                            onChange={(e) => setLocalKeyword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            icon={<MagnifyingGlassIcon className="h-5 w-5 cursor-pointer hover:text-black" onClick={handleSearch} />}
                            className="!rounded-none focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                            containerProps={{
                                className: "!rounded-none",
                            }}
                            crossOrigin={undefined}
                        />
                    </div>
                </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
                <div className="p-4 mb-8 bg-red-50 border border-red-200 text-red-700 text-center">
                    {error}
                </div>
            )}

            {/* 뉴스 리스트 */}
            {loading ? (
                <div className="flex justify-center items-center py-20 lg:py-40">
                    <Spinner className="h-8 w-8 lg:h-10 lg:w-10" />
                    <Typography className="ml-3 lg:ml-4 text-gray-500 text-sm">최신 뉴스를 불러오는 중...</Typography>
                </div>
            ) : newsList.length > 0 ? (
                <div className="flex flex-col gap-3 sm:gap-6 px-4 sm:px-0">
                    {newsList.map((news, index) => (
                        <Card
                            key={index}
                            className="p-4 sm:p-6 rounded-none border border-gray-200 shadow-none hover:border-black transition-all cursor-pointer group"
                            onClick={() => handleNewsClick(news)}
                        >
                            <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1.5 sm:mb-2">
                                        <span className="text-[10px] sm:text-xs font-bold text-blue-600 uppercase tracking-wider">News</span>
                                        <span className="text-[10px] sm:text-xs text-gray-400 border-l pl-3 border-gray-300">
                                            {formatDate(news.pubDate)}
                                        </span>
                                    </div>
                                    <Typography variant="h5" className="font-bold text-black mb-2 sm:mb-3 group-hover:text-blue-700 transition-colors leading-tight text-sm sm:text-lg">
                                        {decodeHtml(news.title)}
                                    </Typography>
                                    <Typography className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                                        {decodeHtml(news.description)}
                                    </Typography>
                                </div>
                                <div className="hidden md:flex items-center justify-center h-full pl-4">
                                    <Button variant="text" className="flex items-center gap-2 rounded-full p-3 text-gray-400 group-hover:text-black group-hover:bg-gray-100">
                                        <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="py-20 lg:py-40 text-center border border-dashed border-gray-300 mx-4 sm:mx-0">
                    <Typography className="text-gray-400">검색 결과가 없습니다.</Typography>
                </div>
            )}

            {/* 페이지네이션 */}
            {!loading && newsList.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-16">
                    <Button
                        variant="text"
                        className="flex items-center gap-1 rounded-none p-2"
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeftIcon strokeWidth={2} className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1">
                        {[...Array(maxPages)].map((_, index) => {
                            const pageNum = index + 1;
                            if (maxPages > 10 && Math.abs(currentPage - pageNum) > 4 && pageNum !== 1 && pageNum !== maxPages) {
                                if (Math.abs(currentPage - pageNum) === 5) return <span key={index} className="px-1 text-gray-300">...</span>;
                                return null;
                            }
                            
                            return (
                                <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? "filled" : "text"}
                                    size="sm"
                                    className={`rounded-none w-8 h-8 p-0 ${currentPage === pageNum ? "bg-black text-white" : "text-gray-600"}`}
                                    onClick={() => setCurrentPage(pageNum)}
                                >
                                    {pageNum}
                                </Button>
                            );
                        })}
                    </div>

                    <Button
                        variant="text"
                        className="flex items-center gap-1 rounded-none p-2"
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, maxPages))}
                        disabled={currentPage === maxPages}
                    >
                        <ChevronRightIcon strokeWidth={2} className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default NewsPage;
