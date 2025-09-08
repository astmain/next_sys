import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json()
    const where: any = {}
    if (title) where.title = { contains: title }
    const articles = await prisma.tb_article.findMany({ where, include: { author: true }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ success: true, data: articles })
  } catch (error) {
    console.error('Articles list error:', error)
    return NextResponse.json({ success: false, message: '服务器错误' })
  }
}
