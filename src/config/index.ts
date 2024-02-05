export const isDevelopment = process.env.NEXT_PUBLIC_DEVELOPMENT == "true";
export const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!;
export const MAX_PIXELS = 1000;
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const PIXEL_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_PIXEL_CONTRACT_ADDRESS as `0x${string}`;
export const MARKETPLACE_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS as `0x${string}`;
export const WETH_ADDRESS = process.env
  .NEXT_PUBLIC_WETH_ADDRESS as `0x${string}`;
export const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL!;
export const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY!;
export const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL!;
