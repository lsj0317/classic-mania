import { useQuery } from '@tanstack/react-query';
import { fetchEssentialComposers } from '../api/openOpusApi';
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

/** 이달의 음악인 - 현재 월에 태어난 작곡가들 */
export const useMonthlyMusicians = () => {
    const currentMonth = new Date().getMonth() + 1; // 1-12

    return useQuery<MonthlyMusician[]>({
        queryKey: ['monthly-musicians', currentMonth],
        queryFn: async () => {
            const composers = await fetchEssentialComposers();

            const musicians: MonthlyMusician[] = composers
                .filter((c: OpenOpusComposer) => {
                    if (!c.birth) return false;
                    const birthMonth = parseInt(c.birth.split('-')[1], 10);
                    return birthMonth === currentMonth;
                })
                .map((c: OpenOpusComposer) => {
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
                })
                .sort((a, b) => a.birthDay - b.birthDay);

            return musicians;
        },
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 4,
        refetchOnWindowFocus: false,
        retry: 2,
    });
};
