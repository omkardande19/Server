import type { Metadata } from "next"
import VisualArtsPageClient from "./visual-arts-page-client"

export const metadata: Metadata = {
  title: "Visual Arts | Artist Katta",
  description: "Discover paintings, digital art, photography, and more from talented visual artists",
}

export default function VisualArtsPage() {
  return <VisualArtsPageClient />
}

