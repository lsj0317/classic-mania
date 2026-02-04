import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ticketData } from '../../data/ticketData';

const TicketListPage = () => {
    const navigate = useNavigate();

    // 상태 관리: 검색어 및 현재 페이지
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // 한 페이지에 보여줄 게시물 수

    // 1. 검색 필터링 로직
    const filteredData = useMemo(() => {
        return ticketData.filter((item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    // 2. 페이징 계산 로직
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // 검색 시 페이지를 1페이지로 리셋
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="p-4 max-w-5xl mx-auto min-h-screen bg-white">
            {/* 헤더 섹션 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b-2 border-black pb-4">
                <Typography variant="h4" className="font-bold uppercase tracking-tighter">
                    공연 티켓 정보
                </Typography>

                {/* 검색창 (게시판 스타일) */}
                <div className="relative w-full md:w-72">
                    <Input
                        type="text"
                        label="공연명 검색"
                        value={searchTerm}
                        onChange={handleSearch}
                        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                        className="rounded-none"
                    />
                </div>
            </div>

            {/* 리스트 그리드 */}
            {currentItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentItems.map((item) => (
                        <Card
                            key={item.id}
                            className="rounded-none border border-gray-200 shadow-none cursor-pointer hover:border-black transition-all group"
                            onClick={() => navigate(`/ticket-info/${item.id}`)}
                        >
                            <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                                <img
                                    src={item.poster}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    alt={item.title}
                                />
                            </div>
                            <div className="p-4">
                                <Typography className="font-bold text-sm truncate mb-1">{item.title}</Typography>
                                <Typography className="text-[11px] text-gray-500 mb-3">{item.place}</Typography>
                                <div className="flex justify-between items-end border-t pt-2">
                                    <Typography className="text-[10px] text-gray-400 font-mono">{item.period.split(' - ')[0]}</Typography>
                                    <Typography className="text-sm font-bold text-black">
                                        {item.currentPrice.toLocaleString()}원~
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
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeftIcon strokeWidth={2} className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, index) => (
                            <Button
                                key={index + 1}
                                variant={currentPage === index + 1 ? "filled" : "text"}
                                size="sm"
                                className={`rounded-none w-8 h-8 p-0 ${currentPage === index + 1 ? "bg-black text-white" : "text-gray-600"}`}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </Button>
                        ))}
                    </div>

                    <Button
                        variant="text"
                        className="flex items-center gap-1 rounded-none p-2"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRightIcon strokeWidth={2} className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TicketListPage;