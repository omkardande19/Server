"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { isSupabaseConfigured } from "@/lib/supabase"

export function SupabaseConfigCheck() {
  const [isConfigured, setIsConfigured] = useState(true)

  useEffect(() => {
    setIsConfigured(isSupabaseConfigured())
  }, [])

  if (isConfigured) {
    return null
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <Card className="p-6 bg-ink-light border-ink max-w-md">
        <h2 className="text-xl font-semibold text-white mb-4">⚠️ Configuration Required</h2>
        <p className="text-muted-foreground mb-4">
          Supabase configuration is missing or invalid. Please check your environment variables:
        </p>
        <pre className="bg-ink p-4 rounded-lg text-sm text-white overflow-x-auto whitespace-pre-wrap">
          {`# .env.local

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
        </pre>
        <p className="mt-4 text-sm text-muted-foreground">
          You can find these values in your Supabase project under:
          <br />
          Project Settings → API
        </p>
      </Card>
    </div>
  )
}

