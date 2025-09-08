const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('=== 检查用户数据 ===')
    const users = await prisma.tb_user.findMany({
      include: {
        roles: {
          include: {
            tb_permission: true
          }
        }
      }
    })
    console.log('用户数量:', users.length)
    users.forEach(user => {
      console.log(`用户: ${user.name} (${user.phone})`)
      console.log('角色数量:', user.roles.length)
      user.roles.forEach(role => {
        console.log(`  - 角色: ${role.name}`)
        console.log(`    权限数量: ${role.tb_permission.length}`)
        role.tb_permission.forEach(perm => {
          console.log(`      * ${perm.name}`)
        })
      })
      console.log('---')
    })

    console.log('\n=== 检查权限数据 ===')
    const permissions = await prisma.tb_permission.findMany()
    console.log('权限数量:', permissions.length)
    permissions.forEach(perm => {
      console.log(`- ${perm.name}`)
    })

    console.log('\n=== 检查角色数据 ===')
    const roles = await prisma.tb_role.findMany({
      include: {
        tb_permission: true
      }
    })
    console.log('角色数量:', roles.length)
    roles.forEach(role => {
      console.log(`角色: ${role.name}`)
      console.log('权限数量:', role.tb_permission.length)
      role.tb_permission.forEach(perm => {
        console.log(`  - ${perm.name}`)
      })
    })

  } catch (error) {
    console.error('查询失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
