"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useToast } from "@/components/ui/use-toast"
import { SignUpForm } from "@/components/forms/auth/signup-form"
import { SupabaseConfigCheck } from "@/components/supabase-config-check"
import ErrorBoundary from "@/components/error-boundary"
import { SiteUrlCheck } from "@/components/site-url-check"

export default function SignUpPageClient() {
  const { toast } = useToast()

  const content = (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <SupabaseConfigCheck />
      <SiteUrlCheck />
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
              &ldquo;Join the creative community where artists connect, collaborate, and grow together.&rdquo;
            </p>
            <footer className="text-sm">Artist Katta Community</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">Create an account</h1>
            <p className="text-sm text-muted-foreground">Enter your details to get started</p>
          </div>

          <SignUpForm />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-ink" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="border-ink text-white hover:bg-ink-hover"
              onClick={() => {
                toast({
                  variant: "destructive",
                  title: "Not Available",
                  description: "Social signup is currently unavailable. Please use email signup.",
                })
              }}
            >
              <Icons.google className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              variant="outline"
              className="border-ink text-white hover:bg-ink-hover"
              onClick={() => {
                toast({
                  variant: "destructive",
                  title: "Not Available",
                  description: "Social signup is currently unavailable. Please use email signup.",
                })
              }}
            >
              <Icons.facebook className="mr-2 h-4 w-4" />
              Facebook
            </Button>
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )

  return <ErrorBoundary>{content}</ErrorBoundary>
}

