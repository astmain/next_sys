import { NextRequest, NextResponse as send } from 'next/server'
import prisma from '@/lib/prisma'
export async function GET(request: NextRequest) {
  const { url } = request
  console.log('url:', url)
  const data = await prisma.tb_file.findMany()
  console.log('data:', data)
  return send.json({ code: 200, message: 'Hello, test!', data })
  //   http://127.0.0.1:3000/api/test
  //   http://localhost:3000/api/test
}
