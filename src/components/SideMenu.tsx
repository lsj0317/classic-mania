import { Link, useLocation } from "react-router-dom";
import { currentUser } from "../data/mockData";
import { useLanguageStore, type Language } from "../stores/languageStore";
import { X, Home, LayoutGrid, Music, Ticket, Newspaper, User, LogOut, Globe, Users } from "lucide-react";
import { Button } from "./ui/button";

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
    const { pathname } = useLocation();
    const { language, t, setLanguage } = useLanguageStore();
    const isLoggedIn = currentUser && currentUser.userId !== "" && currentUser.userId !== "guest";

    const NAV_ITEMS = [
        { name: t.nav.home, path: "/", icon: Home },
        { name: t.nav.board, path: "/board", icon: LayoutGrid },
        { name: t.nav.performance, path: "/performance", icon: Music },
        { name: t.nav.artist, path: "/artist", icon: Users },
        { name: t.nav.ticket, path: "/ticket-info", icon: Ticket },
        { name: t.nav.news, path: "/news", icon: Newspaper },
    ];

    const LANG_OPTIONS: { code: Language; label: string }[] = [
        { code: "ko", label: t.language.ko },
        { code: "en", label: t.language.en },
    ];

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
                        <Link to="/login" onClick={onClose}>
                            <Button className="w-full">{t.auth.login}</Button>
                        </Link>
                    )}
                </div>

                {/* 네비게이션 */}
                <nav className="p-3 flex-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"}`}
                            >
                                <Icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.5} />
                                {item.name}
                            </Link>
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
                            to="/mypage"
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-sm font-medium transition-colors ${pathname === "/mypage" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"}`}
                        >
                            <User className="h-5 w-5" />
                            {t.auth.mypage}
                        </Link>
                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                            {t.auth.logout}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default SideMenu;
