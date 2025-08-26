'use client'
import { Button } from '@arco-design/web-react'
import { BUS } from '@/app/page'
export default function Main() {
  return (
    <div>
      <div>
        <Button type="primary" onClick={async () => (BUS.count += 1)}>
          main-add_count: {BUS.count}
        </Button>
      </div>



      <div>

      </div>
    </div>
  )
}
