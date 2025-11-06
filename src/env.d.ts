// src/env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_ALCHEMY_API_KEY: string;
      NEXT_PUBLIC_ETH_RPC_URL: string;
      NODE_ENV: 'development' | 'production';
    }
  }
}