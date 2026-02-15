'use client';

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { posts, currentUser } from "@/data/mockData";
import { ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const PostEdit = () => {
    const params = useParams();
    const id = params?.id as string | undefined;
    const router = useRouter();

    const targetPost = posts.find((p) => p.id === Number(id));

    const [title, setTitle] = useState(targetPost?.title || "");
    const [content, setContent] = useState(targetPost?.content || "");
    const [category, setCategory] = useState<string>(targetPost?.category || "자유");
    const [previewImages, setPreviewImages] = useState<string[]>(targetPost?.images || []);

    useEffect(() => {
        if (!currentUser || currentUser.userId === "guest" || !currentUser.userId) {
            alert("로그인이 필요합니다.");
            router.push("/login");
            return;
        }

        if (targetPost && targetPost.authorId !== currentUser.userId) {
            alert("본인의 글만 수정할 수 있습니다.");
            router.push("/board");
        }
    }, [router, targetPost]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const imageUrls = Array.from(files).map((file) => URL.createObjectURL(file));
            setPreviewImages((prev) => [...prev, ...imageUrls]);
        }
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !content) {
            alert("제목과 내용을 모두 입력해 주세요.");
            return;
        }

        if (targetPost) {
            targetPost.title = title;
            targetPost.content = content;
            targetPost.category = category as typeof targetPost.category;
            targetPost.images = previewImages;

            alert("수정되었습니다.");
            router.push(`/board/${id}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="mx-auto max-w-screen-md">
                <CardContent className="p-8">
                    <h4 className="text-xl font-bold mb-2">게시글 수정</h4>
                    <p className="text-sm text-muted-foreground mb-8">
                        작성하신 내용을 수정하거나 이미지를 추가/변경할 수 있습니다.
                    </p>

                    <form onSubmit={handleUpdate} className="flex flex-col gap-6">
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
                                    placeholder="제목"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label className="mb-2 block">내용</Label>
                                <Textarea
                                    placeholder="내용"
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

                        <div className="flex gap-4 mt-8">
                            <Button variant="outline" className="flex-1" onClick={() => router.back()}>
                                취소
                            </Button>
                            <Button type="submit" className="flex-1">
                                수정완료
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default PostEdit;
