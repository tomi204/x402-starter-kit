import { NextRequest, NextResponse } from "next/server";

/**
 * Test endpoint to verify 402 payment flow works with our facilitator
 * This bypasses x402-next to test the facilitator directly
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
        description: "Test payment endpoint - $0.01 USDC",
        mimeType: "application/json",
        maxTimeoutSeconds: 300,
      }
    ];

    return new NextResponse(
      JSON.stringify({
        message: "Payment required",
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

    const verifyBody = {
      x402Version: 1,
      paymentPayload: payment,
      paymentRequirements: {
        scheme: "exact",
        network: "avalanche-fuji",
        payTo: process.env.NEXT_PUBLIC_RECEIVER_ADDRESS,
        maxAmountRequired: "10000",
        asset: "0x5425890298aed601595a70AB815c96711a31Bc65",
        resource: resourceUrl,
        description: "Test payment endpoint - $0.01 USDC",
        mimeType: "application/json",
        maxTimeoutSeconds: 300,
      },
    };

    console.log("📤 Sending verify request to facilitator:", facilitatorUrl);
    console.log("📦 Verify body:", JSON.stringify(verifyBody, null, 2));

    const verifyResponse = await fetch(`${facilitatorUrl}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verifyBody),
    });

    console.log("📥 Verify response status:", verifyResponse.status);
    const verifyText = await verifyResponse.text();
    console.log("📥 Verify response body:", verifyText);

    if (!verifyResponse.ok) {
      return NextResponse.json(
        { error: "Payment verification failed", details: verifyText },
        { status: 400 }
      );
    }

    let verifyResult;
    try {
      verifyResult = JSON.parse(verifyText);
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON response from facilitator", details: verifyText },
        { status: 500 }
      );
    }

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
          description: "Test payment endpoint - $0.01 USDC",
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
