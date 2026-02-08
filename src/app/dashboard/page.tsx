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
        <h2>Setup checklist</h2>
        <ol>
          <li>Create users/subscriptions tables with <code>sql/schema.sql</code>.</li>
          <li>Point Stripe webhook to <code>/api/stripe/webhook</code>.</li>
          <li>Track first conversion event in PostHog.</li>
        </ol>
      </div>
    </main>
  );
}
