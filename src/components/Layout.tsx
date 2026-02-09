import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import PageTransition from "./PageTransition";
import SideMenu from "./SideMenu";

const Layout = () => {
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

    const openSideMenu = useCallback(() => {
        console.log("[Layout] openSideMenu 호출됨, 현재:", isSideMenuOpen, "→ true로 변경");
        setIsSideMenuOpen(true);
    }, [isSideMenuOpen]);

    const closeSideMenu = useCallback(() => {
        console.log("[Layout] closeSideMenu 호출됨, 현재:", isSideMenuOpen, "→ false로 변경");
        console.trace("[Layout] closeSideMenu 호출 스택:");
        setIsSideMenuOpen(false);
    }, [isSideMenuOpen]);

    console.log("[Layout] 렌더링, isSideMenuOpen =", isSideMenuOpen);

    return (
        <div className="flex min-h-screen flex-col">
            <Header onMenuOpen={openSideMenu} />
            <main className="flex-grow container mx-auto px-4 py-6 lg:py-8 max-w-screen-xl">
                <PageTransition>
                    <Outlet />
                </PageTransition>
            </main>
            <Footer />
            <SideMenu isOpen={isSideMenuOpen} onClose={closeSideMenu} />
        </div>
    );
};

export default Layout;
