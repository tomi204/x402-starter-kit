'use client'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useWalletClient } from 'wagmi'
import { useAppKitAccount } from '@reown/appkit/react'
import { fetchWithPayment } from '@/lib/x402-client'
import { Footer } from '@/components/ui/footer'

const CONTENT_CONFIG = {
  cheap: {
    price: '$0.01',
    title: 'Premium Data Access',
    icon: '📊',
    gradient: 'from-red-500 to-orange-500',
    apiEndpoint: '/api/premium-data',
    description: 'Exclusive market insights and analytics'
  },
  expensive: {
    price: '$0.25',
    title: 'AI-Powered Analysis',
    icon: '🤖',
    gradient: 'from-red-600 to-pink-600',
    apiEndpoint: '/api/ai-analysis',
    description: 'Advanced AI market intelligence'
  },
} as const

type ContentType = keyof typeof CONTENT_CONFIG

interface PremiumData {
  data?: {
    insights: Array<{
      id: number;
      title: string;
      description: string;
      metrics?: Record<string, string>;
      protocols?: string[];
    }>;
    exclusiveContent: {
      researchReports: number;
      tradingSignals: number;
      tutorialVideos: number;
    };
  };
  analysis?: {
    marketSentiment: {
      score: number;
      trend: string;
      confidence: string;
      summary: string;
    };
    recommendations: Array<{
      action: string;
      asset: string;
      confidence: string;
      reasoning: string;
    }>;
    riskFactors: string[];
    opportunities: string[];
  };
  model?: string;
  tokens?: number;
  generatedAt?: string;
}

