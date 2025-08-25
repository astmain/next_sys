import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 审批请假申请
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { request_id, action, comment, approver_id, approver_name } = body;

    // 获取请假申请
    const leave_request = await prisma.tb_leave_request.findUnique({
      where: { id: request_id },
      include: {
        workflow_instances: {
          include: {
            workflow_steps: true,
          },
        },
      },
    });

    if (!leave_request) {
      return NextResponse.json(
        { error: '请假申请不存在' },
        { status: 404 }
      );
    }

    // 修改类型声明，使其与Prisma update操作返回的类型匹配
    let updated_request: any = leave_request;

    if (action === 'supervisor_approve') {
      // 主管批准
      updated_request = await prisma.tb_leave_request.update({
        where: { id: request_id },
        data: { supervisor_approved: true },
      });

      // 更新工作流步骤状态
      await prisma.tb_workflow_step.updateMany({
        where: {
          workflow_instance_id: leave_request.workflow_instances[0]?.id,
          step_name: '主管审批',
        },
        data: {
          status: 'approved',
          comment: comment || '已批准',
          completed_at: new Date(),
        },
      });

      // 如果是简单流程且主管已批准，则整个流程完成
      if (leave_request.leave_days <= 3) {
        updated_request = await prisma.tb_leave_request.update({
          where: { id: request_id },
          data: { 
            status: 'approved',
            ceo_approved: true, // 简单流程不需要董事长审批
          },
        });

        // 更新工作流实例状态
        await prisma.tb_workflow_instance.update({
          where: { id: leave_request.workflow_instances[0]?.id },
          data: { 
            status: 'completed',
            current_step: 'completed',
          },
        });
      } else {
        // 复杂流程，更新当前步骤为董事长审批
        await prisma.tb_workflow_instance.update({
          where: { id: leave_request.workflow_instances[0]?.id },
          data: { current_step: 'ceo_approval' },
        });
      }
    } else if (action === 'supervisor_reject') {
      // 主管拒绝
      updated_request = await prisma.tb_leave_request.update({
        where: { id: request_id },
        data: { status: 'rejected' },
      });

      // 更新工作流步骤状态
      await prisma.tb_workflow_step.updateMany({
        where: {
          workflow_instance_id: leave_request.workflow_instances[0]?.id,
          step_name: '主管审批',
        },
        data: {
          status: 'rejected',
          comment: comment || '已拒绝',
          completed_at: new Date(),
        },
      });

      // 更新工作流实例状态
      await prisma.tb_workflow_instance.update({
        where: { id: leave_request.workflow_instances[0]?.id },
        data: { 
          status: 'failed',
          current_step: 'rejected',
        },
      });
    } else if (action === 'ceo_approve') {
      // 董事长批准
      updated_request = await prisma.tb_leave_request.update({
        where: { id: request_id },
        data: { 
          ceo_approved: true,
          status: 'approved',
        },
      });

      // 更新工作流步骤状态
      await prisma.tb_workflow_step.updateMany({
        where: {
          workflow_instance_id: leave_request.workflow_instances[0]?.id,
          step_name: '董事长审批',
        },
        data: {
          status: 'approved',
          comment: comment || '已批准',
          completed_at: new Date(),
        },
      });

      // 更新工作流实例状态
      await prisma.tb_workflow_instance.update({
        where: { id: leave_request.workflow_instances[0]?.id },
        data: { 
          status: 'completed',
          current_step: 'completed',
        },
      });
    } else if (action === 'ceo_reject') {
      // 董事长拒绝
      updated_request = await prisma.tb_leave_request.update({
        where: { id: request_id },
        data: { status: 'rejected' },
      });

      // 更新工作流步骤状态
      await prisma.tb_workflow_step.updateMany({
        where: {
          workflow_instance_id: leave_request.workflow_instances[0]?.id,
          step_name: '董事长审批',
        },
        data: {
          status: 'rejected',
          comment: comment || '已拒绝',
          completed_at: new Date(),
        },
      });

      // 更新工作流实例状态
      await prisma.tb_workflow_instance.update({
        where: { id: leave_request.workflow_instances[0]?.id },
        data: { 
          status: 'failed',
          current_step: 'rejected',
        },
      });
    }

    return NextResponse.json({
      success: true,
      updated_request,
    });
  } catch (error) {
    console.error('审批请假申请失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 