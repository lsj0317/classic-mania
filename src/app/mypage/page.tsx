'use client';

import { Card, CardContent } from "@/components/ui/card";
import { FileText, PenSquare, UserCircle, Heart, Award, BarChart2, User } from "lucide-react";
import MyPosts from "@/components/user/MyPosts";
import PostManage from "@/components/user/PostManage";
import { useState } from "react";
import UserManage from "@/components/user/UserManage";
import FollowedArtists from "@/components/user/FollowedArtists";
import ActivityBadges from "@/components/user/ActivityBadges";
import StatsDashboard from "@/components/user/StatsDashboard";
import { cn } from "@/lib/utils";
import { currentUser } from "@/data/mockData";
import { useRouter } from "next/navigation";

const MyPage = () => {
    const [activeTab, setActiveTab] = useState("posts");
    const router = useRouter();

    const menuItems = [
        { key: "posts", label: "내 게시글 현황", icon: FileText },
        { key: "manage", label: "작성글 관리", icon: PenSquare },
        { key: "artists", label: "팔로우 아티스트", icon: Heart },
        { key: "badges", label: "활동 배지", icon: Award },
        { key: "stats", label: "관람 통계", icon: BarChart2 },
        { key: "user", label: "회원 정보 수정", icon: UserCircle },
    ];

    return (
        <div className="container mx-auto max-w-screen-xl px-4 py-12 flex flex-col md:flex-row gap-8">
            <Card className="w-full md:w-[25%] h-max shadow-sm border border-gray-100">
                <CardContent className="p-4">
                    {/* 프로필 미니 */}
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            {currentUser.profileImage ? (
                                <img src={currentUser.profileImage} alt={currentUser.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                                    {currentUser.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate">{currentUser.nickname || currentUser.name}</p>
                            <button
                                onClick={() => router.push(`/profile/${currentUser.userId}`)}
                                className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                            >
                                <User className="h-3 w-3" />
                                공개 프로필 보기
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-2">
                        <h5 className="text-xs font-semibold text-gray-400 px-4 py-2 uppercase tracking-wide">
                            마이페이지
                        </h5>
                        <div className="flex flex-col gap-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.key}
                                        onClick={() => setActiveTab(item.key)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 cursor-pointer rounded-md transition-colors",
                                            activeTab === item.key
                                                ? "bg-blue-50 text-gray-900 font-medium"
                                                : "text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        <Icon className="h-4 w-4 flex-shrink-0" />
                                        <span className="text-sm">{item.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 콘텐츠 영역 */}
            <div className="w-full md:w-[75%]">
                {activeTab === "posts" && <MyPosts />}
                {activeTab === "manage" && <PostManage />}
                {activeTab === "artists" && <FollowedArtists />}
                {activeTab === "badges" && <ActivityBadges />}
                {activeTab === "stats" && <StatsDashboard />}
                {activeTab === "user" && <UserManage />}
            </div>
        </div>
    );
};

export default MyPage;
