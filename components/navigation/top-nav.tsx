"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Menu, X, Package, LogOut, User, ChevronDown } from "lucide-react"

interface NavItem {
  label: string
  href?: string
  items?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  {
    label: "Operations",
    items: [
      { label: "Inbound", href: "/operations/inbound-activity" },
      { label: "Outbound", href: "/operations/outbound-activity" },
      { label: "Outbound History", href: "/operations/outbound-history" },
      { label: "Inventory", href: "/operations/inventory" },
    ],
  },
]

export function TopNav() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [openMobileMenu, setOpenMobileMenu] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const pathname = usePathname()

  const [openUserMenu, setOpenUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const activeItem =
    navItems.find((n) => (n.href ? n.href === pathname : n.items?.some((i) => i.href === pathname)))?.label ||
    "Dashboard"

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setOpenUserMenu(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setOpenMobileMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await fetch("/api/auth/logout", {
        credentials: "include",
        method: "POST",
      })

      await router.push("/login")
    } finally {
      setIsLoggingOut(false)
      setShowLogoutModal(false)
    }
  }

  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      })
      const data = await res.json()

      if (data.success) {
        setUser(data.user)
      }
    }

    getUser()
  }, [])

  if (!user) {
    return null
  }

  return (
    <>
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-40 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo + Brand */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-orange-500 rounded-xl blur opacity-40"></div>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-orange-500 shadow-lg">
                  <Package className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 block">WMS Activity</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white leading-none">{activeItem}</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <div key={item.label} className="relative">
                  {!item.items && item.href && (
                    <Link
                      href={item.href}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        pathname === item.href
                          ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}

                  {item.items && (
                    <>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1",
                          openDropdown === item.label || item.items.some((i) => i.href === pathname)
                            ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 transition-transform duration-200",
                            openDropdown === item.label && "rotate-180"
                          )}
                        />
                      </button>

                      <div
                        className={cn(
                          "absolute left-0 top-full mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl transition-all duration-200 overflow-hidden",
                          openDropdown === item.label
                            ? "opacity-100 visible translate-y-0"
                            : "opacity-0 invisible -translate-y-2"
                        )}
                      >
                        {item.items.map((subitem, idx) => (
                          <Link
                            key={subitem.label}
                            href={subitem.href}
                            onClick={() => setOpenDropdown(null)}
                            className={cn(
                              "block px-4 py-3 text-sm transition-colors",
                              pathname === subitem.href
                                ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                            )}
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setOpenMobileMenu(!openMobileMenu)}
                className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                {openMobileMenu ? (
                  <X className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                )}
              </button>

              {/* User Profile */}
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setOpenUserMenu(!openUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-orange-500 text-white text-sm font-bold shadow-md group-hover:shadow-lg transition-shadow">
                    {user.username?.charAt(0)?.toUpperCase()}
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform hidden sm:block",
                      openUserMenu && "rotate-180"
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl transition-all duration-200 overflow-hidden",
                    openUserMenu ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                  )}
                >
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-orange-50 dark:from-slate-800 dark:to-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                        {user.username?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {user.username}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 truncate">{user.email}</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setOpenUserMenu(false)
                      setShowLogoutModal(true)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {openMobileMenu && (
            <div
              ref={mobileMenuRef}
              className="md:hidden border-t border-slate-200 dark:border-slate-800 py-4 space-y-1"
            >
              {navItems.map((item) => (
                <div key={item.label}>
                  {!item.items && item.href && (
                    <Link
                      href={item.href}
                      onClick={() => setOpenMobileMenu(false)}
                      className={cn(
                        "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}

                  {item.items && (
                    <>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 transition-transform",
                            openDropdown === item.label && "rotate-180"
                          )}
                        />
                      </button>

                      {openDropdown === item.label && (
                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-200 dark:border-slate-700 pl-4">
                          {item.items.map((subitem) => (
                            <Link
                              key={subitem.label}
                              href={subitem.href}
                              onClick={() => setOpenMobileMenu(false)}
                              className={cn(
                                "block px-4 py-2 rounded-lg text-sm transition-colors",
                                pathname === subitem.href
                                  ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium"
                                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                              )}
                            >
                              {subitem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Modern Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header with gradient */}
            <div className="h-2 bg-gradient-to-r from-blue-500 via-orange-500 to-cyan-500"></div>

            <div className="p-6">
              {/* Icon */}
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <LogOut className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">
                Logout Confirmation
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
                Are you sure you want to logout from your account?
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  disabled={isLoggingOut}
                  className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoggingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      Logout
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}