import { NextResponse } from "next/server";
import { track } from "@/lib/analytics";
import { getCurrentUser } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/billing";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect_url", "/pricing");
      return NextResponse.redirect(signInUrl, 303);
    }

    const formData = await request.formData();
    const rawPlanId = formData.get("planId");
    const planId = typeof rawPlanId === "string" && rawPlanId.length > 0 ? rawPlanId : "core";

    const { checkoutUrl } = await createCheckoutSession({
      planId,
      userId: user.id,
      email: user.email
    });

    await track("checkout_started", { planId }, user.id);

    return NextResponse.redirect(checkoutUrl, 303);
  } catch (error) {
    console.error("[stripe.checkout]", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
