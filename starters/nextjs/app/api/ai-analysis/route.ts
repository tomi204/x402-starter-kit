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
    // Validate AI API key before processing payment
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("❌ OPENROUTER_API_KEY not configured");
      return NextResponse.json(
        {
          error: "Service configuration error",
          details: "AI service is not properly configured. Please contact support."
        },
        { status: 503 }
      );
    }

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
      console.error("❌ Payment settlement failed:", settleResult.error);
      return NextResponse.json(
        {
          error: "Payment settlement failed",
          details: settleResult.error,
          message: "Unable to process payment. Please ensure your payment details are correct and try again."
        },
        { status: 402 }
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
    console.error("❌ Error processing AI analysis:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // Check if it's an AI API key error
    if (errorMessage.includes("OpenRouter API key") || errorMessage.includes("API key")) {
      return NextResponse.json(
        {
          error: "AI service authentication failed",
          details: errorMessage,
          message: "There's an issue with the AI service configuration. Please contact support."
        },
        { status: 503 }
      );
    }

    // Check if it's an OpenRouter error
    if (errorMessage.includes("OpenRouter")) {
      return NextResponse.json(
        {
          error: "AI service error",
          details: errorMessage,
          message: "The AI service encountered an error. Please try again later."
        },
        { status: 503 }
      );
    }

    // Generic error
    return NextResponse.json(
      {
        error: "Request processing failed",
        details: errorMessage,
        message: "An unexpected error occurred. Please try again later."
      },
      { status: 500 }
    );
  }
}
