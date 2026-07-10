"use client"

import { useState, useMemo } from "react"
import { useData } from "@/lib/store"
import { useToast } from "@/lib/toast"
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils"
import { Users, Plus, Search, X, Save, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"

export default function CustomersPage() {
  const { customers, addCustomer, logActivity } = useData()
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [segmentFilter, setSegmentFilter] = useState("All")
  const [showAddModal, setShowAddModal] = useState(false)
  const [form, setForm] = useState({ name: "", storeName: "", gstNumber: "", phone: "", email: "", address: "", city: "", state: "Maharashtra", segment: "Bronze" as "Gold"|"Silver"|"Bronze", creditLimit: "50000" })

  const filtered = useMemo(() => {
    let list = customers
    if (search) list = list.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.storeName.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search))
    if (segmentFilter !== "All") list = list.filter(c => c.segment === segmentFilter)
    return list
  }, [customers, search, segmentFilter])

  const handleAdd = () => {
    if (!form.name || !form.storeName || !form.phone) { toast("error", "Fill required fields", "Name, store name, and phone are required"); return }
    const c = addCustomer({
      name: form.name, storeName: form.storeName, gstNumber: form.gstNumber || `GST${Date.now().toString(36).toUpperCase()}`,
      phone: form.phone, email: form.email, address: form.address, city: form.city, state: form.state, segment: form.segment,
      creditLimit: parseFloat(form.creditLimit), totalOrders: 0, totalRevenue: 0, outstandingAmount: 0, lastPurchaseDate: "",
      drugLicense: "", paymentTerms: "Net 30", avgOrderValue: 0, joinedDate: new Date().toISOString().split("T")[0]
    })
    logActivity({ type: "customer", title: "New Customer Added", description: `${c.name} — ${c.storeName}`, user: "Rajesh Sharma", icon: "UserPlus" })
    toast("success", "Customer Added", `${c.name} has been created`)
    setShowAddModal(false)
    setForm({ name: "", storeName: "", gstNumber: "", phone: "", email: "", address: "", city: "", state: "Maharashtra", segment: "Bronze", creditLimit: "50000" })
  }

  const inputCls = "w-full px-3 py-2.5 bg-[var(--muted)] border border-transparent rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
  const segStyles: Record<string, string> = { Gold: "segment-gold", Silver: "segment-silver", Bronze: "segment-bronze" }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Users className="w-6 h-6 text-[var(--primary)]" /> Customers</h1><p className="text-sm text-[var(--muted-foreground)]">{customers.length} customers · {formatCurrency(customers.reduce((s, c) => s + c.totalRevenue, 0))} total revenue</p></div>
        <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 gradient-bg text-white rounded-xl font-medium text-sm hover:opacity-90 transition-opacity shadow-md"><Plus className="w-4 h-4" /> Add Customer</button>
      </div>

      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." className={`${inputCls} pl-10`} /></div>
        <select value={segmentFilter} onChange={e => setSegmentFilter(e.target.value)} className={`${inputCls} sm:w-36`}><option value="All">All Segments</option><option value="Gold">Gold</option><option value="Silver">Silver</option><option value="Bronze">Bronze</option></select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(c => (
          <Link key={c.id} href={`/customers/${c.id}`} className="glass-card p-5 hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold">{c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                <div><p className="font-semibold text-foreground group-hover:text-[var(--primary)]">{c.name}</p><p className="text-xs text-[var(--muted-foreground)]">{c.storeName}</p></div>
              </div>
              <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${segStyles[c.segment]}`}>{c.segment}</span>
            </div>
            <div className="space-y-1.5 text-xs text-[var(--muted-foreground)]">
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />{c.city}, {c.state}</div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{c.phone}</div>
              {c.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" />{c.email}</div>}
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]">
              <div><p className="text-xs text-[var(--muted-foreground)]">Revenue</p><p className="text-sm font-bold">{formatCurrency(c.totalRevenue)}</p></div>
              <div className="text-right"><p className="text-xs text-[var(--muted-foreground)]">Orders</p><p className="text-sm font-bold">{c.totalOrders}</p></div>
              <div className="text-right"><p className="text-xs text-[var(--muted-foreground)]">Outstanding</p><p className={`text-sm font-bold ${c.outstandingAmount > 0 ? "text-amber-600" : "text-emerald-600"}`}>{formatCurrency(c.outstandingAmount)}</p></div>
            </div>
          </Link>
        ))}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-[var(--card)] rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between"><h3 className="text-lg font-bold">Add Customer</h3><button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-[var(--muted)]"><X className="w-5 h-5" /></button></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Name *</label><input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className={inputCls} placeholder="Customer name" /></div>
              <div className="col-span-2"><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Store Name *</label><input value={form.storeName} onChange={e => setForm(p => ({...p, storeName: e.target.value}))} className={inputCls} placeholder="Store/Business name" /></div>
              <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Phone *</label><input value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} className={inputCls} placeholder="+91..." /></div>
              <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Email</label><input value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} className={inputCls} placeholder="email@..." /></div>
              <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">GST Number</label><input value={form.gstNumber} onChange={e => setForm(p => ({...p, gstNumber: e.target.value}))} className={inputCls} placeholder="27AAAAA0000A1Z5" /></div>
              <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">City</label><input value={form.city} onChange={e => setForm(p => ({...p, city: e.target.value}))} className={inputCls} placeholder="Mumbai" /></div>
              <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Segment</label><select value={form.segment} onChange={e => setForm(p => ({...p, segment: e.target.value as "Gold"|"Silver"|"Bronze"}))} className={inputCls}><option>Gold</option><option>Silver</option><option>Bronze</option></select></div>
              <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Credit Limit</label><input type="number" value={form.creditLimit} onChange={e => setForm(p => ({...p, creditLimit: e.target.value}))} className={inputCls} /></div>
              <div className="col-span-2"><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Address</label><textarea value={form.address} onChange={e => setForm(p => ({...p, address: e.target.value}))} className={`${inputCls} h-16 resize-none`} placeholder="Full address" /></div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-[var(--border)] rounded-lg text-sm">Cancel</button>
              <button onClick={handleAdd} className="px-4 py-2 gradient-bg text-white rounded-lg text-sm font-medium flex items-center gap-2"><Save className="w-4 h-4" /> Add Customer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
