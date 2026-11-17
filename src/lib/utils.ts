import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** 날짜 문자열을 YYYY.MM.DD 형식으로 포맷팅 */
export function formatDateYMD(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

/** HTML 엔티티 디코딩 및 태그 제거 (네이버 뉴스 API 응답용) */
export function decodeHtml(html: string): string {
    if (typeof document === 'undefined') {
        return html.replace(/<[^>]*>?/gm, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
    }
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value.replace(/<[^>]*>?/gm, '');
}

/**
 * 동시에 최대 `limit`개씩만 비동기 작업을 실행한다 (외부 API 요청 제한(429) 방지).
 * 결과는 입력 순서대로 Promise.allSettled 형식으로 돌려준다.
 */
export async function mapSettledWithLimit<T, R>(
    items: T[],
    limit: number,
    fn: (item: T, index: number) => Promise<R>
): Promise<PromiseSettledResult<R>[]> {
    const results: PromiseSettledResult<R>[] = new Array(items.length);
    let next = 0;
    const worker = async () => {
        while (next < items.length) {
            const i = next++;
            try {
                results[i] = { status: 'fulfilled', value: await fn(items[i], i) };
            } catch (reason) {
                results[i] = { status: 'rejected', reason };
            }
        }
    };
    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
    return results;
}
