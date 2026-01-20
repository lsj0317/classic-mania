import { Navbar, Typography, Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <Navbar className="mx-auto max-w-screen-xl px-4 py-2 lg:px-8 lg:py-4 shadow-none border-b text-blue-gray-900">
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/">
                    <Typography className="mr-4 cursor-pointer py-1.5 font-bold text-xl">
                        Classic Mania
                    </Typography>
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/">
                        <Typography className="p-1 font-medium hover:text-blue-500 transition-colors">
                            홈
                        </Typography>
                    </Link>
                    <Link to="/board">
                        <Typography className="p-1 font-medium hover:text-blue-500 transition-colors">
                            게시판
                        </Typography>
                    </Link>
                </div>

                {/* 로그인 버튼에 Link를 연결합니다 */}
                <Link to="/login">
                    <Button size="sm" color="blue">
                        로그인
                    </Button>
                </Link>
            </div>
        </Navbar>
    );
};

export default Header;