import express from 'express'
import { successResponse } from '../lib/api-response-helpers.js'

export const supportedRouter = express.Router()

// Return supported payment networks and methods
supportedRouter.get('/', (req, res) => {
  const supportedNetworks = {
    networks: [
      {
        network: 'avalanche',
        chainId: 43114,
        name: 'Avalanche C-Chain',
        methods: ['EIP-3009'],
        tokens: [
          {
            address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
            symbol: 'USDC',
            decimals: 6,
          },
        ],
      },
      {
        network: 'avalanche-fuji',
        chainId: 43113,
        name: 'Avalanche Fuji Testnet',
        methods: ['EIP-3009'],
        tokens: [
          {
            address: '0x5425890298aed601595a70AB815c96711a31Bc65',
            symbol: 'USDC',
            decimals: 6,
          },
        ],
      },
    ],
  }

  res.json(successResponse(supportedNetworks))
})
