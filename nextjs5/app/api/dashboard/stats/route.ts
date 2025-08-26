import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const [users, roles, articles] = await Promise.all([
      prisma.tb_user.findMany({
        include: {
          roles: true
        }
      }),
      prisma.tb_role.findMany(),
      prisma.tb_article.findMany({
        include: {
          author: true
        }
      })
    ])

    return NextResponse.json({
      success: true,
      data: {
        users,
        roles,
        articles
      }
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ success: false, message: '服务器错误' })
  }
} 