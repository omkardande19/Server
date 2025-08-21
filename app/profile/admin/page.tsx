import { SelectItem } from "@/components/ui/select"
import { SelectContent } from "@/components/ui/select"
import { SelectValue } from "@/components/ui/select"
import { SelectTrigger } from "@/components/ui/select"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Settings, Shield, Activity, Bell, FileText, Flag, Palette, Building2 } from "lucide-react"

export default function AdminDashboard() {
  const adminStats = {
    totalUsers: 1234,
    activeArtists: 890,
    activeCompanies: 156,
    pendingVerifications: 23,
    reportedContent: 12,
    activeEvents: 45,
  }

  const recentActivities = [
    {
      type: "verification",
      user: "Sarah Johnson",
      action: "Artist verification request",
      time: "2 hours ago",
    },
    {
      type: "report",
      user: "Art Gallery XYZ",
      action: "Content reported for review",
      time: "3 hours ago",
    },
    {
      type: "new_user",
      user: "Mumbai Dance Academy",
      action: "New company registration",
      time: "5 hours ago",
    },
  ]

  return (
    <div className="min-h-screen bg-ink pb-12">
      <div className="container max-w-7xl py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage and monitor platform activities</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-ink-light border-ink">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <h3 className="text-2xl font-bold text-white">{adminStats.totalUsers}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-ink-light border-ink">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Artists</p>
                <h3 className="text-2xl font-bold text-white">{adminStats.activeArtists}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Palette className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-ink-light border-ink">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Companies</p>
                <h3 className="text-2xl font-bold text-white">{adminStats.activeCompanies}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activities */}
            <Card className="p-6 bg-ink-light border-ink">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Recent Activities</h2>
                <Button variant="ghost" size="sm" className="text-white hover:bg-ink-hover">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-ink-hover">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      {activity.type === "verification" && <Shield className="h-5 w-5 text-primary" />}
                      {activity.type === "report" && <Flag className="h-5 w-5 text-primary" />}
                      {activity.type === "new_user" && <Users className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-ink-hover">
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Analytics Chart */}
            <Card className="p-6 bg-ink-light border-ink">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">User Growth</h2>
                <Select defaultValue="30">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Chart component would go here
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6 bg-ink-light border-ink">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start border-ink text-white hover:bg-ink-hover">
                  <Shield className="mr-2 h-4 w-4" />
                  Verify Users
                  {adminStats.pendingVerifications > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {adminStats.pendingVerifications}
                    </Badge>
                  )}
                </Button>
                <Button variant="outline" className="w-full justify-start border-ink text-white hover:bg-ink-hover">
                  <Flag className="mr-2 h-4 w-4" />
                  Review Reports
                  {adminStats.reportedContent > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {adminStats.reportedContent}
                    </Badge>
                  )}
                </Button>
                <Button variant="outline" className="w-full justify-start border-ink text-white hover:bg-ink-hover">
                  <FileText className="mr-2 h-4 w-4" />
                  Manage Content
                </Button>
                <Button variant="outline" className="w-full justify-start border-ink text-white hover:bg-ink-hover">
                  <Settings className="mr-2 h-4 w-4" />
                  Platform Settings
                </Button>
              </div>
            </Card>

            {/* System Status */}
            <Card className="p-6 bg-ink-light border-ink">
              <h2 className="text-lg font-semibold text-white mb-4">System Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Server Status</span>
                  <Badge variant="outline" className="bg-green-500/20 text-green-500">
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">API Health</span>
                  <Badge variant="outline" className="bg-green-500/20 text-green-500">
                    Good
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Backup</span>
                  <span className="text-sm text-muted-foreground">2 hours ago</span>
                </div>
              </div>
            </Card>

            {/* Recent Notifications */}
            <Card className="p-6 bg-ink-light border-ink">
              <h2 className="text-lg font-semibold text-white mb-4">Notifications</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Bell className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-white">New verification requests</p>
                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Activity className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-white">Traffic spike detected</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

