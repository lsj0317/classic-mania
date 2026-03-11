'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { posts } from "../data/mockData";
import { useLanguageStore } from "../stores/languageStore";
import { Separator } from "./ui/separator";

const Footer = () => {
    const router = useRouter();
    const { t } = useLanguageStore();

    const popularShort = [...posts].sort((a, b) => b.views - a.views).slice(0, 3);
    const latestShort = [...posts].sort((a, b) => b.id - a.id).slice(0, 3);

    const handleFootClick = (id: number) => {
        const target = posts.find(p => p.id === id);
        if (target) target.views += 1;
        router.push(`/board/${id}`);
        window.scrollTo(0, 0);
    };

    return (
        <footer className="w-full bg-black p-6 sm:p-8 pt-8 sm:pt-12 text-white">
            <div className="container mx-auto max-w-screen-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 pb-8 lg:pb-12">
                    {/* 웹사이트 정보 */}
                    <div className="flex flex-col gap-4">
                        <h5 className="font-bold text-lg">Classic Mania</h5>
                        <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                            {t.footer.companyInfo}
                        </p>
                    </div>

                    {/* 인기 게시글 */}
                    <div>
                        <p className="text-xs font-bold mb-4 uppercase text-gray-500">
                            {t.footer.popularPosts}
                        </p>
                        <ul className="flex flex-col gap-3">
                            {popularShort.map((post) => (
                                <li
                                    key={post.id}
                                    className="cursor-pointer hover:text-blue-400 transition-colors truncate text-sm text-gray-400"
                                    onClick={() => handleFootClick(post.id)}
                                >
                                    {post.title}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 새로운 게시글 */}
                    <div>
                        <p className="text-xs font-bold mb-4 uppercase text-gray-500">
                            {t.footer.newPosts}
                        </p>
                        <ul className="flex flex-col gap-3">
                            {latestShort.map((post) => (
                                <li
                                    key={post.id}
                                    className="cursor-pointer hover:text-blue-400 transition-colors truncate text-sm text-gray-400"
                                    onClick={() => handleFootClick(post.id)}
                                >
                                    {post.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <Separator className="bg-gray-800" />

                <div className="flex items-center gap-0 pt-6 text-gray-500 sm:justify-center text-sm">
                    <Link href="/">
                        <span className="hover:text-white transition-colors cursor-pointer px-3 first:pl-0">홈</span>
                    </Link>
                    <span className="text-gray-700">|</span>
                    <Link href="/terms">
                        <span className="hover:text-white transition-colors cursor-pointer px-3">{t.footer.terms}</span>
                    </Link>
                    <span className="text-gray-700">|</span>
                    <Link href="/privacy">
                        <span className="hover:text-white transition-colors cursor-pointer px-3">{t.footer.privacy}</span>
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
