"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Search, Trash2 } from "lucide-react"
import { useData } from "@/lib/store"
import { useToast } from "@/lib/toast"
import { formatCurrency } from "@/lib/utils"

export default function NewPurchaseOrderPage() {
  const router = useRouter()
  const { distributors, products, addPurchaseOrder, logActivity } = useData()
  const { toast } = useToast()

  const [distributorId, setDistributorId] = useState("")
  const [distributorSearch, setDistributorSearch] = useState("")
  const [items, setItems] = useState<{ productId: string; productName: string; quantity: number; unitPrice: number }[]>([])
  const [productSearch, setProductSearch] = useState("")
  const [notes, setNotes] = useState("")

  const selectedDist = distributors.find(d => d.id === distributorId)
  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
  const gstAmount = Math.round(subtotal * 0.12)
  const total = subtotal + gstAmount

  const filteredDists = distributorSearch ? distributors.filter(d => d.name.toLowerCase().includes(distributorSearch.toLowerCase())).slice(0, 5) : []
  const filteredProducts = productSearch ? products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) && !items.find(i => i.productId === p.id)).slice(0, 5) : []

  const addItem = (p: typeof products[0]) => {
    setItems(prev => [...prev, { productId: p.id, productName: p.name, quantity: Math.max(1, p.minimumStock - p.currentStock), unitPrice: p.purchasePrice }])
    setProductSearch("")
  }

  const handleSubmit = () => {
    if (!distributorId) { toast("error", "Select a distributor"); return }
    if (items.length === 0) { toast("error", "Add at least one product"); return }

    const expectedDelivery = new Date()
    expectedDelivery.setDate(expectedDelivery.getDate() + 7)

    const po = addPurchaseOrder({
      poNumber: `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      distributorId, distributorName: selectedDist!.name,
      date: new Date().toISOString().split("T")[0],
      expectedDelivery: expectedDelivery.toISOString().split("T")[0],
      items: items.map(i => ({ ...i, total: i.quantity * i.unitPrice })),
      subtotal, gstAmount, total, status: "Draft", branchId: "BR001", notes,
    })

    logActivity({ type: "stock", title: "Purchase Order Created", description: `PO ${po.poNumber} — ${selectedDist!.name} — ${formatCurrency(total)}`, user: "Rajesh Sharma", icon: "Package" })
    toast("success", "Purchase Order Created", `PO ${po.poNumber} for ${formatCurrency(total)}`)
    router.push("/purchases")
  }

  const inputCls = "w-full px-3 py-2.5 bg-[var(--muted)] border border-transparent rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/purchases" className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <div><h1 className="text-2xl font-bold text-foreground">New Purchase Order</h1><p className="text-sm text-[var(--muted-foreground)]">Create a purchase order for a distributor</p></div>
      </div>

      {/* Distributor */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold mb-4">Distributor</h3>
        {selectedDist ? (
          <div className="flex items-center justify-between p-4 bg-[var(--muted)] rounded-xl">
            <div><p className="font-medium">{selectedDist.name}</p><p className="text-xs text-[var(--muted-foreground)]">{selectedDist.contactPerson} · {selectedDist.city}</p></div>
            <button onClick={() => setDistributorId("")} className="text-xs text-red-500 hover:underline">Change</button>
          </div>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input value={distributorSearch} onChange={e => setDistributorSearch(e.target.value)} placeholder="Search distributors..." className={`${inputCls} pl-10`} />
            {filteredDists.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg z-10">
                {filteredDists.map(d => (
                  <button key={d.id} onClick={() => { setDistributorId(d.id); setDistributorSearch("") }} className="w-full text-left px-4 py-3 hover:bg-[var(--muted)] transition-colors">
                    <p className="text-sm font-medium">{d.name}</p><p className="text-xs text-[var(--muted-foreground)]">{d.contactPerson}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Products */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold mb-4">Products</h3>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Search products..." className={`${inputCls} pl-10`} />
          {filteredProducts.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
              {filteredProducts.map(p => (
                <button key={p.id} onClick={() => addItem(p)} className="w-full text-left px-4 py-3 hover:bg-[var(--muted)] transition-colors flex justify-between">
                  <div><p className="text-sm font-medium">{p.name}</p><p className="text-xs text-[var(--muted-foreground)]">Stock: {p.currentStock} / Min: {p.minimumStock}</p></div>
                  <span className="text-sm font-medium">{formatCurrency(p.purchasePrice)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--border)]">
              <th className="text-left py-2 px-2 text-xs text-[var(--muted-foreground)]">Product</th>
              <th className="text-center py-2 px-2 text-xs text-[var(--muted-foreground)]">Qty</th>
              <th className="text-right py-2 px-2 text-xs text-[var(--muted-foreground)]">Unit Price</th>
              <th className="text-right py-2 px-2 text-xs text-[var(--muted-foreground)]">Total</th>
              <th></th>
            </tr></thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2 px-2 font-medium">{item.productName}</td>
                  <td className="py-2 px-2 text-center"><input type="number" min={1} value={item.quantity} onChange={e => setItems(prev => prev.map((it, i) => i === idx ? { ...it, quantity: parseInt(e.target.value) || 1 } : it))} className="w-20 text-center px-2 py-1 bg-[var(--muted)] rounded-lg text-sm" /></td>
                  <td className="py-2 px-2 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-2 px-2 text-right font-semibold">{formatCurrency(item.quantity * item.unitPrice)}</td>
                  <td className="py-2 px-2"><button onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-4 space-y-1 text-right text-sm">
          <p>Subtotal: <span className="font-medium">{formatCurrency(subtotal)}</span></p>
          <p>GST (12%): <span className="font-medium">{formatCurrency(gstAmount)}</span></p>
          <p className="text-lg font-bold text-[var(--primary)]">Total: {formatCurrency(total)}</p>
        </div>
      </div>

      {/* Notes */}
      <div className="glass-card p-6">
        <label className="text-sm font-semibold block mb-2">Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} className={`${inputCls} h-20 resize-none`} placeholder="Optional notes for this purchase order..." />
      </div>

      <div className="flex justify-end gap-3">
        <Link href="/purchases" className="px-6 py-2.5 border border-[var(--border)] rounded-xl text-sm font-medium hover:bg-[var(--muted)]">Cancel</Link>
        <button onClick={handleSubmit} className="px-6 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:opacity-90"><Save className="w-4 h-4" /> Create PO</button>
      </div>
    </div>
  )
}
