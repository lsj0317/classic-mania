import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const Login = () => {
    return (
        <div className="flex justify-center items-center min-h-[70vh]">
            <Card color="transparent" shadow={false} className="w-full max-w-md p-4 border border-gray-100 shadow-lg bg-white">
                <Typography variant="h4" color="blue-gray" className="text-center">
                    로그인
                </Typography>
                <Typography color="gray" className="mt-1 font-normal text-center">
                    Classic Mania 커뮤니티에 오신 것을 환영합니다.
                </Typography>
                <form className="mt-8 mb-2 w-full">
                    <div className="mb-4 flex flex-col gap-6">
                        <Input size="lg" label="아이디" crossOrigin={undefined} />
                        <Input type="password" size="lg" label="비밀번호" crossOrigin={undefined} />
                    </div>
                    <Button className="mt-6" fullWidth color="blue">
                        로그인
                    </Button>
                    <Typography color="gray" className="mt-4 text-center font-normal">
                        계정이 없으신가요?{" "}
                        <Link to="/signup" className="font-medium text-blue-500 transition-colors hover:text-blue-700">
                            회원가입
                        </Link>
                    </Typography>
                </form>
            </Card>
        </div>
    );
};

export default Login;