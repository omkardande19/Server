import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClientLayout } from "@/app/client-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Artist Katta | Connect, Create, Collaborate",
  description: "A social platform for artists, musicians, actors, writers and creative professionals"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-ink`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
