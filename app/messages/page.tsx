import type { Metadata } from "next"
import MessagesPageClient from "./messages-page-client"

export const metadata: Metadata = {
  title: "Messages | Creative Jobs",
  description: "Chat with your creative network",
}

export default function MessagesPage() {
  return <MessagesPageClient />
}

