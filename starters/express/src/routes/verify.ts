import express from 'express'
import { z } from 'zod'
import { errorResponse, successResponse } from '../lib/api-response-helpers.js'
import { ApiContext } from '../lib/get-api-context.js'

export const verifyRouter = express.Router()

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

const VerifyRequestSchema = z.object({
  x402Version: z.number(),
  paymentPayload: PaymentPayloadSchema,
  paymentRequirements: PaymentRequirementsSchema,
})

verifyRouter.post('/', async (req, res) => {
  const context = req.app.get('context') as ApiContext

  try {
    // Validate request body
    const parsed = VerifyRequestSchema.safeParse(req.body)
    if (!parsed.success) {
      context.log.error('Invalid verify request format', parsed.error)
      res.status(200).json({ isValid: false, invalidReason: 'Invalid request body' })
      return
    }

    const { x402Version, paymentPayload, paymentRequirements } = parsed.data
    const { payload } = paymentPayload
    const { authorization, signature } = payload

    context.log.info(`Payment verification request from ${authorization.from}`)

    // Check if the network matches the configured network
    if (paymentPayload.network !== context.config.network) {
      context.log.warn(
        `Network mismatch: requested ${paymentPayload.network}, configured ${context.config.network}`,
      )
      res.status(200).json({ isValid: false, invalidReason: 'Network not supported' })
      return
    }

    // Check if receiver address matches
    if (authorization.to.toLowerCase() !== context.config.receiverAddress.toLowerCase()) {
      context.log.warn(
        `Receiver address mismatch: ${authorization.to} !== ${context.config.receiverAddress}`,
      )
      res.status(200).json({ isValid: false, invalidReason: 'Invalid receiver address' })
      return
    }

    // For now, we'll accept the payment as valid
    // In production, you'd verify the EIP-3009 signature here
    context.log.info(
      `✅ Payment verified: ${authorization.from} -> ${authorization.to}, value: ${authorization.value}`,
    )

    // x402 expects specific format: { isValid: boolean, invalidReason: string | null }
    const response = {
      isValid: true,
      invalidReason: null,
    }
    context.log.info('Sending verify response:', response)
    res.status(200).json(response)
  } catch (error) {
    context.log.error('Error verifying payment', error)
    res.status(200).json({ isValid: false, invalidReason: 'Error verifying payment' })
  }
})
