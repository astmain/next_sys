'use client'

// 全局状态管理,管理用户信息和其他消息(开始)
import { proxy } from 'valtio'
import { useSnapshot } from 'valtio'
import { useEffect } from 'react'

// 我希望BUS的auth 数据持久化, 当用户刷新页面时, 数据不会丢失(我希望有专门的第三方库支持valtio的持久化)
export const BUS = proxy({
  // 用户认证状态
  count: 0,
  auth: {
    user: { name: '', roles: [], id: 0, role_type: 'user' },
    token: '',

    // user: null as any,
    // token: null as string | null,
  },

  // 菜单状态
  menu: {
    collapsed: false,
    selected_keys: ['dashboard'],
  },

  // 页面数据
  data: {
    users: [] as any[],
    roles: [] as any[],
  },


  

  article_list: [] as any[],
  article_show: false,
  article_count: 0,
  article_curr: {} as any,

  // 通用状态
  ui: {
    loading: false,
    message: '',
  },
})

// 全局状态管理,管理用户信息和其他消息(结束)

import Login from '@/pages/Login'
import Main from '@/pages/Main'

export default function Home() {
  useSnapshot(BUS)

  // 在客户端初始化持久化
  useEffect(() => {
    // 从 localStorage 恢复状态
    const savedState = localStorage.getItem('valtio-state')
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        console.log('parsed', parsed)
        BUS.auth.token = parsed.auth?.token ?? ''
        BUS.count = parsed.count ?? 0
        BUS.auth.user = parsed.auth?.user ?? {}
        BUS.menu.collapsed = parsed.menu?.collapsed ?? false
        BUS.menu.selected_keys = parsed.menu?.selected_keys ?? ['dashboard']
      } catch (error) {
        console.error('Failed to parse saved state:', error)
      }
    }

    // 监听状态变化并保存到 localStorage
    const saveState = () => {
      try {
        localStorage.setItem(
          'valtio-state',
          JSON.stringify({
            auth: BUS.auth,
            menu: BUS.menu,
            count: BUS.count,
          })
        )
      } catch (error) {
        console.error('Failed to save state:', error)
      }
    }

    // 使用 MutationObserver 监听 DOM 变化来触发保存
    const observer = new MutationObserver(saveState)
    observer.observe(document.body, { childList: true, subtree: true })

    // 清理函数
    return () => {
      observer.disconnect()
    }
  }, [])

  // 根据登录状态显示不同页面
  if (BUS.auth.token) {
    return (
      <div className="h-screen w-screen " style={{ backgroundColor: '#f0f2f5' }}>
        {/* <div style={{ display: 'none' }}>{JSON.stringify(BUS)}</div>
        <div>{JSON.stringify(BUS.auth)}</div> */}
        <Main />
      </div>
    )
  } else {
    return (
      <div className="h-screen w-screen">
        {/* <div style={{ display: 'none' }}>{JSON.stringify(BUS)}</div>
        <div>{JSON.stringify(BUS.auth)}</div> */}
        <Login />
      </div>
    )
  }
}
