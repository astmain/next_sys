import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { id, name, depart_id, remark } = await request.json()
    
    if (!id) {
      return NextResponse.json({ success: false, message: '用户ID不能为空' })
    }

    const user = await prisma.tb_user.update({
      where: { id: parseInt(id) },
      data: {
        name,
        depart_id: depart_id ? parseInt(depart_id) : null,
        remark
      }
    })

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('User update error:', error)
    return NextResponse.json({ success: false, message: '服务器错误' })
  }
} 