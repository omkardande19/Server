"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Home,
  Users,
  MessageSquare,
  Briefcase,
  Bookmark,
  Activity,
  Users2,
  Palette,
  Music,
  Theater,
  BookOpen,
  Mic2,
  History,
} from "lucide-react"

export default function LeftSidebar() {
  const pathname = usePathname()
  const [isCompany, setIsCompany] = useState(false)
  const [isClient, setIsClient] = useState(false)

  console.log('LeftSidebar - Current pathname:', pathname) // Debug log

  // Hide sidebar on auth pages
  const isAuthPage = 
    pathname === '/login' || 
    pathname === '/signup' || 
    pathname?.startsWith('/(auth)') || 
    pathname?.includes('/login') || 
    pathname?.includes('/signup')

  if (isAuthPage) {
    console.log('LeftSidebar - Auth page detected, hiding sidebar')
    return null
  }

  useEffect(() => {
    setIsClient(true)
    try {
      const storedUser = sessionStorage.getItem('user')
      if (storedUser) {
        const u = JSON.parse(storedUser)
        setIsCompany(u?.userCategory === 'company')
      } else {
        setIsCompany(false)
      }
    } catch {
      setIsCompany(false)
    }
  }, [pathname])

  return (
    <div className="fixed left-0 top-[64px] bottom-0 hidden md:block 
      w-[210px] border-r border-ink bg-ink-light p-4">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-white hover:bg-ink-hover ${
                  pathname === '/dashboard' ? 'bg-ink-hover border-l-2 border-primary' : ''
                }`}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            {/* <Link href="/network">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-white hover:bg-ink-hover"
              >
                <Users className="mr-2 h-4 w-4" />
                Network
              </Button>
            </Link> */}
            <Link href="/events">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-white hover:bg-ink-hover ${
                  pathname.startsWith('/events') ? 'bg-ink-hover border-l-2 border-primary' : ''
                }`}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Events
              </Button>
            </Link>
            <Link href="/network">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-white hover:bg-ink-hover ${
                  pathname.startsWith('/network') ? 'bg-ink-hover border-l-2 border-primary' : ''
                }`}
              >
                <Users className="mr-2 h-4 w-4" />
                Network
              </Button>
            </Link>
            <Link href="/messages">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-white hover:bg-ink-hover ${
                  pathname.startsWith('/messages') ? 'bg-ink-hover border-l-2 border-primary' : ''
                }`}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages
              </Button>
            </Link>
            <Link href="/jobs">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-white hover:bg-ink-hover ${
                  pathname.startsWith('/jobs') ? 'bg-ink-hover border-l-2 border-primary' : ''
                }`}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Jobs
              </Button>
            </Link>
          {isClient && isCompany && (
            <>
              <Link href="/jobs/new">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-white hover:bg-ink-hover ${
                    pathname === '/jobs/new' ? 'bg-ink-hover border-l-2 border-primary' : ''
                  }`}
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Post Job
                </Button>
              </Link>
              <Link href="/jobs/history">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-white hover:bg-ink-hover ${
                    pathname === '/jobs/history' ? 'bg-ink-hover border-l-2 border-primary' : ''
                  }`}
                >
                  <History className="mr-2 h-4 w-4" />
                  Job History
                </Button>
              </Link>
            </>
          )}
            <Link href="https://www.youtube.com/@Artistkatta-famous">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-white hover:bg-ink-hover"
              >
                <Bookmark className="mr-2 h-4 w-4" />
                YouTube
              </Button>
            </Link>
            <Link href="https://www.facebook.com/profile.php?id=61574273244626">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-white hover:bg-ink-hover"
              >
                <Bookmark className="mr-2 h-4 w-4" />
                Facebook
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-white hover:bg-ink-hover"
              >
                <Activity className="mr-2 h-4 w-4" />
                Instagram
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-white hover:bg-ink-hover"
              >
                <Users2 className="mr-2 h-4 w-4" />
                Community
              </Button>
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-sm font-semibold text-white">Categories</h2>
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-white hover:bg-ink-hover"
            >
              <Palette className="mr-2 h-4 w-4" />
              Visual Arts
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-white hover:bg-ink-hover"
            >
              <Music className="mr-2 h-4 w-4" />
              Music
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-white hover:bg-ink-hover"
            >
              <Theater className="mr-2 h-4 w-4" />
              Theatre & Film
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-white hover:bg-ink-hover"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Literature
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-white hover:bg-ink-hover"
            >
              <Mic2 className="mr-2 h-4 w-4" />
              Performing Arts
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

