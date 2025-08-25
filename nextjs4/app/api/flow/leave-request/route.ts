import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 提交请假申请
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employee_id, employee_name, leave_days, reason } = body;

    // 验证必填字段
    if (!employee_id || !employee_name || !leave_days || !reason) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 创建请假申请
    const leave_request = await prisma.tb_leave_request.create({
      data: {
        employee_id,
        employee_name,
        leave_days,
        reason,
        status: 'pending',
        supervisor_approved: false,
        ceo_approved: false,
      },
    });

    // 创建工作流实例
    const workflow_type = leave_days <= 3 ? 'simple' : 'complex';
    const current_step = 'supervisor_approval';

    const workflow_instance = await prisma.tb_workflow_instance.create({
      data: {
        leave_request_id: leave_request.id,
        workflow_type,
        current_step,
        status: 'running',
      },
    });

    // 创建主管审批步骤
    await prisma.tb_workflow_step.create({
      data: {
        workflow_instance_id: workflow_instance.id,
        step_name: '主管审批',
        step_type: 'approval',
        assignee_id: 2, // 李四
        assignee_name: '李四',
        status: 'pending',
      },
    });

    // 如果是复杂流程，创建董事长审批步骤
    if (workflow_type === 'complex') {
      await prisma.tb_workflow_step.create({
        data: {
          workflow_instance_id: workflow_instance.id,
          step_name: '董事长审批',
          step_type: 'approval',
          assignee_id: 1, // 王五
          assignee_name: '王五',
          status: 'pending',
        },
      });
    }

    return NextResponse.json({
      success: true,
      leave_request,
      workflow_instance,
    });
  } catch (error) {
    console.error('创建请假申请失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 