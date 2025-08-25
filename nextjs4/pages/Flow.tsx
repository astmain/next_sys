'use client'

import React, { useEffect, useCallback, useMemo } from 'react'
import ReactFlow, { Node, Edge, Connection, addEdge, useNodesState, useEdgesState, Controls, MiniMap, Background, Handle, Position } from 'reactflow'
import 'reactflow/dist/style.css'
import axios from 'axios'
import { proxy, useSnapshot } from 'valtio'

// 类型定义
interface WorkflowNodeData {
  label: string
  employee?: string
  assignee?: string
  status?: string
}

interface LeaveRequest {
  id: number
  employee_id: number
  employee_name: string
  leave_days: number
  reason: string
  status: string
  supervisor_approved: boolean
  ceo_approved: boolean
  created_at: string
}

// 全局状态管理
const state = proxy({
  leave_requests: [] as LeaveRequest[],
  selected_request: null as LeaveRequest | null,
  form_data: {
    employee_id: 3,
    employee_name: '张三',
    leave_days: 1,
    reason: '',
  },
  workflow_window: {
    is_open: false,
    is_minimized: false,
    position: { x: 50, y: 50 },
    size: { width: 900, height: 800 },
    is_dragging: false,
    is_resizing: false,
    drag_offset: { x: 0, y: 0 },
    resize_start: { x: 0, y: 0, width: 0, height: 0 },
  }
})

// 将nodeTypes定义在组件外部，避免重新创建
const nodeTypes = {
  start: ({ data }: { data: WorkflowNodeData }) => (
    <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 min-w-[200px] relative">
      <div className="font-bold text-green-800">{data.label}</div>
      <div className="text-sm text-green-600 mt-1">{data.employee}</div>
      {/* 使用React Flow的Handle组件 */}
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500" />
    </div>
  ),
  approval: ({ data }: { data: WorkflowNodeData }) => (
    <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 min-w-[200px] relative">
      <div className="font-bold text-blue-800">{data.label}</div>
      <div className="text-sm text-blue-600 mt-1">{data.assignee}</div>
      <div className="text-xs text-blue-500 mt-1">{data.status}</div>
      {/* 使用React Flow的Handle组件 */}
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />
    </div>
  ),
  end: ({ data }: { data: WorkflowNodeData }) => (
    <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 min-w-[200px] relative">
      <div className="font-bold text-red-800">{data.label}</div>
      <div className="text-sm text-red-600 mt-1">{data.status}</div>
      {/* 使用React Flow的Handle组件 */}
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-red-500" />
    </div>
  ),
}

