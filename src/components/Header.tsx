'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { currentUser } from "../data/mockData";
import { useLanguageStore, type Language } from "../stores/languageStore";
import { Button } from "./ui/button";
import ProfileAvatar from "./user/ProfileAvatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { ChevronDown, Globe, User, LogOut, Menu, Bell } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import NotificationModal from "./NotificationModal";

interface HeaderProps {
    onMenuOpen: () => void;
}

type NavItem =
    | { type: "link"; name: string; path: string }
    | { type: "group"; name: string; children: { name: string; path: string }[] };

const Header = ({ onMenuOpen }: HeaderProps) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [openGroup, setOpenGroup] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const { language, t, setLanguage } = useLanguageStore();
    const { unreadCount } = useUserStore();
    const groupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [notifModalOpen, setNotifModalOpen] = useState(false);

    const NAV_MENU: NavItem[] = [
        {
            type: "group",
            name: t.nav.performanceGroup,
            children: [
                { name: t.nav.performance, path: "/performance" },
                { name: t.nav.ticket, path: "/ticket-info" },
                { name: t.nav.calendar, path: "/calendar" },
            ],
        },
        {
            type: "group",
            name: t.nav.communityGroup,
            children: [
                { name: t.nav.board, path: "/board" },
                { name: t.nav.companion, path: "/companion" },
                { name: t.nav.meetup, path: "/meetup" },
                { name: t.nav.ticketTrade, path: "/ticket-trade" },
            ],
        },
        {
            type: "group",
            name: t.nav.artistGroup,
            children: [
                { name: t.nav.artist, path: "/artist" },
                { name: t.nav.news, path: "/news" },
            ],
        },
        {
            type: "group",
            name: t.nav.infoGroup,
            children: [
                { name: t.nav.learn, path: "/learn" },
                { name: t.nav.column, path: "/column" },
                { name: t.nav.venue, path: "/venue" },
                { name: t.nav.ticketInfo, path: "/ticket-info" },
            ],
        },
    ];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isLoggedIn = currentUser && currentUser.userId !== "" && currentUser.userId !== "guest";
    const textColor = isScrolled ? "text-foreground" : "text-white active:text-white focus:text-white";
    const hoverColor = isScrolled ? "hover:text-foreground/70" : "hover:text-white/70";
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
                    <Link href="/">
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
                                            href={item.path}
                                            className={`text-sm font-semibold transition-colors ${hoverColor} whitespace-nowrap select-none active:opacity-80 ${textColor}`}
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
                                        className={`flex items-center gap-1 text-sm font-semibold transition-colors ${hoverColor} whitespace-nowrap select-none focus:outline-none active:opacity-80 ${hasActive ? "text-primary" : textColor}`}
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
                                                    href={child.path}
                                                    onClick={() => setOpenGroup(null)}
                                                    className={`block px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent select-none ${pathname === child.path ? "text-primary bg-accent/50" : "text-foreground"}`}
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
                            <Link href="/login">
                                <Button size="sm" className={isScrolled ? "" : "bg-white text-black hover:bg-white/90"}>
                                    {t.auth.login}
                                </Button>
                            </Link>
                        ) : (
                            <>
                                {/* 알림 벨 버튼 */}
                                <button
                                    onClick={() => setNotifModalOpen(true)}
                                    className={`relative p-2 rounded-full transition-colors hover:bg-white/10 ${textColor}`}
                                    aria-label="알림"
                                >
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* 유저 드롭다운 */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className={`gap-2 px-2 ${textColor} hover:bg-white/10`}>
                                            <ProfileAvatar
                                                name={currentUser.name}
                                                nickname={currentUser.nickname}
                                                profileImage={currentUser.profileImage}
                                                profileIconType={currentUser.profileIconType}
                                                size="sm"
                                                className={`border-2 ${isScrolled ? "border-primary" : "border-white"}`}
                                            />
                                            <span className="text-sm font-semibold">
                                                {currentUser.userId} {t.auth.honorific}
                                            </span>
                                            <ChevronDown className="h-3 w-3" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="min-w-[180px]">
                                        <DropdownMenuItem onClick={() => router.push("/mypage")} className="gap-2">
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

                                {/* 알림 모달 */}
                                <NotificationModal open={notifModalOpen} onOpenChange={setNotifModalOpen} />
                            </>
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
