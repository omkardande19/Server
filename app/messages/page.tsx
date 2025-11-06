"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  getConversations, 
  getConversation, 
  getMessages, 
  sendMessage, 
  markMessagesAsRead 
} from "@/lib/api"
import { 
  MessageCircle, 
  Send, 
  Users, 
  Search,
  Clock,
  Check,
  CheckCheck
} from "lucide-react"

export default function MessagesPage() {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation._id)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadConversations = async () => {
    try {
      const response = await getConversations()
      setConversations(response.conversations || [])
    } catch (error: any) {
      console.error("Error loading conversations:", error)
      alert(error.message || "Failed to load conversations. Please try again.")
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      setLoading(true)
      const response = await getMessages(conversationId, { limit: 50 })
      setMessages(response.messages || [])
      
      // Mark messages as read
      await markMessagesAsRead(conversationId)
    } catch (error: any) {
      console.error("Error loading messages:", error)
      alert(error.message || "Failed to load messages. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const response = await sendMessage({
        conversationId: selectedConversation._id,
        content: newMessage.trim()
      })

      if (response.success) {
        setMessages(prev => [...prev, response.message])
        setNewMessage("")
        
        // Update conversation in list
        setConversations(prev => 
          prev.map(conv => 
            conv._id === selectedConversation._id 
              ? { ...conv, lastMessage: response.message, lastMessageAt: new Date() }
              : conv
          )
        )
      }
    } catch (error: any) {
      console.error("Error sending message:", error)
      alert(error.message || "Failed to send message. Please try again.")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getOtherParticipant = (conversation: any) => {
    const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}')
    return conversation.participants.find((p: any) => p._id !== currentUser.id)
  }

  const getUnreadCount = (conversation: any) => {
    const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}')
    const unread = conversation.unreadCount?.find((u: any) => u.user === currentUser.id)
    return unread?.count || 0
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true
    const otherParticipant = getOtherParticipant(conv)
    return otherParticipant?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="container max-w-6xl py-6 text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-gray-400">Connect and chat with your network</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="bg-[#1f1f1f] border-[#2f2f2f]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Conversations
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#2a2a2a] border-[#3f3f3f] text-white"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 max-h-[500px] overflow-y-auto">
              {filteredConversations.map((conversation) => {
                const otherParticipant = getOtherParticipant(conversation)
                const unreadCount = getUnreadCount(conversation)
                const isSelected = selectedConversation?._id === conversation._id

                return (
                  <div
                    key={conversation._id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 cursor-pointer hover:bg-[#2a2a2a] border-l-4 transition-colors ${
                      isSelected 
                        ? 'bg-[#2a2a2a] border-l-primary' 
                        : 'border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder-user.jpg" alt={otherParticipant?.fullName} />
                        <AvatarFallback>
                          {otherParticipant?.fullName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-medium truncate">
                            {otherParticipant?.fullName || 'Unknown User'}
                          </h4>
                          <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                              <Badge className="bg-primary text-white text-xs">
                                {unreadCount}
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessageAt)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 truncate">
                          {conversation.lastMessage?.content || 'No messages yet'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {otherParticipant?.userCategory} • {otherParticipant?.userCategoryType}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
              {filteredConversations.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No conversations found</p>
                  {searchQuery && (
                    <p className="text-sm mt-2">Try adjusting your search</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <Card className="bg-[#1f1f1f] border-[#2f2f2f] h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b border-[#2f2f2f]">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder-user.jpg" alt={getOtherParticipant(selectedConversation)?.fullName} />
                    <AvatarFallback>
                      {getOtherParticipant(selectedConversation)?.fullName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-white font-medium">
                      {getOtherParticipant(selectedConversation)?.fullName || 'Unknown User'}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {getOtherParticipant(selectedConversation)?.userCategory} • {getOtherParticipant(selectedConversation)?.userCategoryType}
                    </p>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-4 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-400">Loading messages...</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}')
                      const isOwnMessage = message.sender._id === currentUser.id

                      return (
                        <div
                          key={message._id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              isOwnMessage
                                ? 'bg-primary text-white'
                                : 'bg-[#2a2a2a] text-white'
                            }`}
                          >
                            {!isOwnMessage && (
                              <p className="text-xs text-gray-400 mb-1">
                                {message.sender.fullName}
                              </p>
                            )}
                            <p className="text-sm">{message.content}</p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <span className="text-xs opacity-70">
                                {formatTime(message.createdAt)}
                              </span>
                              {isOwnMessage && (
                                <div className="ml-1">
                                  {message.readBy?.length > 1 ? (
                                    <CheckCheck className="h-3 w-3 text-blue-300" />
                                  ) : (
                                    <Check className="h-3 w-3 opacity-70" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t border-[#2f2f2f]">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-[#2a2a2a] border-[#3f3f3f] text-white"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-[#1f1f1f] border-[#2f2f2f] h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p>Choose a conversation from the list to start messaging</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}