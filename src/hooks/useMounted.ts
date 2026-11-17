import { useEffect, useState } from 'react';

/**
 * 클라이언트에 마운트된 뒤에만 true.
 * "오늘 날짜"처럼 서버(또는 빌드 시점)와 브라우저에서 값이 달라지는 UI를
 * 하이드레이션 이후에 그릴 때 사용한다.
 */
export function useMounted(): boolean {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return mounted;
}
