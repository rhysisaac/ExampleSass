import { neon } from "@neondatabase/serverless";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { subscriptions, users } from "@/db/schema";
import { readEnv } from "@/lib/env";

const env = readEnv();
const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql, { schema: { users, subscriptions } });

export async function upsertUser(input: { clerkUserId: string; email: string }) {
  const [user] = await db
    .insert(users)
    .values({
      clerkUserId: input.clerkUserId,
      email: input.email
    })
    .onConflictDoUpdate({
      target: users.clerkUserId,
      set: {
        email: input.email,
        updatedAt: new Date()
      }
    })
    .returning();

  return user;
}

export async function linkStripeCustomer(input: { clerkUserId: string; stripeCustomerId: string }) {
  await db
    .update(users)
    .set({
      stripeCustomerId: input.stripeCustomerId,
      updatedAt: new Date()
    })
    .where(eq(users.clerkUserId, input.clerkUserId));
}

export async function getUserByStripeCustomerId(stripeCustomerId: string) {
  const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, stripeCustomerId)).limit(1);
  return user ?? null;
}

export async function upsertSubscription(input: {
  stripeSubscriptionId: string;
  clerkUserId: string;
  stripeCustomerId: string;
  status: string;
  priceId: string;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}) {
  const [subscription] = await db
    .insert(subscriptions)
    .values({
      stripeSubscriptionId: input.stripeSubscriptionId,
      clerkUserId: input.clerkUserId,
      stripeCustomerId: input.stripeCustomerId,
      status: input.status,
      priceId: input.priceId,
      currentPeriodEnd: input.currentPeriodEnd,
      cancelAtPeriodEnd: input.cancelAtPeriodEnd
    })
    .onConflictDoUpdate({
      target: subscriptions.stripeSubscriptionId,
      set: {
        clerkUserId: input.clerkUserId,
        stripeCustomerId: input.stripeCustomerId,
        status: input.status,
        priceId: input.priceId,
        currentPeriodEnd: input.currentPeriodEnd,
        cancelAtPeriodEnd: input.cancelAtPeriodEnd,
        updatedAt: new Date()
      }
    })
    .returning();

  return subscription;
}

export async function getSubscriptionForUser(clerkUserId: string) {
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.clerkUserId, clerkUserId))
    .orderBy(desc(subscriptions.updatedAt))
    .limit(1);

  return subscription ?? null;
}
