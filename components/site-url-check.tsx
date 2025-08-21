"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

export function SiteUrlCheck() {
  const [siteUrl, setSiteUrl] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(true)

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SITE_URL
    setSiteUrl(url || null)

    if (!url) {
      setIsValid(false)
      return
    }

    try {
      new URL(url)
      setIsValid(true)
    } catch {
      setIsValid(false)
    }
  }, [])

  if (isValid) {
    return null
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <Card className="p-6 bg-ink-light border-ink max-w-md">
        <h2 className="text-xl font-semibold text-white mb-4">⚠️ Site URL Configuration Required</h2>
        <p className="text-muted-foreground mb-4">
          The NEXT_PUBLIC_SITE_URL environment variable is {!siteUrl ? "missing" : "invalid"}.
        </p>
        <pre className="bg-ink p-4 rounded-lg text-sm text-white overflow-x-auto whitespace-pre-wrap">
          {`# .env.local or Vercel Environment Variables

NEXT_PUBLIC_SITE_URL=${siteUrl || "https://your-site-url.com"}`}
        </pre>
        <p className="mt-4 text-sm text-muted-foreground">
          Make sure the URL includes the protocol (https://) and matches your deployment URL.
        </p>
      </Card>
    </div>
  )
}

