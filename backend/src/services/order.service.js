import { db } from '../config/db.js';
import { orders } from '../models/schema.js';
import { eq, desc, ilike, or, and, sql } from 'drizzle-orm';

// In-memory fallback store for robust dev/demo mode
const memoryOrders = [];

export class OrderService {
  static async createOrder({ fullName, phone, city, address, notes = '' }) {
    const newOrder = {
      id: crypto.randomUUID(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: address.trim(),
      notes: notes ? notes.trim() : null,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const inserted = await db
        .insert(orders)
        .values(newOrder)
        .returning();
      if (inserted && inserted.length > 0) {
        return inserted[0];
      }
    } catch (err) {
      console.warn('⚠️ DB insert error in createOrder (falling back to memory):', err.message);
    }

    memoryOrders.unshift(newOrder);
    return newOrder;
  }

  static async getAdminOrders({ page = 1, limit = 10, search = '', status = 'all' } = {}) {
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Math.min(100, Number(limit) || 10));
    const offset = (pageNum - 1) * limitNum;
    const cleanSearch = String(search || '').trim().toLowerCase();
    const cleanStatus = String(status || 'all').trim().toLowerCase();

    try {
      const conditions = [];
      if (cleanStatus !== 'all') {
        conditions.push(eq(orders.status, cleanStatus));
      }
      if (cleanSearch) {
        conditions.push(
          or(
            ilike(orders.fullName, `%${cleanSearch}%`),
            ilike(orders.phone, `%${cleanSearch}%`),
            ilike(orders.city, `%${cleanSearch}%`)
          )
        );
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db
        .select()
        .from(orders)
        .where(whereClause)
        .orderBy(desc(orders.createdAt))
        .limit(limitNum)
        .offset(offset);

      const countResult = await db
        .select({ count: sql`count(*)` })
        .from(orders)
        .where(whereClause);

      const total = Number(countResult[0]?.count || 0);
      const totalPages = Math.max(1, Math.ceil(total / limitNum));

      return {
        items,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      };
    } catch (err) {
      console.warn('⚠️ DB select error in getAdminOrders (falling back to memory):', err.message);

      let filtered = [...memoryOrders];
      if (cleanStatus !== 'all') {
        filtered = filtered.filter((o) => o.status === cleanStatus);
      }
      if (cleanSearch) {
        filtered = filtered.filter(
          (o) =>
            o.fullName.toLowerCase().includes(cleanSearch) ||
            o.phone.toLowerCase().includes(cleanSearch) ||
            o.city.toLowerCase().includes(cleanSearch)
        );
      }

      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / limitNum));
      const paginatedItems = filtered.slice(offset, offset + limitNum);

      return {
        items: paginatedItems,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      };
    }
  }

  static async updateOrderStatus(id, status) {
    const validStatuses = ['pending', 'contacted', 'delivered', 'cancelled'];
    const cleanStatus = validStatuses.includes(status) ? status : 'pending';

    try {
      const updated = await db
        .update(orders)
        .set({ status: cleanStatus, updatedAt: new Date() })
        .where(eq(orders.id, id))
        .returning();

      if (updated && updated.length > 0) {
        return updated[0];
      }
    } catch (err) {
      console.warn('⚠️ DB update error in updateOrderStatus (falling back to memory):', err.message);
    }

    const index = memoryOrders.findIndex((o) => o.id === id);
    if (index !== -1) {
      memoryOrders[index].status = cleanStatus;
      memoryOrders[index].updatedAt = new Date();
      return memoryOrders[index];
    }

    return { id, status: cleanStatus };
  }
}
