"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useData } from "@/lib/store"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ShoppingBag, Plus, Star, TrendingUp, Package, Truck, X } from "lucide-react"
import { PurchaseOrder } from "@/lib/types"

const mockPurchaseOrders = [
  { id: "PO001", poNumber: "PO-2026-0055", distributorId: "D001", distributorName: "ABC Pharma Distributors", date: "2026-06-28", expectedDelivery: "2026-07-05", items: [{ productId: "P001", productName: "Product A", quantity: 120, unitPrice: 100, total: 12000 }], subtotal: 12000, gstAmount: 1440, total: 13440, status: "Received" as const, branchId: "BR001", notes: "" },
  { id: "PO002", poNumber: "PO-2026-0054", distributorId: "D002", distributorName: "Cipla Distribution Network", date: "2026-06-25", expectedDelivery: "2026-07-02", items: [{ productId: "P002", productName: "Product B", quantity: 200, unitPrice: 50, total: 10000 }], subtotal: 10000, gstAmount: 1200, total: 11200, status: "Received" as const, branchId: "BR001", notes: "" },
]

const statusColor: Record<string, string> = { Received: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", Partial: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", Pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400", Draft: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400", Sent: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400", Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" }

export default function PurchasesPage() {
  const { distributors, purchaseOrders } = useData()
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | typeof mockPurchaseOrders[0] | null>(null)

  // Merge dynamic state purchase orders with mock ones
  const allPOs = useMemo(() => {
    return [...purchaseOrders, ...mockPurchaseOrders]
  }, [purchaseOrders])

  const totalPurchases = distributors.reduce((s, d) => s + d.totalPurchases, 0)
  const thisMonth = allPOs.filter(p => p.date >= "2026-06-01").reduce((s, p) => s + p.total, 0)
  const pendingCount = allPOs.filter(p => p.status === "Draft" || p.status === "Sent").length

  const topSuppliers = [...distributors].sort((a, b) => b.totalPurchases - a.totalPurchases).slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><ShoppingBag className="w-6 h-6 text-[var(--primary)]" /> Purchase Management</h1><p className="text-sm text-[var(--muted-foreground)]">Track supplier purchases and orders</p></div>
        <Link href="/purchases/new" className="inline-flex items-center gap-2 px-4 py-2.5 gradient-bg text-white rounded-xl font-medium text-sm hover:opacity-90 shadow-md"><Plus className="w-4 h-4" /> New Purchase Order</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Purchases", value: formatCurrency(totalPurchases), icon: ShoppingBag, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-400" },
          { label: "This Month", value: formatCurrency(thisMonth), icon: TrendingUp, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400" },
          { label: "Pending Orders", value: pendingCount, icon: Package, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400" },
          { label: "Suppliers", value: distributors.length, icon: Truck, color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/40 dark:text-cyan-400" },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 flex items-center gap-3"><div className={`p-2 rounded-xl ${s.color}`}><s.icon className="w-5 h-5" /></div><div><p className="text-xs text-[var(--muted-foreground)]">{s.label}</p><p className="text-xl font-bold text-foreground">{s.value}</p></div></div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 glass-card overflow-hidden">
          <div className="p-4 border-b border-[var(--border)]"><h3 className="text-sm font-semibold">Purchase Orders</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-[var(--muted)]">
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">PO Number</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Supplier</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden md:table-cell">Date</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden sm:table-cell">Items</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Total</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Status</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Actions</th>
              </tr></thead>
              <tbody>
                {allPOs.map(po => (
                  <tr key={po.id} className="border-b border-[var(--border)] last:border-0 table-row-hover">
                    <td className="py-3 px-4 font-mono font-medium text-[var(--primary)]">{po.poNumber}</td>
                    <td className="py-3 px-4 font-medium text-foreground">{po.distributorName}</td>
                    <td className="py-3 px-4 text-[var(--muted-foreground)] hidden md:table-cell">{formatDate(po.date)}</td>
                    <td className="py-3 px-4 text-center text-[var(--muted-foreground)] hidden sm:table-cell">{po.items.length}</td>
                    <td className="py-3 px-4 text-right font-semibold">{formatCurrency(po.total)}</td>
                    <td className="py-3 px-4 text-center"><span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColor[po.status]}`}>{po.status}</span></td>
                    <td className="py-3 px-4 text-center"><button onClick={() => setSelectedPO(po)} className="text-sm text-[var(--primary)] hover:underline font-medium">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Star className="w-4 h-4 text-amber-500" /> Top Suppliers</h3>
          <div className="space-y-3">
            {topSuppliers.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--muted)]">
                <span className="text-sm font-bold text-[var(--muted-foreground)] w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{s.name}</p>
                  <div className="flex items-center gap-1 text-amber-500 mt-0.5">{Array.from({length: Math.round(s.rating)}).map((_,j) => <Star key={j} className="w-3 h-3 fill-current"/>)}<span className="text-xs ml-1">{s.rating}</span></div>
                </div>
                <div className="text-right"><p className="text-sm font-bold text-emerald-600">{formatCurrency(s.totalPurchases)}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PO Detail Modal */}
      {selectedPO && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedPO(null)}>
          <div className="bg-[var(--card)] rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Purchase Order Details: {selectedPO.poNumber}</h3>
              <button onClick={() => setSelectedPO(null)} className="p-1 rounded-lg hover:bg-[var(--muted)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-[var(--muted-foreground)]">Supplier/Distributor</p><p className="font-semibold">{selectedPO.distributorName}</p></div>
              <div><p className="text-xs text-[var(--muted-foreground)]">Date</p><p className="font-semibold">{formatDate(selectedPO.date)}</p></div>
              <div><p className="text-xs text-[var(--muted-foreground)]">Status</p><span className={`inline-block mt-0.5 px-2 py-0.5 text-xs font-semibold rounded-full ${statusColor[selectedPO.status]}`}>{selectedPO.status}</span></div>
              <div><p className="text-xs text-[var(--muted-foreground)]">Grand Total</p><p className="font-bold text-[var(--primary)]">{formatCurrency(selectedPO.total)}</p></div>
            </div>
            <div className="border-t border-[var(--border)] pt-4">
              <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase mb-2">Items</p>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {selectedPO.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b border-[var(--border)] last:border-0">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">Qty: {item.quantity} · Price: {formatCurrency(item.unitPrice)}</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(item.quantity * item.unitPrice)}</p>
                  </div>
                ))}
              </div>
            </div>
            {selectedPO.notes && (
              <div className="border-t border-[var(--border)] pt-3 text-xs">
                <p className="font-semibold text-[var(--muted-foreground)] mb-1">Notes</p>
                <p className="bg-[var(--muted)] p-2 rounded-lg">{selectedPO.notes}</p>
              </div>
            )}
            <div className="flex justify-end pt-2">
              <button onClick={() => setSelectedPO(null)} className="px-4 py-2 border border-[var(--border)] rounded-lg text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
