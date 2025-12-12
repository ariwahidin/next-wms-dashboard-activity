"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, LogIn, User, Package, Truck, MapPin } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    document.title = "Login - WMS Activity"
    setMounted(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!email || !password) {
        setError("Email and password are required")
        return
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
        credentials: "include"
      })

      const result = await res.json()

      if (!result.success) {
        setError(result.message || "Login failed")
        return
      }

      console.log("LOGIN OK, PUSH DASHBOARD")
      router.push("/dashboard")
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Pattern */}
      {mounted && (
        <>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>

          {/* Decorative Icons */}
          <div className="absolute inset-0 pointer-events-none">
            <Package className="absolute top-20 left-20 w-8 h-8 text-blue-400/20 animate-bounce duration-3000" />
            <Truck className="absolute top-40 right-32 w-10 h-10 text-orange-400/20 animate-bounce duration-4000 delay-500" />
            <MapPin className="absolute bottom-32 left-40 w-6 h-6 text-cyan-400/20 animate-bounce duration-3500 delay-1000" />
            <Package className="absolute bottom-20 right-20 w-7 h-7 text-blue-400/20 animate-bounce duration-4500 delay-1500" />
          </div>
        </>
      )}

      <div className="w-full max-w-md relative z-10">
        {/* Card Container */}
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
          {/* Top Accent Bar */}
          <div className="h-2 bg-gradient-to-r from-blue-500 via-orange-500 to-cyan-500"></div>
          
          <div className="p-8 sm:p-10">
            {/* Logo/Header */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-5">
                {mounted && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-orange-500 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                )}
                <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-orange-500 rounded-2xl shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                WMS Activity
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Warehouse Management System
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-orange-500 rounded-xl opacity-0 group-focus-within:opacity-20 blur transition-opacity"></div>
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe"
                    className="relative w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-orange-500 rounded-xl opacity-0 group-focus-within:opacity-20 blur transition-opacity"></div>
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="relative w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors z-10 text-lg"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800">
                  <p className="text-sm font-medium text-red-600 dark:text-red-400 text-center">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full py-3.5 px-4 bg-gradient-to-r from-blue-500 via-blue-600 to-orange-500 hover:from-blue-600 hover:via-blue-700 hover:to-orange-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-6 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="relative">Logging in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 relative" />
                    <span className="relative">Login to Dashboard</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Decorative Elements */}
          <div className="px-8 sm:px-10 pb-8">
            <div className="flex items-center justify-center gap-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Truck className="w-4 h-4" />
                <span className="text-xs font-medium">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Package className="w-4 h-4" />
                <span className="text-xs font-medium">Smart Tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6 font-medium">
          © 2025 WMS Activity. All rights reserved.
        </p>
      </div>
    </div>
  )
}