# Start Starter Kit

A modern SaaS starter kit built with React, Convex, and TanStack Start.

## Features

- 🚀 **Modern Stack**: React 19, TanStack Start (SSR), Tailwind CSS v4, TypeScript
- 🔐 **Authentication**: Better Auth with OAuth providers (Google, GitHub)
- 💳 **Payments**: Polar integration for subscription management
- 📧 **Email**: Resend for transactional emails
- 📊 **Analytics**: PostHog integration
- 🎨 **UI Components**: Radix UI + shadcn/ui + Magic UI
- 🌙 **Theme System**: Dark/light mode support
- 🔧 **Developer Experience**: Vite, Biome, Vitest, TypeScript strict mode

## Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd start-starter-kit
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:

#### Frontend Environment (.env.local)

Create a `.env.local` file in the root directory:

```env
# Convex configuration, get this URL from your [Dashboard](dashboard.convex.dev)
CONVEX_DEPLOYMENT=start-starter-kit

# Better-auth
BETTER_AUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Application URLs
SITE_URL=http://localhost:3000
VITE_CONVEX_URL=https://your-deployment-name.convex.cloud
VITE_CONVEX_SITE_URL=https://your-deployment-name.convex.site

# Posthog
VITE_PUBLIC_POSTHOG_KEY=your-posthog-key
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Polar Pricing
VITE_PREMIUM_MONTHLY_PRICE_ID=your-monthly-price-id
VITE_PREMIUM_MONTHLY_PRICE=12.00
VITE_PREMIUM_YEARLY_PRICE_ID=your-yearly-price-id
VITE_PREMIUM_YEARLY_PRICE=120.00
```

#### Convex Environment Setup

After setting up your `.env.local` file, configure the Convex backend environment:

```bash
# Initialize Convex and get your deployment URL
npx convex dev --once --configure=new

# Set required Convex environment variables
npx convex env set BETTER_AUTH_SECRET your-secret-key-here
npx convex env set GITHUB_CLIENT_ID your-github-client-id
npx convex env set GITHUB_CLIENT_SECRET your-github-client-secret
npx convex env set GOOGLE_CLIENT_ID your-google-client-id
npx convex env set GOOGLE_CLIENT_SECRET your-google-client-secret
npx convex env set RESEND_API_KEY your-resend-api-key
npx convex env set SITE_URL http://localhost:3000
npx convex env set VITE_CONVEX_SITE_URL https://your-deployment-name.convex.site
npx convex env set POLAR_ORGANIZATION_TOKEN your-polar-org-token
npx convex env set POLAR_WEBHOOK_SECRET your-polar-webhook-secret
npx convex env set POLAR_SERVER sandbox

# Sync Polar products
npx convex run polar:syncProducts
```

### Required Service Setup

#### 1. Convex Backend
- Sign up at [convex.dev](https://convex.dev)
- Create a new project
- Copy your deployment URL to `VITE_CONVEX_URL` and `VITE_CONVEX_SITE_URL`

#### 2. OAuth Providers
- **Google**: Create credentials at [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- **GitHub**: Create OAuth app at [GitHub Developer Settings](https://github.com/settings/applications/new)
- Add redirect URLs: `http://localhost:3000/api/auth/callback/google` and `http://localhost:3000/api/auth/callback/github`

#### 3. Email Service (Resend)
- Sign up at [resend.com](https://resend.com)
- Get your API key and set `RESEND_API_KEY` in Convex environment

#### 4. Payment Processor (Polar)
- Sign up at [polar.sh](https://polar.sh)
- Create an organization and products
- Set up webhooks and get your organization token
- Configure price IDs in your environment variables

#### 5. Analytics (PostHog)
- Sign up at [posthog.com](https://posthog.com)
- Create a project and get your API key
- Set `VITE_PUBLIC_POSTHOG_KEY` in your environment

### Running the Application

Start the development server:

```bash
pnpm dev
```

This will start both the frontend (port 3000) and Convex backend concurrently.

## Available Scripts

- `pnpm dev` - Start development server with Convex backend
- `pnpm dev:web` - Start frontend only (port 3000)
- `pnpm dev:convex` - Start Convex backend only
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm lint` - Lint code
- `pnpm check` - Run all code quality checks
- `pnpm format` - Format code

## Project Structure

```
├── convex/                 # Backend functions and configuration
│   ├── betterAuth/        # Authentication configuration
│   ├── emails/           # Email templates
│   ├── constants/        # App constants (plans, etc.)
│   └── *.ts             # Convex functions (schema, auth, etc.)
├── src/
│   ├── components/       # React components
│   │   ├── marketing/   # Landing page components
│   │   ├── subscription/ # Payment components
│   │   ├── ui/          # Reusable UI components
│   │   └── ...
│   ├── hooks/          # Custom React hooks
│   ├── routes/         # File-based routing
│   ├── integrations/   # Third-party integrations
│   └── ...
└── public/             # Static assets
```

## Authentication Flow

The application uses Better Auth with the following flow:
1. Users can sign up/login with Google or GitHub OAuth
2. Email verification is required
3. Users are redirected to dashboard after successful authentication
4. Session management is handled automatically

## Subscription System

- Integrated with Polar for payment processing
- Supports monthly and yearly billing cycles
- User tier management with automatic upgrades/downgrades
- Webhook handling for payment events

## Deployment

### Production Deployment

1. Build the application:
```bash
pnpm build
```

2. Deploy the frontend to your preferred hosting platform (Vercel, Netlify, etc.)

3. Update environment variables for production:
   - Set `SITE_URL` to your production domain
   - Update OAuth redirect URLs
   - Configure Polar webhooks for production

4. Run the Convex sync in production:
```bash
npx convex deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting: `pnpm check`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.