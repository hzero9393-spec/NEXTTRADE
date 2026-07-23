'use client'

import { useEffect, useCallback } from 'react'
import { useAppStore, parseUrlPath } from '@/lib/store'
import { useAuthStore } from '@/lib/auth-store'
import { AuthPage } from '@/components/nexttrade/auth-page'
import { Sidebar } from '@/components/nexttrade/sidebar'
import { TopBar } from '@/components/nexttrade/topbar'
import { MobileNav } from '@/components/nexttrade/mobile-nav'
import { DashboardPage } from '@/components/nexttrade/pages/dashboard-page'
import { TradingPage } from '@/components/nexttrade/pages/trading-page'
import PortfolioPage from '@/components/nexttrade/pages/portfolio-page'
import { OrdersPage } from '@/components/nexttrade/pages/orders-page'
import { PositionsPage } from '@/components/nexttrade/pages/positions-page'
import { ReportsPage } from '@/components/nexttrade/pages/reports-page'
import { ProfilePage } from '@/components/nexttrade/pages/profile-page'
import { StockOverviewPage } from '@/components/nexttrade/pages/stock-overview-page'
import { IndexDetailPage } from '@/components/nexttrade/pages/index-detail-page'
import { OptionChainPage } from '@/components/nexttrade/pages/option-chain-page'
import { FuturesPage } from '@/components/nexttrade/pages/futures-page'
import { LearningPage } from '@/components/nexttrade/pages/learning-page'
import { WatchlistPage } from '@/components/nexttrade/pages/watchlist-page'
import { WatchlistSidebar } from '@/components/nexttrade/watchlist-sidebar'
import { ActiveDevicesPage } from '@/components/nexttrade/pages/active-devices-page'
import { HelpSupportPage } from '@/components/nexttrade/pages/help-support-page'
import { IndexTicker } from '@/components/nexttrade/index-ticker'
import { TradeSuccessProvider } from '@/components/nexttrade/trade-success-popup'
import { Footer } from '@/components/nexttrade/footer'
import {
  PrivacyPolicyPage,
  TermsOfServicePage,
  SupportPage,
  ContactUsPage,
  FAQPage,
  DisclaimerPage,
  AboutUsPage,
  RefundPolicyPage,
} from '@/components/nexttrade/footer-pages'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { TrendingUp } from 'lucide-react'
import { GlobalSLMonitor } from '@/components/nexttrade/global-sl-monitor'
import { MobileSwipeNavigator } from '@/components/nexttrade/mobile-swipe-navigator'
import { useNexttradeWS } from '@/hooks/use-nexttrade-ws'

// Footer page IDs — these pages show their own footer-free layout
const FOOTER_PAGES = new Set([
  'privacy-policy',
  'terms-of-service',
  'support',
  'contact-us',
  'faq',
  'disclaimer',
  'about-us',
  'refund-policy',
])

function PageContent({ page }: { page: string }) {
  switch (page) {
    case 'dashboard':
      return <DashboardPage />
    case 'trading':
      return <TradingPage />
    case 'stockOverview':
      return <StockOverviewPage />
    case 'positions':
      return <PositionsPage />
    case 'orders':
      return <OrdersPage />
    case 'portfolio':
      return <PortfolioPage />
    case 'reports':
      return <ReportsPage />
    case 'indexDetail':
      return <IndexDetailPage />
    case 'optionChain':
      return <OptionChainPage />
    case 'futures':
      return <FuturesPage />
    case 'learning':
      return <LearningPage />
    case 'watchlist':
      return <WatchlistPage />
    case 'profile':
      return <ProfilePage />
    case 'activeDevices':
      return <ActiveDevicesPage />
    case 'helpSupport':
      return <HelpSupportPage />
    // Footer pages
    case 'privacy-policy':
      return <PrivacyPolicyPage />
    case 'terms-of-service':
      return <TermsOfServicePage />
    case 'support':
      return <SupportPage />
    case 'contact-us':
      return <ContactUsPage />
    case 'faq':
      return <FAQPage />
    case 'disclaimer':
      return <DisclaimerPage />
    case 'about-us':
      return <AboutUsPage />
    case 'refund-policy':
      return <RefundPolicyPage />
    default:
      return <DashboardPage />
  }
}

function LoadingScreen() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--background)' }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="flex size-14 items-center justify-center rounded-2xl animate-pulse"
          style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            color: '#ffffff',
          }}
        >
          <TrendingUp className="size-7" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>NEXTTRADE</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Loading your trading desk...
          </p>
        </div>
        <div className="flex gap-1.5 mt-2">
          <div
            className="size-2 rounded-full animate-bounce"
            style={{ background: 'var(--primary)', animationDelay: '0ms' }}
          />
          <div
            className="size-2 rounded-full animate-bounce"
            style={{ background: 'var(--primary)', animationDelay: '150ms' }}
          />
          <div
            className="size-2 rounded-full animate-bounce"
            style={{ background: 'var(--primary)', animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  )
}

