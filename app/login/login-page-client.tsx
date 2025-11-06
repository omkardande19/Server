"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import ErrorBoundary from "@/components/error-boundary";
import { login } from "@/lib/api"; // 🔹 use your server API

export default function LoginPageClient() {
    const { toast } = useToast();
    const router = useRouter();

    const [form, setForm] = useState({ emailId: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [logoReady, setLogoReady] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLogoReady(true), 50);
        return () => clearTimeout(t);
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log("🚀 Login form submitted:", form);
        setLoading(true);
        setError("");

        try {
            console.log("🚀 Sending login request:", form);
            const result = await login(form); // call backend
            console.log("✅ API response:", result);
            if (result.success && result.token) {
                localStorage.setItem("token", result.token);
                try {
                    // Persist user data for role-based UI
                    if (result.user) {
                        sessionStorage.setItem("user", JSON.stringify(result.user));
                    }
                } catch {}
                console.log("✅ Token saved, redirecting to dashboard...");
                setTimeout(() => {
                    router.push("/dashboard");
                }, 100);  // small delay ensures redirect works
            } 
            else {
                setError(result.message || "Login failed");
            }
        } catch (err) {
            console.error(err);
            setError("Server error");
        } finally {
            setLoading(false);
        }
    }

    const content = (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Global top-right logo with entrance animation */}
            <div
                className={`absolute right-4 top-4 z-30 transition-all duration-700 ease-out
                    ${logoReady ? "opacity-100 translate-x-0 scale-100" : "opacity-0 -translate-x-10 scale-95"}
                `}
            >
                <Image
                    src="/images/app-logo2.png"
                    alt="Artist Katta Logo"
                    width={160}
                    height={64}
                    className="object-contain drop-shadow-md"
                    priority
                />
            </div>
            {/* Left side image panel */}
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-600/50 to-blue-900/20">
                    <Image
                        src="/images/login_background.png"
                        alt="Artist Collage"
                        fill
                        className="object-cover opacity-80 brightness-110"
                    />
                </div>
                {/* Quote moved to right panel */}
            </div>

            {/* Right side login form */}
            <div className="relative lg:p-8 min-h-[80vh] lg:min-h-screen">
                {/* Quote pinned to bottom-right corner of the right panel */}
                <div className="absolute bottom-4 right-4 text-right text-muted-foreground max-w-[280px]">
                    <blockquote className="space-y-2">
                        <p className="text-sm italic">
                            &ldquo;Welcome back to your creative community. Let's continue your artistic journey.&rdquo;
                        </p>
                        <footer className="text-xs">Artist Katta Community</footer>
                    </blockquote>
                </div>
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight text-white">Welcome back</h1>
                        <p className="text-sm text-muted-foreground">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                        <input
                            type="email"
                            name="emailId"
                            value={form.emailId}
                            onChange={handleChange}
                            placeholder="Email Address"
                            required
                            className="border p-2 rounded text-black"
                        />
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                            className="border p-2 rounded text-black"
                        />
                        <div className="flex justify-end -mt-2">
                            <button
                                type="button"
                                onClick={() => router.push("/forgot-password")}
                                className="text-sm underline underline-offset-4 hover:text-primary"
                            >
                                Forgot password?
                            </button>
                        </div>
                        <button type="submit" disabled={loading} className="bg-green-500 text-white p-2 rounded" >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                        {error && <p className="text-red-500">{error}</p>}
                    </form>

                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-ink" />
                        <span className="text-xs text-muted-foreground">or continue with</span>
                        <div className="h-px flex-1 bg-ink" />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <Button type="button" variant="outline" className="bg-ink-hover border-ink text-white hover:bg-ink" onClick={() => router.push("/api/auth/google")}> 
                            <Icons.google className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="outline" className="bg-ink-hover border-ink text-white hover:bg-ink" onClick={() => router.push("/api/auth/facebook")}> 
                            <Icons.facebook className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="outline" className="bg-ink-hover border-ink text-white hover:bg-ink" onClick={() => router.push("/api/auth/instagram")}> 
                            <Icons.instagram className="h-4 w-4" />
                        </Button>
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
    );

    return <ErrorBoundary>{content}</ErrorBoundary>;
}