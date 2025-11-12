// X402 Facilitator configuration using Ultraviolet DAO
const facilitatorUrl = process.env.NEXT_PUBLIC_FACILITATOR_URL || "https://facilitator.ultravioletadao.xyz";

export const facilitatorConfig = {
  url: facilitatorUrl,
};

/**
 * Get all supported payment methods
 */
export async function getAllSupportedPaymentMethods() {
  const response = await fetch(`${facilitatorUrl}/supported`);
  return await response.json();
}

/**
 * Get supported payment methods for a specific chain
 * @param chainId - The chain ID (e.g., 8453 for Base, 42161 for Arbitrum)
 */
export async function getSupportedByChain(chainId: number) {
  const response = await fetch(`${facilitatorUrl}/supported?chainId=${chainId}`);
  return await response.json();
}

/**
 * Get supported payment methods for a specific token on a chain
 * @param chainId - The chain ID
 * @param tokenAddress - The token contract address
 */
export async function getSupportedByToken(chainId: number, tokenAddress: string) {
  const response = await fetch(`${facilitatorUrl}/supported?chainId=${chainId}&tokenAddress=${tokenAddress}`);
  return await response.json();
}

// Common chain IDs
export const CHAIN_IDS = {
  BASE: 8453,
  BASE_SEPOLIA: 84532,
  ARBITRUM: 42161,
  ARBITRUM_SEPOLIA: 421614,
  ETHEREUM: 1,
  SEPOLIA: 11155111,
  AVALANCHE: 43114,
  AVALANCHE_FUJI: 43113,
} as const;

// Common token addresses
export const TOKEN_ADDRESSES = {
  USDC_BASE: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  USDC_ARBITRUM: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  USDC_AVALANCHE: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
  USDC_AVALANCHE_FUJI: "0x5425890298aed601595a70AB815c96711a31Bc65",
} as const;
