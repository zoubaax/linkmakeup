import { env } from '../config/env.js';

export function isAdminEmail(email) {
  if (!email) return false;
  return env.adminEmails.includes(email.toLowerCase());
}

export function toPublicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    isAdmin: isAdminEmail(user.email),
  };
}
