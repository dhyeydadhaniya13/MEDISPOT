"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("medispot_authenticated")
      if (auth === "true") {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }
  }, [router])

  return null
}