export default function ContentPage({ params }: { params: Promise<{ type: string }> }) {
  const [contentType, setContentType] = useState<ContentType | null>(null)
  const [data, setData] = useState<PremiumData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isConnected } = useAppKitAccount()
  const { data: walletClient } = useWalletClient()

  // Debug logging
  useEffect(() => {
    console.log('🔍 Wallet Status:', {
      isConnected,
      hasWalletClient: !!walletClient,
      walletClient
    })
  }, [isConnected, walletClient])

  useEffect(() => {
    params.then(({ type }) => {
      if (!['cheap', 'expensive'].includes(type)) {
        notFound()
      }
      setContentType(type as ContentType)
    })
  }, [params])

  useEffect(() => {
    if (!contentType) return

    const loadContent = async () => {
      // Reset error when connection state changes
      setError(null)
      setLoading(true)

      // Check if wallet is connected first
      if (!isConnected) {
        console.log('⏳ Waiting for wallet connection...')
        // Keep loading state, give time for wallet to connect
        setTimeout(() => {
          if (!isConnected) {
            setError('Please connect your wallet to access this content')
            setLoading(false)
          }
        }, 1500) // Wait 1.5s before showing error
        return
      }

      // Wait for wallet client to be available
      if (!walletClient) {
        console.log('⏳ Waiting for wallet client...')
        // Keep loading state, don't show error yet
        return
      }

      console.log('✅ Wallet client available, proceeding with payment...')

      try {
        const config = CONTENT_CONFIG[contentType]
        console.log('🔐 Fetching protected content with payment...')

        const response = await fetchWithPayment(config.apiEndpoint, walletClient)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()
        console.log('✅ Content loaded successfully!')
        setData(result)
        setError(null) // Clear any errors
      } catch (err) {
        console.error('❌ Failed to load content:', err)
        setError(err instanceof Error ? err.message : 'Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [contentType, isConnected, walletClient])

  if (!contentType) return null

  const config = CONTENT_CONFIG[contentType]

  return (
    <div className="min-h-screen">{/* Background handled by AnimatedShaderBackground in layout */}
      <main className="container mx-auto px-4 py-16">
        {/* Error Banner */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-900/10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-2xl">
                ⚠
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Error
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {error}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-700"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        )}

        {/* Success Banner */}
        {!error && !loading && data && (
          <div className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-900/50 dark:bg-green-900/10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-2xl">
                ✓
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Payment Successful!
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You paid {config.price} on Avalanche C-Chain
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content Card */}
        <div className="mb-8 rounded-3xl border border-red-900/30 bg-neutral-950/70 backdrop-blur-sm p-8 shadow-xl shadow-red-900/20 md:p-12">
          <div className="mb-8 text-center">
            <div className={`mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${config.gradient} text-4xl`}>
              {config.icon}
            </div>
            <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-gray-100">
              {config.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {config.description}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-800 border-t-red-500" />
            </div>
          ) : data ? (
            <div className="space-y-6">
              {contentType === 'cheap' && data.data && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-red-900/30 bg-neutral-900/50 backdrop-blur-sm p-6">
                    <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                      📈 Market Insights
                    </h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      {data.data.insights.map((insight) => (
                        <div key={insight.id} className="rounded-lg border border-red-900/30 bg-neutral-950/70 backdrop-blur-sm p-4">
                          <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                            {insight.title}
                          </h4>
                          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                            {insight.description}
                          </p>
                          {insight.metrics && (
                            <div className="space-y-1">
                              {Object.entries(insight.metrics).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-xs">
                                  <span className="text-gray-500">{key}:</span>
                                  <span className="font-semibold">{value as string}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {insight.protocols && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {insight.protocols.map((protocol: string) => (
                                <span key={protocol} className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                  {protocol}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-red-900/30 bg-gradient-to-br from-red-950/50 to-orange-950/50 backdrop-blur-sm p-6">
                      <div className="text-3xl font-bold text-red-500">
                        {data.data.exclusiveContent.researchReports}
                      </div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Research Reports
                      </div>
                    </div>
                    <div className="rounded-xl border border-red-900/30 bg-gradient-to-br from-red-950/50 to-pink-950/50 backdrop-blur-sm p-6">
                      <div className="text-3xl font-bold text-red-400">
                        {data.data.exclusiveContent.tradingSignals}
                      </div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Trading Signals
                      </div>
                    </div>
                    <div className="rounded-xl border border-red-900/30 bg-gradient-to-br from-orange-950/50 to-yellow-950/50 backdrop-blur-sm p-6">
                      <div className="text-3xl font-bold text-orange-400">
                        {data.data.exclusiveContent.tutorialVideos}
                      </div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tutorial Videos
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {contentType === 'expensive' && data.analysis && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 dark:border-gray-800 dark:from-purple-900/20 dark:to-pink-900/20">
                    <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                      🎯 Market Sentiment Analysis
                    </h3>
                    <div className="mb-4 flex items-center gap-4">
                      <div className="text-5xl font-bold text-purple-600 dark:text-purple-400">
                        {data.analysis.marketSentiment.score}/10
                      </div>
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            {data.analysis.marketSentiment.trend.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {data.analysis.marketSentiment.confidence} confidence
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {data.analysis.marketSentiment.summary}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                      <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
                        💡 AI Recommendations
                      </h3>
                      <div className="space-y-3">
                        {data.analysis.recommendations.map((rec, i) => (
                          <div key={i} className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                            <div className="mb-2 flex items-center justify-between">
                              <span className={`rounded px-2 py-1 text-xs font-bold ${rec.action === 'BUY' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                                {rec.action}
                              </span>
                              <span className="font-bold text-gray-900 dark:text-gray-100">{rec.asset}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{rec.reasoning}</p>
                            <div className="mt-2 text-xs text-gray-500">
                              Confidence: <span className="font-semibold">{rec.confidence}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-900/10">
                        <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-gray-100">
                          ⚠️ Risk Factors
                        </h3>
                        <ul className="space-y-2">
                          {data.analysis.riskFactors.map((risk: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <span className="text-red-500">•</span>
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-900/50 dark:bg-green-900/10">
                        <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-gray-100">
                          🚀 Opportunities
                        </h3>
                        <ul className="space-y-2">
                          {data.analysis.opportunities.map((opp: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <span className="text-green-500">•</span>
                              {opp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Generated by {data.model || 'AI'}</span>
                      <span>{data.tokens || 0} tokens used</span>
                      <span>{data.generatedAt ? new Date(data.generatedAt).toLocaleTimeString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              Failed to load content
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/50"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
