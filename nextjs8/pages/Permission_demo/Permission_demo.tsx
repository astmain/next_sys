'use client'
import { Card, Button, Space, Typography, Divider, Alert } from '@arco-design/web-react'
import { usePermission } from '@/app/hooks/usePermission'
import { WithPermission, AdminOnly, WithRole } from '@/app/components/PermissionGuard'

const { Title, Text, Paragraph } = Typography

export default function Permission_demo() {
  const { hasPermission, hasRole, isAdmin, getUserPermissions, canAccess, user, isAuthenticated } = usePermission()

  const permissions = getUserPermissions()

  return (
    <div>
      <Title level={2}>权限系统演示</Title>
      
      <Alert
        type="info"
        content="这个页面展示了权限系统的各种功能和使用方法"
        style={{ marginBottom: 24 }}
      />

      <Card title="当前用户信息" style={{ marginBottom: 24 }}>
        {isAuthenticated ? (
          <div>
            <Paragraph>
              <Text strong>用户名：</Text>{user?.name}
            </Paragraph>
            <Paragraph>
              <Text strong>手机号：</Text>{user?.phone}
            </Paragraph>
            <Paragraph>
              <Text strong>角色：</Text>
              {user?.roles?.map((role: any) => (
                <span key={role.id} style={{ marginRight: 8 }}>
                  {role.name}
                </span>
              ))}
            </Paragraph>
            <Paragraph>
              <Text strong>权限：</Text>
              {permissions.map(permission => (
                <span key={permission} style={{ marginRight: 8, color: '#1890ff' }}>
                  {permission}
                </span>
              ))}
            </Paragraph>
          </div>
        ) : (
          <Text type="secondary">未登录</Text>
        )}
      </Card>

      <Card title="权限检查示例" style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="large">
          <div>
            <Text strong>hasPermission('read:users'): </Text>
            <Text type={hasPermission('read:users') ? 'success' : 'danger'}>
              {hasPermission('read:users') ? '✓ 有权限' : '✗ 无权限'}
            </Text>
          </div>
          
          <div>
            <Text strong>hasPermission('write:users'): </Text>
            <Text type={hasPermission('write:users') ? 'success' : 'danger'}>
              {hasPermission('write:users') ? '✓ 有权限' : '✗ 无权限'}
            </Text>
          </div>
          
          <div>
            <Text strong>hasRole('admin'): </Text>
            <Text type={hasRole('admin') ? 'success' : 'danger'}>
              {hasRole('admin') ? '✓ 是管理员' : '✗ 不是管理员'}
            </Text>
          </div>
          
          <div>
            <Text strong>isAdmin(): </Text>
            <Text type={isAdmin() ? 'success' : 'danger'}>
              {isAdmin() ? '✓ 是管理员' : '✗ 不是管理员'}
            </Text>
          </div>
          
          <div>
            <Text strong>canAccess(['read:users', 'write:users']): </Text>
            <Text type={canAccess(['read:users', 'write:users']) ? 'success' : 'danger'}>
              {canAccess(['read:users', 'write:users']) ? '✓ 有任一权限' : '✗ 无权限'}
            </Text>
          </div>
        </Space>
      </Card>

      <Card title="权限保护组件示例" style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="large">
          <div>
            <Text strong>管理员专用按钮：</Text>
            <AdminOnly fallback={<Text type="secondary">需要管理员权限</Text>}>
              <Button type="primary" status="danger">删除所有数据</Button>
            </AdminOnly>
          </div>
          
          <div>
            <Text strong>需要写权限的按钮：</Text>
            <WithPermission permission="write:users" fallback={<Text type="secondary">需要用户管理权限</Text>}>
              <Button type="primary">编辑用户</Button>
            </WithPermission>
          </div>
          
          <div>
            <Text strong>需要读权限的按钮：</Text>
            <WithPermission permission="read:users" fallback={<Text type="secondary">需要查看用户权限</Text>}>
              <Button>查看用户</Button>
            </WithPermission>
          </div>
          
          <div>
            <Text strong>需要特定角色的按钮：</Text>
            <WithRole role="admin" fallback={<Text type="secondary">需要管理员角色</Text>}>
              <Button type="primary" status="warning">系统设置</Button>
            </WithRole>
          </div>
        </Space>
      </Card>

      <Card title="权限系统使用说明">
        <Space direction="vertical" size="large">
          <div>
            <Title level={4}>1. 使用 usePermission Hook</Title>
            <Paragraph>
              <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
{`import { usePermission } from '@/app/hooks/usePermission'

function MyComponent() {
  const { hasPermission, hasRole, isAdmin, canAccess } = usePermission()
  
  if (hasPermission('read:users')) {
    // 显示用户列表
  }
  
  if (isAdmin()) {
    // 显示管理员功能
  }
}`}
              </pre>
            </Paragraph>
          </div>
          
          <Divider />
          
          <div>
            <Title level={4}>2. 使用权限保护组件</Title>
            <Paragraph>
              <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
{`import { WithPermission, AdminOnly, WithRole } from '@/app/components/PermissionGuard'

function MyComponent() {
  return (
    <div>
      <AdminOnly fallback={<div>需要管理员权限</div>}>
        <Button>管理员功能</Button>
      </AdminOnly>
      
      <WithPermission permission="write:users">
        <Button>编辑用户</Button>
      </WithPermission>
      
      <WithRole role="admin">
        <Button>系统设置</Button>
      </WithRole>
    </div>
  )
}`}
              </pre>
            </Paragraph>
          </div>
          
          <Divider />
          
          <div>
            <Title level={4}>3. API 权限验证</Title>
            <Paragraph>
              <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
{`import { withPermission, withRole, withAdmin } from '@/app/middleware/auth'

// 需要特定权限
export const POST = withPermission('write:users')(async (request, user) => {
  // 处理请求
})

// 需要特定角色
export const POST = withRole('admin')(async (request, user) => {
  // 处理请求
})

// 需要管理员权限
export const POST = withAdmin(async (request, user) => {
  // 处理请求
})`}
              </pre>
            </Paragraph>
          </div>
        </Space>
      </Card>
    </div>
  )
}
