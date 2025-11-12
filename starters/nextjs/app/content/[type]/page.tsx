'use client'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'

const CONTENT_CONFIG = {
  cheap: {
    price: '$0.01',
    title: 'Premium Data Access',
    icon: '📊',
    gradient: 'from-blue-500 to-cyan-500',
    apiEndpoint: '/api/premium-data',
    description: 'Exclusive market insights and analytics'
  },
  expensive: {
    price: '$0.25',
    title: 'AI-Powered Analysis',
    icon: '🤖',
    gradient: 'from-purple-500 to-pink-500',
    apiEndpoint: '/api/ai-analysis',
    description: 'Advanced AI market intelligence'
  },
} as const

type ContentType = keyof typeof CONTENT_CONFIG

export default function ContentPage({ params }: { params: Promise<{ type: string }> }) {
  const [contentType, setContentType] = useState<ContentType | null>(null)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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

    const config = CONTENT_CONFIG[contentType]
    fetch(config.apiEndpoint)
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch data:', err)
        setLoading(false)
      })
  }, [contentType])

  if (!contentType) return null

  const config = CONTENT_CONFIG[contentType]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <main className="container mx-auto px-4 py-16">
        {/* Success Banner */}
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

        {/* Content Card */}
        <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900 md:p-12">
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
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
            </div>
          ) : data ? (
            <div className="space-y-6">
              {contentType === 'cheap' && data.data && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-800/50">
                    <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                      📈 Market Insights
                    </h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      {data.data.insights.map((insight: any) => (
                        <div key={insight.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
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
                    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-gray-800 dark:from-blue-900/20 dark:to-cyan-900/20">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {data.data.exclusiveContent.researchReports}
                      </div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Research Reports
                      </div>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 dark:border-gray-800 dark:from-purple-900/20 dark:to-pink-900/20">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {data.data.exclusiveContent.tradingSignals}
                      </div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Trading Signals
                      </div>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 dark:border-gray-800 dark:from-green-900/20 dark:to-emerald-900/20">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
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
                        {data.analysis.recommendations.map((rec: any, i: number) => (
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
                      <span>Generated by {data.model}</span>
                      <span>{data.tokens} tokens used</span>
                      <span>{new Date(data.generatedAt).toLocaleTimeString()}</span>
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
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-gray-900"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}
