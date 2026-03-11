import type { Performance } from '../types';

// 날짜 문자열을 ICS 형식으로 변환 (YYYY.MM.DD → YYYYMMDD)
function toICSDate(dateStr: string): string {
    if (!dateStr) return '';
    // YYYY.MM.DD 또는 YYYY-MM-DD 형식 지원
    const clean = dateStr.replace(/[.\-]/g, '');
    // 시간 부분 제거
    return clean.slice(0, 8);
}

function escapeICS(str: string): string {
    return str
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n');
}

// 단일 공연 ICS 생성
export function generateICS(performance: Performance): string {
    const uid = `${performance.id}-${Date.now()}@classicmania.kr`;
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const startDate = performance.startDate
        ? toICSDate(performance.startDate)
        : toICSDate(performance.period?.split('~')[0]?.trim() || '');
    const endDate = performance.endDate
        ? toICSDate(performance.endDate)
        : startDate;

    const dtStart = startDate ? `DTSTART;VALUE=DATE:${startDate}` : '';
    const dtEnd = endDate ? `DTEND;VALUE=DATE:${endDate}` : '';

    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//ClassicMania//KR',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${now}`,
        dtStart,
        dtEnd,
        `SUMMARY:${escapeICS(performance.title)}`,
        `LOCATION:${escapeICS(performance.place || '')}`,
        `DESCRIPTION:${escapeICS(
            [
                performance.synopsis?.slice(0, 200) || '',
                performance.cast ? `출연: ${performance.cast}` : '',
                performance.bookingUrl ? `예매: ${performance.bookingUrl}` : '',
            ]
                .filter(Boolean)
                .join('\\n')
        )}`,
        'END:VEVENT',
        'END:VCALENDAR',
    ].filter(Boolean);

    return lines.join('\r\n');
}

// 여러 공연 ICS 생성
export function generateMultiICS(performances: Performance[]): string {
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const events = performances
        .map((performance) => {
            const uid = `${performance.id}-${Date.now()}@classicmania.kr`;
            const startDate = performance.startDate
                ? toICSDate(performance.startDate)
                : toICSDate(performance.period?.split('~')[0]?.trim() || '');
            const endDate = performance.endDate
                ? toICSDate(performance.endDate)
                : startDate;

            if (!startDate) return null;

            return [
                'BEGIN:VEVENT',
                `UID:${uid}`,
                `DTSTAMP:${now}`,
                `DTSTART;VALUE=DATE:${startDate}`,
                `DTEND;VALUE=DATE:${endDate}`,
                `SUMMARY:${escapeICS(performance.title)}`,
                `LOCATION:${escapeICS(performance.place || '')}`,
                'END:VEVENT',
            ].join('\r\n');
        })
        .filter(Boolean)
        .join('\r\n');

    return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//ClassicMania//KR',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        events,
        'END:VCALENDAR',
    ].join('\r\n');
}

// ICS 파일 다운로드
export function downloadICS(content: string, filename = 'performance.ics') {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Google Calendar URL 생성
export function getGoogleCalendarUrl(performance: Performance): string {
    const startDate = performance.startDate
        ? toICSDate(performance.startDate)
        : toICSDate(performance.period?.split('~')[0]?.trim() || '');
    const endDate = performance.endDate
        ? toICSDate(performance.endDate)
        : startDate;

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: performance.title,
        dates: `${startDate}/${endDate}`,
        location: performance.place || '',
        details: performance.synopsis?.slice(0, 200) || '',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
