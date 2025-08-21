import type { Metadata } from "next"
import PerformingArtsPageClient from "./performing-arts-page-client"

export const metadata: Metadata = {
  title: "Performing Arts | Artist Katta",
  description:
    "Discover talented performers, upcoming shows, and opportunities in theatre, dance, music, and circus arts",
}

export default function PerformingArtsPage() {
  return <PerformingArtsPageClient />
}

