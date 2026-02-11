import { useState, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import PageTransition from "./PageTransition";
import SideMenu from "./SideMenu";

const Layout = () => {
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const { pathname } = useLocation();
    const isHome = pathname === "/";

    const openSideMenu = useCallback(() => {
        setIsSideMenuOpen(true);
    }, []);

    const closeSideMenu = useCallback(() => {
        setIsSideMenuOpen(false);
    }, []);

    return (
        <>
            {/* 메인 레이아웃 */}
            <div className="flex min-h-screen flex-col">
                <Header onMenuOpen={openSideMenu} />
                <main className={isHome ? "flex-grow" : "flex-grow container mx-auto px-4 py-6 lg:py-8 max-w-screen-xl"}>
                    <PageTransition>
                        <Outlet />
                    </PageTransition>
                </main>
                <Footer />
            </div>

            {/* 사이드 메뉴 - flex 컨테이너 바깥에서 렌더 */}
            <SideMenu isOpen={isSideMenuOpen} onClose={closeSideMenu} />
        </>
    );
};

export default Layout;
