'use client'
import { useState, useEffect, useCallback } from 'react'
import { Card, Table, Input, Button, Space, Modal, Message } from '@arco-design/web-react'
import { useSnapshot } from 'valtio'
import { BUS } from '@/app/page'
import { axios_api } from '@/app/axios_api'

export default function Article_list() {
  useSnapshot(BUS)
  const [search_title, set_search_title] = useState('')

  const load_articles = useCallback(async () => {
    try {
      const response: any = await axios_api.post('/api/articles/list', { title: search_title })
      if (response.success) {
        BUS.article_list = (response.data || []) as any[]
        console.log(BUS.article_list)
        Message.success('加载文章列表成功')
      }
    } catch (error) {
      console.error('加载文章列表失败:', error)
      Message.error('加载文章列表失败')
    }
  }, [search_title])

  useEffect(() => {
    load_articles()
  }, [load_articles])

  const handle_search = () => {
    load_articles()
  }

  function handle_view(article: any) {
    console.log('article', JSON.parse(JSON.stringify(article)))
    BUS.article_curr = article
    BUS.article_show = true
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '标题', dataIndex: 'title', key: 'title', render: (title: string) => <div style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div> },
    { title: '作者', dataIndex: 'author', key: 'author', render: (author: any) => author?.name || '-' },
    { title: '发布时间', dataIndex: 'createdAt', key: 'createdAt', render: (date: string) => new Date(date).toLocaleString() },
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
          data={BUS.article_list || []}
          rowKey="id"
          pagination={{
            total: BUS.article_list?.length || 0,
            pageSize: 10,
            showTotal: true,
          }}
        />
      </Card>

      <Modal title="查看文章" visible={BUS.article_show} onCancel={() => (BUS.article_show = false)} footer={null} style={{ width: 800 }}>
        {BUS.article_show && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 20, fontWeight: 600 }}>{BUS.article_curr.title}</span>
            <div style={{ color: '#666', display: 'flex', justifyContent: 'space-between' }}>
              <span>作者: {BUS.article_curr.author?.name}</span>
              <span>{new Date(BUS.article_curr.createdAt).toLocaleString()}</span>
            </div>
            <div style={{ borderTop: '1px solid #ccc' }}></div>
            <div style={{ whiteSpace: 'pre-wrap', height: 400, maxHeight: 400, overflow: 'auto' }}>{BUS.article_curr.content}</div>
          </div>
        )}
      </Modal>
    </div>
  )
}
