import { ADSENSE_CLIENT } from '@/lib/monetization';

export const dynamic = 'force-static';

/** AdSense 판매자 인증용 ads.txt (NEXT_PUBLIC_ADSENSE_CLIENT 설정 시에만 제공) */
export function GET() {
    if (!ADSENSE_CLIENT) {
        return new Response('Not Found', { status: 404 });
    }
    const publisherId = ADSENSE_CLIENT.replace(/^ca-/, '');
    return new Response(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}
