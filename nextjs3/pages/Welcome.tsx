import { useState } from 'react'
import { PiLightningFill, PiShootingStarFill } from 'react-icons/pi'

export function Welcome() {
  const [input_value, set_input_value] = useState('')

  const models = [
    {
      id: 'gpt-4.0-turbo',
      name: 'GPT-4',
      description: 'GPT-4 is a chatbot that can help you with your questions.',
      icon: <PiLightningFill />,
    },
    {
      id: 'gpt-5.0-test',
      name: 'GPT-5',
      description: 'GPT-5 is a chatbot that can help you with your questions.',
      icon: <PiShootingStarFill />,
    },
  ]

  const handle_key_down = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      // Enter 键直接换行，不做任何阻止
      return
    }
  }

  // ✅发送消息
  const handle_send = () => {
    if (input_value.trim()) {
      // 这里可以添加发送消息的逻辑
      console.log('发送消息:', input_value)
      set_input_value('')//清空输入框

      // 恢复输入框高度
      const textarea = document.querySelector('textarea')
      if (textarea) {
        textarea.style.height = '44px' // 恢复到 min-h-[44px] 的高度
      }
    }
  }

  const handle_input_change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    set_input_value(value)

    // 自动调整高度
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px' // 128px = max-h-32
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center px-4 py-20">
      <div className=" flex bg-gray-100  p-2 rounded-lg">
        {models.map((model) => {
          return (
            <button key={model.id} className="flex items-center justify-center space-x-2 py-2.5 min-w-[148px] text-sm font-medium border rounded-lg">
              <span className="text-sm text-gray-500">{model.icon}</span>
              <span className="text-sm text-gray-500">{model.name}</span>
              {/* <span className="text-sm text-gray-500">{model.description}</span>   */}
            </button>
          )
        })}
      </div>

      {/* 帮我写一个输入框  输入框在左边 发送在右边  ,当我按下回车时 换行*/}
      <div className="w-full max-w-2xl mt-8 flex items-start space-x-3">
        <textarea value={input_value} onChange={handle_input_change} onKeyDown={handle_key_down} placeholder="请输入您的问题... (Enter换行)" className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[44px] max-h-32 overflow-hidden" rows={1} />
        <button onClick={handle_send} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
          <span className="text-sm font-medium">发送</span>
        </button>
      </div>
    </div>
  )
}
