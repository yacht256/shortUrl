import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core'

export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 32 }).unique().notNull(),
  targetUrl: text('target_url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Link = typeof links.$inferSelect
export type NewLink = typeof links.$inferInsert
