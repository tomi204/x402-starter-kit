# x402 Avalanche Facilitator

Local x402 facilitator for Avalanche C-Chain and Fuji testnet.

## Overview

This is a self-hosted x402 payment facilitator that:
- Verifies x402 payment signatures
- Settles payments on Avalanche using EIP-3009 (USDC transferWithAuthorization)
- Supports both Avalanche mainnet (43114) and Fuji testnet (43113)

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Set up environment variables:
\`\`\`bash
npm run setup
\`\`\`

3. Edit \`.env\` file with your configuration:
\`\`\`bash
# Network: avalanche or avalanche-fuji
NETWORK=avalanche-fuji

# Avalanche RPC endpoint
AVALANCHE_RPC_ENDPOINT=https://api.avax-test.network/ext/bc/C/rpc

# Receiver address - where payments will be sent
RECEIVER_ADDRESS=0x4aA973BA2EA9d594A1Aa1F2a2039BfBf375b2302

# Private key for the account that will execute settlement transactions
# IMPORTANT: Generate a new private key for this!
PRIVATE_KEY=0x... # Your private key here
\`\`\`

### Generating a Private Key

To generate a new private key for the facilitator:

\`\`\`bash
node -e "console.log('0x' + require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

**Important**: Keep this private key secure and never commit it to version control!

## Running

### Development mode (with hot reload):
\`\`\`bash
npm run dev
\`\`\`

### Production mode:
\`\`\`bash
npm run build
npm start
\`\`\`

## API Endpoints

### GET \`/\`
Health check endpoint
- Returns: Facilitator info (network, version, receiver address)

### GET \`/supported\`
Returns supported networks and payment methods
- Returns: List of supported networks (avalanche, avalanche-fuji) with USDC token addresses

### POST \`/verify\`
Verifies an x402 payment signature
- Body: \`{ from, to, value, validAfter, validBefore, nonce, signature, network }\`
- Returns: \`{ valid: true/false, ... }\`

### POST \`/settle\`
Settles a payment on-chain using EIP-3009
- Body: \`{ from, to, value, validAfter, validBefore, nonce, signature, network }\`
- Returns: \`{ settled: true, transactionHash, blockNumber, ... }\`

### GET \`/balance\`
Gets the facilitator account's native token balance
- Returns: \`{ address, balance, network }\`

## Integration with Next.js App

Update your Next.js middleware to use this local facilitator:

\`\`\`typescript
// In starters/nextjs/.env.local
NEXT_PUBLIC_FACILITATOR_URL=http://localhost:3402
\`\`\`

## USDC Addresses

- **Avalanche mainnet**: \`0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E\`
- **Avalanche Fuji testnet**: \`0x5425890298aed601595a70AB815c96711a31Bc65\`

## Docker

Build and run with Docker:

\`\`\`bash
npm run docker:build
npm run docker:run
\`\`\`

## License

MIT
