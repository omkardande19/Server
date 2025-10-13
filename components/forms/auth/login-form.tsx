"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { login } from "@/lib/api"; // ✅ centralized API

// Validation schema
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);

    try {
      const payload = {
        emailId: values.email,
        password: values.password,
      };

      const result = await login(payload);

      if (result.success) {
        toast({
          title: "Welcome back!",
          description: "Login successful",
        });

        // redirect to dashboard or home page
        router.push("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Login failed",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.message || "Server error. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">
          Password
        </Label>
        <Input
          id="password"
          placeholder="Enter your password"
          type="password"
          disabled={isLoading}
          {...form.register("password")}
          className="bg-ink-light border-ink text-white"
        />
      </div>

      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Sign In
      </Button>
    </form>
  );
}
