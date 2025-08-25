import { NextRequest, NextResponse as send } from 'next/server'

export async function GET(request: NextRequest) {
  const { url } = request
  console.log('url:', url)
  return send.json({ code: 200, message: 'Hello, world!' })
  //   http://127.0.0.1:3000/api/aaa
  //   http://localhost:3000/api/aaa
}
