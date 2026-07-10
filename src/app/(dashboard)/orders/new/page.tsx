"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Save, Search } from "lucide-react"
import { useData } from "@/lib/store"
import { useToast } from "@/lib/toast"
import { formatCurrency } from "@/lib/utils"

export default function NewOrderPage() {
  const router = useRouter()
  const { customers, products, addOrder, logActivity } = useData()
  const { toast } = useToast()

  const [customerId, setCustomerId] = useState("")
  const [customerSearch, setCustomerSearch] = useState("")
  const [items, setItems] = useState<{ productId: string; productName: string; quantity: number; price: number }[]>([])
  const [productSearch, setProductSearch] = useState("")

  const selectedCustomer = customers.find(c => c.id === customerId)
  const total = items.reduce((s, i) => s + i.quantity * i.price, 0)

  const filteredCustomers = customerSearch ? customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.storeName.toLowerCase().includes(customerSearch.toLowerCase())).slice(0, 5) : []
  const filteredProducts = productSearch ? products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) && !items.find(i => i.productId === p.id)).slice(0, 5) : []

  const addItem = (p: typeof products[0]) => {
    setItems(prev => [...prev, { productId: p.id, productName: p.name, quantity: 1, price: p.sellingPrice }])
    setProductSearch("")
  }

  const updateItem = (idx: number, field: "quantity" | "price", value: number) => {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item))
  }

  const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx))

  const handleSubmit = () => {
    if (!customerId) { toast("error", "Select a customer"); return }
    if (items.length === 0) { toast("error", "Add at least one product"); return }

    const order = addOrder({
      orderNumber: `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      customerId, customerName: selectedCustomer!.name, date: new Date().toISOString().split("T")[0],
      items: items.map(i => ({ productName: i.productName, quantity: i.quantity, price: i.price })),
      total, status: "Pending", branchId: "BR001",
    })

    logActivity({ type: "order", title: "New Order Created", description: `Order ${order.orderNumber} — ${selectedCustomer!.name} — ${formatCurrency(total)}`, user: "Rajesh Sharma", icon: "ShoppingCart" })
    toast("success", "Order Created", `Order ${order.orderNumber} for ${formatCurrency(total)}`)
    router.push("/orders")
  }

  const inputCls = "w-full px-3 py-2.5 bg-[var(--muted)] border border-transparent rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/orders" className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div><h1 className="text-2xl font-bold text-foreground">New Order</h1><p className="text-sm text-[var(--muted-foreground)]">Create a new customer order</p></div>
        </div>
      </div>

      {/* Customer Selection */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold mb-4">Customer</h3>
        {selectedCustomer ? (
          <div className="flex items-center justify-between p-4 bg-[var(--muted)] rounded-xl">
            <div><p className="font-medium">{selectedCustomer.name}</p><p className="text-xs text-[var(--muted-foreground)]">{selectedCustomer.storeName}</p></div>
            <button onClick={() => setCustomerId("")} className="text-xs text-red-500 hover:underline">Change</button>
          </div>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input value={customerSearch} onChange={e => setCustomerSearch(e.target.value)} placeholder="Search customers by name or store..." className={`${inputCls} pl-10`} />
            {filteredCustomers.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                {filteredCustomers.map(c => (
                  <button key={c.id} onClick={() => { setCustomerId(c.id); setCustomerSearch("") }} className="w-full text-left px-4 py-3 hover:bg-[var(--muted)] transition-colors">
                    <p className="text-sm font-medium">{c.name}</p><p className="text-xs text-[var(--muted-foreground)]">{c.storeName} · {c.city}</p>
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
          <input value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Search products to add..." className={`${inputCls} pl-10`} />
          {filteredProducts.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
              {filteredProducts.map(p => (
                <button key={p.id} onClick={() => addItem(p)} className="w-full text-left px-4 py-3 hover:bg-[var(--muted)] transition-colors flex justify-between">
                  <div><p className="text-sm font-medium">{p.name}</p><p className="text-xs text-[var(--muted-foreground)]">{p.manufacturer} · Stock: {p.currentStock}</p></div>
                  <span className="text-sm font-medium">{formatCurrency(p.sellingPrice)}</span>
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
              <th className="text-right py-2 px-2 text-xs text-[var(--muted-foreground)]">Price</th>
              <th className="text-right py-2 px-2 text-xs text-[var(--muted-foreground)]">Total</th>
              <th className="py-2 px-2"></th>
            </tr></thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2 px-2 font-medium">{item.productName}</td>
                  <td className="py-2 px-2 text-center"><input type="number" min={1} value={item.quantity} onChange={e => updateItem(idx, "quantity", parseInt(e.target.value) || 1)} className="w-20 text-center px-2 py-1 bg-[var(--muted)] rounded-lg text-sm" /></td>
                  <td className="py-2 px-2 text-right">{formatCurrency(item.price)}</td>
                  <td className="py-2 px-2 text-right font-semibold">{formatCurrency(item.quantity * item.price)}</td>
                  <td className="py-2 px-2 text-center"><button onClick={() => removeItem(idx)} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[var(--primary)]">
                <td colSpan={3} className="py-3 px-2 text-right font-bold text-lg">Grand Total:</td>
                <td className="py-3 px-2 text-right font-bold text-lg text-[var(--primary)]">{formatCurrency(total)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Link href="/orders" className="px-6 py-2.5 border border-[var(--border)] rounded-xl text-sm font-medium hover:bg-[var(--muted)] transition-colors">Cancel</Link>
        <button onClick={handleSubmit} className="px-6 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:opacity-90"><Save className="w-4 h-4" /> Create Order</button>
      </div>
    </div>
  )
}
