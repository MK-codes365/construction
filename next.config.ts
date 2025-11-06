import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    NEXT_PUBLIC_ETH_RPC_URL: process.env.NEXT_PUBLIC_ETH_RPC_URL,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // This is required to allow the Next.js dev server to accept requests from the
  // Firebase Studio environment.
  allowedDevOrigins: [
    '6000-firebase-studio-*.cluster-*.cloudworkstations.dev',
  ],
};

export default nextConfig;
