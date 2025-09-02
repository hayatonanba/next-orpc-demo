import { RPCLink } from '@orpc/client/fetch'

// ブラウザなら window.origin、SSRなら localhost を使う簡易版
export const link = new RPCLink({
  url:
    typeof window !== 'undefined'
      ? `${window.location.origin}/rpc`
      : 'http://localhost:3000/rpc',
  headers: async () => {
    if (typeof window !== 'undefined') return {}
    const { headers } = await import('next/headers')
    return await headers()
  },
})
