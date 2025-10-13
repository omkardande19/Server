"use client"

import { Suspense, useEffect, useState } from 'react'
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Bell, MessageCircle, User, LogOut, Menu, Home, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { usePathname, useRouter } from "next/navigation"
import { getCurrentUser, signOut } from 'aws-amplify/auth'

function HeaderContent() {
  const pathname = usePathname()
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()

    // Retrieve user data from sessionStorage
    const storedUser = sessionStorage.getItem('user')
    console.log('Header - Stored user:', storedUser)
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setUserName(user.fullName || 'User')
    }
  }, [pathname])

  async function checkAuth() {
    try {
      const user = await getCurrentUser()
      console.log('Header - User authenticated:', user)
      setCurrentUser(user)
    } catch (error) {
      console.log('Header - No authenticated user')
      setCurrentUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut({ global: true })
      console.log('Successfully logged out')
      setCurrentUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Hide header on auth pages
  if (pathname === "/signup" || pathname === "/login") {
    return null
  }

  // Show loading state
  if (isLoading) {
    return <div className="h-14 bg-ink-light border-b border-ink shadow-md" />
  }

  console.log('Header - Render state:', { currentUser, isLoading })

  return (
    <header className="sticky top-0 z-50 bg-ink-light border-b border-ink shadow-md">
      <div className="h-14 flex items-center justify-between px-4">
        {/* Logo and Search - Responsive */}
        <div className="flex items-center flex-1 lg:flex-initial">
          <Link href="/" className="flex items-center">
            <div className="relative h-8 w-24 sm:w-32">
              <Image
                src="/images/app-logo2.png"
                alt="Artist Katta"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          {/* Search - Hidden on mobile, visible on larger screens */}
          <div className="hidden md:block max-w-[240px] ml-6">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-8 bg-ink-hover border-ink text-white" />
            </div>
          </div>
        </div>

        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center justify-center flex-1 space-x-2">
          <Button variant="ghost" className="h-12 px-4 hover:bg-ink-hover text-white">
            <Link href="/dashboard">Home</Link>
          </Button>
          <Button variant="ghost" className="h-12 px-4 hover:bg-ink-hover text-white">
            <Link href="/opportunities">Jobs</Link>
          </Button>
          {/* <Button variant="ghost" className="h-12 px-4 hover:bg-ink-hover text-white">
            <Link href="/network">Agencies</Link>
          </Button> */}
          <Button variant="ghost" className="h-12 px-4 hover:bg-ink-hover text-white">
            <Link href="/messages">Events</Link>
          </Button>
          {/* <Button variant="ghost" className="h-12 px-4 hover:bg-ink-hover text-white">
            <Link href="/network">Assistant</Link>
          </Button> */}
        </nav>

        {/* Desktop Actions - Hidden on mobile */}
        <div className="hidden md:flex items-center justify-end flex-1 space-x-2">
          {!currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-ink-hover">
                  <User className="h-5 w-5" />
                  <span>Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-ink-light border-ink">
                <DropdownMenuItem className="text-white hover:bg-ink-hover" onSelect={() => router.push('/login')}>
                  <span>Sign In</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-ink-hover" onSelect={() => router.push('/signup')}>
                  <span>Sign Up</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-ink-hover">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder-user.jpg" alt={userName || 'User'} />
                    <AvatarFallback>{(userName || 'U').charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{userName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-ink-light border-ink">
                <DropdownMenuItem className="text-white hover:bg-ink-hover" onSelect={() => router.push('/dashboard')}>
                  <Home className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-ink-hover" onSelect={() => router.push('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-ink-hover" onSelect={() => router.push('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-ink" />
                <DropdownMenuItem className="text-white hover:bg-ink-hover" onSelect={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu Button - Only visible on mobile */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-ink-hover">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px] bg-ink-light border-ink mt-2">
              {!currentUser ? (
                <>
                  <DropdownMenuItem className="text-white hover:bg-ink-hover">
                    <Link href="/signup" className="flex items-center w-full">
                      Sign Up
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-ink-hover">
                    <Link href="/login" className="flex items-center w-full">
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-ink" />
                </>
              ) : null}
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8 bg-ink-hover border-ink text-white w-full" />
                </div>
              </div>
              <DropdownMenuSeparator className="bg-ink" />
              {/* Navigation Items */}
              <DropdownMenuItem className="text-white hover:bg-ink-hover">
                <Link href="/opportunities" className="flex items-center w-full">
                  Jobs
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-ink-hover">
                <Link href="/network" className="flex items-center w-full">
                  Network
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-ink-hover">
                <Link href="/messages" className="flex items-center w-full">
                  Messages
                  <span className="ml-auto bg-[#FFA500] text-white text-xs px-2 py-0.5 rounded-full">3</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-ink-hover">
                <Link href="/notifications" className="flex items-center w-full">
                  Notifications
                  <span className="ml-auto bg-[#FFA500] text-white text-xs px-2 py-0.5 rounded-full">5</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-ink" />
              {/* Profile Items */}
              {currentUser && (
                <>
                  <DropdownMenuItem className="text-white hover:bg-ink-hover" onSelect={() => {
                    console.log('Navigating to profile');
                    router.push('/profile');
                  }}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-ink-hover" onSelect={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

// Wrap the header in Suspense
export default function Header() {
  return (
    <Suspense fallback={<div className="h-14 bg-ink-light border-b border-ink shadow-md" />}>
      <HeaderContent />
    </Suspense>
  )
}

