"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/layout/sidebar"
import Header from "@/components/layout/header"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("medispot_authenticated")
      if (auth !== "true") {
        router.push("/login")
      } else {
        setAuthorized(true)
      }
    }
  }, [router])

  // Prevent rendering children if not authorized
  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className={cn(
        "transition-all duration-300",
        collapsed ? "lg:ml-[68px]" : "lg:ml-60"
      )}>
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 lg:p-6 min-h-[calc(100vh-64px)] animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
