import { Link, useNavigate } from "react-router-dom";
import { posts } from "../data/mockData";
import { useLanguageStore } from "../stores/languageStore";
import { Separator } from "./ui/separator";

const Footer = () => {
    const navigate = useNavigate();
    const { t } = useLanguageStore();

    const latestShort = [...posts].sort((a, b) => b.id - a.id).slice(0, 3);
    const popularShort = [...posts].sort((a, b) => b.views - a.views).slice(0, 3);

    const handleFootClick = (id: number) => {
        const target = posts.find(p => p.id === id);
        if (target) target.views += 1;
        navigate(`/board/${id}`);
        window.scrollTo(0, 0);
    };

    return (
        <footer className="w-full bg-black p-6 sm:p-8 pt-8 sm:pt-12 text-white">
            <div className="container mx-auto max-w-screen-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 pb-8 lg:pb-12">
                    {/* 기업/서비스 정보 */}
                    <div className="flex flex-col gap-4">
                        <h5 className="font-bold text-lg">Classic Mania</h5>
                        <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                            {t.footer.companyInfo}
                        </p>
                    </div>

                    {/* 최신 소식 */}
                    <div>
                        <p className="text-xs font-bold mb-4 uppercase text-gray-500">
                            {t.footer.latestNews}
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
                </div>

                <Separator className="bg-gray-800" />

                <div className="flex gap-6 pt-6 text-gray-500 sm:justify-center">
                    <Link to="/terms">
                        <span className="text-sm hover:text-white transition-colors cursor-pointer">
                            {t.footer.terms}
                        </span>
                    </Link>
                    <Link to="/privacy">
                        <span className="text-sm font-bold hover:text-white transition-colors cursor-pointer">
                            {t.footer.privacy}
                        </span>
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
