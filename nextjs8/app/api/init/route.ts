import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // 检查是否已有用户
    const user_count = await prisma.tb_user.count()
    if (user_count > 0) return NextResponse.json({ success: false, message: '系统已初始化，无需重复初始化' })

    // 创建超级管理员角色
    const admin_role = await prisma.tb_role.create({ data: { name: 'admin', remark: '超级管理员角色' } })

    // 创建超级管理员用户
    const admin_user = await prisma.tb_user.create({ 
      data: { 
        phone: '15160315110', 
        password: '123456', 
        name: '超级管理员', 
        role_type: 'admin',
        remark: '超级管理员' 
      } 
    })

    // 创建普通用户
    const normal_user = await prisma.tb_user.create({ 
      data: { 
        phone: '13800138000', 
        password: '123456', 
        name: '普通用户', 
        role_type: 'user',
        remark: '普通用户' 
      } 
    })

    // 分配角色
    await prisma.tb_user.update({ where: { id: admin_user.id }, data: { roles: { connect: { id: admin_role.id } } } })
    
    return NextResponse.json({ 
      success: true, 
      message: '系统初始化成功', 
      data: { 
        admin_user: { phone: admin_user.phone, password: '123456', name: admin_user.name, role_type: admin_user.role_type },
        normal_user: { phone: normal_user.phone, password: '123456', name: normal_user.name, role_type: normal_user.role_type }
      } 
    })
  } catch (error) {
    console.error('Init error:', error)
    return NextResponse.json({ success: false, message: '服务器错误' })
  }
}
