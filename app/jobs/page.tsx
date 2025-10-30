import type { Metadata } from "next"
import JobsPageClient from "./page_client"

export const metadata: Metadata = {
  title: "Jobs | Artist Katta",
  description: "Browse jobs posted on Artist Katta",
}

export default function JobsPage() {
  return <JobsPageClient />
}



