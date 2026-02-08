export const appConfig = {
  productName: "exampleSass",
  tagline: "A focused SaaS starter for shipping in days, not months.",
  icp: "Founders, agencies, and indie makers",
  stack: {
    auth: "clerk",
    billing: "stripe",
    data: "neon",
    orm: "drizzle",
    email: "resend",
    analytics: "posthog"
  },
  valueProps: [
    {
      title: "Production-ready seams",
      description: "Auth, billing, data, and analytics adapters are pre-defined."
    },
    {
      title: "Opinionated defaults",
      description: "Avoid architecture drift and keep shipping velocity high."
    },
    {
      title: "Launch-first workflow",
      description: "Built to support weekly release and feedback loops."
    }
  ]
} as const;
