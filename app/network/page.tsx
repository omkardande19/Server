import type { Metadata } from "next"
import NetworkPageClient from "./network-page-client"

export const metadata: Metadata = {
  title: "Network - Artist Katta",
  description: "Connect with creative professionals, artists, musicians, and performers",
}

export default function NetworkPage() {
  return <NetworkPageClient />
}

