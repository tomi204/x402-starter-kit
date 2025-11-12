# Contributing to x402 Starter Kits

Thank you for your interest in contributing! This guide will help you get started.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/x402-starter-kits.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Commit: `git commit -m "feat: your feature description"`
7. Push: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Project Structure

This is a monorepo containing multiple starter kits. When contributing:

- **New starter kit**: Add to `/starters/`
- **Example**: Add to `/examples/`
- **Shared code**: Add to `/shared/`
- **Documentation**: Add to `/docs/`

## Code Style

- Use TypeScript
- Follow existing code formatting
- Add JSDoc comments for public APIs
- Write clear commit messages

## Testing

Before submitting a PR:

```bash
# Install dependencies
npm install

# Run tests (if available)
npm test

# Build to verify
npm run build
```

## Pull Request Guidelines

- Keep PRs focused on a single feature/fix
- Update documentation if needed
- Add examples if applicable
- Reference any related issues

## Adding a New Starter Kit

1. Create directory in `/starters/your-framework/`
2. Add README.md with setup instructions
3. Include example `.env.example`
4. Add to main README.md
5. Create docs in `/docs/your-framework-starter.md`

## Questions?

Open an issue or discussion on GitHub.

## Code of Conduct

Be respectful and constructive in all interactions.
