import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getSubscriptionForUser } from "@/lib/db";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const subscription = user ? await getSubscriptionForUser(user.id) : null;

  return (
    <main>
      <h1>Dashboard</h1>
      {!user ? (
        <p>
          You are not signed in. <Link href="/sign-in">Sign in with Clerk</Link> to continue.
        </p>
      ) : (
        <p>Welcome back, {user.email}.</p>
      )}

      <div className="card">
        <h2>Subscription</h2>
        {subscription ? (
          <p>
            Status: <strong>{subscription.status}</strong>
          </p>
        ) : (
          <p>No active subscription found yet.</p>
        )}
      </div>
      <div className="card">
        <h2>Validation checklist</h2>
        <ol>
          <li>
            ✅ Billing flow live: <code>/pricing</code> -&gt; Stripe Checkout -&gt; webhook sync -&gt; active
            subscription
          </li>
          <li>Collect first 3 paid pilot users and document objections.</li>
          <li>Track checkout-started vs paid conversion in PostHog.</li>
        </ol>
      </div>
    </main>
  );
}
