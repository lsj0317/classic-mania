'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { currentUser } from "../data/mockData";
import { useLanguageStore, type Language } from "../stores/languageStore";
import { X, ChevronDown, Globe } from "lucide-react";
import { Button } from "./ui/button";

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

type NavItem =
    | { type: "link"; name: string; path: string }
    | { type: "group"; name: string; children: { name: string; path: string }[] };

const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
    const pathname = usePathname();
    const { language, t, setLanguage } = useLanguageStore();
    const isLoggedIn = currentUser && currentUser.userId !== "" && currentUser.userId !== "guest";
    const [openGroup, setOpenGroup] = useState<string | null>(null);

    const NAV_ITEMS: NavItem[] = [
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

    const LANG_OPTIONS: { code: Language; label: string }[] = [
        { code: "ko", label: t.language.ko },
        { code: "en", label: t.language.en },
    ];

    const toggleGroup = (name: string) => {
        setOpenGroup((prev) => (prev === name ? null : name));
    };

    const isChildActive = (children: { path: string }[]) =>
        children.some((c) => pathname === c.path);

    return (
        <>
            {/* 오버레이 */}
            {isOpen && (
                <div
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="fixed inset-0 bg-black/50 z-[99998]"
                />
            )}

            {/* 사이드 패널 */}
            <div
                className={`fixed top-0 right-0 bottom-0 w-[280px] max-w-[85vw] bg-background flex flex-col overflow-y-auto z-[99999] transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0 shadow-2xl" : "translate-x-full"}`}
            >
                {/* 헤더 */}
                <div className="flex items-center justify-between p-5 border-b">
                    <span className="font-bold text-lg">{t.sideMenu.title}</span>
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1.5 rounded-full hover:bg-accent">
                        <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>

                {/* 유저 프로필 */}
                <div className="p-5 border-b">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-3">
                            <img
                                src={currentUser.profileImage || "/placeholder-avatar.jpg"}
                                alt={currentUser.name}
                                className="w-11 h-11 rounded-full object-cover border-2 border-border"
                            />
                            <div>
                                <div className="font-bold text-sm">{currentUser.userId} {t.auth.honorific}</div>
                                <div className="text-xs text-muted-foreground">{t.auth.welcome}</div>
                            </div>
                        </div>
                    ) : (
                        <Link href="/login" onClick={onClose}>
                            <Button className="w-full">{t.auth.login}</Button>
                        </Link>
                    )}
                </div>

                {/* 네비게이션 */}
                <nav className="p-3 flex-1">
                    {NAV_ITEMS.map((item) => {
                        if (item.type === "link") {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={onClose}
                                    className={`flex items-center px-4 py-3 rounded-lg mb-1 text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"}`}
                                >
                                    {item.name}
                                </Link>
                            );
                        }

                        const isExpanded = openGroup === item.name;
                        const hasActive = isChildActive(item.children);

                        return (
                            <div key={item.name} className="mb-1">
                                {/* 그룹 헤더 (아코디언 토글) */}
                                <button
                                    onClick={() => toggleGroup(item.name)}
                                    className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${hasActive ? "text-primary" : "text-foreground hover:bg-accent"}`}
                                >
                                    <span className="flex-1 text-left">{item.name}</span>
                                    <ChevronDown
                                        className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {/* 하위 메뉴 (아코디언 콘텐츠) */}
                                <div
                                    className={`overflow-hidden transition-all duration-200 ease-in-out ${isExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                                >
                                    <div className="ml-4 pl-4 border-l-2 border-border">
                                        {item.children.map((child) => {
                                            const isActive = pathname === child.path;
                                            return (
                                                <Link
                                                    key={child.path}
                                                    href={child.path}
                                                    onClick={onClose}
                                                    className={`flex items-center px-4 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"}`}
                                                >
                                                    {child.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </nav>

                {/* 언어 선택 */}
                <div className="px-4 py-3 border-t">
                    <div className="flex items-center gap-2 mb-2 px-1">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-semibold text-muted-foreground">{t.language.label}</span>
                    </div>
                    <div className="flex gap-2">
                        {LANG_OPTIONS.map((opt) => (
                            <button
                                key={opt.code}
                                onClick={() => setLanguage(opt.code)}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${language === opt.code ? "bg-primary text-primary-foreground border-2 border-primary font-bold" : "bg-background border border-border text-foreground hover:bg-accent"}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 하단 유틸리티 */}
                {isLoggedIn && (
                    <div className="p-4 border-t">
                        <Link
                            href="/mypage"
                            onClick={onClose}
                            className={`flex items-center px-4 py-3 rounded-lg mb-1 text-sm font-medium transition-colors ${pathname === "/mypage" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"}`}
                        >
                            {t.auth.mypage}
                        </Link>
                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
                        >
                            {t.auth.logout}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default SideMenu;
