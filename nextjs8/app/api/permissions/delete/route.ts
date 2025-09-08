import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { withPermission } from '@/app/middleware/auth'

const prisma = new PrismaClient()

async function deletePermission(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: '权限ID不能为空',
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

    // 检查权限是否被角色使用
    const rolesWithPermission = await prisma.tb_role.findMany({
      where: {
        tb_permission: {
          some: {
            id: parseInt(id)
          }
        }
      }
    })

    if (rolesWithPermission.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: '该权限正在被角色使用，无法删除',
        },
        { status: 400 }
      )
    }

    await prisma.tb_permission.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({
      success: true,
      message: '权限删除成功',
    })
  } catch (error) {
    console.error('删除权限失败:', error)
    return NextResponse.json(
      {
        success: false,
        message: '删除权限失败',
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export const POST = withPermission('write:permissions')(deletePermission)
