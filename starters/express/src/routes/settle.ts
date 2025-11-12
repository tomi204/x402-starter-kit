import express from 'express'
import { z } from 'zod'
import { parseAbi, type Address } from 'viem'
import { avalanche, avalancheFuji } from 'viem/chains'
import { errorResponse, successResponse } from '../lib/api-response-helpers.js'
import { ApiContext } from '../lib/get-api-context.js'

export const settleRouter = express.Router()

const AuthorizationSchema = z.object({
  from: z.string().startsWith('0x'),
  to: z.string().startsWith('0x'),
  value: z.string(),
  validAfter: z.string(),
  validBefore: z.string(),
  nonce: z.string().startsWith('0x'),
})

const PayloadSchema = z.object({
  signature: z.string().startsWith('0x'),
  authorization: AuthorizationSchema,
})

const PaymentPayloadSchema = z.object({
  x402Version: z.number(),
  scheme: z.string(),
  network: z.string(),
  payload: PayloadSchema,
})

const PaymentRequirementsSchema = z.object({
  scheme: z.string(),
  network: z.string(),
  maxAmountRequired: z.string().optional(),
  payTo: z.string().startsWith('0x').optional(),
  asset: z.string().optional(),
})

const SettleRequestSchema = z.object({
  x402Version: z.number(),
  paymentPayload: PaymentPayloadSchema,
  paymentRequirements: PaymentRequirementsSchema,
})

// EIP-3009 USDC contract ABI for transferWithAuthorization
const USDC_ABI = parseAbi([
  'function transferWithAuthorization(address from, address to, uint256 value, uint256 validAfter, uint256 validBefore, bytes32 nonce, uint8 v, bytes32 r, bytes32 s) external',
  'function balanceOf(address account) view returns (uint256)',
])

settleRouter.post('/', async (req, res) => {
  const context = req.app.get('context') as ApiContext

  try {
    // Validate request body
    const parsed = SettleRequestSchema.safeParse(req.body)
    if (!parsed.success) {
      context.log.error('Invalid settle request format', parsed.error)
      res.status(400).json(errorResponse('Invalid request body', 'INVALID_REQUEST'))
      return
    }

    const { x402Version, paymentPayload, paymentRequirements } = parsed.data
    const { payload } = paymentPayload
    const { authorization, signature } = payload
    const network = paymentPayload.network

    context.log.info(`Settlement request from ${authorization.from}`)

    // Check if the network matches the configured network
    if (network !== context.config.network) {
      context.log.warn(`Network mismatch: requested ${network}, configured ${context.config.network}`)
      res.status(400).json(errorResponse('Network not supported', 'UNSUPPORTED_NETWORK'))
      return
    }

    // Check if receiver address matches
    if (authorization.to.toLowerCase() !== context.config.receiverAddress.toLowerCase()) {
      context.log.warn(
        `Receiver address mismatch: ${authorization.to} !== ${context.config.receiverAddress}`,
      )
      res.status(400).json(errorResponse('Invalid receiver address', 'INVALID_RECEIVER'))
      return
    }

    // Get USDC contract address for the network
    const usdcAddress =
      network === 'avalanche'
        ? '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E' // USDC on Avalanche mainnet
        : '0x5425890298aed601595a70AB815c96711a31Bc65' // USDC on Fuji testnet

    // Split signature into v, r, s components for EIP-3009
    const sig = signature.slice(2) // remove 0x
    const r = `0x${sig.slice(0, 64)}` as `0x${string}`
    const s = `0x${sig.slice(64, 128)}` as `0x${string}`
    const v = parseInt(sig.slice(128, 130), 16)

    context.log.info(
      `💰 Settling payment: ${authorization.from} -> ${authorization.to}, value: ${authorization.value}`,
    )

    // Get chain based on network
    const chain = network === 'avalanche' ? avalanche : avalancheFuji

    // Call transferWithAuthorization on USDC contract
    const hash = await context.walletClient.writeContract({
      address: usdcAddress as Address,
      abi: USDC_ABI,
      functionName: 'transferWithAuthorization',
      chain,
      account: context.account,
      args: [
        authorization.from as Address,
        authorization.to as Address,
        BigInt(authorization.value),
        BigInt(authorization.validAfter),
        BigInt(authorization.validBefore),
        authorization.nonce as `0x${string}`,
        v,
        r,
        s,
      ],
    })

    context.log.info(`✅ Payment settled with transaction hash: ${hash}`)

    // Wait for transaction confirmation
    const receipt = await context.publicClient.waitForTransactionReceipt({ hash })

    if (receipt.status === 'success') {
      // x402 expects specific format: { success, error, txHash, networkId }
      res.status(200).json({
        success: true,
        error: null,
        txHash: hash,
        networkId: network,
      })
    } else {
      context.log.error(`❌ Transaction failed: ${hash}`)
      res.status(200).json({
        success: false,
        error: 'Transaction failed',
        txHash: hash,
        networkId: network,
      })
    }
  } catch (error) {
    context.log.error('❌ Error settling payment', error)
    res.status(200).json({
      success: false,
      error: 'Error settling payment',
      txHash: null,
      networkId: network || null,
    })
  }
})
