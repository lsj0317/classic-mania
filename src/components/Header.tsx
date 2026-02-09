import { useState, useEffect, useCallback } from "react";
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
import { ChevronDownIcon, UserCircleIcon, PowerIcon, Bars3Icon } from "@heroicons/react/24/outline";
import SideMenu from "./SideMenu";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const navigate = useNavigate();
    const closeSideMenu = useCallback(() => setIsSideMenuOpen(false), []);

    const NAV_MENU = [
        { name: "홈", path: "/" },
        { name: "게시판", path: "/board" },
        { name: "공연정보", path: "/performance" },
        { name: "티켓정보", path: "/ticket-info" },
        { name: "뉴스", path: "/news" },
    ];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isLoggedIn = currentUser && currentUser.userId !== "" && currentUser.userId !== "guest";
    const textColor = isScrolled ? "text-blue-gray-900" : "text-white";
    const navBg = isScrolled ? "bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200" : "bg-black/95 border-none";

    return (
        <>
            <Navbar
                fullWidth
                className={`sticky top-0 z-50 h-16 lg:h-20 flex items-center rounded-none px-4 py-0 transition-all duration-500 ${navBg}`}
            >
                <div className="container mx-auto flex items-center justify-between max-w-screen-xl">
                    {/* 로고 영역 */}
                    <div className="flex-1 flex justify-start">
                        <Link to="/">
                            <Typography className={`cursor-pointer py-1.5 font-bold text-xl lg:text-2xl tracking-tighter transition-colors w-max ${textColor}`}>
                                Classic Mania
                            </Typography>
                        </Link>
                    </div>

                    {/* 데스크톱 전용 메뉴 */}
                    <div className="hidden lg:flex items-center gap-10">
                        <ul className="flex items-center gap-10">
                            {NAV_MENU.map((menu) => (
                                <li key={menu.path}>
                                    <Link
                                        to={menu.path}
                                        className={`text-sm font-bold transition-colors hover:text-blue-500 whitespace-nowrap ${textColor}`}
                                    >
                                        {menu.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 데스크톱 전용 유저 영역 */}
                    <div className="hidden lg:flex flex-1 justify-end">
                        <div className="flex items-center gap-4">
                            {!isLoggedIn ? (
                                <Link to="/login">
                                    <Button size="sm" className={isScrolled ? "bg-blue-600" : "bg-white text-black"}>
                                        로그인
                                    </Button>
                                </Link>
                            ) : (
                                <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
                                    <MenuHandler>
                                        <Button variant="text" className="flex items-center gap-2 rounded-full py-0.5 pr-2 pl-0.5 capitalize focus:ring-0">
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
                                            <ChevronDownIcon strokeWidth={2.5} className={`h-3 w-3 transition-transform ${textColor} ${isMenuOpen ? "rotate-180" : ""}`} />
                                        </Button>
                                    </MenuHandler>
                                    <MenuList className="p-1 border-none shadow-xl bg-white text-blue-gray-900">
                                        <MenuItem className="flex items-center gap-2 rounded" onClick={() => navigate("/mypage")}>
                                            <UserCircleIcon className="h-4 w-4 text-black-500" />
                                            <Typography variant="small" className="font-normal">마이페이지</Typography>
                                        </MenuItem>
                                        <hr className="my-2 border-blue-gray-50" />
                                        <MenuItem className="flex items-center gap-2 rounded text-black-500" onClick={() => window.location.reload()}>
                                            <PowerIcon className="h-4 w-4" />
                                            <Typography variant="small" className="font-normal">로그아웃</Typography>
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            )}
                        </div>
                    </div>

                    {/* 모바일 전용 햄버거 버튼 */}
                    <button
                        className={`lg:hidden p-2 rounded-lg transition-colors hover:bg-white/10 ${textColor}`}
                        onClick={() => setIsSideMenuOpen(true)}
                        aria-label="메뉴 열기"
                    >
                        <Bars3Icon className="h-6 w-6" strokeWidth={2} />
                    </button>
                </div>
            </Navbar>

            {/* 사이드 메뉴 */}
            <SideMenu isOpen={isSideMenuOpen} onClose={closeSideMenu} />
        </>
    );
};

export default Header;
