import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
} from "@heroicons/react/24/outline";
import { currentUser } from "../data/mockData";

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const NAV_ITEMS = [
    { name: "홈", path: "/", icon: HomeIcon },
    { name: "게시판", path: "/board", icon: TableCellsIcon },
    { name: "공연정보", path: "/performance", icon: MusicalNoteIcon },
    { name: "티켓정보", path: "/ticket-info", icon: TicketIcon },
    { name: "뉴스", path: "/news", icon: NewspaperIcon },
];

const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
    const { pathname } = useLocation();
    const isLoggedIn = currentUser && currentUser.userId !== "" && currentUser.userId !== "guest";
    const prevPathRef = useRef(pathname);

    // 경로 변경 시 메뉴 닫기
    useEffect(() => {
        if (prevPathRef.current !== pathname) {
            prevPathRef.current = pathname;
            onClose();
        }
    }, [pathname, onClose]);

    // body 스크롤 방지 + ESC 닫기
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            const handleKey = (e: KeyboardEvent) => {
                if (e.key === "Escape") onClose();
            };
            document.addEventListener("keydown", handleKey);
            return () => {
                document.body.style.overflow = "";
                document.removeEventListener("keydown", handleKey);
            };
        } else {
            document.body.style.overflow = "";
        }
    }, [isOpen, onClose]);

    const content = (
        <div
            id="side-menu-root"
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 99999,
                pointerEvents: isOpen ? "auto" : "none",
                visibility: isOpen ? "visible" : "hidden",
            }}
        >
            {/* 오버레이 */}
            <div
                onClick={onClose}
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.5)",
                    opacity: isOpen ? 1 : 0,
                    transition: "opacity 0.3s ease",
                }}
            />

            {/* 사이드 패널 */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: "280px",
                    maxWidth: "85vw",
                    background: "#fff",
                    boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
                    transform: isOpen ? "translateX(0)" : "translateX(100%)",
                    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                }}
            >
                {/* 헤더 */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ fontWeight: 700, fontSize: "18px" }}>Menu</span>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ padding: "6px", borderRadius: "50%", border: "none", background: "transparent", cursor: "pointer", display: "flex" }}
                    >
                        <XMarkIcon style={{ width: "20px", height: "20px", color: "#6b7280" }} />
                    </button>
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
                                <div style={{ fontWeight: 700, fontSize: "14px" }}>{currentUser.userId} 님</div>
                                <div style={{ fontSize: "12px", color: "#9ca3af" }}>환영합니다</div>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" onClick={onClose} style={{ display: "block" }}>
                            <button
                                type="button"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    background: "#000",
                                    color: "#fff",
                                    border: "none",
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    cursor: "pointer",
                                }}
                            >
                                로그인
                            </button>
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
                                onClick={onClose}
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
                                    transition: "background 0.15s",
                                }}
                            >
                                <Icon style={{ width: "20px", height: "20px" }} strokeWidth={isActive ? 2 : 1.5} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* 하단 유틸리티 */}
                {isLoggedIn && (
                    <div style={{ padding: "16px", borderTop: "1px solid #f3f4f6" }}>
                        <Link
                            to="/mypage"
                            onClick={onClose}
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
                            마이페이지
                        </Link>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px 16px",
                                borderRadius: "8px",
                                width: "100%",
                                border: "none",
                                background: "transparent",
                                color: "#374151",
                                fontWeight: 500,
                                fontSize: "14px",
                                cursor: "pointer",
                                textAlign: "left",
                            }}
                        >
                            <ArrowRightOnRectangleIcon style={{ width: "20px", height: "20px" }} />
                            로그아웃
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(content, document.body);
};

export default SideMenu;
