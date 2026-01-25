// src/pages/user/UserManage.tsx
import React, { useState } from "react";
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import { currentUser } from "../../data/mockData";
import { useNavigate } from "react-router-dom";

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

    // 회원 탈퇴 핸들러 [cite: 2026-01-25]
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
        <Card className="p-8 shadow-sm border border-gray-100 bg-white">
            <Typography variant="h5" color="blue-gray" className="mb-2 font-bold">
                회원 정보 수정
            </Typography>
            <Typography color="gray" className="mb-8 font-normal">
                Classic Mania에서 사용하는 내 정보를 관리합니다.
            </Typography>

            <form onSubmit={handleUpdate} className="flex flex-col gap-6 max-w-md">
                {/* 아이디 (수정 불가 처리) */}
                <div>
                    <Typography variant="small" color="blue-gray" className="mb-2 font-bold">
                        아이디
                    </Typography>
                    <Input
                        size="lg"
                        disabled
                        value={currentUser.userId}
                        className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{ className: "before:content-none after:content-none" }}
                        crossOrigin={undefined}
                    />
                    <Typography variant="small" className="mt-1 text-gray-500">
                        아이디는 변경할 수 없습니다.
                    </Typography>
                </div>

                {/* 닉네임 수정 */}
                <div>
                    <Typography variant="small" color="blue-gray" className="mb-2 font-bold">
                        닉네임
                    </Typography>
                    <Input
                        size="lg"
                        placeholder="변경할 닉네임을 입력하세요"
                        value={nickName}
                        onChange={(e) => setNickName(e.target.value)}
                        className="focus:!border-t-blue-500"
                        labelProps={{ className: "before:content-none after:content-none" }}
                        crossOrigin={undefined}
                    />
                </div>

                {/* 비밀번호 확인 (가상) */}
                <div>
                    <Typography variant="small" color="blue-gray" className="mb-2 font-bold">
                        새 비밀번호 (선택)
                    </Typography>
                    <Input
                        type="password"
                        size="lg"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="focus:!border-t-blue-500"
                        labelProps={{ className: "before:content-none after:content-none" }}
                        crossOrigin={undefined}
                    />
                </div>

                <div className="flex gap-4 mt-4">
                    <Button type="submit" color="blue" fullWidth>
                        변경사항 저장
                    </Button>
                </div>
            </form>

            <hr className="my-10 border-blue-gray-50" />

            {/* 회원 탈퇴 섹션 */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-100">
                <div>
                    <Typography variant="h6" color="red" className="font-bold">
                        회원 탈퇴
                    </Typography>
                    <Typography variant="small" className="text-red-300">
                        계정을 삭제하면 모든 활동 내역이 즉시 소멸됩니다.
                    </Typography>
                </div>
                <Button variant="text" color="red" className="font-bold" onClick={handleWithdrawal}>
                    탈퇴하기
                </Button>
            </div>
        </Card>
    );
};

export default UserManage;