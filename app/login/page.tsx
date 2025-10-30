import type { Metadata } from "next"
import LoginPageClient from "./login-page-client"

export const metadata: Metadata = {
  title: "Login | Artist Katta",
  description: "Login to your Artist Katta account",
}

export default function LoginPage() {
  return <LoginPageClient />
}

