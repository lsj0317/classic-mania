import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import {PhotoIcon} from "@heroicons/react/16/solid";

const PostEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 수정할 원본 데이터 찾기
    const targetPost = posts.find((p) => p.id === Number(id));

    // 상태 관리 (기존 데이터로 초기화)
    const [title, setTitle] = useState(targetPost?.title || "");
    const [content, setContent] = useState(targetPost?.content || "");
    const [category, setCategory] = useState<string>(targetPost?.category || "자유");

    // [추가] 기존 이미지를 초기값으로 설정
    const [previewImages, setPreviewImages] = useState<string[]>(targetPost?.images || []);

    // 권한 체크: 로그인 여부 및 작성자 본인 확인
    useEffect(() => {
        if (!currentUser || currentUser.userId === "guest" || !currentUser.userId) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }

        if (targetPost && targetPost.authorId !== currentUser.userId) {
            alert("본인의 글만 수정할 수 있습니다.");
            navigate("/board");
        }
    }, [navigate, targetPost]);

    // 이미지 선택 및 미리보기 핸들러 (PostWrite와 동일 로직)
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const imageUrls = Array.from(files).map((file) => URL.createObjectURL(file));
            // 기존 이미지 뒤에 새 이미지 추가
            setPreviewImages((prev) => [...prev, ...imageUrls]);
        }
    };

    // 이미지 개별 삭제 기능 (선택 사항 - 편의를 위해 추가)
    const removeImage = (index: number) => {
        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    };

    // 수정 완료 핸들러
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !content) {
            alert("제목과 내용을 모두 입력해 주세요.");
            return;
        }

        if (targetPost) {
            // 원본 객체 업데이트
            targetPost.title = title;
            targetPost.content = content;
            targetPost.category = category as any;
            targetPost.images = previewImages; // 업데이트된 이미지 목록 저장

            alert("수정되었습니다.");
            navigate(`/board/${id}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card color="transparent" shadow={false} className="mx-auto max-w-screen-md bg-white p-8 border border-gray-200 rounded-none">
                <Typography variant="h4" color="blue-gray" className="mb-2 font-bold">
                    게시글 수정
                </Typography>
                <Typography color="gray" className="font-normal mb-8 text-sm">
                    작성하신 내용을 수정하거나 이미지를 추가/변경할 수 있습니다.
                </Typography>

                <form onSubmit={handleUpdate} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                        <Select
                            label="카테고리 선택"
                            value={category}
                            onChange={(val) => setCategory(val || "자유")}
                            className="!rounded-none"
                            containerProps={{ className: "!rounded-none" }}
                        >
                            <Option value="자유">자유</Option>
                            <Option value="정보">정보</Option>
                            <Option value="질문">질문</Option>
                            <Option value="공연후기">공연후기</Option>
                            <Option value="악기">악기</Option>
                        </Select>

                        <Input
                            size="lg"
                            label="제목"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="!rounded-none"
                            containerProps={{ className: "!rounded-none" }}
                            crossOrigin={undefined}
                        />

                        <Textarea
                            size="lg"
                            label="내용"
                            rows={12}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="!rounded-none"
                            containerProps={{ className: "!rounded-none" }}
                        />

                        {/* 이미지 업로드 영역 */}
                        <div className="mt-4">
                            <Typography variant="small" color="blue-gray" className="mb-3 font-bold">
                                이미지 첨부 (최대 4장)
                            </Typography>

                            <div className="grid grid-cols-4 gap-4">
                                {/* 이미지가 있는 경우 미리보기 표시 */}
                                {previewImages.map((src, index) => (
                                    <div key={index} className="relative aspect-square group">
                                        <img
                                            src={src}
                                            alt={`첨부이미지 ${index + 1}`}
                                            className="h-full w-full object-cover border border-gray-200 rounded-none grayscale group-hover:grayscale-0 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setPreviewImages(prev => prev.filter((_, i) => i !== index))}
                                            className="absolute -top-2 -right-2 bg-black text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center shadow-lg"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}

                                {/* 4장 미만일 때만 업로드 버튼 표시 */}
                                {previewImages.length < 4 && (
                                    <label className="cursor-pointer aspect-square border-2 border-dashed border-gray-200 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors group">
                                        <PhotoIcon className="h-8 w-8 text-gray-300 group-hover:text-gray-500 transition-colors" />
                                        <Typography className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">
                                            Upload
                                        </Typography>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}

                                {/* 빈 칸 유지 (4장 구성을 위한 Placeholder) */}
                                {Array.from({ length: Math.max(0, 3 - previewImages.length) }).map((_, i) => (
                                    <div key={`empty-${i}`} className="aspect-square bg-gray-50/50 border border-gray-100 flex items-center justify-center">
                                        <PhotoIcon className="h-6 w-6 text-gray-100" />
                                    </div>
                                ))}
                            </div>
                            <Typography variant="small" className="mt-3 text-gray-400 text-[11px]">
                                * 권장 사이즈: 정사각형 (1:1), 최대 5MB 이하
                            </Typography>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => navigate(-1)}
                            className="rounded-none border-black text-black"
                        >
                            취소
                        </Button>
                        <Button
                            type="submit"
                            color="black"
                            fullWidth
                            className="rounded-none"
                        >
                            수정완료
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default PostEdit;