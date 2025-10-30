import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

if (!siteUrl) {
  throw new Error("Missing NEXT_PUBLIC_SITE_URL environment variable")
}

// Validate URL format
try {
  new URL(supabaseUrl)
  new URL(siteUrl)
} catch (error) {
  throw new Error(
    `Invalid URL in environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SITE_URL`,
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
   //redirectTo: `${siteUrl}/auth/callback`,
  },
  global: {
    fetch: (url, options = {}) => {
      const defaultOptions = {
        retries: 3,
        retryDelay: 1000,
        timeout: 30000,
      }

      return fetch(url, {
        ...defaultOptions,
        ...options,
      })
    },
  },
})

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  try {
    return Boolean(supabaseUrl && supabaseAnonKey && siteUrl && new URL(supabaseUrl) && new URL(siteUrl))
  } catch {
    return false
  }
}

// Helper function to check Supabase connection
export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from("profiles").select("count", {
      count: "exact",
      head: true,
    })
    return !error
  } catch {
    return false
  }
}

// Helper function to get the site URL
export const getSiteUrl = () => siteUrl

