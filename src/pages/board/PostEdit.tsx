import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Input, Button, Typography, Textarea, Select, Option } from "@material-tailwind/react";
import { posts } from "../../data/mockData.ts";

const PostEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 수정할 데이터 찾기
    const targetPost = posts.find(p => p.id === Number(id));

    const [title, setTitle] = useState(targetPost?.title || "");
    const [content, setContent] = useState(targetPost?.content || "");
    const [category, setCategory] = useState(targetPost?.category || "자유");

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        if (targetPost) {
            targetPost.title = title;
            targetPost.content = content;
            targetPost.category = category as any;

            alert("수정되었습니다.");
            navigate(`/board/${id}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="mx-auto max-w-screen-md p-8 border border-gray-200">
                <Typography variant="h4" color="blue-gray" className="mb-6">게시글 수정</Typography>
                <form onSubmit={handleUpdate} className="flex flex-col gap-6">
                    <Select label="카테고리" value={category} onChange={(val) => setCategory(val || "자유")}>
                        <Option value="자유">자유</Option>
                        <Option value="정보">정보</Option>
                        <Option value="질문">질문</Option>
                    </Select>
                    <Input label="제목" value={title} onChange={(e) => setTitle(e.target.value)} crossOrigin={undefined} />
                    <Textarea label="내용" rows={12} value={content} onChange={(e) => setContent(e.target.value)} />
                    <div className="flex gap-4">
                        <Button variant="outlined" fullWidth onClick={() => navigate(-1)}>취소</Button>
                        <Button type="submit" color="blue" fullWidth>수정완료</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default PostEdit;