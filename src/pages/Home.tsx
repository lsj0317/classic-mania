// src/pages/Home.tsx
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import React from "react";

const Home = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-lg mb-12">
                <img
                    src="https://images.unsplash.com/photo-1549247775-67375a0655d8?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="오케스트라 배경"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/50 grid place-items-center">
                    <div className="text-center">
                        <Typography
                            variant="h1"
                            color="white"
                            className="mb-4 text-3xl md:text-4xl lg:text-5xl font-extrabold"
                        >
                            음악으로 하나되는 공간,
                        </Typography>
                        <Typography
                            variant="h1"
                            color="white"
                            className="mb-4 text-3xl md:text-4xl lg:text-5xl font-extrabold"
                        >
                            클래식 매니아 커뮤니티
                        </Typography>
                        <Button size="lg" color="blue" className="mt-6">
                            커뮤니티 가입하기
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* 최신 소식 섹션 */}
                <Card className="shadow-lg">
                    <CardBody>
                        <Typography variant="h5" color="blue-gray" className="mb-4 font-bold">
                            최신 소식
                        </Typography>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-4">
                                <img
                                    src="https://images.unsplash.com/photo-1514782390807-73d762e58c97?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    alt="악보 이미지"
                                    className="h-16 w-16 object-cover rounded-md"
                                />
                                <div>
                                    <Typography variant="h6" color="blue-gray">
                                        금위 주현명: 베보도고고 7곡
                                    </Typography>
                                    <Typography variant="small" color="gray">
                                        <span className="text-sm font-medium">관리자</span> | <span className="text-xs">2시간 전</span>
                                    </Typography>
                                </div>
                            </li>
                            <li className="flex items-center gap-4">
                                <img
                                    src="https://images.unsplash.com/photo-1508212130129-c70a16a4c28d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    alt="오래된 악보"
                                    className="h-16 w-16 object-cover rounded-md"
                                />
                                <div>
                                    <Typography variant="h6" color="blue-gray">
                                        클스닥 모아 굿 이천 고부개들
                                    </Typography>
                                    <Typography variant="small" color="gray">
                                        <span className="text-sm font-medium">운영진</span> | <span className="text-xs">1일 전</span>
                                    </Typography>
                                </div>
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                {/* 인기 게시글 섹션 */}
                <Card className="shadow-lg">
                    <CardBody>
                        <Typography variant="h5" color="blue-gray" className="mb-4 font-bold">
                            인기 게시글
                        </Typography>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-4">
                                <img
                                    src="https://images.unsplash.com/photo-1511979313988-d42173f4784a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    alt="바이올린 이미지"
                                    className="h-16 w-16 object-cover rounded-md"
                                />
                                <div>
                                    <Typography variant="h6" color="blue-gray">
                                        자유 캐스팅: 이산 이라 원펀 굳!
                                    </Typography>
                                    <Typography variant="small" color="gray">
                                        <span className="text-sm font-medium">김한솔</span> | <span className="text-xs">3시간 전</span>
                                    </Typography>
                                </div>
                            </li>
                            <li className="flex items-center gap-4">
                                <img
                                    src="https://images.unsplash.com/photo-1580193816223-f36573c75d40?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    alt="피아노 건반"
                                    className="h-16 w-16 object-cover rounded-md"
                                />
                                <div>
                                    <Typography variant="h6" color="blue-gray">
                                        악기 죵료뢔래: 첼로스 갠밴쌈다
                                    </Typography>
                                    <Typography variant="small" color="gray">
                                        <span className="text-sm font-medium">박수영</span> | <span className="text-xs">4시간 전</span>
                                    </Typography>
                                </div>
                            </li>
                        </ul>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default Home;