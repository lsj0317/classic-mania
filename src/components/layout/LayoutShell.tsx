'use client';

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Header from "../Header";
import Footer from "../Footer";
import SideMenu from "../SideMenu";
import BottomNav from "../BottomNav";

const LayoutShell = ({ children }: { children: React.ReactNode }) => {
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === "/";

    const openSideMenu = useCallback(() => {
        setIsSideMenuOpen(true);
    }, []);

    const closeSideMenu = useCallback(() => {
        setIsSideMenuOpen(false);
    }, []);

    return (
        <>
            <div className="flex min-h-screen flex-col">
                <Header onMenuOpen={openSideMenu} />
                <main className={isHome ? "flex-grow" : "flex-grow container mx-auto px-4 py-6 lg:py-8 max-w-screen-xl"}>
                    <div className="page-transition page-enter">
                        {children}
                    </div>
                </main>
                <Footer />
            </div>
            <SideMenu isOpen={isSideMenuOpen} onClose={closeSideMenu} />
            <BottomNav />
        </>
    );
};

export default LayoutShell;
