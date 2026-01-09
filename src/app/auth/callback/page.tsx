"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { authUser } from "@lib/data/customer"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()




  useEffect(() => {
    const token = searchParams.get("token")
    const error = searchParams.get("error")

    if (error) {
      console.error("Auth error:", error)
      router.replace("/login?error=auth_failed")
      return
    }

    if (!token) {
      router.replace("/login?error=missing_token")
      return
    }

    // Store Medusa JWT
    localStorage.setItem("medusa_token", token)
    authUser(token)
    // Redirect to home or dashboard
    router.replace("/")
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h1 className="text-xl font-semibold mb-2">
          Signing you in…
        </h1>
        <p className="text-gray-600">
          Please wait while we complete your login.
        </p>
      </div>
    </div>
  )
}
