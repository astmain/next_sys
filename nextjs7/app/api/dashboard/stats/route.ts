import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('url', request.url)
    const [users, roles, article_count] = await Promise.all([
      prisma.tb_user.findMany({ include: { roles: true } }), // 用户
      prisma.tb_role.findMany(), // 角色
      prisma.tb_article.findMany({ include: { author: true } }), // 文章
    ])

    return NextResponse.json({ success: true, data: { users, roles, article_count: article_count.length } })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ success: false, message: '服务器错误' })
  }
}
