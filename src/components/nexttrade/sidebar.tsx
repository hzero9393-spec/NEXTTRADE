'use client'

import {
  LayoutDashboard,
  CandlestickChart,
  Crosshair,
  FileText,
  Wallet,
  BarChart3,
  GraduationCap,
  LogOut,
  TrendingUp,
  Settings,
  Crown,
  Lock,
  ChevronRight,
  Star,
  GitBranch,
} from 'lucide-react'
import { useAppStore, type PageId } from '@/lib/store'
import { useAuthStore } from '@/lib/auth-store'
import { PLAN_LIMITS, type SubscriptionPlan } from '@/lib/subscription/constants'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { usePathname } from 'next/navigation'

interface NavItem {
  id: PageId
  label: string
  icon: React.ComponentType<{ className?: string }>
  group: 'trade' | 'manage' | 'learn' | 'plan'
  requiredFeature?: string
  requiredPlan?: SubscriptionPlan
  url: string
}

const navItems: NavItem[] = [
  // Trade group
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard, group: 'trade', url: '/' },
  { id: 'trading', label: 'Stocks', icon: CandlestickChart, group: 'trade', url: '/stocks' },
  { id: 'watchlist', label: 'Watchlist', icon: Star, group: 'trade', url: '/watchlist' },
  { id: 'futures', label: 'Futures', icon: TrendingUp, group: 'trade', requiredFeature: 'futuresAccess', requiredPlan: 'PRO', url: '/futures' },
  { id: 'optionChain', label: 'Option Chain', icon: GitBranch, group: 'trade', url: '/option-chain' },
  // Manage group
  { id: 'positions', label: 'Positions', icon: Crosshair, group: 'manage', url: '/positions' },
  { id: 'orders', label: 'Orders', icon: FileText, group: 'manage', url: '/orders' },
  { id: 'portfolio', label: 'Portfolio', icon: Wallet, group: 'manage', url: '/portfolio' },
  { id: 'reports', label: 'Reports', icon: BarChart3, group: 'manage', url: '/reports' },
  // Learn group
  { id: 'learning', label: 'Learn', icon: GraduationCap, group: 'learn', url: '/learning' },
  // Plan group
  { id: 'pricing', label: 'Pricing', icon: Crown, group: 'plan', url: '/pricing' },
]

const groupLabels: Record<string, string> = {
  trade: 'Trade',
  manage: 'Manage',
  learn: 'Learn',
  plan: 'Plan',
}

function hasFeatureAccess(userPlan: SubscriptionPlan, feature?: string, requiredPlan?: SubscriptionPlan): boolean {
  if (!feature && !requiredPlan) return true
  if (requiredPlan) {
    const planHierarchy: SubscriptionPlan[] = ['FREE', 'PRO', 'PREMIUM']
    return planHierarchy.indexOf(userPlan) >= planHierarchy.indexOf(requiredPlan)
  }
  if (feature) {
    const limits = PLAN_LIMITS[userPlan]
    const value = (limits as Record<string, unknown>)[feature]
    if (typeof value === 'boolean') return value
    if (typeof value === 'number') return value !== 0
    if (Array.isArray(value)) return value.length > 0
  }
  return true
}

interface SidebarProps {
  onLogout?: () => void
  userName?: string | null
  userEmail?: string | null
  userRole?: string | null
  userAvatar?: string | null
  variant?: 'desktop' | 'mobile'
}

