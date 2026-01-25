import {
    Navbar,
    Typography,
    Button,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Avatar,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { currentUser } from "../data/mockData";
import { ChevronDownIcon, UserCircleIcon, PowerIcon } from "@heroicons/react/24/outline";
import {useEffect, useState} from "react";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        // 컴포넌트가 사라질 때 이벤트 리스너를 제거
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const isLoggedIn = currentUser && currentUser.userId !== "" && currentUser.userId !== "guest";

    // 스크롤 상태에 따른 공통 색상 로직
    const textColor = isScrolled ? "text-blue-gray-900" : "text-white";
    const navBg = isScrolled ? "bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200" : "bg-black/95 border-none";

    return (
        <Navbar
            fullWidth
            // [중요] h-20으로 높이를 고정하여 스크롤 시 끄떡거림 방지
            className={`sticky top-0 z-50 h-20 flex items-center rounded-none px-4 py-0 transition-all duration-500 ${navBg}`}
        >
            <div className="container mx-auto flex items-center justify-between max-w-screen-xl">
                {/* 로고 영역 */}
                <Link to="/">
                    <Typography className={`mr-4 cursor-pointer py-1.5 font-bold text-2xl tracking-tighter transition-colors ${textColor}`}>
                        Classic Mania
                    </Typography>
                </Link>

                {/* 메뉴 및 유저 영역 */}
                <div className="flex items-center gap-8">
                    <ul className="flex items-center gap-8">
                        <li>
                            <Link to="/" className={`text-sm font-bold transition-colors hover:text-blue-500 ${textColor}`}>홈</Link>
                        </li>
                        <li>
                            <Link to="/board" className={`text-sm font-bold transition-colors hover:text-blue-500 ${textColor}`}>게시판</Link>
                        </li>
                    </ul>

                    <div className="flex items-center gap-4">
                        {!isLoggedIn ? (
                            <Link to="/login">
                                <Button
                                    size="sm"
                                    className={isScrolled ? "bg-blue-600" : "bg-white text-black"}
                                >
                                    로그인
                                </Button>
                            </Link>
                        ) : (
                            // 기존의 아바타 및 드롭다운 메뉴 완벽 복구
                            <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
                                <MenuHandler>
                                    <Button
                                        variant="text"
                                        className="flex items-center gap-2 rounded-full py-0.5 pr-2 pl-0.5 capitalize focus:ring-0"
                                    >
                                        <Avatar
                                            variant="circular"
                                            size="sm"
                                            alt={currentUser.name}
                                            className={`border-2 p-0.5 ${isScrolled ? "border-blue-500" : "border-white"}`}
                                            src={currentUser.profileImage || "https://docs.material-tailwind.com/img/face-2.jpg"}
                                        />
                                        <Typography variant="small" className={`font-bold ml-1 transition-colors ${textColor}`}>
                                            {currentUser.userId} 님
                                        </Typography>
                                        <ChevronDownIcon
                                            strokeWidth={2.5}
                                            className={`h-3 w-3 transition-transform ${textColor} ${isMenuOpen ? "rotate-180" : ""}`}
                                        />
                                    </Button>
                                </MenuHandler>
                                <MenuList className="p-1 border-none shadow-xl bg-white text-blue-gray-900">
                                    <MenuItem className="flex items-center gap-2 rounded" onClick={() => navigate("/mypage")}>
                                        <UserCircleIcon className="h-4 w-4 text-blue-500" />
                                        <Typography variant="small" className="font-normal">마이페이지</Typography>
                                    </MenuItem>
                                    <hr className="my-2 border-blue-gray-50" />
                                    <MenuItem className="flex items-center gap-2 rounded text-red-500" onClick={() => window.location.reload()}>
                                        <PowerIcon className="h-4 w-4" />
                                        <Typography variant="small" className="font-normal">로그아웃</Typography>
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        )}
                    </div>
                </div>
            </div>
        </Navbar>
    );
};

export default Header;