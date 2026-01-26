import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const SignUp = () => {
    return (
        <div className="flex justify-center items-center min-h-[80vh] py-10">
            <Card color="transparent" shadow={false} className="w-full max-w-md p-6 border border-gray-100 shadow-lg bg-white">
                <Typography variant="h4" color="blue-gray" className="text-center">
                    회원가입
                </Typography>
                <Typography color="gray" className="mt-1 font-normal text-center">
                    커뮤니티 회원이 되어 다양한 정보를 공유하세요.
                </Typography>
                <form className="mt-8 mb-2 w-full">
                    <div className="mb-4 flex flex-col gap-4">
                        <Input size="lg" label="아이디" crossOrigin={undefined} />
                        <Input size="lg" label="이름" crossOrigin={undefined} />
                        <Input size="lg" label="이메일" crossOrigin={undefined} />
                        <Input type="password" size="lg" label="비밀번호" crossOrigin={undefined} />
                        <Input type="password" size="lg" label="비밀번호 확인" crossOrigin={undefined} />
                        <Input size="lg" label="주소 (예: 경기도 오산시...)" crossOrigin={undefined} />
                    </div>
                    <Button className="mt-6" fullWidth color="black">
                        가입하기
                    </Button>
                    <Typography color="gray" className="mt-4 text-center font-normal">
                        이미 계정이 있으신가요?{" "}
                        <Link to="/login" className="font-medium text-black-500 transition-colors hover:text-black-700">
                            로그인
                        </Link>
                    </Typography>
                </form>
            </Card>
        </div>
    );
};

export default SignUp;