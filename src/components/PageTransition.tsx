import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
    children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
    const location = useLocation();
    const [displayChildren, setDisplayChildren] = useState(children);
    const [transitionState, setTransitionState] = useState<"enter" | "exit">("enter");
    const prevPathRef = useRef(location.pathname);

    useEffect(() => {
        if (location.pathname !== prevPathRef.current) {
            // 경로가 변경되면 exit 애니메이션 시작
            setTransitionState("exit");

            const timeout = setTimeout(() => {
                // exit 애니메이션이 끝난 후 새 컨텐츠 표시
                setDisplayChildren(children);
                setTransitionState("enter");
                prevPathRef.current = location.pathname;
                // 페이지 상단으로 스크롤
                window.scrollTo({ top: 0, behavior: "instant" });
            }, 150);

            return () => clearTimeout(timeout);
        } else {
            setDisplayChildren(children);
        }
    }, [location.pathname, children]);

    return (
        <div
            className={`page-transition ${
                transitionState === "enter" ? "page-enter" : "page-exit"
            }`}
        >
            {displayChildren}
        </div>
    );
};

export default PageTransition;
