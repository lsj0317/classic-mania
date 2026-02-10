import { Link, useLocation } from "react-router-dom";
import {
    XMarkIcon,
    HomeIcon,
    TableCellsIcon,
    MusicalNoteIcon,
    TicketIcon,
    NewspaperIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { currentUser } from "../data/mockData";
import { useLanguageStore, type Language } from "../stores/languageStore";

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
    const { pathname } = useLocation();
    const { language, t, setLanguage } = useLanguageStore();
    const isLoggedIn = currentUser && currentUser.userId !== "" && currentUser.userId !== "guest";

    const NAV_ITEMS = [
        { name: t.nav.home, path: "/", icon: HomeIcon },
        { name: t.nav.board, path: "/board", icon: TableCellsIcon },
        { name: t.nav.performance, path: "/performance", icon: MusicalNoteIcon },
        { name: t.nav.ticket, path: "/ticket-info", icon: TicketIcon },
        { name: t.nav.news, path: "/news", icon: NewspaperIcon },
    ];

    const LANG_OPTIONS: { code: Language; label: string }[] = [
        { code: "ko", label: t.language.ko },
        { code: "en", label: t.language.en },
    ];

    const handleOverlayClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose();
    };

    const handleCloseClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose();
    };

    const handleNavClick = () => {
        onClose();
    };

    return (
        <>
            {/* 오버레이 */}
            {isOpen && (
                <div
                    data-testid="side-menu-overlay"
                    onClick={handleOverlayClick}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        zIndex: 99998,
                    }}
                />
            )}

            {/* 사이드 패널 */}
            <div
                data-testid="side-menu-panel"
                data-open={isOpen}
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: "280px",
                    maxWidth: "85vw",
                    backgroundColor: "#ffffff",
                    boxShadow: isOpen ? "-4px 0 24px rgba(0,0,0,0.12)" : "none",
                    transform: isOpen ? "translateX(0%)" : "translateX(100%)",
                    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    zIndex: 99999,
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                }}
            >
                {/* 헤더 */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ fontWeight: 700, fontSize: "18px", color: "#111" }}>{t.sideMenu.title}</span>
                    <div
                        onClick={handleCloseClick}
                        role="button"
                        style={{ padding: "6px", borderRadius: "50%", cursor: "pointer", display: "flex" }}
                    >
                        <XMarkIcon style={{ width: "20px", height: "20px", color: "#6b7280" }} />
                    </div>
                </div>

                {/* 유저 프로필 */}
                <div style={{ padding: "20px", borderBottom: "1px solid #f3f4f6" }}>
                    {isLoggedIn ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <img
                                src={currentUser.profileImage || "https://docs.material-tailwind.com/img/face-2.jpg"}
                                alt={currentUser.name}
                                style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", border: "2px solid #e5e7eb" }}
                            />
                            <div>
                                <div style={{ fontWeight: 700, fontSize: "14px", color: "#111" }}>{currentUser.userId} {t.auth.honorific}</div>
                                <div style={{ fontSize: "12px", color: "#9ca3af" }}>{t.auth.welcome}</div>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" onClick={handleNavClick} style={{ display: "block", textDecoration: "none" }}>
                            <div
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    background: "#000",
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    textAlign: "center",
                                }}
                            >
                                {t.auth.login}
                            </div>
                        </Link>
                    )}
                </div>

                {/* 네비게이션 */}
                <nav style={{ padding: "12px", flex: 1 }}>
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={handleNavClick}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "12px 16px",
                                    borderRadius: "8px",
                                    textDecoration: "none",
                                    marginBottom: "4px",
                                    background: isActive ? "#000" : "transparent",
                                    color: isActive ? "#fff" : "#374151",
                                    fontWeight: 500,
                                    fontSize: "14px",
                                }}
                            >
                                <Icon style={{ width: "20px", height: "20px" }} strokeWidth={isActive ? 2 : 1.5} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* 언어 선택 */}
                <div style={{ padding: "12px 16px", borderTop: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", padding: "0 4px" }}>
                        <GlobeAltIcon style={{ width: "18px", height: "18px", color: "#6b7280" }} />
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#6b7280" }}>{t.language.label}</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                        {LANG_OPTIONS.map((opt) => (
                            <button
                                key={opt.code}
                                onClick={() => setLanguage(opt.code)}
                                style={{
                                    flex: 1,
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    border: language === opt.code ? "2px solid #000" : "1px solid #e5e7eb",
                                    background: language === opt.code ? "#000" : "#fff",
                                    color: language === opt.code ? "#fff" : "#374151",
                                    fontWeight: language === opt.code ? 700 : 500,
                                    fontSize: "13px",
                                    cursor: "pointer",
                                    transition: "all 0.15s ease",
                                }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 하단 유틸리티 */}
                {isLoggedIn && (
                    <div style={{ padding: "16px", borderTop: "1px solid #f3f4f6" }}>
                        <Link
                            to="/mypage"
                            onClick={handleNavClick}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px 16px",
                                borderRadius: "8px",
                                textDecoration: "none",
                                marginBottom: "4px",
                                background: pathname === "/mypage" ? "#000" : "transparent",
                                color: pathname === "/mypage" ? "#fff" : "#374151",
                                fontWeight: 500,
                                fontSize: "14px",
                            }}
                        >
                            <UserCircleIcon style={{ width: "20px", height: "20px" }} />
                            {t.auth.mypage}
                        </Link>
                        <div
                            onClick={() => window.location.reload()}
                            role="button"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px 16px",
                                borderRadius: "8px",
                                width: "100%",
                                color: "#374151",
                                fontWeight: 500,
                                fontSize: "14px",
                                cursor: "pointer",
                            }}
                        >
                            <ArrowRightOnRectangleIcon style={{ width: "20px", height: "20px" }} />
                            {t.auth.logout}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SideMenu;
