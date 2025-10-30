"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { getCurrentUser } from 'aws-amplify/auth'

// Pages that don't require authentication
const publicPaths = ['/', '/login', '/signup', '/forgot-password', '/reset-password']

// Pages that are only for non-authenticated users
const authOnlyPaths = ['/login', '/signup']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getCurrentUser()
        
        if (user) {
          // If user is authenticated and trying to access auth pages
          if (authOnlyPaths.includes(pathname)) {
            // Remove the redirectedFrom parameter
            router.replace('/')
            return
          }
        } else {
          // If user is not authenticated and trying to access protected routes
          if (!publicPaths.includes(pathname)) {
            // Keep the current path as redirectedFrom
            const redirectPath = `/login${pathname !== '/' ? `?redirectedFrom=${pathname}` : ''}`
            router.replace(redirectPath)
            return
          }
        }
      } catch (error) {
        if (!publicPaths.includes(pathname)) {
          const redirectPath = `/login${pathname !== '/' ? `?redirectedFrom=${pathname}` : ''}`
          router.replace(redirectPath)
        }
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [pathname, router, searchParams])

  if (isChecking) {
    return null
  }

  return <>{children}</>
} 