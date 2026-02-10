import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { posts, currentUser } from "../../data/mockData.ts";
import type {Post} from "../../types";
import { ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const PostWrite = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState<string>("자유");
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    useEffect(() => {
        if (!currentUser || currentUser.userId === "guest" || !currentUser.userId) {
            alert("권한이 없습니다. 먼저 로그인해 주세요.");
            navigate("/login");
        }
    }, [navigate]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const imageUrls = Array.from(files).map((file) => URL.createObjectURL(file));
            setPreviewImages((prev) => [...prev, ...imageUrls]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !content) {
            alert("제목과 내용을 모두 입력해 주세요.");
            return;
        }

        const newPost: Post = {
            id: Math.max(...posts.map(p => p.id)) + 1,
            title,
            content,
            category: category as Post["category"],
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
            <Card className="mx-auto max-w-screen-md">
                <CardContent className="p-8">
                    <h4 className="text-xl font-bold mb-2">새 게시글 작성</h4>
                    <p className="text-muted-foreground mb-8">
                        클래식 음악에 관한 소중한 이야기를 들려주세요.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            <div>
                                <Label className="mb-2 block">카테고리 선택</Label>
                                <Select value={category} onValueChange={(val) => setCategory(val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="카테고리 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="자유">자유</SelectItem>
                                        <SelectItem value="정보">정보</SelectItem>
                                        <SelectItem value="질문">질문</SelectItem>
                                        <SelectItem value="공연후기">공연후기</SelectItem>
                                        <SelectItem value="악기">악기</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="mb-2 block">제목</Label>
                                <Input
                                    placeholder="제목을 입력하세요"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label className="mb-2 block">내용</Label>
                                <Textarea
                                    placeholder="내용을 입력하세요"
                                    rows={12}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>

                            {/* 이미지 업로드 영역 */}
                            <div className="mt-4">
                                <Label className="mb-3 block font-bold">이미지 첨부 (최대 4장)</Label>

                                <div className="grid grid-cols-4 gap-4">
                                    {previewImages.map((src, index) => (
                                        <div key={index} className="relative aspect-square group">
                                            <img
                                                src={src}
                                                alt={`첨부이미지 ${index + 1}`}
                                                className="h-full w-full object-cover border rounded grayscale group-hover:grayscale-0 transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setPreviewImages(prev => prev.filter((_, i) => i !== index))}
                                                className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-[10px] flex items-center justify-center shadow-lg"
                                            >
                                                x
                                            </button>
                                        </div>
                                    ))}

                                    {previewImages.length < 4 && (
                                        <label className="cursor-pointer aspect-square border-2 border-dashed rounded flex flex-col items-center justify-center hover:bg-accent transition-colors group">
                                            <ImageIcon className="h-8 w-8 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
                                            <span className="text-[10px] text-muted-foreground mt-2 font-bold uppercase tracking-tighter">
                                                Upload
                                            </span>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}

                                    {Array.from({ length: Math.max(0, 3 - previewImages.length) }).map((_, i) => (
                                        <div key={`empty-${i}`} className="aspect-square bg-muted/50 border rounded flex items-center justify-center">
                                            <ImageIcon className="h-6 w-6 text-muted-foreground/10" />
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-3 text-muted-foreground text-[11px]">
                                    * 권장 사이즈: 정사각형 (1:1), 최대 5MB 이하
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-4">
                            <Button variant="outline" className="flex-1" onClick={() => navigate("/board")}>
                                취소
                            </Button>
                            <Button type="submit" className="flex-1">
                                등록하기
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default PostWrite;
