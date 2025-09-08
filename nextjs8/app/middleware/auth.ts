import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface AuthUser {
  id: number
  phone: string
  name: string
  roles: Array<{
    id: number
    name: string
    tb_permission: Array<{
      id: number
      name: string
    }>
  }>
}

export async function verifyAuth(request: NextRequest): Promise<{ user: AuthUser | null; error?: string }> {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return { user: null, error: '未提供认证令牌' }
    }

    // 简化处理：验证令牌格式并查询用户
    // 在实际项目中，应该验证JWT token的有效性
    if (!token.includes('1111')) {
      return { user: null, error: '无效的认证令牌' }
    }

    // 根据令牌查询用户（简化处理，实际应该从token解析用户ID）
    const user = await prisma.tb_user.findFirst({
      where: { phone: '15160315110' }, // 简化处理，实际应该从token解析
      include: {
        roles: {
          include: {
            tb_permission: true
          }
        }
      }
    })

    if (!user) {
      return { user: null, error: '用户不存在' }
    }

    return { user: user as AuthUser }
  } catch (error) {
    console.error('认证验证失败:', error)
    return { user: null, error: '认证验证失败' }
  }
}

export function hasPermission(user: AuthUser, permission: string): boolean {
  return user.roles.some(role => 
    role.tb_permission.some(perm => perm.name === permission)
  )
}

export function hasRole(user: AuthUser, roleName: string): boolean {
  return user.roles.some(role => role.name === roleName)
}

export function isAdmin(user: AuthUser): boolean {
  return hasRole(user, 'admin')
}

export function withAuth(handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const { user, error } = await verifyAuth(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: error || '认证失败' },
        { status: 401 }
      )
    }

    return handler(request, user)
  }
}

export function withPermission(permission: string) {
  return function(handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>) {
    return withAuth(async (request: NextRequest, user: AuthUser) => {
      if (!hasPermission(user, permission)) {
        return NextResponse.json(
          { success: false, message: '权限不足' },
          { status: 403 }
        )
      }

      return handler(request, user)
    })
  }
}

export function withRole(roleName: string) {
  return function(handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>) {
    return withAuth(async (request: NextRequest, user: AuthUser) => {
      if (!hasRole(user, roleName)) {
        return NextResponse.json(
          { success: false, message: '角色权限不足' },
          { status: 403 }
        )
      }

      return handler(request, user)
    })
  }
}

export function withAdmin(handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>) {
  return withAuth(async (request: NextRequest, user: AuthUser) => {
    if (!isAdmin(user)) {
      return NextResponse.json(
        { success: false, message: '需要管理员权限' },
        { status: 403 }
      )
    }

    return handler(request, user)
  })
}
