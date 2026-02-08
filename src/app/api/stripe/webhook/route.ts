import { headers } from "next/headers";
import Stripe from "stripe";
import { constructStripeEvent } from "@/lib/billing";
import {
  getUserByStripeCustomerId,
  linkStripeCustomer,
  upsertSubscription,
  upsertUser
} from "@/lib/db";

export const runtime = "nodejs";

function resolveCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null
): string | null {
  if (!customer) {
    return null;
  }

  return typeof customer === "string" ? customer : customer.id;
}

function toDate(timestamp: number | null | undefined) {
  return timestamp ? new Date(timestamp * 1000) : null;
}

async function syncCheckoutSession(session: Stripe.Checkout.Session) {
  const clerkUserId = session.metadata?.clerkUserId;
  const customerId = resolveCustomerId(session.customer);
  const email = session.customer_details?.email ?? session.customer_email;

  if (!clerkUserId || !customerId || !email) {
    return;
  }

  await upsertUser({
    clerkUserId,
    email
  });

  await linkStripeCustomer({
    clerkUserId,
    stripeCustomerId: customerId
  });
}

async function syncSubscription(subscription: Stripe.Subscription) {
  const customerId = resolveCustomerId(subscription.customer);
  if (!customerId) {
    return;
  }

  let clerkUserId = subscription.metadata?.clerkUserId;

  if (!clerkUserId) {
    const user = await getUserByStripeCustomerId(customerId);
    clerkUserId = user?.clerkUserId;
  }

  if (!clerkUserId) {
    return;
  }

  await linkStripeCustomer({
    clerkUserId,
    stripeCustomerId: customerId
  });

  await upsertSubscription({
    stripeSubscriptionId: subscription.id,
    clerkUserId,
    stripeCustomerId: customerId,
    status: subscription.status,
    priceId: subscription.items.data[0]?.price?.id ?? "unknown",
    currentPeriodEnd: toDate(subscription.current_period_end),
    cancelAtPeriodEnd: subscription.cancel_at_period_end
  });
}

export async function POST(request: Request) {
  const requestHeaders = await headers();
  const signature = requestHeaders.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = constructStripeEvent(payload, signature);
  } catch (error) {
    console.error("[stripe.webhook] signature verification failed", error);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await syncCheckoutSession(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await syncSubscription(event.data.object as Stripe.Subscription);
        break;
      default:
        break;
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("[stripe.webhook] processing failed", { type: event.type, error });
    return new Response("Webhook processing error", { status: 500 });
  }
}
