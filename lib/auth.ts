import Cookies from "js-cookie"
import type { User, UserType } from "@/lib/types"

class AuthStore {
  private static instance: AuthStore
  private users: User[] = []
  private currentUser: User | null = null

  private constructor() {
    // Initialize with demo data
    this.users.push({
      id: "1",
      name: "Priya Sharma",
      email: "priya@example.com",
      userType: "artist",
      artistType: "dance",
      profileImage: "/placeholder.svg",
      createdAt: new Date().toISOString(),
      isVerified: true,
    })

    // Demo company account
    this.users.push({
      id: "2",
      name: "National Art Gallery",
      email: "contact@nag.com",
      userType: "company",
      companyType: "gallery",
      profileImage: "/placeholder.svg",
      createdAt: new Date().toISOString(),
      isVerified: true,
      description: "Leading art gallery showcasing contemporary and traditional art.",
    })

    // Demo admin account
    this.users.push({
      id: "3",
      name: "Admin Team",
      email: "admin@artistkatta.com",
      userType: "admin",
      role: "super_admin",
      profileImage: "/placeholder.svg",
      createdAt: new Date().toISOString(),
      permissions: ["manage_users", "manage_content", "manage_settings"],
    })

    // Check for existing session
    const savedUser = Cookies.get("user")
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser)
      } catch (e) {
        Cookies.remove("user")
      }
    }
  }

  public static getInstance(): AuthStore {
    if (!AuthStore.instance) {
      AuthStore.instance = new AuthStore()
    }
    return AuthStore.instance
  }

  async signup(userData: Partial<User>): Promise<User> {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      isVerified: false,
      ...userData,
    } as User

    this.users.push(newUser)

    // Automatically log in the user after signup
    this.currentUser = newUser
    Cookies.set("user", JSON.stringify(newUser), { expires: 7 })
    Cookies.set("auth", "true", { expires: 7 })

    return newUser
  }

  async login(email: string, password: string): Promise<User> {
    const user = this.users.find((u) => u.email === email)
    if (!user) {
      throw new Error("Invalid credentials")
    }
    // In a real app, you'd verify the password here
    this.currentUser = user
    Cookies.set("user", JSON.stringify(user), { expires: 7 })
    Cookies.set("auth", "true", { expires: 7 })
    return user
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  logout(): void {
    this.currentUser = null
    Cookies.remove("user")
    Cookies.remove("auth")
  }

  getUserType(): UserType | null {
    return this.currentUser?.userType || null
  }

  isAdmin(): boolean {
    return this.currentUser?.userType === "admin"
  }

  isCompany(): boolean {
    return this.currentUser?.userType === "company"
  }

  isArtist(): boolean {
    return this.currentUser?.userType === "artist"
  }

  async updateProfilePhoto(userId: string, photoUrl: string): Promise<void> {
    const user = this.users.find((u) => u.id === userId)
    if (user) {
      user.profileImage = photoUrl
      // Update the current user if it's them
      if (this.currentUser?.id === userId) {
        this.currentUser.profileImage = photoUrl
        Cookies.set("user", JSON.stringify(this.currentUser), { expires: 7 })
      }
    }
  }

  async updateCoverPhoto(userId: string, photoUrl: string): Promise<void> {
    const user = this.users.find((u) => u.id === userId)
    if (user && "coverImage" in user) {
      ;(user as any).coverImage = photoUrl
      // Update the current user if it's them
      if (this.currentUser?.id === userId) {
        ;(this.currentUser as any).coverImage = photoUrl
        Cookies.set("user", JSON.stringify(this.currentUser), { expires: 7 })
      }
    }
  }
}

export const authStore = AuthStore.getInstance()

