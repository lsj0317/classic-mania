import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { posts, currentUser } from "../../data/mockData";
import { useNavigate } from "react-router-dom";
import {useState} from "react";

const PostManage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const myPosts = posts.filter(p => p.authorId === currentUser.userId && p.title.includes(search));

    const handleDelete = (id: number) => {
        if (window.confirm("정말 삭제할까요?")) {
            const idx = posts.findIndex(p => p.id === id);
            posts.splice(idx, 1);
            window.location.reload();
        }
    };

    return (
        <Card className="shadow-sm border border-gray-100">
            <CardContent className="p-6">
                <div className="flex justify-between mb-6">
                    <h6 className="text-base font-bold text-gray-800">작성글 관리</h6>
                    <div className="w-64">
                        <Input
                            placeholder="내 글 검색"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100 pb-2">
                            <th className="pb-2 text-sm font-bold text-gray-500">제목</th>
                            <th className="pb-2 text-sm font-bold text-gray-500 text-center">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                    {myPosts.map(post => (
                        <tr key={post.id} className="border-b border-gray-50">
                            <td className="py-4"><span className="text-sm font-medium">{post.title}</span></td>
                            <td className="py-4 flex justify-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => navigate(`/board/edit/${post.id}`)}>수정</Button>
                                <Button size="sm" className="bg-black hover:bg-gray-800 text-white" onClick={() => handleDelete(post.id)}>삭제</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
};
export default PostManage;
