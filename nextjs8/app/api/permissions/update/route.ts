import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { withPermission } from '@/app/middleware/auth'

const prisma = new PrismaClient()

async function updatePermission(request: NextRequest) {
  try {
    const { id, name, remark } = await request.json()

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: '权限ID不能为空',
        },
        { status: 400 }
      )
    }

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: '权限名称不能为空',
        },
        { status: 400 }
      )
    }

    // 检查权限是否存在
    const existingPermission = await prisma.tb_permission.findUnique({
      where: { id: parseInt(id) },
    })

    if (!existingPermission) {
      return NextResponse.json(
        {
          success: false,
          message: '权限不存在',
        },
        { status: 404 }
      )
    }

    // 检查权限名称是否已被其他权限使用
    const duplicatePermission = await prisma.tb_permission.findFirst({
      where: {
        name,
        id: { not: parseInt(id) },
      },
    })

    if (duplicatePermission) {
      return NextResponse.json(
        {
          success: false,
          message: '权限名称已存在',
        },
        { status: 400 }
      )
    }

    const permission = await prisma.tb_permission.update({
      where: { id: parseInt(id) },
      data: {
        name,
        remark: remark || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: permission,
      message: '权限更新成功',
    })
  } catch (error) {
    console.error('更新权限失败:', error)
    return NextResponse.json(
      {
        success: false,
        message: '更新权限失败',
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export const POST = withPermission('write:permissions')(updatePermission)
