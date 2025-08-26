'use client'
import { Layout, Menu, Button, Avatar, Dropdown } from '@arco-design/web-react'
import { useSnapshot } from 'valtio'
import { BUS } from '../app/page'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import UserManagement from './components/UserManagement'
import RoleManagement from './components/RoleManagement'
import ArticleList from './components/ArticleList'
import ArticlePublish from './components/ArticlePublish'
import Dashboard from './components/Dashboard'

const { Header, Sider, Content } = Layout
const MenuItem = Menu.Item

export default function Main() {
  const snap = useSnapshot(BUS)
  const router = useRouter()
  const [selected_key, set_selected_key] = useState('dashboard')

  // 检查登录状态
  useEffect(() => {
    if (!snap.auth.is_logged_in) {
      router.push('/login')
    }
  }, [snap.auth.is_logged_in, router])

  const handle_logout = () => {
    BUS.auth.is_logged_in = false
    BUS.auth.user = null
    BUS.auth.token = null
    router.push('/login')
  }

  const render_content = () => {
    switch (selected_key) {
      case 'dashboard':
        return <Dashboard />
      case 'users':
        return <UserManagement />
      case 'roles':
        return <RoleManagement />
      case 'articles':
        return <ArticleList />
      case 'publish':
        return <ArticlePublish />
      default:
        return <Dashboard />
    }
  }

  if (!snap.auth.is_logged_in) {
    return null
  }

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        collapsed={snap.menu.collapsed}
        collapsible
        onCollapse={(collapsed) => {
          BUS.menu.collapsed = collapsed
        }}
        style={{ background: '#fff' }}
      >
        <div style={{ 
          height: 60, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <h3 style={{ margin: 0, color: '#1890ff' }}>
            {snap.menu.collapsed ? '后台' : '后台管理系统'}
          </h3>
        </div>
        <Menu
          selectedKeys={[selected_key]}
          onClickMenuItem={(key) => set_selected_key(key)}
          style={{ border: 'none' }}
        >
          <MenuItem key="dashboard">仪表盘</MenuItem>
          <MenuItem key="users">用户管理</MenuItem>
          <MenuItem key="roles">角色管理</MenuItem>
          <MenuItem key="articles">文章列表</MenuItem>
          <MenuItem key="publish">发布文章</MenuItem>
        </Menu>
      </Sider>
      
      <Layout>
        <Header style={{ 
          background: '#fff', 
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px'
        }}>
          <div>
            <Button
              type="text"
              onClick={() => {
                BUS.menu.collapsed = !snap.menu.collapsed
              }}
            >
              {snap.menu.collapsed ? '展开' : '收起'}
            </Button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span>欢迎，{snap.auth.user?.name || '用户'}</span>
            <Dropdown
              droplist={
                <Menu>
                  <MenuItem key="profile">个人信息</MenuItem>
                  <MenuItem key="logout" onClick={handle_logout}>退出登录</MenuItem>
                </Menu>
              }
            >
              <Avatar style={{ cursor: 'pointer' }}>
                {snap.auth.user?.name?.charAt(0) || 'U'}
              </Avatar>
            </Dropdown>
          </div>
        </Header>
        
        <Content style={{ 
          padding: '24px',
          background: '#f5f5f5',
          overflow: 'auto'
        }}>
          {render_content()}
        </Content>
      </Layout>
    </Layout>
  )
}
