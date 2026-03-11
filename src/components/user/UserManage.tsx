import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "../../data/mockData";
import { useRouter } from "next/navigation";
import { PenSquare, User, Type, ImageIcon, Check } from "lucide-react";
import ProfileAvatar from "./ProfileAvatar";
import type { ProfileIconType } from "@/types";

const UserManage = () => {
    const router = useRouter();

    const [nickName, setNickName] = useState(currentUser.nickname || currentUser.name);
    const [password, setPassword] = useState("");
    const [profileIconType, setProfileIconType] = useState<ProfileIconType>(
        currentUser.profileIconType || "default"
    );
    const [profilePreview, setProfilePreview] = useState(currentUser.profileImage || "");

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nickName) {
            alert("닉네임을 입력해 주세요.");
            return;
        }

        currentUser.nickname = nickName;
        currentUser.profileIconType = profileIconType;
        if (profileIconType === "image") {
            currentUser.profileImage = profilePreview;
        } else {
            currentUser.profileImage = "";
        }
        alert("회원 정보가 수정되었습니다.");
        window.location.reload();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setProfilePreview(result);
                setProfileIconType("image");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleWithdrawal = () => {
        const confirmFirst = window.confirm("정말로 탈퇴하시겠습니까?");
        if (confirmFirst) {
            const confirmSecond = window.confirm("탈퇴 시 모든 데이터가 삭제됩니다. 계속하시겠습니까?");
            if (confirmSecond) {
                alert("그동안 Classic Mania를 이용해 주셔서 감사합니다.");
                currentUser.userId = "";
                currentUser.name = "";
                router.push("/");
                window.location.reload();
            }
        }
    };

    const profileOptions: { type: ProfileIconType; label: string; description: string; icon: React.ReactNode }[] = [
        {
            type: "default",
            label: "기본 아이콘",
            description: "기본 유저 아이콘을 사용합니다",
            icon: <User className="h-5 w-5" />,
        },
        {
            type: "initial",
            label: "이니셜",
            description: `닉네임의 첫 글자 (${nickName ? nickName.charAt(0).toUpperCase() : "?"})`,
            icon: <Type className="h-5 w-5" />,
        },
        {
            type: "image",
            label: "이미지 업로드",
            description: "원하는 이미지를 프로필로 사용합니다",
            icon: <ImageIcon className="h-5 w-5" />,
        },
    ];

    return (
        <Card className="shadow-sm border border-gray-100 bg-white">
            <CardContent className="p-8">
                <h5 className="text-lg font-bold text-gray-800 mb-2">
                    회원 정보 수정
                </h5>
                <p className="text-gray-500 mb-8">
                    Classic Mania에서 사용하는 내 정보를 관리합니다.
                </p>

                <form onSubmit={handleUpdate} className="flex flex-col gap-8">
                    {/* 프로필 미리보기 */}
                    <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-xl">
                        <ProfileAvatar
                            name={currentUser.name}
                            nickname={nickName}
                            profileImage={profilePreview}
                            profileIconType={profileIconType}
                            size="xl"
                            className="ring-4 ring-white shadow-lg"
                        />
                        <div className="text-center">
                            <p className="font-bold text-lg">{nickName || currentUser.name}</p>
                            <p className="text-sm text-gray-500">@{currentUser.userId}</p>
                        </div>
                    </div>

                    {/* 프로필 아이콘 설정 */}
                    <div>
                        <Label className="font-bold text-gray-800 mb-3 block text-base">
                            프로필 아이콘 설정
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {profileOptions.map((opt) => (
                                <button
                                    key={opt.type}
                                    type="button"
                                    onClick={() => setProfileIconType(opt.type)}
                                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                                        profileIconType === opt.type
                                            ? "border-blue-500 bg-blue-50 shadow-sm"
                                            : "border-gray-200 hover:border-gray-300 bg-white"
                                    }`}
                                >
                                    {profileIconType === opt.type && (
                                        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                            <Check className="h-3 w-3 text-white" />
                                        </div>
                                    )}
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                        profileIconType === opt.type ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                                    }`}>
                                        {opt.icon}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold">{opt.label}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* 이미지 업로드 (이미지 타입 선택 시) */}
                        {profileIconType === "image" && (
                            <div className="mt-4 flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                    {profilePreview ? (
                                        <img src={profilePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <ImageIcon className="h-6 w-6 text-gray-300" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="profile-upload"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                                    >
                                        <PenSquare className="h-4 w-4" />
                                        이미지 선택
                                        <input
                                            id="profile-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        권장: 정사각형 이미지, 최대 5MB
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* 아이디 */}
                    <div className="space-y-2 max-w-md">
                        <Label className="font-bold text-gray-800">아이디</Label>
                        <Input
                            disabled
                            value={currentUser.userId}
                            className="h-11 bg-gray-50"
                        />
                        <p className="text-sm text-gray-500">아이디는 변경할 수 없습니다.</p>
                    </div>

                    {/* 닉네임 수정 */}
                    <div className="space-y-2 max-w-md">
                        <Label className="font-bold text-gray-800">닉네임</Label>
                        <Input
                            placeholder="변경할 닉네임을 입력하세요"
                            value={nickName}
                            onChange={(e) => setNickName(e.target.value)}
                            className="h-11 focus:border-blue-500"
                        />
                    </div>

                    {/* 비밀번호 */}
                    <div className="space-y-2 max-w-md">
                        <Label className="font-bold text-gray-800">새 비밀번호 (선택)</Label>
                        <Input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-11 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex gap-4 mt-4 max-w-md">
                        <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">
                            변경사항 저장
                        </Button>
                    </div>
                </form>

                <Separator className="my-10" />

                {/* 회원 탈퇴 섹션 */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-100">
                    <div>
                        <h6 className="text-base font-bold text-red-600">회원탈퇴</h6>
                        <p className="text-sm text-gray-700">
                            회원탈퇴를 하시면 모든 정보가 삭제됩니다 정말로 탈퇴 하시겠습니까?
                        </p>
                    </div>
                    <Button variant="ghost" className="font-bold text-black" onClick={handleWithdrawal}>
                        예(탈퇴하기)
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default UserManage;
