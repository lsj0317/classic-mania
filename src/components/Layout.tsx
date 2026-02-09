import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import PageTransition from "./PageTransition";
import SideMenu from "./SideMenu";

const Layout = () => {
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

    // 의존성 배열을 []로 - 상태값을 캡처하지 않고 항상 true/false 세팅
    const openSideMenu = useCallback(() => {
        console.log("[Layout] openSideMenu 호출");
        setIsSideMenuOpen(true);
    }, []);

    const closeSideMenu = useCallback(() => {
        console.log("[Layout] closeSideMenu 호출");
        console.trace("[Layout] closeSideMenu 스택:");
        setIsSideMenuOpen(false);
    }, []);

    console.log("[Layout] 렌더링, isSideMenuOpen =", isSideMenuOpen);

    return (
        <>
            {/* 메인 레이아웃 */}
            <div className="flex min-h-screen flex-col">
                <Header onMenuOpen={openSideMenu} />
                <main className="flex-grow container mx-auto px-4 py-6 lg:py-8 max-w-screen-xl">
                    <PageTransition>
                        <Outlet />
                    </PageTransition>
                </main>
                <Footer />
            </div>

            {/* 사이드 메뉴 - flex 컨테이너 바깥에서 렌더 */}
            <SideMenu isOpen={isSideMenuOpen} onClose={closeSideMenu} />

            {/* 디버그 인디케이터 - 개발 확인용 (우측 하단에 상태 표시) */}
            <div
                style={{
                    position: "fixed",
                    bottom: "10px",
                    left: "10px",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: 700,
                    fontFamily: "monospace",
                    zIndex: 999999,
                    pointerEvents: "none",
                    backgroundColor: isSideMenuOpen ? "#22c55e" : "#ef4444",
                    color: "#fff",
                }}
            >
                MENU: {isSideMenuOpen ? "OPEN" : "CLOSED"}
            </div>
        </>
    );
};

export default Layout;
