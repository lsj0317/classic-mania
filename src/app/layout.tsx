import type { Metadata } from "next";
import Providers from "./providers";
import LayoutShell from "@/components/layout/LayoutShell";
import "./globals.css";

export const metadata: Metadata = {
    title: "Classic Mania",
    description: "클래식 음악 커뮤니티 - 공연, 아티스트, 뉴스",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <body>
                <Providers>
                    <LayoutShell>{children}</LayoutShell>
                </Providers>
            </body>
        </html>
    );
}
