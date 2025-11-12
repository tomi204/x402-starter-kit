/**
 * Premium API endpoint protected by x402 payment middleware
 *
 * This endpoint is automatically protected by the payment middleware
 * configured in middleware.ts. Users must pay $0.10 to access this endpoint.
 *
 * The middleware handles:
 * - Payment verification
 * - Payment settlement
 * - Access control
 */
export async function GET() {
  // If the request reaches here, payment has been verified and settled by the middleware
  return Response.json({
    data: "premium content",
    message: "This is premium content only accessible after payment",
    timestamp: new Date().toISOString(),
    content: {
      exclusiveData: "This data is only available to paying users",
      analysis: "Advanced market analysis and insights",
      features: [
        "Real-time data feeds",
        "Advanced analytics",
        "Priority support"
      ]
    }
  });
}
