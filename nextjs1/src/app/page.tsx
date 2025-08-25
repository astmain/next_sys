'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { useSnapshot, proxy } from 'valtio'

import Navig from '@/components/home/Navig'
import Main from '@/components/home/Main'

import { Button, Modal, Form, Input, Checkbox } from '@arco-design/web-react'
import '@arco-design/web-react/dist/css/arco.css'

// 创建 valtio 状态对象
export const state = proxy({
  counter: 0,
  visible: false,
  tel: '15160315110',
  password: '123456',
})

const FormItem = Form.Item
export default function Home() {
  const [counter, setCounter] = useState(0)
  // let counter = 1
  function click() {
    setCounter(counter + 1)
    setCounter((c) => c + 1)
    alert('点击' + counter)
  }

  // 使用 useSnapshot 获取状态的只读快照
  const snap = useSnapshot(state)

  function submit() {
    console.log('111-tel:', state.tel)
    console.log('222-password:', state.password)
  }

  return (
    <main className={`bg-green-500`}>
      <h1>Hello World</h1>

      {React.createElement('h1', { className: 'text-red-500' }, 'Hello React')}
      {React.createElement('h1', { className: 'text-red-500' }, '    http://localhost:3000/chat         ')}
      {React.createElement('h1', { className: 'text-red-500' }, '    https://github.com/pmndrs/valtio        ')}
      {React.createElement('h1', { className: 'text-red-500' }, '    https://arco.design/react/components/input        ')}

      <Navig />
      <Main counter={counter} />
      <button onClick={click}>点击</button>
      <button onClick={() => state.counter++}>点击valtio</button>
      <p>counter: {snap.counter}</p>
      <Button type="primary" onClick={() => state.counter++}>
        counter
      </Button>
      <Button type="primary" onClick={() => (state.visible = true)}>
        Modal
      </Button>

      <Button
        type="primary"
        onClick={() => {
          // fetch('http://127.0.0.1:3000/api/test')
          fetch('http://localhost:3000/api/test')
            .then((res) => res.json())
            .then((data) => {
              console.log('data:', data)
            })
        }}
      >
        api/test
      </Button>


{/* 我想在项目中是用prisma  数据库使用sqlite  数据表名 */}
  

      <Modal
        title="Modal Title" //
        visible={snap.visible}
        onCancel={() => (state.visible = false)}
        onOk={() => {
          state.visible = false
        }}
        autoFocus={false}
        focusLock={true}
      >
        <Form style={{ width: 300 }} autoComplete="off">
          <FormItem label="tel">
            <Input onChange={(value) => (state.tel = value)} />
          </FormItem>
          <FormItem label="password">
            <Input onChange={(value) => (state.password = value)} />
          </FormItem>
        </Form>

        {/* 为什么我Input修改了 但是下面state.tel没有变化 */}
        <div style={{ display: 'none' }}>tel: {snap.tel}</div>
        <div>tel: {state.tel}</div>

        <Button type="primary" onClick={submit}>
          Submit
        </Button>
      </Modal>
    </main>
  )
}
