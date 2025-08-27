'use client'
import { useState, useEffect } from 'react'
import { Card, Table, Input, Button, Space, Modal } from '@arco-design/web-react'
import { useSnapshot } from 'valtio'
import { BUS } from '@/app/page'
import { axios_api } from '@/app/axios_api'

export default function Article_list() {
  useSnapshot(BUS)
  const [search_title, set_search_title] = useState('')
  const [view_modal_visible, set_view_modal_visible] = useState(false)
  const [viewing_article, set_viewing_article] = useState<any>(null)

  useEffect(() => {
    load_articles()
  }, [])

  const load_articles = async () => {
    try {
      const response: any = await axios_api.post('/api/articles/list', {
        title: search_title,
      })
      if (response.success) {
        BUS.data.articles = (response.data || []) as any[]
      }
    } catch (error) {
      console.error('加载文章列表失败:', error)
    }
  }

  const handle_search = () => {
    load_articles()
  }

  const handle_view = (article: any) => {
    set_viewing_article(article)
    set_view_modal_visible(true)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => <div style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>,
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      render: (author: any) => author?.name || '-',
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Button type="text" onClick={() => handle_view(record)}>
          查看
        </Button>
      ),
    },
  ]

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>文章列表</h2>

      <Card style={{ marginBottom: 24 }}>
        <Space size="large">
          <Input placeholder="搜索文章标题" value={search_title} onChange={set_search_title} style={{ width: 300 }} />
          <Button type="primary" onClick={handle_search}>
            搜索
          </Button>
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          data={BUS.data.articles}
          rowKey="id"
          pagination={{
            total: BUS.data.articles.length,
            pageSize: 10,
            showTotal: true,
          }}
        />
      </Card>

      <Modal title="查看文章" visible={view_modal_visible} onCancel={() => set_view_modal_visible(false)} footer={null} style={{ width: 800 }}>
        {viewing_article && (
          <div>
            <h2 style={{ marginBottom: 16 }}>{viewing_article.title}</h2>
            <div style={{ marginBottom: 16, color: '#666' }}>
              <span>作者: {viewing_article.author?.name || '未知'}</span>
              <span style={{ marginLeft: 20 }}>发布时间: {new Date(viewing_article.createdAt).toLocaleString()}</span>
            </div>
            <div
              style={{
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
                maxHeight: 400,
                overflow: 'auto',
              }}
            >
              {viewing_article.content}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
