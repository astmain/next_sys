'use client'
import { Card, Grid, Statistic, Button } from '@arco-design/web-react'
import { useSnapshot } from 'valtio'
import { BUS } from '@/app/page'
import { useEffect } from 'react'
import { axios_api } from '@/app/axios_api'

export default function Dashboard() {
  useSnapshot(BUS)

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h2>仪表盘</h2>

      <Card>
        <Button type="primary">技术文档</Button>
        <p>arco: https://arco.design/react/components/menu</p>
        <p>arco: https://arco.design/react/components/menu</p>
      </Card>

      <Card>
        <Button type="primary">用户信息</Button>
        <p>当前用户: {BUS.auth.user?.name || '未知'}</p>
        <p>用户角色: {BUS.auth.user?.roles?.map((role: any) => role.name).join(', ') || '无'}</p>
      </Card>

      <Card>
        <Button type="primary">统计数据</Button>
        <Grid.Row gutter={16}>
          <Grid.Col span={8}>
            <Card>
              <Statistic title="用户总数" value={BUS.data.users.length} style={{ color: '#1890ff' }} />
            </Card>
          </Grid.Col>
          <Grid.Col span={8}>
            <Card>
              <Statistic title="角色总数" value={BUS.data.roles.length} style={{ color: '#faad14' }} />
            </Card>
          </Grid.Col>
          <Grid.Col span={8}>
            <Card>
              <Statistic title="文章总数" value={BUS.data.articles.length} style={{ color: '#f5222d' }} />
            </Card>
          </Grid.Col>
        </Grid.Row>
      </Card>
      {/* 统计数据 */}
    </div>
  )
}
