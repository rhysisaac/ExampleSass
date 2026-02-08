import Stripe from "stripe";
import { readEnv } from "@/lib/env";

export type Plan = {
  id: string;
  name: string;
  priceMonthly: number;
  description: string;
  features: string[];
  stripePriceId: string;
};

const env = readEnv();
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const plans: Plan[] = [
  {
    id: "core",
    name: "Core",
    priceMonthly: 49,
    description: "One focused workflow to validate demand with paying users.",
    features: ["Unlimited projects", "Usage analytics", "Email support"],
    stripePriceId: env.STRIPE_PRICE_ID
  }
];

function getPlan(planId: string) {
  const selectedPlan = plans.find((plan) => plan.id === planId);
  if (!selectedPlan) {
    throw new Error(`Unknown plan: ${planId}`);
  }
  return selectedPlan;
}

export async function createCheckoutSession(input: { planId: string; userId: string; email: string }) {
  if (!input.planId || !input.userId || !input.email) {
    throw new Error("Missing planId, userId, or email");
  }

  const plan = getPlan(input.planId);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/pricing?checkout=cancelled`,
    customer_email: input.email,
    allow_promotion_codes: true,
    metadata: {
      clerkUserId: input.userId,
      planId: plan.id
    },
    subscription_data: {
      metadata: {
        clerkUserId: input.userId,
        planId: plan.id
      }
    }
  });

  if (!session.url) {
    throw new Error("Stripe session did not return a URL");
  }

  return { checkoutUrl: session.url };
}

export function constructStripeEvent(payload: string, signature: string) {
  return stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET);
}
