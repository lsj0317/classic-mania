// src/data/ticketData.ts

export interface PricePoint {
    date: string;
    price: number;
}

export interface Vendor {
    name: string;
    price: number;
    link: string;
}

export interface TicketPerformance {
    id: number;
    title: string;
    period: string;
    poster: string;
    place: string;
    currentPrice: number;
    priceHistory: PricePoint[];
    vendors: Vendor[];
    description: string;
}

export const ticketData: TicketPerformance[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `제 ${i + 1}회 클래식 페스티벌 - ${['서울', '대전', '부산', '대구'][i % 4]} 공연`,
    period: `2026.02.${10 + i} - 2026.03.${10 + i}`,
    poster: `https://picsum.photos/id/${10 + i}/300/400`, // 더미 이미지
    place: `${['예술의전당', '세종문화회관', '롯데콘서트홀'][i % 3]}`,
    currentPrice: 50000 + (i * 2000),
    description: "세계적인 거장들과 함께하는 환상적인 클래식의 밤. 이번 공연에서는 베토벤과 브람스의 정수를 느낄 수 있습니다.",
    priceHistory: [
        { date: '01/01', price: 80000 },
        { date: '01/10', price: 75000 },
        { date: '01/20', price: 68000 },
        { date: '01/28', price: 50000 + (i * 2000) },
    ],
    vendors: [
        { name: '인터파크', price: 55000 + (i * 2000), link: 'https://ticket.interpark.com' },
        { name: '티몬', price: 50000 + (i * 2000), link: 'https://www.tmon.co.kr' },
        { name: '예스24', price: 53000 + (i * 2000), link: 'http://ticket.yes24.com' }
    ]
}));