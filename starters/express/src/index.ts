import express from 'express'
import cors from 'cors'

import { errorResponse, successResponse } from './lib/api-response-helpers.js'
import { getApiConfig } from './lib/get-api-config.js'
import { getApiContext } from './lib/get-api-context.js'
import { supportedRouter } from './routes/supported.js'
import { verifyRouter } from './routes/verify.js'
import { settleRouter } from './routes/settle.js'

const app = express()
const { port, ...config } = getApiConfig()
const context = await getApiContext()

// Store context in app for access in routes
app.set('context', context)

// Middleware
app.use(express.json())
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || config.corsOrigins.includes(origin)) {
        return cb(null, true)
      }
      cb(new Error('Not allowed by CORS'))
    },
  }),
)

// Request logging middleware
app.use((req, res, next) => {
  context.log.info(`📨 Request: ${req.method} ${req.url}`)
  if (req.method === 'POST' && Object.keys(req.body).length > 0) {
    context.log.info('Request body keys:', Object.keys(req.body))
  }
  next()
})

// Response logging middleware
app.use((req, res, next) => {
  const originalJson = res.json.bind(res)
  res.json = function (body: any) {
    context.log.info(`Response: ${req.method} ${req.path} - Status: ${res.statusCode}`)
    context.log.info('Response body:', body)
    return originalJson(body)
  }
  next()
})

// x402 Facilitator endpoints
// Mount in order of specificity (most specific first)
app.use('/supported', supportedRouter)
app.use('/settle', settleRouter)
app.use('/verify', verifyRouter)

// Get account balance
app.get('/balance', async (req, res) => {
  try {
    const balance = await context.publicClient.getBalance({
      address: context.account.address,
    })

    res.json(
      successResponse({
        address: context.account.address,
        balance: balance.toString(),
        network: config.network,
      }),
    )
  } catch (error) {
    context.log.error('Error getting balance', error)
    res.status(500).json(errorResponse('Error getting balance', 'BALANCE_ERROR'))
  }
})

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.message === 'Not allowed by CORS') {
    context.log.warn(`CORS rejection for origin: ${req.headers.origin}`)
    res.status(403).json(errorResponse('Origin not allowed', 'CORS_FORBIDDEN', 403))
    return
  }

  context.log.error(`Unhandled error: ${err.message}`, err)
  res.status(500).json(errorResponse('An unexpected error occurred', 'UNEXPECTED_ERROR'))
})

// Start server
app.listen(port, () => {
  context.log.info(`🏔️  x402 Avalanche Facilitator`)
  context.log.info(`🏔️  Listening on http://localhost:${port}`)
  context.log.info(`🏔️  Network: ${config.network}`)
  context.log.info(`🏔️  RPC: ${config.avalancheRpcEndpoint}`)
  context.log.info(`🏔️  Receiver: ${config.receiverAddress}`)
  context.log.info(`🏔️  Account: ${context.account.address}`)
})

declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}
