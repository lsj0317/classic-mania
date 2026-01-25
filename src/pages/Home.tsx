import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { posts } from "../data/mockData";
import concertHallBaner from "../assets/home/concert_hall_baner.png";
import {PhotoIcon} from "@heroicons/react/16/solid";

const Home = () => {
    const navigate = useNavigate();

    // 1. 데이터 가공: 최신글 5개 & 인기글 5개 추출 [cite: 2026-01-21]
    const latestPosts = [...posts].sort((a, b) => b.id - a.id).slice(0, 5);
    const popularPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 5);

    // [추가] 조회수 증가 및 이동 핸들러 함수 [cite: 2026-01-21]
    const handlePostClick = (postId: number) => {
        const targetPost = posts.find((p) => p.id === postId);
        if (targetPost) {
            targetPost.views += 1; // 조회수 증가 처리
        }
        navigate(`/board/${postId}`); // 상세페이지로 이동
    };

    // 공통 테이블 섹션 컴포넌트
    const PostSection = ({ title, data, sortType }: { title: string, data: typeof posts, sortType: string }) => (
        <Card className="shadow-lg">
            <CardBody>
                <div className="flex items-center justify-between mb-6">
                    <Typography variant="h5" color="blue-gray" className="font-bold">
                        {title}
                    </Typography>
                    <Button
                        variant="text"
                        size="sm"
                        className="font-bold text-black hover:bg-gray-100"
                        onClick={() => navigate("/board", { state: { sort: sortType } })}
                    >
                        더보기 +
                    </Button>
                </div>
                <ul className="space-y-4">
                    {data.map((post) => (
                        <li
                            key={post.id}
                            className="flex items-center gap-4 cursor-pointer group p-1 rounded-lg hover:bg-gray-50 transition-colors"
                            // [수정] navigate 대신 handlePostClick 함수 호출
                            onClick={() => handlePostClick(post.id)}
                        >
                            {post.images && post.images.length > 0 ? (
                                <img
                                    src={post.images[0]}
                                    alt={post.title}
                                    className="h-16 w-16 object-cover rounded-none grayscale group-hover:grayscale-0 transition-all shadow-sm"
                                    // 이미지 로드 실패 시 처리
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            ) : (
                                // 이미지가 없을 때 보여줄 깔끔한 아이콘 박스 [cite: 2026-01-25]
                                <div className="h-16 w-16 bg-gray-50 flex items-center justify-center border border-gray-100">
                                    <PhotoIcon className="h-6 w-6 text-gray-300" />
                                </div>
                            )}
                            <div className="flex-1 overflow-hidden">
                                <Typography variant="h6" color="blue-gray" className="group-hover:text-blue-500 transition-colors truncate">
                                    {post.title}
                                </Typography>
                                <div className="flex items-center gap-2">
                                    <Typography variant="small" color="gray" className="font-medium text-xs">
                                        {post.authorName}
                                    </Typography>
                                    <span className="text-gray-300 text-xs">|</span>
                                    <Typography variant="small" color="gray" className="text-[11px]">
                                        {post.createdAt}
                                    </Typography>
                                    {/* 인기글 섹션일 때만 조회수 강조 표시 */}
                                    {sortType === "views" && (
                                        <Typography variant="small" color="gray" className="ml-auto text-[11px] font-bold">
                                            조회 {post.views}
                                        </Typography>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardBody>
        </Card>
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-screen-xl">
            <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-lg mb-12">
                <img
                    src={concertHallBaner}
                    alt="오케스트라 배경"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/50 grid place-items-center">
                    <div className="text-center text-white">
                        <Typography variant="h1" className="mb-2 text-3xl md:text-5xl font-extrabold">
                            음악으로 하나되는 공간,
                        </Typography>
                        <Typography variant="h1" className="mb-4 text-3xl md:text-5xl font-extrabold">
                            클래식 매니아 커뮤니티
                        </Typography>
                        <Button size="lg" color="black" className="mt-6 font-bold" onClick={() => navigate("/login")}>
                            시작하기
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <PostSection title="최신 소식" data={latestPosts} sortType="latest" />
                <PostSection title="인기 게시글" data={popularPosts} sortType="views" />
            </div>
        </div>
    );
};

export default Home;