'use client'
import { useSnapshot } from 'valtio'
import { BUS } from '@/app/page'
import { Button } from '@arco-design/web-react'
export default function Test1() {
  useSnapshot(BUS)
  return (
    <div>
      <h1>Test1</h1>
      <Button
        type="primary"
        onClick={() => {
          BUS.count++
        }}
      >
        Primary
      </Button>

      <div>{JSON.stringify(BUS)}</div>






      
    </div>
  )
}
