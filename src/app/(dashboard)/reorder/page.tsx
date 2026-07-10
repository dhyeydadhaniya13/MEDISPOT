"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useData } from "@/lib/store"
import { useToast } from "@/lib/toast"
import { formatDate, formatCurrency } from "@/lib/utils"
import { RefreshCw, Brain, Zap, CalendarClock, ShoppingCart, Search } from "lucide-react"

export default function ReorderPage() {
  const router = useRouter()
  const { reorderSuggestions, addOrder, products, logActivity } = useData()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")

  const highConfidence = useMemo(() => reorderSuggestions.filter(r => r.confidence >= 85).length, [reorderSuggestions])
  const dueToday = useMemo(() => reorderSuggestions.filter(r => new Date(r.expectedReorderDate) <= new Date()).length, [reorderSuggestions])
  const dueThisWeek = useMemo(() => reorderSuggestions.filter(r => {
    const d = new Date(r.expectedReorderDate);
    const now = new Date();
    const week = new Date();
    week.setDate(now.getDate() + 7);
    return d <= week
  }).length, [reorderSuggestions])

  const handleCreateOrder = (r: typeof reorderSuggestions[0]) => {
    const prod = products.find(p => p.name.toLowerCase() === r.productName.toLowerCase())
    const price = prod ? prod.sellingPrice : 150
    const total = r.recommendedQty * price

    const order = addOrder({
      orderNumber: `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      customerId: r.customerId,
      customerName: r.customerName,
      date: new Date().toISOString().split("T")[0],
      items: [{ productName: r.productName, quantity: r.recommendedQty, price }],
      total,
      status: "Pending",
      branchId: "BR001"
    })

    logActivity({
      type: "order",
      title: "Reorder suggestion converted",
      description: `Created Order ${order.orderNumber} for ${r.customerName} - ${r.recommendedQty}x ${r.productName}`,
      user: "Rajesh Sharma",
      icon: "ShoppingCart"
    })

    toast("success", "Order Created Successfully", `Order ${order.orderNumber} created for ${formatCurrency(total)}`)
    router.push("/orders")
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><RefreshCw className="w-6 h-6 text-[var(--primary)]" /> Smart Repeat Order Engine</h1><p className="text-sm text-[var(--muted-foreground)] flex items-center gap-1"><Brain className="w-4 h-4" /> AI-powered reorder predictions based on customer purchase patterns</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Suggestions", value: reorderSuggestions.length, icon: RefreshCw, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40" },
          { label: "High Confidence (>85%)", value: highConfidence, icon: Zap, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40" },
          { label: "Due Today", value: dueToday, icon: CalendarClock, color: "text-red-600 bg-red-100 dark:bg-red-900/40" },
          { label: "Due This Week", value: dueThisWeek, icon: ShoppingCart, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/40" },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 flex items-center gap-3"><div className={`p-2 rounded-xl ${s.color}`}><s.icon className="w-5 h-5" /></div><div><p className="text-xs text-[var(--muted-foreground)]">{s.label}</p><p className="text-xl font-bold text-foreground">{s.value}</p></div></div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-sm font-semibold">Reorder Suggestions</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input 
              type="text" 
              placeholder="Search customer or product..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full sm:w-64 bg-[var(--muted)] border border-transparent rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[var(--muted)]">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Customer</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Product</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden md:table-cell">Last Order</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden sm:table-cell">Interval</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Reorder By</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Rec. Qty</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Confidence</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Action</th>
            </tr></thead>
            <tbody>
              {reorderSuggestions
                .filter(r => 
                  r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  r.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  r.storeName.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .sort((a, b) => new Date(a.expectedReorderDate).getTime() - new Date(b.expectedReorderDate).getTime())
                .map((r, i) => {
                const isDue = new Date(r.expectedReorderDate) <= new Date()
                const confColor = r.confidence >= 85 ? "bg-emerald-500" : r.confidence >= 70 ? "bg-amber-500" : "bg-red-500"
                return (
                  <tr key={i} className={`border-b border-[var(--border)] last:border-0 table-row-hover ${isDue ? "bg-red-50/30 dark:bg-red-900/10" : ""}`}>
                    <td className="py-3 px-4"><p className="font-semibold text-foreground">{r.customerName}</p><p className="text-xs text-[var(--muted-foreground)]">{r.storeName}</p></td>
                    <td className="py-3 px-4 font-medium">{r.productName}</td>
                    <td className="py-3 px-4 text-[var(--muted-foreground)] hidden md:table-cell">{formatDate(r.lastOrderDate)}</td>
                    <td className="py-3 px-4 text-center hidden sm:table-cell"><span className="px-2 py-0.5 text-xs rounded-full bg-[var(--muted)] font-medium">{r.avgInterval}d</span></td>
                    <td className="py-3 px-4"><span className={`text-sm font-medium ${isDue ? "text-red-600 font-bold" : ""}`}>{formatDate(r.expectedReorderDate)}</span>{isDue && <span className="ml-2 text-[10px] font-bold text-red-600 bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 rounded">DUE</span>}</td>
                    <td className="py-3 px-4 text-right font-semibold">{r.recommendedQty}<span className="text-xs text-[var(--muted-foreground)] ml-1">(was {r.lastQty})</span></td>
                    <td className="py-3 px-4 text-center"><div className="flex items-center justify-center gap-2"><div className="w-16 h-1.5 bg-[var(--border)] rounded-full overflow-hidden"><div className={`h-full rounded-full ${confColor}`} style={{width:`${r.confidence}%`}} /></div><span className="text-xs font-semibold min-w-[30px]">{r.confidence}%</span></div></td>
                    <td className="py-3 px-4 text-center"><button onClick={() => handleCreateOrder(r)} className="px-3 py-1.5 gradient-bg text-white rounded-lg text-xs font-medium hover:opacity-90">Create Order</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
