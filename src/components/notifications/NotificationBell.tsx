import { useState, useRef, useEffect } from 'react'
import { Bell, Check, CheckCheck, X } from 'lucide-react'
import { useNotificationStore } from '../../store/notificationStore'
import type { ProductKey } from '../../types'

interface NotificationBellProps {
  product: ProductKey
}

export function NotificationBell({ product }: NotificationBellProps) {
  const notifications = useNotificationStore((s) => s.notifications[product])
  const markAsRead = useNotificationStore((s) => s.markAsRead)
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead)
  const deleteNotification = useNotificationStore((s) => s.deleteNotification)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const typeIcon: Record<string, string> = {
    task_deadline: '⏰',
    planning_deadline: '📋',
    general: '🔔',
  }

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'agora'
    if (mins < 60) return `${mins}min`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h`
    return `${Math.floor(hours / 24)}d`
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-navy-400 hover:text-navy-800 hover:bg-surface transition-colors"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-modal border border-cyan-100/50 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-navy-50">
            <h3 className="text-sm font-semibold text-navy-800">Notificações</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead(product)}
                className="text-xs text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
              >
                <CheckCheck size={12} /> Marcar todas como lidas
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <div className="py-8 text-center text-navy-400 text-sm">
                Nenhuma notificação.
              </div>
            )}
            {notifications.slice(0, 20).map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-4 py-3 border-b border-navy-50/50 hover:bg-surface/50 transition-colors ${!n.read ? 'bg-cyan-50/30' : ''}`}
              >
                <span className="text-base mt-0.5 shrink-0">{typeIcon[n.type] ?? '🔔'}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs ${n.read ? 'text-navy-500' : 'text-navy-800 font-medium'}`}>{n.title}</p>
                  <p className="text-xs text-navy-400 mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-navy-300 mt-1">{timeAgo(n.createdAt)}</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  {!n.read && (
                    <button onClick={() => markAsRead(n.id, product)} className="p-1 rounded text-navy-300 hover:text-cyan-600">
                      <Check size={12} />
                    </button>
                  )}
                  <button onClick={() => deleteNotification(n.id, product)} className="p-1 rounded text-navy-300 hover:text-red-500">
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
