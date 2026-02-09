import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/billing";
import { getSubscriptionForUser } from "@/lib/db";
import { readEnv } from "@/lib/env";

export const runtime = "nodejs";

const BLOCKED_CHECKOUT_STATUSES = new Set(["active", "trialing", "past_due", "unpaid", "paused"]);
const env = readEnv();

function hasTrustedOrigin(request: Request) {
  const appOrigin = new URL(env.NEXT_PUBLIC_APP_URL).origin;
  const origin = request.headers.get("origin");
  if (origin) {
    return origin === appOrigin;
  }

  const referer = request.headers.get("referer");
  if (!referer) {
    return request.headers.get("sec-fetch-site") === "same-origin";
  }

  try {
    return new URL(referer).origin === appOrigin;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    if (!hasTrustedOrigin(request)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    const user = await getCurrentUser();
    if (!user) {
      const signInUrl = new URL("/sign-in", env.NEXT_PUBLIC_APP_URL);
      signInUrl.searchParams.set("redirect_url", "/pricing");
      return NextResponse.redirect(signInUrl, 303);
    }

    const subscription = await getSubscriptionForUser(user.id);
    if (subscription && BLOCKED_CHECKOUT_STATUSES.has(subscription.status.toLowerCase())) {
      const dashboardUrl = new URL("/dashboard", env.NEXT_PUBLIC_APP_URL);
      dashboardUrl.searchParams.set("billing", "already-subscribed");
      return NextResponse.redirect(dashboardUrl, 303);
    }

    const formData = await request.formData();
    const rawPlanId = formData.get("planId");
    const planId = typeof rawPlanId === "string" && rawPlanId.length > 0 ? rawPlanId : "core";

    const { checkoutUrl } = await createCheckoutSession({
      planId,
      userId: user.id,
      email: user.email
    });

    return NextResponse.redirect(checkoutUrl, 303);
  } catch (error) {
    console.error("[stripe.checkout]", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
