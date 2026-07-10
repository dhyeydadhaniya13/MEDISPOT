"use client"

import { useState, useMemo } from "react"
import { useData } from "@/lib/store"
import { formatCurrency, formatNumber } from "@/lib/utils"
import {
  monthlySalesData, annualRevenueData, categorySalesData,
  branchPerformanceData
} from "@/lib/data"
import {
  IndianRupee, TrendingUp, BarChart3, LineChart, Calendar, ArrowUpRight,
  Users, Truck, Package, ShoppingCart, AlertCircle, PackageX, Clock,
  ArrowUp, ArrowDown, ShoppingBag, UserPlus, FileText, CreditCard,
  AlertTriangle, Zap
} from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"

const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#6366f1"]

const activityIcons: Record<string, React.ElementType> = {
  ShoppingCart, CreditCard, Package, AlertTriangle, UserPlus, FileText, Clock, Truck: Truck, AlertCircle, ArrowRightLeft: Zap,
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    Delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    Shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    Processing: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    Returned: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
  }
  return colors[status] || colors.Pending
}

function getSegmentStyle(segment: string) {
  const styles: Record<string, string> = { Gold: "segment-gold", Silver: "segment-silver", Bronze: "segment-bronze" }
  return styles[segment] || ""
}

function timeAgo(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime()
  const mins = Math.max(0, Math.floor(diff / 60000))
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload) return null
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg p-3">
      <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>{p.name}: {formatCurrency(p.value)}</p>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [timePeriod, setTimePeriod] = useState("today")
  const { products, customers, orders, activities, getDashboardKPIs } = useData()

  // Dynamic KPIs based on selected time period
  const kpis = useMemo(() => getDashboardKPIs(timePeriod), [timePeriod, getDashboardKPIs])

  const kpiCards = [
    { label: "Total Sales", value: kpis.monthlySales, format: "currency", trend: 12.5, icon: IndianRupee, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-400" },
    { label: "Revenue", value: kpis.totalRevenue, format: "currency", trend: 8.3, icon: TrendingUp, color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/40 dark:text-cyan-400" },
    { label: "Profit", value: kpis.totalProfit, format: "currency", trend: 15.2, icon: BarChart3, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400" },
    { label: "Orders", value: kpis.totalOrders, format: "number", trend: 22.1, icon: ShoppingCart, color: "text-violet-600 bg-violet-100 dark:bg-violet-900/40 dark:text-violet-400" },
    { label: "Customers", value: kpis.totalCustomers, format: "number", trend: 5.8, icon: Users, color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/40 dark:text-cyan-400" },
    { label: "Distributors", value: kpis.totalDistributors, format: "number", trend: 2.0, icon: Truck, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400" },
    { label: "Products", value: kpis.totalProducts, format: "number", trend: 8.0, icon: Package, color: "text-violet-600 bg-violet-100 dark:bg-violet-900/40 dark:text-violet-400" },
    { label: "Outstanding", value: kpis.outstandingPayments, format: "currency", trend: -3.2, icon: AlertCircle, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400" },
    { label: "Low Stock", value: kpis.lowStockProducts, format: "plain", trend: -15, icon: PackageX, color: "text-rose-600 bg-rose-100 dark:bg-rose-900/40 dark:text-rose-400" },
    { label: "Expiring Soon", value: kpis.expiringProducts, format: "plain", trend: -8, icon: Clock, color: "text-rose-600 bg-rose-100 dark:bg-rose-900/40 dark:text-rose-400" },
  ]

  const topProducts = useMemo(() => [...products].sort((a, b) => (b.sellingPrice * b.currentStock) - (a.sellingPrice * a.currentStock)).slice(0, 8), [products])
  const topCustomers = useMemo(() => [...customers].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 5), [customers])
  const recentOrders = useMemo(() => [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8), [orders])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Executive Dashboard</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Welcome back, Rajesh. Here&apos;s your business overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={timePeriod} onChange={e => setTimePeriod(e.target.value)} className="px-3 py-2 text-sm bg-[var(--muted)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--ring)] outline-none">
            <option value="today">Today</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="this-quarter">This Quarter</option>
            <option value="this-year">This Year</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 stagger-children">
        {kpiCards.map((card) => (
          <div key={card.label} className="glass-card p-4 kpi-card">
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-xl ${card.color}`}><card.icon className="w-5 h-5" /></div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${card.trend >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {card.trend >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {Math.abs(card.trend)}%
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-[var(--muted-foreground)] font-medium">{card.label}</p>
              <p className="text-xl font-bold text-foreground mt-0.5 animate-count-up">
                {card.format === "currency" ? formatCurrency(card.value) : card.format === "number" ? formatNumber(card.value) : card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[var(--primary)]" /> Monthly Sales Performance</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySalesData}>
                <defs><linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} /><stop offset="95%" stopColor="#4f46e5" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" fill="url(#salesGrad)" strokeWidth={2} name="Sales" />
                <Area type="monotone" dataKey="target" stroke="#06b6d4" fill="none" strokeWidth={2} strokeDasharray="5 5" name="Target" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-[var(--accent)]" /> Annual Revenue & Profit</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={annualRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" tickFormatter={(v) => `₹${(v / 10000000).toFixed(1)}Cr`} />
                <Tooltip content={<CustomTooltip />} /><Legend />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><Package className="w-4 h-4 text-[var(--primary)]" /> Sales by Category</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categorySalesData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="sales" nameKey="category" label={({ name, value }) => `${name} ${value}%`}>
                  {categorySalesData.map((_, index) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}
                </Pie>
                <Tooltip formatter={(value) => [typeof value === 'number' ? formatCurrency(value) : value]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-[var(--accent)]" /> Branch Performance</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchPerformanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                <YAxis type="category" dataKey="branch" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[0, 4, 4, 0]} name="Revenue" />
                <Bar dataKey="target" fill="#06b6d4" radius={[0, 4, 4, 0]} name="Target" opacity={0.4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[var(--primary)]" /> Top Selling Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[var(--border)]">
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase">#</th>
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Product</th>
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden sm:table-cell">Category</th>
                <th className="text-right py-2.5 px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Price</th>
                <th className="text-right py-2.5 px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Stock</th>
                <th className="text-right py-2.5 px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden md:table-cell">Value</th>
              </tr></thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={p.id} className="border-b border-[var(--border)] last:border-0 table-row-hover">
                    <td className="py-2.5 px-3 font-medium text-[var(--muted-foreground)]">{i + 1}</td>
                    <td className="py-2.5 px-3"><p className="font-medium text-foreground">{p.name}</p><p className="text-xs text-[var(--muted-foreground)]">{p.manufacturer}</p></td>
                    <td className="py-2.5 px-3 hidden sm:table-cell"><span className="px-2 py-0.5 text-xs rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-medium">{p.category}</span></td>
                    <td className="py-2.5 px-3 text-right font-medium">{formatCurrency(p.sellingPrice)}</td>
                    <td className="py-2.5 px-3 text-right">{p.currentStock}</td>
                    <td className="py-2.5 px-3 text-right font-semibold hidden md:table-cell">{formatCurrency(p.sellingPrice * p.currentStock)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-[var(--accent)]" /> Top Customers</h3>
          <div className="space-y-3">
            {topCustomers.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--muted)] hover:bg-[var(--muted)]/80 transition-colors">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: COLORS[i] }}>{c.name.split(" ").map(n => n[0]).join("")}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><p className="text-sm font-semibold text-foreground truncate">{c.name}</p><span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full ${getSegmentStyle(c.segment)}`}>{c.segment}</span></div>
                  <p className="text-xs text-[var(--muted-foreground)] truncate">{c.storeName}</p>
                </div>
                <div className="text-right flex-shrink-0"><p className="text-sm font-bold text-foreground">{formatCurrency(c.totalRevenue)}</p><p className="text-[10px] text-[var(--muted-foreground)]">{c.totalOrders} orders</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders & Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-[var(--primary)]" /> Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[var(--border)]">
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Order #</th>
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Customer</th>
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden sm:table-cell">Date</th>
                <th className="text-right py-2.5 px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Total</th>
                <th className="text-center py-2.5 px-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Status</th>
              </tr></thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-[var(--border)] last:border-0 table-row-hover">
                    <td className="py-2.5 px-3 font-medium text-[var(--primary)]">{o.orderNumber}</td>
                    <td className="py-2.5 px-3 text-foreground">{o.customerName}</td>
                    <td className="py-2.5 px-3 text-[var(--muted-foreground)] hidden sm:table-cell">{o.date}</td>
                    <td className="py-2.5 px-3 text-right font-semibold">{formatCurrency(o.total)}</td>
                    <td className="py-2.5 px-3 text-center"><span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(o.status)}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-[var(--accent)]" /> Recent Activity</h3>
          <div className="space-y-0">
            {activities.slice(0, 10).map((a, i) => {
              const Icon = activityIcons[a.icon] || AlertCircle
              const dotColor = a.type === "order" ? "bg-indigo-500" : a.type === "payment" ? "bg-emerald-500" : a.type === "stock" ? "bg-cyan-500" : a.type === "alert" ? "bg-amber-500" : a.type === "customer" ? "bg-violet-500" : "bg-blue-500"
              return (
                <div key={a.id} className="flex gap-3 pb-4 relative">
                  {i < Math.min(activities.length, 10) - 1 && <div className="absolute left-[13px] top-7 bottom-0 w-px bg-[var(--border)]" />}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${dotColor}`}><Icon className="w-3.5 h-3.5 text-white" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{a.title}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5 line-clamp-2">{a.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-[var(--muted-foreground)]">{timeAgo(a.timestamp)}</span>
                      <span className="text-[10px] text-[var(--muted-foreground)]">•</span>
                      <span className="text-[10px] text-[var(--primary)] font-medium">{a.user}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
