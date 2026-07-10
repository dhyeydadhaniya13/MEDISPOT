"use client"

import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useData, SearchResult } from "@/lib/store"
import { useToast } from "@/lib/toast"
import {
  Search, Bell, Sun, Moon, Menu, ChevronDown, User, Settings, LogOut, Building2, X,
  Package, Users, Truck, ShoppingCart, FileText, UserCheck
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/inventory": "Inventory",
  "/expiry": "Expiry Tracking",
  "/customers": "Customers",
  "/distributors": "Distributors",
  "/orders": "Orders",
  "/billing": "Billing",
  "/sales": "Sales",
  "/purchases": "Purchases",
  "/ai-insights": "AI Insights",
  "/reorder": "Reorder Engine",
  "/demand-forecast": "Demand Forecast",
  "/branches": "Branches",
  "/finance": "Finance",
  "/reports": "Reports",
  "/targets": "Sales Targets",
  "/settings": "Settings",
  "/user-management": "User Management",
}

const searchIcons: Record<string, React.ElementType> = {
  product: Package, customer: Users, distributor: Truck,
  order: ShoppingCart, invoice: FileText, user: UserCheck,
}

interface HeaderProps { onMenuClick: () => void }

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { globalSearch, activities } = useData()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [branchMenuOpen, setBranchMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState("Mumbai HQ")

  const userMenuRef = useRef<HTMLDivElement>(null)
  const branchMenuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
      if (branchMenuRef.current && !branchMenuRef.current.contains(e.target as Node)) setBranchMenuOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        document.getElementById("global-search-input")?.focus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        const results = globalSearch(searchQuery)
        setSearchResults(results)
        setShowResults(true)
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 200)
    return () => clearTimeout(timer)
  }, [searchQuery, globalSearch])

  const pageTitle = Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1] || "MediSpot"

  // Use recent activities as notifications
  const notifications = activities.slice(0, 5).map((a, i) => ({
    id: i, title: a.title, desc: a.description, time: a.timestamp, type: a.type
  }))

  const handleSearchSelect = (result: SearchResult) => {
    setSearchQuery("")
    setShowResults(false)
    router.push(result.href)
  }

  return (
    <header className="sticky top-0 z-20 bg-[var(--card)]/80 backdrop-blur-xl border-b border-[var(--border)]">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-[var(--muted)] transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-foreground hidden sm:block">{pageTitle}</h1>
        </div>

        {/* Center - Global Search */}
        <div className="flex-1 max-w-md mx-4 hidden md:block relative" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
              placeholder="Search products, customers, orders..."
              className="w-full pl-10 pr-16 py-2 bg-[var(--muted)] border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all placeholder:text-[var(--muted-foreground)]"
            />
            {searchQuery ? (
              <button type="button" onClick={() => { setSearchQuery(""); setShowResults(false) }} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-[var(--border)] transition-colors">
                <X className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
              </button>
            ) : (
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-[var(--card)] border border-[var(--border)] rounded-md text-[10px] text-[var(--muted-foreground)] font-mono">⌘K</kbd>
            )}
          </div>
          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
              <div className="p-2 border-b border-[var(--border)]">
                <p className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase px-2">{searchResults.length} results</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {searchResults.map((r) => {
                  const Icon = searchIcons[r.type] || Package
                  return (
                    <button key={`${r.type}-${r.id}`} onClick={() => handleSearchSelect(r)} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--muted)] transition-colors text-left">
                      <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-[var(--primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                        <p className="text-[10px] text-[var(--muted-foreground)] truncate">{r.subtitle}</p>
                      </div>
                      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] uppercase flex-shrink-0">{r.type}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          {showResults && searchQuery.length >= 2 && searchResults.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl p-6 text-center z-50 animate-fade-in">
              <p className="text-sm text-[var(--muted-foreground)]">No results found for &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">
          {/* Branch Selector */}
          <div className="relative hidden lg:block" ref={branchMenuRef}>
            <button onClick={() => { setBranchMenuOpen(!branchMenuOpen); setUserMenuOpen(false); setNotifOpen(false) }} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm hover:bg-[var(--muted)] transition-colors">
              <Building2 className="w-4 h-4 text-[var(--muted-foreground)]" />
              <span className="text-sm font-medium">{selectedBranch}</span>
              <ChevronDown className={cn("w-3 h-3 text-[var(--muted-foreground)] transition-transform", branchMenuOpen && "rotate-180")} />
            </button>
            {branchMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg py-1 animate-fade-in z-50">
                {["Mumbai HQ", "Delhi Branch", "Bangalore Branch", "Chennai Branch", "Kolkata Branch"].map((branch) => (
                  <button key={branch} className={cn("w-full px-4 py-2 text-sm text-left hover:bg-[var(--muted)] transition-colors", selectedBranch === branch && "text-[var(--primary)] font-semibold bg-[var(--primary)]/5")}
                    onClick={() => { setSelectedBranch(branch); setBranchMenuOpen(false); toast("info", "Branch Changed", `Switched to ${branch}`) }}>
                    {branch}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); setBranchMenuOpen(false) }} className="relative p-2 rounded-lg hover:bg-[var(--muted)] transition-colors">
              <Bell className="w-5 h-5 text-[var(--muted-foreground)]" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--destructive)] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{notifications.length}</span>
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg animate-fade-in z-50">
                <div className="p-3 border-b border-[var(--border)] flex justify-between items-center">
                  <p className="text-sm font-semibold">Notifications</p>
                  <button onClick={() => { setNotifOpen(false); toast("info", "All notifications marked as read") }} className="text-xs text-[var(--primary)] hover:underline">Mark all read</button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <button key={n.id} onClick={() => setNotifOpen(false)} className="w-full text-left px-4 py-3 hover:bg-[var(--muted)] transition-colors border-b border-[var(--border)] last:border-0">
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{n.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          {mounted && (
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors" title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
              {theme === "dark" ? <Sun className="w-5 h-5 text-[var(--warning)]" /> : <Moon className="w-5 h-5 text-[var(--muted-foreground)]" />}
            </button>
          )}

          {/* User Menu */}
          <div className="relative ml-1" ref={userMenuRef}>
            <button onClick={() => { setUserMenuOpen(!userMenuOpen); setBranchMenuOpen(false); setNotifOpen(false) }} className="flex items-center gap-2 p-1 rounded-lg hover:bg-[var(--muted)] transition-colors">
              <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">RS</div>
              <ChevronDown className={cn("w-3 h-3 text-[var(--muted-foreground)] hidden sm:block transition-transform", userMenuOpen && "rotate-180")} />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg py-1 animate-fade-in z-50">
                <div className="px-4 py-3 border-b border-[var(--border)]">
                  <p className="text-sm font-semibold">Rajesh Sharma</p>
                  <p className="text-xs text-[var(--muted-foreground)]">rajesh@medispot.in</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">Super Admin</span>
                </div>
                <button onClick={() => { setUserMenuOpen(false); router.push("/settings") }} className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-[var(--muted)] transition-colors"><User className="w-4 h-4" /> Profile</button>
                <button onClick={() => { setUserMenuOpen(false); router.push("/settings") }} className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-[var(--muted)] transition-colors"><Settings className="w-4 h-4" /> Settings</button>
                <div className="border-t border-[var(--border)] my-1" />
                <button onClick={() => { setUserMenuOpen(false); localStorage.removeItem("medispot_authenticated"); toast("success", "Logged Out", "You have been signed out successfully"); router.push("/login") }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--destructive)] hover:bg-[var(--destructive)]/5 transition-colors"><LogOut className="w-4 h-4" /> Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
