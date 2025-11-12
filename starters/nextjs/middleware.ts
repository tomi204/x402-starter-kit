import { Address } from "viem";
import { paymentMiddleware, Network } from "x402-next";
import { NextRequest, NextResponse } from "next/server";

// Avalanche C-Chain configuration
const address = process.env.NEXT_PUBLIC_RECEIVER_ADDRESS as Address;
const network = process.env.NEXT_PUBLIC_NETWORK as Network; // avalanche or avalanche-fuji
const cdpClientKey = process.env.NEXT_PUBLIC_CDP_CLIENT_KEY as string;

// X402 Facilitator using Ultraviolet DAO
const facilitatorUrl = process.env.NEXT_PUBLIC_FACILITATOR_URL || "https://facilitator.ultravioletadao.xyz";

// Use X402 facilitator for payment middleware
const x402PaymentMiddleware = paymentMiddleware(
  address,
  {
    "/content/cheap": {
      price: "$0.01",
      network,
      config: {
        description: "Access to cheap content on Avalanche",
      },
    },
    "/content/expensive": {
      price: "$0.25",
      network,
      config: {
        description: "Access to expensive content on Avalanche",
      },
    },
    "/api/premium": {
      price: "$0.10",
      network: "base-sepolia",
      config: {
        description: "Access to premium API content",
      },
    },
  },
  {
    url: facilitatorUrl,
    // Add auth headers function to ensure proper configuration
    createAuthHeaders: async () => ({
      verify: {
        'User-Agent': 'x402-next/0.7.1',
        'Accept': 'application/json',
      },
      settle: {
        'User-Agent': 'x402-next/0.7.1',
        'Accept': 'application/json',
      },
      supported: {
        'User-Agent': 'x402-next/0.7.1',
        'Accept': 'application/json',
      },
    }),
  },
  {
    cdpClientKey,
    appLogo: "/logos/x402-examples.png",
    appName: "x402 Avalanche Demo",
    sessionTokenEndpoint: '/api/x402/session-token',
  }
);

export const middleware = async (req: NextRequest) => {
  const delegate = x402PaymentMiddleware as unknown as (
    request: NextRequest
  ) => ReturnType<typeof x402PaymentMiddleware>;

  const response = await delegate(req);

  // Override: If response is 402 (paywall), modify the HTML to force Avalanche network
  if (response.status === 402) {
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('text/html')) {
      let html = await response.text();

      // Debug: Save original HTML to see what we're working with
      if (process.env.NODE_ENV === 'development') {
        console.log('=== PAYWALL HTML DEBUG ===');
        console.log('Network config:', network);
        console.log('HTML length:', html.length);
        // Look for chain/RPC configurations
        const chainMatches = html.match(/8453|84532|43114|43113/g);
        console.log('Chain IDs found:', chainMatches);
        const rpcMatches = html.match(/https:\/\/[^"'\s]+\.base\.org/g);
        console.log('Base RPC URLs found:', rpcMatches);
      }

      // The x402-next library hardcodes testnet detection as: testnet: network === "base-sepolia"
      // This causes Avalanche networks to switch to Base mainnet
      // We need to override the testnet flag AND the network in the paywall config

      // Fix 1: Force testnet to true for avalanche-fuji
      const isTestnet = network === "avalanche-fuji";
      html = html.replace(/testnet:\s*false/g, `testnet:${isTestnet}`);
      html = html.replace(/testnet:\s*true/g, `testnet:${isTestnet}`);

      // Fix 2: Replace network configuration
      html = html.replace(/"network"\s*:\s*"base-sepolia"/g, `"network":"${network}"`);
      html = html.replace(/"network"\s*:\s*"base"/g, `"network":"${network}"`);
      html = html.replace(/network:\s*"base-sepolia"/g, `network:"${network}"`);
      html = html.replace(/network:\s*"base"/g, `network:"${network}"`);

      // Fix 3: Replace ALL chain IDs (very aggressive)
      // Base mainnet = 8453, Base Sepolia = 84532
      // Avalanche C-Chain = 43114, Avalanche Fuji = 43113
      const targetChainId = network === "avalanche-fuji" ? "43113" : "43114";

      // Replace in all contexts: numbers, strings, hex
      html = html.replace(/\b8453\b/g, targetChainId);
      html = html.replace(/\b84532\b/g, targetChainId);
      html = html.replace(/"8453"/g, `"${targetChainId}"`);
      html = html.replace(/"84532"/g, `"${targetChainId}"`);
      html = html.replace(/0x2105/g, `0x${parseInt(targetChainId).toString(16)}`); // 8453 in hex
      html = html.replace(/0x14a34/g, `0x${parseInt(targetChainId).toString(16)}`); // 84532 in hex

      // Fix 4: Replace ALL RPC URLs (very aggressive)
      const avalancheRpc = network === "avalanche-fuji"
        ? "https://api.avax-test.network/ext/bc/C/rpc"
        : "https://api.avax.network/ext/bc/C/rpc";

      // Replace all Base RPC endpoints
      html = html.replace(/https:\/\/mainnet\.base\.org/g, avalancheRpc);
      html = html.replace(/https:\/\/mainnet-preconf\.base\.org/g, avalancheRpc);
      html = html.replace(/https:\/\/sepolia\.base\.org/g, avalancheRpc);
      html = html.replace(/https:\/\/sepolia-preconf\.base\.org/g, avalancheRpc);
      html = html.replace(/https:\/\/base-mainnet\.g\.alchemy\.com\/v2\/[^"'\s]*/g, avalancheRpc);
      html = html.replace(/https:\/\/base-sepolia\.g\.alchemy\.com\/v2\/[^"'\s]*/g, avalancheRpc);

      // Don't replace docs.base.org as it's for documentation only, not RPC

      // Fix 5: Replace chain name references
      html = html.replace(/"Base"/g, `"Avalanche C-Chain"`);
      html = html.replace(/"base"/g, `"avalanche"`);
      html = html.replace(/\bBase\b/g, "Avalanche");

      if (process.env.NODE_ENV === 'development') {
        // Verify replacements
        const remainingBase = html.match(/8453|84532/g);
        console.log('Remaining Base chain IDs after replacement:', remainingBase?.length || 0);
        const remainingRpc = html.match(/https:\/\/[^"'\s]*\.base\.org(?!\/)/g);
        console.log('Remaining Base RPC URLs:', remainingRpc?.length || 0);
      }

      // Copy headers
      const newHeaders = new Headers();
      response.headers.forEach((value, key) => {
        newHeaders.set(key, value);
      });

      return new NextResponse(html, {
        status: 402,
        headers: newHeaders,
      });
    }
  }

  return response;
};

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/", // Include the root path explicitly
  ],
};
