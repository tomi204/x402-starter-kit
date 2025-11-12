# x402 Starter Kits for Avalanche

A collection of production-ready starter kits for building payment-gated APIs and AI services using the x402 protocol on Avalanche.

## Overview

This monorepo contains multiple starter kits for different frameworks and use cases, all leveraging the x402 payment protocol on Avalanche's C-Chain.

## 📦 Available Starter Kits

### Starters

- **[Next.js Starter](/starters/nextjs)** - Full-stack Next.js app with x402 payment-gated API routes
- **[Express Starter](/starters/express)** - Express.js server with x402 middleware

### Examples

- **[Payment-Gated API](/examples/payment-gated-api)** - Simple API with x402 payments
- **[AI Service](/examples/ai-service)** - AI service monetization example
- **[Multi-Chain](/examples/multi-chain)** - x402 across multiple chains

## 🚀 Quick Start

Choose a starter kit and follow its README:

```bash
# Next.js
cd starters/nextjs
npm install
npm run dev

# Express
cd starters/express
npm install
npm start
```

## 🏗️ Repository Structure

```
x402-starter-kits/
├── starters/          # Complete starter templates
│   ├── nextjs/       # Next.js + App Router
│   └── express/      # Express.js server
├── examples/         # Example implementations
│   ├── payment-gated-api/
│   ├── ai-service/
│   └── multi-chain/
├── shared/           # Shared utilities and configs
│   ├── configs/      # Shared configurations
│   └── utils/        # Common utilities
└── docs/             # Additional documentation
```

## 🌐 What is x402?

x402 is a protocol for payment-gated HTTP requests, enabling:
- Pay-per-use APIs
- AI agent monetization
- Micropayment services
- Gasless payments using EIP-7702

## 💎 Why Avalanche?

- **Fast Settlement**: Sub-second transaction finality
- **Low Costs**: Minimal gas fees for micropayments
- **EVM Compatible**: Use familiar Ethereum tools and libraries
- **C-Chain**: Production-ready, battle-tested infrastructure

## 📚 Documentation

- [x402 Protocol Specification](https://github.com/base-org/x402-spec)
- [Avalanche Documentation](https://docs.avax.network)
- [Thirdweb x402 Docs](https://portal.thirdweb.com/payments/x402/facilitator)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) first.

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details

## 🔗 Links

- [Avalanche Builder Hub](https://build.avax.network)
- [x402 Specification](https://github.com/base-org/x402-spec)
- [Thirdweb](https://thirdweb.com)
