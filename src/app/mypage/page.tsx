'use client';

import { Card, CardContent } from "@/components/ui/card";
import { FileText, PenSquare, UserCircle, Heart } from "lucide-react";
import MyPosts from "@/components/user/MyPosts";
import PostManage from "@/components/user/PostManage";
import { useState } from "react";
import UserManage from "@/components/user/UserManage";
import FollowedArtists from "@/components/user/FollowedArtists";
import { cn } from "@/lib/utils";

const MyPage = () => {
    const [activeTab, setActiveTab] = useState("posts"); // 현재 활성화된 메뉴 상태

    const menuItems = [
        { key: "posts", label: "내 게시글 현황", icon: FileText },
        { key: "manage", label: "작성글 관리", icon: PenSquare },
        { key: "artists", label: "팔로우 아티스트", icon: Heart },
        { key: "user", label: "회원 정보 수정", icon: UserCircle },
    ];

    return (
        <div className="container mx-auto max-w-screen-xl px-4 py-12 flex flex-col md:flex-row gap-8">
            <Card className="w-full md:w-[30%] h-max shadow-sm border border-gray-100">
                <CardContent className="p-4">
                    <h5 className="text-lg font-bold text-gray-800 mb-4 px-4">
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
                                    <Icon className="h-5 w-5" />
                                    <span className="text-sm">{item.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* SECTION B: 콘텐츠 (70%) */}
            <div className="w-full md:w-[70%]">
                {activeTab === "posts" && <MyPosts />}
                {activeTab === "manage" && <PostManage />}
                {activeTab === "artists" && <FollowedArtists />}
                {activeTab === "user" && <UserManage />}
            </div>
        </div>
    );
};

export default MyPage;
