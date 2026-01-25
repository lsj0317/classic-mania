import { Card, Typography, Tabs, TabsHeader, Tab } from "@material-tailwind/react";
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
        <Card className="p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <Typography variant="h6" color="blue-gray" className="font-bold">
                    내 게시글 현황 <span className="text-blue-500 ml-2">{myPosts.length}개</span>
                </Typography>
                <Tabs value={sortType} className="w-72">
                    <TabsHeader>
                        <Tab value="latest" onClick={() => setSortType("latest")}>최신순</Tab>
                        <Tab value="views" onClick={() => setSortType("views")}>조회순</Tab>
                    </TabsHeader>
                </Tabs>
            </div>
            <div className="space-y-4">
                {sortedData.map(post => (
                    <div key={post.id} className="p-4 border-b border-gray-50 flex justify-between items-center">
                        <Typography variant="small" className="font-bold">{post.title}</Typography>
                        <Typography variant="small" className="text-gray-400">조회 {post.views}</Typography>
                    </div>
                ))}
            </div>
        </Card>
    );
};
export default MyPosts;