"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Package, Warehouse, Clock, Users, Truck,
  ShoppingCart, FileText, TrendingUp, ShoppingBag, Brain,
  RefreshCw, BarChart3, Building2, Wallet, ClipboardList,
  Target, Settings, UserCog, ChevronLeft, ChevronRight, Pill,
  X
} from "lucide-react"

const navSections = [
  {
    label: "OVERVIEW",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    label: "PRODUCTS",
    items: [
      { href: "/products", icon: Package, label: "Products" },
      { href: "/inventory", icon: Warehouse, label: "Inventory" },
      { href: "/expiry", icon: Clock, label: "Expiry Tracking" },
    ],
  },
  {
    label: "CRM",
    items: [
      { href: "/customers", icon: Users, label: "Customers" },
      { href: "/distributors", icon: Truck, label: "Distributors" },
    ],
  },
  {
    label: "SALES",
    items: [
      { href: "/orders", icon: ShoppingCart, label: "Orders" },
      { href: "/billing", icon: FileText, label: "Billing" },
      { href: "/sales", icon: TrendingUp, label: "Sales" },
      { href: "/purchases", icon: ShoppingBag, label: "Purchases" },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      { href: "/ai-insights", icon: Brain, label: "AI Insights" },
      { href: "/reorder", icon: RefreshCw, label: "Reorder Engine" },
      { href: "/demand-forecast", icon: BarChart3, label: "Demand Forecast" },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      { href: "/branches", icon: Building2, label: "Branches" },
      { href: "/finance", icon: Wallet, label: "Finance" },
      { href: "/reports", icon: ClipboardList, label: "Reports" },
      { href: "/targets", icon: Target, label: "Targets" },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      { href: "/settings", icon: Settings, label: "Settings" },
      { href: "/user-management", icon: UserCog, label: "Users & Roles" },
    ],
  },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname()

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-5 border-b border-[var(--sidebar-border)]",
        collapsed && "justify-center px-2"
      )}>
        <div className="flex items-center justify-center w-9 h-9 rounded-xl gradient-bg text-white flex-shrink-0">
          <Pill className="w-5 h-5" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-lg font-bold gradient-text tracking-tight">MediSpot</span>
            <span className="text-[10px] text-[var(--sidebar-text-muted)] uppercase tracking-widest">Pharma CRM</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navSections.map((section) => (
          <div key={section.label} className="mb-2">
            {!collapsed && (
              <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--sidebar-text-muted)]">
                {section.label}
              </p>
            )}
            {collapsed && <div className="border-t border-[var(--sidebar-border)] my-2 mx-2" />}
            {section.items.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    collapsed && "justify-center px-2",
                    isActive
                      ? "bg-[var(--sidebar-active)] sidebar-active-gradient text-[var(--sidebar-active-text)] shadow-sm"
                      : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-foreground"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={cn("w-[18px] h-[18px] flex-shrink-0", isActive && "text-[var(--sidebar-active-text)]")} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className={cn(
        "border-t border-[var(--sidebar-border)] p-3",
        collapsed && "flex justify-center"
      )}>
        {collapsed ? (
          <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
            RS
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              RS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">Rajesh Sharma</p>
              <p className="text-[11px] text-[var(--sidebar-text-muted)]">Super Admin</p>
            </div>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="hidden lg:flex items-center justify-center py-3 border-t border-[var(--sidebar-border)] text-[var(--sidebar-text-muted)] hover:text-foreground hover:bg-[var(--sidebar-hover)] transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onMobileClose} />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] transform transition-transform duration-300 lg:hidden",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <button
          onClick={onMobileClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-[var(--sidebar-hover)] text-[var(--sidebar-text-muted)]"
        >
          <X className="w-5 h-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] sidebar-transition",
        collapsed ? "w-[68px]" : "w-60"
      )}>
        {sidebarContent}
      </aside>
    </>
  )
}
