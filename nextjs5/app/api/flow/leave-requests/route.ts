import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取请假申请列表
export async function GET(request: NextRequest) {
  try {
    const leave_requests = await prisma.tb_leave_request.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        employee: true,
      },
    });

    return NextResponse.json(leave_requests);
  } catch (error) {
    console.error('获取请假申请失败:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
} 