'use client'
import { useState, useEffect } from 'react'
import { Card, Button, Message, Space } from '@arco-design/web-react'
import { axios_api } from '@/app/axios_api'
import { useSnapshot } from 'valtio'
import { BUS } from '@/app/page'

export default function Test_auth() {
  const snap = useSnapshot(BUS)
  const [test_result, set_test_result] = useState('')

  const test_auth = async () => {
    try {
      const response: any = await axios_api.post('/api/permissions/list', {})
      set_test_result(JSON.stringify(response, null, 2))
      Message.success('认证测试成功')
    } catch (error: any) {
      set_test_result(JSON.stringify(error.response?.data || error.message, null, 2))
      Message.error('认证测试失败')
    }
  }

  const test_create_permission = async () => {
    try {
      const response: any = await axios_api.post('/api/permissions/create', {
        name: 'test:permission',
        remark: '测试权限'
      })
      set_test_result(JSON.stringify(response, null, 2))
      Message.success('创建权限测试成功')
    } catch (error: any) {
      set_test_result(JSON.stringify(error.response?.data || error.message, null, 2))
      Message.error('创建权限测试失败')
    }
  }

  const clear_token = () => {
    localStorage.removeItem('token')
    BUS.auth.token = ''
    BUS.auth.user = null
    set_test_result('')
    Message.success('已清除认证令牌')
  }

  const set_test_token = () => {
    const test_token = 'test_token_1111'
    localStorage.setItem('token', test_token)
    BUS.auth.token = test_token
    set_test_result('')
    Message.success('已设置测试令牌')
  }

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>认证测试</h2>

      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Button type="primary" onClick={test_auth}>
            测试权限列表接口
          </Button>
          <Button type="primary" onClick={test_create_permission}>
            测试创建权限接口
          </Button>
          <Button onClick={set_test_token}>
            设置测试令牌
          </Button>
          <Button onClick={clear_token}>
            清除令牌
          </Button>
        </Space>
      </Card>

      <Card>
        <h3>当前状态</h3>
        <p><strong>用户:</strong> {snap.auth.user?.name || '未登录'}</p>
        <p><strong>令牌:</strong> {snap.auth.token || '无'}</p>
        <p><strong>localStorage令牌:</strong> {localStorage.getItem('token') || '无'}</p>
      </Card>

      <Card style={{ marginTop: 24 }}>
        <h3>测试结果</h3>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '16px', 
          borderRadius: '4px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all'
        }}>
          {test_result || '点击按钮进行测试'}
        </pre>
      </Card>
    </div>
  )
}
