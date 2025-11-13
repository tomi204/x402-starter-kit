'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { CustomConnectButton } from './custom-connect-button'

export function Header() {
  const { isConnected } = useAppKitAccount()
  const { caipNetwork } = useAppKitNetwork()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-red-900/30 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/small-logo.png"
            alt="Avalanche Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-xl font-bold text-white">x402 Protocol</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="https://build.avax.network/console/primary-network/faucet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-400 hover:text-red-600 transition-colors"
          >
            AVAX Faucet
          </Link>

          <Link
            href="https://faucet.circle.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-400 hover:text-red-600 transition-colors"
          >
            USDC Faucet
          </Link>

          {isConnected && caipNetwork && (
            <div className="hidden sm:flex items-center gap-2 rounded border border-red-900/30 bg-neutral-950/70 backdrop-blur-sm px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-red-600" />
              <span className="text-sm font-medium text-white">{caipNetwork.name}</span>
            </div>
          )}

          <CustomConnectButton />
        </div>
      </div>
    </header>
  )
}
