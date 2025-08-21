import type { Metadata } from "next"
import MusicPageClient from "./music-page-client"

export const metadata: Metadata = {
  title: "Music | Artist Katta",
  description: "Discover talented musicians, upcoming performances, and opportunities in the music industry",
}

export default function MusicPage() {
  return <MusicPageClient />
}

