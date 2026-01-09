"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams() // ✅ Next.js 13 App Router way

  // Handle redirect with token from Medusa callback
  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      // Store JWT
      localStorage.setItem("medusa_token", token)
      // Redirect to home or dashboard
      router.replace("/")
    }
  }, [searchParams, router])

  // PKCE + Salesforce login
  const loginWithSalesforce = async (e) => {
  e.preventDefault( )
    // 1️⃣ Generate code_verifier
    const array = new Uint8Array(32)
    window.crypto.getRandomValues(array)
    const code_verifier = Array.from(array, (dec) =>
      ("0" + dec.toString(16)).slice(-2)
    ).join("")

    // 2️⃣ SHA256 → code_challenge
    const encoder = new TextEncoder()
    const data = encoder.encode(code_verifier)
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const base64String = btoa(String.fromCharCode(...hashArray))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")
    const code_challenge = base64String

    // 3️⃣ Set code_verifier in cookie (for Medusa callback)
    document.cookie = `sf_code_verifier=${code_verifier}; path=/; samesite=lax`

    // 4️⃣ Redirect to Salesforce authorize endpoint
    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.NEXT_PUBLIC_SF_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_SF_REDIRECT_URI!,
      scope: "openid email profile",
      code_challenge,
      code_challenge_method: "S256",
    })

    window.location.href = `https://test.salesforce.com/services/oauth2/authorize?${params.toString()}`
  }

  return (
  <>
        <form className="w-full" onSubmit={loginWithSalesforce}>
    {/*     <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div> */}

        {/* <ErrorMessage error={message} data-testid="login-error-message" /> */}
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6">
          Sign in
        </SubmitButton>
      </form>
   {/*  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Login to Store</h1>
      <button
        onClick={loginWithSalesforce}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Login with Salesforce
      </button>
    </div> */}
  </>
    
  )
}
