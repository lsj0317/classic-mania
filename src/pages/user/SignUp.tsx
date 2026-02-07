import { useState } from 'react';
import { Card, Input, Button, Typography, Dialog, DialogHeader, DialogBody } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import DaumPostcode from 'react-daum-postcode';
import { XMarkIcon } from "@heroicons/react/24/outline";

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
            <Card color="transparent" shadow={false} className="w-full max-w-md p-8 border border-gray-200 shadow-xl bg-white rounded-none">
                <div className="text-center mb-8">
                    <Typography variant="h4" color="blue-gray" className="font-bold tracking-tight">
                        회원가입
                    </Typography>
                    <Typography color="gray" className="mt-2 font-normal text-sm">
                        Classic Mania의 회원이 되어 다양한 혜택을 누려보세요.
                    </Typography>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
                    <div className="flex flex-col gap-4">
                        <Input size="lg" label="아이디" className="!rounded-none focus:!border-t-gray-900" labelProps={{ className: "before:content-none after:content-none" }} containerProps={{ className: "!rounded-none" }} crossOrigin={undefined} />
                        <Input size="lg" label="이름" className="!rounded-none focus:!border-t-gray-900" labelProps={{ className: "before:content-none after:content-none" }} containerProps={{ className: "!rounded-none" }} crossOrigin={undefined} />
                        <Input size="lg" label="이메일" className="!rounded-none focus:!border-t-gray-900" labelProps={{ className: "before:content-none after:content-none" }} containerProps={{ className: "!rounded-none" }} crossOrigin={undefined} />
                        <Input type="password" size="lg" label="비밀번호" className="!rounded-none focus:!border-t-gray-900" labelProps={{ className: "before:content-none after:content-none" }} containerProps={{ className: "!rounded-none" }} crossOrigin={undefined} />
                        <Input type="password" size="lg" label="비밀번호 확인" className="!rounded-none focus:!border-t-gray-900" labelProps={{ className: "before:content-none after:content-none" }} containerProps={{ className: "!rounded-none" }} crossOrigin={undefined} />
                        
                        {/* 주소 검색 섹션 */}
                        <div className="flex flex-col gap-2">
                            <Typography variant="small" color="blue-gray" className="font-bold ml-1">
                                주소
                            </Typography>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Input 
                                        size="lg" 
                                        label="우편번호" 
                                        value={zonecode} 
                                        readOnly 
                                        className="!rounded-none bg-gray-50 focus:!border-t-gray-900" 
                                        labelProps={{ className: "before:content-none after:content-none" }}
                                        containerProps={{ className: "!rounded-none min-w-0" }}
                                        crossOrigin={undefined} 
                                    />
                                </div>
                                <Button 
                                    className="rounded-none bg-black w-32 shrink-0"
                                    onClick={() => setIsPostcodeOpen(true)}
                                >
                                    우편번호 찾기
                                </Button>
                            </div>
                            <Input 
                                size="lg" 
                                label="기본 주소" 
                                value={address} 
                                readOnly 
                                className="!rounded-none bg-gray-50 focus:!border-t-gray-900" 
                                labelProps={{ className: "before:content-none after:content-none" }}
                                containerProps={{ className: "!rounded-none" }}
                                crossOrigin={undefined} 
                            />
                            <Input 
                                size="lg" 
                                label="상세 주소" 
                                value={detailAddress}
                                onChange={(e) => setDetailAddress(e.target.value)}
                                placeholder="상세 주소를 입력하세요"
                                className="!rounded-none focus:!border-t-gray-900" 
                                labelProps={{ className: "before:content-none after:content-none" }}
                                containerProps={{ className: "!rounded-none" }}
                                crossOrigin={undefined} 
                            />
                        </div>
                    </div>

                    <Button type="submit" className="mt-6 rounded-none bg-black hover:scale-[1.01] transition-transform" fullWidth>
                        가입하기
                    </Button>

                    <Typography color="gray" className="mt-4 text-center font-normal text-sm">
                        이미 계정이 있으신가요?{" "}
                        <Link to="/login" className="font-bold text-black hover:underline">
                            로그인
                        </Link>
                    </Typography>
                </form>
            </Card>

            {/* 주소 검색 모달 */}
            <Dialog open={isPostcodeOpen} handler={() => setIsPostcodeOpen(false)} size="sm" className="rounded-none">
                <DialogHeader className="justify-between border-b border-gray-100 pb-4">
                    <Typography variant="h5" color="blue-gray" className="font-bold">
                        우편번호 검색
                    </Typography>
                    <div className="cursor-pointer" onClick={() => setIsPostcodeOpen(false)}>
                        <XMarkIcon className="h-5 w-5 text-gray-500 hover:text-black" />
                    </div>
                </DialogHeader>
                <DialogBody className="p-0">
                    <DaumPostcode 
                        onComplete={handleComplete} 
                        style={{ height: '450px' }}
                    />
                </DialogBody>
            </Dialog>
        </div>
    );
};

export default SignUp;
