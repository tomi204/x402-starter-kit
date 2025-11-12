import { NextRequest, NextResponse } from "next/server";

/**
 * Premium data endpoint protected with x402 payment
 * Returns market insights and analytics for $0.01
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
        maxAmountRequired: "10000", // 0.01 USDC (6 decimals)
        asset: "0x5425890298aed601595a70AB815c96711a31Bc65", // USDC on Fuji
        facilitator: process.env.NEXT_PUBLIC_FACILITATOR_URL || "http://localhost:3402",
        resource: resourceUrl,
        description: "Premium data access - Market insights and analytics - $0.01 USDC",
        mimeType: "application/json",
        maxTimeoutSeconds: 300,
      }
    ];

    return new NextResponse(
      JSON.stringify({
        message: "Payment required for premium data access",
        price: "$0.01",
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
          maxAmountRequired: "10000",
          asset: "0x5425890298aed601595a70AB815c96711a31Bc65",
          resource: resourceUrl,
          description: "Premium data access - Market insights and analytics - $0.01 USDC",
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
          maxAmountRequired: "10000",
          asset: "0x5425890298aed601595a70AB815c96711a31Bc65",
          resource: resourceUrl,
          description: "Premium data access - Market insights and analytics - $0.01 USDC",
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
      { error: "Payment processing failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
