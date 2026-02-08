import { auth, currentUser } from "@clerk/nextjs/server";
import { upsertUser } from "@/lib/db";

export type AuthUser = {
  id: string;
  email: string;
};

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const user = await currentUser();
  const email =
    user?.emailAddresses.find((entry) => entry.id === user.primaryEmailAddressId)?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress;

  if (!email) {
    return null;
  }

  await upsertUser({
    clerkUserId: userId,
    email
  });

  return { id: userId, email };
}
