import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "./index";
import { users, userRequests } from "./schema";
import type { DB } from "./schema";

const DAILY_REQUEST_LIMIT = 2; // Adjust this value as needed

export async function getUserById(userId: string): Promise<DB.User | null> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return result[0] || null;
}

export async function getDailyRequestCount(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(userRequests)
    .where(
      and(
        eq(userRequests.userId, userId),
        gte(userRequests.requestDate, today),
      ),
    );

  return result[0]?.count || 0;
}

export async function addUserRequest(userId: string): Promise<void> {
  await db.insert(userRequests).values({
    userId,
    requestDate: new Date(),
  });
}

export async function isUserAllowedToMakeRequest(userId: string): Promise<{
  allowed: boolean;
  currentCount: number;
  limit: number;
}> {
  const user = await getUserById(userId);

  // Admin users can bypass rate limits
  if (user?.isAdmin) {
    return {
      allowed: true,
      currentCount: 0,
      limit: DAILY_REQUEST_LIMIT,
    };
  }

  const currentCount = await getDailyRequestCount(userId);
  const allowed = currentCount < DAILY_REQUEST_LIMIT;

  return {
    allowed,
    currentCount,
    limit: DAILY_REQUEST_LIMIT,
  };
}
