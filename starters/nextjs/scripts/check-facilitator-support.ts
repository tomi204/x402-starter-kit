/**
 * Script to check X402 facilitator supported payment methods
 * Run with: npx tsx scripts/check-facilitator-support.ts
 */

import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

async function checkSupport() {
  const facilitatorUrl = process.env.NEXT_PUBLIC_FACILITATOR_URL || "https://facilitator.ultravioletadao.xyz";

  console.log(`🔍 Checking facilitator support at: ${facilitatorUrl}\n`);

  try {
    // Get all supported payment methods
    console.log("📋 All supported payment methods:");
    const allSupported = await fetch(`${facilitatorUrl}/supported`);
    console.log(JSON.stringify(await allSupported.json(), null, 2));

    // Check Avalanche Fuji (43113)
    console.log("\n❄️  Avalanche Fuji (43113):");
    const avalancheFuji = await fetch(`${facilitatorUrl}/supported?chainId=43113`);
    console.log(JSON.stringify(await avalancheFuji.json(), null, 2));

    // Check Avalanche Mainnet (43114)
    console.log("\n❄️  Avalanche Mainnet (43114):");
    const avalanche = await fetch(`${facilitatorUrl}/supported?chainId=43114`);
    console.log(JSON.stringify(await avalanche.json(), null, 2));

    // Check Base Sepolia (84532)
    console.log("\n🔵 Base Sepolia (84532):");
    const baseSepolia = await fetch(`${facilitatorUrl}/supported?chainId=84532`);
    console.log(JSON.stringify(await baseSepolia.json(), null, 2));

    // Check Arbitrum Sepolia (421614)
    console.log("\n🔷 Arbitrum Sepolia (421614):");
    const arbSepolia = await fetch(`${facilitatorUrl}/supported?chainId=421614`);
    console.log(JSON.stringify(await arbSepolia.json(), null, 2));

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

checkSupport();
