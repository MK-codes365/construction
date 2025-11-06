declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_ALCHEMY_API_KEY: string;
    NEXT_PUBLIC_ETH_RPC_URL: string;
    MAINNET_PRIVATE_KEY: string;
    ETHERSCAN_API_KEY: string;
  }
}