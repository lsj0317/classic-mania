import { Card, List, ListItem, ListItemPrefix, Typography } from "@material-tailwind/react";
import { DocumentTextIcon, PencilSquareIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import MyPosts from "./MyPosts";
import PostManage from "./PostManage";
import {useState} from "react";
import UserManage from "./UserManage.tsx";

const MyPage = () => {
    const [activeTab, setActiveTab] = useState("posts"); // 현재 활성화된 메뉴 상태

    return (
        <div className="container mx-auto max-w-screen-xl px-4 py-12 flex flex-col md:flex-row gap-8">
            <Card className="w-full md:w-[30%] h-max p-4 shadow-sm border border-gray-100">
                <Typography variant="h5" color="blue-gray" className="mb-4 px-4 font-bold">
                    마이페이지
                </Typography>
                <List>
                    <ListItem
                        selected={activeTab === "posts"}
                        onClick={() => setActiveTab("posts")}
                        className={activeTab === "posts" ? "bg-blue-50 text-blue-700" : ""}
                    >
                        <ListItemPrefix><DocumentTextIcon className="h-5 w-5" /></ListItemPrefix>
                        내 게시글 현황
                    </ListItem>
                    <ListItem
                        selected={activeTab === "manage"}
                        onClick={() => setActiveTab("manage")}
                        className={activeTab === "manage" ? "bg-blue-50 text-blue-700" : ""}
                    >
                        <ListItemPrefix><PencilSquareIcon className="h-5 w-5" /></ListItemPrefix>
                        작성글 관리
                    </ListItem>
                    <ListItem
                        selected={activeTab === "user"}
                        onClick={() => setActiveTab("user")}
                        className={activeTab === "user" ? "bg-blue-50 text-blue-700" : ""}
                    >
                        <ListItemPrefix><UserCircleIcon className="h-5 w-5" /></ListItemPrefix>
                        회원 정보 수정
                    </ListItem>
                </List>
            </Card>

            {/* SECTION B: 콘텐츠 (70%) [cite: 2026-01-25] */}
            <div className="w-full md:w-[70%]">
                {activeTab === "posts" && <MyPosts />}
                {activeTab === "manage" && <PostManage />}
                {activeTab === "user" && <UserManage />}
            </div>
        </div>
    );
};

export default MyPage;