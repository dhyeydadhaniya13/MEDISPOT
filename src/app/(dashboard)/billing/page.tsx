"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useData } from "@/lib/store"
import { useToast } from "@/lib/toast"
import { generateInvoicePDF } from "@/lib/export"
import { formatCurrency, formatDate } from "@/lib/utils"
import { FileText, Plus, Search, Download, Printer } from "lucide-react"
import { InvoiceStatus } from "@/lib/types"

const statusColors: Record<InvoiceStatus, string> = { Draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400", Sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400", Paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", Overdue: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400", Cancelled: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400" }

export default function BillingPage() {
  const { invoices } = useData()
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const filtered = useMemo(() => {
    let result = [...invoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    if (search) { const s = search.toLowerCase(); result = result.filter(i => i.invoiceNumber.toLowerCase().includes(s) || i.customerName.toLowerCase().includes(s) || i.storeName.toLowerCase().includes(s)) }
    if (statusFilter !== "All") result = result.filter(i => i.status === statusFilter)
    return result
  }, [search, statusFilter, invoices])

  const totalInvoiced = invoices.reduce((s, i) => s + i.grandTotal, 0)
  const totalPaid = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.grandTotal, 0)
  const totalOverdue = invoices.filter(i => i.status === "Overdue").reduce((s, i) => s + i.grandTotal, 0)
  const totalPending = invoices.filter(i => i.status === "Sent").reduce((s, i) => s + i.grandTotal, 0)

  const handlePrint = (inv: typeof invoices[0]) => {
    generateInvoicePDF(inv)
    toast("success", "Invoice PDF Generated", `${inv.invoiceNumber} is ready to print`)
  }

  const handleDownload = (inv: typeof invoices[0]) => {
    generateInvoicePDF(inv)
    toast("success", "Invoice Downloaded", `${inv.invoiceNumber} has been downloaded`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><FileText className="w-6 h-6 text-[var(--primary)]" /> Billing & Invoices</h1><p className="text-sm text-[var(--muted-foreground)]">Manage GST invoices and payments</p></div>
        <Link href="/billing/new" className="inline-flex items-center gap-2 px-4 py-2.5 gradient-bg text-white rounded-xl font-medium text-sm hover:opacity-90 shadow-md"><Plus className="w-4 h-4" /> Create Invoice</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Invoiced", value: formatCurrency(totalInvoiced), color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" },
          { label: "Paid", value: formatCurrency(totalPaid), color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Pending", value: formatCurrency(totalPending), color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
          { label: "Overdue", value: formatCurrency(totalOverdue), color: "text-red-600 bg-red-50 dark:bg-red-900/20" },
        ].map(s => (
          <div key={s.label} className={`glass-card p-4 ${s.color}`}><p className="text-xs opacity-75">{s.label}</p><p className="text-xl font-bold mt-1">{s.value}</p></div>
        ))}
      </div>

      <div className="glass-card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices..." className="w-full pl-10 pr-4 py-2 bg-[var(--muted)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]" /></div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 bg-[var(--muted)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]">
          <option value="All">All Status</option>
          {["Draft","Sent","Paid","Overdue","Cancelled"].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[var(--muted)]">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Invoice #</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Customer</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden md:table-cell">Date</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden lg:table-cell">Due Date</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase hidden sm:table-cell">GST</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Total</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Status</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id} className="border-b border-[var(--border)] last:border-0 table-row-hover">
                  <td className="py-3 px-4"><Link href={`/billing/${inv.id}`} className="font-mono font-medium text-[var(--primary)] hover:underline">{inv.invoiceNumber}</Link></td>
                  <td className="py-3 px-4"><p className="font-medium text-foreground">{inv.customerName}</p><p className="text-xs text-[var(--muted-foreground)]">{inv.storeName}</p></td>
                  <td className="py-3 px-4 text-[var(--muted-foreground)] hidden md:table-cell">{formatDate(inv.date)}</td>
                  <td className="py-3 px-4 text-[var(--muted-foreground)] hidden lg:table-cell">{formatDate(inv.dueDate)}</td>
                  <td className="py-3 px-4 text-right hidden sm:table-cell">{formatCurrency(inv.gstAmount)}</td>
                  <td className="py-3 px-4 text-right font-bold">{formatCurrency(inv.grandTotal)}</td>
                  <td className="py-3 px-4 text-center"><span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[inv.status]}`}>{inv.status}</span></td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Link href={`/billing/${inv.id}`} className="p-1.5 rounded hover:bg-[var(--muted)] text-[var(--primary)] transition-colors" title="View"><FileText className="w-4 h-4" /></Link>
                      <button onClick={() => handlePrint(inv)} className="p-1.5 rounded hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors" title="Print"><Printer className="w-4 h-4" /></button>
                      <button onClick={() => handleDownload(inv)} className="p-1.5 rounded hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors" title="Download"><Download className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
