"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useData } from "@/lib/store"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ShoppingCart, Plus, Search, X } from "lucide-react"
import { OrderStatus, Order } from "@/lib/types"

const statusColors: Record<OrderStatus, string> = { Delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", Shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400", Processing: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", Pending: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400", Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400", Returned: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400" }

export default function OrdersPage() {
  const { orders } = useData()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const filtered = useMemo(() => {
    let result = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    if (search) { const s = search.toLowerCase(); result = result.filter(o => o.orderNumber.toLowerCase().includes(s) || o.customerName.toLowerCase().includes(s)) }
    if (statusFilter !== "All") result = result.filter(o => o.status === statusFilter)
    return result
  }, [orders, search, statusFilter])

  const counts: Record<string, number> = useMemo(() => {
    const c: Record<string, number> = { All: orders.length }
    orders.forEach(o => { c[o.status] = (c[o.status] || 0) + 1 })
    return c
  }, [orders])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><ShoppingCart className="w-6 h-6 text-[var(--primary)]" /> Order Management</h1><p className="text-sm text-[var(--muted-foreground)]">Track and manage all customer orders</p></div>
        <Link href="/orders/new" className="inline-flex items-center gap-2 px-4 py-2.5 gradient-bg text-white rounded-xl font-medium text-sm hover:opacity-90 shadow-md"><Plus className="w-4 h-4" /> New Order</Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {(["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`glass-card p-3 text-center transition-all ${statusFilter === s ? "ring-2 ring-[var(--primary)]" : ""}`}>
            <p className="text-lg font-bold text-foreground">{counts[s] || 0}</p>
            <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{s}</p>
          </button>
        ))}
      </div>

      <div className="glass-card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="w-full pl-10 pr-4 py-2 bg-[var(--muted)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]" /></div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 bg-[var(--muted)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]">
          <option value="All">All Status</option>
          {["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[var(--muted)]">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Order #</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Customer</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden md:table-cell">Date</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden sm:table-cell">Items</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Total</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Status</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-b border-[var(--border)] last:border-0 table-row-hover">
                  <td className="py-3 px-4 font-mono font-medium text-[var(--primary)]">{o.orderNumber}</td>
                  <td className="py-3 px-4 font-medium text-foreground">{o.customerName}</td>
                  <td className="py-3 px-4 text-[var(--muted-foreground)] hidden md:table-cell">{formatDate(o.date)}</td>
                  <td className="py-3 px-4 text-center text-[var(--muted-foreground)] hidden sm:table-cell">{o.items.length}</td>
                  <td className="py-3 px-4 text-right font-semibold">{formatCurrency(o.total)}</td>
                  <td className="py-3 px-4 text-center"><span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[o.status as OrderStatus]}`}>{o.status}</span></td>
                  <td className="py-3 px-4 text-center"><button onClick={() => setSelectedOrder(o)} className="text-sm text-[var(--primary)] hover:underline font-medium">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-[var(--card)] rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Order Details: {selectedOrder.orderNumber}</h3>
              <button onClick={() => setSelectedOrder(null)} className="p-1 rounded-lg hover:bg-[var(--muted)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-[var(--muted-foreground)]">Customer</p><p className="font-semibold">{selectedOrder.customerName}</p></div>
              <div><p className="text-xs text-[var(--muted-foreground)]">Date</p><p className="font-semibold">{formatDate(selectedOrder.date)}</p></div>
              <div><p className="text-xs text-[var(--muted-foreground)]">Status</p><span className={`inline-block mt-0.5 px-2 py-0.5 text-xs font-semibold rounded-full ${statusColors[selectedOrder.status as OrderStatus]}`}>{selectedOrder.status}</span></div>
              <div><p className="text-xs text-[var(--muted-foreground)]">Total Amount</p><p className="font-bold text-[var(--primary)]">{formatCurrency(selectedOrder.total)}</p></div>
            </div>
            <div className="border-t border-[var(--border)] pt-4">
              <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase mb-2">Items</p>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b border-[var(--border)] last:border-0">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 border border-[var(--border)] rounded-lg text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
