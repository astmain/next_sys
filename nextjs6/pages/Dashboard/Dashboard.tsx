'use client'
import { Card, Grid, Statistic, Button, Message } from '@arco-design/web-react'
import { useSnapshot } from 'valtio'
import { BUS } from '@/app/page'
import { useEffect } from 'react'
import { axios_api } from '@/app/axios_api'

const { Row, Col } = Grid

export default function Dashboard() {
  const snap = useSnapshot(BUS)

  useEffect(() => {
    load_dashboard_data()
  }, [])

  const load_dashboard_data = async () => {
    try {
      const response: any = await axios_api.post('/api/dashboard/stats')
      if (response.success) {
        BUS.data.users = response.data.users || []
        BUS.data.roles = response.data.roles || []
        BUS.data.articles = response.data.articles || []
      }
    } catch (error) {
      console.error('加载仪表盘数据失败:', error)
    }
  }

  function test() {
    console.log(snap.auth.user)
    Message.success('测试成功')
  }

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>仪表盘</h2>
      <Button type="primary" onClick={test}>
        测试
      </Button>

      <Card style={{ marginBottom: 24 }}>
        <p>当前用户: {BUS.auth.user?.name || '未知'}</p>
        <p>用户角色: {snap.auth.user?.roles?.map((role: any) => role.name).join(', ') || '无'}</p>
      </Card>

      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="用户总数" value={snap.data.users.length} style={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="角色总数" value={snap.data.roles.length} style={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="文章总数" value={snap.data.articles.length} style={{ color: '#f5222d' }} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
