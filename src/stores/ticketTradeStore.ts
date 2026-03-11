import { create } from 'zustand';
import type { TicketTrade, TicketTradeRequest } from '../types';

const TICKET_TRADE_KEY = 'classic-mania-ticket-trades';
const TICKET_REQUEST_KEY = 'classic-mania-ticket-requests';

const MOCK_TRADES: TicketTrade[] = [
    {
        id: 8,
        type: '양도',
        status: '거래가능',
        performanceTitle: '베를린 필하모닉 내한공연',
        performanceDate: '2026-03-20',
        venue: '롯데콘서트홀',
        area: '서울',
        seatInfo: 'R석 A구역 15열 22번',
        originalPrice: 180000,
        tradePrice: 175000,
        quantity: 1,
        sellerId: 'user2',
        sellerName: '클래식러버',
        sellerRating: 4.8,
        verifyStatus: 'verified',
        description: '개인 사정으로 양도합니다. 정가 이하로 드립니다. 인터파크 예매 내역 확인 가능합니다. 직거래 또는 안전결제 가능합니다.',
        images: [],
        createdAt: '2026-03-10',
        views: 312,
    },
    {
        id: 7,
        type: '양도',
        status: '거래가능',
        performanceTitle: '조성진 피아노 리사이틀',
        performanceDate: '2026-04-05',
        venue: '예술의전당 콘서트홀',
        area: '서울',
        seatInfo: 'S석 2층 C구역 5열 14번',
        originalPrice: 110000,
        tradePrice: 100000,
        quantity: 2,
        sellerId: 'user3',
        sellerName: '피아노마니아',
        sellerRating: 5.0,
        verifyStatus: 'verified',
        description: '2장 같이 양도합니다. 커플석이라 2장 함께 거래 원합니다. 2층에서 내려다보는 뷰가 정말 좋아요!',
        images: [],
        createdAt: '2026-03-09',
        views: 198,
    },
    {
        id: 6,
        type: '구매',
        status: '거래가능',
        performanceTitle: '빈 필하모닉 내한공연',
        performanceDate: '2026-05-10',
        venue: '예술의전당 콘서트홀',
        area: '서울',
        seatInfo: 'VIP 또는 R석 아무거나',
        originalPrice: 0,
        tradePrice: 200000,
        quantity: 1,
        sellerId: 'mujuki',
        sellerName: '이서준',
        sellerRating: 4.5,
        verifyStatus: 'unverified',
        description: '빈 필 5월 공연 티켓 구합니다. 정가 이하라면 VIP, R석 모두 환영합니다. 연락주세요!',
        images: [],
        createdAt: '2026-03-08',
        views: 87,
    },
    {
        id: 5,
        type: '양도',
        status: '예약중',
        performanceTitle: '서울시향 3월 정기연주회',
        performanceDate: '2026-03-25',
        venue: '롯데콘서트홀',
        area: '서울',
        seatInfo: 'A석 1층 F구역 10열 5번',
        originalPrice: 70000,
        tradePrice: 65000,
        quantity: 1,
        sellerId: 'user5',
        sellerName: '루시에',
        sellerRating: 4.2,
        verifyStatus: 'verified',
        description: '급하게 양도합니다. 말러 5번 프로그램입니다. 현재 협의 중이나 취소될 수 있으니 문의 주세요.',
        images: [],
        createdAt: '2026-03-07',
        views: 154,
    },
    {
        id: 4,
        type: '양도',
        status: '거래완료',
        performanceTitle: '국립오페라단 라 트라비아타',
        performanceDate: '2026-03-01',
        venue: '예술의전당 오페라극장',
        area: '서울',
        seatInfo: 'R석 1층 E구역 8열 15번',
        originalPrice: 150000,
        tradePrice: 130000,
        quantity: 1,
        sellerId: 'user4',
        sellerName: '오페라광',
        sellerRating: 5.0,
        verifyStatus: 'verified',
        description: '거래 완료된 게시글입니다.',
        images: [],
        createdAt: '2026-02-25',
        views: 432,
    },
    {
        id: 3,
        type: '양도',
        status: '거래가능',
        performanceTitle: '부산시향 4월 정기연주회',
        performanceDate: '2026-04-12',
        venue: '부산문화회관 대극장',
        area: '부산',
        seatInfo: 'A석 1층 3열 20번',
        originalPrice: 50000,
        tradePrice: 45000,
        quantity: 1,
        sellerId: 'user6',
        sellerName: '부산클래식',
        sellerRating: 4.7,
        verifyStatus: 'verified',
        description: '부산 직거래 가능합니다. 부산 지역이시면 연락주세요.',
        images: [],
        createdAt: '2026-03-05',
        views: 67,
    },
    {
        id: 2,
        type: '양도',
        status: '거래가능',
        performanceTitle: '대전시향 특별연주회',
        performanceDate: '2026-04-20',
        venue: '대전예술의전당',
        area: '대전',
        seatInfo: 'S석 2층 A구역 3열 8번',
        originalPrice: 60000,
        tradePrice: 55000,
        quantity: 2,
        sellerId: 'user7',
        sellerName: '대전클래식',
        sellerRating: 3.9,
        verifyStatus: 'pending',
        description: '2장 양도합니다. 인증 진행 중입니다. 가격 협의 가능.',
        images: [],
        createdAt: '2026-03-04',
        views: 45,
    },
    {
        id: 1,
        type: '구매',
        status: '거래가능',
        performanceTitle: '사이먼 래틀 내한공연',
        performanceDate: '2026-06-15',
        venue: '롯데콘서트홀',
        area: '서울',
        seatInfo: 'VIP 또는 R석',
        originalPrice: 0,
        tradePrice: 250000,
        quantity: 2,
        sellerId: 'user8',
        sellerName: '래틀팬',
        sellerRating: 4.3,
        verifyStatus: 'unverified',
        description: '래틀 내한 2장 구합니다. 2인 나란히 앉을 수 있는 좌석이면 좋겠습니다.',
        images: [],
        createdAt: '2026-03-03',
        views: 189,
    },
];

