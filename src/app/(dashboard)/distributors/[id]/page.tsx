"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { distributors } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"
import { ArrowLeft, Phone, Mail, MapPin, Star, FileText, IndianRupee } from "lucide-react"

export default function DistributorDetailPage() {
  const { id } = useParams()
  const d = distributors.find(d => d.id === id)
  if (!d) return <div className="flex items-center justify-center h-96"><div className="text-center"><Link href="/distributors" className="text-[var(--primary)] text-sm">← Back to Distributors</Link><p className="mt-2 text-lg font-semibold">Distributor not found</p></div></div>

  const mockPurchaseHistory = [
    { date: "2026-06-25", po: "PO-2026-0055", items: 12, total: 285000, status: "Received" },
    { date: "2026-06-10", po: "PO-2026-0048", items: 8, total: 192000, status: "Received" },
    { date: "2026-05-28", po: "PO-2026-0041", items: 15, total: 348000, status: "Received" },
    { date: "2026-05-15", po: "PO-2026-0034", items: 6, total: 145000, status: "Received" },
    { date: "2026-04-30", po: "PO-2026-0027", items: 20, total: 520000, status: "Received" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/distributors" className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-white text-lg font-bold">{d.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
          <div><h1 className="text-xl font-bold text-foreground">{d.name}</h1><p className="text-sm text-[var(--muted-foreground)] font-mono">{d.agencyCode}</p></div>
        </div>
        <div className="flex items-center gap-1 text-amber-500"><Star className="w-5 h-5 fill-current" /><span className="text-xl font-bold text-foreground">{d.rating}</span></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-sm font-semibold">Contact & Details</h3>
          <div className="space-y-3">
            <div className="flex gap-3"><Phone className="w-4 h-4 text-[var(--primary)] mt-0.5" /><div><p className="text-xs text-[var(--muted-foreground)]">Contact Person</p><p className="text-sm font-medium">{d.contactPerson}</p><p className="text-sm font-medium">{d.phone}</p></div></div>
            <div className="flex gap-3"><Mail className="w-4 h-4 text-[var(--primary)] mt-0.5" /><div><p className="text-xs text-[var(--muted-foreground)]">Email</p><p className="text-sm font-medium">{d.email}</p></div></div>
            <div className="flex gap-3"><MapPin className="w-4 h-4 text-[var(--primary)] mt-0.5" /><div><p className="text-xs text-[var(--muted-foreground)]">Address</p><p className="text-sm font-medium">{d.address}, {d.city}, {d.state}</p></div></div>
          </div>
          <div className="pt-3 border-t border-[var(--border)] space-y-2">
            <div className="flex justify-between text-sm"><span className="text-[var(--muted-foreground)]">GST Number</span><span className="font-mono text-xs">{d.gstNumber}</span></div>
            <div className="flex justify-between text-sm"><span className="text-[var(--muted-foreground)]">Drug License</span><span className="font-mono text-xs">{d.drugLicense}</span></div>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-4 content-start">
          {[
            { label: "Total Purchases", value: formatCurrency(d.totalPurchases), color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
            { label: "Outstanding Amount", value: formatCurrency(d.outstandingAmount), color: d.outstandingAmount > 0 ? "text-red-600 bg-red-50 dark:bg-red-900/20" : "text-gray-600 bg-gray-50 dark:bg-gray-800" },
            { label: "Avg Order Value", value: formatCurrency(d.totalPurchases / 12), color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" },
            { label: "Rating", value: `${d.rating} / 5.0`, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
          ].map(m => (
            <div key={m.label} className={`glass-card p-4 ${m.color}`}><p className="text-xs opacity-75 mb-1">{m.label}</p><p className="text-xl font-bold">{m.value}</p></div>
          ))}
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-[var(--border)]"><h3 className="text-sm font-semibold flex items-center gap-2"><FileText className="w-4 h-4 text-[var(--primary)]" /> Purchase History</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[var(--muted)]">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Date</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">PO Number</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Items</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Total</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Status</th>
            </tr></thead>
            <tbody>
              {mockPurchaseHistory.map(p => (
                <tr key={p.po} className="border-b border-[var(--border)] last:border-0 table-row-hover">
                  <td className="py-3 px-4">{p.date}</td>
                  <td className="py-3 px-4 font-mono text-[var(--primary)]">{p.po}</td>
                  <td className="py-3 px-4 text-center">{p.items}</td>
                  <td className="py-3 px-4 text-right font-semibold">{formatCurrency(p.total)}</td>
                  <td className="py-3 px-4 text-center"><span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
