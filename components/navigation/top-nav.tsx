"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

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
      { label: "Outbound", href: "/operations/outbound-activity" },
    ],
  },
]

export function TopNav() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter()

  // Ambil label sesuai route
  const activeItem =
    navItems.find((n) =>
      n.href ? n.href === pathname : n.items?.some((i) => i.href === pathname)
    )?.label || "Dashboard"


  // Tutup dropdown ketika klik area luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setOpenUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userEmail")
    router.push("/login")
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">

          {/* Logo + dynamic title */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500">
              <span className="text-sm font-bold">📦</span>
            </div>
            <span className="text-lg font-bold text-foreground">
              {activeItem}
            </span>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <div key={item.label} className="relative">

                {/* Jika punya href → jadikan Link */}
                {!item.items && item.href && (
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                )}

                {/* Jika ada sub menu → pakai button */}
                {item.items && (
                  <>
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === item.label ? null : item.label)
                      }
                      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.label} <span className="ml-1">▼</span>
                    </button>

                    <div
                      className={cn(
                        "absolute left-0 top-full mt-0 w-48 rounded-lg border border-border bg-card shadow-lg transition-all duration-200 z-50",
                        openDropdown === item.label ? "opacity-100 visible" : "opacity-0 invisible",
                      )}
                    >
                      {item.items.map((subitem) => (
                        <Link
                          key={subitem.label}
                          href={subitem.href}
                          className="block px-4 py-2.5 text-sm text-muted-foreground hover:bg-background hover:text-foreground first:rounded-t-lg last:rounded-b-lg"
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

          {/* User Profile */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setOpenUserMenu(!openUserMenu)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-90"
            >
              A
            </button>

            {/* Dropdown User Menu */}
            <div
              className={cn(
                "absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card shadow-lg transition-all duration-200 z-50",
                openUserMenu ? "opacity-100 visible" : "opacity-0 invisible"
              )}
            >
              {/* Card User */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    A
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Ari Wahidin</div>
                    <div className="text-xs text-muted-foreground">ari@example.com</div>
                  </div>
                </div>
              </div>

              {/* Tombol Logout */}
              <button
                onClick={() => {
                  if (confirm("Yakin ingin logout?")) {
                    // lakukan logout
                    // window.location.href = "/logout";
                    handleLogout()
                  }
                }}
                className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-background hover:text-foreground rounded-b-lg"
              >
                Logout
              </button>
            </div>
          </div>

        </div>
      </div>
    </nav>
  )
}
