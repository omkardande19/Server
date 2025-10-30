"use client"

import { usePathname } from "next/navigation"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Palette, Music, BookOpen, TheaterIcon as Theatre } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface TalentCategory {
  name: string
  icon: React.ComponentType<{ className?: string }>
  subCategories?: string[]
  count: number
  isActive?: boolean
}

export default function RightSidebar() {
  const pathname = usePathname()

  console.log('Current pathname:', pathname) // Debug log

  // Hide sidebar on auth pages - updated check
  if (pathname?.includes('login') || pathname?.includes('signup')) {
    return null
  }

  // Alternative check if the above doesn't work
  if (['/login', '/signup', '/(auth)/login', '/(auth)/signup'].includes(pathname || '')) {
    return null
  }

  // Rest of the component code remains the same...
  const talentCategories: TalentCategory[] = [
    {
      name: "Visual Arts",
      icon: Palette,
      subCategories: ["Painter", "Sketch Artist", "Digital Artist", "Sculptor"],
      count: 1234,
      isActive: true,
    },
    {
      name: "Music",
      icon: Music,
      subCategories: ["Vocalist", "Guitarist", "Drummer", "Pianist"],
      count: 890,
    },
    {
      name: "Performing Arts",
      icon: Theatre,
      subCategories: ["Actor", "Dancer", "Theatre Artist"],
      count: 567,
    },
    {
      name: "Writing",
      icon: BookOpen,
      subCategories: ["Content Writer", "Poet", "Screenwriter", "Novelist"],
      count: 432,
    },
  ]

  const featuredArtists = [
    {
      name: "Director",
      talent: "Film Industry",
      image: "/placeholder.svg",
      verified: true,
    },
    {
      name: "Music Producer",
      talent: "Music Industry",
      image: "/placeholder.svg",
      verified: true,
    },
    {
      name: "Film Editor:",
      talent: "Film Industry",
      image: "/placeholder.svg",
      verified: false,
    },
  ]

  return (
    <aside className="fixed right-0 top-14 h-[calc(100vh-3.5rem)] w-[320px] border-l border-ink bg-ink-light hidden lg:block">
      <Card className="p-4 mb-4 bg-[#1A1A1A] border-[#2f2f2f]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">In Demand Talents</h3>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:bg-[#1f1f1f]">
            See All
          </Button>
        </div>
        <div className="space-y-1">
          {talentCategories.map((category) => (
            <div key={category.name} className="space-y-1">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start font-medium text-white",
                  category.isActive ? "bg-[#1f1f1f]" : "hover:bg-[#1f1f1f]",
                )}
              >
                <category.icon className="mr-2 h-4 w-4" />
                {category.name}
                {/* <span className="ml-auto text-xs text-muted-foreground">{category.count.toLocaleString()}</span> */}
              </Button>
              {category.isActive && category.subCategories && (
                <div className="ml-6 space-y-1">
                  {category.subCategories.map((sub) => (
                    <Button
                      key={sub}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm font-normal text-white hover:bg-[#1f1f1f]"
                    >
                      {sub}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 bg-[#1A1A1A] border-[#2f2f2f]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Top Jobs</h3>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:bg-[#1f1f1f]">
            View More
          </Button>
        </div>
        <div className="space-y-4">
          {featuredArtists.map((artist) => (
            <div key={artist.name} className="flex items-center space-x-3">
              <Image
                src={artist.image || "/placeholder.svg"}
                alt={artist.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="font-medium truncate text-white">{artist.name}</p>
                  {artist.verified && (
                    <svg className="h-4 w-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{artist.talent}</p>
              </div>
              {/* <Button variant="secondary" size="sm" className="bg-[#1f1f1f] hover:bg-[#2f2f2f] text-white">
                Follow
              </Button> */}
            </div>
          ))}
        </div>
      </Card>
    </aside>
  )
}

