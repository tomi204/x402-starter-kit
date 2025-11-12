import 'dotenv/config'
import { z } from 'zod'

const ApiConfigSchema = z.object({
  corsOrigins: z.array(z.string()),
  port: z.coerce.number().int().positive(),
  avalancheRpcEndpoint: z.string().url(),
  receiverAddress: z.string().startsWith('0x'),
  privateKey: z.string().startsWith('0x'),
  network: z.enum(['avalanche', 'avalanche-fuji']),
})

export type ApiConfig = z.infer<typeof ApiConfigSchema>

let config: ApiConfig | undefined

export function getApiConfig(): ApiConfig {
  if (config) {
    return config
  }
  config = ApiConfigSchema.parse({
    corsOrigins: process.env.CORS_ORIGINS?.split(',') ?? [],
    avalancheRpcEndpoint: process.env.AVALANCHE_RPC_ENDPOINT,
    receiverAddress: process.env.RECEIVER_ADDRESS,
    privateKey: process.env.PRIVATE_KEY,
    network: process.env.NETWORK ?? 'avalanche-fuji',
    port: process.env.PORT ?? 3402,
  })
  return config
}
