import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { name, remark } = await request.json()
    
    if (!name) {
      return NextResponse.json({ success: false, message: '角色名称不能为空' })
    }

    // 检查角色名称是否已存在
    const existing_role = await prisma.tb_role.findUnique({
      where: { name }
    })

    if (existing_role) {
      return NextResponse.json({ success: false, message: '角色名称已存在' })
    }

    const role = await prisma.tb_role.create({
      data: {
        name,
        remark
      }
    })

    return NextResponse.json({
      success: true,
      data: role
    })
  } catch (error) {
    console.error('Role create error:', error)
    return NextResponse.json({ success: false, message: '服务器错误' })
  }
} 