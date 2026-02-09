import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getSubscriptionForUser } from "@/lib/db";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const subscription = user ? await getSubscriptionForUser(user.id) : null;

  return (
    <main className="dashboard">
      <h1>Your workspace</h1>
      {!user ? (
        <p className="dashboardLead">
          You are not signed in. <Link href="/sign-in">Sign in with Clerk</Link> to continue.
        </p>
      ) : (
        <p className="dashboardLead">Welcome back, {user.email}.</p>
      )}

      <div className="dashCards">
        <div className="card">
          <h2>Subscription</h2>
          {subscription ? (
            <p>
              Status: <strong className="badge">{subscription.status}</strong>
            </p>
          ) : (
            <p>No active subscription found yet.</p>
          )}
        </div>
        <div className="card">
          <h2>Getting started</h2>
          <ol>
            <li>Create users/subscriptions tables with <code>sql/schema.sql</code>.</li>
            <li>Point Stripe webhook to <code>/api/stripe/webhook</code>.</li>
            <li>Run your first end-to-end checkout in test mode.</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
