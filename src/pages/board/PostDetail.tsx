import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
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
                <h2 className="text-2xl font-bold text-gray-800 mb-4">게시글을 찾을 수 없습니다.</h2>
                <Button onClick={() => navigate("/board")}>게시판으로 돌아가기</Button>
            </div>
        );
    }

    const isAuthor = post.authorId === currentUser.userId;

    return (
        <div className="container mx-auto px-4 py-12">
            <Card className="mx-auto max-w-[900px] shadow-sm border border-gray-100">
                <CardContent className="p-8 md:p-12">
                    {/* 상단 헤더: 카테고리, 날짜 */}
                    <div className="flex items-center justify-between mb-6">
                        <Badge
                            variant="secondary"
                            className="rounded-full bg-blue-50 text-gray-700 font-bold"
                        >
                            {post.category}
                        </Badge>
                        <span className="text-sm text-gray-400">
                            {post.createdAt}
                        </span>
                    </div>

                    {/* 제목 섹션 */}
                    <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
                        {post.title}
                    </h1>

                    {/* 작성자 정보 섹션 */}
                    <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                            {post.authorName.charAt(0)}
                        </div>
                        <div>
                            <span className="text-sm font-bold text-gray-800 block">
                                {post.authorName} {isAuthor && <span className="text-gray-500 text-xs ml-1">(작성자)</span>}
                            </span>
                            <span className="text-xs text-gray-500">
                                조회수 {post.views}
                            </span>
                        </div>
                    </div>

                    {/* 본문 섹션 */}
                    <p className="text-lg text-gray-700 leading-relaxed mb-12 whitespace-pre-wrap min-h-[150px]">
                        {post.content}
                    </p>

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
                </CardContent>

                {/* 푸터 버튼 섹션: 양쪽 끝 정렬 */}
                <CardFooter className="bg-gray-50/50 p-6 flex flex-wrap items-center justify-between gap-4">
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 text-gray-600"
                        onClick={() => navigate("/board")}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        목록으로 돌아가기
                    </Button>

                    {isAuthor && (
                        <div className="flex items-center gap-3">
                            <Button
                                variant="link"
                                size="sm"
                                className="font-bold underline text-black"
                                onClick={() => navigate(`/board/edit/${post.id}`)}
                            >
                                수정하기
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                className="bg-black text-white rounded-lg shadow-none"
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
