"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Briefcase,
  MessageSquare,
  ThumbsUp,
  Users,
  Calendar,
  Clock,
  Mail,
  Eye,
  CheckCircle2,
  XCircle,
  Share2,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ActivityPageClient() {
  const [selectedTab, setSelectedTab] = useState("all")

  const activities = [
    {
      id: 1,
      type: "application",
      title: "Application Update",
      company: "Creative Studios",
      position: "Senior Visual Artist",
      status: "shortlisted",
      companyLogo: "/placeholder.svg",
      timestamp: "2024-02-21T10:30:00Z",
      unread: true,
    },
    {
      id: 2,
      type: "connection",
      user: {
        name: "Priya Sharma",
        title: "Classical Dancer",
        image: "/placeholder.svg",
      },
      action: "accepted",
      timestamp: "2024-02-21T09:15:00Z",
      unread: true,
    },
    {
      id: 3,
      type: "message",
      user: {
        name: "Rahul Mehta",
        title: "Music Director",
        image: "/placeholder.svg",
      },
      preview: "Hi, I saw your portfolio and would love to collaborate...",
      timestamp: "2024-02-20T16:45:00Z",
      unread: false,
    },
    {
      id: 4,
      type: "like",
      user: {
        name: "Art Gallery Mumbai",
        title: "Art Gallery",
        image: "/placeholder.svg",
      },
      content: "your recent artwork submission",
      timestamp: "2024-02-20T14:30:00Z",
      unread: false,
    },
    {
      id: 5,
      type: "event",
      title: "Contemporary Art Exhibition",
      organizer: "National Gallery",
      status: "upcoming",
      date: "March 15-20, 2024",
      timestamp: "2024-02-19T11:20:00Z",
      unread: false,
    },
  ]

  const notifications = activities.filter((activity) => activity.unread)
  const applications = activities.filter((activity) => activity.type === "application")
  const connections = activities.filter((activity) => activity.type === "connection")
  const messages = activities.filter((activity) => activity.type === "message")

  const getActivityIcon = (type: string, status?: string) => {
    switch (type) {
      case "application":
        if (status === "shortlisted") return <CheckCircle2 className="h-5 w-5 text-green-500" />
        if (status === "rejected") return <XCircle className="h-5 w-5 text-red-500" />
        return <Briefcase className="h-5 w-5 text-primary" />
      case "connection":
        return <Users className="h-5 w-5 text-primary" />
      case "message":
        return <MessageSquare className="h-5 w-5 text-primary" />
      case "like":
        return <ThumbsUp className="h-5 w-5 text-primary" />
      case "event":
        return <Calendar className="h-5 w-5 text-primary" />
      default:
        return <Bell className="h-5 w-5 text-primary" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 24) {
      return `${hours} hours ago`
    } else {
      return `${days} days ago`
    }
  }

  return (
    <div className="container max-w-4xl py-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">Activity</h1>
        <p className="text-muted-foreground">Track your applications, connections, and interactions</p>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-ink-light border-ink">
          <div className="flex flex-col items-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{notifications.length}</div>
              <div className="text-sm text-muted-foreground">Unread</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-ink-light border-ink">
          <div className="flex flex-col items-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{applications.length}</div>
              <div className="text-sm text-muted-foreground">Applications</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-ink-light border-ink">
          <div className="flex flex-col items-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{connections.length}</div>
              <div className="text-sm text-muted-foreground">Connections</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-ink-light border-ink">
          <div className="flex flex-col items-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{messages.length}</div>
              <div className="text-sm text-muted-foreground">Messages</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Feed */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-ink-light border-ink h-12">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Bell className="h-4 w-4 mr-2" />
            All Activity
          </TabsTrigger>
          <TabsTrigger value="applications" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Briefcase className="h-4 w-4 mr-2" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="connections" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Users className="h-4 w-4 mr-2" />
            Connections
          </TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {activities.map((activity) => (
            <Card
              key={activity.id}
              className={cn(
                "p-4 bg-ink-light border-ink hover:bg-ink-hover transition-colors",
                activity.unread && "border-l-4 border-l-primary",
              )}
            >
              <div className="flex items-start gap-4">
                {activity.type === "application" ? (
                  <Image
                    src={activity.companyLogo || "/placeholder.svg"}
                    alt={activity.company}
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                ) : activity.type !== "event" ? (
                  <Image
                    src={activity.user.image || "/placeholder.svg"}
                    alt={activity.user.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      {activity.type === "application" && (
                        <>
                          <p className="font-medium text-white">
                            Application {activity.status === "shortlisted" ? "Shortlisted" : "Update"}
                          </p>
                          <p className="text-muted-foreground">
                            Your application for <span className="text-primary">{activity.position}</span> at{" "}
                            <span className="text-primary">{activity.company}</span> has been shortlisted
                          </p>
                        </>
                      )}
                      {activity.type === "connection" && (
                        <>
                          <p className="font-medium text-white">New Connection</p>
                          <p className="text-muted-foreground">
                            <span className="text-primary">{activity.user.name}</span> ({activity.user.title}) accepted
                            your connection request
                          </p>
                        </>
                      )}
                      {activity.type === "message" && (
                        <>
                          <p className="font-medium text-white">New Message</p>
                          <p className="text-muted-foreground">
                            <span className="text-primary">{activity.user.name}</span>: {activity.preview}
                          </p>
                        </>
                      )}
                      {activity.type === "like" && (
                        <>
                          <p className="font-medium text-white">New Like</p>
                          <p className="text-muted-foreground">
                            <span className="text-primary">{activity.user.name}</span> liked {activity.content}
                          </p>
                        </>
                      )}
                      {activity.type === "event" && (
                        <>
                          <p className="font-medium text-white">Event Reminder</p>
                          <p className="text-muted-foreground">
                            Upcoming event: <span className="text-primary">{activity.title}</span> by{" "}
                            {activity.organizer} on {activity.date}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {activity.unread && (
                        <Badge variant="outline" className="bg-primary/20 text-primary border-0">
                          New
                        </Badge>
                      )}
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        {activity.type === "message" ? (
                          <Mail className="h-4 w-4" />
                        ) : activity.type === "application" ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <Share2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {formatTimestamp(activity.timestamp)}
                    </div>
                    {activity.type === "application" && (
                      <Button size="sm" variant="outline" className="border-ink text-white hover:bg-ink-hover">
                        View Application
                      </Button>
                    )}
                    {activity.type === "message" && (
                      <Button size="sm" variant="outline" className="border-ink text-white hover:bg-ink-hover">
                        Reply
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          {applications.map((activity) => (
            <Card
              key={activity.id}
              className={cn(
                "p-4 bg-ink-light border-ink hover:bg-ink-hover transition-colors",
                activity.unread && "border-l-4 border-l-primary",
              )}
            >
              {/* Similar structure as above, but only for applications */}
              <div className="flex items-start gap-4">
                <Image
                  src={activity.companyLogo || "/placeholder.svg"}
                  alt={activity.company}
                  width={48}
                  height={48}
                  className="rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-white">
                        Application {activity.status === "shortlisted" ? "Shortlisted" : "Update"}
                      </p>
                      <p className="text-muted-foreground">
                        Your application for <span className="text-primary">{activity.position}</span> at{" "}
                        <span className="text-primary">{activity.company}</span> has been shortlisted
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {activity.unread && (
                        <Badge variant="outline" className="bg-primary/20 text-primary border-0">
                          New
                        </Badge>
                      )}
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {formatTimestamp(activity.timestamp)}
                    </div>
                    <Button size="sm" variant="outline" className="border-ink text-white hover:bg-ink-hover">
                      View Application
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="connections" className="space-y-4">
          {connections.map((activity) => (
            <Card
              key={activity.id}
              className={cn(
                "p-4 bg-ink-light border-ink hover:bg-ink-hover transition-colors",
                activity.unread && "border-l-4 border-l-primary",
              )}
            >
              {/* Similar structure as above, but only for connections */}
              <div className="flex items-start gap-4">
                <Image
                  src={activity.user.image || "/placeholder.svg"}
                  alt={activity.user.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-white">New Connection</p>
                      <p className="text-muted-foreground">
                        <span className="text-primary">{activity.user.name}</span> ({activity.user.title}) accepted your
                        connection request
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {activity.unread && (
                        <Badge variant="outline" className="bg-primary/20 text-primary border-0">
                          New
                        </Badge>
                      )}
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {formatTimestamp(activity.timestamp)}
                    </div>
                    <Button size="sm" variant="outline" className="border-ink text-white hover:bg-ink-hover">
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          {messages.map((activity) => (
            <Card
              key={activity.id}
              className={cn(
                "p-4 bg-ink-light border-ink hover:bg-ink-hover transition-colors",
                activity.unread && "border-l-4 border-l-primary",
              )}
            >
              {/* Similar structure as above, but only for messages */}
              <div className="flex items-start gap-4">
                <Image
                  src={activity.user.image || "/placeholder.svg"}
                  alt={activity.user.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-white">New Message</p>
                      <p className="text-muted-foreground">
                        <span className="text-primary">{activity.user.name}</span>: {activity.preview}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {activity.unread && (
                        <Badge variant="outline" className="bg-primary/20 text-primary border-0">
                          New
                        </Badge>
                      )}
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {formatTimestamp(activity.timestamp)}
                    </div>
                    <Button size="sm" variant="outline" className="border-ink text-white hover:bg-ink-hover">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

