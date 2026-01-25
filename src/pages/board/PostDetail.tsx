import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardFooter, Typography, Button, Chip } from "@material-tailwind/react";
import { posts, currentUser } from "../../data/mockData.ts";

const PostDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const post = posts.find((p) => p.id === Number(id));

    const handleDelete = () => {
        if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
            const index = posts.findIndex((p) => p.id === Number(id));
            if (index > -1) {
                posts.splice(index, 1);
                alert("삭제되었습니다.");
                navigate("/board");
            }
        }
    };

    if (!post) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <Typography variant="h4" color="blue-gray" className="mb-4">게시글을 찾을 수 없습니다.</Typography>
                <Button color="blue" onClick={() => navigate("/board")}>게시판으로 돌아가기</Button>
            </div>
        );
    }

    const isAuthor = post.authorId === currentUser.userId;

    return (
        <div className="container mx-auto px-4 py-12">
            <Card className="mx-auto max-w-[900px] shadow-sm border border-gray-100">
                <CardBody className="p-8 md:p-12">
                    {/* 상단 헤더: 카테고리, 날짜 */}
                    <div className="flex items-center justify-between mb-6">
                        <Chip
                            value={post.category}
                            className="rounded-full bg-blue-50 text-blue-700 font-bold"
                            variant="ghost"
                        />
                        <Typography variant="small" className="text-gray-400">
                            {post.createdAt}
                        </Typography>
                    </div>

                    {/* 제목 섹션 */}
                    <Typography variant="h2" color="blue-gray" className="mb-4 font-bold leading-tight">
                        {post.title}
                    </Typography>

                    {/* 작성자 정보 섹션 */}
                    <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
                        <div className="h-10 w-10 rounded-full bg-blue-gray-50 flex items-center justify-center text-blue-gray-500 font-bold">
                            {post.authorName.charAt(0)}
                        </div>
                        <div>
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                {post.authorName} {isAuthor && <span className="text-blue-500 text-xs ml-1">(작성자)</span>}
                            </Typography>
                            <Typography variant="small" className="text-gray-500 text-xs">
                                조회수 {post.views}
                            </Typography>
                        </div>
                    </div>

                    {/* 본문 섹션 */}
                    <Typography variant="paragraph" className="text-lg text-gray-700 leading-relaxed mb-12 whitespace-pre-wrap min-h-[150px]">
                        {post.content}
                    </Typography>

                    {/* 이미지 갤러리 */}
                    {post.images.length > 0 && (
                        <div className={`grid gap-4 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {post.images.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt="첨부 이미지"
                                    className="w-full h-auto rounded-xl shadow-md hover:scale-[1.02] transition-transform duration-300"
                                />
                            ))}
                        </div>
                    )}
                </CardBody>

                {/* 푸터 버튼 섹션: 양쪽 끝 정렬 */}
                <CardFooter className="bg-gray-50/50 p-6 flex flex-wrap items-center justify-between gap-4">
                    <Button
                        variant="text"
                        color="blue-gray"
                        className="flex items-center gap-2"
                        onClick={() => navigate("/board")}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        목록으로 돌아가기
                    </Button>

                    {isAuthor && (
                        <div className="flex items-center gap-3">
                            <Button
                                variant="text"
                                color="blue-gray"
                                size="sm"
                                className="font-bold underline"
                                onClick={() => navigate(`/board/edit/${post.id}`)}
                            >
                                수정하기
                            </Button>
                            <Button
                                variant="gradient"
                                color="red"
                                size="sm"
                                className="rounded-lg shadow-none hover:shadow-red-200"
                                onClick={handleDelete}
                            >
                                삭제하기
                            </Button>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};
export default PostDetail;