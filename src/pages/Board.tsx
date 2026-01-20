import {
    Card,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

// 게시판 데이터 타입 정의 (MemberDto 연동을 고려한 작성자 포함)
interface Post {
    id: number;
    category: string;
    title: string;
    author: string; // MemberDto의 name 또는 nickname 연결
    date: string;
    views: number;
}

const TABLE_HEAD = ["번호", "카테고리", "제목", "작성자", "작성일", "조회수"];

const TABLE_ROWS: Post[] = [
    { id: 5, category: "공연후기", title: "어제 본 빈 필하모닉 내한 공연 후기입니다.", author: "안예원", date: "2026-01-20", views: 128 },
    { id: 4, category: "자유", title: "초보자가 듣기 좋은 말러 교향곡 추천 부탁드려요.", author: "클래식러버", date: "2026-01-19", views: 254 },
    { id: 3, category: "질문", title: "바이올린 활 교체 시기가 궁금합니다.", author: "현악기초보", date: "2026-01-19", views: 89 },
    { id: 2, category: "정보", title: "올해 예정된 주요 해외 오케스트라 내한 일정 정리", author: "운영진", date: "2026-01-18", views: 512 },
    { id: 1, category: "자유", title: "안녕하세요, 새로 가입했습니다!", author: "뉴비입니다", date: "2026-01-17", views: 45 },
];

const Board = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center justify-between gap-8">
                <div>
                    <Typography variant="h5" color="blue-gray" className="font-bold">
                        커뮤니티 게시판
                    </Typography>
                    <Typography color="gray" className="mt-1 font-normal">
                        클래식 음악에 대한 다양한 이야기를 나누어 보세요.
                    </Typography>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                    <Button variant="outlined" size="sm" color="blue-gray">
                        전체 보기
                    </Button>
                    <Button className="flex items-center gap-3" size="sm" color="blue">
                        글쓰기
                    </Button>
                </div>
            </div>

            <Card className="h-full w-full shadow-sm border border-gray-200">
                <CardBody className="overflow-scroll px-0 py-0">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                    <Typography variant="small" color="blue-gray" className="font-bold leading-none opacity-70">
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {TABLE_ROWS.map(({ id, category, title, author, date, views }, index) => {
                            const isLast = index === TABLE_ROWS.length - 1;
                            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr key={id} className="hover:bg-blue-gray-50/50 transition-colors">
                                    <td className={classes}>
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {id}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <div className="w-max">
                                            <Chip
                                                size="sm"
                                                variant="ghost"
                                                value={category}
                                                color={category === "정보" ? "blue" : category === "질문" ? "orange" : "gray"}
                                            />
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <Typography variant="small" color="blue-gray" className="font-bold cursor-pointer hover:text-blue-500">
                                            {title}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {author}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <Typography variant="small" color="blue-gray" className="font-normal text-xs">
                                            {date}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {views}
                                        </Typography>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </CardBody>
                <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                        Page 1 of 10
                    </Typography>
                    <div className="flex gap-2">
                        <Button variant="outlined" size="sm" color="blue-gray">이전</Button>
                        <Button variant="outlined" size="sm" color="blue-gray">다음</Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Board;