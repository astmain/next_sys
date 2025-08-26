'use client'
import { useSnapshot } from 'valtio'
import { proxy } from 'valtio'
import Main from '@/pages/Main'
import LoginPage from './login/page'

// 全局状态管理,管理用户信息和其他消息
export const BUS = proxy({
  // 用户认证状态
  auth: {
    is_logged_in: false,
    user: null as any,
    token: null as string | null,
  },
  
  // 菜单状态
  menu: {
    collapsed: false,
    selected_keys: ['dashboard'],
  },
  
  // 页面数据
  data: {
    users: [] as any[],
    departments: [] as any[],
    roles: [] as any[],
    articles: [] as any[],
  },
  
  // 通用状态
  ui: {
    loading: false,
    message: '',
  }
})

export default function Home() {
  const snap = useSnapshot(BUS)
  
  // 根据登录状态显示不同页面
  if (snap.auth.is_logged_in) {
    return <Main />
  } else {
    return <LoginPage />
  }
}
