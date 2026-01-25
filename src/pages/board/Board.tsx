import {
    Card,
    Typography,
    Button,
    CardBody,
    CardFooter,
    Input,
} from "@material-tailwind/react";
import { posts, currentUser } from "../../data/mockData.ts";
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const TABLE_HEAD = ["번호", "정보", "제목", "작성자", "작성일", "조회수"];
const ITEMS_PER_PAGE = 5;

// 카테고리 목록 정의
const CATEGORIES = ["전체", "공연후기", "질문", "정보", "자유"];

const Board = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 상태 관리: 페이지, 검색어, 정렬 방식, 선택된 카테고리
    const [activePage, setActivePage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"latest" | "views">("latest");
    const [selectedCategory, setSelectedCategory] = useState("전체");

    useEffect(() => {
        if (location.state?.sort) {
            setSortBy(location.state.sort);
            setActivePage(1);
        }
    }, [location.state]);

    const handlePostClick = (postId: number) => {
        const targetPost = posts.find((p) => p.id === postId);
        if (targetPost) targetPost.views += 1;
        navigate(`/board/${postId}`);
    };

    // [핵심 로직] 카테고리 필터링 -> 검색 필터링 -> 정렬 순으로 처리
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

    return (
        <div className="container mx-auto px-4 py-8 max-w-screen-xl">
            <div className="mb-6">
                <Typography variant="h5" color="blue-gray" className="font-bold">
                    커뮤니티 게시판
                </Typography>
                <Typography color="gray" className="mt-1 font-normal text-sm">
                    클래식 음악에 대한 다양한 이야기를 나누어 보세요.
                </Typography>
            </div>

            <div className="mb-8 flex flex-col gap-6">
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((category) => (
                        <Button
                            key={category}
                            size="sm"
                            variant={selectedCategory === category ? "filled" : "outlined"}
                            className={`rounded-none px-6 py-2.5 transition-all ${
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

                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-none w-max">
                        <Button
                            variant={sortBy === "latest" ? "white" : "text"}
                            size="sm"
                            className={`rounded-none px-4 py-2 ${sortBy === "latest" ? "shadow-sm text-white font-bold" : "text-white-500"}`}
                            onClick={() => setSortBy("latest")}
                        >
                            최신순
                        </Button>
                        <Button
                            variant={sortBy === "views" ? "white" : "text"}
                            size="sm"
                            className={`rounded-none px-4 py-2 ${sortBy === "views" ? "shadow-sm text-white font-bold" : "text-white-500"}`}
                            onClick={() => setSortBy("views")}
                        >
                            조회순
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-full md:w-72">
                            <Input
                                label="검색어 입력"
                                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setActivePage(1);
                                }}
                                crossOrigin={undefined}
                                className="!rounded-none"
                            />
                        </div>
                        <Button
                            className="bg-black text-white rounded-none flex items-center gap-2"
                            size="sm"
                            onClick={() => navigate("/board/write")}
                        >
                            글쓰기
                        </Button>
                    </div>
                </div>
            </div>

            <Card className="h-full w-full shadow-none border border-gray-200 rounded-none">
                <CardBody className="overflow-scroll px-0 py-0">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th key={head} className="border-b border-gray-100 bg-gray-50/50 p-4">
                                    <Typography variant="small" color="blue-gray" className="font-bold leading-none opacity-80">
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {currentPosts.length > 0 ? (
                            // [수정] authorId를 추가로 받아옵니다. [cite: 2026-01-21]
                            currentPosts.map(({ id, category, title, authorName, authorId, createdAt, views, images }, index) => {
                                const isLast = index === currentPosts.length - 1;
                                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                                // [수정] 이름이 아닌 고유 ID로 본인 여부를 확인합니다. [cite: 2026-01-25]
                                const isMine = authorId === currentUser.userId;

                                return (
                                    <tr key={id} className="hover:bg-gray-50 transition-colors">
                                        <td className={classes}>
                                            <Typography variant="small" className="text-gray-600">{id}</Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" className="font-bold text-black">{category}</Typography>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handlePostClick(id)}>
                                                <Typography variant="small" className="font-medium group-hover:text-gray-500 line-clamp-1">
                                                    {title}
                                                    {images.length > 0 && <span className="ml-2 text-gray-400">📷</span>}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" className="text-gray-600">
                                                {authorName}
                                                {/* [수정] 본인일 경우 (나) 표시 [cite: 2026-01-25] */}
                                                {isMine && <span className="ml-1 text-black font-bold text-[11px]">(나)</span>}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" className="text-gray-400 text-xs">{createdAt}</Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" className="text-gray-600 font-medium">{views.toLocaleString()}</Typography>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-10 text-center">
                                    <Typography color="gray">해당 카테고리에 게시글이 없습니다.</Typography>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </CardBody>

                <CardFooter className="flex items-center justify-between border-t border-gray-100 p-4">
                    <Button
                        variant="text"
                        size="sm"
                        onClick={() => setActivePage(activePage - 1)}
                        disabled={activePage === 1}
                        className={`flex items-center gap-1 font-bold ${activePage === 1 ? "text-gray-300" : "text-black"}`}
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
                        className={`flex items-center gap-1 font-bold ${activePage === totalPages ? "text-gray-300" : "text-black"}`}
                    >
                        다음 <ChevronRightIcon strokeWidth={3} className="h-3 w-3" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Board;