export default function Flow() {
  const snap = useSnapshot(state)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // 获取请假申请列表
  const fetch_leave_requests = async () => {
    try {
      const response = await axios.get('/api/flow/leave-requests')
      state.leave_requests = response.data
    } catch (error) {
      console.error('获取请假申请失败:', error)
    }
  }

  // 提交请假申请
  const submit_leave_request = async () => {
    try {
      const response = await axios.post('/api/flow/leave-request', snap.form_data)
      if (response.data.success) {
        alert('请假申请提交成功！')
        state.form_data = {
          employee_id: 3,
          employee_name: '张三',
          leave_days: 1,
          reason: '',
        }
        fetch_leave_requests()
      }
    } catch (error) {
      console.error('提交请假申请失败:', error)
      alert('提交失败，请重试')
    }
  }

  // 审批请假申请
  const approve_leave_request = async (request_id: number, action: string) => {
    try {
      const response = await axios.post('/api/flow/approve', {
        request_id,
        action,
      })
      if (response.data.success) {
        alert('审批操作成功！')
        fetch_leave_requests()
        if (snap.selected_request && snap.selected_request.id === request_id) {
          state.selected_request = response.data.updated_request
        }
      }
    } catch (error) {
      console.error('审批失败:', error)
      alert('审批失败，请重试')
    }
  }

  // 创建工作流图 - 使用useMemo优化，阶梯式布局从高到低
  const create_workflow = useCallback(
    (request: LeaveRequest) => {
      const is_simple_flow = request.leave_days <= 3

      // 阶梯式布局：从高到低，从左到右
      const workflow_nodes: Node<WorkflowNodeData>[] = [
        {
          id: 'start',
          type: 'start',
          position: { x: 100, y: 50 }, // 最高位置
          data: { label: '开始', employee: request.employee_name },
        },
        {
          id: 'supervisor',
          type: 'approval',
          position: { x: 400, y: 150 }, // 第二层
          data: {
            label: '主管审批',
            assignee: '李四',
            status: request.supervisor_approved ? '已批准' : '待审批',
          },
        },
      ]

      // 创建边，使用阶梯式连接
      const workflow_edges: Edge[] = [
        {
          id: 'start-supervisor',
          source: 'start',
          target: 'supervisor',
          type: 'smoothstep',
          style: { stroke: '#3b82f6', strokeWidth: 3 },
          animated: true,
        },
      ]

      if (!is_simple_flow) {
        workflow_nodes.push({
          id: 'ceo',
          type: 'approval',
          position: { x: 700, y: 250 }, // 第三层
          data: {
            label: '董事长审批',
            assignee: '王五',
            status: request.ceo_approved ? '已批准' : '待审批',
          },
        })

        workflow_edges.push({
          id: 'supervisor-ceo',
          source: 'supervisor',
          target: 'ceo',
          type: 'smoothstep',
          style: { stroke: '#3b82f6', strokeWidth: 3 },
          animated: true,
        })
      }

      const end_node: Node<WorkflowNodeData> = {
        id: 'end',
        type: 'end',
        position: {
          x: is_simple_flow ? 700 : 1000,
          y: is_simple_flow ? 250 : 350, // 最低位置
        },
        data: {
          label: '结束',
          status: request.status === 'approved' ? '已批准' : '待审批',
        },
      }

      workflow_nodes.push(end_node)

      // 根据流程类型添加正确的边
      const final_edge: Edge = {
        id: is_simple_flow ? 'supervisor-end' : 'ceo-end',
        source: is_simple_flow ? 'supervisor' : 'ceo',
        target: 'end',
        type: 'smoothstep',
        style: { stroke: '#3b82f6', strokeWidth: 3 },
        animated: true,
      }

      workflow_edges.push(final_edge)

      setNodes(workflow_nodes)
      setEdges(workflow_edges)
    },
    [setNodes, setEdges]
  )

  // 选择请假申请
  const select_request = (request: LeaveRequest) => {
    state.selected_request = request
    create_workflow(request)
    // 自动打开工作流窗口
    state.workflow_window.is_open = true
    state.workflow_window.is_minimized = false
  }

  useEffect(() => {
    fetch_leave_requests()
  }, [])

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  // 浮动窗口事件处理
  const handle_mouse_down = (e: React.MouseEvent, type: 'drag' | 'resize') => {
    e.preventDefault()
    if (type === 'drag') {
      state.workflow_window.is_dragging = true
      state.workflow_window.drag_offset = {
        x: e.clientX - snap.workflow_window.position.x,
        y: e.clientY - snap.workflow_window.position.y,
      }
    } else if (type === 'resize') {
      state.workflow_window.is_resizing = true
      state.workflow_window.resize_start = {
        x: e.clientX,
        y: e.clientY,
        width: snap.workflow_window.size.width,
        height: snap.workflow_window.size.height,
      }
    }
  }

  useEffect(() => {
    const handle_mouse_move = (e: MouseEvent) => {
      if (state.workflow_window.is_dragging) {
        state.workflow_window.position = {
          x: e.clientX - state.workflow_window.drag_offset.x,
          y: e.clientY - state.workflow_window.drag_offset.y,
        }
      } else if (state.workflow_window.is_resizing) {
        state.workflow_window.size = {
          width: Math.max(400, state.workflow_window.resize_start.width + (e.clientX - state.workflow_window.resize_start.x)),
          height: Math.max(300, state.workflow_window.resize_start.height + (e.clientY - state.workflow_window.resize_start.y)),
        }
      }
    }

    const handle_mouse_up = () => {
      state.workflow_window.is_dragging = false
      state.workflow_window.is_resizing = false
    }

    if (state.workflow_window.is_dragging || state.workflow_window.is_resizing) {
      document.addEventListener('mousemove', handle_mouse_move)
      document.addEventListener('mouseup', handle_mouse_up)
    }

    return () => {
      document.removeEventListener('mousemove', handle_mouse_move)
      document.removeEventListener('mouseup', handle_mouse_up)
    }
  }, [snap.workflow_window.is_dragging, snap.workflow_window.is_resizing])

  // 使用useMemo优化ReactFlow组件，避免重新创建
  const reactFlowComponent = useMemo(
    () => (
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} nodeTypes={nodeTypes} fitView className="bg-gray-50">
        <Controls />
        <MiniMap />
        <Background />
      </ReactFlow>
    ),
    [nodes, edges, onNodesChange, onEdgesChange, onConnect]
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">请假申请工作流系统</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：请假申请表单 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">提交请假申请</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">员工姓名</label>
                <input type="text" value={snap.form_data.employee_name} onChange={(e) => { state.form_data.employee_name = e.target.value }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">请假天数</label>
                <input type="number" value={snap.form_data.leave_days} onChange={(e) => { state.form_data.leave_days = parseInt(e.target.value) }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" min="1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">请假原因</label>
                <textarea value={snap.form_data.reason} onChange={(e) => { state.form_data.reason = e.target.value }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder="请输入请假原因..." />
              </div>
              <button onClick={submit_leave_request} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                提交申请
              </button>
            </div>
          </div>

          {/* 右侧：请假申请列表 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">请假申请列表</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {snap.leave_requests.map((request: LeaveRequest) => (
                <div key={request.id} onClick={() => select_request(request)} className={`p-3 border rounded-lg cursor-pointer transition-colors ${snap.selected_request?.id === request.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{request.employee_name}</div>
                      <div className="text-sm text-gray-600">
                        {request.leave_days}天 - {request.reason}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">状态: {request.status}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{new Date(request.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {/* 审批按钮 */}
                  {request.status === 'pending' && (
                    <div className="mt-3 flex gap-2">
                      {!request.supervisor_approved && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              approve_leave_request(request.id, 'supervisor_approve')
                            }}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                          >
                            主管批准
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              approve_leave_request(request.id, 'supervisor_reject')
                            }}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                          >
                            主管拒绝
                          </button>
                        </>
                      )}
                      {request.supervisor_approved && !request.ceo_approved && request.leave_days > 3 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              approve_leave_request(request.id, 'ceo_approve')
                            }}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                          >
                            CEO批准
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              approve_leave_request(request.id, 'ceo_reject')
                            }}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                          >
                            CEO拒绝
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 浮动工作流窗口 */}
        {snap.workflow_window.is_open && (
          <div
            className={`fixed bg-white rounded-lg shadow-2xl border-2 border-gray-300 z-50 ${snap.workflow_window.is_minimized ? 'w-64 h-16' : ''}`}
            style={{
              left: snap.workflow_window.position.x,
              top: snap.workflow_window.position.y,
              width: snap.workflow_window.is_minimized ? 256 : snap.workflow_window.size.width,
              height: snap.workflow_window.is_minimized ? 64 : snap.workflow_window.size.height,
            }}
          >
            {/* 窗口标题栏 */}
            <div className="bg-blue-600 text-white px-4 py-2 rounded-t-lg cursor-move flex items-center justify-between" onMouseDown={(e) => handle_mouse_down(e, 'drag')}>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">工作流图</span>
                {snap.workflow_window.is_minimized && <span className="text-xs opacity-75">点击展开</span>}
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => { state.workflow_window.is_minimized = !snap.workflow_window.is_minimized }} className="w-6 h-6 flex items-center justify-center hover:bg-blue-700 rounded">
                  {snap.workflow_window.is_minimized ? '□' : '−'}
                </button>
                <button onClick={() => { state.workflow_window.is_open = false }} className="w-6 h-6 flex items-center justify-center hover:bg-red-600 rounded">
                  ×
                </button>
              </div>
            </div>

            {/* 窗口内容 */}
            {!snap.workflow_window.is_minimized && (
              <>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">工作流状态</h3>
                    <button onClick={fetch_leave_requests} className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                      刷新数据
                    </button>
                  </div>
                </div>

                {/* 工作流图容器 - 明确设置尺寸 */}
                <div className="px-4 pb-4" style={{ height: snap.workflow_window.size.height - 120 }}>
                  <div className="w-full h-full border border-gray-200 rounded-lg">{reactFlowComponent}</div>
                </div>
              </>
            )}

            {/* 调整大小句柄 */}
            {!snap.workflow_window.is_minimized && (
              <div className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize bg-gray-300 hover:bg-gray-400 rounded-bl-lg" onMouseDown={(e) => handle_mouse_down(e, 'resize')}>
                <div className="w-full h-full flex items-end justify-end p-1">
                  <div className="w-3 h-3 border-r-2 border-b-2 border-gray-600"></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 浮动窗口句柄 */}
        {!snap.workflow_window.is_open && (
          <div className="fixed bottom-6 right-6 z-40">
            <button onClick={() => { state.workflow_window.is_open = true; state.workflow_window.is_minimized = false }} className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center" title="打开工作流图">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
