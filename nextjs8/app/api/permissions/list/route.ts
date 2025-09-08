import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { withPermission } from '@/app/middleware/auth'

const prisma = new PrismaClient()

async function listPermissions(request: NextRequest) {
  try {
    const { name } = await request.json()

    const where: any = {}
    if (name) {
      where.name = {
        contains: name,
      }
    }

    const permissions = await prisma.tb_permission.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: permissions,
    })
  } catch (error) {
    console.error('获取权限列表失败:', error)
    return NextResponse.json(
      {
        success: false,
        message: '获取权限列表失败',
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export const POST = withPermission('read:permissions')(listPermissions)
