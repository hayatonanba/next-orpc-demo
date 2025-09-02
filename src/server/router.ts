import { os } from '@orpc/server'
import { z } from 'zod'

// 1. "ping" -> 文字列を返すだけ（超ミニマム）
const ping = os.handler(async () => 'pong')

// 2. "echo" -> 入力バリデーション付き
const echo = os
  .input(z.object({ text: z.string().min(1) }))
  .output(z.object({ echoed: z.string() }))
  .handler(async ({ input }) => ({ echoed: input.text }))

// 3. "add" -> numberを2つ受け取って合計を返す
const add = os
  .input(z.object({ a: z.number(), b: z.number() }))
  .output(z.object({ sum: z.number() }))
  .handler(async ({ input }) => ({ sum: input.a + input.b }))

// ルーター（ネスト可）。キー名がプロシージャ名になります
export const router = {
  ping,
  echo,
  math: { add },
}
