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

    console.log("[SideMenu] 렌더링, isOpen =", isOpen);

    const handleOverlayClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log("[SideMenu] 오버레이 클릭됨 → onClose 호출");
        onClose();
    };

    const handleCloseClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log("[SideMenu] X 버튼 클릭됨 → onClose 호출");
        onClose();
    };

    const handleNavClick = () => {
        console.log("[SideMenu] 네비게이션 항목 클릭됨 → onClose 호출");
        onClose();
    };

    return (
        <>
            {/* 오버레이 - isOpen일 때만 렌더 */}
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

            {/* 사이드 패널 - 항상 렌더하되 transform으로 토글 */}
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
                    <span style={{ fontWeight: 700, fontSize: "18px", color: "#111" }}>Menu</span>
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
                                <div style={{ fontWeight: 700, fontSize: "14px", color: "#111" }}>{currentUser.userId} 님</div>
                                <div style={{ fontSize: "12px", color: "#9ca3af" }}>환영합니다</div>
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
                                로그인
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
                            마이페이지
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
                            로그아웃
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SideMenu;
