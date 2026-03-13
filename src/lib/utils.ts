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
