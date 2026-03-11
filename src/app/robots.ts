import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://classic-mania.vercel.app';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/mypage', '/login', '/signup'],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
