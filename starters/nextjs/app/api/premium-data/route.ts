import { NextRequest, NextResponse } from "next/server";
import { extractPaymentFromHeader, settlePayment } from "@/lib/x402-middleware";

/**
 * Premium data endpoint protected with x402 payment
 * Returns market insights and analytics for $0.01
 *
 * Note: Payment verification is handled by middleware.ts
 * This route only handles settlement and returning protected content
 */
export async function GET(request: NextRequest) {
  // Payment verification was already done in middleware
  // If we reached here, payment is valid - now settle and return content

  const payment = extractPaymentFromHeader(request);
  if (!payment) {
    // Should not happen if middleware is working correctly
    return NextResponse.json(
      { error: "No payment found - middleware misconfiguration" },
      { status: 500 }
    );
  }

  try {
    const url = new URL(request.url);
    const resourceUrl = `${url.protocol}//${url.host}${url.pathname}`;
    const facilitatorUrl = process.env.NEXT_PUBLIC_FACILITATOR_URL!;

    // Settle payment with our facilitator
    const settleResult = await settlePayment(
      payment,
      {
        scheme: "exact",
        network: "avalanche-fuji",
        payTo: process.env.NEXT_PUBLIC_RECEIVER_ADDRESS!,
        maxAmountRequired: "10000",
        asset: "0x5425890298aed601595a70AB815c96711a31Bc65",
        description:
          "Premium data access - Market insights and analytics - $0.01 USDC",
        mimeType: "application/json",
        maxTimeoutSeconds: 300,
      },
      resourceUrl,
      facilitatorUrl
    );

    if (!settleResult.success) {
      return NextResponse.json(
        { error: "Settlement failed", details: settleResult.error },
        { status: 500 }
      );
    }

    // Payment successful! Return the premium data
    const premiumData = {
      message: "Congratulations! You have access to premium data.",
      data: {
        insights: [
          {
            id: 1,
            title: "Avalanche C-Chain Analytics",
            description: "Real-time network statistics and transaction data",
            metrics: {
              tps: "4,500",
              blockTime: "0.8s",
              validators: "1,200+",
            },
          },
          {
            id: 2,
            title: "DeFi Opportunities",
            description: "Curated list of high-yield farming opportunities",
            protocols: ["Trader Joe", "Aave", "Benqi", "Platypus"],
          },
          {
            id: 3,
            title: "Market Intelligence",
            description: "Advanced trading signals and price predictions",
            accuracy: "87%",
          },
        ],
        exclusiveContent: {
          researchReports: 12,
          tradingSignals: 45,
          tutorialVideos: 23,
        },
      },
      timestamp: new Date().toISOString(),
      txHash: settleResult.txHash,
      networkId: settleResult.networkId,
    };

    return NextResponse.json(premiumData);
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      {
        error: "Payment processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
