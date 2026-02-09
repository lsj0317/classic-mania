import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { Typography, Avatar, Button } from "@material-tailwind/react";
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

    // 경로 변경 시 메뉴 닫기 (초기 마운트 제외)
    const prevPathRef = useRef(pathname);
    useEffect(() => {
        if (prevPathRef.current !== pathname) {
            prevPathRef.current = pathname;
            onClose();
        }
    }, [pathname, onClose]);

    // 메뉴 열릴 때 body 스크롤 방지
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // ESC 키로 메뉴 닫기
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    const menuContent = (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 9999, pointerEvents: isOpen ? "auto" : "none" }}>
            {/* 오버레이 */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(4px)",
                    transition: "opacity 300ms ease",
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? "auto" : "none",
                }}
                onClick={onClose}
            />

            {/* 사이드 메뉴 패널 */}
            <aside
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    height: "100%",
                    width: "288px",
                    backgroundColor: "#fff",
                    boxShadow: isOpen ? "-4px 0 24px rgba(0,0,0,0.15)" : "none",
                    transform: isOpen ? "translateX(0)" : "translateX(100%)",
                    transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                    zIndex: 10000,
                    overflowY: "auto",
                }}
            >
                {/* 상단 헤더 */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <Typography className="font-bold text-lg tracking-tight">
                        Menu
                    </Typography>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="메뉴 닫기"
                    >
                        <XMarkIcon className="h-5 w-5 text-gray-600" />
                    </button>
                </div>

                {/* 유저 프로필 영역 */}
                <div className="p-5 border-b border-gray-100">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-3">
                            <Avatar
                                variant="circular"
                                size="md"
                                alt={currentUser.name}
                                className="border-2 border-gray-200 p-0.5"
                                src={currentUser.profileImage || "https://docs.material-tailwind.com/img/face-2.jpg"}
                            />
                            <div>
                                <Typography className="font-bold text-sm">
                                    {currentUser.userId} 님
                                </Typography>
                                <Typography className="text-xs text-gray-500">
                                    환영합니다
                                </Typography>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" onClick={onClose}>
                            <Button size="sm" className="w-full bg-black rounded-none">
                                로그인
                            </Button>
                        </Link>
                    )}
                </div>

                {/* 네비게이션 메뉴 */}
                <nav className="p-3">
                    <ul className="flex flex-col gap-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                            isActive
                                                ? "bg-black text-white"
                                                : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                    >
                                        <item.icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.5} />
                                        <span className="font-medium text-sm">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* 하단 유틸리티 */}
                {isLoggedIn && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
                        <ul className="flex flex-col gap-1">
                            <li>
                                <Link
                                    to="/mypage"
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                        pathname === "/mypage"
                                            ? "bg-black text-white"
                                            : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    <UserCircleIcon className="h-5 w-5" />
                                    <span className="font-medium text-sm">마이페이지</span>
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                                >
                                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                    <span className="font-medium text-sm">로그아웃</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </aside>
        </div>
    );

    return createPortal(menuContent, document.body);
};

export default SideMenu;
