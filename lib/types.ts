export type UserType = "artist" | "company" | "admin"

export interface BaseUser {
  id: string
  name: string
  email: string
  userType: UserType
  profileImage?: string
  createdAt: string
  isVerified?: boolean
}

export interface ArtistUser extends BaseUser {
  userType: "artist"
  artistType: string
  title?: string
  location?: string
  about?: string
  website?: string
  phone?: string
  coverImage?: string
  skills?: string[]
  experience?: {
    role: string
    company: string
    duration: string
    description: string
  }[]
  education?: {
    degree: string
    school: string
    year: string
  }[]
  portfolio?: {
    title: string
    description?: string
    image: string
    type: string
  }[]
  socialLinks?: {
    youtube?: string
    instagram?: string
    website?: string
  }
  expertise?: string[]
  awards?: Array<{
    title: string;
    organization: string;
    year: string;
  }>
}

export interface CompanyUser extends BaseUser {
  userType: "company"
  companyType: string // e.g., 'gallery', 'theatre', 'music_studio'
  description?: string
  location?: string
  website?: string
  establishedYear?: string
  contactInfo?: {
    phone?: string
    email: string
    address?: string
  }
  events?: {
    title: string
    date: string
    description: string
    image?: string
  }[]
  socialLinks?: {
    linkedin?: string
    instagram?: string
    website?: string
  }
  coverImage?: string
}

export interface AdminUser extends BaseUser {
  userType: "admin"
  role: string // e.g., 'super_admin', 'moderator', 'content_manager'
  department?: string
  permissions?: string[]
}

export type User = ArtistUser | CompanyUser | AdminUser

