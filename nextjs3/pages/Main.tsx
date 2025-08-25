'use client'
import { useAppContext } from '@/componets/common/AppContext'
import { LuPanelLeft } from 'react-icons/lu'
import Button from '@/componets/common/Button'
import { Welcome } from './Welcome'

function Button1() {
  const {
    state: { displayNavigation },
    setState,
  } = useAppContext()
  return (
    <Button className={`${displayNavigation ? 'hidden' : 'block'}`} onClick={() => setState({ displayNavigation: !displayNavigation })}>
      <LuPanelLeft />
    </Button>
  )
}

export default function Main() {
  return (
    <main className="flex-1 p-2 dark">
      <Button1 />
      {/* <h1 className="text-2xl font-bold ">主体内容</h1>
      <p className="dark:text-red-500">这是一个简单的夜间模式测试页面</p>
      <p className="dark:text-red-500">这是一个简单的夜间模式测试页面</p>
      <p className="dark:text-red-500">这是一个简单的夜间模式测试页面</p> */}
      <Welcome />
    </main>
  )
}
