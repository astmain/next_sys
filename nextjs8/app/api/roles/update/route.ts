import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { id, name, remark } = await request.json()
    if (!id) return NextResponse.json({ success: false, message: '角色ID不能为空' })
    if (!name) return NextResponse.json({ success: false, message: '角色名称不能为空' })
    // 检查角色名称是否已被其他角色使用
    const existing_role = await prisma.tb_role.findFirst({ where: { name, id: { not: parseInt(id) } } })
    if (existing_role) return NextResponse.json({ success: false, message: '角色名称已存在' })
    const role = await prisma.tb_role.update({ where: { id: parseInt(id) }, data: { name, remark } })
    return NextResponse.json({ success: true, data: role })
  } catch (error) {
    console.error('Role update error:', error)
    return NextResponse.json({ success: false, message: '服务器错误' })
  }
}
