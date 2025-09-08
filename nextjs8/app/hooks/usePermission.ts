import { useSnapshot } from 'valtio'
import { BUS } from '@/app/page'

export function usePermission() {
  const snap = useSnapshot(BUS)

  const hasPermission = (permission: string): boolean => {
    if (!snap.auth.user || !snap.auth.user.roles) return false
    
    return snap.auth.user.roles.some((role: any) => 
      role.tb_permission?.some((perm: any) => perm.name === permission)
    )
  }

  const hasRole = (roleName: string): boolean => {
    if (!snap.auth.user || !snap.auth.user.roles) return false
    
    return snap.auth.user.roles.some((role: any) => role.name === roleName)
  }

  const isAdmin = (): boolean => {
    return hasRole('admin')
  }

  const getUserPermissions = (): string[] => {
    if (!snap.auth.user || !snap.auth.user.roles) return []
    
    const permissions: string[] = []
    snap.auth.user.roles.forEach((role: any) => {
      role.tb_permission?.forEach((perm: any) => {
        if (!permissions.includes(perm.name)) {
          permissions.push(perm.name)
        }
      })
    })
    
    return permissions
  }

  const canAccess = (requiredPermissions: string | string[]): boolean => {
    if (!snap.auth.user || !snap.auth.user.roles) return false
    
    const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions]
    
    // 如果用户是管理员，拥有所有权限
    if (isAdmin()) return true
    
    // 检查是否拥有任一所需权限
    return permissions.some(permission => hasPermission(permission))
  }

  return {
    hasPermission,
    hasRole,
    isAdmin,
    getUserPermissions,
    canAccess,
    user: snap.auth.user,
    isAuthenticated: !!snap.auth.user
  }
}
