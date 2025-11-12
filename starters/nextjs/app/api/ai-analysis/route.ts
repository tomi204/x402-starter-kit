import { NextRequest, NextResponse } from "next/server";

/**
 * AI Analysis endpoint protected with x402 payment
 * Returns advanced market analysis for $0.25
 */
export async function GET(request: NextRequest) {
  const paymentHeader = request.headers.get("x-payment");

  // If no payment header, return 402 with payment requirements
  if (!paymentHeader) {
    // Get the full URL from the request
    const url = new URL(request.url);
    const resourceUrl = `${url.protocol}//${url.host}${url.pathname}`;

    const paymentRequirements = [
      {
        scheme: "exact",
        network: "avalanche-fuji",
        payTo: process.env.NEXT_PUBLIC_RECEIVER_ADDRESS,
        maxAmountRequired: "250000", // 0.25 USDC (6 decimals)
        asset: "0x5425890298aed601595a70AB815c96711a31Bc65", // USDC on Fuji
        facilitator: process.env.NEXT_PUBLIC_FACILITATOR_URL || "http://localhost:3402",
        resource: resourceUrl,
        description: "AI-powered market analysis - Advanced insights and predictions - $0.25 USDC",
        mimeType: "application/json",
        maxTimeoutSeconds: 300,
      }
    ];

    return new NextResponse(
      JSON.stringify({
        message: "Payment required for AI analysis",
        price: "$0.25",
      }),
      {
        status: 402,
        headers: {
          "Content-Type": "application/json",
          "X-Accept-Payment": JSON.stringify(paymentRequirements),
        },
      }
    );
  }

  // Parse payment header
  try {
    const payment = JSON.parse(
      Buffer.from(paymentHeader, "base64").toString("utf-8")
    );

    // Verify payment with our facilitator
    const facilitatorUrl = process.env.NEXT_PUBLIC_FACILITATOR_URL || "http://localhost:3402";

    // Get the full URL from the request
    const url = new URL(request.url);
    const resourceUrl = `${url.protocol}//${url.host}${url.pathname}`;

    const verifyResponse = await fetch(`${facilitatorUrl}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        x402Version: 1,
        paymentPayload: payment,
        paymentRequirements: {
          scheme: "exact",
          network: "avalanche-fuji",
          payTo: process.env.NEXT_PUBLIC_RECEIVER_ADDRESS,
          maxAmountRequired: "250000",
          asset: "0x5425890298aed601595a70AB815c96711a31Bc65",
          resource: resourceUrl,
          description: "AI-powered market analysis - Advanced insights and predictions - $0.25 USDC",
          mimeType: "application/json",
          maxTimeoutSeconds: 300,
        },
      }),
    });

    if (!verifyResponse.ok) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    const verifyResult = await verifyResponse.json();

    if (!verifyResult.isValid) {
      return NextResponse.json(
        { error: "Invalid payment", reason: verifyResult.invalidReason },
        { status: 400 }
      );
    }

    // Settle payment with our facilitator
    const settleResponse = await fetch(`${facilitatorUrl}/settle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        x402Version: 1,
        paymentPayload: payment,
        paymentRequirements: {
          scheme: "exact",
          network: "avalanche-fuji",
          payTo: process.env.NEXT_PUBLIC_RECEIVER_ADDRESS,
          maxAmountRequired: "250000",
          asset: "0x5425890298aed601595a70AB815c96711a31Bc65",
          resource: resourceUrl,
          description: "AI-powered market analysis - Advanced insights and predictions - $0.25 USDC",
          mimeType: "application/json",
          maxTimeoutSeconds: 300,
        },
      }),
    });

    if (!settleResponse.ok) {
      return NextResponse.json(
        { error: "Payment settlement failed" },
        { status: 500 }
      );
    }

    const settleResult = await settleResponse.json();

    if (!settleResult.success) {
      return NextResponse.json(
        { error: "Settlement failed", details: settleResult.error },
        { status: 500 }
      );
    }

    // Payment successful! Return the AI analysis
    const analysis = {
      message: "AI Analysis Complete",
      analysis: {
        marketSentiment: {
          score: 7.8,
          trend: "bullish",
          confidence: "85%",
          summary:
            "Strong positive sentiment across Avalanche ecosystem. Increased developer activity and institutional interest.",
        },
        recommendations: [
          {
            action: "BUY",
            asset: "AVAX",
            confidence: "HIGH",
            reasoning:
              "Technical indicators show strong support at current levels. Network activity increasing.",
          },
          {
            action: "HOLD",
            asset: "JOE",
            confidence: "MEDIUM",
            reasoning:
              "Wait for next major protocol upgrade before increasing position.",
          },
        ],
        riskFactors: [
          "Market volatility in macro environment",
          "Regulatory uncertainty",
          "Competition from other L1 chains",
        ],
        opportunities: [
          "Growing DeFi ecosystem on Avalanche",
          "Subnet deployments increasing",
          "Institutional adoption trending up",
        ],
      },
      generatedAt: new Date().toISOString(),
      model: "GPT-4 Turbo",
      tokens: 1847,
      txHash: settleResult.txHash,
      networkId: settleResult.networkId,
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { error: "Payment processing failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
