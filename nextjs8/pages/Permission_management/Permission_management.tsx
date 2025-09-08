'use client'
import { useState, useEffect } from 'react'
import { Card, Table, Input, Button, Space, Modal, Form, Message, Tag } from '@arco-design/web-react'
import { useSnapshot } from 'valtio'
import { BUS } from '@/app/page'
import { axios_api } from '@/app/axios_api'
import { WithPermission } from '@/app/components/PermissionGuard' 

export default function Permission_management() {
  const snap = useSnapshot(BUS)
  const [search_name, set_search_name] = useState('')
  const [modal_visible, set_modal_visible] = useState(false)
  const [editing_permission, set_editing_permission] = useState<any>(null)

  useEffect(() => {
    load_permissions()
  }, [])

  const load_permissions = async () => {
    try {
      const response: any = await axios_api.post('/api/permissions/list', {
        name: search_name,
      })
      if (response.success) {
        BUS.data.permissions = (response.data || []) as any[]
      }
    } catch (error) {
      console.error('加载权限列表失败:', error)
    }
  }

  const handle_search = () => {
    load_permissions()
  }

  const handle_add = () => {
    set_editing_permission(null)
    set_modal_visible(true)
  }

  const handle_edit = (permission: any) => {
    set_editing_permission(permission)
    set_modal_visible(true)
  }

  const handle_delete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个权限吗？删除后无法恢复。',
      onOk: async () => {
        try {
          await axios_api.post('/api/permissions/delete', { id })
          Message.success('删除成功')
          load_permissions()
        } catch (error: any) {
          Message.error(error.response?.data?.message || '删除失败')
        }
      },
    })
  }

  const handle_save = async (values: any) => {
    try {
      const api = editing_permission ? '/api/permissions/update' : '/api/permissions/create'
      const data = editing_permission ? { id: editing_permission.id, ...values } : values

      const response: any = await axios_api.post(api, data)
      if (response.success) {
        Message.success(editing_permission ? '更新成功' : '创建成功')
        console.log('更新成功:', response.data)
        set_modal_visible(false)
        load_permissions()
      } else {
        console.error('操作失败:', response.message)
        Message.error(response.message || '操作失败')
      }
    } catch (error) {
      console.error('操作失败:', error)
      Message.error('操作失败')
    }
  }

  const getPermissionType = (name: string) => {
    if (name.includes('read')) return 'read'
    if (name.includes('write') || name.includes('create') || name.includes('update') || name.includes('delete')) return 'write'
    if (name.includes('admin')) return 'admin'
    return 'other'
  }

  const getPermissionTypeColor = (type: string) => {
    switch (type) {
      case 'read': return 'blue'
      case 'write': return 'orange'
      case 'admin': return 'red'
      default: return 'gray'
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <Space>
          <span>{name}</span>
          <Tag color={getPermissionTypeColor(getPermissionType(name))}>
            {getPermissionType(name)}
          </Tag>
        </Space>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <WithPermission permission="write:permissions">
            <Button type="text" onClick={() => handle_edit(record)}>
              编辑
            </Button>
          </WithPermission>
          <WithPermission permission="write:permissions">
            <Button type="text" status="danger" onClick={() => handle_delete(record.id)}>
              删除
            </Button>
          </WithPermission>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>权限管理</h2>

      <Card style={{ marginBottom: 24 }}>
        <Space size="large">
          <Input placeholder="搜索权限名称" value={search_name} onChange={set_search_name} style={{ width: 200 }} />
          <Button type="primary" onClick={handle_search}>
            搜索
          </Button>
          <WithPermission permission="write:permissions">
            <Button type="primary" onClick={handle_add}>
              新增权限
            </Button>
          </WithPermission>
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          data={BUS.data.permissions}
          rowKey="id"
          pagination={{
            total: snap.data.permissions.length,
            pageSize: 10,
            showTotal: true,
          }}
        />
      </Card>

      <Modal title={editing_permission ? '编辑权限' : '新增权限'} visible={modal_visible} onCancel={() => set_modal_visible(false)} footer={null} style={{ width: 500 }}>
        <Form initialValues={editing_permission} onSubmit={handle_save} layout="vertical">
          <Form.Item label="权限名称" field="name" rules={[{ required: true, message: '请输入权限名称' }]}>
            <Input placeholder="请输入权限名称，如：read:users, write:articles" />
          </Form.Item>
          <Form.Item label="备注" field="remark">
            <Input.TextArea placeholder="请输入备注" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={() => set_modal_visible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
