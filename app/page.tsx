import { redirect } from 'next/navigation'
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Artist Katta | Connect, Create, Collaborate",
  description: "A social platform for artists, musicians, actors, writers and creative professionals",
}

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth() // or similar
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [router, isAuthenticated])
  return null
}

