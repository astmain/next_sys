const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function initPermissions() {
  try {
    console.log('开始初始化权限数据...')

    // 1. 创建基础权限
    const permissions = [
      { name: 'read:permissions', remark: '查看权限列表' },
      { name: 'write:permissions', remark: '创建/编辑权限' },
      { name: 'delete:permissions', remark: '删除权限' },
      { name: 'read:users', remark: '查看用户列表' },
      { name: 'write:users', remark: '创建/编辑用户' },
      { name: 'delete:users', remark: '删除用户' },
      { name: 'read:roles', remark: '查看角色列表' },
      { name: 'write:roles', remark: '创建/编辑角色' },
      { name: 'delete:roles', remark: '删除角色' },
      { name: 'read:articles', remark: '查看文章列表' },
      { name: 'write:articles', remark: '创建/编辑文章' },
      { name: 'delete:articles', remark: '删除文章' },
      { name: 'publish:articles', remark: '发布文章' },
    ]

    console.log('创建权限...')
    for (const perm of permissions) {
      await prisma.tb_permission.upsert({
        where: { name: perm.name },
        update: { remark: perm.remark },
        create: perm
      })
      console.log(`✓ 创建权限: ${perm.name}`)
    }

    // 2. 获取所有权限
    const allPermissions = await prisma.tb_permission.findMany()
    console.log(`\n权限总数: ${allPermissions.length}`)

    // 3. 获取admin角色
    const adminRole = await prisma.tb_role.findFirst({
      where: { name: 'admin' }
    })

    if (!adminRole) {
      console.log('创建admin角色...')
      const newAdminRole = await prisma.tb_role.create({
        data: {
          name: 'admin',
          remark: '管理员角色'
        }
      })
      console.log('✓ 创建admin角色')
    }

    // 4. 将所有权限分配给admin角色
    console.log('\n分配权限给admin角色...')
    await prisma.tb_role.update({
      where: { name: 'admin' },
      data: {
        tb_permission: {
          connect: allPermissions.map(perm => ({ id: perm.id }))
        }
      }
    })
    console.log('✓ 所有权限已分配给admin角色')

    // 5. 验证结果
    console.log('\n验证结果...')
    const adminWithPermissions = await prisma.tb_role.findFirst({
      where: { name: 'admin' },
      include: {
        tb_permission: true
      }
    })

    console.log(`admin角色权限数量: ${adminWithPermissions.tb_permission.length}`)
    adminWithPermissions.tb_permission.forEach(perm => {
      console.log(`  - ${perm.name}`)
    })

    // 6. 检查用户权限
    console.log('\n检查用户权限...')
    const user = await prisma.tb_user.findFirst({
      where: { phone: '15160315110' },
      include: {
        roles: {
          include: {
            tb_permission: true
          }
        }
      }
    })

    if (user) {
      console.log(`用户 ${user.name} 的权限数量: ${user.roles[0]?.tb_permission?.length || 0}`)
      if (user.roles[0]?.tb_permission) {
        user.roles[0].tb_permission.forEach(perm => {
          console.log(`  - ${perm.name}`)
        })
      }
    }

    console.log('\n✅ 权限初始化完成!')

  } catch (error) {
    console.error('初始化失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

initPermissions()
