import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import PageTransition from "./PageTransition";
import SideMenu from "./SideMenu";

const Layout = () => {
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
                <main className="flex-grow container mx-auto px-4 py-6 lg:py-8 max-w-screen-xl">
                    <PageTransition>
                        <Outlet />
                    </PageTransition>
                </main>
                <Footer />
            </div>

            {/* 사이드 메뉴 - createPortal로 document.body에 렌더링 */}
            <SideMenu isOpen={isSideMenuOpen} onClose={closeSideMenu} />
        </>
    );
};

export default Layout;
