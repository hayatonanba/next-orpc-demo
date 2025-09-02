import { RPCHandler } from '@orpc/server/fetch'
import { router } from '@/server/router'

const handler = new RPCHandler(router)

async function handleRequest(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: '/rpc',     // エンドポイントのベース
    context: {},        // 認証などを載せたい時はここに
  })
  return response ?? new Response('Not found', { status: 404 })
}

export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest
export const HEAD = handleRequest
