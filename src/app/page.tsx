'use client'
import { useState, useEffect } from 'react'
import { createORPCClient } from '@orpc/client'
import type { RouterClient } from '@orpc/server'
import { router } from '@/server/router'
import { link } from '@/lib/orpc'

const client: RouterClient<typeof router> = createORPCClient(link)

export default function Home() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [posts, setPosts] = useState<
    { id: number; title: string; content: string }[]
  >([])

  // 初期ロードで一覧取得
  useEffect(() => {
    client.blog.list().then(setPosts)
  }, [])

  const handleSubmit = async () => {
    if (!title || !content) return
    const newPost = await client.blog.create({ title, content })
    setPosts((prev) => [...prev, newPost])
    setTitle('')
    setContent('')
  }

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h1>My Blog (oRPC Demo)</h1>

      {/* 投稿フォーム */}
      <section style={{ marginTop: 24 }}>
        <h2>New Post</h2>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: 'block', marginBottom: 8, width: '100%' }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ display: 'block', marginBottom: 8, width: '100%' }}
        />
        <button onClick={handleSubmit}>Publish</button>
      </section>

      {/* 投稿一覧 */}
      <section style={{ marginTop: 32 }}>
        <h2>Posts</h2>
        {posts.length === 0 && <p>No posts yet.</p>}
        <ul>
          {posts.map((p) => (
            <li key={p.id} style={{ marginBottom: 16 }}>
              <h3>{p.title}</h3>
              <p>{p.content}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
