import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import DaumPostcode from 'react-daum-postcode';
import { X } from "lucide-react";

const SignUp = () => {
    const navigate = useNavigate();

    // 주소 관련 상태
    const [zonecode, setZonecode] = useState("");
    const [address, setAddress] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

    // 주소 검색 완료 핸들러
    const handleComplete = (data: any) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        setZonecode(data.zonecode);
        setAddress(fullAddress);
        setIsPostcodeOpen(false);
    };

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        // 회원가입 로직 (데모)
        alert("회원가입이 완료되었습니다. (데모)");
        navigate("/login");
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] py-10 bg-gray-50/50">
            <Card className="w-full max-w-md border border-gray-200 shadow-xl bg-white">
                <CardContent className="p-8">
                    <div className="text-center mb-8">
                        <h4 className="text-xl font-bold tracking-tight text-gray-800">
                            회원가입
                        </h4>
                        <p className="mt-2 text-sm text-gray-500">
                            Classic Mania의 회원이 되어 다양한 혜택을 누려보세요.
                        </p>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
                        <div className="flex flex-col gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="userId">아이디</Label>
                                <Input id="userId" placeholder="아이디" className="h-11 focus:border-gray-900" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">이름</Label>
                                <Input id="name" placeholder="이름" className="h-11 focus:border-gray-900" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">이메일</Label>
                                <Input id="email" placeholder="이메일" className="h-11 focus:border-gray-900" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">비밀번호</Label>
                                <Input id="password" type="password" placeholder="비밀번호" className="h-11 focus:border-gray-900" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
                                <Input id="passwordConfirm" type="password" placeholder="비밀번호 확인" className="h-11 focus:border-gray-900" />
                            </div>

                            {/* 주소 검색 섹션 */}
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold">
                                    주소
                                </Label>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Input
                                            placeholder="우편번호"
                                            value={zonecode}
                                            readOnly
                                            className="h-11 bg-gray-50 focus:border-gray-900"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        className="bg-black hover:bg-gray-800 w-32 shrink-0"
                                        onClick={() => setIsPostcodeOpen(true)}
                                    >
                                        우편번호 찾기
                                    </Button>
                                </div>
                                <Input
                                    placeholder="기본 주소"
                                    value={address}
                                    readOnly
                                    className="h-11 bg-gray-50 focus:border-gray-900"
                                />
                                <Input
                                    placeholder="상세 주소를 입력하세요"
                                    value={detailAddress}
                                    onChange={(e) => setDetailAddress(e.target.value)}
                                    className="h-11 focus:border-gray-900"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="mt-6 w-full bg-black hover:bg-gray-800 hover:scale-[1.01] transition-transform">
                            가입하기
                        </Button>

                        <p className="mt-4 text-center text-sm text-gray-500">
                            이미 계정이 있으신가요?{" "}
                            <Link to="/login" className="font-bold text-black hover:underline">
                                로그인
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>

            {/* 주소 검색 모달 */}
            <Dialog open={isPostcodeOpen} onOpenChange={setIsPostcodeOpen}>
                <DialogContent className="sm:max-w-md p-0">
                    <DialogHeader className="p-4 border-b border-gray-100">
                        <DialogTitle className="text-lg font-bold text-gray-800">
                            우편번호 검색
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-0">
                        <DaumPostcode
                            onComplete={handleComplete}
                            style={{ height: '450px' }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SignUp;
