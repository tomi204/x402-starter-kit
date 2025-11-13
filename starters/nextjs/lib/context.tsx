"use client";

import { wagmiAdapter, projectId } from "@/lib/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import React, { type ReactNode } from "react";
import { WagmiProvider, type Config } from "wagmi";
import { avalancheFuji } from "wagmi/chains";
// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("NEXT_PUBLIC_REOWN_PROJECT_ID is not set");
}

// Set up metadata
const metadata = {
  name: "x402 Avalanche Demo",
  description: "Payment-gated content on Avalanche using x402 protocol",
  url: "https://x402.org",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [avalancheFuji],
  defaultNetwork: avalancheFuji,
  metadata,
  features: {
    analytics: false, // Disable analytics for performance
    email: false, // Disable email login
    socials: [], // Disable social logins (Google, etc)
    emailShowWallets: true, // Show only wallets
  },
  themeMode: 'dark',
  themeVariables: {
    // New Reown naming
    '--apkt-color-mix': '#ef4444',
    '--apkt-color-mix-strength': 40,
    // Legacy WalletConnect naming (still works)
    '--w3m-accent': '#ef4444',
    '--w3m-color-mix': '#ef4444',
    '--w3m-color-mix-strength': 40,
  },
});

export function AppKitProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
