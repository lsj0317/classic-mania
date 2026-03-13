'use client';

import { useState, useCallback } from "react";
import Header from "../Header";
import Footer from "../Footer";
import SideMenu from "../SideMenu";
import BottomNav from "../BottomNav";

const LayoutShell = ({ children }: { children: React.ReactNode }) => {
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

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
                <main className="flex-grow">
                    {children}
                </main>
                <Footer />
            </div>
            <SideMenu isOpen={isSideMenuOpen} onClose={closeSideMenu} />
            <BottomNav />
        </>
    );
};

export default LayoutShell;
