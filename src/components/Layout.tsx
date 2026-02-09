import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import PageTransition from "./PageTransition";

const Layout = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-6 lg:py-8 max-w-screen-xl">
                <PageTransition>
                    <Outlet />
                </PageTransition>
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
