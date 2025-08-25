import { NextRequest, NextResponse as send } from 'next/server'

export async function GET(request: NextRequest) {
  const { url } = request
  console.log('url:', url)
  return send.json({ code: 200, msg: '成功:test' })
  //   http://127.0.0.1:60001/api_gpt1
}
