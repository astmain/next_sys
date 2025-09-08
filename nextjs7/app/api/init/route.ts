import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // 检查是否已有用户
    const user_count = await prisma.tb_user.count()
    if (user_count > 0) return NextResponse.json({ success: false, message: '系统已初始化，无需重复初始化' })

    // 创建超级管理员角色
    const admin_role = await prisma.tb_role.create({ data: { name: 'admin', remark: '超级管理员角色' } })

    // 创建测试用户
    const test_user = await prisma.tb_user.create({ data: { phone: '15160315110', password: '123456', name: '测试用户', remark: '超级管理员' } })

    // 分配角色
    await prisma.tb_user.update({ where: { id: test_user.id }, data: { roles: { connect: { id: admin_role.id } } } })
    return NextResponse.json({ success: true, message: '系统初始化成功', data: { user: { phone: test_user.phone, password: '123456', name: test_user.name } } })
  } catch (error) {
    console.error('Init error:', error)
    return NextResponse.json({ success: false, message: '服务器错误' })
  }
}
