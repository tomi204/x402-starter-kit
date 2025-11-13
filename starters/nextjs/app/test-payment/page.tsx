'use client'

import { useState } from 'react'
import { useWalletClient } from 'wagmi'
import { useAppKitAccount } from '@reown/appkit/react'
import Link from 'next/link'
import { fetchWithPayment } from '@/lib/x402-client'
import { Footer } from '@/components/ui/footer'

interface TestPaymentResult {
  success: boolean;
  message: string;
  txHash?: string;
  networkId?: string;
  data?: {
    premium: boolean;
    content: string;
    timestamp: string;
  };
}

export default function TestPaymentPage() {
  const [result, setResult] = useState<TestPaymentResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isConnected } = useAppKitAccount()
  const { data: walletClient } = useWalletClient()

  const testPayment = async () => {
    if (!isConnected || !walletClient) {
      setError('Please connect your wallet first')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log('🚀 Starting payment test...')

      // Use our custom x402 client
      const response = await fetchWithPayment(
        '/api/test-payment',
        walletClient
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('✅ Payment successful!', data)

      setResult(data)
    } catch (err) {
      console.error('❌ Payment error:', err)
      setError(err instanceof Error ? err.message : 'Failed to complete payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <main className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-4xl">
                🧪
              </div>
              <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-gray-100">
                Test Payment Flow
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Direct test using x402-axios + our Avalanche facilitator
              </p>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/10">
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                  📋 Test Details
                </h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Network: Avalanche Fuji</li>
                  <li>• Price: $0.01 (10000 USDC with 6 decimals)</li>
                  <li>• Facilitator: http://localhost:3402</li>
                  <li>• Method: x402-axios</li>
                </ul>
              </div>

              {!isConnected && (
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/10">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    ⚠️ Please connect your wallet using the button in the top right
                  </p>
                </div>
              )}

              <button
                onClick={testPayment}
                disabled={loading || !isConnected || !walletClient}
                className="w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing Payment...
                  </span>
                ) : (
                  'Test Payment ($0.01)'
                )}
              </button>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/10">
                  <h3 className="mb-2 font-semibold text-red-900 dark:text-red-100">
                    ❌ Error
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              {result && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-900/10">
                  <h3 className="mb-2 font-semibold text-green-900 dark:text-green-100">
                    ✅ Success!
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-green-700 dark:text-green-300">
                      {result.message}
                    </p>
                    {result.txHash && (
                      <p className="font-mono text-xs text-green-600 dark:text-green-400">
                        TX: {result.txHash}
                      </p>
                    )}
                    {result.data && (
                      <div className="mt-4 rounded-lg border border-green-300 bg-white p-3 dark:border-green-800 dark:bg-gray-900">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          Protected Content:
                        </p>
                        <p className="mt-1 text-gray-700 dark:text-gray-300">
                          {result.data.content}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {result && (
                <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                  <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Full Response:
                  </h4>
                  <pre className="overflow-x-auto text-xs text-gray-600 dark:text-gray-400">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
