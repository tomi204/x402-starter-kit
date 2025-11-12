import { NextRequest, NextResponse } from "next/server";

/**
 * Generate a session token for Coinbase Onramp and Offramp
 *
 * This is required for the CDP (Coinbase Developer Platform) integration
 * Make sure CDP_API_KEY_ID and CDP_API_KEY_SECRET are set in .env.local
 */
export async function POST(request: NextRequest) {
  try {
    // Re-export the POST handler from x402-next
    const { POST: x402POST } = await import("x402-next");
    return await x402POST(request);
  } catch (error) {
    console.error("Session token error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate session token",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
