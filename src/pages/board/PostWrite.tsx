import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    Input,
    Button,
    Typography,
    Textarea,
    Select,
    Option,
} from "@material-tailwind/react";
import { posts, currentUser } from "../../data/mockData.ts";
import type {Post} from "../../types";

const PostWrite = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState<string>("자유");
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    // 페이지 접속 시 로그인 체크
    useEffect(() => {
        if (!currentUser || currentUser.userId === "guest" || !currentUser.userId) {
            alert("권한이 없습니다. 먼저 로그인해 주세요.");
            navigate("/login");
        }
    }, [navigate]);

    // 이미지 선택 시 미리보기 처리
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const imageUrls = Array.from(files).map((file) => URL.createObjectURL(file));
            setPreviewImages((prev) => [...prev, ...imageUrls]);
        }
    };

    // 글 저장 핸들러
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !content) {
            alert("제목과 내용을 모두 입력해 주세요.");
            return;
        }

        // 새로운 게시글 객체 생성
        const newPost: Post = {
            id: Math.max(...posts.map(p => p.id)) + 1,
            title,
            content,
            category: category as any,
            authorId: currentUser.userId,
            authorName: currentUser.name,
            images: previewImages,
            createdAt: new Date().toISOString().split("T")[0],
            views: 0,
        };

        posts.unshift(newPost);

        alert("글이 등록되었습니다.");
        navigate("/board");
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card color="transparent" shadow={false} className="mx-auto max-w-screen-md bg-white p-8 border border-gray-200">
                <Typography variant="h4" color="blue-gray" className="mb-2">
                    새 게시글 작성
                </Typography>
                <Typography color="gray" className="font-normal mb-8">
                    클래식 음악에 관한 소중한 이야기를 들려주세요.
                </Typography>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                        <Select
                            label="카테고리 선택"
                            value={category}
                            onChange={(val) => setCategory(val || "자유")}
                        >
                            <Option value="자유">자유</Option>
                            <Option value="정보">정보</Option>
                            <Option value="질문">질문</Option>
                            <Option value="공연후기">공연후기</Option>
                            <Option value="악기">악기</Option>
                        </Select>

                        <Input
                            size="lg"
                            label="제목을 입력하세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            crossOrigin={undefined}
                        />

                        <Textarea
                            size="lg"
                            label="내용을 입력하세요"
                            rows={12}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        {/* 이미지 업로드 영역 */}
                        <div>
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                이미지 첨부 (최대 4장)
                            </Typography>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />

                            {/* 이미지 미리보기 */}
                            <div className="grid grid-cols-4 gap-2 mt-4">
                                {previewImages.map((src, index) => (
                                    <img
                                        key={index}
                                        src={src}
                                        alt="미리보기"
                                        className="h-20 w-20 object-cover rounded-lg border"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <Button variant="outlined" fullWidth onClick={() => navigate("/board")}>
                            취소
                        </Button>
                        <Button type="submit" color="blue" fullWidth>
                            등록하기
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default PostWrite;