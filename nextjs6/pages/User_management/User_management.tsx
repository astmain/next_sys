'use client'
import { useState, useEffect } from 'react'
  import { Card, Table, Input, Button, Space, Modal, Form, Message } from '@arco-design/web-react'
import { useSnapshot } from 'valtio'
import { BUS } from '@/app/page'
import { axios_api } from '@/app/axios_api'

export default function User_management() {
  useSnapshot(BUS)
  const [search_phone, set_search_phone] = useState('')
  const [search_name, set_search_name] = useState('')
  const [modal_visible, set_modal_visible] = useState(false)
  const [editing_user, set_editing_user] = useState<any>(null)

  useEffect(() => {
    load_users()
  }, [])

  const load_users = async () => {
    try {
      const response: any = await axios_api.post('/api/users/list', {
        phone: search_phone,
        name: search_name
      })
      if (response.success) {
        BUS.data.users = [...(response.data || [])]
      }
    } catch (error) {
      console.error('加载用户列表失败:', error)
    }
  }

  const handle_search = () => {
    load_users()
  }

  const handle_edit = (user: any) => {
    set_editing_user(user)
    set_modal_visible(true)
  }

  const handle_save = async (values: any) => {
    try {
      const response: any = await axios_api.post('/api/users/update', {
        id: editing_user.id,
        ...values
      })
      if (response.success) {
        Message.success('更新成功')
        console.log('更新成功:', response.data)
        set_modal_visible(false)
        load_users()
      } else {
        Message.error(response.message || '更新失败')
        console.error('更新失败:', response.message)
      }
    } catch (error) {
      console.error('更新失败:', error)
      Message.error('更新失败')
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: '昵称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: any[]) => roles?.map((role: any) => role.name).join(', ') || '-'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Button type="text" onClick={() => handle_edit(record)}>
          编辑
        </Button>
      )
    }
  ]

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>用户管理</h2>
      
      <Card style={{ marginBottom: 24 }}>
        <Space size="large">
          <Input
            placeholder="搜索手机号"
            value={search_phone}
            onChange={set_search_phone}
            style={{ width: 200 }}
          />
          <Input
            placeholder="搜索昵称"
            value={search_name}
            onChange={set_search_name}
            style={{ width: 200 }}
          />
          <Button type="primary" onClick={handle_search}>
            搜索
          </Button>
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          data={BUS.data.users}
          rowKey="id"
          pagination={{
            total: BUS.data.users.length,
            pageSize: 10,
            showTotal: true
          }}
        />
      </Card>

      <Modal
        title="编辑用户"
        visible={modal_visible}
        onCancel={() => set_modal_visible(false)}
        footer={null}
        style={{ width: 500 }}
      >
        <Form
          initialValues={editing_user}
          onSubmit={handle_save}
          layout="vertical"
        >
          <Form.Item label="昵称" field="name" rules={[{ required: true, message: '请输入昵称' }]}>
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item label="备注" field="remark">
            <Input.TextArea placeholder="请输入备注" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={() => set_modal_visible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
} 