import { NextRequest, NextResponse } from "next/server";

/**
 * Simple middleware - all payment handling is done client-side with our custom x402 implementation
 * This middleware just passes requests through - no x402-next dependency
 */
export const middleware = async (req: NextRequest) => {
  // Just pass through - payment handling happens in the client
  return NextResponse.next();
};

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/", // Include the root path explicitly
  ],
};
