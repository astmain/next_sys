import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 初始化用户数据
export async function POST(request: NextRequest) {
  try {
    // 清空现有数据
    await prisma.tb_workflow_step.deleteMany();
    await prisma.tb_workflow_instance.deleteMany();
    await prisma.tb_leave_request.deleteMany();
    await prisma.tb_user.deleteMany();

    // 创建用户
    const users = await Promise.all([
      prisma.tb_user.create({
        data: {
          id: 1,
          name: '王五',
          role: 'ceo',
          department: '董事会',
        },
      }),
      prisma.tb_user.create({
        data: {
          id: 2,
          name: '李四',
          role: 'supervisor',
          department: '客服部',
        },
      }),
      prisma.tb_user.create({
        data: {
          id: 3,
          name: '张三',
          role: 'employee',
          department: '客服部',
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: '初始化成功',
      users,
    });
  } catch (error) {
    console.error('初始化失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 