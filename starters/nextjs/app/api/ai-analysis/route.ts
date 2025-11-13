import { NextRequest, NextResponse } from "next/server";
import { extractPaymentFromHeader, settlePayment } from "@/lib/x402-middleware";
import { AIService } from "@/lib/ai-service";

/**
 * AI Analysis endpoint protected with x402 payment
 * Returns advanced market analysis for $0.25
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

    // Settle payment with our facilitator
    const settleResult = await settlePayment(
      payment,
      {
        scheme: "exact",
        network: "avalanche-fuji",
        payTo: process.env.NEXT_PUBLIC_RECEIVER_ADDRESS!,
        maxAmountRequired: "250000",
        asset: "0x5425890298aed601595a70AB815c96711a31Bc65",
        description: "AI-powered market analysis - Advanced insights and predictions - $0.25 USDC",
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

    // Payment successful! Generate AI analysis
    const aiService = new AIService({
      apiKey: process.env.OPENROUTER_API_KEY,
      model: 'anthropic/claude-3.5-sonnet',
      temperature: 0.7,
      maxTokens: 800,
    });

    const analysis = await aiService.generateMarketAnalysis();

    // Add settlement info to response
    const response = {
      ...analysis,
      txHash: settleResult.txHash,
      networkId: settleResult.networkId,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { error: "Payment processing failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
