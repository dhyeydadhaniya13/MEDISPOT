"use client"

import { useState, useMemo } from "react"
import { useData } from "@/lib/store"
import { useToast } from "@/lib/toast"
import { formatCurrency, getStockStatus } from "@/lib/utils"
import { Warehouse, Search, PackageX, Package, ArrowDownToLine, ArrowUpFromLine, AlertTriangle, TrendingDown, BarChart3 } from "lucide-react"

const stockColors: Record<string, string> = { surplus: "bg-emerald-500", adequate: "bg-blue-500", low: "bg-amber-500", critical: "bg-red-500", out: "bg-gray-400" }
const statusBadge: Record<string, string> = { surplus: "text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400", adequate: "text-blue-700 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400", low: "text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400", critical: "text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-400", out: "text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-400" }
const moveColors: Record<string, string> = { "Stock In": "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40", "Stock Out": "text-red-600 bg-red-100 dark:bg-red-900/40", "Adjustment": "text-amber-600 bg-amber-100 dark:bg-amber-900/40", "Return": "text-blue-600 bg-blue-100 dark:bg-blue-900/40", "Transfer": "text-violet-600 bg-violet-100 dark:bg-violet-900/40" }

export default function InventoryPage() {
  const { products, stockEntries, addStockEntry, addPurchaseOrder, logActivity } = useData()
  const { toast } = useToast()

  const [tab, setTab] = useState<"overview" | "movements" | "alerts">("overview")
  const [search, setSearch] = useState("")
  const [showStockForm, setShowStockForm] = useState<"in" | "out" | null>(null)
  const [stockForm, setStockForm] = useState({ productId: '', quantity: '', batchNumber: '', reference: '', notes: '' })

  const lowStockProducts = products.filter(p => p.currentStock <= p.minimumStock)
  const outOfStockCount = products.filter(p => p.currentStock === 0).length
  const totalValue = products.reduce((s, p) => s + p.currentStock * p.sellingPrice, 0)

  const filteredProducts = useMemo(() => {
    if (!search) return products
    const s = search.toLowerCase()
    return products.filter(p => p.name.toLowerCase().includes(s) || p.code.toLowerCase().includes(s))
  }, [search, products])

  const handleStockSubmit = () => {
    const prod = products.find(p => p.id === stockForm.productId)
    if (!prod) {
      toast("error", "Error", "Please select a product.")
      return
    }
    const qty = parseInt(stockForm.quantity)
    if (!qty || qty <= 0) {
      toast("error", "Error", "Please enter a valid quantity.")
      return
    }

    const entryType = showStockForm === "in" ? "Stock In" as const : "Stock Out" as const

    if (entryType === "Stock Out" && qty > prod.currentStock) {
      toast("error", "Insufficient Stock", `${prod.name} only has ${prod.currentStock} units available.`)
      return
    }

    addStockEntry({
      productId: prod.id,
      productName: prod.name,
      type: entryType,
      quantity: qty,
      batchNumber: stockForm.batchNumber || prod.batchNumber,
      date: new Date().toISOString().split("T")[0],
      reference: stockForm.reference,
      branchId: prod.branchId,
      notes: stockForm.notes,
    })

    logActivity({
      type: "stock",
      title: `${entryType} Processed`,
      description: `${entryType}: ${qty} units of ${prod.name}`,
      user: "Admin",
      icon: entryType === "Stock In" ? "📥" : "📤",
    })

    toast("success", `${entryType} Processed`, `${qty} units of ${prod.name} have been ${entryType === "Stock In" ? "added to" : "removed from"} inventory.`)
    setStockForm({ productId: '', quantity: '', batchNumber: '', reference: '', notes: '' })
    setShowStockForm(null)
  }

  const handleReorder = (p: typeof products[0]) => {
    const deficit = p.minimumStock - p.currentStock
    const orderQty = Math.max(deficit, p.minimumStock) * 2

    addPurchaseOrder({
      poNumber: `PO-${Date.now().toString(36).toUpperCase()}`,
      distributorId: "DIST001",
      distributorName: "Auto Reorder",
      date: new Date().toISOString().split("T")[0],
      expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      items: [{ productId: p.id, productName: p.name, quantity: orderQty, unitPrice: p.purchasePrice, total: orderQty * p.purchasePrice }],
      subtotal: orderQty * p.purchasePrice,
      gstAmount: orderQty * p.purchasePrice * (p.gstPercent / 100),
      total: orderQty * p.purchasePrice * (1 + p.gstPercent / 100),
      status: "Draft",
      branchId: p.branchId,
      notes: `Auto-generated reorder for low stock: ${p.name}`,
    })

    logActivity({
      type: "stock",
      title: "Reorder Created",
      description: `Purchase order created for ${p.name} — ${orderQty} units`,
      user: "Admin",
      icon: "🔄",
    })

    toast("success", "Reorder Created", `Purchase order for ${orderQty} units of ${p.name} has been created.`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Warehouse className="w-6 h-6 text-[var(--primary)]" /> Inventory Management</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Track and manage your pharmaceutical stock</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowStockForm("in")} className="px-4 py-2.5 gradient-bg text-white rounded-xl font-medium text-sm flex items-center gap-2"><ArrowDownToLine className="w-4 h-4" /> Stock In</button>
          <button onClick={() => setShowStockForm("out")} className="px-4 py-2.5 border border-[var(--border)] rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-[var(--muted)]"><ArrowUpFromLine className="w-4 h-4" /> Stock Out</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: products.length, icon: Package, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-400" },
          { label: "Low Stock", value: lowStockProducts.length, icon: AlertTriangle, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400" },
          { label: "Out of Stock", value: outOfStockCount, icon: PackageX, color: "text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-400" },
          { label: "Stock Value", value: formatCurrency(totalValue), icon: BarChart3, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400" },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 flex items-center gap-3">
            <div className={`p-2 rounded-xl ${s.color}`}><s.icon className="w-5 h-5" /></div>
            <div><p className="text-xs text-[var(--muted-foreground)]">{s.label}</p><p className="text-xl font-bold text-foreground">{s.value}</p></div>
          </div>
        ))}
      </div>

      {/* Stock Form Modal */}
      {showStockForm && (
        <div className="glass-card p-6 border-2 border-[var(--primary)]/30 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{showStockForm === "in" ? "Stock In" : "Stock Out"}</h3>
            <button onClick={() => setShowStockForm(null)} className="text-[var(--muted-foreground)] hover:text-foreground">✕</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Product</label><select value={stockForm.productId} onChange={e => setStockForm(prev => ({...prev, productId: e.target.value}))} className="w-full px-3 py-2.5 bg-[var(--muted)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"><option value="">Select a product</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
            <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Quantity</label><input type="number" placeholder="0" value={stockForm.quantity} onChange={e => setStockForm(prev => ({...prev, quantity: e.target.value}))} className="w-full px-3 py-2.5 bg-[var(--muted)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]" /></div>
            <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Batch Number</label><input placeholder="BT2024..." value={stockForm.batchNumber} onChange={e => setStockForm(prev => ({...prev, batchNumber: e.target.value}))} className="w-full px-3 py-2.5 bg-[var(--muted)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]" /></div>
            <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Reference</label><input placeholder="PO-2026-..." value={stockForm.reference} onChange={e => setStockForm(prev => ({...prev, reference: e.target.value}))} className="w-full px-3 py-2.5 bg-[var(--muted)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]" /></div>
          </div>
          <div className="mt-4"><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Notes</label><textarea placeholder="Additional notes..." value={stockForm.notes} onChange={e => setStockForm(prev => ({...prev, notes: e.target.value}))} className="w-full px-3 py-2.5 bg-[var(--muted)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)] h-20 resize-none" /></div>
          <div className="flex justify-end mt-4 gap-2"><button onClick={() => setShowStockForm(null)} className="px-4 py-2 border border-[var(--border)] rounded-lg text-sm">Cancel</button><button onClick={handleStockSubmit} className="px-4 py-2 gradient-bg text-white rounded-lg text-sm font-medium">Submit</button></div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--muted)] p-1 rounded-xl w-fit">
        {(["overview", "movements", "alerts"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-[var(--card)] text-foreground shadow-sm" : "text-[var(--muted-foreground)] hover:text-foreground"}`}>
            {t === "overview" ? "Stock Overview" : t === "movements" ? "Stock Movements" : `Low Stock Alerts (${lowStockProducts.length})`}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-[var(--border)]">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-10 pr-4 py-2 bg-[var(--muted)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-[var(--muted)]">
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Product</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden sm:table-cell">Category</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden md:table-cell">Batch</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Stock Level</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden sm:table-cell">Min</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Status</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden lg:table-cell">Value</th>
              </tr></thead>
              <tbody>
                {filteredProducts.map(p => {
                  const status = getStockStatus(p.currentStock, p.minimumStock)
                  const pct = Math.min((p.currentStock / (p.minimumStock * 3)) * 100, 100)
                  return (
                    <tr key={p.id} className="border-b border-[var(--border)] last:border-0 table-row-hover">
                      <td className="py-3 px-4 font-medium text-foreground">{p.name}<br/><span className="text-xs text-[var(--muted-foreground)]">{p.manufacturer}</span></td>
                      <td className="py-3 px-4 hidden sm:table-cell"><span className="px-2 py-0.5 text-xs rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">{p.category}</span></td>
                      <td className="py-3 px-4 text-xs font-mono text-[var(--muted-foreground)] hidden md:table-cell">{p.batchNumber}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-20 h-2 bg-[var(--muted)] rounded-full overflow-hidden"><div className={`h-full rounded-full ${stockColors[status]}`} style={{ width: `${pct}%` }} /></div>
                          <span className="text-sm font-semibold min-w-[40px] text-right">{p.currentStock}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-sm hidden sm:table-cell">{p.minimumStock}</td>
                      <td className="py-3 px-4 text-center"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusBadge[status]}`}>{status}</span></td>
                      <td className="py-3 px-4 text-right font-semibold hidden lg:table-cell">{formatCurrency(p.currentStock * p.sellingPrice)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "movements" && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-[var(--muted)]">
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Product</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Type</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Qty</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden md:table-cell">Reference</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden lg:table-cell">Notes</th>
              </tr></thead>
              <tbody>
                {stockEntries.map(e => (
                  <tr key={e.id} className="border-b border-[var(--border)] last:border-0 table-row-hover">
                    <td className="py-3 px-4 text-sm">{e.date}</td>
                    <td className="py-3 px-4 font-medium">{e.productName}</td>
                    <td className="py-3 px-4 text-center"><span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${moveColors[e.type]}`}>{e.type}</span></td>
                    <td className="py-3 px-4 text-right font-semibold">{e.type === "Stock Out" ? `-${e.quantity}` : e.quantity < 0 ? e.quantity : `+${e.quantity}`}</td>
                    <td className="py-3 px-4 text-xs font-mono text-[var(--muted-foreground)] hidden md:table-cell">{e.reference}</td>
                    <td className="py-3 px-4 text-xs text-[var(--muted-foreground)] hidden lg:table-cell">{e.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "alerts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lowStockProducts.map(p => {
            const status = getStockStatus(p.currentStock, p.minimumStock)
            const deficit = p.minimumStock - p.currentStock
            return (
              <div key={p.id} className={`glass-card p-4 border-l-4 ${status === "critical" || status === "out" ? "border-l-red-500" : "border-l-amber-500"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">{p.name}</h4>
                    <p className="text-xs text-[var(--muted-foreground)]">{p.manufacturer}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${statusBadge[status]}`}>{status}</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-[var(--muted)]"><p className="text-[10px] text-[var(--muted-foreground)]">Current</p><p className="text-lg font-bold text-foreground">{p.currentStock}</p></div>
                  <div className="p-2 rounded-lg bg-[var(--muted)]"><p className="text-[10px] text-[var(--muted-foreground)]">Minimum</p><p className="text-lg font-bold text-foreground">{p.minimumStock}</p></div>
                  <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20"><p className="text-[10px] text-red-600">Deficit</p><p className="text-lg font-bold text-red-600">{deficit > 0 ? deficit : 0}</p></div>
                </div>
                <button onClick={() => handleReorder(p)} className="w-full mt-3 px-4 py-2 gradient-bg text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Reorder Now</button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
