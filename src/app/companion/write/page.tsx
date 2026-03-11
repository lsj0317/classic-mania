'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCompanionStore } from "@/stores/companionStore";
import { currentUser } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import type { CompanionGender } from "@/types";

const AREA_OPTIONS = ["서울", "부산", "대구", "대전", "광주", "인천", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
const GENDER_OPTIONS: CompanionGender[] = ["무관", "남성", "여성"];
const AGE_OPTIONS = ["무관", "10대", "20대", "30대", "40대", "50대 이상"];

const CompanionWritePage = () => {
    const router = useRouter();
    const { addPost } = useCompanionStore();

    const [form, setForm] = useState({
        title: "",
        performanceTitle: "",
        performanceDate: "",
        venue: "",
        area: "서울",
        content: "",
        preferGender: "무관" as CompanionGender,
        maxCompanions: 1,
        ageRange: "무관",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isLoggedIn = currentUser && currentUser.userId !== "" && currentUser.userId !== "guest";

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!form.title.trim()) newErrors.title = "제목을 입력해주세요.";
        if (!form.performanceTitle.trim()) newErrors.performanceTitle = "공연명을 입력해주세요.";
        if (!form.performanceDate) newErrors.performanceDate = "공연 날짜를 입력해주세요.";
        if (!form.venue.trim()) newErrors.venue = "공연장을 입력해주세요.";
        if (!form.content.trim()) newErrors.content = "내용을 입력해주세요.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!isLoggedIn) {
            router.push("/login");
            return;
        }
        if (!validate()) return;

        addPost({
            ...form,
            authorId: currentUser.userId,
            authorName: currentUser.nickname || currentUser.name,
        });
        router.push("/companion");
    };

    const update = (key: string, value: string | number) =>
        setForm(prev => ({ ...prev, [key]: value }));

    return (
        <div className="container mx-auto px-4 py-6 max-w-2xl">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-6"
            >
                <ChevronLeft className="h-4 w-4" />
                돌아가기
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-6">동행 모집하기</h2>

            <div className="space-y-5">
                {/* 제목 */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">제목 *</label>
                    <Input
                        placeholder="예) 베를린 필 R석 동행 구합니다"
                        value={form.title}
                        onChange={e => update("title", e.target.value)}
                        className={errors.title ? "border-red-400" : ""}
                    />
                    {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>

                {/* 공연 정보 */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded space-y-4">
                    <h3 className="text-sm font-bold text-gray-700">공연 정보</h3>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">공연명 *</label>
                        <Input
                            placeholder="예) 베를린 필하모닉 내한공연"
                            value={form.performanceTitle}
                            onChange={e => update("performanceTitle", e.target.value)}
                            className={errors.performanceTitle ? "border-red-400" : ""}
                        />
                        {errors.performanceTitle && <p className="text-xs text-red-500 mt-1">{errors.performanceTitle}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">공연 날짜 *</label>
                            <Input
                                type="date"
                                value={form.performanceDate}
                                onChange={e => update("performanceDate", e.target.value)}
                                className={errors.performanceDate ? "border-red-400" : ""}
                            />
                            {errors.performanceDate && <p className="text-xs text-red-500 mt-1">{errors.performanceDate}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">지역</label>
                            <select
                                value={form.area}
                                onChange={e => update("area", e.target.value)}
                                className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                            >
                                {AREA_OPTIONS.map(a => <option key={a}>{a}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">공연장 *</label>
                        <Input
                            placeholder="예) 롯데콘서트홀"
                            value={form.venue}
                            onChange={e => update("venue", e.target.value)}
                            className={errors.venue ? "border-red-400" : ""}
                        />
                        {errors.venue && <p className="text-xs text-red-500 mt-1">{errors.venue}</p>}
                    </div>
                </div>

                {/* 동행 조건 */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded space-y-4">
                    <h3 className="text-sm font-bold text-gray-700">동행 조건</h3>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">모집 인원</label>
                            <select
                                value={form.maxCompanions}
                                onChange={e => update("maxCompanions", Number(e.target.value))}
                                className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                            >
                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}명</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">선호 성별</label>
                            <select
                                value={form.preferGender}
                                onChange={e => update("preferGender", e.target.value as CompanionGender)}
                                className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                            >
                                {GENDER_OPTIONS.map(g => <option key={g}>{g}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">선호 연령대</label>
                            <select
                                value={form.ageRange}
                                onChange={e => update("ageRange", e.target.value)}
                                className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                            >
                                {AGE_OPTIONS.map(a => <option key={a}>{a}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 내용 */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">내용 *</label>
                    <textarea
                        placeholder="동행 모집 내용을 작성해주세요. 좌석 정보, 만남 장소, 연락 방법 등을 포함하면 좋습니다."
                        value={form.content}
                        onChange={e => update("content", e.target.value)}
                        rows={6}
                        className={`w-full px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-gray-400 ${errors.content ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
                </div>

                <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => router.back()}>
                        취소
                    </Button>
                    <Button className="flex-1 bg-black text-white" onClick={handleSubmit}>
                        등록하기
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CompanionWritePage;