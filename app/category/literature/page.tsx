import type { Metadata } from "next"
import LiteraturePageClient from "./literature-page-client"

export const metadata: Metadata = {
  title: "Literature | Artist Katta",
  description: "Discover writers, poets, upcoming literary events, and publishing opportunities",
}

export default function LiteraturePage() {
  return <LiteraturePageClient />
}

