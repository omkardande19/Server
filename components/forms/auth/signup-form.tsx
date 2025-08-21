"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Amplify } from 'aws-amplify'
import { signUp as amplifySignUp, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth'
import axios from 'axios'
import awsConfig from '@/aws-exports'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Card } from "@/components/ui/card"

Amplify.configure(awsConfig)

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  userType: z.enum(["artist", "company"] as const, {
    required_error: "Please select your account type.",
  }),
  artistType: z.string().optional(),
  companyType: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
})

type FormData = z.infer<typeof formSchema>

export function SignUpForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      userType: undefined,
      artistType: "",
      companyType: "",
      terms: false,
    },
  })

  async function onSubmit(values: FormData) {
    setIsLoading(true)

    try {
      const signUpResult = await amplifySignUp({
        username: values.email,
        password: values.password,
        options: {
          userAttributes: {
            email: values.email,
          }
        },
      })

      console.log('Sign-up successful:', signUpResult)
      setEmailSent(true)
      
    } catch (error: any) {
      console.error('Signup error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onVerificationComplete() {
    try {
      // Log the values before sending to the API
      const emailId = form.getValues('email');
      const fullName = form.getValues('name');
      const userCategory = form.getValues('userType');
      const userCategoryType = form.getValues('userType') === 'artist' ? form.getValues('artistType') : form.getValues('companyType');

      console.log('Sending user data to API:', {
        emailId,
        fullName,
        userCategory,
        userCategoryType,
      });

      // Send user data to the API Gateway endpoint
      const response = await axios.post('https://to58hqa8w7.execute-api.ap-south-1.amazonaws.com/prod/users', {
        emailId,
        fullName,
        userCategory,
        userCategoryType,
        // Add other fields as necessary
      });

      console.log('User data saved:', response.data);

      toast({
        title: "Success",
        description: "Email verified successfully. You can now login.",
      });

      router.push('/login');
      router.refresh();
    } catch (error: any) {
      console.error('Error saving user data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to save user data. Please try again.",
      });
    }
  }

  if (emailSent) {
    return (
      <Card className="p-6 bg-ink-light border-ink">
        <h2 className="text-xl font-semibold text-white mb-4">Verify your email</h2>
        <p className="text-muted-foreground mb-6">
          We've sent a verification code to your email. Please enter the code below to complete your registration.
        </p>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const code = (e.target as any).code.value;
          
          try {
            await confirmSignUp({
              username: form.getValues('email'),
              confirmationCode: code,
            });
            
            await onVerificationComplete();
          } catch (error: any) {
            toast({
              variant: "destructive",
              title: "Error",
              description: error?.message || "Failed to verify email. Please try again.",
            });
          }
        }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-white">
              Verification Code
            </Label>
            <Input
              id="code"
              placeholder="Enter verification code"
              type="text"
              className="bg-ink-light border-ink text-white"
            />
          </div>
          
          <div className="space-y-4">
            <Button type="submit" className="w-full">
              Verify Email
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Didn't receive the code?{" "}
              <Button
                variant="link"
                className="text-primary"
                onClick={async () => {
                  try {
                    await resendSignUpCode({
                      username: form.getValues('email'),
                    });
                    toast({
                      title: "Success",
                      description: "Verification code resent to your email.",
                    });
                  } catch (error: any) {
                    toast({
                      variant: "destructive",
                      title: "Error",
                      description: error?.message || "Failed to resend code. Please try again.",
                    });
                  }
                }}
              >
                Resend Code
              </Button>
            </p>
          </div>
        </form>
      </Card>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white">
          Full Name
        </Label>
        <Input
          id="name"
          placeholder="Enter your full name"
          type="text"
          disabled={isLoading}
          {...form.register("name")}
          className="bg-ink-light border-ink text-white"
        />
        {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">
          Email
        </Label>
        <Input
          id="email"
          placeholder="name@example.com"
          type="email"
          disabled={isLoading}
          {...form.register("email")}
          className="bg-ink-light border-ink text-white"
        />
        {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">
          Password
        </Label>
        <Input
          id="password"
          placeholder="Create a password"
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
        <Label htmlFor="userType" className="text-white">
          Account Type
        </Label>
        <Select onValueChange={(value) => form.setValue("userType", value as "artist" | "company")}>
          <SelectTrigger className="bg-ink-light border-ink text-white">
            <SelectValue placeholder="Select your account type" />
          </SelectTrigger>
          <SelectContent className="bg-ink-light border-ink">
            <SelectItem value="artist">Artist / Creative Professional</SelectItem>
            <SelectItem value="company">Company / Organization</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.userType && (
          <p className="text-sm text-red-500">{form.formState.errors.userType.message}</p>
        )}
      </div>

      {form.watch("userType") === "artist" && (
        <div className="space-y-2">
          <Label htmlFor="artistType" className="text-white">
            Artist Type
          </Label>
          <Select onValueChange={(value) => form.setValue("artistType", value)}>
            <SelectTrigger className="bg-ink-light border-ink text-white">
              <SelectValue placeholder="Select your primary art form" />
            </SelectTrigger>
            <SelectContent className="bg-ink-light border-ink">
              <SelectItem value="visual">Visual Artist</SelectItem>
              <SelectItem value="music">Musician</SelectItem>
              <SelectItem value="dance">Dancer</SelectItem>
              <SelectItem value="theatre">Theatre Artist</SelectItem>
              <SelectItem value="writer">Writer</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {form.watch("userType") === "company" && (
        <div className="space-y-2">
          <Label htmlFor="companyType" className="text-white">
            Organization Type
          </Label>
          <Select onValueChange={(value) => form.setValue("companyType", value)}>
            <SelectTrigger className="bg-ink-light border-ink text-white">
              <SelectValue placeholder="Select your organization type" />
            </SelectTrigger>
            <SelectContent className="bg-ink-light border-ink">
              <SelectItem value="gallery">Art Gallery</SelectItem>
              <SelectItem value="theatre">Theatre Company</SelectItem>
              <SelectItem value="music_studio">Music Studio</SelectItem>
              <SelectItem value="dance_academy">Dance Academy</SelectItem>
              <SelectItem value="production_house">Production House</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          onCheckedChange={(checked) => form.setValue("terms", checked === true)}
          className="border-ink data-[state=checked]:bg-primary"
        />
        <label htmlFor="terms" className="text-sm text-muted-foreground">
          I agree to the terms and conditions
        </label>
      </div>
      {form.formState.errors.terms && <p className="text-sm text-red-500">{form.formState.errors.terms.message}</p>}

      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>
    </form>
  )
}

