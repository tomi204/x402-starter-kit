"use client";

import { ContentCard } from "@/components/ui/content-card";
import { Stats } from "@/components/ui/stats";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Typewriter } from "@/components/ui/typewriter";
import { Footer } from "@/components/ui/footer";
import { useAppKitAccount } from "@reown/appkit/react";

export default function Home() {
  const { isConnected } = useAppKitAccount();

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-white sm:text-6xl">
            x402 Payment Protocol
            <br />
            <TextShimmer
              as="span"
              className="text-5xl font-bold sm:text-6xl"
              duration={3}
              spread={3}
              baseColor="#dc2626"
              gradientColor="#ffffff"
            >
              on Avalanche
            </TextShimmer>
          </h1>

          <p className="mx-auto mb-4 max-w-2xl text-lg text-gray-400">
            Monetize your APIs, content, and AI services with instant cryptocurrency payments.
            Pay-per-use model with on-chain verification.
          </p>

          {/* Powered by Avalanche with Typewriter */}
          <div className="mb-8 flex items-center justify-center gap-2 text-lg">
            <span className="text-red-600 text-2xl">🔺</span>
            <span className="text-gray-300">Powered by Avalanche</span>
            <span className="text-gray-500">-</span>
            <Typewriter
              text={[
                "for you",
                "for developers",
                "for creators",
                "for innovators",
                "for the future",
              ]}
              speed={70}
              className="text-red-500 font-semibold"
              waitTime={1500}
              deleteSpeed={40}
              cursorChar={"_"}
              loop={true}
            />
          </div>

          {!isConnected && (
            <div className="mb-12 rounded-lg border border-red-900/50 bg-red-950/20 p-6">
              <div className="text-center">
                <p className="font-semibold text-white mb-2">
                  Connect Wallet to Continue
                </p>
                <p className="text-sm text-gray-400">
                  MetaMask, Core Wallet, or any EVM-compatible wallet
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mb-16">
          <Stats />
        </div>

        {/* Content Cards */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
            Choose Your Content
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <ContentCard
              title="Premium Data Access"
              description="Get access to exclusive market insights, analytics, and real-time data feeds for Avalanche ecosystem."
              price="$0.01"
              href="/content/cheap"
              icon="📊"
              gradient="from-blue-500 to-cyan-500"
            />

            <ContentCard
              title="AI-Powered Analysis"
              description="Unlock advanced AI market analysis, trading signals, and personalized investment recommendations."
              price="$0.25"
              href="/content/expensive"
              icon="🤖"
              gradient="from-purple-500 to-pink-500"
            />

            <ContentCard
              title="Payment Test (Manual x402)"
              description="Custom x402 implementation for Avalanche. Uses EIP-3009 USDC signatures + local facilitator."
              price="$0.01"
              href="/test-payment"
              icon="🧪"
              gradient="from-green-500 to-emerald-500"
            />
          </div>
        </div>

        {/* How it Works */}
        <div className="rounded-lg border border-red-900/30 bg-neutral-950/60 backdrop-blur-sm p-8 md:p-12">
          <h2 className="mb-8 text-center text-3xl font-bold text-white">
            How It Works
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-red-600 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                Connect Wallet
              </h3>
              <p className="text-gray-400">
                Use MetaMask, Core Wallet or any EVM wallet to connect to Avalanche
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-red-600 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                Select Content
              </h3>
              <p className="text-gray-400">
                Choose the content you want to access and review the payment amount
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-red-600 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                Instant Access
              </h3>
              <p className="text-gray-400">
                Payment verified on-chain, content unlocked immediately
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-white">
            Protocol Features
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Sub-Second Finality",
                desc: "Instant transaction confirmation",
              },
              {
                title: "Low Transaction Costs",
                desc: "Minimal gas fees"
              },
              {
                title: "Cryptographically Secure",
                desc: "Battle-tested infrastructure"
              },
              {
                title: "EVM Compatible",
                desc: "Standard Ethereum tooling",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border border-red-900/30 bg-neutral-950/50 backdrop-blur-sm p-6 text-center"
              >
                <h3 className="mb-2 font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
