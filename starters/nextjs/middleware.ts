import { NextRequest, NextResponse } from "next/server";
import { requirePayment } from "./lib/x402-middleware";

/**
 * x402 Payment Required Middleware
 * Protects premium routes by verifying payment before allowing access
 */
export const middleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  // Define protected routes with their payment requirements
  const protectedRoutes: Record<
    string,
    {
      maxAmountRequired: string;
      description: string;
    }
  > = {
    "/api/premium-data": {
      maxAmountRequired: "10000", // 0.01 USDC
      description: "Premium data access - Market insights and analytics - $0.01 USDC",
    },
    "/api/ai-analysis": {
      maxAmountRequired: "250000", // 0.25 USDC
      description: "AI-powered market analysis - Advanced insights and predictions - $0.25 USDC",
    },
    "/api/test-payment": {
      maxAmountRequired: "10000", // 0.01 USDC
      description: "Test payment endpoint - $0.01 USDC",
    },
  };

  // Check if this is a protected route
  const routeConfig = protectedRoutes[pathname];
  if (!routeConfig) {
    // Not a protected route - pass through
    return NextResponse.next();
  }

  // This is a protected route - require payment
  const paymentResponse = await requirePayment(req, {
    scheme: "exact",
    network: "avalanche-fuji",
    payTo: process.env.NEXT_PUBLIC_RECEIVER_ADDRESS!,
    maxAmountRequired: routeConfig.maxAmountRequired,
    asset: "0x5425890298aed601595a70AB815c96711a31Bc65", // USDC on Fuji
    facilitator: process.env.NEXT_PUBLIC_FACILITATOR_URL || "http://localhost:3402",
    description: routeConfig.description,
    mimeType: "application/json",
    maxTimeoutSeconds: 300,
  });

  // If paymentResponse is not null, it means payment is required or invalid
  if (paymentResponse) {
    return paymentResponse;
  }

  // Payment verified - allow request to proceed
  return NextResponse.next();
};

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Only run on API routes that need protection
    "/api/premium-data",
    "/api/ai-analysis",
    "/api/test-payment",
  ],
};
