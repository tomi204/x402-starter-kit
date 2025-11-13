# Next.js x402 Starter Kit for Avalanche

Professional full-stack Next.js template with x402 payment-gated content, Reown wallet integration, API endpoints on Avalanche C-Chain.

## 🚀 Features

- ✅ **Next.js 16** with App Router
- ✅ **TypeScript** for type safety
- ✅ **x402 Payment Protocol** integration
- ✅ **Reown (WalletConnect)** for wallet connections
- ✅ **Avalanche C-Chain** support (Mainnet & Fuji Testnet)
- ✅ **Payment-gated content** with middleware
- ✅ **Mock API endpoints** for testing
- ✅ **Tailwind CSS 4** for modern UI
- ✅ **wagmi + viem** for EVM interactions
- ✅ **Professional UI components**
- ✅ Ready for production deployment

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- An EVM wallet (MetaMask, Core, etc.)
- [Reown Project ID](https://cloud.reown.com) - Free account required
- [Coinbase Developer Platform account](https://portal.cdp.coinbase.com/) (optional, for enhanced payments)

## ⚡ Quick Start

1. **Install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your values:

```bash
# Your EVM wallet address (0x...)
NEXT_PUBLIC_RECEIVER_ADDRESS=0x1234567890123456789012345678901234567890

# Network: avalanche-fuji (testnet) or avalanche (mainnet)
NEXT_PUBLIC_NETWORK=avalanche-fuji

# Facilitator URL
NEXT_PUBLIC_FACILITATOR_URL=https://facilitator.ultravioletadao.xyz

# Get from https://cloud.reown.com (REQUIRED)
NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id_here

# Get from https://portal.cdp.coinbase.com/ (optional)
NEXT_PUBLIC_CDP_CLIENT_KEY=your_client_key_here
```

**Important Required Keys**:

**Reown Project ID (for wallet connections)**:

1. Go to [cloud.reown.com](https://cloud.reown.com)
2. Sign up (free)
3. Create a new project
4. Copy the Project ID

**Coinbase CDP Keys (for payments)**:

1. Go to [portal.cdp.coinbase.com](https://portal.cdp.coinbase.com/)
2. Sign up / Sign in
3. Create a new project
4. Go to "API Keys" section
5. Click "Create API Key"
6. Copy all three values:

   - Client Key → `NEXT_PUBLIC_CDP_CLIENT_KEY`
   - API Key ID → `CDP_API_KEY_ID`
   - API Key Secret → `CDP_API_KEY_SECRET`

7. **Start development server:**

```bash
npm run dev
```

4. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Environment Variables

| Variable                       | Description                                    | Example                                                 |
| ------------------------------ | ---------------------------------------------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_RECEIVER_ADDRESS` | Your EVM wallet address for receiving payments | `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`             |
| `NEXT_PUBLIC_NETWORK`          | Avalanche network to use                       | `avalanche-fuji` or `avalanche`                         |
| `NEXT_PUBLIC_FACILITATOR_URL`  | x402 facilitator endpoint                      | `https://facilitator.ultravioletadao.xyz`               |
| `NEXT_PUBLIC_REOWN_PROJECT_ID` | Reown WalletConnect Project ID (REQUIRED)      | Get from [Reown Cloud](https://cloud.reown.com)         |
| `NEXT_PUBLIC_CDP_CLIENT_KEY`   | Coinbase CDP Client Key (REQUIRED)             | Get from [CDP Portal](https://portal.cdp.coinbase.com/) |
| `CDP_API_KEY_ID`               | Coinbase CDP API Key ID (REQUIRED)             | Get from [CDP Portal](https://portal.cdp.coinbase.com/) |
| `CDP_API_KEY_SECRET`           | Coinbase CDP API Key Secret (REQUIRED)         | Get from [CDP Portal](https://portal.cdp.coinbase.com/) |

### Networks

- **avalanche-fuji**: Testnet (Chain ID: 43113) - Use for testing with test AVAX
- **avalanche**: Mainnet (Chain ID: 43114) - Production with real AVAX

## 📁 Project Structure

```
nextjs/
├── app/
│   ├── api/                      # API routes
│   │   ├── premium-data/         # Mock premium data endpoint
│   │   └── ai-analysis/          # Mock AI analysis endpoint
│   ├── content/[type]/           # Payment-gated content pages
│   │   └── page.tsx              # Dynamic route with real data display
│   ├── page.tsx                  # Home page with wallet connect
│   ├── layout.tsx                # Root layout with providers
│   └── globals.css               # Global styles
├── components/
│   └── ui/                       # UI components
│       ├── header.tsx            # Header with wallet button
│       ├── content-card.tsx      # Content selection cards
│       └── stats.tsx             # Avalanche stats display
├── lib/
│   ├── config.ts                 # Reown/Wagmi configuration
│   └── context.tsx               # App providers (wallet, query)
├── middleware.ts                 # x402 payment middleware
├── .env.example                  # Environment variables template
└── package.json
```

## 🎯 How It Works

1. **User visits a protected route** (e.g., `/content/cheap`)
2. **Middleware intercepts the request** and checks for payment proof
3. **If no payment**, middleware returns payment request details
4. **User makes payment** via their wallet (using x402 protocol)
5. **Payment is verified** by the facilitator on Avalanche C-Chain
6. **Content is unlocked** and displayed to the user

## 🔧 Customization

### Adding New Protected Routes

Edit `middleware.ts`:

```typescript
const x402PaymentMiddleware = paymentMiddleware(
  address,
  {
    "/content/cheap": {
      price: "$0.01",
      config: {
        description: "Access to cheap content on Avalanche",
      },
      network,
    },
    "/your-new-route": {
      price: "$0.50",
      config: {
        description: "Your custom content",
      },
      network,
    },
  }
  // ... rest of config
);
```

### Changing Prices

Prices are in USD format (e.g., `'$0.01'`, `'$1.00'`, `'$10.50'`)

The facilitator handles conversion to AVAX/USDC based on current rates.

## 🌟 Payment Flow

```
User Request
     ↓
Middleware (x402-next)
     ↓
Payment Required? → Yes → Return 402 Payment Required
     ↓                         ↓
     No                    User Pays (Avalanche C-Chain)
     ↓                         ↓
Allow Access ← Facilitator Verifies Payment
```

## 🤖 AI Features

This starter includes integration with **OpenRouter** for AI-powered market analysis:

### OpenRouter Setup (Optional)

1. Get an API key from [OpenRouter](https://openrouter.ai/keys)
2. Add to your `.env.local`:

```bash
OPENROUTER_API_KEY=sk-or-v1-your_api_key_here
```

3. The AI analysis endpoint will use real AI (Claude 3.5 Sonnet by default)
4. Without the key, it falls back to mock data automatically

### Available Models via OpenRouter

- `anthropic/claude-3.5-sonnet` (default)
- `openai/gpt-4o`
- `meta-llama/llama-3.1-70b-instruct`
- `google/gemini-pro`
- Many more at [openrouter.ai/models](https://openrouter.ai/models)

Change the model in `app/api/ai-analysis/route.ts`:

```typescript
const aiService = new AIService({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: 'openai/gpt-4o', // Change to your preferred model
  temperature: 0.7,
  maxTokens: 800,
});
```

## 📚 Learn More

- [Avalanche Documentation](https://docs.avax.network)
- [Avalanche C-Chain](https://docs.avax.network/learn/avalanche/c-chain)
- [x402 Protocol Specification](https://github.com/base-org/x402-spec)
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Viem Documentation](https://viem.sh)

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel deploy
```

Make sure to add environment variables in Vercel dashboard.

### Other Platforms

Build and deploy:

```bash
npm run build
npm start
```

## 🐛 Troubleshooting

**Issue**: Payment not working

- Check that your wallet address in `.env.local` is correct (starts with `0x`)
- Verify you're using the correct network (`avalanche-fuji` for testing)
- Ensure CDP Client Key is valid

**Issue**: Build errors

- Delete `node_modules` and `.next` folder
- Run `npm install` again
- Check Node.js version (must be 18+)

## 🤝 Contributing

Built by [tomi204](https://github.com/tomi204) for the Avalanche ecosystem.

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - see [LICENSE](../../LICENSE) file for details
