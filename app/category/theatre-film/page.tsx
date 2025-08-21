import type { Metadata } from "next"
import TheatreFilmPageClient from "./theatre-film-page-client"

export const metadata: Metadata = {
  title: "Theatre & Film | Artist Katta",
  description: "Discover talented actors, directors, upcoming productions, and opportunities in theatre and film",
}

export default function TheatreFilmPage() {
  return <TheatreFilmPageClient />
}

