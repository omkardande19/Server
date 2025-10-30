import type { Metadata } from "next"
import ActivityPageClient from "./activity-page-client"

export const metadata: Metadata = {
  title: "Activity | Artist Katta",
  description: "Track your applications, connections, and interactions",
}

export default function ActivityPage() {
  return <ActivityPageClient />
}

