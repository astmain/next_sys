import { useState } from 'react'
import { Chat } from '@/types/chat'

import { AiOutlineEdit } from 'react-icons/ai'
import { MdCheck, MdClose, MdDeleteOutline } from 'react-icons/md'
import { PiChatBold, PiTrashBold } from 'react-icons/pi'

export function ChatList() {
  const [chatist, setChatist] = useState<Chat[]>([
    { id: '1', title: '依旧少年｜中国科学院院士、天文学家叶叔华：天文研究是一生的浪漫', updatedAt: Date.now() },
    { id: '2', title: '二十四节气｜处暑，出暑，走进收获的金秋', updatedAt: Date.now() },
    { id: '3', title: '财米油盐丨脑机接口，把科幻“接”入现实', updatedAt: Date.now() },
    { id: '4', title: '冰棍、雪糕、冰淇淋……解暑冰品怎么吃更健康？', updatedAt: Date.now() },
  ])

  const [selectedChat, setSelectedChat] = useState<Chat>()
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="flex-1 mt-2 flex flex-col">
      <ul>
        {chatist.map((item) => (
          <li key={item.id} className={`flex items-center p-1 space-x-3 cursor-pointer rounded-md hover:bg-gray-100 ${selectedChat?.id === item.id ? 'bg-gray-200' : ''}`} onClick={() => setSelectedChat(item)}>
            <div>
              <PiChatBold />
            </div>
            {selectedChat?.id === item.id && isEditing ? 
            <input className="flex-1 min-w-0 bg-transparent outline-none" autoFocus defaultValue={item.title} /> : <div className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis relative">{item.title}</div>}

            <div
              className=" hover:text-blue-500 pl-1"
              onClick={(e) => {
                console.log('edit')
                setIsEditing(true)
                e.stopPropagation()
              }}
            >
              <AiOutlineEdit />
            </div>
            <div className=" hover:text-blue-500 pl-1">
              <MdDeleteOutline />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
