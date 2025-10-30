"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Camera, Pencil } from "lucide-react"

interface PhotoUploadProps {
  currentPhotoUrl?: string | null
  onPhotoUpload: (file: File) => Promise<void>
  className?: string
  aspectRatio?: "square" | "cover"
  size?: "sm" | "lg"
  overlayClassName?: string
}

export function PhotoUpload({
  currentPhotoUrl,
  onPhotoUpload,
  className,
  aspectRatio = "square",
  size = "sm",
  overlayClassName,
}: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file.",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
      })
      return
    }

    try {
      setIsUploading(true)
      await onPhotoUpload(file)
      toast({
        title: "Success",
        description: "Photo uploaded successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload photo. Please try again.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const containerStyles = cn(
    "group relative overflow-hidden bg-muted",
    aspectRatio === "square" ? "rounded-full" : "rounded-lg",
    size === "sm" ? "h-[200px] w-[200px]" : "h-[400px] w-full",
    className,
  )

  return (
    <div className={containerStyles}>
      {currentPhotoUrl ? (
        <Image
          src={currentPhotoUrl || "/placeholder.svg"}
          alt="Uploaded photo"
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <Camera className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <div className={`absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity ${overlayClassName}`}>
        <label className="cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isUploading} />
          <Button variant="secondary" size="sm" className="bg-background/80 hover:bg-background" disabled={isUploading}>
            <Pencil className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Change Photo"}
          </Button>
        </label>
      </div>
    </div>
  )
}

