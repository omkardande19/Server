"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { signIn, signOut } from 'aws-amplify/auth'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
})

type FormData = z.infer<typeof formSchema>

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Sign out on component mount
    const clearSession = async () => {
      try {
        await signOut({ global: true })
        console.log('Previous session cleared')
      } catch (error) {
        console.log('No previous session to clear')
      }
    }
    clearSession()
  }, [])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: FormData) {
    setIsLoading(true)

    try {
      const signInResult = await signIn({
        username: values.email,
        password: values.password,
      })

      console.log('Sign-in successful:', signInResult)
      
      // Fetch user data from DynamoDB
      const response = await axios.get(`https://to58hqa8w7.execute-api.ap-south-1.amazonaws.com/prod/users/${values.email}`);
      console.log('User data retrieved:', response.data);

      // Save user data in session storage
      sessionStorage.setItem('user', JSON.stringify(response.data));

      toast({
        title: "Success",
        description: "Logged in successfully.",
      })
      
      router.push('/dashboard')
      
    } catch (error: any) {
      console.error('Login error:', error)
      
      if (error.message.includes('UserNotConfirmedException')) {
        toast({
          variant: "destructive",
          title: "Email not verified",
          description: "Please check your email and verify your account before logging in.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error?.message || "Failed to login. Please check your credentials.",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
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
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">
            Password
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
        <div className="flex items-center justify-end">
          <Link href="/forgot-password" className="text-sm text-primary hover:text-primary/90">
            Forgot password?
          </Link>
        </div>
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>
    </div>
  )
}

