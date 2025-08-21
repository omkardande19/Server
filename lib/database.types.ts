export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          user_type: "artist" | "company" | "admin" | null
          artist_type: string | null
          company_type: string | null
          title: string | null
          location: string | null
          about: string | null
          website: string | null
          phone: string | null
          profile_image_url: string | null
          cover_image_url: string | null
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          user_type?: "artist" | "company" | "admin" | null
          artist_type?: string | null
          company_type?: string | null
          title?: string | null
          location?: string | null
          about?: string | null
          website?: string | null
          phone?: string | null
          profile_image_url?: string | null
          cover_image_url?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          user_type?: "artist" | "company" | "admin" | null
          artist_type?: string | null
          company_type?: string | null
          title?: string | null
          location?: string | null
          about?: string | null
          website?: string | null
          phone?: string | null
          profile_image_url?: string | null
          cover_image_url?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      // Add other table types as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

