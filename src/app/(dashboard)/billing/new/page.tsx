"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useData } from "@/lib/store"
import { useToast } from "@/lib/toast"
import { formatCurrency } from "@/lib/utils"
import { ArrowLeft, Plus, Trash2, Lightbulb, IndianRupee } from "lucide-react"

interface LineItem { productId: string; productName: string; qty: number; unitPrice: number; discount: number; gstPercent: number }

export default function NewInvoicePage() {
  const { customers, products, productRecommendations, invoices, addInvoice, addOrder, logActivity } = useData()
  const { toast } = useToast()
  const router = useRouter()

  const [customerId, setCustomerId] = useState("")
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0])
  const [dueDate, setDueDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split("T")[0] })
  const [items, setItems] = useState<LineItem[]>([{ productId: "", productName: "", qty: 1, unitPrice: 0, discount: 0, gstPercent: 12 }])
  const [extraDiscount, setExtraDiscount] = useState(0)
  const [notes, setNotes] = useState("")

  const selectedCustomer = customers.find(c => c.id === customerId)

  const addItem = () => setItems(prev => [...prev, { productId: "", productName: "", qty: 1, unitPrice: 0, discount: 0, gstPercent: 12 }])
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i))
  const updateItem = (i: number, field: keyof LineItem, value: string | number) => {
    setItems(prev => {
      const next = [...prev]
      if (field === "productId") {
        const p = products.find(p => p.id === value)
        if (p) next[i] = { ...next[i], productId: p.id, productName: p.name, unitPrice: p.sellingPrice, gstPercent: p.gstPercent }
        else next[i] = { ...next[i], [field]: value as string }
      } else {
        next[i] = { ...next[i], [field]: value }
      }
      return next
    })
  }

  const subtotal = items.reduce((s, it) => s + it.qty * it.unitPrice, 0)
  const itemDiscounts = items.reduce((s, it) => s + (it.qty * it.unitPrice * it.discount / 100), 0)
  const taxableAmount = subtotal - itemDiscounts - extraDiscount
  const cgst = items.reduce((s, it) => { const taxable = it.qty * it.unitPrice * (1 - it.discount / 100); return s + (taxable * it.gstPercent / 200) }, 0)
  const sgst = cgst
  const grandTotal = taxableAmount + cgst + sgst

  // Recommendations based on first selected product
  const firstProduct = items.find(it => it.productName)
  const recs = firstProduct ? productRecommendations.find(r => r.triggerProduct === firstProduct.productName)?.recommendations || [] : []

  const generateInvoiceNumber = () => {
    const count = invoices.length + 1
    const year = new Date().getFullYear()
    return `INV-${year}-${String(count).padStart(4, "0")}`
  }

  const handleSubmit = (status: "Sent" | "Draft") => {
    if (!customerId) {
      toast("error", "Validation Error", "Please select a customer")
      return
    }
    if (items.every(it => !it.productId)) {
      toast("error", "Validation Error", "Please add at least one product")
      return
    }

    const invoiceNumber = generateInvoiceNumber()
    const invoiceItems = items.filter(it => it.productId).map(it => {
      const taxable = it.qty * it.unitPrice * (1 - it.discount / 100)
      const gstAmount = taxable * it.gstPercent / 100
      return {
        productId: it.productId,
        productName: it.productName,
        batchNumber: products.find(p => p.id === it.productId)?.batchNumber || "",
        quantity: it.qty,
        unitPrice: it.unitPrice,
        discount: it.discount,
        gstPercent: it.gstPercent,
        gstAmount,
        total: taxable + gstAmount,
      }
    })

    const newInvoice = addInvoice({
      invoiceNumber,
      customerId,
      customerName: selectedCustomer?.name || "",
      storeName: selectedCustomer?.storeName || "",
      date: invoiceDate,
      dueDate,
      items: invoiceItems,
      subtotal,
      discountAmount: itemDiscounts + extraDiscount,
      gstAmount: cgst + sgst,
      grandTotal,
      status,
      paymentStatus: "Pending",
      branchId: "BR001",
    })

    logActivity({
      type: "invoice",
      title: `Invoice ${invoiceNumber} Created`,
      description: `${status} invoice for ${selectedCustomer?.name} — ${formatCurrency(grandTotal)}`,
      user: "Current User",
      icon: "📄",
    })

    toast("success", "Invoice Created", `${invoiceNumber} for ${formatCurrency(grandTotal)} has been ${status === "Draft" ? "saved as draft" : "generated"}`)
    router.push("/billing")
  }

  const handleAddRecommendedProduct = (productName: string) => {
    const product = products.find(p => p.name === productName)
    if (product) {
      setItems(prev => [...prev, { productId: product.id, productName: product.name, qty: 1, unitPrice: product.sellingPrice, discount: 0, gstPercent: product.gstPercent }])
      toast("success", "Product Added", `${productName} added to invoice`)
    } else {
      toast("warning", "Product Not Found", `${productName} is not in the product catalog`)
    }
  }

  const inputCls = "w-full px-2.5 py-2 bg-[var(--muted)] border border-transparent rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/billing" className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <div><h1 className="text-2xl font-bold text-foreground">Create New Invoice</h1><p className="text-sm text-[var(--muted-foreground)]">GST-compliant invoice generation</p></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Form */}
        <div className="xl:col-span-2 space-y-5">
          {/* Customer & Dates */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-4">Invoice Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Customer *</label>
                <select value={customerId} onChange={e => setCustomerId(e.target.value)} className={inputCls}>
                  <option value="">Select customer…</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name} — {c.storeName}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Invoice Date</label>
                <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Due Date</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-4">Line Items</h3>
            <div className="space-y-3">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-2 px-1">
                {["Product", "Qty", "Rate", "Disc%", "GST%", "Amount", ""].map((h, i) => (
                  <div key={i} className={`text-[10px] font-semibold uppercase text-[var(--muted-foreground)] ${i === 0 ? "col-span-4" : i === 5 ? "col-span-2 text-right" : i === 6 ? "col-span-1" : "col-span-1 text-right"}`}>{h}</div>
                ))}
              </div>

              {items.map((item, idx) => {
                const amount = item.qty * item.unitPrice * (1 - item.discount / 100)
                const gstAmt = amount * item.gstPercent / 100
                const lineTotal = amount + gstAmt
                return (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center p-3 bg-[var(--muted)] rounded-xl">
                    <div className="col-span-12 md:col-span-4">
                      <select value={item.productId} onChange={e => updateItem(idx, "productId", e.target.value)} className={inputCls}>
                        <option value="">Select product…</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="col-span-4 md:col-span-1">
                      <input type="number" min="1" value={item.qty} onChange={e => updateItem(idx, "qty", Number(e.target.value))} className={inputCls} />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <input type="number" value={item.unitPrice} onChange={e => updateItem(idx, "unitPrice", Number(e.target.value))} className={inputCls} />
                    </div>
                    <div className="col-span-4 md:col-span-1">
                      <input type="number" min="0" max="100" value={item.discount} onChange={e => updateItem(idx, "discount", Number(e.target.value))} className={inputCls} />
                    </div>
                    <div className="col-span-4 md:col-span-1">
                      <select value={item.gstPercent} onChange={e => updateItem(idx, "gstPercent", Number(e.target.value))} className={inputCls}>
                        {[0,5,12,18,28].map(r => <option key={r} value={r}>{r}%</option>)}
                      </select>
                    </div>
                    <div className="col-span-7 md:col-span-2 text-right font-semibold text-sm">{formatCurrency(lineTotal)}</div>
                    <div className="col-span-1 flex justify-end">
                      <button onClick={() => removeItem(idx)} disabled={items.length === 1} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 disabled:opacity-30 disabled:cursor-not-allowed">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <button onClick={addItem} className="mt-4 flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:opacity-75 transition-opacity">
              <Plus className="w-4 h-4" /> Add Line Item
            </button>
          </div>

          {/* Discount & Notes */}
          <div className="glass-card p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Additional Discount (₹)</label>
                <input type="number" min="0" value={extraDiscount} onChange={e => setExtraDiscount(Number(e.target.value))} className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Notes / Terms</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} className={`${inputCls} h-20 resize-none`} placeholder="Payment terms, special instructions…" />
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          {recs.length > 0 && (
            <div className="glass-card p-5 border border-[var(--primary)]/20">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-[var(--primary)]"><Lightbulb className="w-4 h-4" /> AI Product Recommendations</h3>
              <p className="text-xs text-[var(--muted-foreground)] mb-3">Customers who buy <strong>{firstProduct?.productName}</strong> also buy:</p>
              <div className="space-y-2">
                {recs.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[var(--muted)]">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{r.productName}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{r.reason}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-24 h-1.5 bg-[var(--border)] rounded-full overflow-hidden"><div className="h-full bg-[var(--primary)] rounded-full" style={{ width: `${r.confidence}%` }} /></div>
                        <span className="text-[10px] text-[var(--muted-foreground)]">{r.confidence}% match</span>
                      </div>
                    </div>
                    <button onClick={() => handleAddRecommendedProduct(r.productName)} className="ml-3 px-3 py-1.5 text-xs font-medium border border-[var(--primary)] text-[var(--primary)] rounded-lg hover:bg-[var(--primary)]/10 transition-colors">Add</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Summary */}
        <div className="xl:col-span-1">
          <div className="glass-card p-5 sticky top-24">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><IndianRupee className="w-4 h-4 text-[var(--primary)]" /> Invoice Summary</h3>
            {selectedCustomer && (
              <div className="mb-4 p-3 rounded-xl bg-[var(--muted)]">
                <p className="text-sm font-semibold text-foreground">{selectedCustomer.name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{selectedCustomer.storeName}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">GST: {selectedCustomer.gstNumber}</p>
              </div>
            )}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">Items</span><span className="font-medium">{items.length}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">Subtotal</span><span className="font-medium">{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between text-red-600"><span>Item Discounts</span><span>-{formatCurrency(itemDiscounts)}</span></div>
              {extraDiscount > 0 && <div className="flex justify-between text-red-600"><span>Extra Discount</span><span>-{formatCurrency(extraDiscount)}</span></div>}
              <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">Taxable Amount</span><span className="font-medium">{formatCurrency(taxableAmount)}</span></div>
              <div className="border-t border-[var(--border)] pt-2 space-y-1">
                <div className="flex justify-between text-xs text-[var(--muted-foreground)]"><span>CGST</span><span>{formatCurrency(cgst)}</span></div>
                <div className="flex justify-between text-xs text-[var(--muted-foreground)]"><span>SGST</span><span>{formatCurrency(sgst)}</span></div>
              </div>
              <div className="border-t border-[var(--border)] pt-3 flex justify-between items-center">
                <span className="text-base font-bold text-foreground">Grand Total</span>
                <span className="text-xl font-bold gradient-text">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <button className="w-full px-4 py-2.5 gradient-bg text-white rounded-xl font-medium text-sm hover:opacity-90 transition-opacity" onClick={() => handleSubmit("Sent")}>Generate Invoice</button>
              <button className="w-full px-4 py-2.5 border border-[var(--border)] rounded-xl text-sm font-medium hover:bg-[var(--muted)] transition-colors" onClick={() => handleSubmit("Draft")}>Save as Draft</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
