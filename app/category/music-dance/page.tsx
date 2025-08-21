import type { Metadata } from "next"
import MusicDancePageClient from "./music-dance-page-client"

export const metadata: Metadata = {
  title: "Music & Dance | Artist Katta",
  description: "Discover talented musicians and dancers, upcoming performances, and opportunities in performing arts",
}

export default function MusicDancePage() {
  return <MusicDancePageClient />
}

