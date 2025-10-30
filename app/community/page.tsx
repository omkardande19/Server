import type { Metadata } from "next"
import CommunityPageClient from "./community-page-client"

export const metadata: Metadata = {
  title: "Community | Artist Katta",
  description: "Connect with talented artists, musicians, photographers, and creative professionals.",
}

export default function CommunityPage() {
  return <CommunityPageClient />
}

