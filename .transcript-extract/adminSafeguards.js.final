import { eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { links, profiles, users } from '../models/schema.js';
import { ApiError } from '../utils/apiResponse.js';
import { isAdminEmail } from './adminAccess.js';

export function assertCanModerateTarget(targetUserEmail) {
  if (targetUserEmail && isAdminEmail(targetUserEmail)) {
    throw new ApiError('Cannot moderate another platform admin account', 403);
  }
}

export async function resolveUserEmailForLink(linkId) {
  const [row] = await db
    .select({ email: users.email })
    .from(links)
    .innerJoin(users, eq(users.id, links.userId))
    .where(eq(links.id, linkId))
    .limit(1);

  return row?.email || null;
}

export async function resolveUserEmailForProfile(profileId) {
  const [row] = await db
    .select({ email: users.email })
    .from(profiles)
    .innerJoin(users, eq(users.id, profiles.userId))
    .where(eq(profiles.id, profileId))
    .limit(1);

  return row?.email || null;
}
