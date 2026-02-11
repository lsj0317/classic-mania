import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { currentUser } from "../data/mockData";
import { useLanguageStore, type Language } from "../stores/languageStore";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { ChevronDown, Globe, User, LogOut, Menu } from "lucide-react";

interface HeaderProps {
    onMenuOpen: () => void;
}

type NavItem =
    | { type: "link"; name: string; path: string }
    | { type: "group"; name: string; children: { name: string; path: string }[] };

const Header = ({ onMenuOpen }: HeaderProps) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [openGroup, setOpenGroup] = useState<string | null>(null);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { language, t, setLanguage } = useLanguageStore();
    const groupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const NAV_MENU: NavItem[] = [
        { type: "link", name: t.nav.home, path: "/" },
        { type: "link", name: t.nav.board, path: "/board" },
        {
            type: "group",
            name: t.nav.showAndTicket,
            children: [
                { name: t.nav.performance, path: "/performance" },
                { name: t.nav.ticket, path: "/ticket-info" },
            ],
        },
        {
            type: "group",
            name: t.nav.artistAndNews,
            children: [
                { name: t.nav.artist, path: "/artist" },
                { name: t.nav.news, path: "/news" },
            ],
        },
    ];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isLoggedIn = currentUser && currentUser.userId !== "" && currentUser.userId !== "guest";
    const textColor = isScrolled ? "text-foreground" : "text-white";
    const navBg = isScrolled
        ? "bg-background/90 backdrop-blur-md shadow-sm border-b"
        : "bg-black/95";

    const LANG_OPTIONS: { code: Language; label: string }[] = [
        { code: "ko", label: t.language.ko },
        { code: "en", label: t.language.en },
    ];

    const handleGroupEnter = (name: string) => {
        if (groupTimeoutRef.current) {
            clearTimeout(groupTimeoutRef.current);
            groupTimeoutRef.current = null;
        }
        setOpenGroup(name);
    };

    const handleGroupLeave = () => {
        groupTimeoutRef.current = setTimeout(() => {
            setOpenGroup(null);
        }, 150);
    };

    const isChildActive = (children: { path: string }[]) =>
        children.some((c) => pathname === c.path);

    return (
        <header
            className={`sticky top-0 z-50 h-16 md:h-20 flex items-center px-4 py-0 transition-all duration-500 ${navBg}`}
        >
            <div className="container mx-auto flex items-center justify-between max-w-screen-xl">
                {/* 로고 */}
                <div className="flex-1 flex justify-start">
                    <Link to="/">
                        <span className={`cursor-pointer py-1.5 font-bold text-xl md:text-2xl tracking-tighter transition-colors w-max ${textColor}`}>
                            Classic Mania
                        </span>
                    </Link>
                </div>

                {/* 데스크톱 메뉴 */}
                <div className="hidden md:flex items-center gap-6 lg:gap-8">
                    <ul className="flex items-center gap-4 lg:gap-8">
                        {NAV_MENU.map((item) => {
                            if (item.type === "link") {
                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            className={`text-sm font-semibold transition-colors hover:text-primary/70 whitespace-nowrap ${textColor}`}
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                );
                            }

                            const isOpen = openGroup === item.name;
                            const hasActive = isChildActive(item.children);

                            return (
                                <li
                                    key={item.name}
                                    className="relative"
                                    onMouseEnter={() => handleGroupEnter(item.name)}
                                    onMouseLeave={handleGroupLeave}
                                >
                                    <button
                                        className={`flex items-center gap-1 text-sm font-semibold transition-colors hover:text-primary/70 whitespace-nowrap ${hasActive ? "text-primary" : textColor}`}
                                        onClick={() => setOpenGroup(isOpen ? null : item.name)}
                                    >
                                        {item.name}
                                        <ChevronDown
                                            className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>

                                    {/* 드롭다운 */}
                                    <div
                                        className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1"}`}
                                    >
                                        <div className="bg-background border rounded-lg shadow-lg py-1 min-w-[140px]">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.path}
                                                    to={child.path}
                                                    onClick={() => setOpenGroup(null)}
                                                    className={`block px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent ${pathname === child.path ? "text-primary bg-accent/50" : "text-foreground"}`}
                                                >
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* 데스크톱 유저 영역 + 언어 선택 */}
                <div className="hidden md:flex flex-1 justify-end">
                    <div className="flex items-center gap-3">
                        {/* 언어 드롭다운 */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className={`gap-1.5 ${textColor} hover:bg-white/10`}>
                                    <Globe className="h-4 w-4" />
                                    <span className="text-xs font-bold">
                                        {language === "ko" ? "KO" : "EN"}
                                    </span>
                                    <ChevronDown className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="min-w-[120px]">
                                {LANG_OPTIONS.map((opt) => (
                                    <DropdownMenuItem
                                        key={opt.code}
                                        className={language === opt.code ? "bg-accent font-bold" : ""}
                                        onClick={() => setLanguage(opt.code)}
                                    >
                                        {opt.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {!isLoggedIn ? (
                            <Link to="/login">
                                <Button size="sm" className={isScrolled ? "" : "bg-white text-black hover:bg-white/90"}>
                                    {t.auth.login}
                                </Button>
                            </Link>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className={`gap-2 px-2 ${textColor} hover:bg-white/10`}>
                                        {currentUser.profileImage ? (
                                            <Avatar className={`h-8 w-8 border-2 ${isScrolled ? "border-primary" : "border-white"}`}>
                                                <AvatarImage src={currentUser.profileImage} alt={currentUser.name} />
                                                <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                                            </Avatar>
                                        ) : (
                                            <User className={`h-8 w-8 ${isScrolled ? "text-primary" : "text-white"}`} />
                                        )}
                                        <span className="text-sm font-semibold">
                                            {currentUser.userId} {t.auth.honorific}
                                        </span>
                                        <ChevronDown className="h-3 w-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => navigate("/mypage")} className="gap-2">
                                        <User className="h-4 w-4" />
                                        {t.auth.mypage}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => window.location.reload()} className="gap-2">
                                        <LogOut className="h-4 w-4" />
                                        {t.auth.logout}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>

                {/* 모바일 햄버거 버튼 */}
                <button
                    className="md:hidden p-2"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onMenuOpen();
                    }}
                    aria-label="메뉴 열기"
                >
                    <Menu className={`h-6 w-6 ${textColor}`} />
                </button>
            </div>
        </header>
    );
};

export default Header;
