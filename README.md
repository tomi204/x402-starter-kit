# x402 Starter Kit for Avalanche

<div align="center">

**Build payment-gated APIs and AI services in minutes using the x402 protocol on Avalanche C-Chain**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Avalanche](https://img.shields.io/badge/Avalanche-C--Chain-red)](https://www.avax.network/)

[Quick Start](#-quick-start) • [Features](#-features) • [Documentation](#-project-structure) • [Examples](#-how-it-works)

</div>

---

## 🎯 What is This?

A professional, production-ready **Next.js 16 starter kit** that demonstrates how to build payment-gated content and APIs using:

- **x402 Protocol**: Micropayment standard for HTTP requests (pay-per-use APIs)
- **Avalanche C-Chain**: Fast, low-cost EVM-compatible blockchain
- **Modern Stack**: Next.js 16, TypeScript, Tailwind CSS 4, Reown wallet integration

Perfect for building:
- 💰 Pay-per-use APIs
- 🤖 Monetized AI services
- 📊 Premium data endpoints
- 🔐 Token-gated content
- 📡 Micropayment-enabled services

---

## ✨ Features

### Core Functionality
- ✅ **Next.js 16** with App Router and Server Components
- ✅ **TypeScript** for full type safety
- ✅ **x402 Payment Protocol** integration with middleware
- ✅ **Reown (WalletConnect v3)** for seamless wallet connections
- ✅ **Avalanche C-Chain** support (Mainnet & Fuji Testnet)
- ✅ **Payment-gated content** with automatic verification
- ✅ **USD-denominated pricing** (auto-converted to AVAX/USDC)

### Developer Experience
- 🎨 **Tailwind CSS 4** for modern, responsive UI
- 🔧 **wagmi + viem** for robust EVM interactions
- 🧩 **Professional UI components** (animated backgrounds, typewriter effects)
- 📱 **Responsive design** with mobile-first approach
- 🚀 **Ready for production** deployment on Vercel/other platforms

### Demo Features
- 🎲 Mock premium data endpoint
- 🤖 AI analysis API simulation
- 📈 Real-time Avalanche network stats
- 💳 Payment flow demonstration

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm/yarn/pnpm
- **EVM Wallet** (MetaMask, Core, etc.)
- **[Reown Project ID](https://cloud.reown.com)** - Free account (required)

### Installation

```bash
# Clone the repository
git clone https://github.com/tomi204/x402-starter-kits.git
cd x402-starter-kits

# Navigate to the Next.js starter
cd starters/nextjs

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
```

### Environment Setup

Edit `.env.local` with your values:

```bash
# Your EVM wallet address (0x...)
NEXT_PUBLIC_RECEIVER_ADDRESS=0x1234567890123456789012345678901234567890

# Network: avalanche-fuji (testnet) or avalanche (mainnet)
NEXT_PUBLIC_NETWORK=avalanche-fuji

# Facilitator URL
NEXT_PUBLIC_FACILITATOR_URL=https://facilitator.ultravioletadao.xyz

# Get from https://cloud.reown.com (REQUIRED)
NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id_here
```

### Get Your Reown Project ID

1. Visit [cloud.reown.com](https://cloud.reown.com)
2. Sign up (free account)
3. Create a new project
4. Copy the Project ID to your `.env.local`

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
starters/nextjs/
├── app/
│   ├── api/                      # API routes
│   │   ├── premium-data/         # 💎 Payment-gated premium data
│   │   └── ai-analysis/          # 🤖 Payment-gated AI analysis
│   ├── content/[type]/           # 🔐 Dynamic payment-gated pages
│   │   └── page.tsx              # Shows actual API data after payment
│   ├── test-payment/             # 🧪 Payment flow testing page
│   ├── page.tsx                  # 🏠 Landing page with wallet connect
│   ├── layout.tsx                # Root layout with providers
│   └── globals.css               # Global styles
├── components/
│   └── ui/                       # UI components
│       ├── header.tsx            # Header with wallet button
│       ├── content-card.tsx      # Content selection cards
│       ├── stats.tsx             # Live Avalanche stats
│       ├── custom-connect-button.tsx
│       ├── animated-shader-background.tsx
│       ├── text-shimmer.tsx
│       ├── typewriter.tsx
│       └── footer.tsx
├── lib/
│   ├── context.tsx               # React Query + Wagmi providers
│   ├── ai-service.ts             # OpenAI integration
│   ├── x402-middleware.ts        # 💳 x402 payment middleware factory
│   └── utils.ts                  # Utility functions
├── middleware.ts                 # 🛡️ Route protection with x402
├── .env.example                  # Environment template
└── package.json
```

---

## 🎯 How It Works

### Payment Flow

```
┌─────────────┐
│ User visits │
│  /content   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│   Middleware    │
│  checks payment │
└──────┬──────────┘
       │
       ├─── No Payment ──────┐
       │                     │
       │                     ▼
       │              ┌──────────────┐
       │              │ Return 402   │
       │              │ Payment Req  │
       │              └──────┬───────┘
       │                     │
       │                     ▼
       │              ┌──────────────┐
       │              │ User pays    │
       │              │ via wallet   │
       │              └──────┬───────┘
       │                     │
       │                     ▼
       │              ┌──────────────┐
       │              │ Facilitator  │
       │              │ verifies on  │
       │              │ Avalanche    │
       │              └──────┬───────┘
       │                     │
       │◄────────────────────┘
       │
       ▼
┌─────────────────┐
│ Content unlocked│
│  Page rendered  │
└─────────────────┘
```

### Step-by-Step

1. **User visits a protected route** (e.g., `/content/cheap`)
2. **Middleware intercepts** and checks for payment proof
3. **No payment found** → Middleware returns 402 Payment Required with details
4. **User connects wallet** and makes payment on Avalanche C-Chain
5. **Facilitator verifies** the transaction on-chain
6. **Payment proof stored** in session/headers
7. **Content unlocked** and API data displayed

---

## 🔧 Customization

### Adding New Protected Routes

Edit `middleware.ts` to add your own payment-gated routes:

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
    "/your-new-api": {
      price: "$0.50",
      config: {
        description: "Your premium API endpoint",
      },
      network,
    },
    "/ai-service": {
      price: "$2.00",
      config: {
        description: "AI-powered analysis service",
      },
      network,
    },
  },
  // ... facilitator config
);
```

### Changing Prices

Prices are in **USD format** and automatically converted to AVAX or USDC:

```typescript
price: "$0.01"   // 1 cent
price: "$1.00"   // 1 dollar
price: "$10.50"  // 10 dollars 50 cents
```

The x402 facilitator handles real-time conversion based on current rates.

### Creating Custom API Endpoints

Create a new route in `app/api/`:

```typescript
// app/api/your-endpoint/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Your protected logic here
  return NextResponse.json({
    data: 'This is premium content',
    timestamp: new Date().toISOString(),
  });
}
```

Then add the route to `middleware.ts` with your desired price.

---

## 🌐 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_RECEIVER_ADDRESS` | ✅ Yes | Your EVM wallet address for receiving payments | `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb` |
| `NEXT_PUBLIC_NETWORK` | ✅ Yes | Avalanche network | `avalanche-fuji` or `avalanche` |
| `NEXT_PUBLIC_FACILITATOR_URL` | ✅ Yes | x402 facilitator endpoint | `https://facilitator.ultravioletadao.xyz` |
| `NEXT_PUBLIC_REOWN_PROJECT_ID` | ✅ Yes | Reown/WalletConnect Project ID | Get from [cloud.reown.com](https://cloud.reown.com) |
| `OPENROUTER_API_KEY` | ⚠️ Optional | For AI analysis features | Get from [OpenRouter](https://openrouter.ai/keys) |

### Networks

- **avalanche-fuji**: Testnet (Chain ID: 43113) - Get test AVAX from [faucet](https://faucet.avax.network/)
- **avalanche**: Mainnet (Chain ID: 43114) - Production with real AVAX

---

## 🌟 What is x402?

**x402** is an HTTP payment protocol that enables:

- 💳 **Pay-per-use APIs**: Charge users per request
- 🤖 **AI Agent Economy**: Monetize AI services automatically
- ⚡ **Micropayments**: Sub-dollar transactions with low overhead
- 🔗 **Gasless Payments**: Using EIP-7702 for seamless UX
- 🌐 **Standard Protocol**: Like HTTP 402 status code, but with crypto

### Why x402 + Avalanche?

| Feature | Benefit |
|---------|---------|
| **Sub-second finality** | Instant payment verification |
| **Low gas fees (~$0.01)** | Viable for micropayments |
| **EVM compatible** | Use Ethereum tooling (wagmi, viem, ethers) |
| **Battle-tested** | Avalanche C-Chain is production-ready |
| **High throughput** | 4,500+ TPS capability |

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Build the project
npm run build

# Deploy to Vercel
vercel deploy

# Or use Vercel CLI for production
vercel --prod
```

**Important**: Add all environment variables in Vercel dashboard:
- Settings → Environment Variables
- Add each variable from your `.env.local`

### Other Platforms (Docker, VPS, etc.)

```bash
# Build
npm run build

# Start production server
npm start
```

For Docker deployment:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🐛 Troubleshooting

### Payment Not Working

**Symptoms**: Payment modal shows but payment doesn't complete

**Solutions**:
- ✅ Verify wallet address in `.env.local` starts with `0x` and is valid
- ✅ Check you're on correct network (Fuji testnet vs Mainnet)
- ✅ Ensure you have sufficient AVAX for payment + gas
- ✅ Confirm `NEXT_PUBLIC_REOWN_PROJECT_ID` is set correctly
- ✅ Check facilitator URL is correct and accessible

### Wallet Not Connecting

**Symptoms**: "Connect Wallet" button doesn't work

**Solutions**:
- ✅ Verify `NEXT_PUBLIC_REOWN_PROJECT_ID` is valid
- ✅ Check browser console for errors
- ✅ Try a different wallet (MetaMask, Core, etc.)
- ✅ Clear browser cache and cookies

### Build Errors

**Symptoms**: `npm run build` fails

**Solutions**:
```bash
# Clean install
rm -rf node_modules .next
npm install

# Check Node.js version (must be 18+)
node --version

# Try with legacy peer deps if needed
npm install --legacy-peer-deps
```

### API Routes Return 402 Even After Payment

**Symptoms**: Content still locked after successful payment

**Solutions**:
- ✅ Check browser developer tools → Network tab for payment proof headers
- ✅ Verify middleware configuration in `middleware.ts`
- ✅ Ensure facilitator is verifying payments correctly
- ✅ Try clearing cookies/session storage
- ✅ Check that route path in middleware matches your page path exactly

---

## 📚 Learn More

### Avalanche Resources
- [Avalanche Documentation](https://docs.avax.network)
- [Avalanche C-Chain Guide](https://docs.avax.network/learn/avalanche/c-chain)
- [Avalanche Builder Hub](https://build.avax.network)
- [Avalanche Faucet (Testnet)](https://faucet.avax.network/)

### x402 Protocol
- [x402 Specification](https://github.com/base-org/x402-spec)
- [UltraViolet DAO Facilitator](https://ultravioletadao.tech/)
- [Payment Protocol Overview](https://github.com/base-org/x402-spec/blob/main/README.md)

### Framework Documentation
- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Viem Documentation](https://viem.sh)
- [Wagmi Documentation](https://wagmi.sh)
- [Reown/WalletConnect Docs](https://docs.reown.com)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please ensure:
- Code follows existing style conventions
- All tests pass
- Documentation is updated

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

This means you can use this code for personal or commercial projects, modify it, and distribute it freely.

---

## 🔗 Links & Resources

- **Avalanche**: [Website](https://www.avax.network/) • [Docs](https://docs.avax.network) • [Twitter](https://twitter.com/avalancheavax)
- **x402 Protocol**: [Spec](https://github.com/base-org/x402-spec) • [Discussion](https://github.com/base-org/x402-spec/discussions)
- **UltraViolet DAO**: [Website](https://ultravioletadao.tech/)
- **Reown**: [Cloud Portal](https://cloud.reown.com) • [Docs](https://docs.reown.com)

---

<div align="center">

**Built with ❤️ for the Avalanche ecosystem**

[Report Bug](https://github.com/tomi204/x402-starter-kits/issues) • [Request Feature](https://github.com/tomi204/x402-starter-kits/issues)

</div>
