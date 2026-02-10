import type { VercelRequest, VercelResponse } from '@vercel/node';

const KOPIS_BASE = 'http://www.kopis.or.kr';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { path, ...params } = req.query;

    if (!path || typeof path !== 'string') {
        return res.status(400).json({ error: 'Missing path parameter' });
    }

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (typeof value === 'string') {
            searchParams.append(key, value);
        }
    }

    const targetUrl = `${KOPIS_BASE}${path}?${searchParams.toString()}`;

    try {
        const response = await fetch(targetUrl);
        const data = await response.text();

        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).send(data);
    } catch (error) {
        console.error('KOPIS proxy error:', error);
        return res.status(500).json({ error: 'KOPIS API request failed' });
    }
}
