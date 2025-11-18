import { NextRequest, NextResponse } from 'next/server'

export interface PaymentRequirement {
  scheme: string
  network: string
  payTo: string
  maxAmountRequired: string
  asset: string
  facilitator: string
  resource: string
  description: string
  mimeType: string
  maxTimeoutSeconds: number
}

export interface PaymentPayload {
  x402Version: number;
  scheme: string;
  network: string;
  payload: {
    signature: string;
    authorization: {
      from: string;
      to: string;
      value: string;
      validAfter: string;
      validBefore: string;
      nonce: string;
    };
  };
}

export interface X402VerifyRequest {
  x402Version: number
  paymentPayload: PaymentPayload
  paymentRequirements: Omit<PaymentRequirement, 'facilitator'>
}

export interface X402SettleRequest {
  x402Version: number
  paymentPayload: PaymentPayload
  paymentRequirements: Omit<PaymentRequirement, 'facilitator'>
}

/**
 * Create a 402 Payment Required response with x402 payment requirements
 */
export function createPaymentRequiredResponse(
  requirement: PaymentRequirement,
  message?: string
): NextResponse {
  return new NextResponse(
    JSON.stringify({
      message: message || 'Payment required to access this resource',
      price: `$${(parseInt(requirement.maxAmountRequired) / 1_000_000).toFixed(2)}`,
    }),
    {
      status: 402,
      headers: {
        'Content-Type': 'application/json',
        'X-Accept-Payment': JSON.stringify([requirement]),
      },
    }
  )
}

/**
 * Verify a payment with the x402 facilitator
 */
export async function verifyPayment(
  paymentPayload: PaymentPayload,
  requirement: Omit<PaymentRequirement, 'facilitator' | 'resource'>,
  resourceUrl: string,
  facilitatorUrl: string
): Promise<{ isValid: boolean; invalidReason?: string }> {
  try {
    const verifyResponse = await fetch(`${facilitatorUrl}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        x402Version: 1,
        paymentPayload,
        paymentRequirements: {
          ...requirement,
          resource: resourceUrl,
        },
      } as X402VerifyRequest),
    })

    if (!verifyResponse.ok) {
      let errorDetails = `Facilitator returned HTTP ${verifyResponse.status}`;

      // Try to get more details from response body
      try {
        const errorBody = await verifyResponse.json();
        if (errorBody.error || errorBody.message) {
          errorDetails = `${errorDetails}: ${errorBody.error || errorBody.message}`;
        }
        if (errorBody.details) {
          errorDetails = `${errorDetails} - ${errorBody.details}`;
        }
      } catch {
        // If response is not JSON, use status text
        if (verifyResponse.statusText) {
          errorDetails = `${errorDetails}: ${verifyResponse.statusText}`;
        }
      }

      return {
        isValid: false,
        invalidReason: errorDetails,
      }
    }

    const result = await verifyResponse.json()
    return {
      isValid: result.isValid,
      invalidReason: result.invalidReason,
    }
  } catch (error) {
    console.error('Payment verification error:', error)

    // Provide more helpful error messages
    let errorMessage = 'Verification failed';
    if (error instanceof Error) {
      if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
        errorMessage = `Cannot connect to facilitator at ${facilitatorUrl}. Please verify the facilitator is running.`;
      } else {
        errorMessage = error.message;
      }
    }

    return {
      isValid: false,
      invalidReason: errorMessage,
    }
  }
}

/**
 * Settle a payment with the x402 facilitator
 */
export async function settlePayment(
  paymentPayload: PaymentPayload,
  requirement: Omit<PaymentRequirement, 'facilitator' | 'resource'>,
  resourceUrl: string,
  facilitatorUrl: string
): Promise<{ success: boolean; txHash?: string; networkId?: string; error?: string }> {
  try {
    const settleResponse = await fetch(`${facilitatorUrl}/settle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        x402Version: 1,
        paymentPayload,
        paymentRequirements: {
          ...requirement,
          resource: resourceUrl,
        },
      } as X402SettleRequest),
    })

    if (!settleResponse.ok) {
      let errorDetails = `Facilitator returned HTTP ${settleResponse.status}`;

      // Try to get more details from response body
      try {
        const errorBody = await settleResponse.json();
        if (errorBody.error || errorBody.message) {
          errorDetails = `${errorDetails}: ${errorBody.error || errorBody.message}`;
        }
        if (errorBody.details) {
          errorDetails = `${errorDetails} - ${errorBody.details}`;
        }
      } catch {
        // If response is not JSON, use status text
        if (settleResponse.statusText) {
          errorDetails = `${errorDetails}: ${settleResponse.statusText}`;
        }
      }

      return {
        success: false,
        error: errorDetails,
      }
    }

    const result = await settleResponse.json()
    return result
  } catch (error) {
    console.error('Payment settlement error:', error)

    // Provide more helpful error messages
    let errorMessage = 'Settlement failed';
    if (error instanceof Error) {
      if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
        errorMessage = `Cannot connect to facilitator at ${facilitatorUrl}. Please verify the facilitator is running.`;
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Extract and parse payment from x-payment header
 */
export function extractPaymentFromHeader(request: NextRequest): PaymentPayload | null {
  const paymentHeader = request.headers.get('x-payment')
  if (!paymentHeader) {
    return null
  }

  try {
    return JSON.parse(Buffer.from(paymentHeader, 'base64').toString('utf-8'))
  } catch (error) {
    console.error('Failed to parse payment header:', error)
    return null
  }
}

/**
 * Middleware helper to protect routes with x402 payment verification
 * Returns null if payment is valid, or a Response if payment is required/invalid
 */
export async function requirePayment(
  request: NextRequest,
  requirement: Omit<PaymentRequirement, 'resource'>
): Promise<NextResponse | null> {
  const payment = extractPaymentFromHeader(request)

  // No payment provided - return 402 with requirements
  if (!payment) {
    const url = new URL(request.url)
    const resourceUrl = `${url.protocol}//${url.host}${url.pathname}`

    return createPaymentRequiredResponse({
      ...requirement,
      resource: resourceUrl,
    })
  }

  // Verify payment
  const url = new URL(request.url)
  const resourceUrl = `${url.protocol}//${url.host}${url.pathname}`

  const verifyResult = await verifyPayment(
    payment,
    {
      scheme: requirement.scheme,
      network: requirement.network,
      payTo: requirement.payTo,
      maxAmountRequired: requirement.maxAmountRequired,
      asset: requirement.asset,
      description: requirement.description,
      mimeType: requirement.mimeType,
      maxTimeoutSeconds: requirement.maxTimeoutSeconds,
    },
    resourceUrl,
    requirement.facilitator
  )

  if (!verifyResult.isValid) {
    return NextResponse.json(
      {
        error: 'Invalid payment',
        reason: verifyResult.invalidReason,
      },
      { status: 400 }
    )
  }

  // Payment is valid - allow the request to proceed
  return null
}
