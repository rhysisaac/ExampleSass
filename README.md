# exampleSass

Opinionated SaaS starter.

## Fixed stack

- Auth: `clerk`
- Billing: `stripe`
- Data: `neon` + `drizzle`

## What is wired

- `src/lib/auth.ts`: reads active Clerk session and syncs user into Postgres.
- `src/middleware.ts`: enables Clerk auth context across app and API routes.
- `src/app/sign-in/[[...sign-in]]/page.tsx` + `src/app/sign-up/[[...sign-up]]/page.tsx`: Clerk auth screens.
- `src/lib/billing.ts`: creates Stripe Checkout session + verifies webhook signatures.
- `src/lib/db.ts`: Neon + Drizzle client with user/subscription upserts.
- `src/app/api/stripe/checkout/route.ts`: starts Stripe checkout flow.
- `src/app/api/stripe/webhook/route.ts`: syncs Stripe subscription lifecycle into Postgres.
- `src/db/schema.ts` and `sql/schema.sql`: minimal relational schema.

## Local setup

```bash
cp .env.example .env.local
pnpm install
pnpm db:push
pnpm dev
```

## Dependency hygiene

- Use `pnpm` (not `npm audit fix --force`) to avoid unstable dependency flips.
- Prioritize runtime risk checks with `pnpm audit --prod`.
- Use `pnpm audit` for full visibility, but treat dev-tooling advisories separately.

## Provider setup

1. Create a Clerk app and copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
2. Create a Stripe recurring price and set `STRIPE_PRICE_ID`.
3. Add Stripe webhook endpoint: `https://your-domain.com/api/stripe/webhook`
4. Subscribe webhook events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

## Recommended provider stack

- Keep this stack fixed for 30 days while validating demand.
- Switch providers only when triggered by real constraints (cost, compliance, enterprise features).
