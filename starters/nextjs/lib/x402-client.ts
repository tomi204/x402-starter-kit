import { WalletClient } from 'viem'

export interface PaymentRequirement {
  scheme: string
  network: string
  payTo: string
  maxAmountRequired: string
  asset: string
  facilitator: string
}

export interface PaymentPayload {
  x402Version: number
  scheme: string
  network: string
  payload: {
    signature: string
    authorization: {
      from: string
      to: string
      value: string
      validAfter: string
      validBefore: string
      nonce: string
    }
  }
}

/**
 * Create EIP-3009 signature for USDC transfer authorization
 */
async function createEIP3009Signature(
  walletClient: WalletClient,
  requirement: PaymentRequirement
): Promise<PaymentPayload> {
  const account = walletClient.account
  if (!account) throw new Error('No account found')

  const from = account.address
  const to = requirement.payTo as `0x${string}`
  const value = requirement.maxAmountRequired
  const validAfter = '0'
  const validBefore = Math.floor(Date.now() / 1000 + 900).toString() // 15 min
  const nonce = `0x${Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')}`

  // EIP-712 domain for USDC on Avalanche Fuji
  const domain = {
    name: 'USD Coin',
    version: '2',
    chainId: 43113,
    verifyingContract: requirement.asset as `0x${string}`,
  }

  // EIP-712 types for transferWithAuthorization
  const types = {
    TransferWithAuthorization: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'validAfter', type: 'uint256' },
      { name: 'validBefore', type: 'uint256' },
      { name: 'nonce', type: 'bytes32' },
    ],
  }

  const message = {
    from,
    to,
    value: BigInt(value),
    validAfter: BigInt(validAfter),
    validBefore: BigInt(validBefore),
    nonce: nonce as `0x${string}`,
  }

  // Sign with EIP-712
  const signature = await walletClient.signTypedData({
    account,
    domain,
    types,
    primaryType: 'TransferWithAuthorization',
    message,
  })

  return {
    x402Version: 1,
    scheme: requirement.scheme,
    network: requirement.network,
    payload: {
      signature,
      authorization: {
        from,
        to,
        value,
        validAfter,
        validBefore,
        nonce,
      },
    },
  }
}

/**
 * Fetch a protected resource with automatic payment handling
 */
export async function fetchWithPayment(
  url: string,
  walletClient: WalletClient,
  options: RequestInit = {}
): Promise<Response> {
  // First attempt - without payment
  const response = await fetch(url, options)

  // If not 402, return as-is
  if (response.status !== 402) {
    return response
  }

  // Parse payment requirements
  const acceptPaymentHeader = response.headers.get('x-accept-payment')
  if (!acceptPaymentHeader) {
    throw new Error('402 response missing x-accept-payment header')
  }

  const requirements: PaymentRequirement[] = JSON.parse(acceptPaymentHeader)
  if (requirements.length === 0) {
    throw new Error('No payment requirements found')
  }

  // Use first requirement (could be extended to support multiple)
  const requirement = requirements[0]

  console.log('💳 Creating payment signature...')
  const paymentPayload = await createEIP3009Signature(walletClient, requirement)

  // Encode payment as base64
  const paymentHeader = btoa(JSON.stringify(paymentPayload))

  console.log('💰 Retrying request with payment header...')

  // Retry with payment header
  const paidResponse = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'x-payment': paymentHeader,
    },
  })

  return paidResponse
}