const loadTrades = (): TicketTrade[] => {
    if (typeof window === 'undefined') return MOCK_TRADES;
    try {
        const saved = localStorage.getItem(TICKET_TRADE_KEY);
        return saved ? JSON.parse(saved) : MOCK_TRADES;
    } catch {
        return MOCK_TRADES;
    }
};

const saveTrades = (trades: TicketTrade[]) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(TICKET_TRADE_KEY, JSON.stringify(trades));
    } catch { /* ignore */ }
};

const loadRequests = (): TicketTradeRequest[] => {
    if (typeof window === 'undefined') return [];
    try {
        const saved = localStorage.getItem(TICKET_REQUEST_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const saveRequests = (requests: TicketTradeRequest[]) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(TICKET_REQUEST_KEY, JSON.stringify(requests));
    } catch { /* ignore */ }
};

interface TicketTradeState {
    trades: TicketTrade[];
    requests: TicketTradeRequest[];

    addTrade: (trade: Omit<TicketTrade, 'id' | 'createdAt' | 'views' | 'status'>) => void;
    incrementViews: (tradeId: number) => void;
    requestTrade: (tradeId: number, buyerId: string, buyerName: string, message: string) => void;
    acceptRequest: (requestId: string, tradeId: number) => void;
    rejectRequest: (requestId: string) => void;
    completeTrade: (tradeId: number) => void;
    getTradeById: (id: number) => TicketTrade | undefined;
    getRequestsByTrade: (tradeId: number) => TicketTradeRequest[];
    getUserTrades: (userId: string) => TicketTrade[];
}

export const useTicketTradeStore = create<TicketTradeState>((set, get) => ({
    trades: loadTrades(),
    requests: loadRequests(),

    addTrade: (tradeData) => {
        const { trades } = get();
        const newTrade: TicketTrade = {
            ...tradeData,
            id: (trades[0]?.id ?? 0) + 1,
            status: '거래가능',
            createdAt: new Date().toISOString().split('T')[0],
            views: 0,
        };
        const updated = [newTrade, ...trades];
        saveTrades(updated);
        set({ trades: updated });
    },

    incrementViews: (tradeId) => {
        const { trades } = get();
        const updated = trades.map(t => t.id === tradeId ? { ...t, views: t.views + 1 } : t);
        saveTrades(updated);
        set({ trades: updated });
    },

    requestTrade: (tradeId, buyerId, buyerName, message) => {
        const { requests } = get();
        const existing = requests.find(r => r.tradeId === tradeId && r.buyerId === buyerId);
        if (existing) return;
        const newRequest: TicketTradeRequest = {
            id: `tr-${Date.now()}`,
            tradeId,
            buyerId,
            buyerName,
            message,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        const updated = [...requests, newRequest];
        saveRequests(updated);
        set({ requests: updated });
    },

    acceptRequest: (requestId, tradeId) => {
        const { requests, trades } = get();
        const updatedRequests = requests.map(r =>
            r.id === requestId ? { ...r, status: 'accepted' as const } :
            r.tradeId === tradeId && r.id !== requestId ? { ...r, status: 'rejected' as const } : r
        );
        const updatedTrades = trades.map(t =>
            t.id === tradeId ? { ...t, status: '예약중' as const } : t
        );
        saveRequests(updatedRequests);
        saveTrades(updatedTrades);
        set({ requests: updatedRequests, trades: updatedTrades });
    },

    rejectRequest: (requestId) => {
        const { requests } = get();
        const updated = requests.map(r =>
            r.id === requestId ? { ...r, status: 'rejected' as const } : r
        );
        saveRequests(updated);
        set({ requests: updated });
    },

    completeTrade: (tradeId) => {
        const { trades } = get();
        const updated = trades.map(t =>
            t.id === tradeId ? { ...t, status: '거래완료' as const } : t
        );
        saveTrades(updated);
        set({ trades: updated });
    },

    getTradeById: (id) => get().trades.find(t => t.id === id),

    getRequestsByTrade: (tradeId) => get().requests.filter(r => r.tradeId === tradeId),

    getUserTrades: (userId) => get().trades.filter(t => t.sellerId === userId),
}));
