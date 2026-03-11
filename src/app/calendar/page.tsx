'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Calendar, Download, ExternalLink, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMonthlyPerformances } from '@/hooks/usePerformanceQueries';
import { generateMultiICS, downloadICS, getGoogleCalendarUrl, generateICS } from '@/lib/icsExport';
import type { Performance } from '@/types';
import { cn } from '@/lib/utils';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTHS_KO = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

type ViewMode = 'month' | 'week';

// 날짜 문자열 파싱 (YYYY.MM.DD 또는 YYYY-MM-DD)
function parseDateStr(str: string): Date | null {
    if (!str) return null;
    const clean = str.trim().replace(/\./g, '-');
    const d = new Date(clean);
    return isNaN(d.getTime()) ? null : d;
}

// 공연이 특정 날짜에 포함되는지 확인
function isPerformanceOnDate(perf: Performance, date: Date): boolean {
    const start = parseDateStr(perf.startDate || perf.period?.split('~')[0]?.trim() || '');
    const end = parseDateStr(perf.endDate || perf.period?.split('~')[1]?.trim() || perf.period || '');

    if (!start) return false;
    const endDate = end || start;

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    return d >= start && d <= endDate;
}

// 오늘의 공연 필터
function getTodayPerformances(performances: Performance[]): Performance[] {
    const today = new Date();
    return performances.filter((p) => isPerformanceOnDate(p, today));
}

const STATUS_COLOR: Record<string, string> = {
    '공연중': 'bg-green-500',
    '공연예정': 'bg-blue-500',
    '공연완료': 'bg-gray-400',
};

