import type { Metadata } from "next";
import Providers from "./providers";
import LayoutShell from "@/components/layout/LayoutShell";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://classic-mania.vercel.app';

export const metadata: Metadata = {
    title: {
        default: "Classic Mania - 클래식 음악 커뮤니티",
        template: "%s | Classic Mania",
    },
    description: "클래식 음악 커뮤니티 - 공연 정보, 아티스트, 리뷰, 뉴스를 한 곳에서. 클래식 공연 검색, 아티스트 팔로우, 공연 리뷰를 만나보세요.",
    keywords: ["클래식", "클래식 음악", "공연", "콘서트", "오케스트라", "리사이틀", "오페라", "아티스트", "클래식 커뮤니티"],
    icons: {
        icon: "/favicon.ico",
    },
    metadataBase: new URL(BASE_URL),
    openGraph: {
        type: "website",
        siteName: "Classic Mania",
        title: "Classic Mania - 클래식 음악 커뮤니티",
        description: "클래식 공연 정보, 아티스트, 리뷰, 뉴스를 한 곳에서 만나보세요.",
        url: BASE_URL,
        locale: "ko_KR",
    },
    twitter: {
        card: "summary_large_image",
        title: "Classic Mania - 클래식 음악 커뮤니티",
        description: "클래식 공연 정보, 아티스트, 리뷰, 뉴스를 한 곳에서 만나보세요.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <Providers>
                    <LayoutShell>{children}</LayoutShell>
                </Providers>
            </body>
        </html>
    );
}
