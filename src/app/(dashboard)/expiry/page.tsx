"use client"

import { useState, useMemo } from "react"
import { useData } from "@/lib/store"
import { useToast } from "@/lib/toast"
import { formatCurrency, formatDate, daysUntilExpiry, getExpiryStatus } from "@/lib/utils"
import { Clock, AlertTriangle, ShieldAlert, Package, CalendarX2, X } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type ExpiryTab = "all" | "expired" | "30" | "60" | "90" | "180"

export default function ExpiryPage() {
  const { products, addStockEntry, logActivity } = useData()
  const { toast } = useToast()

  const [tab, setTab] = useState<ExpiryTab>("all")

  // Clearance/Return modal state
  const [clearanceModal, setClearanceModal] = useState<{ productId: string; productName: string; currentStock: number; isExpired: boolean } | null>(null)
  const [clearanceQty, setClearanceQty] = useState("")
  const [clearanceNotes, setClearanceNotes] = useState("")

  const categorized = useMemo(() => {
    return products.map(p => {
      const days = daysUntilExpiry(p.expiryDate)
      const status = getExpiryStatus(p.expiryDate)
      const value = p.currentStock * p.sellingPrice
      return { ...p, daysLeft: days, status, riskValue: value }
    }).sort((a, b) => a.daysLeft - b.daysLeft)
  }, [products])

  const expired = categorized.filter(p => p.daysLeft <= 0)
  const within30 = categorized.filter(p => p.daysLeft > 0 && p.daysLeft <= 30)
  const within60 = categorized.filter(p => p.daysLeft > 0 && p.daysLeft <= 60)
  const within90 = categorized.filter(p => p.daysLeft > 0 && p.daysLeft <= 90)
  const within180 = categorized.filter(p => p.daysLeft > 0 && p.daysLeft <= 180)

  const filtered = tab === "expired" ? expired : tab === "30" ? within30 : tab === "60" ? within60 : tab === "90" ? within90 : tab === "180" ? within180 : categorized

  const riskValue90 = within90.reduce((s, p) => s + p.riskValue, 0)
  const expiredValue = expired.reduce((s, p) => s + p.riskValue, 0)

  const expiryByMonth = useMemo(() => {
    const months: Record<string, number> = {}
    categorized.filter(p => p.daysLeft > 0 && p.daysLeft <= 180).forEach(p => {
      const month = new Date(p.expiryDate).toLocaleString("en", { month: "short", year: "2-digit" })
      months[month] = (months[month] || 0) + p.riskValue
    })
    return Object.entries(months).map(([month, value]) => ({ month, value }))
  }, [categorized])

  const tabConfig = [
    { key: "all" as ExpiryTab, label: "All", count: categorized.length },
    { key: "expired" as ExpiryTab, label: "Expired", count: expired.length, color: "text-red-600" },
    { key: "30" as ExpiryTab, label: "30 Days", count: within30.length, color: "text-orange-600" },
    { key: "60" as ExpiryTab, label: "60 Days", count: within60.length, color: "text-amber-600" },
    { key: "90" as ExpiryTab, label: "90 Days", count: within90.length, color: "text-yellow-600" },
    { key: "180" as ExpiryTab, label: "180 Days", count: within180.length, color: "text-blue-600" },
  ]

  const rowColor = (status: string) => {
    const m: Record<string, string> = { expired: "bg-red-50/50 dark:bg-red-900/10", critical: "bg-orange-50/50 dark:bg-orange-900/10", warning: "bg-amber-50/50 dark:bg-amber-900/10", caution: "bg-yellow-50/30 dark:bg-yellow-900/10", safe: "" }
    return m[status] || ""
  }

  const openClearanceModal = (p: typeof categorized[0]) => {
    setClearanceModal({ productId: p.id, productName: p.name, currentStock: p.currentStock, isExpired: p.daysLeft <= 0 })
    setClearanceQty(String(p.currentStock))
    setClearanceNotes("")
  }

  const handleClearanceSubmit = () => {
    if (!clearanceModal) return
    const qty = parseInt(clearanceQty)
    if (!qty || qty <= 0) {
      toast("error", "Invalid Quantity", "Please enter a valid quantity.")
      return
    }
    if (qty > clearanceModal.currentStock) {
      toast("error", "Exceeds Stock", `Only ${clearanceModal.currentStock} units available.`)
      return
    }

    const actionType = clearanceModal.isExpired ? "Return" as const : "Adjustment" as const

    addStockEntry({
      productId: clearanceModal.productId,
      productName: clearanceModal.productName,
      type: actionType,
      quantity: -qty,
      batchNumber: "",
      date: new Date().toISOString().split("T")[0],
      reference: `EXP-${Date.now().toString(36).toUpperCase()}`,
      branchId: "BR001",
      notes: clearanceNotes || (clearanceModal.isExpired ? `Expired stock return: ${qty} units` : `Clearance sale adjustment: ${qty} units`),
    })

    logActivity({
      type: "stock",
      title: clearanceModal.isExpired ? "Expired Stock Returned" : "Clearance Processed",
      description: `${clearanceModal.isExpired ? "Returned" : "Cleared"} ${qty} units of ${clearanceModal.productName}`,
      user: "Admin",
      icon: clearanceModal.isExpired ? "↩️" : "🏷️",
    })

    toast("success", clearanceModal.isExpired ? "Return Processed" : "Clearance Processed", `${qty} units of ${clearanceModal.productName} have been ${clearanceModal.isExpired ? "returned" : "cleared"}.`)
    setClearanceModal(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Clock className="w-6 h-6 text-rose-500" /> Expiry Management</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Monitor and manage product expiry dates</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Expired", value: expired.length, icon: CalendarX2, color: "text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-400" },
          { label: "Within 30 Days", value: within30.length, icon: ShieldAlert, color: "text-orange-600 bg-orange-100 dark:bg-orange-900/40 dark:text-orange-400" },
          { label: "Within 60 Days", value: within60.length, icon: AlertTriangle, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400" },
          { label: "Within 90 Days", value: within90.length, icon: Clock, color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/40 dark:text-yellow-400" },
          { label: "Within 180 Days", value: within180.length, icon: Package, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400" },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 flex items-center gap-3">
            <div className={`p-2 rounded-xl ${s.color}`}><s.icon className="w-5 h-5" /></div>
            <div><p className="text-xs text-[var(--muted-foreground)]">{s.label}</p><p className="text-xl font-bold text-foreground">{s.value}</p></div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-[var(--muted)] p-1 rounded-xl overflow-x-auto">
        {tabConfig.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${tab === t.key ? "bg-[var(--card)] text-foreground shadow-sm" : "text-[var(--muted-foreground)] hover:text-foreground"}`}>
            {t.label} <span className={`ml-1 ${t.color || ""}`}>({t.count})</span>
          </button>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[var(--muted)]">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Product</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden sm:table-cell">Batch</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden md:table-cell">Category</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Expiry Date</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Days Left</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden sm:table-cell">Stock</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden lg:table-cell">Value at Risk</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Action</th>
            </tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className={`border-b border-[var(--border)] last:border-0 ${rowColor(p.status)}`}>
                  <td className="py-3 px-4"><p className="font-semibold text-foreground">{p.name}</p><p className="text-xs text-[var(--muted-foreground)]">{p.manufacturer}</p></td>
                  <td className="py-3 px-4 text-xs font-mono text-[var(--muted-foreground)] hidden sm:table-cell">{p.batchNumber}</td>
                  <td className="py-3 px-4 hidden md:table-cell"><span className="px-2 py-0.5 text-xs rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">{p.category}</span></td>
                  <td className="py-3 px-4 text-sm">{formatDate(p.expiryDate)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${p.daysLeft <= 0 ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" : p.daysLeft <= 30 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400" : p.daysLeft <= 90 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" : "text-foreground"}`}>
                      {p.daysLeft <= 0 ? "EXPIRED" : `${p.daysLeft}d`}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right hidden sm:table-cell">{p.currentStock}</td>
                  <td className="py-3 px-4 text-right font-semibold hidden lg:table-cell">{formatCurrency(p.riskValue)}</td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => openClearanceModal(p)} className={`px-3 py-1 text-xs font-medium rounded-lg ${p.daysLeft <= 0 ? "bg-red-600 text-white" : "border border-[var(--border)] hover:bg-[var(--muted)]"} transition-colors`}>
                      {p.daysLeft <= 0 ? "Return" : "Clearance"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expiry Loss Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4">Risk Summary</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-xs text-red-600">Expired Stock Value</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-400">{formatCurrency(expiredValue)}</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-600">At Risk (90 days)</p>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{formatCurrency(riskValue90)}</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="text-sm font-semibold mb-4">Expiry Value by Month</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expiryByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v) => [typeof v === 'number' ? formatCurrency(v) : v]} />
                <Bar dataKey="value" fill="#ef4444" radius={[4,4,0,0]} name="Risk Value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Clearance / Return Modal */}
      {clearanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setClearanceModal(null)}>
          <div className="bg-[var(--card)] rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">{clearanceModal.isExpired ? "Return Expired Stock" : "Clearance Sale"}</h3>
              <button onClick={() => setClearanceModal(null)} className="p-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)]"><X className="w-5 h-5" /></button>
            </div>

            <p className="text-sm text-[var(--muted-foreground)] mb-4">
              {clearanceModal.isExpired
                ? `Process return for expired product: ${clearanceModal.productName}`
                : `Create clearance for near-expiry product: ${clearanceModal.productName}`}
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Quantity (Available: {clearanceModal.currentStock})</label>
                <input type="number" value={clearanceQty} onChange={e => setClearanceQty(e.target.value)} max={clearanceModal.currentStock}
                  className="w-full px-3 py-2.5 bg-[var(--muted)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]" />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Notes</label>
                <textarea value={clearanceNotes} onChange={e => setClearanceNotes(e.target.value)} placeholder="Reason or additional details..."
                  className="w-full px-3 py-2.5 bg-[var(--muted)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)] h-20 resize-none" />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setClearanceModal(null)} className="px-4 py-2 border border-[var(--border)] rounded-lg text-sm font-medium hover:bg-[var(--muted)] transition-colors">Cancel</button>
              <button onClick={handleClearanceSubmit} className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-opacity hover:opacity-90 ${clearanceModal.isExpired ? "bg-red-600" : "gradient-bg"}`}>
                {clearanceModal.isExpired ? "Process Return" : "Process Clearance"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
