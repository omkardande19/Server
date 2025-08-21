"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Card } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { SupabaseConfigCheck } from "@/components/supabase-config-check"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Get the current site URL for the redirect
      const origin = window.location.origin
      const redirectTo = `${origin}/reset-password`

      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo,
      })

      if (error) {
        console.error("Reset password error:", error.message)
        throw error
      }

      setEmailSent(true)
      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      })
    } catch (error) {
      console.error("Reset password error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send reset email. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center">
      <SupabaseConfigCheck />
      <Card className="w-full max-w-lg space-y-6 p-8 bg-ink-light border-ink">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Reset your password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {emailSent ? (
          <div className="space-y-4">
            <div className="bg-primary/10 text-primary p-4 rounded-lg text-center">
              <p>Check your email for a link to reset your password.</p>
              <p className="text-sm mt-2">Didn't receive the email? Check your spam folder.</p>
            </div>
            <Button variant="outline" className="w-full border-ink text-white hover:bg-ink-hover" asChild>
              <Link href="/login">Back to login</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                {...form.register("email")}
                className="bg-ink-light border-ink text-white"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Send reset link
            </Button>
            <Button variant="outline" className="w-full border-ink text-white hover:bg-ink-hover" asChild>
              <Link href="/login">Back to login</Link>
            </Button>
          </form>
        )}
      </Card>
    </div>
  )
}

