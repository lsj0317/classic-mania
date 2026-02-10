import { useNavigate } from "react-router-dom";
import { posts } from "../data/mockData";
import concertHallBaner from "../assets/home/concert_hall_baner.png";
import { ImageIcon } from "lucide-react";
import { useLanguageStore } from "../stores/languageStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Home = () => {
    const navigate = useNavigate();
    const { t } = useLanguageStore();

    const latestPosts = [...posts].sort((a, b) => b.id - a.id).slice(0, 5);
    const popularPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 5);

    const handlePostClick = (postId: number) => {
        const targetPost = posts.find((p) => p.id === postId);
        if (targetPost) {
            targetPost.views += 1;
        }
        navigate(`/board/${postId}`);
    };

    const PostSection = ({ title, data, sortType }: { title: string, data: typeof posts, sortType: string }) => (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h5 className="text-lg font-bold">{title}</h5>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="font-bold"
                        onClick={() => navigate("/board", { state: { sort: sortType } })}
                    >
                        {t.home.more}
                    </Button>
                </div>
                <ul className="space-y-4">
                    {data.map((post) => (
                        <li
                            key={post.id}
                            className="flex items-center gap-4 cursor-pointer group p-1 hover:bg-accent transition-colors rounded"
                            onClick={() => handlePostClick(post.id)}
                        >
                            {post.images && post.images.length > 0 ? (
                                <img
                                    src={post.images[0]}
                                    alt={post.title}
                                    className="h-16 w-16 object-cover rounded grayscale group-hover:grayscale-0 transition-all shadow-sm"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            ) : (
                                <div className="h-16 w-16 bg-muted flex items-center justify-center rounded border">
                                    <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
                                </div>
                            )}
                            <div className="flex-1 overflow-hidden">
                                <h6 className="font-semibold group-hover:text-primary/70 transition-colors truncate">
                                    {post.title}
                                </h6>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground font-medium">
                                        {post.authorName}
                                    </span>
                                    <span className="text-muted-foreground/30 text-xs">|</span>
                                    <span className="text-[11px] text-muted-foreground">
                                        {post.createdAt}
                                    </span>
                                    {sortType === "views" && (
                                        <span className="ml-auto text-[11px] text-muted-foreground font-bold">
                                            {t.home.views} {post.views}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );

    return (
        <div className="container mx-auto px-0 sm:px-4 py-6 lg:py-8 max-w-screen-xl">
            <div className="relative h-56 sm:h-72 lg:h-96 w-full overflow-hidden sm:rounded-lg shadow-lg mb-8 lg:mb-12">
                <img
                    src={concertHallBaner}
                    alt="오케스트라 배경"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/50 grid place-items-center">
                    <div className="text-center text-white px-4">
                        <h1 className="mb-2 text-2xl sm:text-3xl lg:text-5xl font-extrabold">
                            {t.home.heroTitle1}
                        </h1>
                        <h1 className="mb-4 text-2xl sm:text-3xl lg:text-5xl font-extrabold">
                            {t.home.heroTitle2}
                        </h1>
                        <Button size="lg" className="mt-4 sm:mt-6 font-bold" onClick={() => navigate("/login")}>
                            {t.home.getStarted}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:gap-8 md:grid-cols-2 px-4 sm:px-0">
                <PostSection title={t.home.latestNews} data={latestPosts} sortType="latest" />
                <PostSection title={t.home.popularPosts} data={popularPosts} sortType="views" />
            </div>
        </div>
    );
};

export default Home;
