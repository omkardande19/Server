"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MapPin, Briefcase, Users2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Send } from "lucide-react"

// Temporary mock data
const mockUsers = [
  {
    id: 1,
    name: "Sarah Chen",
    username: "@sarahchen",
    avatar: "/placeholder.svg?height=40&width=40",
    profession: "Visual Artist",
    location: "San Francisco, CA",
    connections: 245,
    tags: ["Digital Art", "Illustration", "Character Design"],
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    username: "@marcusrod",
    avatar: "/placeholder.svg?height=40&width=40",
    profession: "Music Producer",
    location: "Los Angeles, CA",
    connections: 189,
    tags: ["Electronic", "Hip Hop", "Sound Design"],
  },
  {
    id: 3,
    name: "Emma Thompson",
    username: "@emmathompson",
    avatar: "/placeholder.svg?height=40&width=40",
    profession: "Theater Director",
    location: "New York, NY",
    connections: 312,
    tags: ["Stage Direction", "Dramaturgy", "Production"],
  },
  // Add more mock users as needed
]

const categories = ["All Categories", "Visual Arts", "Music", "Theater & Film", "Dance", "Literature", "Photography"]

export default function ChatBotPageClient() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", content: "Hello! How can I assist you today?" },
  ])
  const [messageInput, setMessageInput] = useState("")

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, sender: "user", content: messageInput },
      ])
      setMessageInput("")
      // Simulate bot response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: prevMessages.length + 1, sender: "bot", content: "I'm here to help!" },
        ])
      }, 1000)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Chat Header */}
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Creative Assistant</h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-xs p-3 rounded-lg",
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}

