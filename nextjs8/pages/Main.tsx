'use client'
import { Layout, Menu, Button, Avatar, Dropdown } from '@arco-design/web-react'
import { useSnapshot } from 'valtio'
import { BUS } from '../app/page'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import User_management from './User_management/User_management'
import Role_management from './Role_management/Role_management'
import Article_list from './Article_list/Article_list'
import Article_publish from './Article_publish/Article_publish'
import Dashboard from './Dashboard/Dashboard'
import Test1 from './Test/Test1'
import Test2 from './Test/Test2'
import RoleTest from './Test/RoleTest'

const { Header, Sider, Content } = Layout
const MenuItem = Menu.Item

export default function Main() {
  const snap = useSnapshot(BUS)
  const router = useRouter()
  // 检查用户是否为管理员
  const is_admin = () => {
    if (!snap.auth.user?.roles || !Array.isArray(snap.auth.user.roles)) {
      return false
    }
    return snap.auth.user.roles.some((role: any) => role.name === 'admin')
  }

  // 根据用户角色设置默认选中的菜单项
  const get_default_selected_key = () => {
    return is_admin() ? 'dashboard' : 'articles'
  }

  const [selected_key, set_selected_key] = useState(get_default_selected_key())

  // 检查登录状态
  useEffect(() => {
    if (!snap.auth.token) {
      router.push('/')
    }
  }, [snap.auth.token, router])

  // 当用户角色变化时，更新默认选中的菜单项
  useEffect(() => {
    const default_key = get_default_selected_key()
    set_selected_key(default_key)
  }, [snap.auth.user?.roles])

  const handle_logout = () => {
    BUS.auth.token = ''
    router.push('/')
  }

  // 根据用户角色获取菜单项
  const get_menu_items = () => {
    if (is_admin()) {
      // 超级管理员菜单
      return [
        { key: 'dashboard', label: '📈 仪表盘' },
        { key: 'users', label: '🏢 用户管理' },
        { key: 'roles', label: '🤝 角色管理' },
        { key: 'articles', label: '📃 文章列表' },
        { key: 'publish', label: '✍️ 发布文章' },
        { key: 'role_test', label: '🧪 角色测试' },
      ]
    } else {
      // 普通用户菜单
      return [
        { key: 'articles', label: '📃 文章列表' },
        { key: 'publish', label: '✍️ 发布文章' },
        { key: 'role_test', label: '🧪 角色测试' },
      ]
    }
  }

  const render_content = () => {
    switch (selected_key) {
      case 'dashboard':
        return <Dashboard />
      case 'users':
        return <User_management />
      case 'roles':
        return <Role_management />
      case 'articles':
        return <Article_list />
      case 'publish':
        return <Article_publish />
      case 'role_test':
        return <RoleTest />
      default:
        // 根据角色设置默认页面
        return is_admin() ? <Dashboard /> : <Article_list />
    }
  }

  if (!snap.auth.token) {
    return null
  }

  return (
    <>
      {/* 注入CSS样式来隐藏省略号 */}
      <style jsx>{`
        .arco-menu * {
          text-overflow: clip !important;
          margin-left: 7px !important;
          padding-left: 7px !important;
        }
        .arco-menu-inner {
          margin-left: 0px !important;
        }
      `}</style>

      <Layout style={{ height: '100vh' }}>
        <Sider collapsed={snap.menu.collapsed} collapsible width={180} collapsedWidth={60} onCollapse={(collapsed) => (BUS.menu.collapsed = collapsed)}>
          <h2 style={{ color: '#1890ff', height: 60, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>{snap.menu.collapsed ? '后台' : '后台管理系统'}</h2>

          {/* 左侧菜单栏 */}
          <Menu selectedKeys={[selected_key]} onClickMenuItem={(key) => set_selected_key(key)}>
            {get_menu_items().map((item) => (
              <MenuItem key={item.key}>{item.label}</MenuItem>
            ))}
          </Menu>
        </Sider>

        <Layout>
          <Header style={{ background: '#fff', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px' }}>
            <Button type="text" onClick={() => (BUS.menu.collapsed = !snap.menu.collapsed)}>
              {snap.menu.collapsed ? '展开' : '收起'}
            </Button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span>{snap.auth.user?.name || '用户'}</span>
              <Dropdown
                droplist={
                  <Menu>
                    <MenuItem key="profile">个人信息</MenuItem>
                    <MenuItem key="logout" onClick={handle_logout}>
                      退出登录
                    </MenuItem>
                  </Menu>
                }
              >
                <Avatar style={{ cursor: 'pointer' }}>{snap.auth.user?.name?.charAt(0) || 'U'}</Avatar>
              </Dropdown>
            </div>
          </Header>

          <Content style={{ padding: '24px', background: '#f5f5f5', overflow: 'auto' }}>
            {/* <div>
            <Test1 />
            <Test2 />
          </div> */}
            {render_content()}
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

// 在当页面注入下面的css
// /* 强制隐藏所有省略号 - 使用通配符选择器 */
// .arco-menu * {
//   text-overflow: clip !important;
//   margin-left: 7px !important;
//   padding-left: 7px !important;
// }
// .arco-menu-inner {
//   margin-left: 0px !important;
// }
