'use client'
import { useState, useEffect } from 'react'
import { Card, Table, Input, Button, Space, Modal, Form } from '@arco-design/web-react'
import { useSnapshot } from 'valtio'
import { BUS } from '../../app/page'
import { axios_api } from '../../app/axios_api'

export default function RoleManagement() {
  const snap = useSnapshot(BUS)
  const [search_name, set_search_name] = useState('')
  const [modal_visible, set_modal_visible] = useState(false)
  const [editing_role, set_editing_role] = useState<any>(null)

  useEffect(() => {
    load_roles()
  }, [])

  const load_roles = async () => {
    try {
      const response: any = await axios_api.post('/api/roles/list', {
        name: search_name
      })
      if (response.success) {
        BUS.data.roles = (response.data || []) as any[]
      }
    } catch (error) {
      console.error('加载角色列表失败:', error)
    }
  }

  const handle_search = () => {
    load_roles()
  }

  const handle_add = () => {
    set_editing_role(null)
    set_modal_visible(true)
  }

  const handle_edit = (role: any) => {
    set_editing_role(role)
    set_modal_visible(true)
  }

  const handle_save = async (values: any) => {
    try {
      const api = editing_role ? '/api/roles/update' : '/api/roles/create'
      const data = editing_role ? { id: editing_role.id, ...values } : values
      
      const response: any = await axios_api.post(api, data)
      if (response.success) {
        alert(editing_role ? '更新成功' : '创建成功')
        set_modal_visible(false)
        load_roles()
      } else {
        alert(response.message || '操作失败')
      }
    } catch (error) {
      alert('操作失败')
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
      title: '角色名称',
      dataIndex: 'name',
      key: 'name'
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
        <Space>
          <Button type="text" onClick={() => handle_edit(record)}>
            编辑
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>角色管理</h2>
      
      <Card style={{ marginBottom: 24 }}>
        <Space size="large">
          <Input
            placeholder="搜索角色名称"
            value={search_name}
            onChange={set_search_name}
            style={{ width: 200 }}
          />
          <Button type="primary" onClick={handle_search}>
            搜索
          </Button>
          <Button type="primary" onClick={handle_add}>
            新增角色
          </Button>
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          data={snap.data.roles}
          rowKey="id"
          pagination={{
            total: snap.data.roles.length,
            pageSize: 10,
            showTotal: true
          }}
        />
      </Card>

      <Modal
        title={editing_role ? '编辑角色' : '新增角色'}
        visible={modal_visible}
        onCancel={() => set_modal_visible(false)}
        footer={null}
        style={{ width: 500 }}
      >
        <Form
          initialValues={editing_role}
          onSubmit={handle_save}
          layout="vertical"
        >
          <Form.Item label="角色名称" field="name" rules={[{ required: true, message: '请输入角色名称' }]}>
            <Input placeholder="请输入角色名称" />
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