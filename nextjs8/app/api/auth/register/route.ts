import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { phone, password, name } = await request.json()

    if (!phone || !password || !name) return NextResponse.json({ success: false, message: '手机号、密码和昵称不能为空' })

    // 检查手机号是否已存在
    const existing_user = await prisma.tb_user.findUnique({ where: { phone } })

    if (existing_user) return NextResponse.json({ success: false, message: '手机号已被注册' })

    // 检查是否是第一个用户（超级管理员）
    const user_count = await prisma.tb_user.count()
    const is_super_admin = user_count === 0

    // 创建用户
    const user = await prisma.tb_user.create({ data: { phone, password, name, remark: is_super_admin ? '超级管理员' : '普通用户' } })

    // 如果是第一个用户，创建默认角色并分配
    if (is_super_admin) {
      const admin_role = await prisma.tb_role.create({ data: { name: 'admin', remark: '超级管理员角色' } })
      await prisma.tb_user.update({ where: { id: user.id }, data: { roles: { connect: { id: admin_role.id } } } })
    }

    return NextResponse.json({ success: true, message: '注册成功', user: { id: user.id, phone: user.phone, name: user.name } })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ success: false, message: '服务器错误' })
  }
}
