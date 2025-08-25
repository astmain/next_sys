import { ComponentPropsWithoutRef } from 'react'
import { IconType } from 'react-icons'

type ButtonProps = {
  icon?: IconType
  variant?: 'default' | 'outline' | 'text' | 'ghost' | 'icon'
} & ComponentPropsWithoutRef<'button'>

export default function Button({ children, className = '', icon: Icon, variant = 'default', ...props }: ButtonProps) {
  // const my_base_css = ` inline-flex items-center justify-center gap-2          border border-gray-600 rounded px-3 py-1.5 hover:bg-gray-200 active:bg-gray-100`
  const my_base_css = `inline-flex items-center min-w-[38px] min-h-[38px]   max-h-[38px]    ${children ? '' : 'max-w-[38px] max-h-[38px]'}    border border-gray-600 rounded px-3 py-1.5 hover:bg-gray-200 active:bg-gray-100`
  return (
    <button className={`${my_base_css} ${className}`} {...props}>
      {Icon && <Icon className={`text-lg ${children ? 'mr-1' : ''}`} />}
      {children}
    </button>
  )
}
