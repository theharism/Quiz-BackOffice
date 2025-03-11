"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    isAuthenticated().then((data)=>{
        if(data === false && pathname !== "/admin")
        {
            router.push("/admin")
        }
    }).finally(()=>setLoading(false))
  }, [router, pathname])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    )
  }

  return <>{children}</>
}

