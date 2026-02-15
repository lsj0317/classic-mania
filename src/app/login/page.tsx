'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// 소셜 로그인 아이콘 (SVG)
const KakaoIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 3C6.477 3 2 6.477 2 10.765c0 2.76 1.87 5.21 4.76 6.65-.22 1.57-1.07 4.14-1.22 4.74-.05.21.16.38.33.26.24-.17 3.84-2.61 5.37-3.66.58.08 1.17.12 1.76.12 5.523 0 10-3.477 10-7.765S17.523 3 12 3z" fill="#000000"/>
    </svg>
);

const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-2">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // 일반 로그인 로직 (데모)
        console.log("Login with:", email, password);
        alert("로그인 되었습니다. (데모)");
        router.push("/");
    };

    const handleKakaoLogin = () => {
        // 카카오 로그인 로직 (SDK 연동 필요)
        // window.Kakao.Auth.login({ ... })
        alert("카카오 계정으로 로그인합니다. (데모)");
        router.push("/");
    };

    const handleGoogleLogin = () => {
        // 구글 로그인 로직 (SDK 연동 필요)
        alert("구글 계정으로 로그인합니다. (데모)");
        router.push("/");
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-gray-50/50">
            <Card className="w-full max-w-md border border-gray-200 shadow-xl bg-white">
                <CardContent className="p-8">
                    <div className="text-center mb-8">
                        <h4 className="text-xl font-bold tracking-tight text-gray-800">
                            로그인
                        </h4>
                        <p className="mt-2 text-sm text-gray-500">
                            Classic Mania에 오신 것을 환영합니다.
                        </p>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                        <div className="flex flex-col gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">아이디</Label>
                                <Input
                                    id="email"
                                    placeholder="아이디"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11 focus:border-gray-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">비밀번호</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="비밀번호"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-11 focus:border-gray-900"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="mt-2 w-full bg-black hover:bg-gray-800 hover:scale-[1.01] transition-transform">
                            로그인
                        </Button>

                        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                            <div className="flex gap-4">
                                <Link href="#" className="hover:text-black hover:underline">아이디 찾기</Link>
                                <Link href="#" className="hover:text-black hover:underline">비밀번호 찾기</Link>
                            </div>
                            <Link href="/signup" className="font-bold text-black hover:underline">
                                회원가입
                            </Link>
                        </div>
                    </form>

                    {/* 소셜 로그인 구분선 */}
                    <div className="relative flex py-8 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-medium">SNS 계정으로 로그인</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* 소셜 로그인 버튼 */}
                    <div className="flex flex-col gap-3">
                        <Button
                            variant="outline"
                            className="w-full h-11 flex items-center justify-center gap-2 border-[#FEE500] bg-[#FEE500] text-black hover:bg-[#FDD835] hover:border-[#FDD835] font-medium text-sm"
                            onClick={handleKakaoLogin}
                        >
                            <KakaoIcon />
                            카카오로 시작하기
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full h-11 flex items-center justify-center gap-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium text-sm"
                            onClick={handleGoogleLogin}
                        >
                            <GoogleIcon />
                            Google로 시작하기
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
