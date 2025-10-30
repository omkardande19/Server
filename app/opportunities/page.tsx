import type { Metadata } from "next"
import OpportunitiesPageClient from "./opportunities-page-client"

export const metadata: Metadata = {
  title: "Opportunities | Artist Katta",
  description: "Find jobs, gigs, auditions, and opportunities in the creative industry",
}

export default function OpportunitiesPage() {
  return <OpportunitiesPageClient />
}

