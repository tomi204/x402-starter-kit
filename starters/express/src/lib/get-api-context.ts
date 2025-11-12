import { createWalletClient, createPublicClient, http, type WalletClient, type PublicClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { avalanche, avalancheFuji } from 'viem/chains'
import { ApiConfig, getApiConfig } from './get-api-config.js'
import { ApiLogger, log } from './api-logger.js'

export interface ApiContext {
  walletClient: WalletClient
  publicClient: PublicClient
  log: ApiLogger
  account: ReturnType<typeof privateKeyToAccount>
  config: ApiConfig
}

let context: ApiContext | undefined

export async function getApiContext(): Promise<ApiContext> {
  if (context) {
    return context
  }

  const config: ApiConfig = getApiConfig()

  // Select chain based on network config
  const chain = config.network === 'avalanche' ? avalanche : avalancheFuji

  // Create account from private key
  const account = privateKeyToAccount(config.privateKey as `0x${string}`)

  // Create wallet client for signing transactions
  const walletClient = createWalletClient({
    account,
    chain,
    transport: http(config.avalancheRpcEndpoint),
  })

  // Create public client for reading blockchain state
  const publicClient = createPublicClient({
    chain,
    transport: http(config.avalancheRpcEndpoint),
  })

  context = { walletClient, publicClient, log, account, config }

  return context
}
