import { NextRequest, NextResponse } from "next/server";
import { extractPaymentFromHeader, settlePayment } from "@/lib/x402-middleware";

/**
 * Test endpoint to verify 402 payment flow works with our facilitator
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
    const facilitatorUrl = process.env.NEXT_PUBLIC_FACILITATOR_URL || "http://localhost:3402";

    console.log("💳 Payment verified by middleware, settling...");

    // Settle payment with our facilitator
    const settleResult = await settlePayment(
      payment,
      {
        scheme: "exact",
        network: "avalanche-fuji",
        payTo: process.env.NEXT_PUBLIC_RECEIVER_ADDRESS!,
        maxAmountRequired: "10000",
        asset: "0x5425890298aed601595a70AB815c96711a31Bc65",
        description: "Test payment endpoint - $0.01 USDC",
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

    console.log("✅ Payment settled successfully!");

    // Payment successful! Return the protected content
    return NextResponse.json({
      success: true,
      message: "Payment accepted! Here's your premium content.",
      txHash: settleResult.txHash,
      networkId: settleResult.networkId,
      data: {
        premium: true,
        content: "This is the protected content that required payment!",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { error: "Payment processing failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
