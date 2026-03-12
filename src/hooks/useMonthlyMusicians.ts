import { useQuery } from '@tanstack/react-query';
import { fetchEssentialComposers } from '../api/openOpusApi';
import { fallbackComposers } from '../data/composerData';
import type { OpenOpusComposer } from '../types';

export interface MonthlyMusician {
    id: string;
    name: string;
    completeName: string;
    birth: string;
    death: string | null;
    epoch: string;
    portrait: string;
    birthMonth: number;
    birthDay: number;
    type: 'composer';
}

export interface MonthlyMusiciansResult {
    musicians: MonthlyMusician[];
    displayMonth: number; // 실제 표시되는 달 (현재 달 또는 다음 달)
    isFallback: boolean;  // 다음 달로 폴백됐는지 여부
}

const toMusician = (c: OpenOpusComposer): MonthlyMusician => {
    const parts = c.birth.split('-');
    return {
        id: c.id,
        name: c.name,
        completeName: c.complete_name,
        birth: c.birth,
        death: c.death,
        epoch: c.epoch,
        portrait: c.portrait,
        birthMonth: parseInt(parts[1], 10),
        birthDay: parseInt(parts[2], 10),
        type: 'composer' as const,
    };
};

const filterByMonth = (composers: OpenOpusComposer[], month: number) =>
    composers
        .filter((c) => {
            if (!c.birth) return false;
            return parseInt(c.birth.split('-')[1], 10) === month;
        })
        .map(toMusician)
        .sort((a, b) => a.birthDay - b.birthDay);

/** 이달의 음악인 - 현재 월에 태어난 작곡가들, 없으면 다음 달로 폴백 */
export const useMonthlyMusicians = () => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;

    return useQuery<MonthlyMusiciansResult>({
        queryKey: ['monthly-musicians', currentMonth],
        queryFn: async () => {
            let composers: OpenOpusComposer[];
            try {
                composers = await fetchEssentialComposers();
                if (!composers || composers.length === 0) {
                    composers = fallbackComposers;
                }
            } catch {
                // API 실패 시 로컬 폴백 데이터 사용
                composers = fallbackComposers;
            }

            const thisMonthMusicians = filterByMonth(composers, currentMonth);
            if (thisMonthMusicians.length > 0) {
                return { musicians: thisMonthMusicians, displayMonth: currentMonth, isFallback: false };
            }

            // 현재 달에 없으면 다음 달로 폴백
            const nextMonthMusicians = filterByMonth(composers, nextMonth);
            return { musicians: nextMonthMusicians, displayMonth: nextMonth, isFallback: true };
        },
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 4,
        refetchOnWindowFocus: false,
        retry: 1,
    });
};
