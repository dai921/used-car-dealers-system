'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Bell, ChevronDown, LayoutDashboard, Users, Package, TrendingUp, Settings, LogOut, Menu, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface User {
  id: string
  name: string
  role: string
}

const menuItems = [
  { icon: Users, label: '顧客管理', href: '/dashboard/customers' },
  { icon: Package, label: '在庫管理', href: '/dashboard/inventory' },
  { icon: TrendingUp, label: '営業ダッシュボード', href: '/dashboard/sales', disabled: true },
  { icon: LayoutDashboard, label: '営業管理', href: '/dashboard/management', disabled: true },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (!storedUser) {
      router.push('/login')
    } else {
      setUser(JSON.parse(storedUser))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

  const handleMenuClick = (href: string, disabled?: boolean) => {
    if (disabled) {
      alert('この機能は準備中です')
    } else {
      router.push(href)
      setSidebarOpen(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-muted/10">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 border-r bg-card transition-transform duration-300 lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">中古</span>
              </div>
              <span className="text-sm font-semibold">中古車販売管理システム</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Menu */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname?.startsWith(item.href)
              return (
                <button
                  key={item.href}
                  onClick={() => handleMenuClick(item.href, item.disabled)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    item.disabled && 'opacity-50'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                  {item.disabled && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      準備中
                    </Badge>
                  )}
                </button>
              )
            })}
            
            {user.role === 'admin' && (
              <>
                <div className="my-2 border-t" />
                <button
                  onClick={() => handleMenuClick('/dashboard/master', true)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground opacity-50 transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  マスタ管理
                  <Badge variant="secondary" className="ml-auto text-xs">
                    準備中
                  </Badge>
                </button>
              </>
            )}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-4 ml-auto">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden md:inline">{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem disabled>
                  <span className="text-xs text-muted-foreground">
                    {user.role === 'admin' ? '管理者' : '営業担当'}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  ログアウト
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/10 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
