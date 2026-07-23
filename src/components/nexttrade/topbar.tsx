'use client'

import { Menu, Search, Bell, LogOut, User, FileBarChart, Settings, TrendingUp, Star, Zap, WifiOff, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAppStore } from '@/lib/store'
import { useAuthStore } from '@/lib/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMarketDataStatus } from '@/hooks/use-market-data'
import { cn } from '@/lib/utils'

interface TopBarProps {
  userName?: string | null
  onLogout?: () => void
  userAvatar?: string | null
}

export function TopBar({ userName, onLogout, userAvatar }: TopBarProps) {
  const { setSidebarOpen, setCurrentPage, watchlistSidebarOpen, setWatchlistSidebarOpen } = useAppStore()
  const { user } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const avatar = userAvatar || user?.avatar
  const wsStatus = useMarketDataStatus()
  const isWsConnected = wsStatus === 'connected'

  return (
    <header
      className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center"
      style={{
        background: 'var(--card)',
        borderBottom: '1px solid var(--border)',
      }}
      role="banner"
    >
      <div className="flex h-full w-full items-center gap-3 px-4 md:px-6">
        {/* Left: Mobile menu + Logo */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted h-9 w-9 rounded-xl"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </Button>

        {/* Logo - Mobile only (desktop has sidebar) */}
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="flex items-center gap-2.5 shrink-0 md:hidden"
        >
          <div
            className="flex size-8 items-center justify-center rounded-xl"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              boxShadow: '0 2px 8px rgba(50, 60, 120, 0.25)',
            }}
          >
            <TrendingUp className="size-4 text-white" />
          </div>
          <span className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
            NEXTTRADE
          </span>
        </button>

        {/* Desktop: Page title area */}
        <div className="hidden md:flex items-center">
          <span className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
            Paper Trading Platform
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="relative hidden md:flex max-w-[260px] flex-1">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search stocks, indices..."
            className="pl-9 h-9 text-sm border-none focus-visible:ring-1 focus-visible:ring-primary/30 placeholder:text-muted-foreground"
            style={{
              background: 'var(--muted)',
              color: 'var(--foreground)',
              borderRadius: '10px',
            }}
          />
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1.5">
          {/* WebSocket Connection Status */}
          <div 
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all',
              isWsConnected 
                ? 'text-primary bg-primary/8' 
                : 'text-muted-foreground bg-muted'
            )}
            title={isWsConnected ? 'Real-time WebSocket connected' : 'WebSocket disconnected — using REST polling'}
          >
            {isWsConnected ? (
              <>
                <Zap className="size-3" />
                <span className="hidden sm:inline">LIVE</span>
              </>
            ) : (
              <>
                <WifiOff className="size-3" />
                <span className="hidden sm:inline">REST</span>
              </>
            )}
          </div>

          {/* Watchlist Toggle - Desktop only */}
          <Button
            variant="ghost"
            size="icon"
            className={`relative hidden md:flex shrink-0 h-9 w-9 rounded-xl transition-all duration-200 ${
              watchlistSidebarOpen
                ? 'text-primary bg-primary/10 hover:bg-primary/15'
                : 'text-muted-foreground hover:text-primary hover:bg-muted'
            }`}
            onClick={() => setWatchlistSidebarOpen(!watchlistSidebarOpen)}
            aria-label="Toggle watchlist sidebar"
            title="Watchlist"
          >
            <Star className={`size-[18px] ${watchlistSidebarOpen ? 'fill-primary' : ''}`} />
          </Button>

          {/* Dark/Light Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted h-9 w-9 rounded-xl transition-all duration-200"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="size-[18px] text-amber-400" />
            ) : (
              <Moon className="size-[18px]" />
            )}
          </Button>

          {/* Notification */}
          <Button
            variant="ghost"
            size="icon"
            className="relative shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted h-9 w-9 rounded-xl"
            aria-label="Notifications"
          >
            <Bell className="size-[18px]" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition-all duration-200 hover:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                aria-label="User menu"
              >
                <div
                  className="size-8 rounded-lg overflow-hidden flex items-center justify-center"
                  style={{ background: avatar ? 'transparent' : 'var(--muted)' }}
                >
                  {avatar ? (
                    <img src={avatar} alt="Profile" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <User className="size-4 text-muted-foreground" />
                  )}
                </div>
                <span className="hidden sm:inline text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  {userName || 'User'}
                </span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                borderRadius: '12px',
              }}
            >
              <DropdownMenuLabel>
                <div className="flex flex-col py-1">
                  <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                    {userName || 'User'}
                  </span>
                  <span className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>
                    Paper Trading Account
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator style={{ background: 'var(--border)' }} />
              <DropdownMenuItem
                onClick={() => setCurrentPage('profile')}
                className="cursor-pointer text-sm py-2.5 text-muted-foreground focus:text-foreground focus:bg-muted rounded-lg"
              >
                <Settings className="size-4 mr-2.5 text-muted-foreground" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setCurrentPage('reports')}
                className="cursor-pointer text-sm py-2.5 text-muted-foreground focus:text-foreground focus:bg-muted rounded-lg"
              >
                <FileBarChart className="size-4 mr-2.5 text-muted-foreground" />
                Reports
              </DropdownMenuItem>
              <DropdownMenuSeparator style={{ background: 'var(--border)' }} />
              <DropdownMenuItem
                onClick={onLogout}
                className="cursor-pointer text-sm py-2.5 text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg"
              >
                <LogOut className="size-4 mr-2.5" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
