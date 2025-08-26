'use client'
import { useState } from 'react'
import { Card, Form, Input, Button, Tabs, Message } from '@arco-design/web-react'
import { axios_api } from '../axios_api'
import { BUS } from '../page'
import { useRouter } from 'next/navigation'

const TabPane = Tabs.TabPane

export default function LoginPage() {
  const [active_tab, set_active_tab] = useState('login')
  const [loading, set_loading] = useState(false)
  const router = useRouter()

  const handle_login = async (values: any) => {
    try {
      set_loading(true)
      const response: any = await axios_api.post('/api/auth/login', values)
      console.log("response",response)
      if (response.success) {
        BUS.auth.is_logged_in = true
        BUS.auth.user = response.user
        BUS.auth.token = response.token
        Message.success('登录成功')
        router.push('/')
      } else {
        Message.error(response.message || '登录失败')
      }
    } catch (error: any) {
      Message.error(error.message || '登录失败')
    } finally {
      set_loading(false)
    }
  }

  const handle_register = async (values: any) => {
    try {
      set_loading(true)
      const response: any = await axios_api.post('/api/auth/register', values)
      
      if (response.success) {
        Message.success('注册成功，请登录')
        set_active_tab('login')
      } else {
        Message.error(response.message || '注册失败')
      }
    } catch (error: any) {
      Message.error(error.message || '注册失败')
    } finally {
      set_loading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5'
    }}>
      <Card style={{ width: 400 }}>
        <Tabs activeTab={active_tab} onChange={set_active_tab}>
          <TabPane key="login" title="登录">
            <Form onSubmit={handle_login} layout="vertical">
              <Form.Item label="手机号" field="phone" rules={[{ required: true, message: '请输入手机号' }]}>
                <Input placeholder="请输入手机号" />
              </Form.Item>
              <Form.Item label="密码" field="password" rules={[{ required: true, message: '请输入密码' }]}>
                <Input.Password placeholder="请输入密码" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} long>
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane key="register" title="注册">
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
                <Button type="primary" htmlType="submit" loading={loading} long>
                  注册
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
} 