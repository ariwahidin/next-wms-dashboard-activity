"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import { LogoutConfirmModal } from "@/components/logout-confirm-modal"

interface NavItem {
  label: string
  href?: string
  items?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  {
    label: "Operations",
    items: [{ label: "Outbound", href: "/operations/outbound-activity" }],
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
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("userEmail")
      await router.push("/login")
    } finally {
      setIsLoggingOut(false)
      setShowLogoutModal(false)
    }
  }

  return (
    <>
      <nav className="border-b border-border bg-card sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo + dynamic title */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500">
                <span className="text-sm font-bold">📦</span>
              </div>
              <span className="hidden sm:inline text-lg font-bold text-foreground">{activeItem}</span>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <div key={item.label} className="relative">
                  {!item.items && item.href && (
                    <Link
                      href={item.href}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}

                  {item.items && (
                    <>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
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

            {/* Right Section - Icons */}
            <div className="flex items-center gap-2">
              {/* Mobile Menu Toggle - Visible only on mobile */}
              <button
                onClick={() => setOpenMobileMenu(!openMobileMenu)}
                className="md:hidden p-2 hover:bg-background rounded-lg transition-colors"
              >
                {openMobileMenu ? (
                  <X className="w-5 h-5 text-foreground" />
                ) : (
                  <Menu className="w-5 h-5 text-foreground" />
                )}
              </button>

              {/* User Profile */}
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setOpenUserMenu(!openUserMenu)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-90"
                >
                  A
                </button>

                <div
                  className={cn(
                    "absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card shadow-lg transition-all duration-200 z-50",
                    openUserMenu ? "opacity-100 visible" : "opacity-0 invisible",
                  )}
                >
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

                  <button
                    onClick={() => {
                      setOpenUserMenu(false)
                      setShowLogoutModal(true)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-background hover:text-foreground rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu - Visible only on mobile */}
          {openMobileMenu && (
            <div ref={mobileMenuRef} className="md:hidden border-t border-border bg-card py-4 space-y-3">
              {navItems.map((item) => (
                <div key={item.label}>
                  {!item.items && item.href && (
                    <Link
                      href={item.href}
                      onClick={() => setOpenMobileMenu(false)}
                      className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-background rounded transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}

                  {item.items && (
                    <>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-background rounded transition-colors flex items-center justify-between"
                      >
                        {item.label}
                        <span className={cn("transition-transform", openDropdown === item.label ? "rotate-180" : "")}>
                          ▼
                        </span>
                      </button>

                      {openDropdown === item.label && (
                        <div className="bg-background rounded ml-2 mt-1 py-1">
                          {item.items.map((subitem) => (
                            <Link
                              key={subitem.label}
                              href={subitem.href}
                              onClick={() => setOpenMobileMenu(false)}
                              className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-card rounded transition-colors"
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

      {/* Logout Confirm Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        isLoading={isLoggingOut}
      />
    </>
  )
}




// "use client"

// import { useEffect, useRef, useState } from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { useRouter } from "next/navigation"

// interface NavItem {
//   label: string
//   href?: string
//   items?: { label: string; href: string }[]
// }

// const navItems: NavItem[] = [
//   { label: "Dashboard", href: "/dashboard" },
//   {
//     label: "Operations",
//     items: [
//       { label: "Outbound", href: "/operations/outbound-activity" },
//     ],
//   },
// ]

// export function TopNav() {
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null)
//   const pathname = usePathname()

//   const [openUserMenu, setOpenUserMenu] = useState(false);
//   const userMenuRef = useRef<HTMLDivElement>(null);
//   const router = useRouter()

//   // Ambil label sesuai route
//   const activeItem =
//     navItems.find((n) =>
//       n.href ? n.href === pathname : n.items?.some((i) => i.href === pathname)
//     )?.label || "Dashboard"


//   // Tutup dropdown ketika klik area luar
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
//         setOpenUserMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);


//   const handleLogout = () => {
//     localStorage.removeItem("isLoggedIn")
//     localStorage.removeItem("userEmail")
//     router.push("/login")
//   }

//   return (
//     <nav className="border-b border-border bg-card">
//       <div className="mx-auto max-w-7xl px-6">
//         <div className="flex h-16 items-center justify-between">

//           {/* Logo + dynamic title */}
//           <div className="flex items-center gap-2">
//             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500">
//               <span className="text-sm font-bold">📦</span>
//             </div>
//             <span className="text-lg font-bold text-foreground">
//               {activeItem}
//             </span>
//           </div>

//           {/* Navigation */}
//           <div className="flex items-center gap-8">
//             {navItems.map((item) => (
//               <div key={item.label} className="relative">

//                 {/* Jika punya href → jadikan Link */}
//                 {!item.items && item.href && (
//                   <Link
//                     href={item.href}
//                     className="text-sm font-medium text-foreground hover:text-primary transition-colors"
//                   >
//                     {item.label}
//                   </Link>
//                 )}

//                 {/* Jika ada sub menu → pakai button */}
//                 {item.items && (
//                   <>
//                     <button
//                       onClick={() =>
//                         setOpenDropdown(openDropdown === item.label ? null : item.label)
//                       }
//                       className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
//                     >
//                       {item.label} <span className="ml-1">▼</span>
//                     </button>

//                     <div
//                       className={cn(
//                         "absolute left-0 top-full mt-0 w-48 rounded-lg border border-border bg-card shadow-lg transition-all duration-200 z-50",
//                         openDropdown === item.label ? "opacity-100 visible" : "opacity-0 invisible",
//                       )}
//                     >
//                       {item.items.map((subitem) => (
//                         <Link
//                           key={subitem.label}
//                           href={subitem.href}
//                           className="block px-4 py-2.5 text-sm text-muted-foreground hover:bg-background hover:text-foreground first:rounded-t-lg last:rounded-b-lg"
//                         >
//                           {subitem.label}
//                         </Link>
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* User Profile */}
//           <div ref={userMenuRef} className="relative">
//             <button
//               onClick={() => setOpenUserMenu(!openUserMenu)}
//               className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-90"
//             >
//               A
//             </button>

//             {/* Dropdown User Menu */}
//             <div
//               className={cn(
//                 "absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card shadow-lg transition-all duration-200 z-50",
//                 openUserMenu ? "opacity-100 visible" : "opacity-0 invisible"
//               )}
//             >
//               {/* Card User */}
//               <div className="p-4 border-b border-border">
//                 <div className="flex items-center gap-3">
//                   <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
//                     A
//                   </div>
//                   <div>
//                     <div className="font-semibold text-foreground">Ari Wahidin</div>
//                     <div className="text-xs text-muted-foreground">ari@example.com</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Tombol Logout */}
//               <button
//                 onClick={() => {
//                   if (confirm("Yakin ingin logout?")) {
//                     handleLogout()
//                   }
//                 }}
//                 className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-background hover:text-foreground rounded-b-lg"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>

//         </div>
//       </div>
//     </nav>
//   )
// }