export function Sidebar({ onLogout, userName, userAvatar, variant = 'desktop' }: SidebarProps) {
  const { setCurrentPage, currentPage } = useAppStore()
  const { user } = useAuthStore()
  const pathname = usePathname()
  const userPlan = (user?.subscription as SubscriptionPlan) || 'FREE'

  const avatar = userAvatar || user?.avatar
  const initials = userName
    ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'TP'

  // Determine if a nav item is active based on URL
  const isActive = (item: NavItem) => {
    if (item.id === 'dashboard') {
      return pathname === '/'
    }
    if (item.id === 'trading' && (pathname.startsWith('/stock/') || pathname.startsWith('/index/'))) {
      return true
    }
    if (item.id === 'trading' && pathname === '/stocks') {
      return true
    }
    if (item.url && (pathname === item.url || (item.id === 'positions' && pathname.startsWith('/positions')))) {
      return true
    }
    return false
  }

  // Group items
  const grouped = navItems.reduce<Record<string, NavItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {})

  return (
    <aside
      className={cn(
        'h-screen w-[240px] flex-col',
        variant === 'desktop' ? 'fixed left-0 top-0 z-40 hidden md:flex' : 'flex',
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div
        className="flex h-full flex-col"
        style={{
          background: 'var(--card)',
          borderRight: '1px solid var(--border)',
        }}
      >
        {/* Logo Area */}
        <div className="flex items-center gap-3 px-6 py-5">
          <button onClick={() => { setCurrentPage('dashboard') }} className="flex items-center gap-3 group">
            <div
              className="flex size-9 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                boxShadow: '0 2px 8px rgba(50, 60, 120, 0.25)',
              }}
            >
              <TrendingUp className="size-[18px] text-white" />
            </div>
            <div>
              <h1
                className="text-[15px] font-bold tracking-tight"
                style={{ color: 'var(--foreground)' }}
              >
                NEXTTRADE
              </h1>
              <p
                className="text-[9px] font-semibold tracking-widest uppercase"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Master Indian Markets
              </p>
            </div>
          </button>
        </div>

        {/* Separator */}
        <div className="mx-5 h-px" style={{ background: 'var(--border)' }} />

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4 sidebar-scrollbar">
          <nav className="flex flex-col gap-5">
            {Object.entries(grouped).map(([group, items]) => (
              <div key={group}>
                <p
                  className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.12em]"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {groupLabels[group] || group}
                </p>
                <div className="flex flex-col gap-0.5">
                  {items.map((item) => {
                    const active = isActive(item)
                    const Icon = item.icon
                    const isLocked = !hasFeatureAccess(userPlan, item.requiredFeature, item.requiredPlan)
                    const requiredPlanName = item.requiredPlan || (item.requiredFeature?.toLowerCase().includes('option') ? 'PREMIUM' : 'PRO')

                    return (
                      <button
                        key={item.id}
                        onClick={() => setCurrentPage(item.id)}
                        className={cn(
                          'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 outline-none',
                          'focus-visible:ring-2 focus-visible:ring-primary/20',
                          isLocked && !active && 'opacity-60',
                          !active && 'hover:bg-muted',
                        )}
                        style={{
                          background: active ? 'linear-gradient(135deg, rgba(50,60,120,0.12) 0%, rgba(80,70,150,0.08) 100%)' : 'transparent',
                          color: active ? 'var(--primary)' : 'var(--sidebar-foreground)',
                        }}
                        aria-current={active ? 'page' : undefined}
                      >
                        {/* Active indicator bar */}
                        {active && (
                          <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full"
                            style={{
                              background: 'linear-gradient(180deg, var(--primary), var(--secondary))',
                            }}
                          />
                        )}

                        <div
                          className={cn(
                            'flex size-8 items-center justify-center rounded-lg transition-all duration-200',
                            active ? 'bg-primary/10' : 'group-hover:bg-muted',
                          )}
                        >
                          <Icon
                            className="size-[16px] shrink-0 transition-colors duration-200"
                            style={{ color: active ? 'var(--primary)' : 'var(--muted-foreground)' }}
                          />
                        </div>

                        <span className={cn('transition-colors duration-200', active && 'font-semibold')}>
                          {item.label}
                        </span>

                        {isLocked && !active && (
                          <span className="ml-auto text-[8px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-0.5">
                            <Lock className="size-2.5" />
                            {requiredPlanName}
                          </span>
                        )}

                        {item.id === 'pricing' && userPlan === 'FREE' && !active && !isLocked && (
                          <span className="ml-auto text-[8px] font-bold px-2 py-0.5 rounded-md text-white" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
                            UPGRADE
                          </span>
                        )}

                        {!active && !isLocked && item.id !== 'pricing' && (
                          <ChevronRight className="ml-auto size-3 text-transparent group-hover:text-muted-foreground transition-colors duration-200" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Bottom Section */}
        <div className="px-3 py-3" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
          <button
            onClick={() => setCurrentPage('profile')}
            className={cn(
              'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 outline-none w-full',
              currentPage === 'profile' ? '' : 'hover:bg-muted',
              'focus-visible:ring-2 focus-visible:ring-primary/20',
            )}
            style={{
              background: currentPage === 'profile' ? 'linear-gradient(135deg, rgba(50,60,120,0.12) 0%, rgba(80,70,150,0.08) 100%)' : 'transparent',
              color: currentPage === 'profile' ? 'var(--primary)' : 'var(--sidebar-foreground)',
            }}
          >
            {currentPage === 'profile' && (
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full"
                style={{ background: 'linear-gradient(180deg, var(--primary), var(--secondary))' }}
              />
            )}
            <div className={cn(
              'flex size-8 items-center justify-center rounded-lg overflow-hidden transition-all duration-200',
              currentPage === 'profile' ? 'bg-primary/10' : 'group-hover:bg-muted',
            )}>
              {avatar ? (
                <img src={avatar} alt="Profile" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Settings className="size-[16px] shrink-0" style={{ color: currentPage === 'profile' ? 'var(--primary)' : 'var(--muted-foreground)' }} />
              )}
            </div>
            <span className={currentPage === 'profile' ? 'font-semibold' : ''}>Settings</span>
            <ChevronRight className="ml-auto size-3 text-transparent group-hover:text-muted-foreground transition-colors duration-200" />
          </button>

          <button
            onClick={onLogout}
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 outline-none w-full hover:bg-red-50/80"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <div className="flex size-8 items-center justify-center rounded-lg transition-all duration-200 group-hover:bg-red-100/80">
              <LogOut className="size-[16px] shrink-0 text-muted-foreground group-hover:text-[#ef4444] transition-colors duration-200" />
            </div>
            <span className="group-hover:text-[#ef4444] transition-colors duration-200">Sign Out</span>
          </button>
        </div>
      </div>

      <style jsx global>{`
        .sidebar-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 10px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--muted-foreground);
        }
      `}</style>
    </aside>
  )
}
