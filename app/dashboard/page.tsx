"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/api"; // ✅ Import API helper

// Example imports for UI components (keep your original ones here)
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarProvider,
} from "@/components/ui/sidebar";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar";

import {
    Button
} from "@/components/ui/button";

import {
    Home,
    User,
    Settings,
    LogOut,
} from "lucide-react";

function DashboardHeader() {
    const router = useRouter();

    function handleLogout() {
        localStorage.removeItem("token");  // clear JWT
        router.push("/login");             // redirect to login
    }

    return (
        <div className="flex justify-between items-center p-4 bg-gray-900 text-white">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
                Logout
            </button>
        </div>
    );
}

export default function DashboardPage() {
    const router = useRouter();

    // ✅ Auth state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    // ✅ Auth check function
    async function checkAuth() {
        try {
            const user = await getCurrentUser();
            console.log("User is authenticated:", user);
            setIsAuthenticated(true);
            setUserInfo(user);
        } catch (error) {
            console.log("User is not authenticated:", error);
            setIsAuthenticated(false);
            setUserInfo(null);
            router.push("/login");
        } finally {
            setIsLoading(false);
        }
    }

    // ✅ Run auth check on mount (only show loader if a token exists)
    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
            setIsAuthenticated(false);
            setUserInfo(null);
            router.push("/login");
            return; // no loader shown when unauthenticated
        }
        setIsLoading(true);
        checkAuth();
    }, []);

    // Loader
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-t-transparent border-gray-400" />
            </div>
        );
    }

    // If not authenticated (just in case double check)
    if (!isAuthenticated) {
        return null;
    }

    // ✅ Keep your full UI as it was before (~400 lines)
    return (
        <SidebarProvider>
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar>
                <SidebarHeader>
                    <h1 className="text-xl font-bold p-4">ArtistKatta</h1>
                </SidebarHeader>
				<SidebarContent />
				<SidebarFooter />
            </Sidebar>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
				<header className="flex items-center justify-between p-4 border-b">
					<h2 className="text-lg font-semibold">Dashboard</h2>
					<div className="flex items-center space-x-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="justify-start">
									<Avatar className="mr-2 h-6 w-6">
										<AvatarImage
											src={userInfo?.profileImage || ""}
											alt={userInfo?.fullName || "User"}
										/>
										<AvatarFallback>
											{userInfo?.fullName?.[0] || "U"}
										</AvatarFallback>
									</Avatar>
									{userInfo?.fullName || "User"}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => router.push("/dashboard")}>
									<Home className="mr-2 h-4 w-4" /> Dashboard
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => router.push("/profile")}>
									<User className="mr-2 h-4 w-4" /> Profile
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => router.push("/settings")}>
									<Settings className="mr-2 h-4 w-4" /> Settings
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => {
										localStorage.removeItem("token");
										setIsAuthenticated(false);
										router.push("/login");
									}}
								>
									<LogOut className="mr-2 h-4 w-4" /> Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</header>

                {/* Main Content Body */}
                <main className="flex-1 overflow-y-auto p-6">
                    {/* ✅ Keep all your dashboard widgets, charts, and UI here */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-white rounded shadow">Widget 1</div>
                        <div className="p-4 bg-white rounded shadow">Widget 2</div>
                        <div className="p-4 bg-white rounded shadow">Widget 3</div>
                    </div>
                </main>
            </div>
        </div>
        </SidebarProvider>
    );
}
