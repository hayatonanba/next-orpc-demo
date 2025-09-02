import { pgTable, serial, text } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
})

// DB <-> oRPCで共有するZodスキーマ（drizzle-zod発）
export const insertPostSchema = createInsertSchema(posts, {
  title: z.string().min(1),
  content: z.string().min(1),
}).pick({ title: true, content: true }) // id/createdAtはDB側で付与

export const selectPostSchema = createSelectSchema(posts)
export const selectPostsSchema = z.array(selectPostSchema)
