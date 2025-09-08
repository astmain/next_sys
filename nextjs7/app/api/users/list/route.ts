import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { phone, name } = await request.json()
    const where: any = {}
    if (phone) where.phone = { contains: phone }
    if (name) where.name = { contains: name }
    const users = await prisma.tb_user.findMany({ where, include: { roles: true }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    console.error('Users list error:', error)
    return NextResponse.json({ success: false, message: '服务器错误' })
  }
}