export default function CalendarPage() {
    const router = useRouter();
    const { data: performances = [], isLoading } = useMonthlyPerformances();

    const today = new Date();
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState<Date | null>(today);
    const [savedPerformances, setSavedPerformances] = useState<Set<string>>(new Set());

    // localStorage에서 저장된 공연 로드
    useEffect(() => {
        try {
            const saved = localStorage.getItem('calendar-saved-performances');
            if (saved) setSavedPerformances(new Set(JSON.parse(saved)));
        } catch { /* ignore */ }
    }, []);

    const toggleSave = (perfId: string) => {
        setSavedPerformances((prev) => {
            const next = new Set(prev);
            if (next.has(perfId)) next.delete(perfId);
            else next.add(perfId);
            try {
                localStorage.setItem('calendar-saved-performances', JSON.stringify([...next]));
            } catch { /* ignore */ }
            return next;
        });
    };

    // 현재 월의 캘린더 날짜 배열 생성
    const calendarDays = useMemo(() => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startDayOfWeek = firstDay.getDay();

        const days: (Date | null)[] = [];
        for (let i = 0; i < startDayOfWeek; i++) days.push(null);
        for (let d = 1; d <= lastDay.getDate(); d++) {
            days.push(new Date(currentYear, currentMonth, d));
        }
        // 6줄로 맞추기
        while (days.length % 7 !== 0) days.push(null);
        return days;
    }, [currentYear, currentMonth]);

    // 주별 뷰: 현재 선택된 날짜의 주
    const weekDays = useMemo(() => {
        const base = selectedDate || today;
        const day = base.getDay();
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(base);
            d.setDate(base.getDate() - day + i);
            return d;
        });
    }, [selectedDate]);

    const selectedPerformances = useMemo(() => {
        if (!selectedDate) return [];
        return performances.filter((p) => isPerformanceOnDate(p, selectedDate));
    }, [selectedDate, performances]);

    const todayPerformances = useMemo(() => getTodayPerformances(performances), [performances]);
    const savedPerfList = useMemo(
        () => performances.filter((p) => savedPerformances.has(p.id)),
        [performances, savedPerformances]
    );

    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentYear((y) => y - 1); setCurrentMonth(11); }
        else setCurrentMonth((m) => m - 1);
    };
    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentYear((y) => y + 1); setCurrentMonth(0); }
        else setCurrentMonth((m) => m + 1);
    };

    const handleExportAll = () => {
        const ics = generateMultiICS(savedPerfList.length > 0 ? savedPerfList : performances.slice(0, 20));
        downloadICS(ics, 'classic-mania-calendar.ics');
    };

    const handleExportSingle = (perf: Performance) => {
        const ics = generateICS(perf);
        downloadICS(ics, `${perf.title}.ics`);
    };

    const getPerfsForDay = (date: Date) =>
        performances.filter((p) => isPerformanceOnDate(p, date));

    const isToday = (date: Date) => {
        const t = new Date();
        return (
            date.getFullYear() === t.getFullYear() &&
            date.getMonth() === t.getMonth() &&
            date.getDate() === t.getDate()
        );
    };

    const isSelected = (date: Date) =>
        selectedDate &&
        date.getFullYear() === selectedDate.getFullYear() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getDate() === selectedDate.getDate();

    return (
        <div className="container mx-auto max-w-screen-xl px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* 캘린더 메인 */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Calendar className="h-6 w-6" />
                            공연 캘린더
                        </h1>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={viewMode === 'month' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('month')}
                            >
                                월간
                            </Button>
                            <Button
                                variant={viewMode === 'week' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('week')}
                            >
                                주간
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleExportAll} className="flex items-center gap-1">
                                <Download className="h-4 w-4" />
                                <span className="hidden sm:inline">캘린더 내보내기</span>
                            </Button>
                        </div>
                    </div>

                    {/* 월 이동 */}
                    <Card className="mb-4">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <Button variant="ghost" size="icon" onClick={prevMonth}>
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <h2 className="text-lg font-bold">
                                    {currentYear}년 {MONTHS_KO[currentMonth]}
                                </h2>
                                <Button variant="ghost" size="icon" onClick={nextMonth}>
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>

                            {viewMode === 'month' ? (
                                <>
                                    {/* 요일 헤더 */}
                                    <div className="grid grid-cols-7 mb-2">
                                        {DAYS.map((d, i) => (
                                            <div
                                                key={d}
                                                className={cn(
                                                    'text-center text-xs font-semibold py-1',
                                                    i === 0 && 'text-red-500',
                                                    i === 6 && 'text-blue-500'
                                                )}
                                            >
                                                {d}
                                            </div>
                                        ))}
                                    </div>

                                    {/* 날짜 그리드 */}
                                    <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-lg overflow-hidden">
                                        {calendarDays.map((date, idx) => {
                                            const perfs = date ? getPerfsForDay(date) : [];
                                            return (
                                                <div
                                                    key={idx}
                                                    className={cn(
                                                        'bg-white min-h-[70px] p-1 cursor-pointer transition-colors',
                                                        date ? 'hover:bg-blue-50' : 'opacity-0',
                                                        date && isToday(date) && 'bg-blue-50',
                                                        date && isSelected(date) && 'ring-2 ring-inset ring-blue-400'
                                                    )}
                                                    onClick={() => date && setSelectedDate(date)}
                                                >
                                                    {date && (
                                                        <>
                                                            <span
                                                                className={cn(
                                                                    'text-xs font-medium block mb-1',
                                                                    isToday(date) && 'bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center',
                                                                    date.getDay() === 0 && 'text-red-500',
                                                                    date.getDay() === 6 && 'text-blue-500'
                                                                )}
                                                            >
                                                                {date.getDate()}
                                                            </span>
                                                            <div className="space-y-px">
                                                                {perfs.slice(0, 2).map((p) => (
                                                                    <div
                                                                        key={p.id}
                                                                        className={cn(
                                                                            'text-[9px] leading-tight px-1 rounded truncate text-white',
                                                                            STATUS_COLOR[p.status] || 'bg-gray-400'
                                                                        )}
                                                                    >
                                                                        {p.title}
                                                                    </div>
                                                                ))}
                                                                {perfs.length > 2 && (
                                                                    <div className="text-[9px] text-muted-foreground">
                                                                        +{perfs.length - 2}개
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                /* 주간 뷰 */
                                <div>
                                    <div className="grid grid-cols-7 gap-2">
                                        {weekDays.map((date, i) => {
                                            const perfs = getPerfsForDay(date);
                                            return (
                                                <div
                                                    key={i}
                                                    className={cn(
                                                        'rounded-lg p-2 cursor-pointer transition-colors border',
                                                        isToday(date) && 'border-primary bg-blue-50',
                                                        isSelected(date) && 'ring-2 ring-primary',
                                                        !isToday(date) && 'border-gray-100 hover:bg-gray-50'
                                                    )}
                                                    onClick={() => setSelectedDate(date)}
                                                >
                                                    <p
                                                        className={cn(
                                                            'text-xs font-bold text-center mb-1',
                                                            i === 0 && 'text-red-500',
                                                            i === 6 && 'text-blue-500'
                                                        )}
                                                    >
                                                        {DAYS[i]}
                                                    </p>
                                                    <p
                                                        className={cn(
                                                            'text-sm font-bold text-center mb-2',
                                                            isToday(date) &&
                                                                'bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center mx-auto'
                                                        )}
                                                    >
                                                        {date.getDate()}
                                                    </p>
                                                    <div className="space-y-1">
                                                        {perfs.slice(0, 3).map((p) => (
                                                            <div
                                                                key={p.id}
                                                                className={cn(
                                                                    'text-[9px] px-1 py-0.5 rounded text-white truncate',
                                                                    STATUS_COLOR[p.status] || 'bg-gray-400'
                                                                )}
                                                            >
                                                                {p.title}
                                                            </div>
                                                        ))}
                                                        {perfs.length > 3 && (
                                                            <p className="text-[9px] text-muted-foreground text-center">
                                                                +{perfs.length - 3}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* 선택된 날짜의 공연 목록 */}
                    {selectedDate && (
                        <Card>
                            <CardContent className="p-4">
                                <h3 className="font-bold mb-3">
                                    {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 공연
                                    <span className="text-sm font-normal text-muted-foreground ml-2">
                                        ({selectedPerformances.length}건)
                                    </span>
                                </h3>
                                {isLoading ? (
                                    <p className="text-sm text-muted-foreground">불러오는 중...</p>
                                ) : selectedPerformances.length === 0 ? (
                                    <p className="text-sm text-muted-foreground py-4 text-center">이 날의 공연이 없습니다</p>
                                ) : (
                                    <div className="space-y-3">
                                        {selectedPerformances.map((perf) => (
                                            <div
                                                key={perf.id}
                                                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                                            >
                                                {perf.poster && (
                                                    <img
                                                        src={perf.poster}
                                                        alt={perf.title}
                                                        className="w-12 h-16 object-cover rounded flex-shrink-0"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p
                                                        className="font-semibold text-sm truncate cursor-pointer hover:text-primary"
                                                        onClick={() => router.push(`/performance/${perf.id}`)}
                                                    >
                                                        {perf.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                        <MapPin className="h-3 w-3" />
                                                        {perf.place}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {perf.period}
                                                    </p>
                                                    <Badge
                                                        className={cn(
                                                            'mt-1 text-white text-[10px] px-1.5 py-0',
                                                            STATUS_COLOR[perf.status] || 'bg-gray-400'
                                                        )}
                                                    >
                                                        {perf.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-col gap-1 flex-shrink-0">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-xs h-7 px-2"
                                                        onClick={() => handleExportSingle(perf)}
                                                    >
                                                        <Download className="h-3 w-3 mr-1" />
                                                        .ics
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-xs h-7 px-2"
                                                        onClick={() => window.open(getGoogleCalendarUrl(perf), '_blank')}
                                                    >
                                                        <ExternalLink className="h-3 w-3 mr-1" />
                                                        Google
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={savedPerformances.has(perf.id) ? 'default' : 'outline'}
                                                        className="text-xs h-7 px-2"
                                                        onClick={() => toggleSave(perf.id)}
                                                    >
                                                        {savedPerformances.has(perf.id) ? '저장됨 ✓' : '+ 저장'}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* 사이드바 */}
                <div className="lg:w-72 space-y-4">
                    {/* 오늘의 공연 */}
                    <Card>
                        <CardContent className="p-4">
                            <h3 className="font-bold mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                오늘의 공연
                            </h3>
                            {todayPerformances.length === 0 ? (
                                <p className="text-sm text-muted-foreground">오늘 공연이 없습니다</p>
                            ) : (
                                <div className="space-y-2">
                                    {todayPerformances.slice(0, 5).map((perf) => (
                                        <div
                                            key={perf.id}
                                            className="cursor-pointer hover:bg-gray-50 rounded p-2 transition-colors"
                                            onClick={() => router.push(`/performance/${perf.id}`)}
                                        >
                                            <p className="text-sm font-medium truncate">{perf.title}</p>
                                            <p className="text-xs text-muted-foreground truncate">{perf.place}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* 관심 공연 */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold">관심 공연 ({savedPerfList.length})</h3>
                                {savedPerfList.length > 0 && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs h-7"
                                        onClick={handleExportAll}
                                    >
                                        <Download className="h-3 w-3 mr-1" />
                                        전체 내보내기
                                    </Button>
                                )}
                            </div>
                            {savedPerfList.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    공연 날짜를 클릭하고 "+ 저장"으로 관심 공연을 추가하세요
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {savedPerfList.map((perf) => (
                                        <div key={perf.id} className="flex items-center justify-between gap-2">
                                            <div
                                                className="flex-1 min-w-0 cursor-pointer hover:text-primary"
                                                onClick={() => router.push(`/performance/${perf.id}`)}
                                            >
                                                <p className="text-sm font-medium truncate">{perf.title}</p>
                                                <p className="text-xs text-muted-foreground">{perf.period}</p>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-xs h-6 text-red-400 hover:text-red-600 flex-shrink-0"
                                                onClick={() => toggleSave(perf.id)}
                                            >
                                                ✕
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* 범례 */}
                    <Card>
                        <CardContent className="p-4">
                            <h3 className="font-bold mb-3 text-sm">범례</h3>
                            <div className="space-y-2">
                                {Object.entries(STATUS_COLOR).map(([status, color]) => (
                                    <div key={status} className="flex items-center gap-2">
                                        <span className={cn('w-3 h-3 rounded-full', color)} />
                                        <span className="text-sm">{status}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
