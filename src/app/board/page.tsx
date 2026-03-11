'use client';

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { posts, currentUser } from "@/data/mockData";
import { Search, ChevronLeft, ChevronRight, Megaphone } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useNoticeStore } from "@/stores/noticeStore";
import type { NoticeBadge } from "@/types";

const TABLE_HEAD = ["번호", "정보", "제목", "작성자", "작성일", "조회수"];
const NOTICE_TABLE_HEAD = ["번호", "분류", "제목", "작성자", "작성일", "조회수"];
const ITEMS_PER_PAGE = 5;

const CATEGORIES = ["전체", "공연후기", "질문", "정보", "자유"];

const BADGE_COLORS: Record<NoticeBadge, string> = {
    "신규기능": "bg-blue-100 text-blue-700 border-blue-200",
    "기능개선": "bg-green-100 text-green-700 border-green-200",
    "공지사항": "bg-gray-100 text-gray-700 border-gray-200",
    "긴급공지": "bg-red-100 text-red-700 border-red-200",
};

const Board = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [boardTab, setBoardTab] = useState<"community" | "notice">("community");
    const [activePage, setActivePage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"latest" | "views">("latest");
    const [selectedCategory, setSelectedCategory] = useState("전체");

    // Notice store
    const { notices, fetchNotices, incrementViews } = useNoticeStore();
    const [noticePage, setNoticePage] = useState(1);
    const [noticeSearch, setNoticeSearch] = useState("");

    useEffect(() => {
        fetchNotices();
    }, [fetchNotices]);

    useEffect(() => {
        const sort = searchParams?.get('sort');
        const tab = searchParams?.get('tab');
        if (sort) {
            setSortBy(sort as "latest" | "views");
            setActivePage(1);
        }
        if (tab === 'notice') {
            setBoardTab('notice');
        }
    }, [searchParams]);

    const handlePostClick = (postId: number) => {
        const targetPost = posts.find((p) => p.id === postId);
        if (targetPost) targetPost.views += 1;
        router.push(`/board/${postId}`);
    };

    const handleNoticeClick = (noticeId: number) => {
        incrementViews(noticeId);
        router.push(`/board/notice/${noticeId}`);
    };

    const filteredPosts = posts
        .filter((post) => {
            const matchesCategory = selectedCategory === "전체" || post.category === selectedCategory;
            const matchesSearch =
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.authorName.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => {
            if (sortBy === "views") return b.views - a.views;
            return b.id - a.id;
        });

    const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
    const indexOfLastPost = activePage * ITEMS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - ITEMS_PER_PAGE;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    // Notice filtering
    const filteredNotices = notices.filter(n =>
        n.title.toLowerCase().includes(noticeSearch.toLowerCase())
    );
    const noticeTotalPages = Math.ceil(filteredNotices.length / ITEMS_PER_PAGE);
    const noticeCurrentItems = filteredNotices.slice(
        (noticePage - 1) * ITEMS_PER_PAGE,
        noticePage * ITEMS_PER_PAGE
    );

    return (
        <div className="container mx-auto px-0 sm:px-4 py-6 lg:py-8 max-w-screen-xl">
            <div className="mb-6 px-4 sm:px-0">
                <h2 className="text-xl font-bold text-gray-800">
                    {boardTab === "community" ? "커뮤니티 게시판" : "공지사항"}
                </h2>
                <p className="mt-1 font-normal text-sm text-gray-500">
                    {boardTab === "community"
                        ? "클래식 음악에 대한 다양한 이야기를 나누어 보세요."
                        : "Classic Mania의 새로운 소식과 공지사항을 확인하세요."
                    }
                </p>
            </div>

            {/* Top-level board tabs */}
            <div className="mb-6 px-4 sm:px-0 flex gap-2">
                <Button
                    variant={boardTab === "community" ? "default" : "outline"}
                    size="sm"
                    className={`px-6 py-2.5 ${boardTab === "community" ? "bg-black text-white border-black" : "text-gray-500 border-gray-300"}`}
                    onClick={() => { setBoardTab("community"); setActivePage(1); }}
                >
                    커뮤니티
                </Button>
                <Button
                    variant={boardTab === "notice" ? "default" : "outline"}
                    size="sm"
                    className={`px-6 py-2.5 flex items-center gap-1.5 ${boardTab === "notice" ? "bg-black text-white border-black" : "text-gray-500 border-gray-300"}`}
                    onClick={() => { setBoardTab("notice"); setNoticePage(1); }}
                >
                    <Megaphone className="h-3.5 w-3.5" />
                    공지사항
                </Button>
            </div>

            {boardTab === "community" ? (
                <>
                    <div className="mb-6 lg:mb-8 flex flex-col gap-4 lg:gap-6 px-4 sm:px-0">
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
                            {CATEGORIES.map((category) => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? "default" : "outline"}
                                    size="sm"
                                    className={`px-4 sm:px-6 py-2 sm:py-2.5 transition-all whitespace-nowrap flex-shrink-0 text-xs sm:text-sm ${
                                        selectedCategory === category
                                            ? "bg-black text-white border-black"
                                            : "bg-transparent text-gray-500 border-gray-300 hover:border-black hover:text-black"
                                    }`}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setActivePage(1);
                                    }}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>

                        <div className="flex flex-col justify-between gap-3 sm:gap-4 md:flex-row md:items-center border-t border-gray-100 pt-4 lg:pt-6">
                            <div className="flex items-center gap-2 bg-gray-100 p-1 w-max">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`px-4 py-2 ${sortBy === "latest" ? "bg-white shadow-sm font-bold" : "text-gray-500"}`}
                                    onClick={() => setSortBy("latest")}
                                >
                                    최신순
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`px-4 py-2 ${sortBy === "views" ? "bg-white shadow-sm font-bold" : "text-gray-500"}`}
                                    onClick={() => setSortBy("views")}
                                >
                                    조회순
                                </Button>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex-1 md:w-72 md:flex-none relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="검색어 입력"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setActivePage(1);
                                        }}
                                        className="pl-9"
                                    />
                                </div>
                                <Button
                                    className="bg-black text-white flex items-center gap-2 whitespace-nowrap"
                                    size="sm"
                                    onClick={() => router.push("/board/write")}
                                >
                                    글쓰기
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* 데스크톱: 테이블 뷰 */}
                    <Card className="h-full w-full shadow-none border border-gray-200 hidden md:block">
                        <CardContent className="overflow-scroll px-0 py-0">
                            <table className="w-full min-w-max table-auto text-left">
                                <thead>
                                <tr>
                                    {TABLE_HEAD.map((head) => (
                                        <th key={head} className="border-b border-gray-100 bg-gray-50/50 p-4">
                                            <span className="text-sm font-bold text-gray-700 leading-none opacity-80">
                                                {head}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {currentPosts.length > 0 ? (
                                    currentPosts.map(({ id, category, title, authorName, authorId, createdAt, views, images }, index) => {
                                        const isLast = index === currentPosts.length - 1;
                                        const classes = isLast ? "p-4" : "p-4 border-b border-gray-100";
                                        const isMine = authorId === currentUser.userId;

                                        return (
                                            <tr key={id} className="hover:bg-gray-50 transition-colors">
                                                <td className={classes}>
                                                    <span className="text-sm text-gray-600">{id}</span>
                                                </td>
                                                <td className={classes}>
                                                    <span className="text-sm font-bold text-black">{category}</span>
                                                </td>
                                                <td className={classes}>
                                                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handlePostClick(id)}>
                                                        <span className="text-sm font-medium group-hover:text-gray-500 line-clamp-1">
                                                            {title}
                                                            {images.length > 0 && <span className="ml-2 text-gray-400">📷</span>}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className={classes}>
                                                    <span className="text-sm text-gray-600">
                                                        {authorName}
                                                        {isMine && <span className="ml-1 text-black font-bold text-[11px]">(나)</span>}
                                                    </span>
                                                </td>
                                                <td className={classes}>
                                                    <span className="text-xs text-gray-400">{createdAt}</span>
                                                </td>
                                                <td className={classes}>
                                                    <span className="text-sm text-gray-600 font-medium">{views.toLocaleString()}</span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-10 text-center">
                                            <p className="text-gray-500">해당 카테고리에 게시글이 없습니다.</p>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </CardContent>

                        <CardFooter className="flex items-center justify-between border-t border-gray-100 p-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setActivePage(activePage - 1)}
                                disabled={activePage === 1}
                                className={`flex items-center gap-1 font-bold ${activePage === 1 ? "text-gray-300" : "text-black"}`}
                            >
                                <ChevronLeft strokeWidth={3} className="h-3 w-3" /> 이전
                            </Button>
                            <span className="text-sm font-bold text-gray-500">
                                <span className="text-black">{activePage}</span> / {totalPages || 1}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setActivePage(activePage + 1)}
                                disabled={activePage === totalPages || totalPages === 0}
                                className={`flex items-center gap-1 font-bold ${activePage === totalPages ? "text-gray-300" : "text-black"}`}
                            >
                                다음 <ChevronRight strokeWidth={3} className="h-3 w-3" />
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* 모바일: 카드 리스트 뷰 */}
                    <div className="md:hidden">
                        {currentPosts.length > 0 ? (
                            <div className="flex flex-col gap-3 px-4 sm:px-0">
                                {currentPosts.map(({ id, category, title, authorName, authorId, createdAt, views, images }) => {
                                    const isMine = authorId === currentUser.userId;
                                    return (
                                        <div
                                            key={id}
                                            className="border border-gray-200 p-4 active:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => handlePostClick(id)}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5">
                                                    {category}
                                                </span>
                                                {images.length > 0 && <span className="text-gray-400 text-xs">📷</span>}
                                            </div>
                                            <p className="font-bold text-sm text-black line-clamp-2 mb-2">
                                                {title}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-600 font-medium">
                                                        {authorName}
                                                        {isMine && <span className="ml-1 text-black font-bold">(나)</span>}
                                                    </span>
                                                    <span>|</span>
                                                    <span>{createdAt}</span>
                                                </div>
                                                <span>조회 {views.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-10 text-center mx-4">
                                <p className="text-gray-500">해당 카테고리에 게시글이 없습니다.</p>
                            </div>
                        )}

                        <div className="flex items-center justify-between border-t border-gray-100 p-4 mt-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setActivePage(activePage - 1)}
                                disabled={activePage === 1}
                                className={`flex items-center gap-1 font-bold ${activePage === 1 ? "text-gray-300" : "text-black"}`}
                            >
                                <ChevronLeft strokeWidth={3} className="h-3 w-3" /> 이전
                            </Button>
                            <span className="text-sm font-bold text-gray-500">
                                <span className="text-black">{activePage}</span> / {totalPages || 1}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setActivePage(activePage + 1)}
                                disabled={activePage === totalPages || totalPages === 0}
                                className={`flex items-center gap-1 font-bold ${activePage === totalPages ? "text-gray-300" : "text-black"}`}
                            >
                                다음 <ChevronRight strokeWidth={3} className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </>
            ) : (
                /* 공지사항 탭 */
                <>
                    <div className="mb-6 px-4 sm:px-0">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 md:w-72 md:flex-none relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="공지사항 검색"
                                    value={noticeSearch}
                                    onChange={(e) => {
                                        setNoticeSearch(e.target.value);
                                        setNoticePage(1);
                                    }}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 데스크톱: 공지사항 테이블 */}
                    <Card className="h-full w-full shadow-none border border-gray-200 hidden md:block">
                        <CardContent className="overflow-scroll px-0 py-0">
                            <table className="w-full min-w-max table-auto text-left">
                                <thead>
                                <tr>
                                    {NOTICE_TABLE_HEAD.map((head) => (
                                        <th key={head} className="border-b border-gray-100 bg-gray-50/50 p-4">
                                            <span className="text-sm font-bold text-gray-700 leading-none opacity-80">
                                                {head}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {noticeCurrentItems.length > 0 ? (
                                    noticeCurrentItems.map((notice, index) => {
                                        const isLast = index === noticeCurrentItems.length - 1;
                                        const classes = isLast ? "p-4" : "p-4 border-b border-gray-100";

                                        return (
                                            <tr
                                                key={notice.id}
                                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                                onClick={() => handleNoticeClick(notice.id)}
                                            >
                                                <td className={classes}>
                                                    <span className="text-sm text-gray-600">{notice.id}</span>
                                                </td>
                                                <td className={classes}>
                                                    <Badge variant="outline" className={`text-[10px] font-bold border ${BADGE_COLORS[notice.badge]}`}>
                                                        {notice.badge}
                                                    </Badge>
                                                </td>
                                                <td className={classes}>
                                                    <span className="text-sm font-medium hover:text-gray-500 line-clamp-1">
                                                        {notice.title}
                                                    </span>
                                                </td>
                                                <td className={classes}>
                                                    <span className="text-sm text-gray-600">{notice.authorName}</span>
                                                </td>
                                                <td className={classes}>
                                                    <span className="text-xs text-gray-400">{notice.createdAt}</span>
                                                </td>
                                                <td className={classes}>
                                                    <span className="text-sm text-gray-600 font-medium">{notice.views.toLocaleString()}</span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-10 text-center">
                                            <p className="text-gray-500">공지사항이 없습니다.</p>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </CardContent>

                        <CardFooter className="flex items-center justify-between border-t border-gray-100 p-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setNoticePage(noticePage - 1)}
                                disabled={noticePage === 1}
                                className={`flex items-center gap-1 font-bold ${noticePage === 1 ? "text-gray-300" : "text-black"}`}
                            >
                                <ChevronLeft strokeWidth={3} className="h-3 w-3" /> 이전
                            </Button>
                            <span className="text-sm font-bold text-gray-500">
                                <span className="text-black">{noticePage}</span> / {noticeTotalPages || 1}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setNoticePage(noticePage + 1)}
                                disabled={noticePage === noticeTotalPages || noticeTotalPages === 0}
                                className={`flex items-center gap-1 font-bold ${noticePage === noticeTotalPages ? "text-gray-300" : "text-black"}`}
                            >
                                다음 <ChevronRight strokeWidth={3} className="h-3 w-3" />
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* 모바일: 공지사항 카드 리스트 */}
                    <div className="md:hidden">
                        {noticeCurrentItems.length > 0 ? (
                            <div className="flex flex-col gap-3 px-4 sm:px-0">
                                {noticeCurrentItems.map((notice) => (
                                    <div
                                        key={notice.id}
                                        className="border border-gray-200 p-4 active:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => handleNoticeClick(notice.id)}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className={`text-[10px] font-bold border ${BADGE_COLORS[notice.badge]}`}>
                                                {notice.badge}
                                            </Badge>
                                        </div>
                                        <p className="font-bold text-sm text-black line-clamp-2 mb-2">
                                            {notice.title}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-600 font-medium">{notice.authorName}</span>
                                                <span>|</span>
                                                <span>{notice.createdAt}</span>
                                            </div>
                                            <span>조회 {notice.views.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-10 text-center mx-4">
                                <p className="text-gray-500">공지사항이 없습니다.</p>
                            </div>
                        )}

                        <div className="flex items-center justify-between border-t border-gray-100 p-4 mt-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setNoticePage(noticePage - 1)}
                                disabled={noticePage === 1}
                                className={`flex items-center gap-1 font-bold ${noticePage === 1 ? "text-gray-300" : "text-black"}`}
                            >
                                <ChevronLeft strokeWidth={3} className="h-3 w-3" /> 이전
                            </Button>
                            <span className="text-sm font-bold text-gray-500">
                                <span className="text-black">{noticePage}</span> / {noticeTotalPages || 1}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setNoticePage(noticePage + 1)}
                                disabled={noticePage === noticeTotalPages || noticeTotalPages === 0}
                                className={`flex items-center gap-1 font-bold ${noticePage === noticeTotalPages ? "text-gray-300" : "text-black"}`}
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

export default Board;
