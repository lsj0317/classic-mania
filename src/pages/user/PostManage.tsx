import { Card, Typography, Button, Input } from "@material-tailwind/react";
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
        <Card className="p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between mb-6">
                <Typography variant="h6" className="font-bold">작성글 관리</Typography>
                <div className="w-64"><Input label="내 글 검색" onChange={(e) => setSearch(e.target.value)} /></div>
            </div>
            <table className="w-full text-left">
                <thead><tr className="border-b border-gray-100 pb-2"><th className="pb-2 text-sm font-bold text-gray-500">제목</th><th className="pb-2 text-sm font-bold text-gray-500 text-center">관리</th></tr></thead>
                <tbody>
                {myPosts.map(post => (
                    <tr key={post.id} className="border-b border-gray-50">
                        <td className="py-4"><Typography variant="small" className="font-medium">{post.title}</Typography></td>
                        <td className="py-4 flex justify-center gap-2">
                            <Button size="sm" variant="outlined" onClick={() => navigate(`/board/edit/${post.id}`)}>수정</Button>
                            <Button size="sm" color="black" onClick={() => handleDelete(post.id)}>삭제</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Card>
    );
};
export default PostManage;