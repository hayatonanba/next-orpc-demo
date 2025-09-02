'use client'

import { useState } from 'react'
import { createORPCClient } from '@orpc/client'
import type { RouterClient } from '@orpc/server'
import { link } from '@/lib/orpc'
import { router } from '@/server/router' // 型だけ使う（実行はLink経由）

// 型安全なクライアント生成（実体はHTTP経由）
const client: RouterClient<typeof router> = createORPCClient(link)

export default function Home() {
  const [pong, setPong] = useState<string>('')
  const [echoOut, setEchoOut] = useState<string>('')
  const [sum, setSum] = useState<number | null>(null)
  const [text, setText] = useState('hello orpc')

  return (
    <main style={{ padding: 24 }}>
      <h1>oRPC × Next.js Minimal Demo</h1>

      <section style={{ marginTop: 16 }}>
        <button onClick={async () => setPong(await client.ping())}>
          ping → pong
        </button>
        <p>pong: {pong}</p>
      </section>

      <section style={{ marginTop: 16 }}>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button
          onClick={async () => {
            const res = await client.echo({ text })
            setEchoOut(res.echoed)
          }}
        >
          echo
        </button>
        <p>echoed: {echoOut}</p>
      </section>

      <section style={{ marginTop: 16 }}>
        <button
          onClick={async () => {
            const res = await client.math.add({ a: 1, b: 2 })
            setSum(res.sum)
          }}
        >
          1 + 2 = ?
        </button>
        <p>sum: {sum ?? '-'}</p>
      </section>
    </main>
  )
}
