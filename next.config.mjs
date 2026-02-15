/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'api.openopus.org',
            },
            {
                protocol: 'https',
                hostname: 'assets.openopus.org',
            },
            {
                protocol: 'http',
                hostname: 'www.kopis.or.kr',
            },
            {
                protocol: 'https',
                hostname: 'docs.material-tailwind.com',
            },
        ],
    },
};

export default nextConfig;
