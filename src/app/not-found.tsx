import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <h1 className="text-4xl font-bold mb-2">404</h1>
            <p className="text-muted-foreground mb-6">
                요청하신 페이지를 찾을 수 없습니다.
            </p>
            <Link
                href="/"
                className="px-6 py-2 bg-primary text-primary-foreground font-medium"
            >
                홈으로 돌아가기
            </Link>
        </div>
    );
}
