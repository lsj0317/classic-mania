'use client';

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { posts, currentUser } from "@/data/mockData";
import type { Post, MentionedPerformance } from "@/types";
import { ImageIcon, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { usePerformanceStore } from "@/stores/performanceStore";

const PostWrite = () => {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState<string>("자유");
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [mentionedPerformances, setMentionedPerformances] = useState<MentionedPerformance[]>([]);

    // @mention state
    const [showMentionDropdown, setShowMentionDropdown] = useState(false);
    const [mentionQuery, setMentionQuery] = useState("");
    const [mentionStartIndex, setMentionStartIndex] = useState(-1);
    const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Performance store
    const { performances, fetchList } = usePerformanceStore();

    useEffect(() => {
        fetchList();
    }, [fetchList]);

    useEffect(() => {
        if (!currentUser || currentUser.userId === "guest" || !currentUser.userId) {
            alert("권한이 없습니다. 먼저 로그인해 주세요.");
            router.push("/login");
        }
    }, [router]);

    // Filter performances based on mention query
    const filteredPerformances = mentionQuery.length >= 2
        ? performances.filter(p =>
            p.title.toLowerCase().includes(mentionQuery.toLowerCase()) ||
            p.place.toLowerCase().includes(mentionQuery.toLowerCase())
        ).slice(0, 8)
        : [];

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        const cursorPos = e.target.selectionStart;
        setContent(value);

        // Check if we should show the mention dropdown
        const textBeforeCursor = value.substring(0, cursorPos);
        const atIndex = textBeforeCursor.lastIndexOf('@');

        if (atIndex >= 0) {
            const textAfterAt = textBeforeCursor.substring(atIndex + 1);
            // Only trigger if there's no space in the text after @
            if (!textAfterAt.includes('\n') && textAfterAt.length >= 2) {
                setMentionQuery(textAfterAt);
                setMentionStartIndex(atIndex);
                setShowMentionDropdown(true);
                setSelectedMentionIndex(0);
                return;
            }
        }

        setShowMentionDropdown(false);
        setMentionQuery("");
    };

    const handleMentionSelect = useCallback((perf: typeof performances[0]) => {
        const beforeMention = content.substring(0, mentionStartIndex);
        const afterMention = content.substring(mentionStartIndex + mentionQuery.length + 1);
        const mentionText = `@${perf.title}`;
        const newContent = beforeMention + mentionText + ' ' + afterMention;

        setContent(newContent);
        setShowMentionDropdown(false);
        setMentionQuery("");

        // Add to mentioned performances
        const alreadyMentioned = mentionedPerformances.some(m => m.id === perf.id);
        if (!alreadyMentioned) {
            setMentionedPerformances(prev => [...prev, {
                id: perf.id,
                title: perf.title,
                poster: perf.poster,
                position: mentionStartIndex,
            }]);
        }

        // Focus back on textarea
        setTimeout(() => {
            if (textareaRef.current) {
                const newPos = beforeMention.length + mentionText.length + 1;
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(newPos, newPos);
            }
        }, 0);
    }, [content, mentionStartIndex, mentionQuery, mentionedPerformances]);

    const handleContentKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!showMentionDropdown || filteredPerformances.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedMentionIndex(prev => Math.min(prev + 1, filteredPerformances.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedMentionIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            handleMentionSelect(filteredPerformances[selectedMentionIndex]);
        } else if (e.key === 'Escape') {
            setShowMentionDropdown(false);
        }
    };

    const removeMention = (perfId: string) => {
        setMentionedPerformances(prev => prev.filter(m => m.id !== perfId));
    };

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
            mentionedPerformances: mentionedPerformances.length > 0 ? mentionedPerformances : undefined,
        };

        posts.unshift(newPost);
        alert("글이 등록되었습니다.");
        router.push("/board");
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

                            <div className="relative">
                                <Label className="mb-2 block">내용</Label>
                                <p className="text-xs text-muted-foreground mb-2">
                                    공연후기 작성 시 <span className="font-bold text-primary">@공연명</span>을 입력하면 공연 정보를 태그할 수 있습니다.
                                </p>
                                <textarea
                                    ref={textareaRef}
                                    placeholder="내용을 입력하세요 (@ 입력 후 2글자 이상 입력하면 공연 정보를 검색할 수 있습니다)"
                                    rows={12}
                                    value={content}
                                    onChange={handleContentChange}
                                    onKeyDown={handleContentKeyDown}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />

                                {/* @mention dropdown */}
                                {showMentionDropdown && filteredPerformances.length > 0 && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute z-50 left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-xl max-h-64 overflow-y-auto"
                                    >
                                        <div className="p-2 border-b border-border">
                                            <p className="text-xs text-muted-foreground font-semibold">공연 검색 결과</p>
                                        </div>
                                        {filteredPerformances.map((perf, idx) => (
                                            <div
                                                key={perf.id}
                                                className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
                                                    idx === selectedMentionIndex ? 'bg-accent' : 'hover:bg-accent/50'
                                                }`}
                                                onClick={() => handleMentionSelect(perf)}
                                            >
                                                {perf.poster ? (
                                                    <img
                                                        src={perf.poster}
                                                        alt={perf.title}
                                                        className="w-10 h-13 object-cover rounded flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-13 bg-muted rounded flex items-center justify-center flex-shrink-0">
                                                        <ImageIcon className="h-4 w-4 text-muted-foreground/30" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{perf.title}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{perf.place} | {perf.period}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 태그된 공연 목록 */}
                            {mentionedPerformances.length > 0 && (
                                <div className="mt-2">
                                    <Label className="mb-2 block text-sm font-bold">태그된 공연</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {mentionedPerformances.map((perf) => (
                                            <div
                                                key={perf.id}
                                                className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5"
                                            >
                                                {perf.poster && (
                                                    <img src={perf.poster} alt="" className="w-5 h-5 rounded object-cover" />
                                                )}
                                                <span className="text-xs font-medium text-blue-700">{perf.title}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeMention(perf.id)}
                                                    className="text-blue-400 hover:text-blue-600"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 이미지 업로드 영역 */}
                            <div className="mt-4">
                                <Label className="mb-3 block font-bold">이미지 첨부 (최대 4장)</Label>

                                <div className="grid grid-cols-4 gap-4">
                                    {previewImages.map((src, index) => (
                                        <div key={index} className="relative aspect-square group">
                                            <img
                                                src={src}
                                                alt={`첨부이미지 ${index + 1}`}
                                                className="h-full w-full object-cover border rounded transition-all"
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
                            <Button variant="outline" className="flex-1" onClick={() => router.push("/board")}>
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
