import React, { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Input, Button, Spinner } from "@material-tailwind/react";
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { usePerformanceStore } from '../../stores/performanceStore';

const TicketListPage = () => {
    const navigate = useNavigate();
    const { 
        performances, 
        listLoading, 
        fetchList, 
        fetchPriceForList,
        ticketSearchTerm, 
        ticketCurrentPage, 
        setTicketSearchTerm, 
        setTicketCurrentPage 
    } = usePerformanceStore();

    const itemsPerPage = 6; // 한 페이지에 보여줄 게시물 수

    useEffect(() => {
        fetchList();
    }, [fetchList]);

    // 1. 검색 필터링 로직
    const filteredData = useMemo(() => {
        return performances.filter((item) =>
            item.title.toLowerCase().includes(ticketSearchTerm.toLowerCase())
        );
    }, [performances, ticketSearchTerm]);

    // 2. 페이징 계산 로직
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = ticketCurrentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // 현재 페이지 아이템들의 가격 정보 로드
    useEffect(() => {
        if (currentItems.length > 0) {
            const ids = currentItems.map(item => item.id);
            fetchPriceForList(ids);
        }
    }, [currentItems, fetchPriceForList]);

    // 검색 시 페이지를 1페이지로 리셋
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTicketSearchTerm(e.target.value);
    };

    if (listLoading && performances.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner className="h-8 w-8" />
                <Typography className="ml-3 text-gray-500">티켓 정보를 불러오는 중...</Typography>
            </div>
        );
    }

    return (
        <div className="px-4 sm:p-4 max-w-5xl mx-auto min-h-screen bg-white">
            {/* 헤더 섹션 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 border-b-2 border-black pb-4">
                <Typography variant="h4" className="font-bold uppercase tracking-tighter text-xl lg:text-2xl">
                    공연 티켓 정보
                </Typography>

                {/* 검색창 (게시판 스타일) */}
                <div className="relative w-full md:w-72">
                    <Input
                        type="text"
                        label="공연명 검색"
                        value={ticketSearchTerm}
                        onChange={handleSearch}
                        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                        className="rounded-none"
                        crossOrigin={undefined}
                    />
                </div>
            </div>

            {/* 리스트 그리드 */}
            {currentItems.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                    {currentItems.map((item) => (
                        <Card
                            key={item.id}
                            className="rounded-none border border-gray-200 shadow-none cursor-pointer hover:border-black transition-all group"
                            onClick={() => navigate(`/ticket-info/${item.id}`)}
                        >
                            <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
                                {item.poster ? (
                                    <img
                                        src={item.poster}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                        alt={item.title}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                        <PhotoIcon className="h-12 w-12 mb-2" />
                                        <span className="text-xs font-bold">NO POSTER</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <Typography className="font-bold text-sm truncate mb-1">{item.title}</Typography>
                                <Typography className="text-[11px] text-gray-500 mb-3 truncate">{item.place}</Typography>
                                <div className="flex justify-between items-end border-t pt-2">
                                    <Typography className="text-[10px] text-gray-400 font-mono">{item.period.split(' ~ ')[0]}</Typography>
                                    <Typography className="text-sm font-bold text-black truncate max-w-[60%]">
                                        {item.price ? item.price : '가격정보 확인중...'}
                                    </Typography>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center border border-dashed border-gray-300">
                    <Typography className="text-gray-400">검색 결과가 없습니다.</Typography>
                </div>
            )}

            {/* 페이지네이션 (게시판 하단 스타일) */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                    <Button
                        variant="text"
                        className="flex items-center gap-1 rounded-none p-2"
                        onClick={() => setTicketCurrentPage(Math.max(ticketCurrentPage - 1, 1))}
                        disabled={ticketCurrentPage === 1}
                    >
                        <ChevronLeftIcon strokeWidth={2} className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, index) => {
                            if (totalPages > 10 && Math.abs(ticketCurrentPage - (index + 1)) > 4 && index !== 0 && index !== totalPages - 1) {
                                if (Math.abs(ticketCurrentPage - (index + 1)) === 5) return <span key={index} className="px-1">...</span>;
                                return null;
                            }
                            
                            return (
                                <Button
                                    key={index + 1}
                                    variant={ticketCurrentPage === index + 1 ? "filled" : "text"}
                                    size="sm"
                                    className={`rounded-none w-8 h-8 p-0 ${ticketCurrentPage === index + 1 ? "bg-black text-white" : "text-gray-600"}`}
                                    onClick={() => setTicketCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </Button>
                            );
                        })}
                    </div>

                    <Button
                        variant="text"
                        className="flex items-center gap-1 rounded-none p-2"
                        onClick={() => setTicketCurrentPage(Math.min(ticketCurrentPage + 1, totalPages))}
                        disabled={ticketCurrentPage === totalPages}
                    >
                        <ChevronRightIcon strokeWidth={2} className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TicketListPage;