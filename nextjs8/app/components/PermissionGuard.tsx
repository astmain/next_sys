import React from 'react'
import { usePermission } from '@/app/hooks/usePermission'

interface PermissionGuardProps {
  children: React.ReactNode
  permission?: string | string[]
  role?: string | string[]
  requireAdmin?: boolean
  fallback?: React.ReactNode
}

export function PermissionGuard({ 
  children, 
  permission, 
  role, 
  requireAdmin = false, 
  fallback = null 
}: PermissionGuardProps) {
  const { hasPermission, hasRole, isAdmin, canAccess } = usePermission()

  // 如果需要管理员权限
  if (requireAdmin && !isAdmin()) {
    return <>{fallback}</>
  }

  // 如果需要特定角色
  if (role) {
    const roles = Array.isArray(role) ? role : [role]
    const hasRequiredRole = roles.some(r => hasRole(r))
    if (!hasRequiredRole) {
      return <>{fallback}</>
    }
  }

  // 如果需要特定权限
  if (permission) {
    const hasRequiredPermission = canAccess(permission)
    if (!hasRequiredPermission) {
      return <>{fallback}</>
    }
  }

  return <>{children}</>
}

// 便捷组件
export function AdminOnly({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard requireAdmin={true} fallback={fallback}>
      {children}
    </PermissionGuard>
  )
}

export function WithPermission({ 
  permission, 
  children, 
  fallback = null 
}: { 
  permission: string | string[]
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  return (
    <PermissionGuard permission={permission} fallback={fallback}>
      {children}
    </PermissionGuard>
  )
}

export function WithRole({ 
  role, 
  children, 
  fallback = null 
}: { 
  role: string | string[]
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  return (
    <PermissionGuard role={role} fallback={fallback}>
      {children}
    </PermissionGuard>
  )
}
