# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Convex backend concurrently
- `npm run dev:web` - Start Vite web server on port 3000
- `npm run dev:convex` - Start Convex backend in development mode
- `npm run build` - Build for production
- `npm run test` - Run tests with Vitest
- `npm run lint` - Lint code with Biome
- `npm run check` - Run all Biome checks (lint + format)
- `npm run format` - Format code with Biome
- `npm run generate` - Generate Convex types once (without watching)

## Architecture Overview

This is a modern SaaS starter kit built with:

### Tech Stack
- **Frontend**: React 19, TanStack Start (SSR), Tailwind CSS v4, TypeScript
- **Backend**: Convex (serverless functions + database)
- **Authentication**: Better Auth with Convex integration
- **Payments**: Polar (via @convex-dev/polar)
- **Email**: Resend (via @convex-dev/resend)
- **Analytics**: PostHog
- **UI**: Radix UI components, shadcn/ui, Magic UI
- **State Management**: TanStack Query, Zustand
- **Development**: Vite, Biome (linting/formatting), Vitest (testing)

### Key Directories
- `convex/` - Backend functions, schema, auth config, email templates
- `src/components/` - React components organized by domain (marketing, subscription, ui, etc.)
- `src/routes/` - File-based routing with TanStack Router
- `src/hooks/` - Custom React hooks including account, subscription, tracking
- `src/integrations/` - Third-party service integrations (Better Auth, TanStack Query)

### Important Architecture Patterns

#### Authentication Flow
- Uses Better Auth with Convex adapter (`convex/betterAuth/`)
- Auth configuration in `convex/auth.config.ts`
- Client-side auth handling in `src/integrations/better-auth/client.ts`
- Auth routes: `/auth/login`, `/auth/register`, `/auth/verify-email`

#### Subscription System
- Polar integration for payments via `@convex-dev/polar`
- Subscription management in `convex/polar.ts` and `src/components/subscription/`
- User tier system with hooks in `src/hooks/use-subscription.ts` and `src/hooks/use-user-tier.ts`
- Plan constants defined in `convex/constants/plans.ts`

#### Routing Structure
- File-based routing with TanStack Router
- Marketing routes under `_marketing/` layout
- Dashboard routes under `dashboard/` layout (protected)
- Auth routes under `auth/` layout

#### Environment Configuration
- Uses `@t3-oss/env-core` for type-safe environment variables
- App config in `src/app-config.ts` with marketing links and plan definitions
- Environment variables loaded from `.env.local`

#### Development Workflow
- Concurrent development with `npm run dev` (web + convex)
- Biome for code quality (linting + formatting)
- TypeScript strict mode enabled
- SSR support with TanStack Start

### Special Integrations
- **Polar Payment Polyfill**: Custom Vite plugin in `src/scripts/vite-polar-polyfill-plugin.ts`
- **Email Templates**: React email components in `convex/emails/`
- **Support System**: Built-in support request functionality
- **Theme System**: Dark/light mode with next-themes

### Testing
- Vitest with React Testing Library
- Test files should follow `*.test.ts` or `*.test.tsx` pattern

When working with this codebase, pay attention to the Convex function patterns (queries, mutations, actions) and the subscription/payment integration with Polar. The app is designed to be a complete SaaS starter with authentication, payments, and user management.