import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 获取角色的权限
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roleId = searchParams.get('roleId')

    if (!roleId) {
      return NextResponse.json(
        {
          success: false,
          message: '角色ID不能为空',
        },
        { status: 400 }
      )
    }

    const role = await prisma.tb_role.findUnique({
      where: { id: parseInt(roleId) },
      include: {
        tb_permission: true,
      },
    })

    if (!role) {
      return NextResponse.json(
        {
          success: false,
          message: '角色不存在',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: role.tb_permission,
    })
  } catch (error) {
    console.error('获取角色权限失败:', error)
    return NextResponse.json(
      {
        success: false,
        message: '获取角色权限失败',
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// 分配权限给角色
export async function POST(request: NextRequest) {
  try {
    const { roleId, permissionIds } = await request.json()

    if (!roleId) {
      return NextResponse.json(
        {
          success: false,
          message: '角色ID不能为空',
        },
        { status: 400 }
      )
    }

    // 检查角色是否存在
    const role = await prisma.tb_role.findUnique({
      where: { id: parseInt(roleId) },
    })

    if (!role) {
      return NextResponse.json(
        {
          success: false,
          message: '角色不存在',
        },
        { status: 404 }
      )
    }

    // 更新角色的权限关联
    await prisma.tb_role.update({
      where: { id: parseInt(roleId) },
      data: {
        tb_permission: {
          set: permissionIds?.map((id: number) => ({ id })) || [],
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: '权限分配成功',
    })
  } catch (error) {
    console.error('分配权限失败:', error)
    return NextResponse.json(
      {
        success: false,
        message: '分配权限失败',
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
