"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getConnections, getJobHistory } from "@/lib/api";
import Link from "next/link";
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
    BookOpen,
    CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
    const router = useRouter();

    // ✅ Auth state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
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
            setIsLoading(false);
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

    // Loader
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#1a1a1a]">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-t-transparent border-primary" />
            </div>
        );
    }

    // If not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex h-screen bg-[#1a1a1a]">
            {/* Left Sidebar */}
            <div className="w-64 bg-[#1f1f1f] border-r border-[#2f2f2f] flex flex-col">
                {/* Sidebar Header */}
                <div className="border-b border-[#2f2f2f] p-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <h1 className="text-xl font-bold text-white">ArtistKatta</h1>
                    </div>
                </div>
                
                {/* Sidebar Content */}
                <div className="flex-1 p-2">
                    <div className="space-y-4">
                        <div>
                            <p className="text-gray-400 text-xs font-semibold uppercase mb-2">Main</p>
                            <div className="space-y-1">
                                <Link href="/dashboard" className="flex items-center gap-2 p-2 text-white hover:bg-[#2a2a2a] rounded">
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
                        </div>

                        <div>
                            <p className="text-gray-400 text-xs font-semibold uppercase mb-2">Account</p>
                            <div className="space-y-1">
                                <Link href="/profile" className="flex items-center gap-2 p-2 text-white hover:bg-[#2a2a2a] rounded">
                                    <User className="h-4 w-4" />
                                    Profile
                                </Link>
                                <Link href="/settings" className="flex items-center gap-2 p-2 text-white hover:bg-[#2a2a2a] rounded">
                                    <Settings className="h-4 w-4" />
                                    Settings
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Sidebar Footer */}
                <div className="border-t border-[#2f2f2f] p-4">
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

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <header className="flex items-center justify-between p-4 border-b border-[#2f2f2f] bg-[#1f1f1f]">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Dashboard</h2>
                        <p className="text-sm text-gray-400">Welcome back, {userInfo?.fullName || "User"}!</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-[#2a2a2a]">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-[#2a2a2a]">
                            <MessageCircle className="h-5 w-5" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-[#2a2a2a]">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={userInfo?.profileImage || "/placeholder-user.jpg"}
                                            alt={userInfo?.fullName || "User"}
                                        />
                                        <AvatarFallback className="bg-primary text-white">
                                            {userInfo?.fullName?.[0] || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden md:inline-block">{userInfo?.fullName || "User"}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 bg-[#1f1f1f] border-[#2f2f2f]">
                                <DropdownMenuLabel className="text-white">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium">{userInfo?.fullName || "User"}</p>
                                        <p className="text-xs text-gray-400">{userInfo?.emailId || "email@example.com"}</p>
                                        <p className="text-xs text-gray-400">{userInfo?.userCategory} • {userInfo?.userCategoryType}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-[#2f2f2f]" />
                                <DropdownMenuItem className="text-white hover:bg-[#2a2a2a]" onClick={() => router.push("/dashboard")}>
                                    <Home className="mr-2 h-4 w-4" /> Dashboard
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-white hover:bg-[#2a2a2a]" onClick={() => router.push("/profile")}>
                                    <User className="mr-2 h-4 w-4" /> Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-white hover:bg-[#2a2a2a]" onClick={() => router.push("/settings")}>
                                    <Settings className="mr-2 h-4 w-4" /> Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-[#2f2f2f]" />
                                <DropdownMenuItem
                                    className="text-red-400 hover:bg-[#2a2a2a]"
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

                {/* Main Content with Right Sidebar */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto p-6 bg-[#1a1a1a]">
                        {/* Welcome Section */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-white mb-2">
                                👋 Welcome back, {userInfo?.fullName || "User"}!
                            </h1>
                            <p className="text-gray-400">Here's what's happening with your account today.</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

                        {/* Quick Actions & Activity Feed */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Quick Actions */}
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

                        {/* Upcoming Events */}
                        <div className="mt-6">
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
                    </main>

                    {/* Right Sidebar */}
                    <aside className="w-80 border-l border-[#2f2f2f] bg-[#1f1f1f] p-6 overflow-y-auto hidden xl:block">
                        {/* In Demand Talents */}
                        <Card className="bg-[#1f1f1f] border-[#2f2f2f] mb-6">
                            <CardHeader>
                                <CardTitle className="text-white text-lg">In Demand Talents</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Palette className="h-4 w-4 text-primary" />
                                        <span className="text-white font-medium">Visual Arts</span>
                                    </div>
                                    <div className="pl-6 space-y-1">
                                        <p className="text-sm text-gray-400">• Digital Artist</p>
                                        <p className="text-sm text-gray-400">• Illustrator</p>
                                        <p className="text-sm text-gray-400">• Graphic Designer</p>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Music className="h-4 w-4 text-primary" />
                                        <span className="text-white font-medium">Music</span>
                                    </div>
                                    <div className="pl-6 space-y-1">
                                        <p className="text-sm text-gray-400">• Music Producer</p>
                                        <p className="text-sm text-gray-400">• Sound Engineer</p>
                                        <p className="text-sm text-gray-400">• Vocalist</p>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Film className="h-4 w-4 text-primary" />
                                        <span className="text-white font-medium">Film & TV</span>
                                    </div>
                                    <div className="pl-6 space-y-1">
                                        <p className="text-sm text-gray-400">• Director</p>
                                        <p className="text-sm text-gray-400">• Cinematographer</p>
                                        <p className="text-sm text-gray-400">• Editor</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Jobs */}
                        <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
                            <CardHeader>
                                <CardTitle className="text-white text-lg">Top Jobs</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="p-3 bg-[#2a2a2a] rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-white font-medium">Film Director</h4>
                                        <Badge variant="outline" className="border-primary text-primary">Featured</Badge>
                                    </div>
                                    <p className="text-xs text-gray-400">Mumbai • Full Time</p>
                                </div>
                                <div className="p-3 bg-[#2a2a2a] rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-white font-medium">Music Producer</h4>
                                        <Badge variant="outline" className="border-green-500 text-green-500">Remote</Badge>
                                    </div>
                                    <p className="text-xs text-gray-400">Bangalore • Contract</p>
                                </div>
                                <div className="p-3 bg-[#2a2a2a] rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-white font-medium">Video Editor</h4>
                                        <Badge variant="outline" className="border-blue-500 text-blue-500">Urgent</Badge>
                                    </div>
                                    <p className="text-xs text-gray-400">Delhi • Contract • Hybrid</p>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </div>
        </div>
    );
}

