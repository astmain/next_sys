'use client'
import { Button, Modal, Form, Input, Checkbox } from '@arco-design/web-react'
import { axios_api } from './axios_api'
import { useSnapshot, proxy } from 'valtio'
import Main from '@/pages/Main'

// 全局状态管理,管理用户信息和其他消息
export const BUS = proxy({
  count: 0,
  user: {
    name: 'xupeng',
    tel: '15160315110',
    password: '123456',
  },
})

export default function Home() {
  const snap = useSnapshot(BUS)
  console.log('snap', snap)
  return <div>user: {JSON.stringify(BUS.user)}</div>
}
