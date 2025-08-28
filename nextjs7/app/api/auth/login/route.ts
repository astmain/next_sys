import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { phone, password } = await request.json()

    if (!phone || !password) {
      return NextResponse.json({ success: false, message: '手机号和密码不能为空' })
    }

    const user = await prisma.tb_user.findUnique({ where: { phone }, include: { roles: true } })

    if (!user) {
      return NextResponse.json({ success: false, message: '用户不存在' })
    }

    if (user.password !== password) {
      return NextResponse.json({ success: false, message: '密码错误' })
    }

    // 生成简单的token（实际项目中应该使用JWT）
    const token = `token_${user.id}_${Date.now()}`

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        roles: user.roles,
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, message: '服务器错误' })
  }
}
