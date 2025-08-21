"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getCurrentUser } from 'aws-amplify/auth'
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useToast } from "@/components/ui/use-toast"
import { LoginForm } from "@/components/forms/auth/login-form"
import ErrorBoundary from "@/components/error-boundary"

export default function LoginPageClient() {
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getCurrentUser()
        if (user) {
          router.push('/dashboard')
          router.refresh()
        }
      } catch (error) {
        // User is not authenticated, stay on login page
        console.log('User not authenticated')
      }
    }

    checkAuth()
  }, [router])

  const content = (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-black">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sign_up_page-QOrmhrBDucizdddaywcfgiP0L3wlfP.png"
            alt="Artist Katta Logo"
            width={200}
            height={80}
            className="relative z-20 mb-8"
          />
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/right_side_signup-6GubHKlMWkv9avlGZyaHAOfbczFLuw.png"
            alt="Artist Collage"
            fill
            className="object-cover opacity-40"
          />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Welcome back to your creative community. Let's continue your artistic journey.&rdquo;
            </p>
            <footer className="text-sm">Artist Katta Community</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your account</p>
          </div>

          <LoginForm />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-ink" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Button
              variant="outline"
              className="border-ink text-white hover:bg-ink-hover"
              onClick={() => {
                toast({
                  variant: "destructive",
                  title: "Not Available",
                  description: "Social login is currently unavailable. Please use email login.",
                })
              }}
            >
              <Icons.google className="mr-2 h-4 w-4" />
              Google
            </Button>

            {/* <Button
              variant="outline"
              className="border-ink text-white hover:bg-ink-hover"
              onClick={() => {
                toast({
                  variant: "destructive",
                  title: "Not Available",
                  description: "Social login is currently unavailable. Please use email login.",
                })
              }}
            >
              <Icons.facebook className="mr-2 h-4 w-4" />
              Facebook
            </Button> */}
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )

  return <ErrorBoundary>{content}</ErrorBoundary>
}