export function AppShell() {
  const { currentPage, sidebarOpen, setSidebarOpen, watchlistSidebarOpen, initFromUrl } = useAppStore()
  const { isAuthenticated, isInitializing, initialize, logout, user, token, setAuth } = useAuthStore()

  // WebSocket connection — connects when user logs in, disconnects on logout
  useNexttradeWS()

  // Handle OAuth callback token from URL
  const handleOAuthCallback = useCallback(async () => {
    const params = new URLSearchParams(window.location.search)
    const authToken = params.get('auth_token')

    if (authToken) {
      try {
        // Verify token with backend and get user data
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${authToken}` },
        })

        if (response.ok) {
          const data = await response.json()
          setAuth(data.user, authToken)
        } else {
          console.error('OAuth token verification failed')
        }
      } catch (err) {
        console.error('OAuth callback error:', err)
      }
      // Clean URL - keep the path but remove auth_token param
      const url = new URL(window.location.href)
      url.searchParams.delete('auth_token')
      window.history.replaceState(null, '', url.pathname + url.hash)
    }
  }, [setAuth])

  // Screenshot bypass mode — check ?screenshot=true
  const isScreenshotMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('screenshot')

  // Initialize auth on mount
  useEffect(() => {
    if (isScreenshotMode) {
      // Bypass auth for screenshots — set a mock user
      const mockUser = {
        id: 'screenshot-user-001',
        name: 'Ashish Kumar',
        email: 'ashish@nexttrade.in',
        phone: '+91 9876543210',
        panNumber: 'ABCDE1234F',
        avatar: null,
        role: 'USER' as const,
        subscription: 'PREMIUM' as const,
        virtualBalance: 10000000,
        marginUsed: 0,
        totalTrades: 147,
        winRate: 68.3,
        totalPnl: 245680,
        rank: 12,
        isEmailVerified: true,
        isPhoneVerified: true,
        isActive: true,
        lastLoginAt: new Date().toISOString(),
        createdAt: '2024-06-15T10:30:00.000Z',
        updatedAt: new Date().toISOString(),
        oauthProvider: null,
        oauthId: null,
        _count: { trades: 147, orders: 203, positions: 3 },
      }
      // Use direct setState to also set isInitializing: false
      useAuthStore.setState({ user: mockUser, token: 'screenshot-mock-token', isAuthenticated: true, isInitializing: false, isLoading: false })
      return
    }
    // Check for OAuth callback first
    handleOAuthCallback()
    initialize()
  }, [isScreenshotMode, initialize, handleOAuthCallback])

  // Initialize store from URL on mount (after auth is ready)
  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      initFromUrl()
    }
  }, [isInitializing, isAuthenticated, initFromUrl])

  // Handle browser back/forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const { page, stockSymbol, indexSymbol, positionsTab } = parseUrlPath(window.location.pathname)
      // Temporarily disable URL sync to avoid pushing back to the URL we just came from
      useAppStore.setState({
        currentPage: page,
        selectedStockSymbol: stockSymbol || useAppStore.getState().selectedStockSymbol,
        selectedIndexSymbol: indexSymbol || useAppStore.getState().selectedIndexSymbol,
        ...(positionsTab ? { positionsTab } : {}),
      })
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Show loading while checking auth
  if (isInitializing) {
    return <LoadingScreen />
  }

  // Show auth page if not logged in
  if (!isAuthenticated) {
    return <AuthPage />
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch {
      // Ignore logout API errors
    }
    logout()
    // Clear watchlist store on logout
    const { useWatchlistStore } = await import('@/lib/watchlist-store')
    useWatchlistStore.getState().clear()
  }

  const isFooterPage = FOOTER_PAGES.has(currentPage)

  return (
    <TradeSuccessProvider>
      {!isScreenshotMode && <GlobalSLMonitor />}
      <div className="flex min-h-screen flex-col" style={{ background: 'var(--background)' }}>
        {/* Desktop Sidebar */}
        <Sidebar onLogout={handleLogout} userName={user?.name} userEmail={user?.email} userRole={user?.role} userAvatar={user?.avatar} />

        {/* Mobile Sidebar Sheet */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent
            side="left"
            className="w-[240px] p-0"
            style={{ background: 'var(--card)', borderRight: '1px solid var(--border)' }}
          >
            <Sidebar variant="mobile" onLogout={handleLogout} userName={user?.name} userEmail={user?.email} userRole={user?.role} userAvatar={user?.avatar} />
          </SheetContent>
        </Sheet>

        {/* Top Bar */}
        <TopBar userName={user?.name} onLogout={handleLogout} userAvatar={user?.avatar} />

        {/* Indian Market Index Ticker */}
        {!isFooterPage && <IndexTicker />}

        {/* Watchlist Sidebar (Desktop) */}
        <WatchlistSidebar />

        {/* Main Content */}
        <MobileSwipeNavigator>
        <main
          className={`flex-1 md:ml-[240px] pb-16 md:pb-0 transition-all duration-300 ${isFooterPage ? 'mt-14' : 'mt-[92px]'}`}
          style={{ marginRight: watchlistSidebarOpen ? 280 : 0 }}
        >
          <PageContent page={currentPage} />

          {/* Footer - only show on profile, help/support, and footer pages */}
          {(currentPage === 'profile' || currentPage === 'helpSupport' || isFooterPage) && <Footer />}
        </main>
        </MobileSwipeNavigator>

        {/* Mobile Bottom Nav */}
        {!isFooterPage && <MobileNav />}
      </div>
    </TradeSuccessProvider>
  )
}
