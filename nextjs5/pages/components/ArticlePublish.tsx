'use client'
import { useState, useRef } from 'react'
import { Card, Form, Input, Button, Message } from '@arco-design/web-react'
import { useSnapshot } from 'valtio'
import { BUS } from '../../app/page'
import { axios_api } from '../../app/axios_api'

export default function ArticlePublish() {
  const snap = useSnapshot(BUS)
  const [loading, set_loading] = useState(false)
  const form_ref = useRef<any>(null)

  const handle_publish = async (values: any) => {
    try {
      set_loading(true)
      const response: any = await axios_api.post('/api/articles/create', {
        ...values,
        author_id: snap.auth.user?.id
      })
      
      if (response.success) {
        Message.success('文章发布成功')
        // 重置表单
        if (form_ref.current) {
          form_ref.current.resetFields()
        }
      } else {
        Message.error(response.message || '发布失败')
      }
    } catch (error) {
      Message.error('发布失败')
    } finally {
      set_loading(false)
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>发布文章</h2>
      
      <Card>
        <Form
          ref={form_ref}
          onSubmit={handle_publish}
          layout="vertical"
          style={{ maxWidth: 800 }}
        >
          <Form.Item 
            label="文章标题" 
            field="title" 
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" />
          </Form.Item>
          
          <Form.Item 
            label="文章内容" 
            field="content" 
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <Input.TextArea 
              placeholder="请输入文章内容"
              rows={15}
              style={{ resize: 'vertical' }}
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
            >
              发布文章
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
} 