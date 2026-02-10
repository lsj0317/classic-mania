// src/pages/user/UserManage.tsx
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "../../data/mockData";
import { useNavigate } from "react-router-dom";
import { PenSquare } from "lucide-react";

const UserManage = () => {
    const navigate = useNavigate();

    // 현재 로그인된 유저 정보를 초기값으로 설정
    const [nickName, setNickName] = useState(currentUser.name);
    const [password, setPassword] = useState("");

    // 정보 수정 핸들러
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nickName) {
            alert("닉네임을 입력해 주세요.");
            return;
        }

        // 목업 데이터 업데이트
        currentUser.name = nickName;
        alert("회원 정보가 수정되었습니다.");
        window.location.reload(); // 헤더 반영을 위한 새로고침
    };

    // 1. 이미지 미리보기를 위한 상태 추가
    const [profilePreview, setProfilePreview] = useState(currentUser.profileImage);

    // 2. 파일 선택 시 실행될 핸들러 함수
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setProfilePreview(result); // 화면에 미리보기 표시
                currentUser.profileImage = result; // 목업 데이터에 임시 저장
            };
            reader.readAsDataURL(file);
        }
    };

    // 회원 탈퇴 핸들러
    const handleWithdrawal = () => {
        const confirmFirst = window.confirm("정말로 탈퇴하시겠습니까?");
        if (confirmFirst) {
            const confirmSecond = window.confirm("탈퇴 시 모든 데이터가 삭제됩니다. 계속하시겠습니까?");
            if (confirmSecond) {
                alert("그동안 Classic Mania를 이용해 주셔서 감사합니다.");
                // 유저 정보 초기화 후 홈으로 이동
                currentUser.userId = "";
                currentUser.name = "";
                navigate("/");
                window.location.reload();
            }
        }
    };

    return (
        <Card className="shadow-sm border border-gray-100 bg-white">
            <CardContent className="p-8">
                <h5 className="text-lg font-bold text-gray-800 mb-2">
                    회원 정보 수정
                </h5>
                <p className="text-gray-500 mb-8">
                    Classic Mania에서 사용하는 내 정보를 관리합니다.
                </p>

                <form onSubmit={handleUpdate} className="flex flex-col gap-6 max-w-md">
                    {/* 아이디 (수정 불가 처리) */}
                    <div className="space-y-2">
                        <Label className="font-bold text-gray-800">
                            아이디
                        </Label>
                        <Input
                            disabled
                            value={currentUser.userId}
                            className="h-11 bg-gray-50"
                        />
                        <p className="text-sm text-gray-500">
                            아이디는 변경할 수 없습니다.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label className="font-bold text-gray-800">
                            프로필 이미지
                        </Label>
                        <div className="relative group w-fit">
                            <Avatar className="h-20 w-20 border-4 border-gray-100 shadow-xl">
                                <AvatarImage
                                    src={profilePreview || "https://docs.material-tailwind.com/img/face-2.jpg"}
                                    alt="Profile Preview"
                                    className="object-cover"
                                />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <label
                                htmlFor="profile-upload"
                                className="absolute bottom-0 right-0 bg-black p-2 rounded-full cursor-pointer hover:bg-gray-800 transition-colors shadow-lg"
                            >
                                <PenSquare className="h-4 w-4 text-white" />
                                <input
                                    id="profile-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">
                            우측 버튼을 눌러서 이미지를 변경하세요.
                        </p>
                    </div>

                    {/* 닉네임 수정 */}
                    <div className="space-y-2">
                        <Label className="font-bold text-gray-800">
                            닉네임
                        </Label>
                        <Input
                            placeholder="변경할 닉네임을 입력하세요"
                            value={nickName}
                            onChange={(e) => setNickName(e.target.value)}
                            className="h-11 focus:border-blue-500"
                        />
                    </div>

                    {/* 비밀번호 확인 (가상) */}
                    <div className="space-y-2">
                        <Label className="font-bold text-gray-800">
                            새 비밀번호 (선택)
                        </Label>
                        <Input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-11 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex gap-4 mt-4">
                        <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">
                            변경사항 저장
                        </Button>
                    </div>
                </form>

                <Separator className="my-10" />

                {/* 회원 탈퇴 섹션 */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-100">
                    <div>
                        <h6 className="text-base font-bold text-red-600">
                            회원탈퇴
                        </h6>
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
