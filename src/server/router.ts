import { os } from '@orpc/server'
import { z } from 'zod'

// メモリに保存するだけの簡易ストレージ
const posts: { id: number; title: string; content: string }[] = []
let idCounter = 1

// 投稿を追加
const createPost = os
  .input(z.object({ title: z.string().min(1), content: z.string().min(1) }))
  .output(z.object({ id: z.number(), title: z.string(), content: z.string() }))
  .handler(async ({ input }) => {
    const newPost = { id: idCounter++, ...input }
    posts.push(newPost)
    return newPost
  })

// 投稿一覧を取得
const listPosts = os
  .output(z.array(z.object({ id: z.number(), title: z.string(), content: z.string() })))
  .handler(async () => posts)

// 既存ルーターに追加
export const router = {
  blog: {
    create: createPost,
    list: listPosts,
  },
}