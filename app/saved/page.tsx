import type { Metadata } from "next"
import SavedPageClient from "./saved-page-client"

export const metadata: Metadata = {
  title: "Saved Items | Artist Katta",
  description: "Access your bookmarked jobs, artists, and events",
}

export default function SavedPage() {
  return <SavedPageClient />
}

