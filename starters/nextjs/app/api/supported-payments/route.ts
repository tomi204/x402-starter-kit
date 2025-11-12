import { NextResponse } from "next/server";
import {
  getAllSupportedPaymentMethods,
  getSupportedByChain,
  CHAIN_IDS
} from "@/lib/facilitator";

/**
 * GET /api/supported-payments
 * Query parameters:
 * - chainId: Optional chain ID to filter by specific chain
 *
 * Examples:
 * - GET /api/supported-payments - Get all supported payment methods
 * - GET /api/supported-payments?chainId=8453 - Get methods for Base mainnet
 * - GET /api/supported-payments?chainId=84532 - Get methods for Base Sepolia
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chainIdParam = searchParams.get("chainId");

    let supportedMethods;

    if (chainIdParam) {
      const chainId = parseInt(chainIdParam, 10);
      supportedMethods = await getSupportedByChain(chainId);
    } else {
      supportedMethods = await getAllSupportedPaymentMethods();
    }

    return NextResponse.json({
      success: true,
      data: supportedMethods,
      chainIds: CHAIN_IDS,
      message: chainIdParam
        ? `Supported payment methods for chain ${chainIdParam}`
        : "All supported payment methods across all chains"
    });
  } catch (error) {
    console.error("Error fetching supported payment methods:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
