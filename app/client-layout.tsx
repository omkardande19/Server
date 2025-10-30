'use client'

import { usePathname } from 'next/navigation'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header"
import LeftSidebar from "@/components/left-sidebar"
import RightSidebar from "@/components/right-sidebar"
import { AmplifyProvider } from "@/components/providers/amplify-provider"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const noSidebarRoutes = ['/login', '/signup', '/reset-password']
  const showSidebars = !noSidebarRoutes.includes(pathname)

  return (
    <AmplifyProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Header />
        <div className="flex min-h-screen">
          {showSidebars && <LeftSidebar />}
          <main className={`flex-1 px-4 py-4 w-full transition-all duration-300 ${
            showSidebars 
              ? 'md:ml-[240px] lg:mr-[320px] max-w-[calc(100%-240px)] lg:max-w-[calc(100%-560px)]' 
              : ''
          }`}>
            {children}
          </main>
          {showSidebars && <RightSidebar />}
        </div>
        <Toaster />
      </ThemeProvider>
    </AmplifyProvider>
  )
} 