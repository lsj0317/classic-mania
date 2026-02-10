import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * 개발 환경용 API 프록시 플러그인
 * Vercel Serverless Function과 동일한 /api/kopis?path=...&params 형식을 처리
 */
function apiProxyPlugin(): Plugin {
    return {
        name: 'api-proxy',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (!req.url) return next();

                const url = new URL(req.url, 'http://localhost');

                if (url.pathname === '/api/kopis') {
                    const kopisPath = url.searchParams.get('path') || '';
                    url.searchParams.delete('path');
                    const targetUrl = `http://www.kopis.or.kr${kopisPath}?${url.searchParams.toString()}`;

                    try {
                        const response = await fetch(targetUrl);
                        const data = await response.text();
                        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.end(data);
                    } catch {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: 'KOPIS proxy error' }));
                    }
                    return;
                }

                if (url.pathname === '/api/naver') {
                    const naverPath = url.searchParams.get('path') || '';
                    url.searchParams.delete('path');
                    const targetUrl = `https://openapi.naver.com${naverPath}?${url.searchParams.toString()}`;

                    const clientId = process.env.VITE_NAVER_CLIENT_ID || '';
                    const clientSecret = process.env.VITE_NAVER_CLIENT_SECRET || '';

                    try {
                        const response = await fetch(targetUrl, {
                            headers: {
                                'X-Naver-Client-Id': clientId,
                                'X-Naver-Client-Secret': clientSecret,
                            },
                        });
                        const data = await response.text();
                        res.setHeader('Content-Type', 'application/json; charset=utf-8');
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.end(data);
                    } catch {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: 'Naver proxy error' }));
                    }
                    return;
                }

                next();
            });
        },
    };
}

export default defineConfig({
    plugins: [react(), apiProxyPlugin()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
