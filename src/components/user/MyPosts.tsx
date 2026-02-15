import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { posts, currentUser } from "../../data/mockData";
import {useState} from "react";

const MyPosts = () => {
    const [sortType, setSortType] = useState("latest");
    const myPosts = posts.filter(p => p.authorId === currentUser.userId); // [cite: 2026-01-21]

    const sortedData = [...myPosts].sort((a, b) => {
        if (sortType === "views") return b.views - a.views;
        return b.id - a.id;
    });

    return (
        <Card className="shadow-sm border border-gray-100">
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h6 className="text-base font-bold text-gray-800">
                        내 게시글 현황 <span className="text-gray-500 ml-2">{myPosts.length}개</span>
                    </h6>
                    <Tabs value={sortType} onValueChange={setSortType} className="w-72">
                        <TabsList>
                            <TabsTrigger value="latest">최신순</TabsTrigger>
                            <TabsTrigger value="views">조회순</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <div className="space-y-4">
                    {sortedData.map(post => (
                        <div key={post.id} className="p-4 border-b border-gray-50 flex justify-between items-center">
                            <span className="text-sm font-bold">{post.title}</span>
                            <span className="text-sm text-gray-400">조회 {post.views}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
export default MyPosts;
