// src/components/Footer.tsx
import { Typography } from "@material-tailwind/react";
import {Link, useNavigate} from "react-router-dom";
import { posts } from "../data/mockData";

const Footer = () => {
    const navigate = useNavigate();

    // 최신글 3개 및 인기글 3개 추출 [cite: 2026-01-21]
    const latestShort = [...posts].sort((a, b) => b.id - a.id).slice(0, 3);
    const popularShort = [...posts].sort((a, b) => b.views - a.views).slice(0, 3);

    // 조회수 증가 처리 핸들러 [cite: 2026-01-21]
    const handleFootClick = (id: number) => {
        const target = posts.find(p => p.id === id);
        if (target) target.views += 1;
        navigate(`/board/${id}`);
        window.scrollTo(0, 0); // 페이지 상단으로 스크롤 이동
    };

    return (
        <footer className="w-full bg-black p-6 sm:p-8 pt-8 sm:pt-12 text-white">
            <div className="container mx-auto max-w-screen-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 border-b border-blue-gray-800 pb-8 lg:pb-12">

                    {/* 1. 기업/서비스 정보 */}
                    <div className="flex flex-col gap-4">
                        <Typography variant="h5" className="font-bold text-white-400">
                            Classic Mania
                        </Typography>
                        <Typography variant="small" className="text-blue-gray-300 leading-relaxed">
                            클래식매니아 (Classic Mania)<br />
                            경기도 오산시 원동로 00번길 00<br />
                            대표: 이서준 | Tel: 031-000-0000<br />
                            Email: mujuki@classicmania.com
                        </Typography>
                    </div>

                    {/* 2. 푸터 위젯: 최신 소식 */}
                    <div>
                        <Typography variant="small" className="font-bold mb-4 uppercase text-blue-gray-400">
                            최신 소식
                        </Typography>
                        <ul className="flex flex-col gap-3">
                            {latestShort.map((post) => (
                                <li
                                    key={post.id}
                                    className="cursor-pointer hover:text-blue-400 transition-colors truncate text-sm text-blue-gray-200"
                                    onClick={() => handleFootClick(post.id)}
                                >
                                    • {post.title}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. 푸터 위젯: 인기 게시글 */}
                    <div>
                        <Typography variant="small" className="font-bold mb-4 uppercase text-blue-gray-400">
                            인기 게시글
                        </Typography>
                        <ul className="flex flex-col gap-3">
                            {popularShort.map((post) => (
                                <li
                                    key={post.id}
                                    className="cursor-pointer hover:text-blue-400 transition-colors truncate text-sm text-blue-gray-200"
                                    onClick={() => handleFootClick(post.id)}
                                >
                                    <span className="text-orange-400 mr-1">🔥</span> {post.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex gap-6 text-blue-gray-500 sm:justify-center">
                    <Link to="/terms">
                        <Typography variant="small" className="hover:text-white transition-colors cursor-pointer">
                            이용약관
                        </Typography>
                    </Link>
                    <Link to="/privacy">
                        <Typography variant="small" className="hover:text-white font-bold transition-colors cursor-pointer">
                            개인정보처리방침
                        </Typography>
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;