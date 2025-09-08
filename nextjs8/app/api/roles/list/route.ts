import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()
    const where: any = {}
    if (name) where.name = { contains: name }
    const roles = await prisma.tb_role.findMany({ where, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ success: true, data: roles })
  } catch (error) {
    console.error('Roles list error:', error)
    return NextResponse.json({ success: false, message: '服务器错误' })
  }
}
