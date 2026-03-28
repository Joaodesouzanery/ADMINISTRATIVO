import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-navy-700">{label}</label>}
    <input
      ref={ref}
      className={`border rounded-lg px-3 py-2 text-sm text-navy-800 placeholder-navy-300 outline-none transition-colors
        ${error ? 'border-red-400 focus:border-red-500' : 'border-navy-100 focus:border-cyan-400'}
        bg-white ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
))

Input.displayName = 'Input'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  children: React.ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, error, className = '', children, ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-navy-700">{label}</label>}
    <select
      ref={ref}
      className={`border rounded-lg px-3 py-2 text-sm text-navy-800 outline-none transition-colors
        ${error ? 'border-red-400' : 'border-navy-100 focus:border-cyan-400'}
        bg-white ${className}`}
      {...props}
    >
      {children}
    </select>
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
))

Select.displayName = 'Select'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-navy-700">{label}</label>}
    <textarea
      ref={ref}
      className={`border rounded-lg px-3 py-2 text-sm text-navy-800 placeholder-navy-300 outline-none transition-colors resize-none
        ${error ? 'border-red-400' : 'border-navy-100 focus:border-cyan-400'}
        bg-white ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
))

Textarea.displayName = 'Textarea'
