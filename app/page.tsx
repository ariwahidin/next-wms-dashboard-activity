"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoadingScreen } from "@/components/loading-screen"

export default function LoadingPage() {
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      router.replace("/login")
    }, 2000); // Simulate loading delay
  }, [router])

  return <LoadingScreen />
}
