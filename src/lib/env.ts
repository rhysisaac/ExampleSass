import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  DB_PROVIDER: z.literal("neon"),
  ORM_PROVIDER: z.literal("drizzle"),
  AUTH_PROVIDER: z.literal("clerk"),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  BILLING_PROVIDER: z.literal("stripe"),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_PRICE_ID: z.string().min(1),
  EMAIL_PROVIDER: z.literal("resend"),
  RESEND_API_KEY: z.string().min(1),
  ANALYTICS_PROVIDER: z.literal("posthog"),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url()
});

export type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | null = null;

function normalizeAppUrl(url: string) {
  return url.replace(/\/+$/, "");
}

function resolveAppUrl(input: NodeJS.ProcessEnv) {
  const explicitUrl = input.NEXT_PUBLIC_APP_URL?.trim();
  if (explicitUrl) {
    return normalizeAppUrl(explicitUrl);
  }

  const vercelHost = input.VERCEL_PROJECT_PRODUCTION_URL?.trim() ?? input.VERCEL_URL?.trim();
  if (!vercelHost) {
    return explicitUrl;
  }

  const withProtocol = vercelHost.startsWith("http://") || vercelHost.startsWith("https://")
    ? vercelHost
    : `https://${vercelHost}`;

  return normalizeAppUrl(withProtocol);
}

export function readEnv() {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse({
    ...process.env,
    NEXT_PUBLIC_APP_URL: resolveAppUrl(process.env)
  });
  if (!parsed.success) {
    throw new Error(`Invalid environment variables: ${parsed.error.message}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}
