import { Link, useLocation } from "react-router-dom";
import { HomeIcon, TableCellsIcon, MapIcon, UserIcon } from "@heroicons/react/24/outline";

const BottomNav = () => {
    const { pathname } = useLocation();

    const navItems = [
        { name: "홈", path: "/", icon: HomeIcon },
        { name: "게시판", path: "/board", icon: TableCellsIcon },
        { name: "공연정보", path: "/performance", icon: MapIcon },
        { name: "마이", path: "/mypage", icon: UserIcon },
    ];

    return (
        // lg(960px) 이상에서는 숨김 처리 [cite: 2026-01-25]
        <div className="lg:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 flex items-center justify-around px-2 pb-safe">
            {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                    <Link key={item.path} to={item.path} className="flex flex-col items-center justify-center w-full h-full gap-1">
                        <item.icon
                            className={`h-6 w-6 transition-colors ${isActive ? "text-black" : "text-gray-300"}`}
                            strokeWidth={isActive ? 2 : 1.5}
                        />
                        <span className={`text-[10px] font-bold ${isActive ? "text-black" : "text-gray-300"}`}>
              {item.name}
            </span>
                    </Link>
                );
            })}
        </div>
    );
};

export default BottomNav;