# Documentation

Comprehensive guides for using the x402 starter kits on Avalanche.

## Guides

- [Getting Started](./getting-started.md) - Introduction and setup
- [Next.js Starter](./nextjs-starter.md) - Next.js specific guide
- [Express Starter](./express-starter.md) - Express specific guide
- [Hono Starter](./hono-starter.md) - Hono specific guide
- [Deployment](./deployment.md) - Deployment strategies
- [x402 Protocol](./x402-protocol.md) - Understanding x402
- [Avalanche Integration](./avalanche-integration.md) - Avalanche specifics
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions

## Architecture

Each starter kit follows a similar architecture:

1. **Client** makes request with payment proof
2. **Server** validates payment via x402 middleware
3. **Facilitator** settles payment on Avalanche
4. **Server** returns protected resource

## Payment Flow

```
Client → x402 Payment Header → Server
                ↓
        Facilitator Validates
                ↓
        Settlement on Avalanche
                ↓
        Protected Resource Returned
```
