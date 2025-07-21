/** @type {import('next').NextConfig} */
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.icons8.com"
            },
            {
                protocol: "https",
                hostname: "github.com"
            },
        ]
    },
    async redirects() {
        return [
            {
                source: '/:slug((?!posts|tags|api|_next).*)?',
                destination: '/posts/:slug',
                permanent: true,
            },
        ];
    },
};

if (process.env.NODE_ENV === 'development') {
    await setupDevPlatform();
}

export default nextConfig;
