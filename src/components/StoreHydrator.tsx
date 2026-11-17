'use client';

import { useEffect, useLayoutEffect } from 'react';
import { useLanguageStore } from '@/stores/languageStore';
import { useUserStore } from '@/stores/userStore';
import { useArtistStore } from '@/stores/artistStore';
import { useCommunityStore } from '@/stores/communityStore';
import { useCompanionStore } from '@/stores/companionStore';
import { useMeetupStore } from '@/stores/meetupStore';
import { useTicketTradeStore } from '@/stores/ticketTradeStore';
import { useRecommendationStore } from '@/stores/recommendationStore';
import { useReviewStore } from '@/stores/reviewStore';

// 서버에서는 useLayoutEffect 경고가 나므로 useEffect로 대체한다.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * localStorage에 저장된 상태를 하이드레이션 직후 각 스토어에 불러온다.
 *
 * 스토어가 생성 시점에 localStorage를 읽으면 서버 HTML과 첫 클라이언트 렌더링이 달라져
 * 하이드레이션 오류가 난다. 그래서 스토어는 서버와 같은 기본값으로 시작하고, 여기서 한 번 불러온다.
 * 레이아웃 이펙트는 페이지 컴포넌트의 일반 이펙트보다 먼저 실행되므로,
 * 페이지 로직은 항상 불러온 뒤의 상태를 보게 된다.
 */
export default function StoreHydrator() {
    useIsomorphicLayoutEffect(() => {
        useLanguageStore.getState().hydrate();
        useUserStore.getState().hydrate();
        useArtistStore.getState().hydrate();
        useCommunityStore.getState().hydrate();
        useCompanionStore.getState().hydrate();
        useMeetupStore.getState().hydrate();
        useTicketTradeStore.getState().hydrate();
        useRecommendationStore.getState().hydrate();
        useReviewStore.getState().hydrate();
    }, []);

    return null;
}
