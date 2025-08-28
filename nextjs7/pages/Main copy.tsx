'use client'

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

const { Header, Sider, Content } = Layout
const MenuItem = Menu.Item

export default function Main() {
  const snap = useSnapshot(BUS)
  const router = useRouter()
  const [selected_key, set_selected_key] = useState('dashboard')

  // 检查登录状态
  useEffect(() => {
    if (!snap.auth.token) {
      router.push('/')
    }
  }, [snap.auth.token, router])

  const handle_logout = () => {
    BUS.auth.token = ''
    router.push('/')
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
      default:
        return <Dashboard />
    }
  }

  if (!snap.auth.token) {
    return null
  }

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider collapsed={snap.menu.collapsed} collapsible onCollapse={(collapsed) => (BUS.menu.collapsed = collapsed)}>
        <h2 style={{ color: '#1890ff', height: 60, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>{snap.menu.collapsed ? '后台' : '后台管理系统'}</h2>
       
       {/* 左侧菜单栏 */}
       {/* 我想设置左侧菜单栏的样式,收起时 宽度150px,展开时 宽带200px */}
        <Menu selectedKeys={[selected_key]} onClickMenuItem={(key) => set_selected_key(key)}>
          <MenuItem key="dashboard">📈 仪表盘</MenuItem>
          <MenuItem key="users">🏢 用户管理</MenuItem>
          <MenuItem key="roles">🤝 角色管理</MenuItem>
          <MenuItem key="articles">📃 文章列表</MenuItem>
          <MenuItem key="publish">✍️ 发布文章</MenuItem>
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

