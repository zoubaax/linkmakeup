import { and, desc, eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { adminNotes } from '../models/schema.js';
import { ApiError } from '../utils/apiResponse.js';

const TARGET_TYPES = new Set(['user', 'profile']);

function parseTargetType(value) {
  const type = String(value || '').trim().toLowerCase();
  return TARGET_TYPES.has(type) ? type : null;
}

export class AdminNotesService {
  static async listNotes({ targetType, targetId }) {
    const type = parseTargetType(targetType);
    if (!type || !targetId) {
      throw new ApiError('targetType and targetId are required', 400);
    }

    return db
      .select()
      .from(adminNotes)
      .where(and(eq(adminNotes.targetType, type), eq(adminNotes.targetId, targetId)))
      .orderBy(desc(adminNotes.createdAt));
  }

  static async createNote({ targetType, targetId, body, authorEmail }) {
    const type = parseTargetType(targetType);
    const trimmedBody = String(body || '').trim();

    if (!type || !targetId) {
      throw new ApiError('targetType and targetId are required', 400);
    }
    if (trimmedBody.length < 1) {
      throw new ApiError('Note body is required', 400);
    }
    if (trimmedBody.length > 5000) {
      throw new ApiError('Note body is too long (max 5000 characters)', 400);
    }

    const [entry] = await db
      .insert(adminNotes)
      .values({
        targetType: type,
        targetId,
        authorEmail,
        body: trimmedBody,
      })
      .returning();

    return entry;
  }

  static async deleteNote(noteId, actorEmail) {
    const [existing] = await db
      .select()
      .from(adminNotes)
      .where(eq(adminNotes.id, noteId))
      .limit(1);

    if (!existing) {
      throw new ApiError('Note not found', 404);
    }

    if (existing.authorEmail.toLowerCase() !== actorEmail.toLowerCase()) {
      throw new ApiError('You can only delete your own notes', 403);
    }

    await db.delete(adminNotes).where(eq(adminNotes.id, noteId));
    return { id: noteId, deleted: true };
  }
}
