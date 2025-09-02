import { os } from '@orpc/server'
import { db } from './db/client'
import { posts } from './db/schema'
import {
  insertPostSchema,
  selectPostSchema,
  selectPostsSchema,
} from './db/schema'

// Create
const createPost = os
  .input(insertPostSchema)               // drizzle-zod 由来の入力型
  .output(selectPostSchema)              // 返却もDBの型で
  .handler(async ({ input }) => {
    const [row] = await db
      .insert(posts)
      .values({ title: input.title, content: input.content })
      .returning()
    return row
  })

// List
const listPosts = os
  .output(selectPostsSchema)
  .handler(async () => {
    const rows = await db
      .select()
      .from(posts)
    return rows
  })

// Optional: getById（詳細ページ用の下準備）
// const getPost = os
//   .input(selectPostSchema.pick({ id: true })) // { id: number }
//   .output(selectPostSchema.nullable())
//   .handler(async ({ input }) => {
//     const [row] = await db.select().from(posts).where(eq(posts.id, input.id))
//     return row ?? null
//   })

export const router = {
  blog: {
    create: createPost,
    list: listPosts,
    // get: getPost,
  },
}



// import { os } from '@orpc/server'
// import { z } from 'zod'

// // メモリに保存するだけの簡易ストレージ
// const posts: { id: number; title: string; content: string }[] = []
// let idCounter = 1

// // 投稿を追加
// const createPost = os
//   .input(z.object({ title: z.string().min(1), content: z.string().min(1) }))
//   .output(z.object({ id: z.number(), title: z.string(), content: z.string() }))
//   .handler(async ({ input }) => {
//     const newPost = { id: idCounter++, ...input }
//     posts.push(newPost)
//     return newPost
//   })

// // 投稿一覧を取得
// const listPosts = os
//   .output(z.array(z.object({ id: z.number(), title: z.string(), content: z.string() })))
//   .handler(async () => posts)

// // 既存ルーターに追加
// export const router = {
//   blog: {
//     create: createPost,
//     list: listPosts,
//   },
// }