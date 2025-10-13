"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { signup } from "@/lib/api"; // ✅ use centralized API

// Validation schema
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
});

type FormData = z.infer<typeof formSchema>;

export function SignUpForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);

    try {
      // Map form values to backend schema
      const payload = {
        fullName: values.name,
        emailId: values.email,
        password: values.password,
        userCategory: values.userType,
        userCategoryType:
          values.userType === "artist"
            ? values.artistType
            : values.companyType,
      };

      const result = await signup(payload);

      if (result.success) {
        toast({
          title: "Success",
          description: "Signup successful! Please login.",
        });
        router.push("/login");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Signup failed.",
        });
      }
    } catch (error: any) {
      console.error("Signup error:", error);
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="userType" className="text-white">
          Account Type
        </Label>
        <Select
          onValueChange={(value) =>
            form.setValue("userType", value as "artist" | "company")
          }
        >
          <SelectTrigger className="bg-ink-light border-ink text-white">
            <SelectValue placeholder="Select your account type" />
          </SelectTrigger>
          <SelectContent className="bg-ink-light border-ink">
            <SelectItem value="artist">
              Artist / Creative Professional
            </SelectItem>
            <SelectItem value="company">Company / Organization</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {form.watch("userType") === "artist" && (
        <div className="space-y-2">
          <Label htmlFor="artistType" className="text-white">
            Artist Type
          </Label>
          <Select
            onValueChange={(value) => form.setValue("artistType", value)}
          >
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
          <Select
            onValueChange={(value) => form.setValue("companyType", value)}
          >
            <SelectTrigger className="bg-ink-light border-ink text-white">
              <SelectValue placeholder="Select your organization type" />
            </SelectTrigger>
            <SelectContent className="bg-ink-light border-ink">
              <SelectItem value="gallery">Art Gallery</SelectItem>
              <SelectItem value="theatre">Theatre Company</SelectItem>
              <SelectItem value="music_studio">Music Studio</SelectItem>
              <SelectItem value="dance_academy">Dance Academy</SelectItem>
              <SelectItem value="production_house">
                Production House
              </SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          onCheckedChange={(checked) =>
            form.setValue("terms", checked === true)
          }
          className="border-ink data-[state=checked]:bg-primary"
        />
        <label htmlFor="terms" className="text-sm text-muted-foreground">
          I agree to the terms and conditions
        </label>
      </div>

      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>
    </form>
  );
}
