import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  publicRuntimeConfig: {
    NEXT_PUBLIC_ALCHEMY_API_KEY: "-MbyWQTofwSPQu_Xlxfan",
    NEXT_PUBLIC_ETH_RPC_URL: "https://eth-mainnet.g.alchemy.com/v2/-MbyWQTofwSPQu_Xlxfan",
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
