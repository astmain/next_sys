import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { withPermission } from '@/app/middleware/auth'

const prisma = new PrismaClient()

async function createPermission(request: NextRequest) {
  try {
    const { name, remark } = await request.json()

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: '权限名称不能为空',
        },
        { status: 400 }
      )
    }

    // 检查权限名称是否已存在
    const existingPermission = await prisma.tb_permission.findUnique({
      where: { name },
    })

    if (existingPermission) {
      return NextResponse.json(
        {
          success: false,
          message: '权限名称已存在',
        },
        { status: 400 }
      )
    }

    const permission = await prisma.tb_permission.create({
      data: {
        name,
        remark: remark || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: permission,
      message: '权限创建成功',
    })
  } catch (error) {
    console.error('创建权限失败:', error)
    return NextResponse.json(
      {
        success: false,
        message: '创建权限失败',
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export const POST = withPermission('write:permissions')(createPermission)
