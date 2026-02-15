'use client';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <h1 className="text-2xl font-bold mb-4">오류가 발생했습니다</h1>
            <p className="text-muted-foreground mb-6">
                페이지를 불러오는 중 문제가 발생했습니다.
            </p>
            <button
                onClick={reset}
                className="px-6 py-2 bg-primary text-primary-foreground font-medium"
            >
                다시 시도
            </button>
        </div>
    );
}
