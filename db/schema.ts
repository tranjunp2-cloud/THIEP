import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const rsvps = sqliteTable('rsvps', {
 id: text('id').primaryKey(), name: text('name').notNull(), attendance: text('attendance').notNull(),
 shuttle: text('shuttle').notNull(), diet: text('diet').notNull().default(''),
 message: text('message').notNull().default(''), createdAt: text('created_at').notNull(),
});
