'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguageStore } from "../stores/languageStore";
import { Home, LayoutGrid, Map, User } from "lucide-react";

const BottomNav = () => {
    const pathname = usePathname();
    const { t } = useLanguageStore();

    const navItems = [
        { name: t.bottomNav.home, path: "/", icon: Home },
        { name: t.bottomNav.board, path: "/board", icon: LayoutGrid },
        { name: t.bottomNav.performance, path: "/performance", icon: Map },
        { name: t.bottomNav.my, path: "/mypage", icon: User },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t flex items-center justify-around px-2 pb-safe">
            {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                    <Link key={item.path} href={item.path} className="flex flex-col items-center justify-center w-full h-full gap-1">
                        <item.icon
                            className={`h-6 w-6 transition-colors ${isActive ? "text-foreground" : "text-muted-foreground/40"}`}
                            strokeWidth={isActive ? 2 : 1.5}
                        />
                        <span className={`text-[10px] font-bold ${isActive ? "text-foreground" : "text-muted-foreground/40"}`}>
                            {item.name}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
};

export default BottomNav;
