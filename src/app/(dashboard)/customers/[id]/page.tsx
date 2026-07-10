"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useData } from "@/lib/store"
import { useToast } from "@/lib/toast"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowLeft, Phone, Mail, MapPin, Crown, Medal, Award, ShoppingCart, CreditCard, RefreshCw, FileText } from "lucide-react"

const segmentStyle: Record<string, string> = { Gold: "segment-gold", Silver: "segment-silver", Bronze: "segment-bronze" }
const segmentIcon: Record<string, React.ElementType> = { Gold: Crown, Silver: Medal, Bronze: Award }

function getStatusColor(status: string) {
  const c: Record<string, string> = { Delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", Shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400", Processing: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", Pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400", Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" }
  return c[status] || c.Pending
}

export default function CustomerDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { customers, orders, reorderSuggestions, invoices, addOrder, products, logActivity } = useData()
  const { toast } = useToast()
  
  const customer = customers.find(c => c.id === id)
  if (!customer) return <div className="flex items-center justify-center h-96"><div className="text-center"><p className="text-lg font-semibold">Customer not found</p><Link href="/customers" className="text-[var(--primary)] text-sm">← Back to Customers</Link></div></div>

  const SegIcon = segmentIcon[customer.segment]
  const customerOrders = orders.filter(o => o.customerId === customer.id)
  const customerReorders = reorderSuggestions.filter(r => r.customerId === customer.id)
  const customerInvoices = invoices.filter(i => i.customerId === customer.id)

  const [activeTab, setActiveTab] = useState(0)

  const handleCreateOrder = (productName: string, qty: number) => {
    // Find product selling price if it exists
    const prod = products.find(p => p.name.toLowerCase() === productName.toLowerCase())
    const price = prod ? prod.sellingPrice : 150 // default price if not found
    const total = qty * price

    const newOrder = addOrder({
      orderNumber: `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      customerId: customer.id,
      customerName: customer.name,
      date: new Date().toISOString().split("T")[0],
      items: [{ productName, quantity: qty, price }],
      total,
      status: "Pending",
      branchId: "BR001"
    })

    logActivity({
      type: "order",
      title: "Reorder suggestion converted",
      description: `Created Order ${newOrder.orderNumber} for ${customer.name} - ${qty}x ${productName}`,
      user: "Rajesh Sharma",
      icon: "ShoppingCart"
    })

    toast("success", "Order Created Successfully", `Order ${newOrder.orderNumber} created for ${formatCurrency(total)}`)
    router.push("/orders")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/customers" className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white text-lg font-bold">{customer.name.split(" ").map(n => n[0]).join("")}</div>
          <div><h1 className="text-xl font-bold text-foreground">{customer.name}</h1><p className="text-sm text-[var(--muted-foreground)]">{customer.storeName}</p></div>
        </div>
        <span className={`px-3 py-1.5 text-xs font-bold rounded-full flex items-center gap-1.5 ${segmentStyle[customer.segment]}`}><SegIcon className="w-3.5 h-3.5" /> {customer.segment}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3"><Phone className="w-4 h-4 text-[var(--primary)] mt-0.5 flex-shrink-0" /><div><p className="text-xs text-[var(--muted-foreground)]">Phone</p><p className="text-sm font-medium">{customer.phone}</p></div></div>
            <div className="flex items-start gap-3"><Mail className="w-4 h-4 text-[var(--primary)] mt-0.5 flex-shrink-0" /><div><p className="text-xs text-[var(--muted-foreground)]">Email</p><p className="text-sm font-medium">{customer.email}</p></div></div>
            <div className="flex items-start gap-3"><MapPin className="w-4 h-4 text-[var(--primary)] mt-0.5 flex-shrink-0" /><div><p className="text-xs text-[var(--muted-foreground)]">Address</p><p className="text-sm font-medium">{customer.address}, {customer.city}, {customer.state}</p></div></div>
          </div>
          <div className="pt-3 border-t border-[var(--border)] space-y-2">
            <div className="flex justify-between text-sm"><span className="text-[var(--muted-foreground)]">GST Number</span><span className="font-mono text-xs font-medium">{customer.gstNumber}</span></div>
            <div className="flex justify-between text-sm"><span className="text-[var(--muted-foreground)]">Drug License</span><span className="font-mono text-xs font-medium">{customer.drugLicense}</span></div>
            <div className="flex justify-between text-sm"><span className="text-[var(--muted-foreground)]">Payment Terms</span><span className="font-medium">{customer.paymentTerms}</span></div>
            <div className="flex justify-between text-sm"><span className="text-[var(--muted-foreground)]">Joined</span><span className="font-medium">{formatDate(customer.joinedDate)}</span></div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4 content-start">
          {[
            { label: "Total Revenue", value: formatCurrency(customer.totalRevenue), icon: "₹", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
            { label: "Total Orders", value: customer.totalOrders, icon: "🛒", color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" },
            { label: "Avg Order Value", value: formatCurrency(customer.totalOrders > 0 ? customer.totalRevenue / customer.totalOrders : 0), icon: "📊", color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20" },
            { label: "Credit Limit", value: formatCurrency(customer.creditLimit), icon: "💳", color: "text-violet-600 bg-violet-50 dark:bg-violet-900/20" },
            { label: "Outstanding", value: formatCurrency(customer.outstandingAmount), icon: "⚠️", color: `${customer.outstandingAmount > 0 ? "text-red-600 bg-red-50 dark:bg-red-900/20" : "text-gray-600 bg-gray-50 dark:bg-gray-800"}` },
            { label: "Last Purchase", value: customer.lastPurchaseDate ? formatDate(customer.lastPurchaseDate) : "Never", icon: "📅", color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
          ].map(m => (
            <div key={m.label} className={`glass-card p-4 ${m.color}`}>
              <p className="text-xs opacity-75 mb-1">{m.label}</p>
              <p className="text-lg font-bold">{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-card overflow-hidden">
        <div className="flex border-b border-[var(--border)] overflow-x-auto">
          {[
            { label: "Orders", icon: ShoppingCart, count: customerOrders.length },
            { label: "Invoices", icon: FileText, count: customerInvoices.length },
            { label: "Reorder Suggestions", icon: RefreshCw, count: customerReorders.length },
          ].map((t, idx) => (
            <button key={t.label} onClick={() => setActiveTab(idx)} className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === idx
                ? "border-[var(--primary)] text-[var(--primary)]"
                : "border-transparent text-[var(--muted-foreground)] hover:text-foreground"
            }`}>
              <t.icon className="w-4 h-4" /> {t.label} <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-[var(--primary)] text-white">{t.count}</span>
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-[var(--muted)]">
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Order #</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden sm:table-cell">Items</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Total</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Status</th>
              </tr></thead>
              <tbody>
                {customerOrders.length > 0 ? customerOrders.map(o => (
                  <tr key={o.id} className="border-b border-[var(--border)] last:border-0 table-row-hover">
                    <td className="py-3 px-4 font-medium text-[var(--primary)]">{o.orderNumber}</td>
                    <td className="py-3 px-4">{formatDate(o.date)}</td>
                    <td className="py-3 px-4 hidden sm:table-cell text-[var(--muted-foreground)]">{o.items.length} items</td>
                    <td className="py-3 px-4 text-right font-semibold">{formatCurrency(o.total)}</td>
                    <td className="py-3 px-4 text-center"><span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(o.status)}`}>{o.status}</span></td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="py-8 text-center text-[var(--muted-foreground)] text-sm">No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 1 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-[var(--muted)]">
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Invoice #</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Date</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Total</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Status</th>
              </tr></thead>
              <tbody>
                {customerInvoices.length > 0 ? customerInvoices.map(inv => (
                  <tr key={inv.id} className="border-b border-[var(--border)] last:border-0 table-row-hover">
                    <td className="py-3 px-4 font-mono font-medium text-[var(--primary)]">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4">{formatDate(inv.date)}</td>
                    <td className="py-3 px-4 text-right font-semibold">{formatCurrency(inv.grandTotal)}</td>
                    <td className="py-3 px-4 text-center"><span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">{inv.status}</span></td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="py-8 text-center text-[var(--muted-foreground)] text-sm">No invoices found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Reorder Suggestions Tab */}
        {activeTab === 2 && (
          <div className="p-5">
            {customerReorders.length > 0 ? customerReorders.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--muted)] mb-2">
                <div><p className="font-semibold text-foreground">{r.productName}</p><p className="text-xs text-[var(--muted-foreground)]">Reorder by: {formatDate(r.expectedReorderDate)} · Qty: {r.recommendedQty}</p></div>
                <div className="flex items-center gap-3">
                  <div className="text-right"><div className="w-20 h-1.5 bg-[var(--border)] rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${r.confidence}%` }} /></div><p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{r.confidence}% confidence</p></div>
                  <button onClick={() => handleCreateOrder(r.productName, r.recommendedQty)} className="px-3 py-1.5 gradient-bg text-white rounded-lg text-xs font-medium">Order</button>
                </div>
              </div>
            )) : <p className="text-center text-[var(--muted-foreground)] py-8">No suggestions available</p>}
          </div>
        )}
      </div>
    </div>
  )
}
