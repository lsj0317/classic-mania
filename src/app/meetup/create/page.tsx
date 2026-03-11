'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMeetupStore } from "@/stores/meetupStore";
import { currentUser } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import type { MeetupType } from "@/types";

const TYPE_OPTIONS: MeetupType[] = ["정기모임", "번개", "온라인"];
const AREA_OPTIONS = ["서울", "부산", "대구", "대전", "광주", "인천", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주", "전국"];
const GENRE_OPTIONS = ["클래식 전반", "교향곡", "피아노", "바이올린/현악", "오페라", "바로크", "낭만주의", "현대음악", "실내악", "기타"];

const MeetupCreatePage = () => {
    const router = useRouter();
    const { addMeetup } = useMeetupStore();

    const [form, setForm] = useState({
        title: "",
        description: "",
        type: "정기모임" as MeetupType,
        location: "",
        area: "서울",
        meetDate: "",
        meetTime: "14:00",
        maxMembers: 10,
        genre: "",
        isOnline: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isLoggedIn = currentUser && currentUser.userId !== "" && currentUser.userId !== "guest";

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.title.trim()) e.title = "제목을 입력해주세요.";
        if (!form.description.trim()) e.description = "소모임 소개를 입력해주세요.";
        if (!form.location.trim()) e.location = "장소를 입력해주세요.";
        if (!form.meetDate) e.meetDate = "모임 날짜를 입력해주세요.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = () => {
        if (!isLoggedIn) { router.push("/login"); return; }
        if (!validate()) return;

        const isOnline = form.type === "온라인";
        addMeetup({
            ...form,
            isOnline,
            area: isOnline ? "전국" : form.area,
            hostId: currentUser.userId,
            hostName: currentUser.nickname || currentUser.name,
        });
        router.push("/meetup");
    };

    const update = (key: string, value: string | number | boolean) =>
        setForm(prev => ({ ...prev, [key]: value }));

    const handleTypeChange = (type: MeetupType) => {
        update("type", type);
        if (type === "온라인") {
            update("location", "온라인 (추후 안내)");
            update("isOnline", true);
        } else {
            update("location", "");
            update("isOnline", false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-2xl">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-6"
            >
                <ChevronLeft className="h-4 w-4" />
                돌아가기
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-6">소모임 개설하기</h2>

            <div className="space-y-5">
                {/* 제목 */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">소모임 이름 *</label>
                    <Input
                        placeholder="예) 말러 교향곡 감상 정기모임"
                        value={form.title}
                        onChange={e => update("title", e.target.value)}
                        className={errors.title ? "border-red-400" : ""}
                    />
                    {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>

                {/* 모임 유형 */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">모임 유형 *</label>
                    <div className="flex gap-2">
                        {TYPE_OPTIONS.map(type => (
                            <button
                                key={type}
                                onClick={() => handleTypeChange(type)}
                                className={`flex-1 py-2.5 text-sm font-medium border rounded transition-all ${form.type === type ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 소개 */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">소모임 소개 *</label>
                    <textarea
                        placeholder="어떤 소모임인지, 활동 내용, 참여 방법 등을 자세히 작성해주세요."
                        value={form.description}
                        onChange={e => update("description", e.target.value)}
                        rows={5}
                        className={`w-full px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-gray-400 ${errors.description ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                </div>

                {/* 모임 정보 */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded space-y-4">
                    <h3 className="text-sm font-bold text-gray-700">모임 정보</h3>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">날짜 *</label>
                            <Input
                                type="date"
                                value={form.meetDate}
                                onChange={e => update("meetDate", e.target.value)}
                                className={errors.meetDate ? "border-red-400" : ""}
                            />
                            {errors.meetDate && <p className="text-xs text-red-500 mt-1">{errors.meetDate}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">시간</label>
                            <Input
                                type="time"
                                value={form.meetTime}
                                onChange={e => update("meetTime", e.target.value)}
                            />
                        </div>
                    </div>

                    {form.type !== "온라인" && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">지역</label>
                            <select
                                value={form.area}
                                onChange={e => update("area", e.target.value)}
                                className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                            >
                                {AREA_OPTIONS.filter(a => a !== "전국").map(a => <option key={a}>{a}</option>)}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">장소 *</label>
                        <Input
                            placeholder={form.type === "온라인" ? "예) Zoom, Discord" : "예) 서울 마포구 합정동 카페"}
                            value={form.location}
                            onChange={e => update("location", e.target.value)}
                            className={errors.location ? "border-red-400" : ""}
                        />
                        {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">최대 인원</label>
                            <select
                                value={form.maxMembers}
                                onChange={e => update("maxMembers", Number(e.target.value))}
                                className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                            >
                                {[3, 5, 8, 10, 15, 20, 30, 50].map(n => <option key={n} value={n}>{n}명</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">주요 장르/주제</label>
                            <select
                                value={form.genre}
                                onChange={e => update("genre", e.target.value)}
                                className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                            >
                                <option value="">선택</option>
                                {GENRE_OPTIONS.map(g => <option key={g}>{g}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => router.back()}>
                        취소
                    </Button>
                    <Button className="flex-1 bg-black text-white" onClick={handleSubmit}>
                        개설하기
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MeetupCreatePage;
