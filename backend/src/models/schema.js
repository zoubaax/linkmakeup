import { pgTable, uuid, varchar, text, boolean, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';

// 1. Users Entity
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  googleId: varchar('google_id', { length: 255 }).unique(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: text('password_hash'),
  name: varchar('name', { length: 255 }),
  avatarUrl: text('avatar_url'),
  emailVerified: boolean('email_verified').default(false).notNull(),
  verificationCode: varchar('verification_code', { length: 6 }),
  verificationCodeExpiresAt: timestamp('verification_code_expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Profile Entity
export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).unique().notNull(),
  username: varchar('username', { length: 50 }).unique().notNull(),
  displayName: varchar('display_name', { length: 100 }).notNull(),
  role: varchar('role', { length: 150 }),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  avatarShape: varchar('avatar_shape', { length: 20 }).default('circle').notNull(),
  avatarSize: varchar('avatar_size', { length: 20 }).default('medium').notNull(),
  statusBadge: varchar('status_badge', { length: 150 }),
  showStatusBadge: boolean('show_status_badge').default(true).notNull(),
  isSuspended: boolean('is_suspended').default(false).notNull(),
  themeConfig: jsonb('theme_config').default({
    preset: 'minimal-mono',
    layoutStyle: 'minimal',
    backgroundColor: '#FFFFFF',
    cardColor: '#FFFFFF',
    accentColor: '#111827',
    textColor: '#111827',
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Link Entity
export const links = pgTable('links', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: varchar('subtitle', { length: 255 }),
  url: text('url').notNull(),
  icon: varchar('icon', { length: 100 }),
  position: integer('position').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 4. Admin audit log
export const adminAuditLogs = pgTable('admin_audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  actorEmail: varchar('actor_email', { length: 255 }).notNull(),
  actorType: varchar('actor_type', { length: 20 }).notNull(),
  action: varchar('action', { length: 80 }).notNull(),
  targetType: varchar('target_type', { length: 40 }).notNull(),
  targetId: uuid('target_id').notNull(),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
