// 权限检查工具函数

export interface User {
  id: number
  phone: string
  name?: string
  roles?: Role[]
}

export interface Role {
  id: number
  name: string
  tb_permission?: Permission[]
}

export interface Permission {
  id: number
  name: string
  remark?: string
}

/**
 * 检查用户是否具有指定权限
 * @param user 用户对象
 * @param permissionName 权限名称
 * @returns 是否具有权限
 */
export function hasPermission(user: User | null, permissionName: string): boolean {
  if (!user || !user.roles) {
    return false
  }

  return user.roles.some(role => 
    role.tb_permission?.some(permission => permission.name === permissionName)
  )
}

/**
 * 检查用户是否具有指定角色
 * @param user 用户对象
 * @param roleName 角色名称
 * @returns 是否具有角色
 */
export function hasRole(user: User | null, roleName: string): boolean {
  if (!user || !user.roles) {
    return false
  }

  return user.roles.some(role => role.name === roleName)
}

/**
 * 检查用户是否为管理员
 * @param user 用户对象
 * @returns 是否为管理员
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, 'admin')
}

/**
 * 检查用户是否为超级管理员
 * @param user 用户对象
 * @returns 是否为超级管理员
 */
export function isSuperAdmin(user: User | null): boolean {
  return hasRole(user, 'superadmin')
}

/**
 * 获取用户的所有权限
 * @param user 用户对象
 * @returns 权限列表
 */
export function getUserPermissions(user: User | null): Permission[] {
  if (!user || !user.roles) {
    return []
  }

  const permissions: Permission[] = []
  user.roles.forEach(role => {
    if (role.tb_permission) {
      role.tb_permission.forEach(permission => {
        if (!permissions.find(p => p.id === permission.id)) {
          permissions.push(permission)
        }
      })
    }
  })

  return permissions
}

/**
 * 权限检查装饰器（用于 API 路由）
 * @param permissionName 权限名称
 * @returns 中间件函数
 */
export function requirePermission(permissionName: string) {
  return function (handler: Function) {
    return async function (request: any, ...args: any[]) {
      // 这里需要根据实际的认证方式获取用户信息
      // 示例实现，实际使用时需要根据具体情况调整
      const user = request.user // 假设用户信息在 request.user 中
      
      if (!hasPermission(user, permissionName)) {
        return new Response(
          JSON.stringify({ success: false, message: '权限不足' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        )
      }

      return handler(request, ...args)
    }
  }
}

/**
 * 角色检查装饰器（用于 API 路由）
 * @param roleName 角色名称
 * @returns 中间件函数
 */
export function requireRole(roleName: string) {
  return function (handler: Function) {
    return async function (request: any, ...args: any[]) {
      const user = request.user // 假设用户信息在 request.user 中
      
      if (!hasRole(user, roleName)) {
        return new Response(
          JSON.stringify({ success: false, message: '角色权限不足' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        )
      }

      return handler(request, ...args)
    }
  }
}
