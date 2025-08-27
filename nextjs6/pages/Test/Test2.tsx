'use client'

import { BUS } from '@/app/page'
import { useSnapshot } from 'valtio'
import { Button } from '@arco-design/web-react'
export default function Test2() {
  useSnapshot(BUS)

  return (
    <div>
      <h1>Test2</h1>
      <Button
        type="primary"
        onClick={() => {
          BUS.count++
        }}
      >
        Primary
      </Button>
      <div>{JSON.stringify(BUS)}</div>

      <Button
        type="primary"
        onClick={() => {
          BUS.auth.token = ''
        }}
      >
        Primary
      </Button>
    </div>
  )
}
