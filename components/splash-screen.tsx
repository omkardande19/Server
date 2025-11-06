"use client"

import { useEffect, useState } from "react"

interface SplashScreenProps {
  onComplete: () => void
  duration?: number
}

export function SplashScreen({ onComplete, duration = 2000 }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 300) // Small delay for smooth transition
          return 100
        }
        return prev + 2
      })
    }, duration / 50)

    return () => clearInterval(interval)
  }, [duration, onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-[#1a1a1a] flex items-center justify-center">
      <div className="text-center">
        {/* ArtistKatta Logo with Animation */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center animate-pulse">
              <span className="text-white font-bold text-4xl">A</span>
            </div>
            {/* Rotating Ring */}
            <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-2xl animate-spin"></div>
          </div>
        </div>
        
        {/* Brand Name with Typewriter Effect */}
        <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in">
          ArtistKatta
        </h1>
        <p className="text-lg text-gray-400 mb-8 animate-fade-in-delay">
          Connecting Creative Professionals
        </p>
        
        {/* Progress Bar */}
        <div className="w-64 h-2 bg-[#2a2a2a] rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Loading Text */}
        <p className="text-sm text-gray-500">
          {progress < 30 && "Initializing..."}
          {progress >= 30 && progress < 60 && "Loading your profile..."}
          {progress >= 60 && progress < 90 && "Setting up dashboard..."}
          {progress >= 90 && "Almost ready!"}
        </p>
        
        {/* Animated Dots */}
        <div className="flex justify-center gap-1 mt-4">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-primary/20 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-primary/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-primary/20 rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 border border-primary/20 rounded-full"></div>
      </div>
    </div>
  )
}

// Add custom CSS animations
const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fade-in-delay {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.6s ease-out;
  }
  
  .animate-fade-in-delay {
    animation: fade-in-delay 0.6s ease-out 0.3s both;
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style")
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}



