"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Card } from "@/components/ui/card"
import { resetPassword } from "@/lib/api"

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export default function ResetPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get("token")
    if (!t) {
      toast({
        variant: "destructive",
        title: "Invalid or missing token",
        description: "Please use the reset link from your email.",
      })
      router.push("/forgot-password")
      return
    }
    setToken(t)
    setIsValidSession(true)
  }, [router, toast])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isValidSession) {
      toast({
        variant: "destructive",
        title: "Invalid session",
        description: "Please use the reset link from your email.",
      })
      return
    }

    setIsLoading(true)

    try {
      if (!token) throw new Error("Missing token")
      await resetPassword(token, values.password)

      toast({
        title: "Password updated",
        description: "Your password has been successfully reset.",
      })

      router.push("/login")
    } catch (error) {
      console.error("Password reset error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset password. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidSession) {
    return null // Or show a loading state
  }

  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center">
      <Card className="w-full max-w-lg space-y-6 p-8 bg-ink-light border-ink">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Reset your password</h1>
          <p className="text-sm text-muted-foreground">Enter your new password below.</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              New Password
            </Label>
            <Input
              id="password"
              type="password"
              disabled={isLoading}
              {...form.register("password")}
              className="bg-ink-light border-ink text-white"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              disabled={isLoading}
              {...form.register("confirmPassword")}
              className="bg-ink-light border-ink text-white"
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Reset password
          </Button>
        </form>
      </Card>
    </div>
  )
}

