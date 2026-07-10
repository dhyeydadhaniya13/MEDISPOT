"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useData } from "@/lib/store"
import { useToast } from "@/lib/toast"
import { formatCurrency } from "@/lib/utils"
import { Truck, Plus, Search, Star, Phone, Mail, MapPin, X } from "lucide-react"

interface DistributorForm {
  name: string; agencyCode: string; gstNumber: string; drugLicense: string
  contactPerson: string; phone: string; email: string; address: string
  city: string; state: string; totalPurchases: number; outstandingAmount: number; rating: number
}

const emptyForm: DistributorForm = { name: "", agencyCode: "", gstNumber: "", drugLicense: "", contactPerson: "", phone: "", email: "", address: "", city: "", state: "", totalPurchases: 0, outstandingAmount: 0, rating: 4 }

export default function DistributorsPage() {
  const { distributors, addDistributor, updateDistributor } = useData()
  const { toast } = useToast()
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<DistributorForm>(emptyForm)

  const filtered = useMemo(() => {
    if (!search) return distributors
    const s = search.toLowerCase()
    return distributors.filter(d => d.name.toLowerCase().includes(s) || d.agencyCode.toLowerCase().includes(s) || d.city.toLowerCase().includes(s) || d.contactPerson.toLowerCase().includes(s))
  }, [search, distributors])

  const totalPurchases = distributors.reduce((s, d) => s + d.totalPurchases, 0)
  const totalOutstanding = distributors.reduce((s, d) => s + d.outstandingAmount, 0)
  const avgRating = distributors.length > 0 ? (distributors.reduce((s, d) => s + d.rating, 0) / distributors.length).toFixed(1) : "0"

  const openAdd = () => { setEditId(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (d: typeof distributors[0]) => {
    setEditId(d.id)
    setForm({ name: d.name, agencyCode: d.agencyCode, gstNumber: d.gstNumber, drugLicense: d.drugLicense, contactPerson: d.contactPerson, phone: d.phone, email: d.email, address: d.address, city: d.city, state: d.state, totalPurchases: d.totalPurchases, outstandingAmount: d.outstandingAmount, rating: d.rating })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.name || !form.contactPerson || !form.phone) {
      toast("error", "Validation Error", "Name, contact person, and phone are required")
      return
    }
    if (editId) {
      updateDistributor(editId, form)
      toast("success", "Distributor Updated", `${form.name} has been updated successfully`)
    } else {
      addDistributor(form)
      toast("success", "Distributor Added", `${form.name} has been added successfully`)
    }
    setModalOpen(false)
    setForm(emptyForm)
    setEditId(null)
  }

  const inputCls = "w-full px-3 py-2 bg-[var(--muted)] border border-transparent rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Truck className="w-6 h-6 text-[var(--primary)]" /> Distributor Management</h1><p className="text-sm text-[var(--muted-foreground)]">Manage your supplier and distributor network</p></div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 gradient-bg text-white rounded-xl font-medium text-sm hover:opacity-90 shadow-md"><Plus className="w-4 h-4" /> Add Distributor</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Distributors", value: distributors.length, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-400" },
          { label: "Total Purchases", value: formatCurrency(totalPurchases), color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400" },
          { label: "Outstanding", value: formatCurrency(totalOutstanding), color: "text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-400" },
          { label: "Avg Rating", value: `${avgRating} / 5`, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400" },
        ].map(s => (
          <div key={s.label} className="glass-card p-4"><p className="text-xs text-[var(--muted-foreground)]">{s.label}</p><p className={`text-xl font-bold mt-1 ${s.color.split(" ")[0]}`}>{s.value}</p></div>
        ))}
      </div>

      <div className="glass-card p-4">
        <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search distributors..." className="w-full pl-10 pr-4 py-2 bg-[var(--muted)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(d => (
          <Link key={d.id} href={`/distributors/${d.id}`} className="glass-card p-5 hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{d.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                <div><h3 className="font-semibold text-foreground group-hover:text-[var(--primary)] transition-colors leading-tight">{d.name}</h3><p className="text-xs text-[var(--muted-foreground)] font-mono">{d.agencyCode}</p></div>
              </div>
              <div className="flex items-center gap-1 text-amber-500"><Star className="w-3.5 h-3.5 fill-current" /><span className="text-xs font-bold">{d.rating}</span></div>
            </div>
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]"><Phone className="w-3.5 h-3.5" /> {d.contactPerson} · {d.phone}</div>
              <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]"><MapPin className="w-3.5 h-3.5" /> {d.city}, {d.state}</div>
              <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]"><Mail className="w-3.5 h-3.5" /> {d.email}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[var(--border)]">
              <div><p className="text-[10px] text-[var(--muted-foreground)]">Total Purchases</p><p className="text-sm font-bold text-emerald-600">{formatCurrency(d.totalPurchases)}</p></div>
              <div><p className="text-[10px] text-[var(--muted-foreground)]">Outstanding</p><p className={`text-sm font-bold ${d.outstandingAmount > 0 ? "text-red-600" : "text-foreground"}`}>{formatCurrency(d.outstandingAmount)}</p></div>
            </div>
            <div className="mt-3 pt-3 border-t border-[var(--border)] flex justify-end gap-2">
              <button onClick={(e) => { e.preventDefault(); router.push(`/distributors/${d.id}`) }} className="text-xs px-3 py-1.5 rounded-md bg-[var(--muted)] hover:bg-[var(--primary)] hover:text-white transition-colors font-medium">View</button>
              <button onClick={(e) => { e.preventDefault(); openEdit(d) }} className="text-xs px-3 py-1.5 rounded-md bg-[var(--muted)] hover:bg-[var(--primary)] hover:text-white transition-colors font-medium">Edit</button>
            </div>
          </Link>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--card)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[var(--border)]">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2 className="text-lg font-bold text-foreground">{editId ? "Edit Distributor" : "Add New Distributor"}</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Distributor Name *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="e.g. ABC Pharma Distributors" /></div>
                <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Agency Code</label><input value={form.agencyCode} onChange={e => setForm(f => ({ ...f, agencyCode: e.target.value }))} className={inputCls} placeholder="e.g. AGC-001" /></div>
                <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Contact Person *</label><input value={form.contactPerson} onChange={e => setForm(f => ({ ...f, contactPerson: e.target.value }))} className={inputCls} placeholder="e.g. Rajesh Kumar" /></div>
                <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Phone *</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} placeholder="e.g. +91 98765 43210" /></div>
                <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Email</label><input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls} placeholder="e.g. contact@abc.com" /></div>
                <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">GST Number</label><input value={form.gstNumber} onChange={e => setForm(f => ({ ...f, gstNumber: e.target.value }))} className={inputCls} placeholder="e.g. 27AABCM1234A1Z5" /></div>
                <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Drug License</label><input value={form.drugLicense} onChange={e => setForm(f => ({ ...f, drugLicense: e.target.value }))} className={inputCls} placeholder="e.g. MH-WS-000001" /></div>
                <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">City</label><input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className={inputCls} placeholder="e.g. Mumbai" /></div>
                <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">State</label><input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} className={inputCls} placeholder="e.g. Maharashtra" /></div>
                <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Rating (1-5)</label><input type="number" min={1} max={5} step={0.1} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))} className={inputCls} /></div>
              </div>
              <div><label className="text-xs font-medium text-[var(--muted-foreground)] block mb-1">Address</label><input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className={inputCls} placeholder="Full address" /></div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-[var(--border)]">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 border border-[var(--border)] rounded-xl text-sm font-medium hover:bg-[var(--muted)] transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-6 py-2 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">{editId ? "Update" : "Add"} Distributor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
