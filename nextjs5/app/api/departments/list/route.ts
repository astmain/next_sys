import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const departments = await prisma.tb_depart.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: departments
    })
  } catch (error) {
    console.error('Departments list error:', error)
    return NextResponse.json({ success: false, message: '服务器错误' })
  }
} 