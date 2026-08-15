import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from './env.js';
import * as schema from '../models/schema.js';

let dbInstance = null;

export const getDb = () => {
  if (!dbInstance) {
    if (!env.databaseUrl) {
      console.warn('⚠️ WARNING: DATABASE_URL is not set. Database operations will fail until configured.');
    }
    const sql = neon(env.databaseUrl || 'postgresql://placeholder:placeholder@localhost/placeholder');
    dbInstance = drizzle(sql, { schema });
  }
  return dbInstance;
};

export const db = getDb();
