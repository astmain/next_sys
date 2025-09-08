'use client'
import { useSnapshot } from 'valtio'
import { BUS } from '../../app/page'

export default function RoleTest() {
  const snap = useSnapshot(BUS)

  // 检查用户是否为管理员
  const is_admin = () => {
    if (!snap.auth.user?.roles || !Array.isArray(snap.auth.user.roles)) {
      return false
    }
    return snap.auth.user.roles.some((role: any) => role.name === 'admin')
  }

  return (
    <div style={{ padding: '20px', background: '#fff', margin: '20px', borderRadius: '8px' }}>
      <h2>角色测试页面</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>用户信息：</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(snap.auth.user, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>角色判断结果：</h3>
        <p><strong>是否为管理员：</strong> {is_admin() ? '是' : '否'}</p>
        <p><strong>角色类型：</strong> {snap.auth.user?.role_type || '未设置'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>角色数组：</h3>
        {snap.auth.user?.roles && Array.isArray(snap.auth.user.roles) ? (
          <ul>
            {snap.auth.user.roles.map((role: any, index: number) => (
              <li key={index}>
                ID: {role.id}, 名称: {role.name}, 备注: {role.remark}
              </li>
            ))}
          </ul>
        ) : (
          <p>无角色信息</p>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>菜单显示逻辑测试：</h3>
        {is_admin() ? (
          <div>
            <p style={{ color: 'green' }}>✅ 将显示管理员菜单：</p>
            <ul>
              <li>📈 仪表盘</li>
              <li>🏢 用户管理</li>
              <li>🤝 角色管理</li>
              <li>📃 文章列表</li>
              <li>✍️ 发布文章</li>
            </ul>
          </div>
        ) : (
          <div>
            <p style={{ color: 'blue' }}>ℹ️ 将显示普通用户菜单：</p>
            <ul>
              <li>📃 文章列表</li>
              <li>✍️ 发布文章</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
