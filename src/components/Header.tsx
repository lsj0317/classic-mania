import { useState, useEffect } from "react";
import {
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
import { ChevronDownIcon, UserCircleIcon, PowerIcon, Bars3Icon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { useLanguageStore, type Language } from "../stores/languageStore";

interface HeaderProps {
    onMenuOpen: () => void;
}

const Header = ({ onMenuOpen }: HeaderProps) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { language, t, setLanguage } = useLanguageStore();

    const NAV_MENU = [
        { name: t.nav.home, path: "/" },
        { name: t.nav.board, path: "/board" },
        { name: t.nav.performance, path: "/performance" },
        { name: t.nav.ticket, path: "/ticket-info" },
        { name: t.nav.news, path: "/news" },
    ];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isLoggedIn = currentUser && currentUser.userId !== "" && currentUser.userId !== "guest";
    const textColor = isScrolled ? "text-gray-900" : "text-white";
    const navBg = isScrolled
        ? "bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200"
        : "bg-black/95";

    const handleBurgerClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onMenuOpen();
    };

    const LANG_OPTIONS: { code: Language; label: string }[] = [
        { code: "ko", label: t.language.ko },
        { code: "en", label: t.language.en },
    ];

    return (
        <header
            className={`sticky top-0 z-50 h-16 lg:h-20 flex items-center px-4 py-0 transition-all duration-500 ${navBg}`}
        >
            <div className="container mx-auto flex items-center justify-between max-w-screen-xl">
                {/* 로고 */}
                <div className="flex-1 flex justify-start">
                    <Link to="/">
                        <Typography className={`cursor-pointer py-1.5 font-bold text-xl lg:text-2xl tracking-tighter transition-colors w-max ${textColor}`}>
                            Classic Mania
                        </Typography>
                    </Link>
                </div>

                {/* 데스크톱 메뉴 */}
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

                {/* 데스크톱 유저 영역 + 언어 선택 */}
                <div className="hidden lg:flex flex-1 justify-end">
                    <div className="flex items-center gap-4">
                        {/* 언어 드롭다운 */}
                        <Menu open={isLangMenuOpen} handler={setIsLangMenuOpen} placement="bottom-end">
                            <MenuHandler>
                                <Button
                                    variant="text"
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full capitalize focus:ring-0 ${textColor}`}
                                >
                                    <GlobeAltIcon className="h-4 w-4" strokeWidth={2} />
                                    <span className="text-xs font-bold">
                                        {language === "ko" ? "KO" : "EN"}
                                    </span>
                                    <ChevronDownIcon
                                        strokeWidth={2.5}
                                        className={`h-3 w-3 transition-transform ${isLangMenuOpen ? "rotate-180" : ""}`}
                                    />
                                </Button>
                            </MenuHandler>
                            <MenuList className="p-1 min-w-[120px] border-none shadow-xl bg-white text-blue-gray-900">
                                {LANG_OPTIONS.map((opt) => (
                                    <MenuItem
                                        key={opt.code}
                                        className={`flex items-center gap-2 rounded text-sm ${language === opt.code ? "bg-gray-100 font-bold" : ""}`}
                                        onClick={() => setLanguage(opt.code)}
                                    >
                                        {opt.label}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>

                        {!isLoggedIn ? (
                            <Link to="/login">
                                <Button size="sm" className={isScrolled ? "bg-blue-600" : "bg-white text-black"}>
                                    {t.auth.login}
                                </Button>
                            </Link>
                        ) : (
                            <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
                                <MenuHandler>
                                    <Button variant="text" className="flex items-center gap-2 rounded-full py-0.5 pr-2 pl-0.5 capitalize focus:ring-0">
                                        {currentUser.profileImage ? (
                                            <Avatar
                                                variant="circular"
                                                size="sm"
                                                alt={currentUser.name}
                                                className={`border-2 p-0.5 ${isScrolled ? "border-blue-500" : "border-white"}`}
                                                src={currentUser.profileImage}
                                            />
                                        ) : (
                                            <UserCircleIcon className={`h-9 w-9 ${isScrolled ? "text-blue-500" : "text-white"}`} />
                                        )}
                                        <Typography variant="small" className={`font-bold ml-1 transition-colors ${textColor}`}>
                                            {currentUser.userId} {t.auth.honorific}
                                        </Typography>
                                        <ChevronDownIcon strokeWidth={2.5} className={`h-3 w-3 transition-transform ${textColor} ${isMenuOpen ? "rotate-180" : ""}`} />
                                    </Button>
                                </MenuHandler>
                                <MenuList className="p-1 border-none shadow-xl bg-white text-blue-gray-900">
                                    <MenuItem className="flex items-center gap-2 rounded" onClick={() => navigate("/mypage")}>
                                        <UserCircleIcon className="h-4 w-4" />
                                        <Typography variant="small" className="font-normal">{t.auth.mypage}</Typography>
                                    </MenuItem>
                                    <hr className="my-2 border-blue-gray-50" />
                                    <MenuItem className="flex items-center gap-2 rounded" onClick={() => window.location.reload()}>
                                        <PowerIcon className="h-4 w-4" />
                                        <Typography variant="small" className="font-normal">{t.auth.logout}</Typography>
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        )}
                    </div>
                </div>

                {/* 모바일 햄버거 버튼 */}
                <div
                    className="lg:hidden"
                    onClick={handleBurgerClick}
                    role="button"
                    tabIndex={0}
                    style={{
                        padding: "8px",
                        cursor: "pointer",
                        WebkitTapHighlightColor: "transparent",
                        touchAction: "manipulation",
                        userSelect: "none",
                    }}
                    aria-label="메뉴 열기"
                >
                    <Bars3Icon className={`h-6 w-6 ${textColor}`} strokeWidth={2} />
                </div>
            </div>
        </header>
    );
};

export default Header;
