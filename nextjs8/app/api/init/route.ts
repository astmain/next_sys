import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // 检查是否已有用户
    const user_count = await prisma.tb_user.count()
    if (user_count > 0) return NextResponse.json({ success: false, message: '系统已初始化，无需重复初始化' })

    // 创建权限
    const permissions = [
      { name: 'read:users', remark: '查看用户' },
      { name: 'write:users', remark: '管理用户' },
      { name: 'read:roles', remark: '查看角色' },
      { name: 'write:roles', remark: '管理角色' },
      { name: 'read:permissions', remark: '查看权限' },
      { name: 'write:permissions', remark: '管理权限' },
      { name: 'read:articles', remark: '查看文章' },
      { name: 'write:articles', remark: '管理文章' },
      { name: 'admin:system', remark: '系统管理' },
    ]

    const createdPermissions = []
    for (const permission of permissions) {
      const created = await prisma.tb_permission.create({
        data: permission,
      })
      createdPermissions.push(created)
    }

    // 创建超级管理员角色
    const admin_role = await prisma.tb_role.create({ 
      data: { 
        name: 'admin', 
        remark: '超级管理员角色',
        tb_permission: {
          connect: createdPermissions.map(p => ({ id: p.id }))
        }
      } 
    })

    // 创建访客角色
    const guest_role = await prisma.tb_role.create({ 
      data: { 
        name: 'guest', 
        remark: '访客角色',
        tb_permission: {
          connect: createdPermissions.filter(p => p.name.startsWith('read:')).map(p => ({ id: p.id }))
        }
      } 
    })

    // 创建超级管理员用户
    const admin_user = await prisma.tb_user.create({ 
      data: { 
        phone: '15160315110', 
        password: '123456', 
        name: '超级管理员', 
        remark: '超级管理员' 
      } 
    })

    // 创建普通用户
    const normal_user = await prisma.tb_user.create({ 
      data: { 
        phone: '13800138000', 
        password: '123456', 
        name: '普通用户', 
        remark: '普通用户' 
      } 
    })

    // 分配角色
    await prisma.tb_user.update({ where: { id: admin_user.id }, data: { roles: { connect: { id: admin_role.id } } } })
    await prisma.tb_user.update({ where: { id: normal_user.id }, data: { roles: { connect: { id: guest_role.id } } } })
    
    return NextResponse.json({ 
      success: true, 
      message: '系统初始化成功', 
      data: { 
        admin_user: { phone: admin_user.phone, password: '123456', name: admin_user.name },
        normal_user: { phone: normal_user.phone, password: '123456', name: normal_user.name }
      } 
    })
  } catch (error) {
    console.error('Init error:', error)
    return NextResponse.json({ success: false, message: '服务器错误' })
  }
}
