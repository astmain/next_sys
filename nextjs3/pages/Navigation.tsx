'use client'
import Button from '@/componets/common/Button'
import { LuPanelLeft } from 'react-icons/lu'
import { HiPlus } from 'react-icons/hi'
import { useAppContext } from '@/componets/common/AppContext'
import { ChatList } from '@/pages/ChatList'
export default function Navigation() {
  const {
    state: { displayNavigation },
    setState,
  } = useAppContext()

  console.log('Navigation---rendered', displayNavigation)
  return (
    // <nav className="w-[260px] h-full border-r">
    <nav className={`w-[260px] h-full border-r p-2 ${displayNavigation ? 'block' : 'hidden'}`}>
      <div className="flex space-x-3">
        <Button icon={HiPlus} variant="outline" className="flex-1 line-height-1">
          新建对话
        </Button>

        <Button icon={LuPanelLeft} variant="icon" className="flex-1" onClick={() => setState({ displayNavigation: !displayNavigation })}></Button>
      </div>

      <div>
        <ChatList />
      </div>
    </nav>
  )
}
