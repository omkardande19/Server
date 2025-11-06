"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getConnections, getJobHistory } from "@/lib/api";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SplashScreen } from "@/components/splash-screen";
import {
    Home,
    User,
    Settings,
    LogOut,
    Briefcase,
    Users,
    MessageCircle,
    Bell,
    Calendar,
    Star,
    Search,
    Plus,
    TrendingUp,
    Clock,
    Mail,
    UserPlus,
    Palette,
    Music,
    Film,
    Menu,
    X,
} from "lucide-react";

export default function DashboardPage() {
    const router = useRouter();

    // ✅ Auth state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showSplash, setShowSplash] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState({
        activeJobs: 0,
        totalConnections: 0,
        pendingRequests: 0,
        newMessages: 0
    });

    // ✅ Auth check function
    async function checkAuth() {
        try {
            const user = await getCurrentUser();
            console.log("User is authenticated:", user);
            setIsAuthenticated(true);
            setUserInfo(user);
            
            // Load stats
            try {
                const [connectionsRes, jobHistoryRes] = await Promise.all([
                    getConnections({ status: "accepted" }),
                    user.userCategory === "company" ? getJobHistory() : Promise.resolve({ stats: { publishedJobs: 0 } })
                ]);
                
                setStats({
                    activeJobs: jobHistoryRes.stats?.publishedJobs || 0,
                    totalConnections: connectionsRes.connections?.length || 0,
                    pendingRequests: 0,
                    newMessages: 0
                });
            } catch (err) {
                console.error("Failed to load stats:", err);
            }
        } catch (error) {
            console.log("User is not authenticated:", error);
            setIsAuthenticated(false);
            setUserInfo(null);
            router.push("/login");
        } finally {
            // Add a small delay for better UX
            setTimeout(() => {
            setIsLoading(false);
            }, 800);
        }
    }

    // ✅ Run auth check on mount
    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
            setIsAuthenticated(false);
            setUserInfo(null);
            router.push("/login");
            return;
        }
        setIsLoading(true);
        checkAuth();
    }, []);

    // Show splash screen first, then loading
    if (showSplash) {
        return <SplashScreen onComplete={() => setShowSplash(false)} duration={2000} />
    }

    // Loading after splash
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#1a1a1a]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent border-primary mb-4"></div>
                    <p className="text-white">Setting up your dashboard...</p>
                </div>
            </div>
        );
    }

    // If not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#1a1a1a]">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <div className="fixed left-0 top-0 h-full w-64 bg-[#1f1f1f] border-r border-[#2f2f2f]">
                        <div className="flex items-center justify-between p-4 border-b border-[#2f2f2f]">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">A</span>
                                </div>
                                <h1 className="text-xl font-bold text-white">ArtistKatta</h1>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                                <X className="h-5 w-5 text-white" />
                            </Button>
                        </div>
                        <nav className="p-4">
                            <div className="space-y-2">
                                <Link href="/dashboard" className="flex items-center gap-2 p-2 text-white hover:bg-[#2a2a2a] rounded" onClick={() => setSidebarOpen(false)}>
                                    <Home className="h-4 w-4" />
                                    Dashboard
                                </Link>
                                <Link href="/jobs" className="flex items-center gap-2 p-2 text-white hover:bg-[#2a2a2a] rounded" onClick={() => setSidebarOpen(false)}>
                                    <Briefcase className="h-4 w-4" />
                                    Jobs
                                </Link>
                                <Link href="/events" className="flex items-center gap-2 p-2 text-white hover:bg-[#2a2a2a] rounded" onClick={() => setSidebarOpen(false)}>
                                    <Calendar className="h-4 w-4" />
                                    Events
                                </Link>
                                <Link href="/network" className="flex items-center gap-2 p-2 text-white hover:bg-[#2a2a2a] rounded" onClick={() => setSidebarOpen(false)}>
                                    <Users className="h-4 w-4" />
                                    Network
                                </Link>
                                <Link href="/messages" className="flex items-center gap-2 p-2 text-white hover:bg-[#2a2a2a] rounded" onClick={() => setSidebarOpen(false)}>
                                    <MessageCircle className="h-4 w-4" />
                                    Messages
                                </Link>
                                <Link href="/saved" className="flex items-center gap-2 p-2 text-white hover:bg-[#2a2a2a] rounded" onClick={() => setSidebarOpen(false)}>
                                    <Star className="h-4 w-4" />
                                    Saved
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar (hidden for full-page layout) */}
            <div className="hidden">
                <div className="border-b border-[#2f2f2f] p-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <h1 className="text-xl font-bold text-white">ArtistKatta</h1>
                    </div>
                </div>
                
                <nav className="flex-1 p-4">
                    <div className="space-y-2">
                        <Link href="/dashboard" className="flex items-center gap-2 p-2 text-white bg-[#2a2a2a] rounded">
                            <Home className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link href="/jobs" className="flex items-center gap-2 p-2 text-white hover:bg-[#2a2a2a] rounded">
                            <Briefcase className="h-4 w-4" />
                            Jobs
                        </Link>
                        <Link href="/events" className="flex items-center gap-2 p-2 text-white hover:bg-[#2a2a2a] rounded">
                            <Calendar className="h-4 w-4" />
                            Events
                        </Link>
                        <Link href="/network" className="flex items-center gap-2 p-2 text-white hover:bg-[#2a2a2a] rounded">
                            <Users className="h-4 w-4" />
                            Network
                        </Link>
                        <Link href="/messages" className="flex items-center gap-2 p-2 text-white hover:bg-[#2a2a2a] rounded">
                            <MessageCircle className="h-4 w-4" />
                            Messages
                        </Link>
                        <Link href="/saved" className="flex items-center gap-2 p-2 text-white hover:bg-[#2a2a2a] rounded">
                            <Star className="h-4 w-4" />
                            Saved
                        </Link>
                    </div>
                </nav>
                
                <div className="border-t border-[#2f2f2f] p-4">
                    <Link href="/profile" className="flex items-center gap-2 p-2 text-white hover:bg-[#2a2a2a] rounded mb-2">
                        <User className="h-4 w-4" />
                        Profile
                    </Link>
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start text-white hover:bg-[#2a2a2a]"
                        onClick={() => {
                            localStorage.removeItem("token");
                            router.push("/login");
                        }}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>

            {/* Main Content - full width */}
            <div className="min-h-screen w-full">
                {/* Top Header - Minimal */}
                <header className="sticky top-0 z-40 bg-[#1f1f1f] border-b border-[#2f2f2f] px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                            {/* Mobile Menu Button */}
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="lg:hidden text-white"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                            
                            <div>
                                <h1 className="text-xl font-bold text-white">Dashboard</h1>
                                <p className="text-sm text-gray-400">Welcome back, {userInfo?.fullName || "User"}!</p>
                            </div>
                        </div>
                        
                        {/* Right Side - Just Notifications */}
                        <div className="flex items-center gap-3">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-white hover:bg-[#2a2a2a] relative"
                                onClick={() => router.push("/messages")}
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-white hover:bg-[#2a2a2a] relative"
                                onClick={() => router.push("/messages")}
                            >
                                <MessageCircle className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full"></span>
                            </Button>
                            
                            {/* User Avatar - Click to Profile */}
                            {/* Account menu moved to global header */}
                        </div>
					</div>
				</header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6 w-full">
                    <div className="mx-auto px-0 sm:px-4 lg:px-6 space-y-6">
                    {/* Hero Profile Section */}
                    <div className="relative overflow-hidden rounded-xl border border-[#2f2f2f] bg-[#151515]">
                        <div className="h-32 sm:h-40 w-full bg-gradient-to-r from-primary/20 via-purple-500/10 to-blue-500/10" />
                        <div className="p-5 sm:p-6">
                            <div className="flex items-end gap-4 -mt-10">
                                <Avatar className="h-20 w-20 ring-4 ring-[#151515]">
                                    <AvatarImage src={userInfo?.profileImage || "/placeholder-user.jpg"} alt={userInfo?.fullName || "User"} />
                                    <AvatarFallback className="bg-primary text-white text-xl">
                                        {userInfo?.fullName?.[0] || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-white">{userInfo?.fullName || "User"}</h1>
                                    <p className="text-sm text-gray-400">
                                        {userInfo?.userCategoryType ? `${userInfo.userCategoryType} • ` : ""}{userInfo?.city || ""}{userInfo?.city && userInfo?.country ? ", " : ""}{userInfo?.country || ""}
                                    </p>
                                </div>
                                <div className="hidden sm:flex items-center gap-2">
                                    <Button asChild variant="outline" className="border-[#2f2f2f] text-white hover:bg-[#2a2a2a]">
                                        <Link href="/profile">Edit Profile</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href="/jobs">Browse Jobs</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-white">Active Jobs</CardTitle>
                                    <Briefcase className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">{stats.activeJobs}</div>
                                    <p className="text-xs text-green-500 flex items-center mt-1">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        Active now
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-white">Connections</CardTitle>
                                    <Users className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">{stats.totalConnections}</div>
                                    <p className="text-xs text-gray-400 mt-1">Total network</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-white">Messages</CardTitle>
                                    <MessageCircle className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">{stats.newMessages}</div>
                                    <p className="text-xs text-gray-400 mt-1">New messages</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-white">Requests</CardTitle>
                                    <Bell className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">{stats.pendingRequests}</div>
                                    <p className="text-xs text-gray-400 mt-1">Pending</p>
                                </CardContent>
                            </Card>
                        </div>

                    {/* Split Workspace: Left | Center | Right */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Recent Activity */}
                        <div className="order-2 lg:order-1 space-y-6">
                            {/* Profile Summary */}
                            <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
                                <CardHeader>
                                    <CardTitle className="text-white">Profile</CardTitle>
                                    <CardDescription className="text-gray-400">At a glance</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-gray-300">
                                    <div className="flex items-center justify-between">
                                        <span>Category</span>
                                        <span className="text-white">{userInfo?.userCategoryType || "—"}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Location</span>
                                        <span className="text-white">{[userInfo?.city, userInfo?.country].filter(Boolean).join(", ") || "—"}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Status</span>
                                        <span className="text-white">{userInfo?.status || "—"}</span>
                                    </div>
                                    <div className="pt-2 grid grid-cols-2 gap-2">
                                        <Button asChild size="sm" variant="outline" className="border-[#2f2f2f] text-white hover:bg-[#2a2a2a]">
                                            <Link href="/profile">View Profile</Link>
                                        </Button>
                                        <Button asChild size="sm">
                                            <Link href="/network">Find People</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
                                    <CardHeader>
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <Clock className="h-5 w-5" />
                                            Recent Activity
                                        </CardTitle>
                                        <CardDescription className="text-gray-400">Latest updates from your network</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3 p-3 bg-[#2a2a2a] rounded-lg">
                                                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                                    <UserPlus className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-white">New connection request</p>
                                                    <p className="text-xs text-gray-400">From Jane Smith</p>
                                                </div>
                                                <span className="text-xs text-gray-500">2m ago</span>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-[#2a2a2a] rounded-lg">
                                                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                                                    <Mail className="h-4 w-4 text-green-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-white">New message received</p>
                                                    <p className="text-xs text-gray-400">From Mike Johnson</p>
                                                </div>
                                                <span className="text-xs text-gray-500">5m ago</span>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-[#2a2a2a] rounded-lg">
                                                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                                    <Briefcase className="h-4 w-4 text-blue-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-white">Job application received</p>
                                                    <p className="text-xs text-gray-400">For Designer position</p>
                                                </div>
                                                <span className="text-xs text-gray-500">1h ago</span>
                                            </div>
                                        </div>
                                    </CardContent>
                            </Card>
                        </div>

                        {/* Center: Unified Updates Feed */}
                        <div className="space-y-6 order-1 lg:order-2">
                            <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
                                <CardHeader>
                                    <CardTitle className="text-white">Updates</CardTitle>
                                    <CardDescription className="text-gray-400">All your app updates in one place</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="p-3 bg-[#2a2a2a] rounded-lg text-sm text-gray-300">
                                        Your profile was viewed 8 times today
                                    </div>
                                    <div className="p-3 bg-[#2a2a2a] rounded-lg text-sm text-gray-300">
                                        2 new jobs match your preferences
                                    </div>
                                    <div className="p-3 bg-[#2a2a2a] rounded-lg text-sm text-gray-300">
                                        Connection request from Jane Smith
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
                                    <CardHeader>
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <Plus className="h-5 w-5" />
                                            Quick Actions
                                        </CardTitle>
                                        <CardDescription className="text-gray-400">Get started with these actions</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <Button asChild className="w-full bg-primary hover:bg-primary/90">
                                            <Link href="/jobs/new">
                                                <Briefcase className="mr-2 h-4 w-4" />
                                                Post a Job
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" className="w-full border-[#2f2f2f] text-white hover:bg-[#2a2a2a]">
                                            <Link href="/jobs">
                                                <Search className="mr-2 h-4 w-4" />
                                                Search Jobs
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" className="w-full border-[#2f2f2f] text-white hover:bg-[#2a2a2a]">
                                            <Link href="/network">
                                                <UserPlus className="mr-2 h-4 w-4" />
                                                Find People
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" className="w-full border-[#2f2f2f] text-white hover:bg-[#2a2a2a]">
                                            <Link href="/events">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                Create Event
                                            </Link>
                                        </Button>
                                    </CardContent>
                            </Card>

                            <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
                                    <CardHeader>
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <Calendar className="h-5 w-5" />
                                            Upcoming Events
                                        </CardTitle>
                                        <CardDescription className="text-gray-400">Events you're attending or hosting</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                                        <Calendar className="h-6 w-6 text-purple-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">Art Exhibition 2025</p>
                                                        <p className="text-xs text-gray-400">Tomorrow at 6:00 PM</p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="border-green-500 text-green-500">Attending</Badge>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                        <Calendar className="h-6 w-6 text-blue-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">Music Concert</p>
                                                        <p className="text-xs text-gray-400">Next Week - Saturday 8:00 PM</p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="border-yellow-500 text-yellow-500">Hosting</Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                            </Card>
                        </div>

                        {/* Right: Stats & Recommendations */}
                        <div className="order-3 space-y-6">
                            <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
                                <CardHeader>
                                    <CardTitle className="text-white">Snapshot</CardTitle>
                                    <CardDescription className="text-gray-400">Current status</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-3 text-center">
                                        <div className="p-3 rounded-lg bg-[#2a2a2a]">
                                            <div className="text-2xl text-white font-bold">{stats.activeJobs}</div>
                                            <div className="text-xs text-gray-400">Jobs</div>
                                        </div>
                                        <div className="p-3 rounded-lg bg-[#2a2a2a]">
                                            <div className="text-2xl text-white font-bold">{stats.totalConnections}</div>
                                            <div className="text-xs text-gray-400">Connections</div>
                                        </div>
                                        <div className="p-3 rounded-lg bg-[#2a2a2a]">
                                            <div className="text-2xl text-white font-bold">{stats.newMessages}</div>
                                            <div className="text-xs text-gray-400">Messages</div>
                                        </div>
                                        <div className="p-3 rounded-lg bg-[#2a2a2a]">
                                            <div className="text-2xl text-white font-bold">{stats.pendingRequests}</div>
                                            <div className="text-xs text-gray-400">Requests</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
                                <CardHeader>
                                    <CardTitle className="text-white">Recommendations</CardTitle>
                                    <CardDescription className="text-gray-400">Talents and categories for you</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-4">
                                        <Link href="/category/acting-film" className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f] hover:border-primary/50 transition-colors">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                                                    <Film className="h-5 w-5 text-blue-500" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-medium">Acting & Film</h4>
                                                    <p className="text-xs text-gray-400">Actors, Directors, Technicians</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-400">Find actors, directors, cinematographers, and film pros</p>
                                        </Link>

                                        <Link href="/category/music" className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f] hover:border-primary/50 transition-colors">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                                    <Music className="h-5 w-5 text-green-500" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-medium">Music</h4>
                                                    <p className="text-xs text-gray-400">Musicians, Producers, Singers</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-400">Connect with musicians and producers</p>
                                        </Link>

                                        <Link href="/category/painting" className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f] hover:border-primary/50 transition-colors">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                                    <Palette className="h-5 w-5 text-purple-500" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-medium">Visual Arts</h4>
                                                    <p className="text-xs text-gray-400">Painters, Illustrators</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-400">Discover painters and visual creators</p>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="mt-2">
                            <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Upcoming Events
                                    </CardTitle>
                                    <CardDescription className="text-gray-400">Events you're attending or hosting</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                                    <Calendar className="h-6 w-6 text-purple-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">Art Exhibition 2025</p>
                                                    <p className="text-xs text-gray-400">Tomorrow at 6:00 PM</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="border-green-500 text-green-500">Attending</Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                    <Calendar className="h-6 w-6 text-blue-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">Music Concert</p>
                                                    <p className="text-xs text-gray-400">Next Week - Saturday 8:00 PM</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="border-yellow-500 text-yellow-500">Hosting</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                        </Card>
                    </div>

                    {/* Browse Categories Section */}
                    <div className="mt-2">
                        <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Search className="h-5 w-5" />
                                    Browse by Category
                                </CardTitle>
                                <CardDescription className="text-gray-400">Explore different creative industries</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Link href="/category/acting-film" className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f] hover:border-primary/50 transition-colors">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                                                <Film className="h-5 w-5 text-blue-500" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium">Acting & Film</h4>
                                                <p className="text-xs text-gray-400">Actors, Directors, Technicians</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-400">Find actors, directors, cinematographers, and film industry professionals</p>
                                    </Link>

                                    <Link href="/category/music" className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f] hover:border-primary/50 transition-colors">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                                <Music className="h-5 w-5 text-green-500" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium">Music</h4>
                                                <p className="text-xs text-gray-400">Musicians, Producers, Singers</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-400">Connect with musicians, music producers, and sound engineers</p>
                                    </Link>

                                    <Link href="/category/painting" className="p-4 bg-[#2a2a2a] rounded-lg border border-[#3f3f3f] hover:border-primary/50 transition-colors">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                                <Palette className="h-5 w-5 text-purple-500" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium">Visual Arts</h4>
                                                <p className="text-xs text-gray-400">Painters, Illustrators, Artists</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-400">Discover painters, digital artists, and visual creators</p>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
