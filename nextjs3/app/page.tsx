'use client'
import Main from '@/pages/Main'
import Navigation from '@/pages/Navigation'

import { MdLightMode, MdDarkMode, MdInfo } from 'react-icons/md' // 夜间模式图标

function Theme_button() {
  return (
    <button>
      <div
        className="text-red-500 absolute top-4 right-4 z-50"
        onClick={() => {
          const html = document.documentElement
          const curr_theme = localStorage.getItem('theme')
          console.log('当前主题', curr_theme)
          if (curr_theme === 'dark') {
            html.classList.add('dark')
            localStorage.setItem('theme', 'light')
          } else {
            html.classList.remove('dark')
            localStorage.setItem('theme', 'dark')
          }
        }}
      >
        夜间模式
      </div>
    </button>
  )
}

export default function Home() {
  return (
    <div className="flex h-full relative" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navigation />
      <Main />

      <Theme_button />
    </div>
  )
}
