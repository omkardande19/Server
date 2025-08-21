import type { Metadata } from "next"
import SignUpPageClient from "./signup-page-client"

export const metadata: Metadata = {
  title: "Sign Up | Artist Katta",
  description: "Create your Artist Katta account",
}

export default function SignUpPage() {
  return <SignUpPageClient />
}

