import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_suspended boolean NOT NULL DEFAULT false`;
await sql`
  CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_email varchar(255) NOT NULL,
    actor_type varchar(20) NOT NULL,
    action varchar(80) NOT NULL,
    target_type varchar(40) NOT NULL,
    target_id uuid NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp NOT NULL DEFAULT now()
  )
`;

console.log('Admin schema migration applied');
