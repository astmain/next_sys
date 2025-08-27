'use client'
import { useState } from 'react'
import { Card, Form, Input, Button, Tabs, Message } from '@arco-design/web-react'
import { axios_api } from '@/app/axios_api'
import { BUS } from '@/app/page'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [active_tab, set_active_tab] = useState('login')
  const router = useRouter()

  // 登录
  async function handle_login(values: any) {
    try {
      const response: any = await axios_api.post('/api/auth/login', values)
      console.log('response', response)

      if (response.success) {
        BUS.auth.is_logged_in = true
        BUS.auth.user = response.user
        BUS.auth.token = response.token

        Message.success('登录成功')
        router.push('/')
      } else {
        Message.error(response.message || '登录失败1')
      }
    } catch (error: any) {
      Message.error(error.message || '登录失败2')
    }
  }

  // 注册
  async function handle_register(values: any) {
    try {
      const response: any = await axios_api.post('/api/auth/register', values)
      if (response.success) {
        Message.success('注册成功，请登录')
        set_active_tab('login')
      } else {
        Message.error(response.message || '注册失败1')
      }
    } catch (error: any) {
      Message.error(error.message || '注册失败2')
    }
  }

  // 测试
  function handle_test1() {
    console.log('test1')
    Message.success('test1')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <Card style={{ width: 400 }}>
        {/* 标签页切换登录和注册 */}
        <Tabs activeTab={active_tab} onChange={set_active_tab}>
          {/* 登录 */}
          <Tabs.TabPane key="login" title="登录">
            <Form onSubmit={handle_login} layout="vertical" initialValues={{ phone: '15160315110', password: '123456' }}>
              <Form.Item label="手机号" field="phone" rules={[{ required: true, message: '请输入手机号' }]}>
                <Input placeholder="请输入手机号" />
              </Form.Item>
              <Form.Item label="密码" field="password" rules={[{ required: true, message: '请输入密码' }]}>
                <Input.Password placeholder="请输入密码" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" long>
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>

          {/* 注册 */}
          <Tabs.TabPane key="register" title="注册">
            <Form onSubmit={handle_register} layout="vertical">
              <Form.Item label="手机号" field="phone" rules={[{ required: true, message: '请输入手机号' }]}>
                <Input placeholder="请输入手机号" />
              </Form.Item>
              <Form.Item label="昵称" field="name" rules={[{ required: true, message: '请输入昵称' }]}>
                <Input placeholder="请输入昵称" />
              </Form.Item>
              <Form.Item label="密码" field="password" rules={[{ required: true, message: '请输入密码' }]}>
                <Input.Password placeholder="请输入密码" />
              </Form.Item>
              <Form.Item label="确认密码" field="confirm_password" rules={[{ required: true, message: '请确认密码' }]}>
                <Input.Password placeholder="请确认密码" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" long>
                  注册
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
        </Tabs>

        {/* 测试 */}
        <Button type="primary" onClick={handle_test1}>
          handle_test1
        </Button>
      </Card>
    </div>
  )
}
