import { redirect } from 'next/navigation'
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Artist Katta | Connect, Create, Collaborate",
  description: "A social platform for artists, musicians, actors, writers and creative professionals",
}

export default function HomePage() {
  redirect('/dashboard')
}

