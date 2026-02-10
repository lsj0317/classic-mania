import type { VercelRequest, VercelResponse } from '@vercel/node';

const NAVER_BASE = 'https://openapi.naver.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }

    const { path, ...params } = req.query;

    if (!path || typeof path !== 'string') {
        return res.status(400).json({ error: 'Missing path parameter' });
    }

    const clientId = process.env.NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        return res.status(500).json({ error: 'Naver API credentials not configured' });
    }

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (typeof value === 'string') {
            searchParams.append(key, value);
        }
    }

    const targetUrl = `${NAVER_BASE}${path}?${searchParams.toString()}`;

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'X-Naver-Client-Id': clientId,
                'X-Naver-Client-Secret': clientSecret,
            },
        });

        const data = await response.json();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.status(200).json(data);
    } catch (error) {
        console.error('Naver proxy error:', error);
        return res.status(500).json({ error: 'Naver API request failed' });
    }
}
